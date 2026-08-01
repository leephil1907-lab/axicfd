import { MarketInstrument, User, Trade } from './types';

export const INITIAL_MARKETS: MarketInstrument[] = [
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: 1.14155,
    changePct: 0.25,
    bid: 1.14140,
    ask: 1.14170,
    open: 1.13927,
    high: 1.14498,
    low: 1.13813,
    volume: 85000000,
    prevClose: 1.13927,
    type: 'forex'
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    price: 1.33690,
    changePct: 0.18,
    bid: 1.33670,
    ask: 1.33710,
    open: 1.33422,
    high: 1.33957,
    low: 1.33155,
    volume: 62000000,
    prevClose: 1.33422,
    type: 'forex'
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    price: 162.520,
    changePct: 0.42,
    bid: 162.500,
    ask: 162.540,
    open: 161.850,
    high: 163.100,
    low: 161.500,
    volume: 78000000,
    prevClose: 161.850,
    type: 'forex'
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    price: 0.69444,
    changePct: -0.12,
    bid: 0.69424,
    ask: 0.69464,
    open: 0.69514,
    high: 0.69792,
    low: 0.69028,
    volume: 45000000,
    prevClose: 0.69514,
    type: 'forex'
  },
  {
    symbol: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    price: 1.42000,
    changePct: 0.08,
    bid: 1.41950,
    ask: 1.42050,
    open: 1.41900,
    high: 1.42500,
    low: 1.41600,
    volume: 38000000,
    prevClose: 1.41900,
    type: 'forex'
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold / US Dollar',
    price: 2342.15,
    changePct: 0.30,
    bid: 2341.65,
    ask: 2342.65,
    open: 2339.50,
    high: 2347.20,
    low: 2336.80,
    volume: 125340,
    prevClose: 2339.50,
    type: 'metal'
  },
  {
    symbol: 'XAG/USD',
    name: 'Silver / US Dollar',
    price: 27.450,
    changePct: 0.50,
    bid: 27.420,
    ask: 27.480,
    open: 27.300,
    high: 27.650,
    low: 27.180,
    volume: 45000,
    prevClose: 27.300,
    type: 'metal'
  },
  {
    symbol: 'US30',
    name: 'Dow Jones Industrial Average',
    price: 38912.50,
    changePct: -0.15,
    bid: 38910.00,
    ask: 38915.00,
    open: 38945.00,
    high: 38980.00,
    low: 38860.00,
    volume: 250000,
    prevClose: 38945.00,
    type: 'index'
  },
  {
    symbol: 'US500',
    name: 'S&P 500 Index',
    price: 5124.52,
    changePct: 0.20,
    bid: 5123.00,
    ask: 5126.00,
    open: 5112.00,
    high: 5135.00,
    low: 5105.00,
    volume: 1800000,
    prevClose: 5112.00,
    type: 'index'
  },
  {
    symbol: 'USTEC',
    name: 'Nasdaq 100 Index',
    price: 16245.20,
    changePct: 0.35,
    bid: 16240.00,
    ask: 16250.00,
    open: 16185.00,
    high: 16300.00,
    low: 16150.00,
    volume: 3200000,
    prevClose: 16185.00,
    type: 'index'
  },
  {
    symbol: 'OIL/USD',
    name: 'WTI Crude Oil',
    price: 78.450,
    changePct: -1.20,
    bid: 78.400,
    ask: 78.500,
    open: 79.400,
    high: 79.650,
    low: 78.100,
    volume: 85000,
    prevClose: 79.400,
    type: 'commodity'
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    price: 67245.20,
    changePct: 2.40,
    bid: 67220.00,
    ask: 67270.00,
    open: 65610.00,
    high: 67950.00,
    low: 65120.00,
    volume: 145000,
    prevClose: 65610.00,
    type: 'crypto'
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    price: 3452.10,
    changePct: 1.80,
    bid: 3450.00,
    ask: 3454.20,
    open: 3390.50,
    high: 3495.00,
    low: 3360.00,
    volume: 480000,
    prevClose: 3390.50,
    type: 'crypto'
  },
  {
    symbol: 'SOL/USD',
    name: 'Solana / US Dollar',
    price: 165.420,
    changePct: 1.20,
    bid: 165.300,
    ask: 165.540,
    open: 163.400,
    high: 167.800,
    low: 161.200,
    volume: 1200000,
    prevClose: 163.400,
    type: 'crypto'
  }
];

export const TRUSTPILOT_REVIEWS = [
  {
    id: 1,
    author: 'btranko',
    time: '6 hours ago',
    text: 'The portal is user friendly. Easy to navigate and execute trades quickly. Deposits and withdrawals are fast as well.',
    rating: 5,
    verified: true
  },
  {
    id: 2,
    author: 'Ashraf',
    time: '7 hours ago',
    text: 'Amazing platform for trading. Trade gold, Silver, Crypto all in one place with super tight spreads. Highly recommend!',
    rating: 5,
    verified: true
  },
  {
    id: 3,
    author: 'Emeka Nwosu',
    time: '1 day ago',
    text: 'I have tried multiple brokers in Nigeria, and Axi has the best support. The local payment methods are perfect and prompt.',
    rating: 5,
    verified: true
  },
  {
    id: 4,
    author: 'Elena Petrova',
    time: '2 days ago',
    text: 'Excellent execution speed and zero commission on my Pro account. The customer service team helped me verify documents in under an hour.',
    rating: 4,
    verified: true
  }
];

