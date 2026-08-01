import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/sections/Navbar';
import FooterSection from '@/sections/FooterSection';
import TopBar from '@/sections/TopBar';
import { toast } from 'sonner';
import {
  ArrowUpRight, ArrowDownLeft, Repeat, Send, TrendingUp, TrendingDown,
  DollarSign, Wallet, ShieldCheck, Activity, CheckCircle2, Clock, Sparkles,
  RefreshCw, X, ChevronRight, ChevronDown, Plus, Minus, Info, Lock, Zap,
  BarChart3, Layers, Sliders, Check, AlertCircle, ArrowRight, User
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  CartesianGrid
} from 'recharts';

// ── Asset & Market Types ──────────────────────────────────
export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'forex' | 'crypto' | 'commodities' | 'indices';
  price: number;
  bid: number;
  ask: number;
  change24h: number;
  high: number;
  low: number;
  spread: number;
  unit: string;
  icon?: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl: number;
  openTime: string;
}

export interface HistoryRecord {
  id: string;
  type: 'BUY' | 'SELL' | 'SWAP' | 'SEND' | 'DEPOSIT' | 'WITHDRAWAL';
  title: string;
  amount: string;
  details: string;
  timestamp: string;
  status: 'Completed' | 'Pending';
}

const INITIAL_ASSETS: MarketAsset[] = [
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    price: 96450.00,
    bid: 96445.00,
    ask: 96455.00,
    change24h: 3.42,
    high: 97200.00,
    low: 94100.00,
    spread: 10.0,
    unit: 'BTC'
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    category: 'crypto',
    price: 3480.20,
    bid: 3479.80,
    ask: 3480.60,
    change24h: 2.15,
    high: 3540.00,
    low: 3390.00,
    spread: 0.8,
    unit: 'ETH'
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    price: 1.08540,
    bid: 1.08536,
    ask: 1.08544,
    change24h: -0.18,
    high: 1.08900,
    low: 1.08200,
    spread: 0.8,
    unit: 'EUR'
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / USD',
    category: 'forex',
    price: 1.26820,
    bid: 1.26814,
    ask: 1.26826,
    change24h: 0.45,
    high: 1.27200,
    low: 1.26300,
    spread: 1.2,
    unit: 'GBP'
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Yen',
    category: 'forex',
    price: 152.45,
    bid: 152.43,
    ask: 152.47,
    change24h: -0.32,
    high: 153.10,
    low: 151.80,
    spread: 2.0,
    unit: 'USD'
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    category: 'commodities',
    price: 2745.50,
    bid: 2745.20,
    ask: 2745.80,
    change24h: 1.12,
    high: 2760.00,
    low: 2725.00,
    spread: 0.6,
    unit: 'OZ'
  },
  {
    symbol: 'US30',
    name: 'Wall Street 30',
    category: 'indices',
    price: 43850.00,
    bid: 43847.00,
    ask: 43853.00,
    change24h: 0.85,
    high: 44100.00,
    low: 43500.00,
    spread: 6.0,
    unit: 'PTS'
  },
  {
    symbol: 'SOL/USD',
    name: 'Solana',
    category: 'crypto',
    price: 212.80,
    bid: 212.70,
    ask: 212.90,
    change24h: 5.64,
    high: 218.00,
    low: 201.00,
    spread: 0.2,
    unit: 'SOL'
  }
];

