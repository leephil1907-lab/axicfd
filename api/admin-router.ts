import { z } from "zod";
import { createRouter, adminQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { users, tradingAccounts, positions, orders, tradeHistory, instruments, transactions, marketNews, systemSettings, kycVerifications, adminAuditLogs, supportMessages } from "@db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { sendTelegramConfirmation, notifyKycStatusUpdate } from "./telegram-service.js";

export const adminRouter = createRouter({
  testTelegramNotification: adminQuery.mutation(async () => {
    const success = await sendTelegramConfirmation();
    return { success };
  }),

  getAuditLogs: adminQuery
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const logs = await db
        .select()
        .from(adminAuditLogs)
        .orderBy(desc(adminAuditLogs.timestamp))
        .limit(input?.limit || 50);
      return logs;
    }),

  analytics: adminQuery.query(async () => {
    const db = getDb();
    const [userCount] = await db.select({ count: count() }).from(users);
    const [accountCount] = await db.select({ count: count() }).from(tradingAccounts);
    const [positionCount] = await db.select({ count: count() }).from(positions).where(eq(positions.status, "open"));
    const [orderCount] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "pending"));
    const volumeResult = await db.select({ total: sql<string>`COALESCE(SUM(${tradeHistory.volume}), 0)` }).from(tradeHistory);
    const pnlResult = await db.select({
      totalNetPnl: sql<string>`COALESCE(SUM(${tradeHistory.netPnl}), 0)`,
      totalGrossPnl: sql<string>`COALESCE(SUM(${tradeHistory.grossPnl}), 0)`,
      totalCommission: sql<string>`COALESCE(SUM(${tradeHistory.commission}), 0)`,
    }).from(tradeHistory);
    const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(10);
    return { counts: { users: userCount.count, accounts: accountCount.count, openPositions: positionCount.count, pendingOrders: orderCount.count }, volume: volumeResult[0]?.total || "0", pnl: { net: pnlResult[0]?.totalNetPnl || "0", gross: pnlResult[0]?.totalGrossPnl || "0", commission: pnlResult[0]?.totalCommission || "0" }, recentUsers };
  }),

  users: adminQuery
    .input(z.object({ page: z.number().default(1), limit: z.number().default(50), search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 50;
      const offset = (page - 1) * limit;
      const userList = await db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
      const [totalResult] = await db.select({ count: count() }).from(users);

      // Attach trading accounts
      const enrichedUsers = await Promise.all(
        userList.map(async (u) => {
          const accs = await db.select().from(tradingAccounts).where(eq(tradingAccounts.userId, u.id));
          return {
            ...u,
            tradingAccount: accs[0] || null,
          };
        })
      );

      return { users: enrichedUsers, total: totalResult.count, page, limit };
    }),

  updateUserRole: adminQuery
    .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      
      await db.insert(adminAuditLogs).values({
        adminEmail: ctx.user?.email || "admin@system",
        action: "UPDATE_USER_ROLE",
        targetUserId: input.userId,
        details: `Role updated to ${input.role}`,
      });

      return { success: true };
    }),

  adjustUserBalance: adminQuery
    .input(z.object({ userId: z.number(), amount: z.number(), reason: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [acc] = await db.select().from(tradingAccounts).where(eq(tradingAccounts.userId, input.userId));
      if (!acc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User trading account not found" });
      }

      const currentBalance = parseFloat(acc.balance.toString());
      const newBalance = Math.max(0, currentBalance + input.amount);

      await db.update(tradingAccounts)
        .set({ balance: newBalance.toFixed(8), equity: newBalance.toFixed(8) })
        .where(eq(tradingAccounts.id, acc.id));

      await db.insert(adminAuditLogs).values({
        adminEmail: ctx.user?.email || "admin@system",
        action: "BALANCE_ADJUSTMENT",
        targetUserId: input.userId,
        details: `Adjusted balance by ${input.amount > 0 ? '+' : ''}${input.amount} USD. Reason: ${input.reason}. Previous balance: $${currentBalance.toFixed(2)}, New balance: $${newBalance.toFixed(2)}`,
      });

      return { success: true, newBalance };
    }),

  allPositions: adminQuery
    .input(z.object({ status: z.enum(["open", "closed", "liquidated"]).optional(), page: z.number().default(1), limit: z.number().default(50) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const where = input?.status ? eq(positions.status, input.status) : undefined;
      const posList = await db.select().from(positions).where(where).orderBy(desc(positions.openedAt)).limit(input?.limit || 50).offset(((input?.page || 1) - 1) * (input?.limit || 50));
      const [totalResult] = await db.select({ count: count() }).from(positions).where(where);
      return { positions: posList, total: totalResult.count, page: input?.page || 1, limit: input?.limit || 50 };
    }),

  allTrades: adminQuery
    .input(z.object({ page: z.number().default(1), limit: z.number().default(50) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const trades = await db.select().from(tradeHistory).orderBy(desc(tradeHistory.closedAt)).limit(input?.limit || 50).offset(((input?.page || 1) - 1) * (input?.limit || 50));
      const [totalResult] = await db.select({ count: count() }).from(tradeHistory);
      return { trades, total: totalResult.count, page: input?.page || 1, limit: input?.limit || 50 };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const [userCount] = await db.select({ count: count() }).from(users);
    const [accountCount] = await db.select({ count: count() }).from(tradingAccounts);
    const [positionCount] = await db.select({ count: count() }).from(positions).where(eq(positions.status, "open"));
    
    const txs = await db.select().from(transactions);
    const totalDeposits = txs
      .filter((t: any) => t.type === "deposit" && t.status === "completed")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    const totalWithdrawals = txs
      .filter((t: any) => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    return {
      totalUsers: userCount.count,
      activeAccounts: accountCount.count,
      openPositions: positionCount.count,
      totalDeposits,
      totalWithdrawals
    };
  }),

  deposits: adminQuery.query(async () => {
    const db = getDb();
    const txs = await db.select().from(transactions);
    return txs.filter((t: any) => t.type === "deposit");
  }),

  withdrawals: adminQuery.query(async () => {
    const db = getDb();
    const txs = await db.select().from(transactions);
    return txs.filter((t: any) => t.type === "withdrawal");
  }),

  approveWithdrawal: adminQuery
    .input(z.object({ transactionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [tx] = await db.select().from(transactions).where(eq(transactions.id, input.transactionId));
      if (!tx) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" });
      }

      if (tx.status !== "pending") {
        return { success: true, message: "Transaction already processed" };
      }

      const [acc] = await db.select().from(tradingAccounts).where(eq(tradingAccounts.id, tx.accountId));
      if (acc) {
        const amount = parseFloat(tx.amount.toString());
        const currentBalance = parseFloat(acc.balance.toString());
        const currentEquity = parseFloat(acc.equity.toString());

        let newBalance = currentBalance;
        let newEquity = currentEquity;

        if (tx.type === "deposit") {
          newBalance = currentBalance + amount;
          newEquity = currentEquity + amount;
        } else if (tx.type === "withdrawal") {
          newBalance = currentBalance - amount;
          newEquity = currentEquity - amount;
        }

        await db.update(tradingAccounts)
          .set({ 
            balance: newBalance.toFixed(8), 
            equity: newEquity.toFixed(8) 
          })
          .where(eq(tradingAccounts.id, acc.id));
      }

      await db.update(transactions)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(transactions.id, input.transactionId));

      await db.insert(adminAuditLogs).values({
        adminEmail: ctx.user?.email || "admin@system",
        action: tx.type === "deposit" ? "APPROVE_DEPOSIT" : "APPROVE_WITHDRAWAL",
        targetUserId: tx.userId,
        details: `Approved transaction #${tx.id} (${tx.type}) for $${tx.amount} ${tx.currency}`,
      });

      return { success: true };
    }),

  rejectWithdrawal: adminQuery
    .input(z.object({ transactionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [tx] = await db.select().from(transactions).where(eq(transactions.id, input.transactionId));
      if (!tx) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" });
      }

      await db.update(transactions)
        .set({ status: "failed" })
        .where(eq(transactions.id, input.transactionId));

      await db.insert(adminAuditLogs).values({
        adminEmail: ctx.user?.email || "admin@system",
        action: tx.type === "deposit" ? "REJECT_DEPOSIT" : "REJECT_WITHDRAWAL",
        targetUserId: tx.userId,
        details: `Rejected transaction #${tx.id} (${tx.type}) for $${tx.amount} ${tx.currency}`,
      });

      return { success: true };
    }),

  updateBankDetails: adminQuery
    .input(z.object({
      bankName: z.string().optional(),
      beneficiary: z.string().optional(),
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      phoneNumber: z.string().optional(),
      iban: z.string().optional(),
      swift: z.string().optional(),
      referencePrefix: z.string().default("AXI-"),
      cryptoWalletAddress: z.string().optional(),
      qrCodeUrl: z.string().optional(),
      cryptoWallets: z.record(z.object({
        address: z.string(),
        qrCodeUrl: z.string().optional(),
        tag: z.string().optional(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const valueStr = JSON.stringify(input);
      const existing = await db.select().from(systemSettings).where(eq(systemSettings.key, "bank_details"));
      if (existing[0]) {
        await db.update(systemSettings)
          .set({ value: valueStr, updatedAt: new Date() })
          .where(eq(systemSettings.key, "bank_details"));
      } else {
        await db.insert(systemSettings).values({
          key: "bank_details",
          value: valueStr,
          updatedAt: new Date(),
        });
      }

      await db.insert(adminAuditLogs).values({
        adminEmail: ctx.user?.email || "admin@system",
        action: "UPDATE_BANK_DETAILS",
        details: `Updated system deposit bank and wallet configuration.`,
      });

      return { success: true };
    }),

  getKycRequests: adminQuery.query(async () => {
    const db = getDb();
    const requests = await db
      .select()
      .from(kycVerifications)
      .orderBy(desc(kycVerifications.submittedAt));
    return requests;
  }),

  approveKyc: adminQuery
    .input(z.object({ kycId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const records = await db
        .select()
        .from(kycVerifications)
        .where(eq(kycVerifications.id, input.kycId));

      if (!records || !records[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "KYC request not found" });
      }

      const rec = records[0];

      await db
        .update(kycVerifications)
        .set({ status: "approved", reviewedAt: new Date() })
        .where(eq(kycVerifications.id, input.kycId));

      // Dispatch Telegram alert
      notifyKycStatusUpdate(rec.userEmail, "approved");

      await db.insert(adminAuditLogs).values({
        adminEmail: ctx.user?.email || "admin@system",
        action: "APPROVE_KYC",
        targetUserId: rec.userId,
        targetEmail: rec.userEmail,
        details: `Approved KYC application for ${rec.fullName} (${rec.userEmail})`,
      });

      return { success: true };
    }),

  rejectKyc: adminQuery
    .input(z.object({ kycId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const records = await db
        .select()
        .from(kycVerifications)
        .where(eq(kycVerifications.id, input.kycId));

      if (!records || !records[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "KYC request not found" });
      }

      const rec = records[0];

      await db
        .update(kycVerifications)
        .set({
          status: "rejected",
          rejectionReason: input.reason || "Documents failed validation",
          reviewedAt: new Date(),
        })
        .where(eq(kycVerifications.id, input.kycId));

      // Dispatch Telegram alert
      notifyKycStatusUpdate(rec.userEmail, "rejected", input.reason);

      await db.insert(adminAuditLogs).values({
        adminEmail: ctx.user?.email || "admin@system",
        action: "REJECT_KYC",
        targetUserId: rec.userId,
        targetEmail: rec.userEmail,
        details: `Rejected KYC for ${rec.fullName} (${rec.userEmail}). Reason: ${input.reason || "Documents failed validation"}`,
      });

      return { success: true };
    }),

  // ── Support Chat Admin Management ─────────────────
  getSupportMessages: adminQuery
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.userId) {
        const msgs = await db.select()
          .from(supportMessages)
          .where(eq(supportMessages.userId, input.userId))
          .orderBy(desc(supportMessages.createdAt));
        return msgs;
      }
      const msgs = await db.select()
        .from(supportMessages)
        .orderBy(desc(supportMessages.createdAt))
        .limit(100);
      return msgs;
    }),

  replySupportMessage: adminQuery
    .input(z.object({
      userId: z.number(),
      message: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const adminEmail = ctx.user?.email || "admin@axi.com";

      const [msg] = await db.insert(supportMessages).values({
        userId: input.userId,
        userName: "Axi Live Support",
        userEmail: adminEmail,
        sender: "admin",
        message: input.message,
        transferredToAdmin: true,
        createdAt: new Date(),
      }).returning();

      await db.insert(adminAuditLogs).values({
        adminEmail,
        action: "SUPPORT_CHAT_REPLY",
        targetUserId: input.userId,
        details: `Replied to user support message: "${input.message.slice(0, 50)}..."`,
      });

      return { success: true, message: msg };
    }),
});