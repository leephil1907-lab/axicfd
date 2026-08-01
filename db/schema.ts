import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
  bigint,
  json,
  boolean,
  index,
} from "drizzle-orm/mysql-core";

// ── OAuth Users ────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  country: varchar("country", { length: 10 }),
  language: varchar("language", { length: 10 }).default("en"),
  currency: varchar("currency", { length: 10 }).default("EUR"),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

// ── Local Users (Email/Password Auth) ──────────────────
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  country: varchar("country", { length: 10 }),
  language: varchar("language", { length: 10 }).default("en"),
  currency: varchar("currency", { length: 10 }).default("EUR"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt"),
});

// ── Trading Accounts ───────────────────────────────────
export const tradingAccounts = mysqlTable("trading_accounts", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  accountNumber: varchar("accountNumber", { length: 50 }).notNull().unique(),
  accountType: mysqlEnum("accountType", ["standard", "pro", "demo"]).default("standard").notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0").notNull(),
  equity: decimal("equity", { precision: 18, scale: 8 }).default("0").notNull(),
  marginUsed: decimal("marginUsed", { precision: 18, scale: 8 }).default("0").notNull(),
  marginAvailable: decimal("marginAvailable", { precision: 18, scale: 8 }).default("0").notNull(),
  leverage: int("leverage").default(100).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ── Instruments ────────────────────────────────────────
export const instruments = mysqlTable("instruments", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["forex", "crypto", "metals", "indices", "commodities", "shares", "etfs"]).notNull(),
  baseAsset: varchar("baseAsset", { length: 50 }).notNull(),
  quoteAsset: varchar("quoteAsset", { length: 50 }).notNull(),
  pipSize: decimal("pipSize", { precision: 18, scale: 8 }).default("0.0001").notNull(),
  lotSize: decimal("lotSize", { precision: 18, scale: 8 }).default("100000").notNull(),
  minLot: decimal("minLot", { precision: 18, scale: 8 }).default("0.01").notNull(),
  maxLot: decimal("maxLot", { precision: 18, scale: 8 }).default("100").notNull(),
  leverageMax: int("leverageMax").default(100).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── Price Snapshots ────────────────────────────────────
export const priceSnapshots = mysqlTable("price_snapshots", {
  id: serial("id").primaryKey(),
  instrumentId: bigint("instrumentId", { mode: "number", unsigned: true }).notNull(),
  bid: decimal("bid", { precision: 18, scale: 8 }).notNull(),
  ask: decimal("ask", { precision: 18, scale: 8 }).notNull(),
  spread: decimal("spread", { precision: 18, scale: 8 }).notNull(),
  change24h: decimal("change24h", { precision: 18, scale: 8 }).default("0").notNull(),
  change24hPercent: decimal("change24hPercent", { precision: 10, scale: 4 }).default("0").notNull(),
  high24h: decimal("high24h", { precision: 18, scale: 8 }).notNull(),
  low24h: decimal("low24h", { precision: 18, scale: 8 }).notNull(),
  volume24h: decimal("volume24h", { precision: 24, scale: 4 }).default("0").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => [
  index("idx_price_instrument").on(table.instrumentId),
  index("idx_price_timestamp").on(table.timestamp),
]);

// ── Positions ──────────────────────────────────────────
export const positions = mysqlTable("positions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  accountId: bigint("accountId", { mode: "number", unsigned: true }).notNull(),
  instrumentId: bigint("instrumentId", { mode: "number", unsigned: true }).notNull(),
  direction: mysqlEnum("direction", ["buy", "sell"]).notNull(),
  volume: decimal("volume", { precision: 18, scale: 8 }).notNull(),
  openPrice: decimal("openPrice", { precision: 18, scale: 8 }).notNull(),
  currentPrice: decimal("currentPrice", { precision: 18, scale: 8 }).notNull(),
  stopLoss: decimal("stopLoss", { precision: 18, scale: 8 }),
  takeProfit: decimal("takeProfit", { precision: 18, scale: 8 }),
  commission: decimal("commission", { precision: 18, scale: 8 }).default("0").notNull(),
  swap: decimal("swap", { precision: 18, scale: 8 }).default("0").notNull(),
  realizedPnl: decimal("realizedPnl", { precision: 18, scale: 8 }).default("0").notNull(),
  status: mysqlEnum("status", ["open", "closed", "liquidated"]).default("open").notNull(),
  openedAt: timestamp("openedAt").defaultNow().notNull(),
  closedAt: timestamp("closedAt"),
}, (table) => [
  index("idx_pos_user").on(table.userId),
  index("idx_pos_status").on(table.status),
]);

// ── Orders ─────────────────────────────────────────────
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  accountId: bigint("accountId", { mode: "number", unsigned: true }).notNull(),
  instrumentId: bigint("instrumentId", { mode: "number", unsigned: true }).notNull(),
  orderType: mysqlEnum("orderType", ["market", "limit", "stop", "stop_limit"]).notNull(),
  direction: mysqlEnum("direction", ["buy", "sell"]).notNull(),
  volume: decimal("volume", { precision: 18, scale: 8 }).notNull(),
  entryPrice: decimal("entryPrice", { precision: 18, scale: 8 }),
  stopLoss: decimal("stopLoss", { precision: 18, scale: 8 }),
  takeProfit: decimal("takeProfit", { precision: 18, scale: 8 }),
  status: mysqlEnum("status", ["pending", "filled", "cancelled", "rejected", "expired"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  filledAt: timestamp("filledAt"),
}, (table) => [
  index("idx_order_user").on(table.userId),
  index("idx_order_status").on(table.status),
]);

// ── Transactions ───────────────────────────────────────
export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  accountId: bigint("accountId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal", "transfer_in", "transfer_out", "commission", "swap"]).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 100 }),
  reference: varchar("reference", { length: 255 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
}, (table) => [
  index("idx_tx_user").on(table.userId),
  index("idx_tx_status").on(table.status),
]);

