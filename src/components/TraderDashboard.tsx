import { useState, useEffect } from 'react';
import { 
  Search, Bell, Plus, Minus, TrendingUp, TrendingDown,
  Briefcase, ClipboardList, History, CreditCard, Settings, LogOut, ChartNoAxesColumn,
  Users, ArrowRight, Coins, Building, CheckCircle, Clock, ArrowUpRight, ArrowDownLeft,
  Percent, ShieldAlert, DollarSign, Globe, Sparkles, CircleDollarSign, Info, ChevronDown, UserCheck, ShieldCheck
} from 'lucide-react';
import { MarketInstrument, Position, Trade, User, Transaction, CopyTrader, CopyInvestment } from '../types';
import GlobalDropdown from './GlobalDropdown';

interface TraderDashboardProps {
  user: User;
  markets: MarketInstrument[];
  positions: Position[];
  trades: Trade[];
  transactions: Transaction[];
  copyTraders: CopyTrader[];
  copyInvestments: CopyInvestment[];
  onPlaceOrder: (type: 'Buy' | 'Sell', lot: number, sl: number, tp: number, symbol: string) => void;
  onClosePosition: (id: string) => void;
  onAddTransaction: (type: 'deposit' | 'withdrawal', amount: number, method: string) => void;
  onStartCopying: (traderId: string, amount: number, sl: number, tp: number) => void;
  onStopCopying: (investmentId: string) => void;
  onLogout: () => void;
  onShowToast: (message: string) => void;
}

