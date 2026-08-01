import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { instruments } from "@db/schema";
import { eq } from "drizzle-orm";

const priceCache: Record<number, { bid: number; ask: number; high24h: number; low24h: number; change24h: number; volume24h: number; ts: number }> = {};

async function fetchLivePrice(inst: typeof instruments.$inferSelect) {
  const now = Date.now();
  const cached = priceCache[inst.id];
  if (cached && now - cached.ts < 3000) return cached;

  let basePrice = 1.0;
  try {
    if (inst.category === "forex") {
      const resp = await fetch(`https://api.exchangerate-api.com/v4/latest/${inst.baseAsset}`, { cache: "no-store" });
      if (resp.ok) {
        const data = await resp.json();
        basePrice = data.rates?.[inst.quoteAsset] || basePrice;
      }
    } else if (inst.category === "crypto") {
      const coinMap: Record<string, string> = {
        BTC: "bitcoin",
        ETH: "ethereum",
        SOL: "solana",
        XRP: "ripple",
        ADA: "cardano",
        BNB: "binancecoin",
        DOGE: "dogecoin",
        AVAX: "avalanche-2",
        LINK: "chainlink",
        DOT: "polkadot"
      };
      const geckoId = coinMap[inst.baseAsset.toUpperCase()] || inst.baseAsset.toLowerCase();
      const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=${inst.quoteAsset.toLowerCase()}`, { cache: "no-store" });
      if (resp.ok) {
        const data = await resp.json();
        const p = data[geckoId]?.[inst.quoteAsset.toLowerCase()];
        if (typeof p === "number" && p > 0) {
          basePrice = p;
        } else {
          const fallbackCrypto: Record<string, number> = { BTC: 67420, ETH: 3480, SOL: 178, XRP: 0.58, ADA: 0.38, BNB: 580, DOGE: 0.12 };
          basePrice = fallbackCrypto[inst.baseAsset.toUpperCase()] || 67420;
        }
      } else {
        const fallbackCrypto: Record<string, number> = { BTC: 67420, ETH: 3480, SOL: 178, XRP: 0.58, ADA: 0.38, BNB: 580, DOGE: 0.12 };
        basePrice = fallbackCrypto[inst.baseAsset.toUpperCase()] || 67420;
      }
    } else {
      const fallbackPrices: Record<string, number> = {
        XAUUSD: 2650.0, XAGUSD: 31.5,
        US30: 42500, US500: 5850, USTEC: 20500, GER40: 18500, UK100: 8250,
        OILUSD: 72.5, BRENTUSD: 76.2, NGASUSD: 3.25,
      };
      basePrice = fallbackPrices[inst.symbol] || basePrice;
    }
  } catch {
    basePrice = cached?.bid || 1.0;
  }

  const spread = inst.category === "forex" ? 0.0002 : inst.category === "crypto" ? basePrice * 0.001 : basePrice * 0.0005;
  const noise = (Math.random() - 0.5) * spread * 0.5;
  const bid = basePrice + noise;
  const ask = bid + spread;
  const change24h = cached ? cached.change24h + (Math.random() - 0.48) * spread * 0.3 : (Math.random() - 0.5) * basePrice * 0.02;
  const high24h = Math.max(bid, cached?.high24h || bid * 1.01);
  const low24h = Math.min(bid, cached?.low24h || bid * 0.99);
  const volume24h = (cached?.volume24h || 1000000) + Math.random() * 50000;

  priceCache[inst.id] = { bid, ask, high24h, low24h, change24h, volume24h, ts: now };
  return priceCache[inst.id];
}

export const marketRouter = createRouter({
  instruments: publicQuery
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const where = input?.category ? eq(instruments.category, input.category as any) : undefined;
      return db.select().from(instruments).where(where);
    }),

  livePrices: publicQuery
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const where = input?.category ? eq(instruments.category, input.category as any) : undefined;
      let insts = await db.select().from(instruments).where(where);
      if (insts.length === 0) {
        const defaultSeeds = [
          { symbol: "EURUSD", name: "EUR/USD", category: "forex" as const, baseAsset: "EUR", quoteAsset: "USD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
          { symbol: "GBPUSD", name: "GBP/USD", category: "forex" as const, baseAsset: "GBP", quoteAsset: "USD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
          { symbol: "USDJPY", name: "USD/JPY", category: "forex" as const, baseAsset: "USD", quoteAsset: "JPY", pipSize: "0.01", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
          { symbol: "AUDUSD", name: "AUD/USD", category: "forex" as const, baseAsset: "AUD", quoteAsset: "USD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
          { symbol: "BTCUSD", name: "Bitcoin / USD", category: "crypto" as const, baseAsset: "BTC", quoteAsset: "USD", pipSize: "0.01", lotSize: "1", minLot: "0.01", maxLot: "10", leverageMax: 100 },
          { symbol: "ETHUSD", name: "Ethereum / USD", category: "crypto" as const, baseAsset: "ETH", quoteAsset: "USD", pipSize: "0.01", lotSize: "1", minLot: "0.01", maxLot: "50", leverageMax: 100 },
          { symbol: "XAUUSD", name: "Gold / USD", category: "metals" as const, baseAsset: "XAU", quoteAsset: "USD", pipSize: "0.01", lotSize: "100", minLot: "0.01", maxLot: "50", leverageMax: 200 },
          { symbol: "US30", name: "US Wall Street 30", category: "indices" as const, baseAsset: "US30", quoteAsset: "USD", pipSize: "1", lotSize: "1", minLot: "0.01", maxLot: "50", leverageMax: 200 },
          { symbol: "OILUSD", name: "US Crude Oil", category: "commodities" as const, baseAsset: "OIL", quoteAsset: "USD", pipSize: "0.01", lotSize: "1000", minLot: "0.01", maxLot: "100", leverageMax: 100 }
        ];
        for (const item of defaultSeeds) {
          try {
            await db.insert(instruments).values(item);
          } catch {}
        }
        insts = await db.select().from(instruments).where(where);
      }
      const prices = await Promise.all(insts.map(async (inst) => {
        const live = await fetchLivePrice(inst);
        return {
          instrument: inst,
          bid: live.bid.toFixed(inst.pipSize === "0.01" ? 2 : inst.pipSize === "0.001" ? 3 : 4),
          ask: live.ask.toFixed(inst.pipSize === "0.01" ? 2 : inst.pipSize === "0.001" ? 3 : 4),
          spread: (live.ask - live.bid).toFixed(5),
          change24h: live.change24h.toFixed(2),
          change24hPercent: ((live.change24h / (live.bid - live.change24h)) * 100).toFixed(2),
          high24h: live.high24h.toFixed(inst.pipSize === "0.01" ? 2 : inst.pipSize === "0.001" ? 3 : 4),
          low24h: live.low24h.toFixed(inst.pipSize === "0.01" ? 2 : inst.pipSize === "0.001" ? 3 : 4),
          volume24h: Math.floor(live.volume24h).toString(),
          timestamp: live.ts,
        };
      }));
      return prices;
    }),
});