// ── Trade History ──────────────────────────────────────
export const tradeHistory = mysqlTable("trade_history", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  accountId: bigint("accountId", { mode: "number", unsigned: true }).notNull(),
  instrumentId: bigint("instrumentId", { mode: "number", unsigned: true }).notNull(),
  positionId: bigint("positionId", { mode: "number", unsigned: true }),
  direction: mysqlEnum("direction", ["buy", "sell"]).notNull(),
  volume: decimal("volume", { precision: 18, scale: 8 }).notNull(),
  openPrice: decimal("openPrice", { precision: 18, scale: 8 }).notNull(),
  closePrice: decimal("closePrice", { precision: 18, scale: 8 }).notNull(),
  grossPnl: decimal("grossPnl", { precision: 18, scale: 8 }).notNull(),
  commission: decimal("commission", { precision: 18, scale: 8 }).default("0").notNull(),
  swap: decimal("swap", { precision: 18, scale: 8 }).default("0").notNull(),
  netPnl: decimal("netPnl", { precision: 18, scale: 8 }).notNull(),
  duration: int("duration"),
  closedAt: timestamp("closedAt").defaultNow().notNull(),
}, (table) => [
  index("idx_th_user").on(table.userId),
  index("idx_th_closed").on(table.closedAt),
]);

// ── Market News ────────────────────────────────────────
export const marketNews = mysqlTable("market_news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  summary: text("summary"),
  category: varchar("category", { length: 100 }),
  source: varchar("source", { length: 255 }),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  isActive: boolean("isActive").default(true).notNull(),
});

// ── System Settings ────────────────────────────────────
export const systemSettings = mysqlTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ── KYC Verifications ──────────────────────────────────
export const kycVerifications = mysqlTable("kyc_verifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  userEmail: varchar("userEmail", { length: 320 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  dob: varchar("dob", { length: 50 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  postalCode: varchar("postalCode", { length: 50 }).notNull(),
  idType: mysqlEnum("idType", ["drivers_license", "passport", "national_id"]).notNull(),
  idNumber: varchar("idNumber", { length: 100 }).notNull(),
  frontImage: text("frontImage").notNull(),
  backImage: text("backImage"),
  selfieImage: text("selfieImage"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  rejectionReason: text("rejectionReason"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
}, (table) => [
  index("idx_kyc_user").on(table.userId),
  index("idx_kyc_status").on(table.status),
]);

// ── Admin Audit Logs ──────────────────────────────────
export const adminAuditLogs = mysqlTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  adminEmail: varchar("adminEmail", { length: 320 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // e.g. "BALANCE_ADJUSTMENT", "KYC_APPROVAL", "KYC_REJECTION", "SETTINGS_UPDATE"
  targetUserId: bigint("targetUserId", { mode: "number", unsigned: true }),
  targetEmail: varchar("targetEmail", { length: 320 }),
  details: text("details").notNull(),
  ipAddress: varchar("ipAddress", { length: 100 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => [
  index("idx_audit_admin").on(table.adminEmail),
  index("idx_audit_timestamp").on(table.timestamp),
]);

// ── Support / Live Chat Messages ──────────────────────────
export const supportMessages = mysqlTable("support_messages", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  userName: varchar("userName", { length: 255 }),
  userEmail: varchar("userEmail", { length: 320 }),
  sender: mysqlEnum("sender", ["user", "bot", "admin"]).notNull(),
  message: text("message").notNull(),
  transferredToAdmin: boolean("transferredToAdmin").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_support_user").on(table.userId),
  index("idx_support_created").on(table.createdAt),
]);

// ── Types ──────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LocalUser = typeof localUsers.$inferSelect;
export type TradingAccount = typeof tradingAccounts.$inferSelect;
export type Instrument = typeof instruments.$inferSelect;
export type Position = typeof positions.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type TradeHistory = typeof tradeHistory.$inferSelect;
export type MarketNews = typeof marketNews.$inferSelect;
export type KycVerification = typeof kycVerifications.$inferSelect;
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
export type SupportMessage = typeof supportMessages.$inferSelect;