export default function TradingDashboard({ isDemoPage }: { isDemoPage?: boolean } = {}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userIdKey = user?.id || user?.email || 'guest';
  const accountNumber = `AXI-${(user?.id || '884920').slice(-6).toUpperCase()}`;
  const accountType = 'Axi Standard Account';
  const leverage = '1:500';

  // ── Persistent Registered User Account State ─────────────────
  const [accountBalance, setAccountBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`axi_balance_${userIdKey}`);
      return saved !== null ? parseFloat(saved) : 10000.00;
    } catch {
      return 10000.00;
    }
  });

  const [openPositions, setOpenPositions] = useState<Position[]>(() => {
    try {
      const saved = localStorage.getItem(`axi_positions_${userIdKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`axi_history_${userIdKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(`axi_balance_${userIdKey}`, accountBalance.toString());
    } catch (e) {
      console.warn('Failed to save balance to localStorage', e);
    }
  }, [accountBalance, userIdKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`axi_positions_${userIdKey}`, JSON.stringify(openPositions));
    } catch (e) {
      console.warn('Failed to save positions to localStorage', e);
    }
  }, [openPositions, userIdKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`axi_history_${userIdKey}`, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history, userIdKey]);

  // ── Session Assets & Selection ─────────────────────────────
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USD');
  const [activeActionTab, setActiveActionTab] = useState<'buy' | 'sell' | 'swap' | 'send'>('buy');
  const [chartTimeframe, setChartTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '1D'>('1H');

  // ── Trading Form State ─────────────────────────────────────
  const [orderLots, setOrderLots] = useState<string>('0.10');
  const [stopLossInput, setStopLossInput] = useState<string>('');
  const [takeProfitInput, setTakeProfitInput] = useState<string>('');

  // ── Swap Form State ────────────────────────────────────────
  const [swapFromSymbol, setSwapFromSymbol] = useState<string>('BTC/USD');
  const [swapToSymbol, setSwapToSymbol] = useState<string>('ETH/USD');
  const [swapFromAmount, setSwapFromAmount] = useState<string>('0.5');
  const [slippage, setSlippage] = useState<string>('0.5%');

  // ── Send Form State ────────────────────────────────────────
  const [sendAssetSymbol, setSendAssetSymbol] = useState<string>('BTC/USD');
  const [sendRecipient, setSendRecipient] = useState<string>('');
  const [sendAmount, setSendAmount] = useState<string>('');

  // ── Active Asset ───────────────────────────────────────────
  const currentAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  // ── Price Ticks Simulator ──────────────────────────────────
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    // Generate initial chart points
    const basePrice = currentAsset.price;
    const initialPoints = Array.from({ length: 25 }, (_, i) => {
      const variation = (Math.random() - 0.49) * (basePrice * 0.004);
      return {
        time: `${10 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
        price: parseFloat((basePrice + variation).toFixed(2))
      };
    });
    setChartData(initialPoints);
  }, [selectedSymbol]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAssets(prevAssets => {
        return prevAssets.map(asset => {
          const changePercent = (Math.random() - 0.49) * 0.0015;
          const newPrice = Math.max(0.0001, asset.price * (1 + changePercent));
          const spreadDiff = asset.spread * 0.0001;
          const newBid = newPrice - spreadDiff / 2;
          const newAsk = newPrice + spreadDiff / 2;
          const newHigh = Math.max(asset.high, newPrice);
          const newLow = Math.min(asset.low, newPrice);

          return {
            ...asset,
            price: newPrice,
            bid: newBid,
            ask: newAsk,
            high: newHigh,
            low: newLow
          };
        });
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  // Update open positions PnL dynamically as asset prices tick
  useEffect(() => {
    setOpenPositions(prev =>
      prev.map(pos => {
        const liveAsset = assets.find(a => a.symbol === pos.symbol);
        if (!liveAsset) return pos;

        const priceDiff = liveAsset.price - pos.openPrice;
        const multiplier = pos.type === 'BUY' ? 1 : -1;
        const calculatedPnl = priceDiff * pos.lots * multiplier * 10;

        return {
          ...pos,
          currentPrice: liveAsset.price,
          pnl: parseFloat(calculatedPnl.toFixed(2))
        };
      })
    );
  }, [assets]);

  // Update chart with live price point
  useEffect(() => {
    if (!currentAsset) return;
    setChartData(prev => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newPoints = [...prev.slice(1), { time: nowStr, price: parseFloat(currentAsset.price.toFixed(2)) }];
      return newPoints;
    });
  }, [currentAsset.price]);

  // ── Calculated Account Metrics ─────────────────────────────
  const openPnLTotal = openPositions.reduce((acc, pos) => acc + pos.pnl, 0);
  const accountEquity = accountBalance + openPnLTotal;
  const usedMargin = openPositions.reduce((acc, pos) => {
    const asset = assets.find(a => a.symbol === pos.symbol);
    const p = asset ? asset.price : 100;
    return acc + (p * pos.lots * 100) / 500;
  }, 0);
  const freeMargin = Math.max(0, accountEquity - usedMargin);
  const marginLevel = usedMargin > 0 ? ((accountEquity / usedMargin) * 100).toFixed(1) : '100.0';

  // ── Action Handlers ────────────────────────────────────────
  const handleDepositRedirect = () => {
    toast.info('Directing to Axi Funding Page...');
    navigate('/funds');
  };

  const handleWithdrawalRedirect = () => {
    toast.info('Directing to Axi Funding Page...');
    navigate('/funds');
  };

  const handleExecuteOrder = (type: 'BUY' | 'SELL') => {
    const lotsNum = parseFloat(orderLots) || 0.1;
    const requiredMargin = (currentAsset.price * lotsNum * 100) / 500;

    if (requiredMargin > freeMargin) {
      toast.error('Insufficient Free Margin for this trade volume.');
      return;
    }

    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      symbol: currentAsset.symbol,
      type,
      lots: lotsNum,
      openPrice: type === 'BUY' ? currentAsset.ask : currentAsset.bid,
      currentPrice: currentAsset.price,
      stopLoss: stopLossInput ? parseFloat(stopLossInput) : undefined,
      takeProfit: takeProfitInput ? parseFloat(takeProfitInput) : undefined,
      pnl: 0.00,
      openTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOpenPositions(prev => [newPosition, ...prev]);

    const newHistoryRecord: HistoryRecord = {
      id: `tx-${Date.now()}`,
      type,
      title: `${type} Order Executed - ${currentAsset.symbol}`,
      amount: `${lotsNum} Lots @ ${newPosition.openPrice.toFixed(currentAsset.price < 10 ? 5 : 2)}`,
      details: `Standard Account - Leverage 1:500`,
      timestamp: 'Just now',
      status: 'Completed'
    };
    setHistory(prev => [newHistoryRecord, ...prev]);

    toast.success(`${type} Market Order for ${lotsNum} Lots of ${currentAsset.symbol} executed successfully!`);
  };

  const handleClosePosition = (id: string) => {
    const posToClose = openPositions.find(p => p.id === id);
    if (!posToClose) return;

    setAccountBalance(prev => prev + posToClose.pnl);
    setOpenPositions(prev => prev.filter(p => p.id !== id));

    const closeRecord: HistoryRecord = {
      id: `tx-${Date.now()}`,
      type: posToClose.pnl >= 0 ? 'BUY' : 'SELL',
      title: `Closed Trade - ${posToClose.symbol}`,
      amount: `${posToClose.pnl >= 0 ? '+' : ''}$${posToClose.pnl.toFixed(2)} USD`,
      details: `Realized P&L from ${posToClose.type} ${posToClose.lots} Lots`,
      timestamp: 'Just now',
      status: 'Completed'
    };
    setHistory(prev => [closeRecord, ...prev]);

    toast.success(`Position ${posToClose.symbol} closed. P&L: $${posToClose.pnl.toFixed(2)}`);
  };

  // ── Swap Conversion Calculations ───────────────────────────
  const fromAsset = assets.find(a => a.symbol === swapFromSymbol) || assets[0];
  const toAsset = assets.find(a => a.symbol === swapToSymbol) || assets[1];
  const conversionRate = toAsset.price > 0 ? fromAsset.price / toAsset.price : 1;
  const calculatedSwapOutput = (parseFloat(swapFromAmount) || 0) * conversionRate;

  const handleExecuteSwap = () => {
    const amt = parseFloat(swapFromAmount);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid swap amount.');
      return;
    }

    const swapRecord: HistoryRecord = {
      id: `tx-swap-${Date.now()}`,
      type: 'SWAP',
      title: `Swapped ${fromAsset.name} to ${toAsset.name}`,
      amount: `${amt} ${fromAsset.unit} ➔ ${calculatedSwapOutput.toFixed(4)} ${toAsset.unit}`,
      details: `Rate: 1 ${fromAsset.unit} = ${conversionRate.toFixed(4)} ${toAsset.unit} (Zero Fee)`,
      timestamp: 'Just now',
      status: 'Completed'
    };

    setHistory(prev => [swapRecord, ...prev]);
    toast.success(`Successfully swapped ${amt} ${fromAsset.unit} to ${calculatedSwapOutput.toFixed(4)} ${toAsset.unit}!`);
  };

  const handleFlipSwap = () => {
    setSwapFromSymbol(swapToSymbol);
    setSwapToSymbol(swapFromSymbol);
  };

  const handleExecuteSend = () => {
    const amt = parseFloat(sendAmount);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid send amount.');
      return;
    }
    if (!sendRecipient || sendRecipient.trim().length < 4) {
      toast.error('Please enter a valid recipient address or Account ID.');
      return;
    }

    if (amt > freeMargin) {
      toast.error('Insufficient Free Balance to send this amount.');
      return;
    }

    setAccountBalance(prev => prev - amt);

    const sendRecord: HistoryRecord = {
      id: `tx-send-${Date.now()}`,
      type: 'SEND',
      title: `Sent ${sendAssetSymbol}`,
      amount: `-$${amt.toFixed(2)} USD`,
      details: `Recipient: ${sendRecipient}`,
      timestamp: 'Just now',
      status: 'Completed'
    };

    setHistory(prev => [sendRecord, ...prev]);
    toast.success(`Successfully sent $${amt.toFixed(2)} to ${sendRecipient}`);
    setSendAmount('');
    setSendRecipient('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TopBar />
      <Navbar />

      {/* ── Top Session Account Header ───────────────────────── */}
      <div className="bg-slate-900 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Account Profile Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-950/80 border border-red-500/30 rounded-xl text-red-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight">{accountType}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Live Active
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-slate-300">
                  ID: {accountNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Leverage <span className="text-amber-400 font-bold">{leverage}</span> • Standard Raw Spreads • High Speed Execution
              </p>
            </div>
          </div>

          {/* Account Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Balance</span>
              <span className="text-base font-black text-white">${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Equity</span>
              <span className={`text-base font-black ${openPnLTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${accountEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Free Margin</span>
              <span className="text-base font-black text-slate-200">${freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Margin Level</span>
              <span className="text-base font-black text-amber-400">{marginLevel}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Trading Session Area ────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── Core Actions Toolbar: BUY | SELL | SWAP | SEND | DEPOSIT | WITHDRAW ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveActionTab('buy')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeActionTab === 'buy'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Buy Order</span>
            </button>

            <button
              onClick={() => setActiveActionTab('sell')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeActionTab === 'sell'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Sell Order</span>
            </button>

            <button
              onClick={() => setActiveActionTab('swap')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeActionTab === 'swap'
                  ? 'bg-[#FFC800] text-slate-950 shadow-lg shadow-yellow-950/40 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>Swap Coins</span>
            </button>

            <button
              onClick={() => setActiveActionTab('send')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeActionTab === 'send'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send Funds</span>
            </button>
          </div>

          {/* Deposit and Withdraw Direct Funding Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={handleDepositRedirect}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Deposit</span>
            </button>

            <button
              onClick={handleWithdrawalRedirect}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-wider transition-all hover:scale-105"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* ── Workspace 2-Column Grid: Left (Chart & Watchlist) | Right (Action Form) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT 2 COLUMNS: Live Chart & Market Ticker */}
          <div className="lg:col-span-2 space-y-6">

            {/* Selected Asset Header & Chart Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-sm">
                    {currentAsset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                      <span>{currentAsset.symbol}</span>
                      <span className="text-xs font-semibold text-slate-400">({currentAsset.name})</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Spread: <span className="text-amber-400 font-bold">{currentAsset.spread} pips</span> • Category: <span className="uppercase text-slate-300 font-bold">{currentAsset.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-black text-white font-mono">
                      ${currentAsset.price.toFixed(currentAsset.price < 10 ? 5 : 2)}
                    </span>
                    <div className={`flex items-center justify-end gap-1 text-xs font-bold ${currentAsset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currentAsset.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{currentAsset.change24h >= 0 ? '+' : ''}{currentAsset.change24h}%</span>
                    </div>
                  </div>

                  {/* Timeframe selector */}
                  <div className="hidden sm:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 text-xs font-bold">
                    {(['1M', '5M', '15M', '1H', '1D'] as const).map(tf => (
                      <button
                        key={tf}
                        onClick={() => setChartTimeframe(tf)}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          chartTimeframe === tf ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Recharts Canvas */}
              <div className="h-[300px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="axiChartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E31B23" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#E31B23" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} stroke="#64748B" fontSize={10} tickLine={false} orientation="right" />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#E31B23" strokeWidth={2.5} fill="url(#axiChartGradient)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Markets Watchlist */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-500" />
                  <span>Axi Market Watchlist</span>
                </h3>
                <span className="text-xs text-slate-400 font-semibold">Live Real-time Ticks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {assets.map(asset => {
                  const isSelected = asset.symbol === selectedSymbol;
                  return (
                    <button
                      key={asset.symbol}
                      onClick={() => setSelectedSymbol(asset.symbol)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-red-500/60 shadow-md ring-1 ring-red-500/40'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{asset.symbol}</span>
                        <span className={`text-[10px] font-bold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between font-mono">
                        <span className="text-sm font-black text-slate-200">
                          ${asset.price.toFixed(asset.price < 10 ? 4 : 2)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">Sp: {asset.spread}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contextual Action Form (BUY / SELL / SWAP / SEND) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">

            {/* TAB 1 & 2: BUY / SELL MARKET ORDER FORM */}
            {(activeActionTab === 'buy' || activeActionTab === 'sell') && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg text-white font-black text-xs uppercase ${activeActionTab === 'buy' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                      {activeActionTab}
                    </span>
                    <h3 className="text-base font-black text-white">Execute Market Trade</h3>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">1:500 Leverage</span>
                </div>

                {/* Selected Asset Indicator */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">Trading Asset</span>
                    <span className="text-sm font-black text-white">{currentAsset.symbol}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold block">Current Price</span>
                    <span className="text-sm font-black text-white font-mono">${currentAsset.price.toFixed(currentAsset.price < 10 ? 5 : 2)}</span>
                  </div>
                </div>

                {/* Lot Size Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Volume (Lots / Amount)</label>
                    <span className="text-[10px] text-slate-400">1 Lot = 100,000 units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOrderLots(Math.max(0.01, parseFloat(orderLots) - 0.05).toFixed(2))}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      step="0.01"
                      value={orderLots}
                      onChange={e => setOrderLots(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-center text-sm font-black font-mono text-white focus:outline-none focus:border-red-500"
                    />
                    <button
                      onClick={() => setOrderLots((parseFloat(orderLots) + 0.05).toFixed(2))}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stop Loss & Take Profit Optional Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 mb-1 block">Stop Loss (SL)</label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={stopLossInput}
                      onChange={e => setStopLossInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 mb-1 block">Take Profit (TP)</label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={takeProfitInput}
                      onChange={e => setTakeProfitInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Required Margin Calculation */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Required Margin:</span>
                    <span className="font-mono text-slate-200 font-bold">
                      ${((currentAsset.price * (parseFloat(orderLots) || 0.1) * 100) / 500).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Spread Cost:</span>
                    <span className="font-mono text-slate-200 font-bold">{currentAsset.spread} pips</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Execution Route:</span>
                    <span className="text-emerald-400 font-bold">Standard STP Direct</span>
                  </div>
                </div>

                {/* Submit Trade Button */}
                <button
                  onClick={() => handleExecuteOrder(activeActionTab === 'buy' ? 'BUY' : 'SELL')}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    activeActionTab === 'buy'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Execute {activeActionTab.toUpperCase()} Market Order</span>
                </button>
              </div>
            )}

            {/* TAB 3: SWAP COINS / ASSETS */}
            {activeActionTab === 'swap' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-[#FFC800] text-slate-950 rounded-lg font-black text-xs uppercase">
                      Swap
                    </span>
                    <h3 className="text-base font-black text-white">Instant Coin & Asset Swap</h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">Zero Fee Promo</span>
                </div>

                {/* From Asset */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">You Pay (From)</label>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={swapFromSymbol}
                        onChange={e => setSwapFromSymbol(e.target.value)}
                        className="bg-slate-900 text-white font-black text-sm border border-slate-800 rounded-lg p-2 focus:outline-none"
                      >
                        {assets.map(a => (
                          <option key={a.symbol} value={a.symbol}>{a.symbol} ({a.name})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={swapFromAmount}
                        onChange={e => setSwapFromAmount(e.target.value)}
                        className="w-32 bg-transparent text-right font-mono font-black text-base text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Rate: ${fromAsset.price.toFixed(2)} USD</span>
                      <button onClick={() => setSwapFromAmount('1.0')} className="text-amber-400 font-bold hover:underline">Max</button>
                    </div>
                  </div>
                </div>

                {/* Swap Flip Icon */}
                <div className="flex justify-center -my-2">
                  <button
                    onClick={handleFlipSwap}
                    className="p-2 bg-slate-800 hover:bg-[#FFC800] hover:text-slate-950 text-slate-200 border border-slate-700 rounded-full transition-all shadow-md hover:scale-110"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>

                {/* To Asset */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">You Receive (To - Estimated)</label>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={swapToSymbol}
                        onChange={e => setSwapToSymbol(e.target.value)}
                        className="bg-slate-900 text-white font-black text-sm border border-slate-800 rounded-lg p-2 focus:outline-none"
                      >
                        {assets.map(a => (
                          <option key={a.symbol} value={a.symbol}>{a.symbol} ({a.name})</option>
                        ))}
                      </select>
                      <span className="font-mono font-black text-base text-emerald-400">
                        {calculatedSwapOutput.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Rate: 1 {fromAsset.unit} = {conversionRate.toFixed(4)} {toAsset.unit}
                    </div>
                  </div>
                </div>

                {/* Swap Conversion Specs */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Slippage Tolerance:</span>
                    <span className="text-slate-200 font-bold">{slippage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exchange Fee:</span>
                    <span className="text-emerald-400 font-bold">$0.00 USD (Axi Promo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Rate Update:</span>
                    <span className="text-amber-400 font-bold">Updated in real-time</span>
                  </div>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleExecuteSwap}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FFC800] hover:bg-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Execute Swap Now</span>
                </button>
              </div>
            )}

            {/* TAB 4: SEND FUNDS */}
            {activeActionTab === 'send' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-blue-600 text-white rounded-lg font-black text-xs uppercase">
                      Send
                    </span>
                    <h3 className="text-base font-black text-white">Transfer & Send Funds</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">Instant Transfer</span>
                </div>

                {/* Asset Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Asset / Coin to Send</label>
                  <select
                    value={sendAssetSymbol}
                    onChange={e => setSendAssetSymbol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white font-bold text-sm rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  >
                    {assets.map(a => (
                      <option key={a.symbol} value={a.symbol}>{a.symbol} - {a.name}</option>
                    ))}
                  </select>
                </div>

                {/* Recipient Address */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Recipient Wallet / Account ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 0x71C... or AXI-99420"
                    value={sendRecipient}
                    onChange={e => setSendRecipient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Amount */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Amount (USD Equivalent)</label>
                    <span className="text-[10px] text-slate-400">Avail: ${freeMargin.toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-black font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Network Fee Info */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span className="text-slate-200 font-bold">$0.00 (Internal Transfer)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Speed:</span>
                    <span className="text-emerald-400 font-bold">&lt; 5 seconds</span>
                  </div>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleExecuteSend}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Funds Now</span>
                </button>
              </div>
            )}

            {/* Quick Funding Shortcut Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Need to add or withdraw capital?</span>
              <button
                onClick={handleDepositRedirect}
                className="text-red-400 font-extrabold hover:underline flex items-center gap-1"
              >
                <span>Axi Funding</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* ── Bottom Section: Active Open Positions & History ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* OPEN POSITIONS TABLE (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Active Open Positions ({openPositions.length})</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Live P&L Tracking</span>
            </div>

            {openPositions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="text-sm font-semibold">No open trades currently active.</p>
                <p className="text-xs">Use the Buy/Sell order controls above to open a position.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 uppercase font-extrabold text-[10px] tracking-wider">
                      <th className="pb-3">Asset</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Lots</th>
                      <th className="pb-3">Open Price</th>
                      <th className="pb-3">Live Price</th>
                      <th className="pb-3">P&L ($)</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-medium">
                    {openPositions.map(pos => (
                      <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-black text-white">{pos.symbol}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${pos.type === 'BUY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'}`}>
                            {pos.type}
                          </span>
                        </td>
                        <td className="py-3 font-mono">{pos.lots}</td>
                        <td className="py-3 font-mono">${pos.openPrice.toFixed(pos.openPrice < 10 ? 4 : 2)}</td>
                        <td className="py-3 font-mono">${pos.currentPrice.toFixed(pos.currentPrice < 10 ? 4 : 2)}</td>
                        <td className={`py-3 font-mono font-black ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleClosePosition(pos.id)}
                            className="px-3 py-1 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 rounded-lg text-[11px] font-extrabold transition-all"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TRANSACTION & SWAP HISTORY (1 col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black text-white">Execution Logs</h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{history.length} Logs</span>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {history.map(item => (
                  <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{item.title}</span>
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{item.details}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">{item.timestamp}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-right">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Account Status Notice */}
            <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-red-400 font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Axi Standard High Volume Environment</span>
              </div>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                Your Standard Live account is primed with ultra-fast order execution and raw liquidity.
              </p>
            </div>
          </div>

        </div>

      </main>

      <FooterSection />
    </div>
  );
}
