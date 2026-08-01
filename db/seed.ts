import { getDb } from "../api/queries/connection";
import { instruments } from "./schema";

const db = getDb();

const instrumentData = [
  { symbol: "EURUSD", name: "EUR/USD", category: "forex" as const, baseAsset: "EUR", quoteAsset: "USD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "GBPUSD", name: "GBP/USD", category: "forex" as const, baseAsset: "GBP", quoteAsset: "USD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "USDJPY", name: "USD/JPY", category: "forex" as const, baseAsset: "USD", quoteAsset: "JPY", pipSize: "0.01", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "AUDUSD", name: "AUD/USD", category: "forex" as const, baseAsset: "AUD", quoteAsset: "USD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "USDCAD", name: "USD/CAD", category: "forex" as const, baseAsset: "USD", quoteAsset: "CAD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "USDCHF", name: "USD/CHF", category: "forex" as const, baseAsset: "USD", quoteAsset: "CHF", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "NZDUSD", name: "NZD/USD", category: "forex" as const, baseAsset: "NZD", quoteAsset: "USD", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "EURGBP", name: "EUR/GBP", category: "forex" as const, baseAsset: "EUR", quoteAsset: "GBP", pipSize: "0.0001", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "AUDJPY", name: "AUD/JPY", category: "forex" as const, baseAsset: "AUD", quoteAsset: "JPY", pipSize: "0.01", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "GBPJPY", name: "GBP/JPY", category: "forex" as const, baseAsset: "GBP", quoteAsset: "JPY", pipSize: "0.01", lotSize: "100000", minLot: "0.01", maxLot: "100", leverageMax: 500 },
  { symbol: "BTCUSD", name: "Bitcoin / USD", category: "crypto" as const, baseAsset: "BTC", quoteAsset: "USD", pipSize: "0.01", lotSize: "1", minLot: "0.01", maxLot: "10", leverageMax: 100 },
  { symbol: "ETHUSD", name: "Ethereum / USD", category: "crypto" as const, baseAsset: "ETH", quoteAsset: "USD", pipSize: "0.01", lotSize: "1", minLot: "0.01", maxLot: "50", leverageMax: 100 },
  { symbol: "XRPUSD", name: "Ripple / USD", category: "crypto" as const, baseAsset: "XRP", quoteAsset: "USD", pipSize: "0.0001", lotSize: "1", minLot: "1", maxLot: "50000", leverageMax: 50 },
  { symbol: "LTCUSD", name: "Litecoin / USD", category: "crypto" as const, baseAsset: "LTC", quoteAsset: "USD", pipSize: "0.01", lotSize: "1", minLot: "0.1", maxLot: "500", leverageMax: 50 },
  { symbol: "SOLUSD", name: "Solana / USD", category: "crypto" as const, baseAsset: "SOL", quoteAsset: "USD", pipSize: "0.01", lotSize: "1", minLot: "0.1", maxLot: "1000", leverageMax: 50 },
  { symbol: "XAUUSD", name: "Gold / USD", category: "metals" as const, baseAsset: "XAU", quoteAsset: "USD", pipSize: "0.01", lotSize: "100", minLot: "0.01", maxLot: "50", leverageMax: 200 },
  { symbol: "XAGUSD", name: "Silver / USD", category: "metals" as const, baseAsset: "XAG", quoteAsset: "USD", pipSize: "0.001", lotSize: "5000", minLot: "0.01", maxLot: "100", leverageMax: 100 },
  { symbol: "US30", name: "US Wall Street 30", category: "indices" as const, baseAsset: "US30", quoteAsset: "USD", pipSize: "1", lotSize: "1", minLot: "0.01", maxLot: "50", leverageMax: 200 },
  { symbol: "US500", name: "US S&P 500", category: "indices" as const, baseAsset: "US500", quoteAsset: "USD", pipSize: "0.1", lotSize: "1", minLot: "0.01", maxLot: "100", leverageMax: 200 },
  { symbol: "USTEC", name: "US Tech 100 (NASDAQ)", category: "indices" as const, baseAsset: "USTEC", quoteAsset: "USD", pipSize: "0.1", lotSize: "1", minLot: "0.01", maxLot: "100", leverageMax: 200 },
  { symbol: "GER40", name: "Germany 40", category: "indices" as const, baseAsset: "GER40", quoteAsset: "EUR", pipSize: "0.1", lotSize: "1", minLot: "0.01", maxLot: "50", leverageMax: 200 },
  { symbol: "UK100", name: "UK 100", category: "indices" as const, baseAsset: "UK100", quoteAsset: "GBP", pipSize: "0.1", lotSize: "1", minLot: "0.01", maxLot: "50", leverageMax: 200 },
  { symbol: "OILUSD", name: "US Crude Oil", category: "commodities" as const, baseAsset: "OIL", quoteAsset: "USD", pipSize: "0.01", lotSize: "1000", minLot: "0.01", maxLot: "100", leverageMax: 100 },
  { symbol: "BRENTUSD", name: "Brent Crude Oil", category: "commodities" as const, baseAsset: "BRENT", quoteAsset: "USD", pipSize: "0.01", lotSize: "1000", minLot: "0.01", maxLot: "100", leverageMax: 100 },
  { symbol: "NGASUSD", name: "Natural Gas", category: "commodities" as const, baseAsset: "NGAS", quoteAsset: "USD", pipSize: "0.001", lotSize: "10000", minLot: "0.01", maxLot: "50", leverageMax: 50 },
];

async function seed() {
  console.log("Seeding instruments...");
  for (const inst of instrumentData) {
    await db.insert(instruments).values(inst).onDuplicateKeyUpdate({
      set: { name: inst.name, isActive: true },
    });
  }
  console.log(`Seeded ${instrumentData.length} instruments.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});