import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { marketNews } from "@db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

// ── Market News & Calendar Router ─────────────────────────
export const newsRouter = createRouter({
  // Get latest market news
  latest: publicQuery
    .input(z.object({ 
      category: z.string().optional(),
      symbol: z.string().optional(),
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const categoryQuery = input?.category ? ` focused on ${input.category}` : "";
          const symbolQuery = input?.symbol ? ` and specifically relevant to the asset ${input.symbol}` : "";
          const prompt = `Search the web for the latest, real-time global financial news, macroeconomic events, or central bank announcements${categoryQuery}${symbolQuery} relevant to forex, crypto, indices, and commodity trading.
Return a list of exactly 6 news articles. 
For each article, provide:
1. Title: A compelling headline.
2. Summary: A detailed 2-3 sentence summary of the news and its impact on financial markets.
3. Source: The news source (e.g. Bloomberg, Reuters, Financial Times, Wall Street Journal).
4. Category: One of: Forex, Cryptocurrencies, Commodities, Indices, Shares.
5. Impact: One of: high, medium, low.
6. Symbol: A financial symbol it affects (e.g., EURUSD, BTCUSD, XAUUSD, US30, GBPUSD).
7. PublishedAt: Current ISO timestamp.

Format the output strictly as a JSON array of objects with the fields: title, summary, source, category, impact, symbol, publishedAt. Do not include markdown code blocks or any other explanation, only the raw JSON array.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
              tools: [{ googleSearch: {} }],
              responseMimeType: "application/json"
            }
          });

          const text = response.text || "";
          const jsonStr = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
          const parsed = JSON.parse(jsonStr);

          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, idx) => ({
              id: `realtime-${idx}-${Date.now()}`,
              title: item.title || "Market Update",
              summary: item.summary || "Latest market movements and analysis.",
              source: item.source || "Axi News Feed",
              category: item.category || "Forex",
              publishedAt: item.publishedAt || new Date().toISOString(),
              impact: item.impact || "medium",
              symbol: item.symbol || input?.symbol || "EURUSD",
            }));
          }
        } catch (err) {
          console.error("Failed to fetch real-time news via Gemini search grounding:", err);
        }
      }

      // Database fallback
      try {
        const db = getDb();
        const limit = input?.limit || 10;
        const offset = input?.offset || 0;

        let where = undefined;
        if (input?.category) {
          where = eq(marketNews.category, input.category);
        }

        const dbNews = await db.select()
          .from(marketNews)
          .where(where)
          .orderBy(desc(marketNews.publishedAt))
          .limit(limit)
          .offset(offset);

        if (dbNews && dbNews.length > 0) {
          return dbNews;
        }
      } catch (dbErr) {
        console.error("Database news query failed:", dbErr);
      }

      // Hardcoded high-quality financial headlines fallback
      const mockNewsFallbacks = [
        {
          id: "m1",
          title: "Fed Signals Strategic Patience on Rates Amid Core Inflation Easing",
          summary: "Federal Reserve officials indicated they are in no rush to ease monetary policy further, opting for strategic patience as core inflation slowly stabilizes toward the 2% target.",
          source: "Bloomberg",
          category: "Forex",
          publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          impact: "high",
          symbol: "EURUSD"
        },
        {
          id: "m2",
          title: "Bitcoin Surges Above Key Resistance Level Driven by Spot ETF Inflows",
          summary: "Bitcoin rallied sharply, clearing critical overhead resistance as institutional inflows into spot Exchange Traded Funds hit a multi-week high of $420 million.",
          source: "Reuters",
          category: "Cryptocurrencies",
          publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          impact: "high",
          symbol: "BTCUSD"
        },
        {
          id: "m3",
          title: "Gold Tests New Record Highs on Rising Safe-Haven and Central Bank Buying",
          summary: "Spot gold surged near historic highs, driven by continuous central bank reserves diversification and safe-haven accumulation amid heightened geopolitical tensions.",
          source: "Financial Times",
          category: "Commodities",
          publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          impact: "high",
          symbol: "XAUUSD"
        },
        {
          id: "m4",
          title: "S&P 500 and Dow Jones Consolidate Gains Ahead of Major Tech Earnings",
          summary: "US stock indices traded in a tight range as investors braced for heavyweight earnings reports from Microsoft, Alphabet, and Meta to justify current premium valuations.",
          source: "CNBC",
          category: "Indices",
          publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          impact: "medium",
          symbol: "US30"
        },
        {
          id: "m5",
          title: "Oil Steady Near $78 as OPEC+ Confirms Extension of Production Volatility Controls",
          summary: "Brent crude stabilized after OPEC+ members agreed to extend voluntary output reductions, neutralizing immediate concerns of a global demand slow-down.",
          source: "Wall Street Journal",
          category: "Commodities",
          publishedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          impact: "medium",
          symbol: "OILUSD"
        },
        {
          id: "m6",
          title: "British Pound Fluctuates as Bank of England Holds Hawkish Interest Tone",
          summary: "Sterling saw high volatility after BoE policymakers voted to keep interest rates steady, maintaining a hawkish tone regarding services sector inflation sticky-points.",
          source: "Bloomberg",
          category: "Forex",
          publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          impact: "medium",
          symbol: "GBPUSD"
        },
        {
          id: "m7",
          title: "Yen Gains Ground on Bank of Japan Policy Shifting Whispers",
          summary: "The Japanese Yen strengthened across major FX pairs as speculations of active Bank of Japan interventions and near-term rate hikes intensified among market analysts.",
          source: "Bloomberg",
          category: "Forex",
          publishedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          impact: "medium",
          symbol: "USDJPY"
        },
        {
          id: "m8",
          title: "Australian Dollar Rallies on Stronger Inflation and RBA Policy Stance",
          summary: "The Aussie Dollar rallied following higher-than-expected quarterly inflation indicators, fueling forecasts that the Reserve Bank of Australia will keep rates elevated longer.",
          source: "Reuters",
          category: "Forex",
          publishedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          impact: "medium",
          symbol: "AUDUSD"
        },
        {
          id: "m9",
          title: "Ethereum Network Activity Surges as Layer 2 Scaling Hits Record Volumes",
          summary: "Ethereum prices consolidated gains as gas-fee optimization and high layer-2 scalability triggered peak dApp deployment and smart-contract interactions across the mainnet.",
          source: "CoinDesk",
          category: "Cryptocurrencies",
          publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          impact: "medium",
          symbol: "ETHUSD"
        },
        {
          id: "m10",
          title: "Global Equities Rally as Inflation Moderation Excites Global Markets",
          summary: "Major equity benchmarks in Europe and Asia advanced steadily, following positive sentiment that global inflation is converging smoothly to target rates without hurting labor dynamics.",
          source: "Financial Times",
          category: "Indices",
          publishedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
          impact: "low",
          symbol: "GER40"
        }
      ];

      if (input?.symbol) {
        const filtered = mockNewsFallbacks.filter(n => n.symbol.toUpperCase() === input.symbol!.toUpperCase());
        if (filtered.length > 0) return filtered;
      }
      if (input?.category) {
        return mockNewsFallbacks.filter(n => n.category.toLowerCase() === input.category!.toLowerCase());
      }
      return mockNewsFallbacks;
    }),

  // Get news by category
  byCategory: publicQuery
    .input(z.object({ 
      category: z.string(),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select()
        .from(marketNews)
        .where(eq(marketNews.category, input.category))
        .orderBy(desc(marketNews.publishedAt))
        .limit(input.limit);
    }),

  // Search news
  search: publicQuery
    .input(z.object({ 
      query: z.string(),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select()
        .from(marketNews)
        .where(sql`${marketNews.title} LIKE ${'%' + input.query + '%'} OR ${marketNews.summary} LIKE ${'%' + input.query + '%'}`)
        .orderBy(desc(marketNews.publishedAt))
        .limit(input.limit);
    }),

  // ── Economic Calendar ───────────────────────────────────
  calendar: publicQuery
    .input(z.object({ 
      date: z.string().optional(), // YYYY-MM-DD
      currency: z.string().optional(),
      impact: z.enum(["high", "medium", "low"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      // Mock economic calendar data - in production, integrate with real API
      const today = input?.date || new Date().toISOString().split('T')[0];

      const events = [
        { time: "08:30", currency: "USD", impact: "high" as const, title: "Non-Farm Payrolls", forecast: "185K", previous: "175K", actual: "192K", date: today },
        { time: "10:00", currency: "EUR", impact: "medium" as const, title: "ECB Interest Rate Decision", forecast: "4.50%", previous: "4.50%", actual: null, date: today },
        { time: "14:30", currency: "USD", impact: "high" as const, title: "Fed Chair Powell Speech", forecast: "-", previous: "-", actual: null, date: today },
        { time: "16:00", currency: "GBP", impact: "low" as const, title: "Manufacturing PMI", forecast: "46.2", previous: "45.8", actual: null, date: today },
        { time: "07:00", currency: "EUR", impact: "medium" as const, title: "German GDP QoQ", forecast: "0.1%", previous: "0.0%", actual: "0.2%", date: today },
        { time: "09:00", currency: "JPY", impact: "high" as const, title: "BOJ Policy Rate", forecast: "0.10%", previous: "0.10%", actual: null, date: today },
        { time: "13:30", currency: "CAD", impact: "medium" as const, title: "Employment Change", forecast: "15.0K", previous: "12.5K", actual: null, date: today },
        { time: "15:00", currency: "USD", impact: "low" as const, title: "Factory Orders", forecast: "0.5%", previous: "0.3%", actual: null, date: today },
      ];

      let filtered = events;
      if (input?.currency) filtered = filtered.filter(e => e.currency === input.currency);
      if (input?.impact) filtered = filtered.filter(e => e.impact === input.impact);

      return filtered;
    }),

  // ── Market Analysis ─────────────────────────────────────
  analysis: publicQuery
    .input(z.object({ 
      symbol: z.string(),
      type: z.enum(["technical", "fundamental", "sentiment"]).default("technical"),
    }))
    .query(async ({ input }) => {
      // Mock analysis - in production, integrate with real analysis API
      const analyses: Record<string, any> = {
        EURUSD: {
          technical: {
            trend: "bullish",
            support: [1.0850, 1.0800, 1.0750],
            resistance: [1.0950, 1.1000, 1.1050],
            indicators: [
              { name: "RSI (14)", value: 62.5, signal: "neutral" },
              { name: "MACD", value: 0.0025, signal: "buy" },
              { name: "MA 20", value: 1.0880, signal: "buy" },
              { name: "MA 50", value: 1.0850, signal: "buy" },
            ],
            summary: "EUR/USD is showing bullish momentum with price above both 20 and 50 period moving averages. MACD is positive and RSI is in neutral territory, suggesting room for further upside.",
          },
          fundamental: {
            drivers: [
              "Dovish Fed expectations supporting EUR",
              "ECB maintaining hawkish stance",
              "US economic data showing mixed signals",
            ],
            outlook: "bullish",
            keyEvents: ["Fed Meeting (next week)", "ECB Rate Decision (in 2 weeks)", "US CPI Data"],
          },
          sentiment: {
            retail: 65,
            institutional: 72,
            overall: "bullish",
          },
        },
        GBPUSD: {
          technical: {
            trend: "bearish",
            support: [1.2650, 1.2600, 1.2550],
            resistance: [1.2750, 1.2800, 1.2850],
            indicators: [
              { name: "RSI (14)", value: 38.2, signal: "neutral" },
              { name: "MACD", value: -0.0015, signal: "sell" },
              { name: "MA 20", value: 1.2720, signal: "sell" },
              { name: "MA 50", value: 1.2780, signal: "sell" },
            ],
            summary: "GBP/USD is under pressure with price below key moving averages. MACD is negative and RSI is approaching oversold territory. Watch for potential bounce at 1.2650 support.",
          },
          fundamental: {
            drivers: [
              "BoE dovish pivot weighing on GBP",
              "UK economic growth concerns",
              "USD strength on safe-haven flows",
            ],
            outlook: "bearish",
            keyEvents: ["BoE Meeting", "UK GDP Data", "US NFP Release"],
          },
          sentiment: {
            retail: 42,
            institutional: 35,
            overall: "bearish",
          },
        },
        XAUUSD: {
          technical: {
            trend: "bullish",
            support: [2620, 2600, 2580],
            resistance: [2680, 2700, 2720],
            indicators: [
              { name: "RSI (14)", value: 68.3, signal: "neutral" },
              { name: "MACD", value: 5.2, signal: "buy" },
              { name: "MA 20", value: 2635, signal: "buy" },
              { name: "MA 50", value: 2610, signal: "buy" },
            ],
            summary: "Gold is trading near all-time highs with strong bullish momentum. Price is well above both moving averages and MACD is strongly positive. Watch for potential profit-taking near 2700 resistance.",
          },
          fundamental: {
            drivers: [
              "Inflation concerns driving safe-haven demand",
              "Central bank gold purchases increasing",
              "Geopolitical tensions supporting gold",
            ],
            outlook: "bullish",
            keyEvents: ["US CPI Data", "Fed Minutes", "Geopolitical Developments"],
          },
          sentiment: {
            retail: 78,
            institutional: 82,
            overall: "strongly_bullish",
          },
        },
      };

      return analyses[input.symbol] || {
        technical: {
          trend: "neutral",
          support: [],
          resistance: [],
          indicators: [],
          summary: "No analysis available for this instrument.",
        },
        fundamental: {
          drivers: [],
          outlook: "neutral",
          keyEvents: [],
        },
        sentiment: {
          retail: 50,
          institutional: 50,
          overall: "neutral",
        },
      };
    }),

  // ── Price Alerts ────────────────────────────────────────
  // In a real implementation, this would use WebSockets or push notifications
  priceAlerts: publicQuery
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input }) => {
      return {
        symbol: input.symbol,
        alerts: [],
        message: "Price alerts feature requires WebSocket implementation",
      };
    }),
});