export const BLOG_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    title: 'Bitcoin price predictions 2026-2050: Bull, Base & Bear Cases',
    tag: 'Cryptocurrencies',
    author: 'Alex Macris'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    title: 'What is a stop-loss order and how does it work to protect capital?',
    tag: 'Education',
    author: 'Milan Cutkovic'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    title: 'Best proprietary trading firms and forex prop firms in 2026',
    tag: 'Education',
    author: 'Milan Cutkovic'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    title: 'What is proprietary trading and how do global prop desks work?',
    tag: 'Education',
    author: 'Milan Cutkovic'
  }
];

export const HELP_TOPICS = [
  {
    icon: '🏢',
    title: 'About Axi',
    description: 'Find essential details about Axi, including customer support hours, regulation, security of funds, and company information.'
  },
  {
    icon: '🚀',
    title: 'Getting Started',
    description: 'Everything you need to begin your trading journey – from opening an account to making your first trade in MT4.'
  },
  {
    icon: '🔐',
    title: 'Trading Accounts',
    description: "Whether you're using a live or simulated Axi account, our FAQs guide you through account types and setups."
  },
  {
    icon: '👤',
    title: 'My Axi Account',
    description: 'Find FAQs covering everything related to your client portal, uploading ID documents, and verification.'
  },
  {
    icon: '💳',
    title: 'Deposits & Withdrawals',
    description: 'Everything you should know about deposits, withdrawals, processing times, and local payment methods.'
  },
  {
    icon: '📈',
    title: 'Markets Directory',
    description: 'Find all the essential information, leverage limits, and contract specifications for all our tradable assets.'
  },
  {
    icon: '🖥️',
    title: 'MetaTrader Platform',
    description: 'MT4 is available on multiple devices. Learn how to configure indicators, expert advisors, and custom charts.'
  },
  {
    icon: '🔧',
    title: 'Trading Tools',
    description: 'Discover how our range of powerful trading tools like Autochartist, VPS, and psyQuation elevate your edge.'
  },
  {
    icon: '📱',
    title: 'Axi Mobile App',
    description: 'Trade anytime, anywhere with the Axi Trading Platform – available for iOS and Android.'
  }
];

export const INITIAL_USERS: User[] = [
  { id: 1001, name: 'John Doe', email: 'trader@axi.com', balance: 5301.23, equity: 5333.34, status: 'active', joined: '2025-11-15' },
  { id: 1002, name: 'Sarah Smith', email: 'sarah@email.com', balance: 12500.00, equity: 12480.50, status: 'active', joined: '2025-12-01' },
  { id: 1003, name: 'Mike Johnson', email: 'mike@email.com', balance: 2100.50, equity: 1800.25, status: 'active', joined: '2026-01-10' },
  { id: 1004, name: 'Emma Wilson', email: 'emma@email.com', balance: 850.00, equity: 920.15, status: 'suspended', joined: '2026-02-20' },
  { id: 1005, name: 'David Lee', email: 'david@email.com', balance: 45000.00, equity: 45200.80, status: 'active', joined: '2026-03-05' },
  { id: 1006, name: 'Lisa Chen', email: 'lisa@email.com', balance: 3200.75, equity: 3150.20, status: 'active', joined: '2026-04-12' },
  { id: 1007, name: 'Robert Brown', email: 'robert@email.com', balance: 150.00, equity: 145.80, status: 'pending', joined: '2026-05-18' },
  { id: 1008, name: 'Anna Kim', email: 'anna@email.com', balance: 7800.00, equity: 7850.40, status: 'active', joined: '2026-06-01' }
];

export const INITIAL_TRADES: Trade[] = [
  { id: 501, user: 'John Doe', symbol: 'EUR/USD', type: 'Buy', volume: 1.00, price: 1.14155, pnl: 32.45, time: '14:23:45', status: 'FILLED' },
  { id: 502, user: 'Sarah Smith', symbol: 'BTC/USD', type: 'Buy', volume: 0.05, price: 67245.20, pnl: 125.80, time: '14:18:22', status: 'FILLED' },
  { id: 503, user: 'Mike Johnson', symbol: 'XAU/USD', type: 'Sell', volume: 0.50, price: 2342.15, pnl: -45.20, time: '14:15:10', status: 'FILLED' },
  { id: 504, user: 'David Lee', symbol: 'GBP/USD', type: 'Buy', volume: 2.00, price: 1.33690, pnl: 18.40, time: '14:12:33', status: 'FILLED' },
  { id: 505, user: 'Lisa Chen', symbol: 'USD/JPY', type: 'Sell', volume: 1.50, price: 162.520, pnl: -12.80, time: '14:08:55', status: 'FILLED' },
  { id: 506, user: 'Anna Kim', symbol: 'ETH/USD', type: 'Buy', volume: 0.20, price: 3452.10, pnl: 42.15, time: '14:05:18', status: 'FILLED' },
  { id: 507, user: 'John Doe', symbol: 'US30', type: 'Buy', volume: 0.10, price: 38912.50, pnl: -8.50, time: '13:58:42', status: 'FILLED' },
  { id: 508, user: 'Sarah Smith', symbol: 'SOL/USD', type: 'Buy', volume: 10.00, price: 165.420, pnl: 28.90, time: '13:52:15', status: 'FILLED' }
];
