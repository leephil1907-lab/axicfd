import { relations } from "drizzle-orm";
import {
  users,
  localUsers,
  tradingAccounts,
  instruments,
  priceSnapshots,
  positions,
  orders,
  transactions,
  tradeHistory,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  tradingAccounts: many(tradingAccounts),
  positions: many(positions),
  orders: many(orders),
  transactions: many(transactions),
  tradeHistory: many(tradeHistory),
}));

export const localUsersRelations = relations(localUsers, ({ many }) => ({
  tradingAccounts: many(tradingAccounts),
}));

export const tradingAccountsRelations = relations(tradingAccounts, ({ one, many }) => ({
  user: one(users, { fields: [tradingAccounts.userId], references: [users.id] }),
  positions: many(positions),
  orders: many(orders),
  transactions: many(transactions),
  tradeHistory: many(tradeHistory),
}));

export const instrumentsRelations = relations(instruments, ({ many }) => ({
  priceSnapshots: many(priceSnapshots),
  positions: many(positions),
  orders: many(orders),
}));

export const priceSnapshotsRelations = relations(priceSnapshots, ({ one }) => ({
  instrument: one(instruments, { fields: [priceSnapshots.instrumentId], references: [instruments.id] }),
}));

export const positionsRelations = relations(positions, ({ one }) => ({
  user: one(users, { fields: [positions.userId], references: [users.id] }),
  account: one(tradingAccounts, { fields: [positions.accountId], references: [tradingAccounts.id] }),
  instrument: one(instruments, { fields: [positions.instrumentId], references: [instruments.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  account: one(tradingAccounts, { fields: [orders.accountId], references: [tradingAccounts.id] }),
  instrument: one(instruments, { fields: [orders.instrumentId], references: [instruments.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  account: one(tradingAccounts, { fields: [transactions.accountId], references: [tradingAccounts.id] }),
}));

export const tradeHistoryRelations = relations(tradeHistory, ({ one }) => ({
  user: one(users, { fields: [tradeHistory.userId], references: [users.id] }),
  account: one(tradingAccounts, { fields: [tradeHistory.accountId], references: [tradingAccounts.id] }),
  instrument: one(instruments, { fields: [tradeHistory.instrumentId], references: [instruments.id] }),
}));