export interface MarketInstrument {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  bid: number;
  ask: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  prevClose: number;
  type: 'forex' | 'metal' | 'index' | 'commodity' | 'crypto';
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  type: 'Buy' | 'Sell';
  volume: number;
  openPrice: number;
  currentPrice: number;
  sl?: number;
  tp?: number;
  time: string;
  pnl: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  equity: number;
  status: 'active' | 'suspended' | 'pending';
  joined: string;
}

export interface Trade {
  id: number;
  user: string;
  symbol: string;
  type: 'Buy' | 'Sell';
  volume: number;
  price: number;
  pnl: number;
  time: string;
  status: 'FILLED' | 'CLOSED';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface Transaction {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: string;
}

export interface CopyTrader {
  id: string;
  name: string;
  avatar: string;
  return30d: number;
  returnAll: number;
  copiers: number;
  fee: number;
  riskScore: number;
  trades: number;
  winRate: number;
  strategy: string;
  monthlyReturns: number[];
  description: string;
  isFollowing?: boolean;
}

export interface CopyInvestment {
  id: string;
  traderId: string;
  traderName: string;
  amount: number;
  sl: number;
  tp: number;
  profit: number;
  createdAt: string;
}

export type AppView = 'landing' | 'login' | 'trader' | 'admin';