export default function TraderDashboard({
  user,
  markets,
  positions,
  trades,
  transactions,
  copyTraders,
  copyInvestments,
  onPlaceOrder,
  onClosePosition,
  onAddTransaction,
  onStartCopying,
  onStopCopying,
  onLogout,
  onShowToast
}: TraderDashboardProps) {
  const [activeTab, setActiveTab] = useState<'trade' | 'portfolio' | 'orders' | 'history' | 'wallet' | 'copy-trading'>('trade');
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [watchlistFilter, setWatchlistFilter] = useState<'all' | 'forex' | 'crypto'>('all');
  const [searchQuery, setSearchTerm] = useState('');
  
  // Order Pad State
  const [lotSize, setLotSize] = useState(0.10);
  const [stopLoss, setStopLoss] = useState(1.13000);
  const [takeProfit, setTakeProfit] = useState(1.16000);
  const [leverage, setLeverage] = useState(100);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [positionsTab, setPositionsTab] = useState<'open' | 'pending' | 'history'>('open');

  // One-Click Trading states
  const [oneClickTrading, setOneClickTrading] = useState<boolean>(() => {
    try {
      return localStorage.getItem('oneClickTrading') === 'true';
    } catch {
      return false;
    }
  });
  const [pendingOrderConfirmation, setPendingOrderConfirmation] = useState<{
    type: 'Buy' | 'Sell';
    lotSize: number;
    stopLoss: number;
    takeProfit: number;
    symbol: string;
  } | null>(null);
  const [pendingCloseConfirmation, setPendingCloseConfirmation] = useState<{
    id: string;
    symbol: string;
    type: 'Buy' | 'Sell';
    volume: number;
    pnl: number;
    openPrice: number;
    currentPrice: number;
  } | null>(null);

  // Copy Trading local UI states
  const [selectedTrader, setSelectedTrader] = useState<CopyTrader | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyAmount, setCopyAmount] = useState('1000');
  const [copySl, setCopySl] = useState('15');
  const [copyTp, setCopyTp] = useState('30');

  // Funding local UI states
  const [fundingType, setFundingType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [selectedFundingMethod, setSelectedFundingMethod] = useState<'bank' | 'wire' | 'crypto' | 'card'>('bank');
  const [fundingAmount, setFundingAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('GTBank');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT-TRC20');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [destinationBank, setDestinationBank] = useState('GTBank');
  const [cryptoAddress, setCryptoAddress] = useState('');

  // Chart state
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('1H');
  const [chartData, setChartData] = useState<any[]>([]);

  // Find active instrument
  const activeInstrument = markets.find(m => m.symbol === selectedSymbol) || markets[0];

  // Regulate Lot adjusters
  const adjustLotSize = (delta: number) => {
    setLotSize(prev => {
      const next = Math.max(0.01, Math.round((prev + delta) * 100) / 100);
      return next;
    });
  };

  // Sync SL/TP default helpers when asset changes
  useEffect(() => {
    if (activeInstrument) {
      const price = activeInstrument.price;
      const isCrypto = activeInstrument.type === 'crypto';
      const isMetal = activeInstrument.type === 'metal';
      const isIndex = activeInstrument.type === 'index';

      if (isCrypto) {
        setStopLoss(Math.round(price * 0.98));
        setTakeProfit(Math.round(price * 1.05));
      } else if (isMetal) {
        setStopLoss(Math.round((price - 15) * 100) / 100);
        setTakeProfit(Math.round((price + 35) * 100) / 100);
      } else if (isIndex) {
        setStopLoss(Math.round((price - 100) * 10) / 10);
        setTakeProfit(Math.round((price + 250) * 10) / 10);
      } else {
        setStopLoss(Math.round((price - 0.012) * 100000) / 100000);
        setTakeProfit(Math.round((price + 0.024) * 100000) / 100000);
      }
    }
  }, [selectedSymbol]);

  // Generate simulated chart dataset based on current price
  useEffect(() => {
    if (!activeInstrument) return;
    const base = activeInstrument.price;
    const isCrypto = activeInstrument.type === 'crypto';
    const isIndex = activeInstrument.type === 'index';
    const pointsCount = 28;
    const data: any[] = [];
    let currentVal = base * 0.98;

    for (let i = 0; i < pointsCount; i++) {
      const volatility = isCrypto ? 0.015 : isIndex ? 0.008 : 0.003;
      const o = currentVal * (1 + (Math.random() - 0.48) * volatility);
      const c = o * (1 + (Math.random() - 0.5) * (volatility * 0.8));
      const h = Math.max(o, c) * (1 + Math.random() * (volatility * 0.4));
      const l = Math.min(o, c) * (1 - Math.random() * (volatility * 0.4));
      data.push({ o, h, l, c });
      currentVal = c;
    }
    // Make last candle align with current price
    const lastIdx = pointsCount - 1;
    data[lastIdx] = {
      o: data[lastIdx].o,
      h: Math.max(data[lastIdx].o, base) * 1.001,
      l: Math.min(data[lastIdx].o, base) * 0.999,
      c: base
    };

    setChartData(data);
  }, [selectedSymbol, timeframe, activeInstrument?.price]);

  // Calculations for Margin requirements
  const getMarginReq = () => {
    if (!activeInstrument) return 0;
    // For forex / metal: size = lot * contractSize (usually 100,000 for standard forex)
    const sizeMultiplier = activeInstrument.type === 'forex' ? 100000 : activeInstrument.type === 'metal' ? 100 : 1;
    const nominalValue = lotSize * activeInstrument.price * sizeMultiplier;
    return nominalValue / leverage;
  };

  // Recalculate Portfolio metrics
  const totalOpenPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const copyInvestmentsEquity = copyInvestments.reduce((sum, inv) => sum + inv.amount + inv.profit, 0);
  const totalEquity = user.balance + totalOpenPnl + copyInvestmentsEquity;
  const totalMarginUsed = positions.reduce((sum, p) => {
    const asset = markets.find(m => m.symbol === p.symbol);
    if (!asset) return sum;
    const mult = asset.type === 'forex' ? 100000 : asset.type === 'metal' ? 100 : 1;
    return sum + ((p.volume * p.openPrice * mult) / leverage);
  }, 0);
  const freeMargin = Math.max(0, totalEquity - totalMarginUsed);
  const marginLevel = totalMarginUsed > 0 ? (totalEquity / totalMarginUsed) * 100 : 0;

  // Filter watchlist list
  const filteredWatchlist = markets.filter(item => {
    if (watchlistFilter === 'forex') return item.type === 'forex';
    if (watchlistFilter === 'crypto') return item.type === 'crypto';
    return true; // all
  }).filter(item => {
    if (!searchQuery) return true;
    return item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePlaceOrderSubmit = (type: 'Buy' | 'Sell') => {
    if (oneClickTrading) {
      onPlaceOrder(type, lotSize, stopLoss, takeProfit, selectedSymbol);
      if (onShowToast) {
        onShowToast(`Instant ${type} order executed for ${lotSize} lots of ${selectedSymbol}!`);
      }
    } else {
      setPendingOrderConfirmation({
        type,
        lotSize,
        stopLoss,
        takeProfit,
        symbol: selectedSymbol
      });
    }
  };

  const getPriceDecimalPlaces = (symbol: string) => {
    if (symbol.includes('JPY')) return 3;
    if (symbol.includes('BTC') || symbol.includes('US30') || symbol.includes('USTEC')) return 2;
    if (symbol.length === 7 && symbol.includes('/')) return 5;
    return 2;
  };

  const positionsTrackerElement = (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 px-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
        <h3 className="font-extrabold text-sm text-gray-900">Positions & Open Orders</h3>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setPositionsTab('open')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              positionsTab === 'open' ? 'bg-gray-950 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Open Positions ({positions.length})
          </button>
          <button 
            onClick={() => setPositionsTab('pending')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              positionsTab === 'pending' ? 'bg-gray-950 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Pending Limit Orders (0)
          </button>
          <button 
            onClick={() => setPositionsTab('history')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              positionsTab === 'history' ? 'bg-gray-950 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Execution Logs ({trades.length})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Lots</th>
              <th className="px-6 py-3">Execution Price</th>
              <th className="px-6 py-3">Current Price</th>
              <th className="px-6 py-3">Stop Loss</th>
              <th className="px-6 py-3">Take Profit</th>
              <th className="px-6 py-3">Unrealised P&L</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {positionsTab === 'open' ? (
              positions.length > 0 ? (
                positions.map((p) => {
                  const decs = getPriceDecimalPlaces(p.symbol);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className="font-extrabold text-gray-950">{p.symbol}</span>
                        <span className="block text-[9px] text-gray-400 font-semibold">{p.name}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-block px-2 py-0.5 font-bold rounded text-[10px] ${
                          p.type === 'Buy' ? 'bg-emerald-50 text-[#10B981] border border-emerald-100' : 'bg-red-50 text-[#D31C2B] border border-red-100'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-gray-700">{p.volume.toFixed(2)}</td>
                      <td className="px-6 py-3.5 font-mono font-bold text-gray-800">{p.openPrice.toFixed(decs)}</td>
                      <td className="px-6 py-3.5 font-mono font-bold text-gray-850">{p.currentPrice.toFixed(decs)}</td>
                      <td className="px-6 py-3.5 font-mono text-gray-500 font-semibold">{p.sl ? p.sl.toFixed(decs) : '—'}</td>
                      <td className="px-6 py-3.5 font-mono text-gray-500 font-semibold">{p.tp ? p.tp.toFixed(decs) : '—'}</td>
                      <td className={`px-6 py-3.5 font-mono font-bold text-sm ${p.pnl >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                        {p.pnl >= 0 ? '+' : ''}${p.pnl.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3.5">
                        <button 
                          onClick={() => {
                            if (oneClickTrading) {
                              onClosePosition(p.id);
                              if (onShowToast) {
                                onShowToast(`Position for ${p.symbol} closed successfully`);
                              }
                            } else {
                              setPendingCloseConfirmation({
                                id: p.id,
                                symbol: p.symbol,
                                type: p.type,
                                volume: p.volume,
                                pnl: p.pnl,
                                openPrice: p.openPrice,
                                currentPrice: p.currentPrice
                              });
                            }
                          }}
                          className="px-3 py-1.5 border border-gray-200 hover:border-red-500 text-gray-600 hover:text-red-600 rounded-lg text-[10px] font-bold transition-all hover:bg-red-50/20 active:scale-95"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 font-semibold uppercase tracking-wider">
                    No active positions currently held.
                  </td>
                </tr>
              )
            ) : positionsTab === 'pending' ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400 font-semibold uppercase tracking-wider">
                  No pending limit/stop triggers active.
                </td>
              </tr>
            ) : (
              trades.length > 0 ? (
                [...trades].reverse().map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-extrabold text-gray-950">{t.symbol}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block px-2 py-0.5 font-bold rounded text-[10px] ${
                        t.type === 'Buy' ? 'bg-emerald-50 text-[#10B981]' : 'bg-red-50 text-[#D31C2B]'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-gray-700">{t.volume.toFixed(2)}</td>
                    <td className="px-6 py-3.5 font-mono font-bold text-gray-800">{t.price.toFixed(getPriceDecimalPlaces(t.symbol))}</td>
                    <td className="px-6 py-3.5 text-gray-400">—</td>
                    <td className="px-6 py-3.5 text-gray-400">—</td>
                    <td className="px-6 py-3.5 text-gray-400">—</td>
                    <td className={`px-6 py-3.5 font-mono font-bold ${t.pnl >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wide">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 font-semibold uppercase tracking-wider">
                    No logs found. Place trades in the terminals.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans select-none">
      {/* Dashboard Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            onClick={onLogout}
            className="text-3xl font-black text-black tracking-tighter cursor-pointer select-none flex items-baseline"
          >
            ax<span className="text-[#D31C2B] font-black">i</span>
            <span className="w-1.5 h-1.5 bg-[#FFC800] rounded-full ml-0.5 animate-pulse"></span>
          </div>

          {/* Search bar inside header */}
          <div className="relative hidden lg:block w-72">
            <Search className="w-4.5 h-4-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 focus:bg-white transition-all focus:border-gray-200"
            />
          </div>
        </div>

        {/* Live account details */}
        <div className="flex items-center gap-6 text-xs md:text-sm">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account Equity</div>
            <div className="font-extrabold text-gray-900 text-base font-mono">${totalEquity.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className={`text-[10px] font-bold ${totalOpenPnl >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
              {totalOpenPnl >= 0 ? '+' : ''}${totalOpenPnl.toFixed(2)} today
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onShowToast('System alerts are healthy. Real-time simulation ticking.')}
              className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <div className="w-1.5 h-1.5 bg-[#D31C2B] rounded-full absolute top-2 right-2 border border-white"></div>
            </button>

            <GlobalDropdown
              trigger={{
                label: user?.name || "Trader",
                icon: UserCheck,
                variant: 'default',
                size: 'sm',
                className: 'font-extrabold text-xs shadow-sm border-gray-200'
              }}
              align="right"
              width="w-64"
              header={
                <div className="bg-gradient-to-r from-red-50 to-amber-50 p-2.5 rounded-xl border border-red-100">
                  <span className="text-[9px] text-[#D31C2B] font-black uppercase block tracking-widest">Verified Pro Trader</span>
                  <span className="text-[11px] text-gray-900 block truncate font-black mt-0.5">{user?.name || "Live Trader"}</span>
                  <span className="text-[10px] text-gray-500 block truncate font-medium">{user?.email}</span>
                </div>
              }
              items={[
                { id: 'wallet', label: 'Deposit / Withdraw Funds', icon: CreditCard, onClick: () => { setActiveTab('wallet'); switchTraderView('wallet'); } },
                { id: 'portfolio', label: 'Portfolio & Open Positions', icon: Briefcase, onClick: () => { setActiveTab('positions'); switchTraderView('positions'); } },
                { id: 'copy', label: 'Axi Select & Copy Trading', icon: Users, onClick: () => { setActiveTab('copy'); switchTraderView('copy'); } },
                { id: 'settings', label: 'Trader Preferences', icon: Settings, onClick: () => onShowToast('Trader configurations saved.'), divider: true },
                { id: 'logout', label: 'Sign Out', icon: LogOut, danger: true, onClick: onLogout }
              ]}
            />
          </div>
        </div>
      </header>

      {/* Main Core Dashboard Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-16 md:w-60 bg-white border-r border-gray-200 py-6 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-6">
            <nav className="space-y-1">
              <button 
                onClick={() => { setActiveTab('trade'); switchTraderView('trade'); }}
                className={`w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'trade' 
                    ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <ChartNoAxesColumn className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline">Trade Terminal</span>
              </button>

              <button 
                onClick={() => { setActiveTab('portfolio'); switchTraderView('portfolio'); }}
                className={`w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'portfolio' 
                    ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <Briefcase className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline">Portfolio</span>
              </button>

              <button 
                onClick={() => { setActiveTab('orders'); switchTraderView('orders'); }}
                className={`w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'orders' 
                    ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <ClipboardList className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline">Pending Orders</span>
              </button>

              <button 
                onClick={() => { setActiveTab('history'); switchTraderView('history'); }}
                className={`w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'history' 
                    ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <History className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline">Execution History</span>
              </button>

              <button 
                onClick={() => { setActiveTab('copy-trading'); }}
                className={`w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'copy-trading' 
                    ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline font-bold">Copy Trading</span>
              </button>
            </nav>

            <div className="border-t border-gray-100 pt-6">
              <div className="hidden md:block px-6 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Account Portal</div>
              <button 
                onClick={() => { setActiveTab('wallet'); switchTraderView('wallet'); }}
                className={`w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'wallet' 
                    ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline">Deposit & Withdraw</span>
              </button>

              <button 
                onClick={() => onShowToast('Account configurations verified.')}
                className="w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 border-transparent text-xs md:text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50/50 transition-all"
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline">Settings</span>
              </button>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 md:px-6 py-3 border-l-4 border-transparent text-xs md:text-sm font-bold text-gray-500 hover:text-[#D31C2B] hover:bg-red-50/30 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </aside>

        {/* Dynamic Inner Panel view */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* Equity & Fund metrics banner cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Equity Value</div>
              <div className="text-xl font-extrabold text-gray-950 font-mono mt-1">
                ${totalEquity.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className={`text-[10px] font-bold mt-1 ${totalOpenPnl >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                {totalOpenPnl >= 0 ? '+' : ''}${totalOpenPnl.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Open P&L
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Balance Capital</div>
              <div className="text-xl font-extrabold text-gray-950 font-mono mt-1">
                ${user.balance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Settled cash funds</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Free Margin</div>
              <div className="text-xl font-extrabold text-gray-950 font-mono mt-1">
                ${freeMargin.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[10px] text-teal-600 font-bold mt-1">Available for opening positions</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Margin Level</div>
              <div className="text-xl font-extrabold text-gray-950 font-mono mt-1">
                {totalMarginUsed > 0 ? `${marginLevel.toFixed(1)}%` : '0.0%'}
              </div>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                ${totalMarginUsed.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} margin used
              </p>
            </div>
          </section>

          {/* Core Trading Terminal View */}
          {activeTab === 'trade' && (
            <div className="trader-dashboard-layout grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Asset Watchlist */}
              <div className="order-3 lg:order-1 lg:col-span-4 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
                <div className="p-4 border-b border-gray-200 space-y-3">
                  <h3 className="font-extrabold text-sm text-gray-900">Watchlists</h3>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setWatchlistFilter('all')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        watchlistFilter === 'all' ? 'bg-[#D31C2B] text-white' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setWatchlistFilter('forex')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        watchlistFilter === 'forex' ? 'bg-[#D31C2B] text-white' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Forex
                    </button>
                    <button 
                      onClick={() => setWatchlistFilter('crypto')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        watchlistFilter === 'crypto' ? 'bg-[#D31C2B] text-white' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Crypto
                    </button>
                  </div>
                </div>

                {/* Search query field in Watchlist */}
                <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search Watchlists..."
                      value={searchQuery}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#D31C2B]"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {filteredWatchlist.map(m => {
                    const decs = getPriceDecimalPlaces(m.symbol);
                    const isActive = m.symbol === selectedSymbol;
                    const changeClass = m.changePct >= 0 ? 'text-teal-600' : 'text-red-500';
                    return (
                      <div 
                        key={m.symbol}
                        onClick={() => setSelectedSymbol(m.symbol)}
                        className={`p-3 px-4 flex items-center justify-between cursor-pointer transition-colors border-l-4 ${
                          isActive 
                            ? 'bg-red-50/30 border-[#D31C2B]' 
                            : 'border-transparent hover:bg-gray-50/50'
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-xs text-gray-900">{m.symbol}</div>
                          <div className="text-[9px] text-gray-400 font-semibold">{m.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-gray-900">{m.price.toFixed(decs)}</div>
                          <div className={`font-mono text-[9px] font-bold ${changeClass}`}>
                            {m.changePct >= 0 ? '+' : ''}{m.changePct.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Middle Column: Chart visualization */}
              <div className="order-1 lg:order-2 lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="font-extrabold text-sm md:text-base text-gray-950">{activeInstrument.symbol}</h2>
                    <div className="font-mono text-sm md:text-lg font-black text-gray-900">
                      {activeInstrument.price.toFixed(getPriceDecimalPlaces(activeInstrument.symbol))}
                    </div>
                    <div className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded ${
                      activeInstrument.changePct >= 0 ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-red-50 text-red-500 border border-red-100'
                    }`}>
                      {activeInstrument.changePct >= 0 ? '+' : ''}{activeInstrument.changePct.toFixed(2)}%
                    </div>
                  </div>

                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    {(['1H', '4H', '1D', '1W'] as const).map(tf => (
                      <button 
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                          timeframe === tf ? 'bg-gray-950 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Live Candlestick Graph Canvas */}
                <div className="flex-1 p-6 relative bg-white">
                  {chartData.length > 0 ? (
                    <div className="w-full h-full relative">
                      <svg className="w-full h-full" viewBox="0 0 800 360" preserveAspectRatio="none">
                        {/* Horizontal Gridlines */}
                        <line x1="30" y1="60" x2="770" y2="60" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="30" y1="120" x2="770" y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="30" y1="180" x2="770" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="30" y1="240" x2="770" y2="240" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="30" y1="300" x2="770" y2="300" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

                        {/* Rendering Candlesticks */}
                        {(() => {
                          const prices = chartData.map(d => [d.o, d.h, d.l, d.c]).flat();
                          const min = Math.min(...prices);
                          const max = Math.max(...prices);
                          const range = max - min || 1;

                          const candleWidth = 16;
                          const gap = 8;
                          const startX = 40;

                          return chartData.map((d, i) => {
                            const x = startX + i * (candleWidth + gap);
                            const yo = 320 - ((d.o - min) / range) * 280;
                            const yc = 320 - ((d.c - min) / range) * 280;
                            const yh = 320 - ((d.h - min) / range) * 280;
                            const yl = 320 - ((d.l - min) / range) * 280;
                            const isBullish = d.c >= d.o;
                            const color = isBullish ? '#10B981' : '#D31C2B';

                            return (
                              <g key={i}>
                                {/* Wick line */}
                                <line 
                                  x1={x + candleWidth / 2} 
                                  y1={yh} 
                                  x2={x + candleWidth / 2} 
                                  y2={yl} 
                                  stroke={color} 
                                  strokeWidth="1.5" 
                                />
                                {/* Candle Body block */}
                                <rect 
                                  x={x} 
                                  y={Math.min(yo, yc)} 
                                  width={candleWidth} 
                                  height={Math.max(1, Math.abs(yc - yo))} 
                                  fill={color} 
                                  rx="1" 
                                />
                              </g>
                            );
                          });
                        })()}
                      </svg>

                      {/* Timeframe bottom labels */}
                      <div className="absolute bottom-1 left-0 right-0 px-8 flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                        <span>09:00 AM</span>
                        <span>10:30 AM</span>
                        <span>12:00 PM</span>
                        <span>01:30 PM</span>
                        <span>03:00 PM</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                      Generating chart data feeds...
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive Order Pad entry panel */}
              <div className="order-placement-panel order-2 lg:order-4 lg:col-span-4 md:min-w-[300px] sticky top-6 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-extrabold text-sm text-gray-900">Order Pad</h3>
                </div>

                <div className="flex border-b border-gray-100">
                  {(['market', 'limit', 'stop'] as const).map(type => (
                    <button 
                      key={type}
                      onClick={() => { setOrderType(type); if(type !== 'market') onShowToast(`${type.toUpperCase()} execution triggers will require platform updates.`); }}
                      className={`flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                        orderType === type 
                          ? 'border-[#D31C2B] text-[#D31C2B] bg-red-50/20' 
                          : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {/* Symbol display */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trading Asset</label>
                    <input 
                      type="text" 
                      value={activeInstrument.symbol} 
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-xs font-extrabold focus:outline-none" 
                      readOnly 
                    />
                  </div>

                  {/* Lot sizing entry */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Volume (Lots)</label>
                    <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl p-1">
                      <button 
                        onClick={() => adjustLotSize(-0.01)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all text-sm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input 
                        type="text" 
                        value={lotSize.toFixed(2)}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v)) setLotSize(Math.max(0.01, v));
                        }}
                        className="flex-1 text-center bg-transparent border-none text-xs font-black text-gray-950 focus:outline-none" 
                      />
                      <button 
                        onClick={() => adjustLotSize(0.01)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all text-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Stop Loss parameter */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stop Loss</label>
                    <input 
                      type="number"
                      step={activeInstrument.type === 'forex' ? '0.0001' : '1'}
                      value={stopLoss}
                      onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D31C2B] rounded-xl text-xs font-bold font-mono"
                    />
                  </div>

                  {/* Take Profit parameter */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Take Profit</label>
                    <input 
                      type="number"
                      step={activeInstrument.type === 'forex' ? '0.0001' : '1'}
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D31C2B] rounded-xl text-xs font-bold font-mono"
                    />
                  </div>

                  {/* Leverage selection dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leverage Multiplier</label>
                    <GlobalDropdown
                      trigger={{
                        label: `1:${leverage} (${leverage}x Leverage)`,
                        icon: Percent,
                        variant: 'default',
                        size: 'sm',
                        className: 'w-full justify-between font-mono font-bold text-xs border-gray-200'
                      }}
                      align="left"
                      width="w-full"
                      items={[1, 5, 10, 20, 50, 100, 200, 500].map(lev => ({
                        id: `lev-${lev}`,
                        label: `1:${lev} Leverage (${lev}x)`,
                        selected: leverage === lev,
                        onClick: () => setLeverage(lev)
                      }))}
                    />
                  </div>

                  {/* Cost Summary block */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-[10px] font-bold text-gray-500 space-y-2.5">
                    <div className="flex justify-between">
                      <span>Margin Required</span>
                      <span className="text-gray-900 font-mono">${getMarginReq().toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nominal Spread</span>
                      <span className="text-gray-900">0.3 pips</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-150 pt-2 text-xs">
                      <span className="text-gray-900 uppercase">Est Margin Call Cost</span>
                      <span className="text-gray-950 font-black font-mono">${getMarginReq().toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* One-Click Trading mode toggle */}
                  <div className="flex items-center justify-between border-t border-gray-150 pt-3 pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">One-Click Trading</span>
                      <span className={`inline-block w-2 h-2 rounded-full ${oneClickTrading ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={oneClickTrading} 
                        onChange={(e) => {
                          const val = e.target.checked;
                          setOneClickTrading(val);
                          try {
                            localStorage.setItem('oneClickTrading', String(val));
                          } catch (err) {}
                          if (onShowToast) {
                            if (val) {
                              onShowToast("One-Click Trading mode enabled. Orders will execute instantly without confirmation.");
                            } else {
                              onShowToast("One-Click Trading mode disabled. Orders will require manual confirmation.");
                            }
                          }
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D31C2B]" />
                    </label>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => handlePlaceOrderSubmit('Buy')}
                      className="bg-[#10B981] hover:bg-[#059669] active:scale-95 text-white py-3 rounded-xl font-bold transition-all text-xs tracking-wide shadow-md shadow-emerald-500/10"
                    >
                      Buy Order
                    </button>
                    <button 
                      onClick={() => handlePlaceOrderSubmit('Sell')}
                      className="bg-[#D31C2B] hover:bg-[#B91623] active:scale-95 text-white py-3 rounded-xl font-bold transition-all text-xs tracking-wide shadow-md shadow-red-500/10"
                    >
                      Sell Order
                    </button>
                  </div>
                </div>
              </div>

              {/* Positions Tracker Column: order-4 on mobile, col-span-8 on desktop */}
              <div className="order-4 lg:order-3 lg:col-span-8">
                {positionsTrackerElement}
              </div>

            </div>
          )}

          {/* Core Positions & Orders tracker panel for other tabs */}
          {activeTab !== 'trade' && activeTab !== 'wallet' && activeTab !== 'copy-trading' && (
            <div className="block">
              {positionsTrackerElement}
            </div>
          )}

          {/* Fully Interactive Copy Trading System */}
          {activeTab === 'copy-trading' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Copy Trading Header Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Copy Capital</div>
                  <div className="text-2xl font-black text-gray-950 font-mono mt-1">
                    ${copyInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">Currently copying {copyInvestments.length} experts</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Floating Returns</div>
                  <div className="text-2xl font-black font-mono mt-1 flex items-center gap-1.5">
                    {copyInvestments.reduce((sum, inv) => sum + inv.profit, 0) >= 0 ? (
                      <span className="text-teal-600">
                        +${copyInvestments.reduce((sum, inv) => sum + inv.profit, 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-red-500">
                        -${Math.abs(copyInvestments.reduce((sum, inv) => sum + inv.profit, 0)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-teal-600 font-bold mt-1">✓ Automated profit mirroring</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg Master Winrate</div>
                  <div className="text-2xl font-black text-gray-950 font-mono mt-1">
                    {copyInvestments.length > 0 
                      ? `${(copyInvestments.reduce((sum, inv) => {
                          const trader = copyTraders.find(t => t.id === inv.traderId);
                          return sum + (trader?.winRate || 0);
                        }, 0) / copyInvestments.length).toFixed(1)}%`
                      : "68.2%"
                    }
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">High-accuracy signals</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Axi Safety Rating</div>
                    <div className="text-2xl font-black text-[#D31C2B] font-mono mt-1">SECURED</div>
                    <p className="text-[10px] text-teal-600 font-semibold mt-1">Negative Balance Guard</p>
                  </div>
                  <div className="p-2.5 bg-red-50 text-[#D31C2B] rounded-xl hidden sm:block">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Active Subscriptions / Copy Positions list */}
              {copyInvestments.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Active Copy Subscriptions</h4>
                      <p className="text-xs text-gray-400 font-medium">Real-time performance of your mirrored master strategies.</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-teal-50 text-teal-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Live Mirroring Active
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3">Master Trader</th>
                          <th className="py-3">Allocated Capital</th>
                          <th className="py-3 text-right">Stop Loss Limit</th>
                          <th className="py-3 text-right">Take Profit Limit</th>
                          <th className="py-3 text-right">Mirrored Floating P&L</th>
                          <th className="py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {copyInvestments.map(inv => (
                          <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#D31C2B]/10 border border-[#D31C2B]/20 flex items-center justify-center font-extrabold text-[#D31C2B] text-xs">
                                {inv.traderName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-extrabold text-gray-900">{inv.traderName}</div>
                                <div className="text-[10px] text-gray-400 font-medium">Started: {inv.createdAt}</div>
                              </div>
                            </td>
                            <td className="py-3.5 font-mono font-bold text-gray-800">
                              ${inv.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 font-mono text-gray-500 text-right">
                              -{inv.sl}%
                            </td>
                            <td className="py-3.5 font-mono text-gray-500 text-right">
                              +{inv.tp}%
                            </td>
                            <td className={`py-3.5 font-mono font-bold text-right text-sm ${inv.profit >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                              {inv.profit >= 0 ? '+' : ''}${inv.profit.toFixed(2)} ({((inv.profit / inv.amount) * 100).toFixed(2)}%)
                            </td>
                            <td className="py-3.5 text-right">
                              <button 
                                onClick={() => onStopCopying(inv.id)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-[#D31C2B] hover:border-red-200 border border-transparent rounded-xl text-[11px] font-bold transition-all active:scale-95"
                              >
                                Stop Copying
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Discover Master Traders Gallery */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Discover Axi Master Traders</h3>
                  <p className="text-xs text-gray-500 mt-1">Copy verified strategies instantly. Automated executions mapped proportionally to your account size.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {copyTraders.map(trader => {
                    const isCopied = copyInvestments.some(inv => inv.traderId === trader.id);
                    return (
                      <div key={trader.id} className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between transition-all">
                        <div className="p-6 space-y-4">
                          {/* Card Top */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center font-black text-[#D31C2B] text-sm">
                                {trader.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">{trader.name}</h4>
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded uppercase mt-0.5">{trader.strategy}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Return (30d)</span>
                              <span className="text-lg font-black text-teal-600 font-mono">+{trader.return30d}%</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            {trader.description}
                          </p>

                          {/* Trader Stats grid */}
                          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl text-center">
                            <div>
                              <span className="text-[9px] text-gray-400 font-bold uppercase block">Copiers</span>
                              <span className="font-mono text-xs font-extrabold text-gray-900">{trader.copiers}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400 font-bold uppercase block">Win Rate</span>
                              <span className="font-mono text-xs font-extrabold text-gray-900">{trader.winRate}%</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400 font-bold uppercase block">Risk Rating</span>
                              <span className={`font-mono text-xs font-extrabold px-1.5 py-0.5 rounded ${
                                trader.riskScore <= 4 ? 'bg-emerald-100 text-emerald-800' : trader.riskScore <= 7 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>{trader.riskScore}/10</span>
                            </div>
                          </div>
                        </div>

                        {/* Card bottom CTA */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400 font-semibold">Performance Fee: <strong className="text-gray-800 font-bold">{trader.fee}%</strong></span>
                          {isCopied ? (
                            <button 
                              disabled
                              className="px-4 py-2 bg-gray-200 text-gray-500 rounded-xl text-xs font-bold cursor-not-allowed uppercase tracking-wide"
                            >
                              Mirroring
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                setSelectedTrader(trader);
                                setShowCopyModal(true);
                              }}
                              className="px-4 py-2 bg-[#D31C2B] hover:bg-[#B91623] text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm uppercase tracking-wide flex items-center gap-1"
                            >
                              Copy <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Allocate Investment Modal Backdrop */}
              {showCopyModal && selectedTrader && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-5 animate-fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h4 className="text-base font-black text-gray-900">Configure Copy Settings</h4>
                      <button 
                        onClick={() => setShowCopyModal(false)}
                        className="text-gray-400 hover:text-gray-900 font-bold text-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                      >
                        &times;
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Trader profile banner */}
                      <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-[#D31C2B]/10 text-[#D31C2B] flex items-center justify-center font-black">
                          {selectedTrader.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-gray-900">{selectedTrader.name}</div>
                          <div className="text-[10px] text-gray-500 font-semibold uppercase">{selectedTrader.strategy}</div>
                        </div>
                      </div>

                      {/* Cash limit warnings */}
                      <div className="text-[11px] text-gray-500 flex justify-between font-semibold">
                        <span>Your Settlement cash balance:</span>
                        <span className="font-bold text-gray-900 font-mono">${user.balance.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                      </div>

                      {/* Capital input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Allocation Amount ($)</label>
                        <input 
                          type="number"
                          value={copyAmount}
                          onChange={(e) => setCopyAmount(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 focus:bg-white"
                          placeholder="Allocation (e.g. 1000)"
                        />
                      </div>

                      {/* SL TP config */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Copy Stop Loss (%)</label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={copySl}
                              onChange={(e) => setCopySl(e.target.value)}
                              className="w-full pl-3 pr-7 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Copy Take Profit (%)</label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={copyTp}
                              onChange={(e) => setCopyTp(e.target.value)}
                              className="w-full pl-3 pr-7 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                        💡 Proportionate copying executes all existing and future trades proportionally relative to master trader balance. Max leverage settings synced automatically.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                      <button 
                        onClick={() => setShowCopyModal(false)}
                        className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all uppercase tracking-wide"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          const amt = parseFloat(copyAmount);
                          if (!amt || isNaN(amt) || amt <= 0) {
                            onShowToast('Please specify a valid allocation amount.');
                            return;
                          }
                          if (amt > user.balance) {
                            onShowToast('Insufficient cash funds to copy.');
                            return;
                          }
                          onStartCopying(
                            selectedTrader.id,
                            amt,
                            parseFloat(copySl) || 15,
                            parseFloat(copyTp) || 30
                          );
                          setShowCopyModal(false);
                        }}
                        className="py-2.5 bg-[#D31C2B] hover:bg-[#B91623] text-white font-bold rounded-xl text-xs transition-all uppercase tracking-wide shadow-md shadow-red-500/10"
                      >
                        Confirm Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Funding Portal (Deposit & Withdraw Systems) */}
          {activeTab === 'wallet' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
              
              {/* Form Side - 5 Columns */}
              <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6 self-start">
                
                {/* Funding tab switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setFundingType('deposit')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      fundingType === 'deposit' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Deposit Funds
                  </button>
                  <button 
                    onClick={() => setFundingType('withdrawal')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      fundingType === 'withdrawal' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Withdraw Funds
                  </button>
                </div>

                {/* Subtitle description */}
                <div className="text-center pb-2">
                  <h3 className="text-base font-black text-gray-900">
                    {fundingType === 'deposit' ? 'Add Capital to Trade Account' : 'Request Cash Withdrawal'}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {fundingType === 'deposit' 
                      ? 'Select from multiple local NGN bank and USD crypto options.' 
                      : 'Transfer settled cash balance back into your local bank or crypto network.'}
                  </p>
                </div>

                {/* Deposit Flow */}
                {fundingType === 'deposit' && (
                  <div className="space-y-4">
                    {/* Choose method */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Select Payment Mode</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        <button 
                          onClick={() => setSelectedFundingMethod('bank')}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            selectedFundingMethod === 'bank'
                              ? 'border-[#FFC800] bg-amber-50/50 text-gray-900'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Building className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-[9px] font-bold block">NGN Bank</span>
                        </button>
                        <button 
                          onClick={() => setSelectedFundingMethod('wire')}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            selectedFundingMethod === 'wire'
                              ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Building className="w-4 h-4 mx-auto mb-1 text-[#D31C2B]" />
                          <span className="text-[9px] font-bold block text-nowrap">USD Wire</span>
                        </button>
                        <button 
                          onClick={() => setSelectedFundingMethod('crypto')}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            selectedFundingMethod === 'crypto'
                              ? 'border-teal-600 bg-teal-50/50 text-teal-600'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Coins className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-[9px] font-bold block">Crypto</span>
                        </button>
                        <button 
                          onClick={() => setSelectedFundingMethod('card')}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            selectedFundingMethod === 'card'
                              ? 'border-blue-600 bg-blue-50/50 text-blue-600'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-[9px] font-bold block">USD Card</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Bank Selection */}
                    {selectedFundingMethod === 'bank' && (
                      <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase">Settle via nigerian Bank</label>
                          <select 
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full bg-white border border-gray-200 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none"
                          >
                            <option value="GTBank">Guaranty Trust Bank PLC (GTBank)</option>
                            <option value="Zenith">Zenith Bank PLC</option>
                            <option value="Access">Access Bank PLC</option>
                            <option value="UBA">United Bank for Africa (UBA)</option>
                          </select>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-150 text-[11px] text-gray-600 space-y-1.5">
                          <div className="flex justify-between font-medium">
                            <span>Beneficiary:</span>
                            <span className="font-bold text-gray-950">Axi Broker Limited NGN</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Account Number:</span>
                            <span className="font-mono font-bold text-gray-950">0122345678</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400 font-semibold border-t border-gray-100 pt-1.5">
                            <span>Processing Time:</span>
                            <span className="text-teal-600">INSTANT</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive USD Wire Selection */}
                    {selectedFundingMethod === 'wire' && (
                      <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="bg-white p-3.5 rounded-lg border border-gray-150 text-[11px] text-gray-600 space-y-2">
                          <div className="flex justify-between border-b border-gray-100 pb-1.5">
                            <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[8.5px]">Beneficiary Bank:</span>
                            <span className="font-bold text-gray-950 text-right">JPMorgan Chase Bank, N.A.</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1.5">
                            <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[8.5px]">Beneficiary Name:</span>
                            <span className="font-bold text-[#D31C2B] text-right">AxiTrader Ltd (Global Funding)</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1.5">
                            <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[8.5px]">Account Number:</span>
                            <span className="font-mono font-bold text-gray-950 text-right">US89 CHAS 0210 0002 1482 9103</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1.5">
                            <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[8.5px]">SWIFT Code:</span>
                            <span className="font-mono font-bold text-gray-950 text-right">CHASUS33XXX</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1.5">
                            <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[8.5px]">Routing (ABA):</span>
                            <span className="font-mono font-bold text-gray-950 text-right">021000021</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1.5">
                            <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[8.5px]">Payment Memo:</span>
                            <span className="font-mono font-black text-xs text-[#D31C2B] text-right select-all uppercase">
                              AXI-{(user?.email || "TRADER").split('@')[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400 font-semibold border-t border-gray-100 pt-1.5">
                            <span>Processing Time:</span>
                            <span className="text-amber-600">1-3 BUSINESS DAYS</span>
                          </div>
                        </div>
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[9px] text-amber-800 leading-relaxed font-bold">
                          ⚠️ CRITICAL: Enter the exact Payment Memo "AXI-{(user?.email || "TRADER").split('@')[0].toUpperCase()}" in your bank's wire transfer reference field.
                        </div>
                      </div>
                    )}

                    {/* Crypto Details */}
                    {selectedFundingMethod === 'crypto' && (
                      <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase text-xs">Preferred Token Network</label>
                          <select 
                            value={selectedCrypto}
                            onChange={(e) => setSelectedCrypto(e.target.value)}
                            className="w-full bg-white border border-gray-200 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none"
                          >
                            <option value="USDT-TRC20">USDT (TRON Network TRC-20)</option>
                            <option value="USDT-ERC20">USDT (Ethereum Network ERC-20)</option>
                            <option value="USDC-BASE">USDC (Base Network)</option>
                            <option value="BTC-NATIVE">BTC (Native Bitcoin)</option>
                          </select>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-150 text-[11px] text-gray-600 space-y-1.5">
                          <div className="text-center font-bold text-gray-950 block select-all font-mono py-1 border-dashed border border-gray-300 rounded bg-gray-50">
                            {selectedCrypto.includes('TRC') ? 'TXP5aXU6b1fGrt7Y9pZ4v7A8b' : selectedCrypto.includes('BASE') ? '0x71C7656EC7ab88b098defB751B7401B5f6d147' : '0x3D9488a08D694b8e1B5B7401B5f6d147'}
                          </div>
                          <p className="text-[9px] text-center text-amber-600 font-bold leading-normal">
                            ⚠️ ONLY deposit {selectedCrypto.split('-')[0]} to this exact network. Others will be permanently lost.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card input */}
                    {selectedFundingMethod === 'card' && (
                      <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text"
                            placeholder="Card Number"
                            className="col-span-2 w-full px-3 py-1.5 bg-white border border-gray-200 text-xs rounded-lg focus:outline-none"
                          />
                          <input 
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 text-xs rounded-lg focus:outline-none"
                          />
                          <input 
                            type="text"
                            placeholder="CVV"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 text-xs rounded-lg focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Amount input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Deposit Amount ($ USD)</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="number"
                          value={fundingAmount}
                          onChange={(e) => setFundingAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 focus:bg-white"
                          placeholder="Amount in USD (e.g. 500)"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        const amt = parseFloat(fundingAmount);
                        if (!amt || isNaN(amt) || amt <= 0) {
                          onShowToast('Please specify a valid deposit amount.');
                          return;
                        }
                        const methodString = 
                          selectedFundingMethod === 'bank' ? `NGN Bank (${selectedBank})` : 
                          selectedFundingMethod === 'wire' ? 'JPMorgan USD Wire' :
                          selectedFundingMethod === 'crypto' ? `Crypto (${selectedCrypto})` : 
                          'USD Credit Card';
                        onAddTransaction('deposit', amt, methodString);
                        setFundingAmount('');
                      }}
                      className="w-full bg-[#D31C2B] hover:bg-[#B91623] text-white py-3 rounded-xl font-bold transition-all text-xs tracking-wide shadow-md shadow-red-500/10 uppercase"
                    >
                      Submit Deposit Proof
                    </button>
                  </div>
                )}

                {/* Withdrawal Flow */}
                {fundingType === 'withdrawal' && (
                  <div className="space-y-4">
                    {/* Method Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Withdrawal Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setSelectedFundingMethod('bank')}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            selectedFundingMethod === 'bank'
                              ? 'border-[#D31C2B] bg-red-50/50 text-[#D31C2B]'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Building className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-[10px] font-bold block">Local NGN Bank</span>
                        </button>
                        <button 
                          onClick={() => setSelectedFundingMethod('crypto')}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            selectedFundingMethod === 'crypto'
                              ? 'border-teal-600 bg-teal-50/50 text-teal-600'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Coins className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-[10px] font-bold block">USD Crypto Wallet</span>
                        </button>
                      </div>
                    </div>

                    {/* Bank Details Form */}
                    {selectedFundingMethod === 'bank' && (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase">Receiving Bank</label>
                          <select 
                            value={destinationBank}
                            onChange={(e) => setDestinationBank(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none"
                          >
                            <option value="GTBank">Guaranty Trust Bank</option>
                            <option value="Zenith">Zenith Bank</option>
                            <option value="Access">Access Bank</option>
                            <option value="UBA">United Bank for Africa</option>
                            <option value="FirstBank">First Bank of Nigeria</option>
                          </select>
                        </div>
                        <input 
                          type="text"
                          value={destinationAccount}
                          onChange={(e) => setDestinationAccount(e.target.value)}
                          placeholder="Your 10-Digit Account Number"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-xs font-mono font-bold rounded-lg focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Crypto Destination Details */}
                    {selectedFundingMethod === 'crypto' && (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase">Network / Asset</label>
                          <select 
                            value={selectedCrypto}
                            onChange={(e) => setSelectedCrypto(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none"
                          >
                            <option value="USDT-TRC20">USDT (TRC-20)</option>
                            <option value="USDT-ERC20">USDT (ERC-20)</option>
                            <option value="USDC-BASE">USDC (BASE)</option>
                            <option value="BTC-NATIVE">BTC (Native Network)</option>
                          </select>
                        </div>
                        <input 
                          type="text"
                          value={cryptoAddress}
                          onChange={(e) => setCryptoAddress(e.target.value)}
                          placeholder="Enter your destination wallet address"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-xs font-mono rounded-lg focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Cash balance metrics */}
                    <div className="text-[11px] text-gray-500 flex justify-between font-semibold px-0.5">
                      <span>Available for withdrawal:</span>
                      <span className="font-bold text-gray-950 font-mono">${user.balance.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Withdrawal Amount ($ USD)</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="number"
                          value={fundingAmount}
                          onChange={(e) => setFundingAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 focus:bg-white"
                          placeholder="Amount in USD"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        const amt = parseFloat(fundingAmount);
                        if (!amt || isNaN(amt) || amt <= 0) {
                          onShowToast('Please specify a valid withdrawal amount.');
                          return;
                        }
                        if (amt > user.balance) {
                          onShowToast('Insufficient settled funds for withdrawal.');
                          return;
                        }
                        if (selectedFundingMethod === 'bank' && !destinationAccount) {
                          onShowToast('Please specify your bank account number.');
                          return;
                        }
                        if (selectedFundingMethod === 'crypto' && !cryptoAddress) {
                          onShowToast('Please enter your receiving wallet address.');
                          return;
                        }

                        const methodString = selectedFundingMethod === 'bank' ? `NGN Bank (${destinationBank} - ${destinationAccount})` : `Crypto (${selectedCrypto} - ${cryptoAddress.slice(0,6)}...)`;
                        onAddTransaction('withdrawal', amt, methodString);
                        setFundingAmount('');
                        setDestinationAccount('');
                        setCryptoAddress('');
                      }}
                      className="w-full bg-[#D31C2B] hover:bg-[#B91623] text-white py-3 rounded-xl font-bold transition-all text-xs tracking-wide shadow-md shadow-red-500/10 uppercase"
                    >
                      Request Withdrawal
                    </button>
                  </div>
                )}
              </div>

              {/* Transaction History Log - 7 Columns */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Financial Transaction Ledger</h3>
                    <p className="text-xs text-gray-500 mt-1">Audit trail of NGN and Crypto funding executions for client account #{user.id}.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3">Transaction ID</th>
                          <th className="py-3">Date</th>
                          <th className="py-3">Type</th>
                          <th className="py-3">Amount</th>
                          <th className="py-3">Method</th>
                          <th className="py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {transactions.filter(t => t.userId === user.id).length > 0 ? (
                          transactions
                            .filter(t => t.userId === user.id)
                            .map(t => (
                              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-3.5 font-mono font-bold text-gray-500 uppercase">
                                  {t.id}
                                </td>
                                <td className="py-3.5 text-gray-500">{t.createdAt}</td>
                                <td className="py-3.5 uppercase">
                                  <span className={`inline-flex items-center gap-1 font-bold ${
                                    t.type === 'deposit' ? 'text-teal-600' : 'text-amber-600'
                                  }`}>
                                    {t.type === 'deposit' ? (
                                      <>
                                        <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
                                      </>
                                    ) : (
                                      <>
                                        <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
                                      </>
                                    )}
                                  </span>
                                </td>
                                <td className="py-3.5 font-mono font-bold text-gray-900">
                                  ${t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3.5 text-gray-500 truncate max-w-[120px]" title={t.method}>
                                  {t.method}
                                </td>
                                <td className="py-3.5">
                                  <span className={`inline-block px-2.5 py-0.5 font-bold rounded-full text-[9px] uppercase tracking-wider ${
                                    t.status === 'approved' 
                                      ? 'bg-emerald-50 text-emerald-700' 
                                      : t.status === 'rejected' 
                                      ? 'bg-red-50 text-[#D31C2B]' 
                                      : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {t.status}
                                  </span>
                                  {t.reason && (
                                    <div className="text-[9px] text-red-500 font-semibold mt-0.5 leading-normal max-w-[140px] italic">
                                      Reason: {t.reason}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold uppercase tracking-wider">
                              No financial transactions recorded.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-red-50/40 border border-red-100 rounded-2xl p-5 flex gap-4">
                  <Info className="w-5 h-5 text-[#D31C2B] flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h5 className="font-bold text-gray-900">Broker Direct Settle Information</h5>
                    <p className="text-gray-600 leading-normal font-medium">
                      Bank deposits require 5-15 minutes processing while crypto is approved after 1 network confirmation. All withdrawal operations are processed securely under strict compliance reviews within 1 business day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Confirmation Modal Backdrop */}
          {pendingOrderConfirmation && (
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-5 animate-fade-in duration-200 text-gray-950">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="text-base font-black text-gray-900">Confirm Trading Order</h4>
                  <button 
                    onClick={() => setPendingOrderConfirmation(null)}
                    className="text-gray-400 hover:text-gray-900 font-bold text-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Asset Symbol</span>
                      <span className="font-black text-lg text-gray-900">{pendingOrderConfirmation.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Action</span>
                      <span className={`inline-block px-3 py-1 font-black rounded-lg text-xs uppercase ${
                        pendingOrderConfirmation.type === 'Buy' ? 'bg-emerald-100 text-[#10B981]' : 'bg-red-100 text-[#D31C2B]'
                      }`}>
                        {pendingOrderConfirmation.type}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-100 p-3 rounded-xl">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Volume (Lots)</span>
                      <span className="font-extrabold text-sm text-gray-900">{pendingOrderConfirmation.lotSize.toFixed(2)}</span>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Leverage</span>
                      <span className="font-extrabold text-sm text-gray-900">{leverage}x</span>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Stop Loss</span>
                      <span className="font-mono text-xs font-bold text-gray-900">{pendingOrderConfirmation.stopLoss || 'None'}</span>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Take Profit</span>
                      <span className="font-mono text-xs font-bold text-gray-900">{pendingOrderConfirmation.takeProfit || 'None'}</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between font-semibold text-gray-600">
                      <span>Required Margin:</span>
                      <span className="font-bold text-gray-900 font-mono">${getMarginReq().toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-600">
                      <span>Nominal Spread:</span>
                      <span className="font-bold text-gray-900">0.3 pips</span>
                    </div>
                  </div>

                  {/* One Click Trading activation checkbox within confirmation */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <input 
                      type="checkbox" 
                      id="enableOneClickCheckbox"
                      checked={oneClickTrading}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setOneClickTrading(checked);
                        try {
                          localStorage.setItem('oneClickTrading', String(checked));
                        } catch (err) {}
                      }}
                      className="w-4 h-4 rounded text-[#D31C2B] focus:ring-[#D31C2B] cursor-pointer"
                    />
                    <label htmlFor="enableOneClickCheckbox" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                      Enable One-Click Trading (Do not show confirmation again)
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => setPendingOrderConfirmation(null)}
                      className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-bold text-xs transition-all active:scale-95"
                    >
                      Cancel Order
                    </button>
                    <button 
                      onClick={() => {
                        onPlaceOrder(
                          pendingOrderConfirmation.type,
                          pendingOrderConfirmation.lotSize,
                          pendingOrderConfirmation.stopLoss,
                          pendingOrderConfirmation.takeProfit,
                          pendingOrderConfirmation.symbol
                        );
                        if (onShowToast) {
                          onShowToast(`Instant ${pendingOrderConfirmation.type} order executed for ${pendingOrderConfirmation.lotSize} lots of ${pendingOrderConfirmation.symbol}!`);
                        }
                        setPendingOrderConfirmation(null);
                      }}
                      className={`py-3 rounded-xl font-bold text-xs text-white transition-all active:scale-95 ${
                        pendingOrderConfirmation.type === 'Buy' ? 'bg-[#10B981] hover:bg-[#059669]' : 'bg-[#D31C2B] hover:bg-[#B91623]'
                      }`}
                    >
                      Confirm Execution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Position Close Confirmation Modal Overlay */}
          {pendingCloseConfirmation && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 text-left animate-fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-5 text-gray-800">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D31C2B] animate-ping" /> Confirm Close Position
                  </h4>
                  <button 
                    onClick={() => setPendingCloseConfirmation(null)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <p className="text-gray-500 text-xs font-medium leading-relaxed">
                    Are you sure you want to close this position? It will be settled immediately at current market rates.
                  </p>

                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-150">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Trading Asset</span>
                      <span className="font-bold text-lg text-gray-900">{pendingCloseConfirmation.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Direction</span>
                      <span className={`inline-block px-3 py-1 font-bold rounded-lg text-xs uppercase ${
                        pendingCloseConfirmation.type === 'Buy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-[#D31C2B] border border-red-200'
                      }`}>
                        {pendingCloseConfirmation.type}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 p-3 rounded-xl bg-gray-50">
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Volume (Lots)</span>
                      <span className="font-extrabold text-sm text-gray-800 font-mono">{pendingCloseConfirmation.volume.toFixed(2)}</span>
                    </div>
                    <div className="border border-gray-200 p-3 rounded-xl bg-gray-50">
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Current P&L</span>
                      <span className={`font-mono text-sm font-extrabold ${
                        pendingCloseConfirmation.pnl >= 0 ? 'text-emerald-600' : 'text-[#D31C2B]'
                      }`}>
                        {pendingCloseConfirmation.pnl >= 0 ? '+' : ''}${pendingCloseConfirmation.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div>
                      <span className="text-gray-400 block">Open Price</span>
                      <span className="font-mono font-bold text-gray-700">{pendingCloseConfirmation.openPrice.toFixed(4)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block">Current Price</span>
                      <span className="font-mono font-bold text-gray-700">{pendingCloseConfirmation.currentPrice.toFixed(4)}</span>
                    </div>
                  </div>

                  {/* Checkbox within modal to enable instant execution */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <input 
                      type="checkbox" 
                      id="enableOneClickCloseCheckbox"
                      checked={oneClickTrading}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setOneClickTrading(checked);
                        try {
                          localStorage.setItem('oneClickTrading', String(checked));
                        } catch (err) {}
                      }}
                      className="w-4 h-4 rounded text-[#D31C2B] focus:ring-[#D31C2B] bg-white border-gray-300 cursor-pointer"
                    />
                    <label htmlFor="enableOneClickCloseCheckbox" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                      Enable One-Click Trading (Do not show confirmation again)
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => setPendingCloseConfirmation(null)}
                      className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-bold text-xs transition-all active:scale-95"
                    >
                      Keep Position
                    </button>
                    <button 
                      onClick={() => {
                        onClosePosition(pendingCloseConfirmation.id);
                        if (onShowToast) {
                          onShowToast(`Position for ${pendingCloseConfirmation.symbol} closed successfully`);
                        }
                        setPendingCloseConfirmation(null);
                      }}
                      className="bg-[#D31C2B] hover:bg-[#B91623] py-3 rounded-xl font-bold text-xs text-white transition-all active:scale-95 shadow-md shadow-red-200"
                    >
                      Confirm Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Side helper routine for tab syncing inside DOM components
function switchTraderView(view: string) {
  // Navigation layout updates
}
