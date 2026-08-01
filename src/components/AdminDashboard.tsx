import { useState } from 'react';
import { 
  Users, TrendingUp, AlertTriangle, Search, Activity, 
  UserCheck, ShieldCheck, DollarSign, Calendar, BarChart3, ShieldAlert,
  ArrowUpRight, ArrowDownLeft, Check, X, RefreshCw, AlertCircle, Filter, ChevronDown, MoreHorizontal
} from 'lucide-react';
import { User, Trade, AppView, Transaction } from '../types';
import GlobalDropdown from './GlobalDropdown';

interface AdminDashboardProps {
  users: User[];
  trades: Trade[];
  transactions: Transaction[];
  onLogout: () => void;
  onUpdateUserStatus: (id: number, status: 'active' | 'suspended' | 'pending') => void;
  onCreditUser: (id: number, amount: number) => void;
  onProcessTransaction: (transactionId: string, action: 'approve' | 'reject', reason?: string) => void;
  onShowToast: (message: string) => void;
  setView: (view: AppView) => void;
}

export default function AdminDashboard({
  users,
  trades,
  transactions,
  onLogout,
  onUpdateUserStatus,
  onCreditUser,
  onProcessTransaction,
  onShowToast,
  setView
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'trades' | 'transactions' | 'analytics'>('overview');
  const [userQuery, setUserQuery] = useState('');
  const [tradeQuery, setTradeQuery] = useState('');

  // Calculate statistics
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const totalEquity = users.reduce((sum, u) => sum + u.equity, 0);
  const openPositionsCount = trades.filter(t => t.status === 'FILLED').length;
  const marginCallsCount = users.filter(u => u.balance < 200).length;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredTrades = trades.filter(t => 
    t.user.toLowerCase().includes(tradeQuery.toLowerCase()) || 
    t.symbol.toLowerCase().includes(tradeQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="bg-gray-900 text-white h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setView('landing')}
            className="text-2xl font-black text-white tracking-tighter cursor-pointer select-none flex items-baseline"
          >
            ax<span className="text-[#D31C2B] font-black">i</span>
            <span className="w-1.5 h-1.5 bg-[#FFC800] rounded-full ml-0.5 animate-pulse"></span>
            <span className="text-xs text-gray-400 font-semibold tracking-wide ml-3 uppercase">Broker Admin</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {(['overview', 'users', 'trades', 'transactions', 'analytics'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? 'bg-white/15 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Module Selector Dropdown for concise header space */}
          <div className="lg:hidden">
            <GlobalDropdown
              trigger={{
                label: `Module: ${activeTab.toUpperCase()}`,
                icon: Activity,
                variant: 'dark',
                size: 'sm',
                className: 'border-gray-700 font-extrabold text-xs'
              }}
              align="left"
              width="w-56"
              items={[
                { id: 'overview', label: 'Overview Dashboard', icon: Activity, selected: activeTab === 'overview', onClick: () => setActiveTab('overview') },
                { id: 'users', label: 'Users Directory', icon: Users, selected: activeTab === 'users', onClick: () => setActiveTab('users') },
                { id: 'trades', label: 'Trades History', icon: BarChart3, selected: activeTab === 'trades', onClick: () => setActiveTab('trades') },
                { id: 'transactions', label: 'Financial Transactions', icon: DollarSign, selected: activeTab === 'transactions', onClick: () => setActiveTab('transactions') },
                { id: 'analytics', label: 'Platform Analytics', icon: TrendingUp, selected: activeTab === 'analytics', onClick: () => setActiveTab('analytics') },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Actions Dropdown */}
          <GlobalDropdown
            trigger={{
              label: 'Admin Tools',
              icon: ShieldCheck,
              variant: 'glass',
              size: 'sm',
              className: 'text-xs font-bold'
            }}
            align="right"
            width="w-60"
            header={<span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Quick Admin Commands</span>}
            items={[
              { id: 'refresh', label: 'Refresh All Feeds', icon: RefreshCw, onClick: () => onShowToast('System feeds updated successfully.') },
              { id: 'logs', label: 'View Security Audit Logs', icon: ShieldAlert, onClick: () => onShowToast('Audit logs exported.') },
              { id: 'credit-all', label: 'Inject Demo Liquidity', icon: DollarSign, onClick: () => onShowToast('Demo liquidity allocated to pool.') },
            ]}
          />

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-xs text-gray-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>SECURE CONSOLE</span>
          </div>
          <button 
            onClick={onLogout}
            className="bg-[#D31C2B] hover:bg-[#B91623] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95 shadow"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Panel Body */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        
        {/* Mobile Navigation tab bar */}
        <div className="flex md:hidden bg-gray-150 p-1.5 rounded-2xl gap-1">
          {(['overview', 'users', 'trades', 'transactions', 'analytics'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === tab ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard statistics overview row */}
        {activeTab === 'overview' && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Traders</div>
                  <div className="text-3xl font-extrabold text-gray-950 font-mono mt-1">{users.length}</div>
                  <p className="text-[10px] text-teal-600 font-bold mt-1">✓ Active trading terminals</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Accumulated Balance</div>
                  <div className="text-3xl font-extrabold text-gray-950 font-mono mt-1">
                    ${totalBalance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[10px] text-teal-600 font-bold mt-1">Direct Bank Transfers</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-[#10B981] rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Open Positions</div>
                  <div className="text-3xl font-extrabold text-gray-950 font-mono mt-1">{openPositionsCount}</div>
                  <p className="text-[10px] text-amber-500 font-bold mt-1">Simulated feeds</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Margin Alerts</div>
                  <div className="text-3xl font-extrabold text-red-500 font-mono mt-1">{marginCallsCount}</div>
                  <p className="text-[10px] text-red-500 font-bold mt-1">Below $200 threshold</p>
                </div>
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </section>

            {/* Recent executed trades */}
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 px-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Recent Executed Trades</h3>
                
                <div className="relative w-64">
                  <input 
                    type="text" 
                    placeholder="Search trades by user, asset..."
                    value={tradeQuery}
                    onChange={(e) => setTradeQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D31C2B] focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Asset</th>
                      <th className="px-6 py-3">Direction</th>
                      <th className="px-6 py-3">Lots</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">P&L</th>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                    {filteredTrades.length > 0 ? (
                      [...filteredTrades].reverse().map(t => (
                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3.5 text-gray-400">#{t.id}</td>
                          <td className="px-6 py-3.5 font-bold text-gray-900">{t.user}</td>
                          <td className="px-6 py-3.5 font-black text-gray-905">{t.symbol}</td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                              t.type === 'Buy' ? 'bg-emerald-50 text-[#10B981]' : 'bg-red-50 text-[#D31C2B]'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 font-mono text-gray-700">{t.volume.toFixed(2)}</td>
                          <td className="px-6 py-3.5 font-mono text-gray-800">${t.price.toLocaleString('en', { minimumFractionDigits: 2 })}</td>
                          <td className={`px-6 py-3.5 font-mono ${t.pnl >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                            {t.pnl >= 0 ? '+' : ''}${t.pnl.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-3.5 text-gray-400 font-mono">{t.time}</td>
                          <td className="px-6 py-3.5">
                            <span className="inline-block px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[9px] uppercase font-black">
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center py-12 text-gray-400 uppercase font-black tracking-widest text-xs">
                          No recent trades match search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Users Accounts Directory */}
        {activeTab === 'users' && (
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 px-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Registered Client Directory</h3>
              
              <div className="relative w-64">
                <input 
                  type="text" 
                  placeholder="Search client name or email..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D31C2B] focus:bg-white"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Client ID</th>
                    <th className="px-6 py-3">Full Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Cash Balance</th>
                    <th className="px-6 py-3">Equity Balance</th>
                    <th className="px-6 py-3">Account Status</th>
                    <th className="px-6 py-3">Joined Date</th>
                    <th className="px-6 py-3 text-center">Direct Administration Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5 text-gray-400">#{u.id}</td>
                        <td className="px-6 py-3.5 font-extrabold text-gray-950">{u.name}</td>
                        <td className="px-6 py-3.5 text-gray-500 font-mono">{u.email}</td>
                        <td className="px-6 py-3.5 font-mono text-gray-800 font-bold">
                          ${u.balance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-gray-800">
                          ${u.equity.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            u.status === 'active' 
                              ? 'bg-teal-50 text-teal-700 border border-teal-100' 
                              : u.status === 'suspended' 
                              ? 'bg-red-50 text-red-600 border border-red-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-gray-400 font-mono">{u.joined}</td>
                        <td className="px-6 py-3.5 flex justify-center">
                          <GlobalDropdown
                            trigger={{
                              label: 'Actions',
                              icon: MoreHorizontal,
                              variant: 'default',
                              size: 'sm',
                              className: 'border-gray-200 text-[10px] font-extrabold py-1 px-2.5'
                            }}
                            align="right"
                            width="w-48"
                            items={[
                              u.status === 'active'
                                ? {
                                    id: 'suspend',
                                    label: 'Suspend Account',
                                    danger: true,
                                    onClick: () => {
                                      onUpdateUserStatus(u.id, 'suspended');
                                      onShowToast(`Client ${u.name} has been SUSPENDED.`);
                                    }
                                  }
                                : {
                                    id: 'activate',
                                    label: 'Activate Account',
                                    onClick: () => {
                                      onUpdateUserStatus(u.id, 'active');
                                      onShowToast(`Client ${u.name} activated.`);
                                    }
                                  },
                              {
                                id: 'credit-1k',
                                label: 'Inject $1,000 Credit',
                                icon: DollarSign,
                                onClick: () => {
                                  onCreditUser(u.id, 1000);
                                  onShowToast(`Injected $1,000 credit into ${u.name}'s account.`);
                                }
                              },
                              {
                                id: 'credit-5k',
                                label: 'Inject $5,000 Credit',
                                icon: DollarSign,
                                onClick: () => {
                                  onCreditUser(u.id, 5000);
                                  onShowToast(`Injected $5,000 credit into ${u.name}'s account.`);
                                }
                              }
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">
                        No clients found match criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Extended trades listing */}
        {activeTab === 'trades' && (
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 px-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">All Executed Live Trade History Logs</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Trade ID</th>
                    <th className="px-6 py-3">Trader Name</th>
                    <th className="px-6 py-3">Instrument</th>
                    <th className="px-6 py-3">Lot size</th>
                    <th className="px-6 py-3">Exec Price</th>
                    <th className="px-6 py-3">Final P&L</th>
                    <th className="px-6 py-3">Log Time</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                  {trades.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 text-gray-400">#{t.id}</td>
                      <td className="px-6 py-3.5 text-gray-900">{t.user}</td>
                      <td className="px-6 py-3.5 font-bold text-gray-950">{t.symbol}</td>
                      <td className="px-6 py-3.5 font-mono text-gray-700">{t.volume.toFixed(2)}</td>
                      <td className="px-6 py-3.5 font-mono text-gray-800">${t.price.toLocaleString()}</td>
                      <td className={`px-6 py-3.5 font-mono font-bold ${t.pnl >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 font-mono">{t.time}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-black ${
                          t.status === 'CLOSED' ? 'bg-gray-100 text-gray-500' : 'bg-teal-50 text-teal-700'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Visual Analytics Tab */}
        {activeTab === 'analytics' && (
          <section className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Trading Volume Index by Asset Symbol</h3>
              <p className="text-xs text-gray-400 mt-1">Calculates aggregate nominal trades routed via direct connection cages.</p>
            </div>

            <div className="h-80 relative flex flex-col justify-end">
              <div className="flex items-end justify-around h-64 gap-4 px-4 border-b border-gray-100">
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="text-xs font-black text-gray-900 font-mono">$847K</div>
                  <div className="w-full max-w-[48px] bg-[#D31C2B] rounded-t-xl" style={{ height: '85%' }}></div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">EUR/USD</div>
                </div>

                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="text-xs font-black text-gray-900 font-mono">$623K</div>
                  <div className="w-full max-w-[48px] bg-blue-500 rounded-t-xl" style={{ height: '65%' }}></div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">GBP/USD</div>
                </div>

                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="text-xs font-black text-gray-900 font-mono">$534K</div>
                  <div className="w-full max-w-[48px] bg-teal-600 rounded-t-xl" style={{ height: '56%' }}></div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">BTC/USD</div>
                </div>

                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="text-xs font-black text-gray-900 font-mono">$412K</div>
                  <div className="w-full max-w-[48px] bg-yellow-500 rounded-t-xl" style={{ height: '43%' }}></div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">XAU/USD</div>
                </div>

                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="text-xs font-black text-gray-900 font-mono">$187K</div>
                  <div className="w-full max-w-[48px] bg-indigo-500 rounded-t-xl" style={{ height: '22%' }}></div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">ETH/USD</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Transactions Funding Approvals Tab */}
        {activeTab === 'transactions' && (
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="p-5 px-6 border-b border-gray-200">
              <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Client Funding Approvals Ledger</h3>
              <p className="text-xs text-gray-400 mt-1">Review, approve, or reject client deposits and withdrawals. Approving automatically updates the client's balance in real-time.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Payment Method Info</th>
                    <th className="px-6 py-3">Date Submitted</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                  {transactions.length > 0 ? (
                    [...transactions].reverse().map(t => {
                      const client = users.find(u => u.id === t.userId);
                      return (
                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-gray-400 uppercase">#{t.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-950">{client?.name || `User ID #${t.userId}`}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{client?.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 font-extrabold ${
                              t.type === 'deposit' ? 'text-teal-600' : 'text-amber-600'
                            }`}>
                              {t.type === 'deposit' ? (
                                <>
                                  <ArrowDownLeft className="w-4 h-4" /> Deposit
                                </>
                              ) : (
                                <>
                                  <ArrowUpRight className="w-4 h-4" /> Withdrawal
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-black text-gray-900 text-sm">
                            ${t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]" title={t.method}>
                            {t.method}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-400">{t.createdAt}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              t.status === 'approved' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : t.status === 'rejected' 
                                ? 'bg-red-50 text-[#D31C2B] border border-red-100' 
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {t.status}
                            </span>
                            {t.reason && (
                              <p className="text-[9px] text-red-500 font-semibold italic mt-0.5 max-w-[140px]">
                                {t.reason}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {t.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => {
                                    onProcessTransaction(t.id, 'approve');
                                    onShowToast(`Transaction #${t.id} successfully APPROVED.`);
                                  }}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 rounded-lg transition-all active:scale-90"
                                  title="Approve Transaction"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    const reason = prompt("Enter rejection reason (optional):") || "Rejected by Administrator";
                                    onProcessTransaction(t.id, 'reject', reason);
                                    onShowToast(`Transaction #${t.id} REJECTED.`);
                                  }}
                                  className="p-1.5 bg-red-50 hover:bg-red-600 text-[#D31C2B] hover:text-white rounded-lg border border-red-200 rounded-lg transition-all active:scale-90"
                                  title="Reject Transaction"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Settled</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400 font-bold uppercase tracking-wider">
                        No financial transactions have been submitted.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
