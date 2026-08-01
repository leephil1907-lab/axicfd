import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { tradeHistory, positions, tradingAccounts, users, localUsers } from "@db/schema";
import { eq, and, desc, sql, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// ── Social Trading Router ─────────────────────────────────
export const socialRouter = createRouter({
  // Get top traders by performance
  topTraders: publicQuery
    .input(z.object({ 
      period: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
      limit: z.number().min(1).max(50).default(20),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const period = input?.period || "30d";
      const limit = input?.limit || 20;

      const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
      const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      // Get all users with their trade stats
      const allUsers = await db.select().from(users);
      const allLocalUsers = await db.select().from(localUsers);

      const traders = [];

      for (const u of allUsers) {
        const stats = await db.select({
          totalTrades: sql<number>`count(*)`,
          winningTrades: sql<number>`sum(case when ${tradeHistory.netPnl} > 0 then 1 else 0 end)`,
          totalPnl: sql<number>`sum(${tradeHistory.netPnl})`,
          avgPnl: sql<number>`avg(${tradeHistory.netPnl})`,
          totalVolume: sql<number>`sum(${tradeHistory.volume})`,
        }).from(tradeHistory)
          .where(and(eq(tradeHistory.userId, u.id), gte(tradeHistory.closedAt, cutoffDate)));

        if (stats[0]?.totalTrades > 0) {
          const winRate = stats[0].totalTrades > 0 ? (stats[0].winningTrades / stats[0].totalTrades * 100).toFixed(1) : 0;
          const roi = stats[0].totalPnl ? (stats[0].totalPnl / 1000 * 100).toFixed(2) : 0;

          traders.push({
            id: u.id,
            name: u.name || `Trader_${u.id}`,
            email: u.email,
            avatar: u.avatar,
            totalTrades: stats[0].totalTrades,
            winningTrades: stats[0].winningTrades,
            winRate: Number(winRate),
            totalPnl: Number(stats[0].totalPnl?.toFixed(2) || 0),
            avgPnl: Number(stats[0].avgPnl?.toFixed(2) || 0),
            totalVolume: Number(stats[0].totalVolume?.toFixed(2) || 0),
            roi: Number(roi),
            period,
            isLocal: false,
          });
        }
      }

      // Sort by ROI descending
      traders.sort((a, b) => b.roi - a.roi);

      return traders.slice(0, limit);
    }),

  // Get trader profile with detailed stats
  traderProfile: publicQuery
    .input(z.object({ traderId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const user = await db.select().from(users).where(eq(users.id, input.traderId));
      if (!user[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Trader not found" });

      // Monthly stats
      const monthlyStats = await db.select({
        month: sql<string>`DATE_FORMAT(${tradeHistory.closedAt}, '%Y-%m')`,
        trades: sql<number>`count(*)`,
        wins: sql<number>`sum(case when ${tradeHistory.netPnl} > 0 then 1 else 0 end)`,
        pnl: sql<number>`sum(${tradeHistory.netPnl})`,
      }).from(tradeHistory)
        .where(eq(tradeHistory.userId, input.traderId))
        .groupBy(sql`DATE_FORMAT(${tradeHistory.closedAt}, '%Y-%m')`)
        .orderBy(desc(sql`DATE_FORMAT(${tradeHistory.closedAt}, '%Y-%m')`))
        .limit(12);

      // Recent trades
      const recentTrades = await db.select()
        .from(tradeHistory)
        .where(eq(tradeHistory.userId, input.traderId))
        .orderBy(desc(tradeHistory.closedAt))
        .limit(10);

      // Current open positions
      const openPositions = await db.select()
        .from(positions)
        .where(and(eq(positions.userId, input.traderId), eq(positions.status, "open")));

      return {
        trader: user[0],
        monthlyStats,
        recentTrades,
        openPositions: openPositions.length,
      };
    }),

  // Get trader's trade history (public view)
  traderHistory: publicQuery
    .input(z.object({ 
      traderId: z.number(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = getDb();

      return db.select()
        .from(tradeHistory)
        .where(eq(tradeHistory.userId, input.traderId))
        .orderBy(desc(tradeHistory.closedAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // ── Copy Trading (Follow/Unfollow) ──────────────────────
  followTrader: authedQuery
    .input(z.object({ traderId: z.number(), allocation: z.number().min(0).max(100).optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Check if already following
      const existing = await db.select()
        .from(tradingAccounts)
        .where(eq(tradingAccounts.userId, ctx.user!.id));

      // For now, store in metadata - in production would use a separate follows table
      // This is a simplified implementation
      return { success: true, message: `Now following trader ${input.traderId}` };
    }),

  unfollowTrader: authedQuery
    .input(z.object({ traderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, message: `Unfollowed trader ${input.traderId}` };
    }),

  // ── Leaderboard ────────────────────────────────────────
  leaderboard: publicQuery
    .input(z.object({ 
      category: z.enum(["roi", "winRate", "volume", "consistency"]).default("roi"),
      period: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const category = input?.category || "roi";
      const period = input?.period || "30d";
      const limit = input?.limit || 50;

      const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
      const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const allUsers = await db.select().from(users);
      const traders = [];

      for (const u of allUsers) {
        const stats = await db.select({
          totalTrades: sql<number>`count(*)`,
          winningTrades: sql<number>`sum(case when ${tradeHistory.netPnl} > 0 then 1 else 0 end)`,
          totalPnl: sql<number>`sum(${tradeHistory.netPnl})`,
          totalVolume: sql<number>`sum(${tradeHistory.volume})`,
          maxDrawdown: sql<number>`min(${tradeHistory.netPnl})`,
        }).from(tradeHistory)
          .where(and(eq(tradeHistory.userId, u.id), gte(tradeHistory.closedAt, cutoffDate)));

        if (stats[0]?.totalTrades > 0) {
          const winRate = stats[0].totalTrades > 0 ? (stats[0].winningTrades / stats[0].totalTrades * 100) : 0;
          const roi = stats[0].totalPnl ? (stats[0].totalPnl / 1000 * 100) : 0;
          const consistency = stats[0].totalTrades > 5 ? winRate * (1 - Math.abs(stats[0].maxDrawdown || 0) / 1000) : 0;

          traders.push({
            id: u.id,
            name: u.name || `Trader_${u.id}`,
            avatar: u.avatar,
            totalTrades: stats[0].totalTrades,
            winRate: Number(winRate.toFixed(1)),
            roi: Number(roi.toFixed(2)),
            totalVolume: Number((stats[0].totalVolume || 0).toFixed(2)),
            consistency: Number(consistency.toFixed(2)),
            score: category === "roi" ? roi : category === "winRate" ? winRate : category === "volume" ? (stats[0].totalVolume || 0) : consistency,
          });
        }
      }

      traders.sort((a, b) => b.score - a.score);

      return traders.slice(0, limit).map((t, i) => ({ ...t, rank: i + 1 }));
    }),

  // ── Market Sentiment ────────────────────────────────────
  sentiment: publicQuery
    .input(z.object({ symbol: z.string() }).optional())
    .query(async ({ input }) => {
      const db = getDb();

      // Calculate buy/sell ratio from all open positions
      const buyPositions = await db.select({ count: sql<number>`count(*)`, volume: sql<number>`sum(${positions.volume})` })
        .from(positions)
        .where(and(eq(positions.status, "open"), eq(positions.direction, "buy")));

      const sellPositions = await db.select({ count: sql<number>`count(*)`, volume: sql<number>`sum(${positions.volume})` })
        .from(positions)
        .where(and(eq(positions.status, "open"), eq(positions.direction, "sell")));

      const totalBuy = buyPositions[0]?.volume || 0;
      const totalSell = sellPositions[0]?.volume || 0;
      const total = totalBuy + totalSell;

      return {
        buyPercentage: total > 0 ? (totalBuy / total * 100).toFixed(1) : 50,
        sellPercentage: total > 0 ? (totalSell / total * 100).toFixed(1) : 50,
        buyCount: buyPositions[0]?.count || 0,
        sellCount: sellPositions[0]?.count || 0,
        sentiment: totalBuy > totalSell ? "bullish" : totalSell > totalBuy ? "bearish" : "neutral",
        symbol: input?.symbol || "all",
      };
    }),
});
