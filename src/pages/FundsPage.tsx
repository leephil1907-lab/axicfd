import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { 
  ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Banknote, 
  Bitcoin, ShieldCheck, Clock, CheckCircle, ChevronRight,
  TrendingUp, Award, Zap, Sliders, RefreshCw, LayoutDashboard,
  Copy, ExternalLink, HelpCircle, Lock, UserCheck, AlertCircle,
  BarChart2, FileText, ArrowLeftRight, Check, DollarSign, Download
} from "lucide-react";

export default function FundsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'deposit' | 'withdraw' | 'transfer' | 'history'>('overview');
  
  // Interactive state
  const [selectedAccountId, setSelectedAccountId] = useState('60332183');
  const [showBalance, setShowBalance] = useState(true);

  // Transfer state
  const [transferFrom, setTransferFrom] = useState('60332183');
  const [transferTo, setTransferTo] = useState('60332182');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Quick Deposit state
  const [quickDepAmount, setQuickDepAmount] = useState('250');
  const [quickDepMethod, setQuickDepMethod] = useState('crypto');

  // Withdraw quick state
  const [quickWithdrawAmt, setQuickWithdrawAmt] = useState('');

  const { data: account, isLoading: accountLoading } = trpc.trading.getAccount.useQuery();
  const liveBalance = account ? parseFloat(account.balance.toString()) : 0.00;

  // Accounts list
  const tradingAccounts = [
    {
      id: '60332183',
      number: '60332183',
      platform: 'MT4',
      type: 'Standard Live',
      currency: 'USD',
      server: 'Axi-US51-Live',
      leverage: '1:1000',
      balance: liveBalance,
      equity: liveBalance,
      freeMargin: liveBalance,
      marginLevel: '100%',
      isMain: true,
      badge: 'Axi Select Eligible'
    },
    {
      id: '60332182',
      number: '60332182',
      platform: 'MT5',
      type: 'Pro Live',
      currency: 'USD',
      server: 'Axi-US52-Live',
      leverage: '1:1000',
      balance: 0.00,
      equity: 0.00,
      freeMargin: 0.00,
      marginLevel: '0%',
      isMain: false,
      badge: 'MT5 Multi-Asset'
    }
  ];

  const recentTransactions = [
    { id: 'TX-98412', type: 'Deposit', amount: '+$500.00 USD', method: 'USDT (TRC20)', status: 'Completed', date: '2026-07-22 14:20' },
    { id: 'TX-98104', type: 'Deposit', amount: '+$1,000.00 USD', method: 'Visa Card **** 4829', status: 'Completed', date: '2026-07-20 09:15' },
    { id: 'TX-97552', type: 'Withdrawal', amount: '-$250.00 USD', method: 'Bank Wire (SEPA)', status: 'Approved', date: '2026-07-15 11:45' },
  ];

  const handleInternalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid transfer amount.");
      return;
    }
    if (transferFrom === transferTo) {
      toast.error("Source and destination accounts must be different.");
      return;
    }

    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      toast.success(`Successfully transferred $${amt.toFixed(2)} USD from MT Account #${transferFrom} to #${transferTo}!`, {
        description: "Funds are immediately accessible for live trading on MetaTrader."
      });
      setTransferAmount('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-gray-100 flex flex-col font-sans">
      
      {/* AXI BRANDED CLIENT PORTAL HEADER */}
      <header className="bg-[#0c0f17] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D31C2B] to-red-700 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-950/50">
                AXI
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-wide">Axi</span>
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded">Client Portal</span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider">Official Brokerage Portal</span>
              </div>
            </Link>

            {/* Portal Main Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800 ml-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${activeTab === 'overview' ? 'bg-[#D31C2B] text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('accounts')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${activeTab === 'accounts' ? 'bg-[#D31C2B] text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                My Accounts
              </button>
              <Link
                to="/deposit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Deposit
              </Link>
              <Link
                to="/withdrawal"
                className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Withdraw
              </Link>
              <button
                onClick={() => setActiveTab('transfer')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${activeTab === 'transfer' ? 'bg-[#D31C2B] text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Internal Transfer
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/trading"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Launch WebTrader
            </Link>

            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
              title="Return to Main Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* SUB HEADER PORTAL BANNER */}
      <div className="bg-[#0e121d] border-b border-gray-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">Welcome back, {user?.name || user?.email?.split('@')[0] || 'Axi Trader'}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                  KYC Verified
                </span>
              </div>
              <span className="text-gray-400 text-[11px]">Client ID: AXI-{user?.id?.slice(0, 6).toUpperCase() || '748291'} • Tier 1 Segregated Protection</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-950/80 px-4 py-2 rounded-xl border border-gray-800">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-extrabold block">Total Portfolio Balance</span>
              <span className="font-mono text-sm font-black text-emerald-400">${liveBalance.toFixed(2)} USD</span>
            </div>
            <div className="h-6 w-px bg-gray-800" />
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-extrabold block">Axi Select Status</span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Pro Trader Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN PORTAL BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* TOP METRIC SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#0e121d] border border-gray-800 p-5 rounded-2xl relative overflow-hidden group hover:border-gray-700 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Live Account Balance</span>
                <h3 className="text-2xl font-black font-mono text-white mt-1">${liveBalance.toFixed(2)}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800/80">
              <span>Main MT4 #60332183</span>
              <span className="text-emerald-400 font-bold">100% Available</span>
            </div>
          </div>

          <div className="bg-[#0e121d] border border-gray-800 p-5 rounded-2xl relative overflow-hidden group hover:border-gray-700 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active Margin Leverage</span>
                <h3 className="text-2xl font-black font-mono text-white mt-1">1:1000</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800/80">
              <span>Server: Axi-US51-Live</span>
              <span className="text-blue-400 font-bold">Max Leverage</span>
            </div>
          </div>

          <div className="bg-[#0e121d] border border-gray-800 p-5 rounded-2xl relative overflow-hidden group hover:border-gray-700 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Axi Select Edge Score</span>
                <h3 className="text-2xl font-black font-mono text-amber-400 mt-1">78 / 100</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800/80">
              <span>Progression Tier 1</span>
              <span className="text-amber-400 font-bold">Eligible for $50k</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-950/40 via-gray-900 to-gray-900 border border-red-500/30 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">Axi Banking Quick Portal</span>
              <h4 className="text-sm font-extrabold text-white mt-0.5">Instant Funding & Payouts</h4>
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                to="/deposit"
                className="flex-1 py-2 rounded-xl bg-[#D31C2B] hover:bg-red-700 text-white font-extrabold text-xs text-center transition-all shadow"
              >
                Deposit
              </Link>
              <Link
                to="/withdrawal"
                className="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-extrabold text-xs text-center transition-all"
              >
                Withdraw
              </Link>
            </div>
          </div>

        </div>

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { key: 'overview', label: 'Client Dashboard' },
            { key: 'accounts', label: 'MetaTrader Accounts' },
            { key: 'transfer', label: 'Internal Account Transfer' },
            { key: 'history', label: 'Transaction History' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#D31C2B] text-white shadow-lg shadow-red-950/50'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & MY ACCOUNTS */}
        {(activeTab === 'overview' || activeTab === 'accounts') && (
          <div className="space-y-8">
            
            {/* MY TRADING ACCOUNTS SECTION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Live MetaTrader Accounts</h2>
                  <p className="text-xs text-gray-400">Manage your active MT4 & MT5 live trading accounts with Axi.</p>
                </div>

                <Link
                  to="/open-account"
                  className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                  + Open Additional Account
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tradingAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-[#0e121d] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6"
                  >
                    <div>
                      {/* Account Top Header */}
                      <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                            acc.platform === 'MT4' ? 'bg-red-950 border border-red-500/40 text-red-400' : 'bg-blue-950 border border-blue-500/40 text-blue-400'
                          }`}>
                            {acc.platform}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-extrabold text-white">Standard #{acc.number}</h3>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                                {acc.type}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400 font-mono">{acc.server} • Leverage {acc.leverage}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                          {acc.badge}
                        </span>
                      </div>

                      {/* Account Numbers Matrix */}
                      <div className="grid grid-cols-2 gap-4 my-4 bg-gray-950/60 p-4 rounded-xl border border-gray-800/60 font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400 font-sans block uppercase font-bold">Balance</span>
                          <strong className="text-base text-white font-extrabold">${acc.balance.toFixed(2)} USD</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-sans block uppercase font-bold">Equity</span>
                          <strong className="text-base text-emerald-400 font-extrabold">${acc.equity.toFixed(2)} USD</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-sans block uppercase font-bold">Free Margin</span>
                          <strong className="text-xs text-gray-200">${acc.freeMargin.toFixed(2)} USD</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-sans block uppercase font-bold">Margin Level</span>
                          <strong className="text-xs text-gray-200">{acc.marginLevel}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Account Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800/80">
                      <Link
                        to={`/deposit?account=${acc.number}`}
                        className="py-2.5 rounded-xl bg-[#D31C2B] hover:bg-red-700 text-white font-extrabold text-xs text-center transition-all flex items-center justify-center gap-1 shadow"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        Deposit
                      </Link>
                      <Link
                        to={`/withdrawal?account=${acc.number}`}
                        className="py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 font-extrabold text-xs text-center transition-all flex items-center justify-center gap-1"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                        Withdraw
                      </Link>
                      <Link
                        to="/trading"
                        className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs text-center transition-all flex items-center justify-center gap-1 shadow"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Trade
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AXI SELECT CAPITAL ALLOCATION BANNER */}
            <div className="bg-gradient-to-r from-gray-900 via-[#121827] to-gray-900 border border-amber-500/30 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Axi Select Incubator Program</h3>
                    <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                      Up to $1,000,000 USD Funding
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 max-w-xl">
                    Get funded by Axi without risking your own capital. Build your Edge Score on your live account and unlock up to $1M in institutional allocation.
                  </p>
                </div>
              </div>

              <Link
                to="/axi-select"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-black text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 shadow-xl shadow-amber-950/50"
              >
                <span>View Axi Select Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

        {/* TAB 2: INTERNAL TRANSFER */}
        {activeTab === 'transfer' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">Internal Account Transfer</h2>
              <p className="text-xs text-gray-400">Transfer live funds instantly between your MT4 and MT5 trading accounts with zero fees.</p>
            </div>

            <div className="bg-[#0e121d] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <form onSubmit={handleInternalTransfer} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                      Transfer From
                    </label>
                    <select
                      value={transferFrom}
                      onChange={(e) => setTransferFrom(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-extrabold text-white focus:outline-none focus:border-[#D31C2B]"
                    >
                      <option value="60332183">MT4 Standard #60332183 (${liveBalance.toFixed(2)} USD)</option>
                      <option value="60332182">MT5 Pro #60332182 ($0.00 USD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                      Transfer To
                    </label>
                    <select
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-extrabold text-white focus:outline-none focus:border-[#D31C2B]"
                    >
                      <option value="60332182">MT5 Pro #60332182 ($0.00 USD)</option>
                      <option value="60332183">MT4 Standard #60332183 (${liveBalance.toFixed(2)} USD)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.01"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-3 text-base font-mono font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isTransferring}
                  className="w-full py-4 rounded-xl bg-[#D31C2B] hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{isTransferring ? 'Processing Internal Transfer...' : 'Execute Instant Transfer'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">Funding & Transaction History</h2>
              <p className="text-xs text-gray-400">Complete record of your deposits, withdrawals, and internal transfers.</p>
            </div>

            <div className="bg-[#0e121d] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950 text-gray-400 font-extrabold uppercase tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Gateway / Method</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-mono text-gray-300">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{tx.id}</td>
                        <td className="px-6 py-4 font-sans font-bold">
                          <span className={`inline-flex items-center gap-1 ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {tx.type === 'Deposit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-sans">{tx.method}</td>
                        <td className={`px-6 py-4 font-bold ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 text-gray-400">{tx.date}</td>
                        <td className="px-6 py-4 font-sans">
                          <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#0c0f17] border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Axi Financial Trading Services. Regulated Brokerage Portal. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
