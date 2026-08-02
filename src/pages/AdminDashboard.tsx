import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import { copyToClipboard } from "@/lib/copyToClipboard";
import { 
  ChevronLeft, Users, DollarSign, TrendingUp, BarChart3, 
  Shield, Activity, Search, CheckCircle, XCircle, Clock, ArrowUpDown,
  Globe, Terminal, Copy, ExternalLink, ShieldCheck, Eye, FileText, X, History,
  Headset, MessageSquare, Send
} from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeSection, setActiveSection] = useState('overview')

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const devUrl = currentOrigin.includes('-pre-') ? currentOrigin.replace('-pre-', '-dev-') : currentOrigin;
  const prodUrl = currentOrigin.includes('-dev-') ? currentOrigin.replace('-dev-', '-pre-') : currentOrigin;

  const stripeDevWebhook = `${devUrl}/api/webhooks/stripe`;
  const stripeProdWebhook = `${prodUrl}/api/webhooks/stripe`;
  const nowPaymentsDevWebhook = `${devUrl}/api/webhooks/nowpayments`;
  const nowPaymentsProdWebhook = `${prodUrl}/api/webhooks/nowpayments`;

  const handleCopy = (text: string) => {
    copyToClipboard(text);
  };

  // Bank & Wallet details form states
  const [bankName, setBankName] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [iban, setIban] = useState('')
  const [swift, setSwift] = useState('')
  const [referencePrefix, setReferencePrefix] = useState('')
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { data: stats } = trpc.admin.stats.useQuery()
  const { data: users, refetch: refetchUsers } = trpc.admin.users.useQuery({ page: currentPage, search: searchQuery || undefined })
  const { data: allPositions } = trpc.admin.allPositions.useQuery()
  const { data: allTrades } = trpc.admin.allTrades.useQuery()
  const { data: deposits } = trpc.admin.deposits.useQuery()
  const { data: withdrawals } = trpc.admin.withdrawals.useQuery()
  const { data: kycRequests, refetch: refetchKyc } = trpc.admin.getKycRequests.useQuery()
  const { data: auditLogs, refetch: refetchAuditLogs } = trpc.admin.getAuditLogs.useQuery()
  const { data: supportMessages, refetch: refetchSupportMessages } = trpc.admin.getSupportMessages.useQuery(undefined, { refetchInterval: 5000 });
  const { data: stripeTestResult, refetch: refetchStripeTest, isFetching: isTestingStripe } = trpc.trading.testStripeConnection.useQuery();

  const [selectedSupportUserId, setSelectedSupportUserId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const replySupportMutation = trpc.admin.replySupportMessage.useMutation({
    onSuccess: () => {
      toast.success("Reply sent to user live chat.");
      setReplyText('');
      if (refetchSupportMessages) refetchSupportMessages();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send support reply.");
    }
  });

  const [adjustBalanceUserId, setAdjustBalanceUserId] = useState<number | null>(null)
  const [adjustAmount, setAdjustAmount] = useState<string>('')
  const [adjustReason, setAdjustReason] = useState<string>('')

  const adjustBalanceMutation = trpc.admin.adjustUserBalance.useMutation({
    onSuccess: () => {
      toast.success("User balance updated successfully!");
      setAdjustBalanceUserId(null);
      setAdjustAmount('');
      setAdjustReason('');
      refetchUsers();
      refetchAuditLogs();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to adjust balance.");
    }
  });

  // Lightbox & Rejection States for KYC
  const [selectedKycPhoto, setSelectedKycPhoto] = useState<string | null>(null)
  const [rejectionModalId, setRejectionModalId] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const approveKycMutation = trpc.admin.approveKyc.useMutation({
    onSuccess: (res) => {
      toast.success(res.message || "KYC request approved!");
      refetchKyc();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to approve KYC.");
    }
  })

  const rejectKycMutation = trpc.admin.rejectKyc.useMutation({
    onSuccess: (res) => {
      toast.success(res.message || "KYC request rejected.");
      setRejectionModalId(null);
      setRejectionReason('');
      refetchKyc();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to reject KYC.");
    }
  })

  const utils = trpc.useUtils()

  // Fetch dynamic bank details
  const { data: bankData } = trpc.trading.getBankDetails.useQuery()

  // Prefill form when data is loaded
  useEffect(() => {
    if (bankData) {
      setBankName(bankData.bankName || '')
      setBeneficiary(bankData.beneficiary || '')
      setAccountName(bankData.accountName || '')
      setAccountNumber(bankData.accountNumber || '')
      setPhoneNumber(bankData.phoneNumber || '')
      setIban(bankData.iban || '')
      setSwift(bankData.swift || '')
      setReferencePrefix(bankData.referencePrefix || '')
      setCryptoWalletAddress(bankData.cryptoWalletAddress || '')
      setQrCodeUrl(bankData.qrCodeUrl || '')
    }
  }, [bankData])

  const updateBankMutation = trpc.admin.updateBankDetails.useMutation({
    onSuccess: () => {
      toast.success("Platform bank and receiving wallet details updated!");
      utils.trading.getBankDetails.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save bank details.");
    }
  })

  const testTelegramMutation = trpc.admin.testTelegramNotification.useMutation({
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Telegram confirmation notification sent successfully!");
      } else {
        toast.error("Telegram error: Verify bot is started or Chat ID is correct.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Error triggering Telegram bot");
    }
  })

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateBankMutation.mutate({
      bankName,
      beneficiary,
      accountName,
      accountNumber,
      phoneNumber,
      iban,
      swift,
      referencePrefix,
      cryptoWalletAddress,
      qrCodeUrl
    });
  };

  const approveMutation = trpc.admin.approveWithdrawal.useMutation({
    onSuccess: () => {
      toast.success("Transaction approved successfully!");
      utils.admin.withdrawals.invalidate()
      utils.admin.deposits.invalidate()
      utils.admin.stats.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Failed to approve transaction.");
    }
  })
  const rejectMutation = trpc.admin.rejectWithdrawal.useMutation({
    onSuccess: () => {
      toast.success("Transaction rejected successfully!");
      utils.admin.withdrawals.invalidate()
      utils.admin.deposits.invalidate()
      utils.admin.stats.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Failed to reject transaction.");
    }
  })

  const totalVolume = allTrades?.reduce((sum, t) => sum + parseFloat(t.volume.toString()), 0) || 0
  const totalPnl = allTrades?.reduce((sum, t) => sum + parseFloat(t.netPnl.toString()), 0) || 0

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-900">
      {/* Header - AXI Red */}
      <div className="bg-[#D31C2B]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </Link>
              <div className="h-6 w-px bg-white/30" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-white" />
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span>Admin:</span>
              <span className="text-white font-medium">{user?.name || user?.email || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - White */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { key: 'overview', icon: BarChart3, label: 'Overview' },
              { key: 'users', icon: Users, label: 'Users' },
              { key: 'kyc', icon: ShieldCheck, label: 'KYC & ID Verification' },
              { key: 'support', icon: Headset, label: 'Live Support Desk' },
              { key: 'trades', icon: TrendingUp, label: 'Trades' },
              { key: 'positions', icon: Activity, label: 'Positions' },
              { key: 'funds', icon: DollarSign, label: 'Funds' },
              { key: 'settings', icon: Shield, label: 'Platform Bank Details' },
              { key: 'webhooks', icon: Globe, label: 'Webhooks & IPN' },
              { key: 'audit', icon: History, label: 'Activity & Audit Logs' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === item.key ? 'border-[#D31C2B] text-[#D31C2B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards - White cards on cream background */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
                { label: 'Active Accounts', value: stats?.activeAccounts || 0, icon: CheckCircle, color: 'green' },
                { label: 'Open Positions', value: stats?.openPositions || 0, icon: Activity, color: 'yellow' },
                { label: 'Total P&L', value: `$${totalPnl.toFixed(2)}`, icon: TrendingUp, color: totalPnl >= 0 ? 'green' : 'red' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <stat.icon className={`w-5 h-5 ${stat.color === 'blue' ? 'text-blue-500' : stat.color === 'green' ? 'text-green-500' : stat.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Volume', value: `${totalVolume.toFixed(2)} lots`, icon: BarChart3, color: 'purple' },
                { label: 'Total Deposits', value: `$${stats?.totalDeposits || 0}`, icon: DollarSign, color: 'green' },
                { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals || 0, icon: Clock, color: 'orange' },
                { label: 'Avg Trade Size', value: `${(totalVolume / (allTrades?.length || 1)).toFixed(2)} lots`, icon: ArrowUpDown, color: 'cyan' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <stat.icon className={`w-5 h-5 ${stat.color === 'purple' ? 'text-purple-500' : stat.color === 'green' ? 'text-green-500' : stat.color === 'orange' ? 'text-orange-500' : 'text-cyan-500'}`} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity - White cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Trades</h3>
                <div className="space-y-2">
                  {allTrades?.slice(0, 5).map(trade => (
                    <div key={trade.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${trade.direction === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trade.direction.toUpperCase()}</span>
                        <span className="text-sm text-gray-900">{trade.symbol}</span>
                      </div>
                      <div className={`text-sm font-mono font-semibold ${Number(trade.netPnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Number(trade.netPnl) >= 0 ? '+' : ''}${Number(trade.netPnl).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Pending Withdrawals</h3>
                <div className="space-y-2">
                  {withdrawals?.filter(w => w.status === 'pending').slice(0, 5).map(w => (
                    <div key={w.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="text-sm text-gray-900">${Number(w.amount).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{w.paymentMethod}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100">Approve</button>
                        <button className="text-xs px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100">Reject</button>
                      </div>
                    </div>
                  ))}
                  {(!withdrawals || withdrawals.filter(w => w.status === 'pending').length === 0) && (
                    <div className="text-center text-gray-400 py-4">No pending withdrawals</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* USERS SECTION */}
        {activeSection === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 w-64 focus:outline-none focus:border-[#D31C2B] shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-right px-4 py-3">Balance</th>
                    <th className="text-right px-4 py-3">Equity</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.users?.map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D31C2B] to-red-700 flex items-center justify-center text-white font-bold text-xs">
                            {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-900 font-medium">{u.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{u.email || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">${Number(u.balance || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">${Number(u.equity || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs ${u.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setAdjustBalanceUserId(u.id);
                            setAdjustAmount('');
                            setAdjustReason('');
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-all"
                        >
                          Adjust Balance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRADES SECTION */}
        {activeSection === 'trades' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">All Trades</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Symbol</th>
                    <th className="text-right py-2">Dir</th>
                    <th className="text-right py-2">Vol</th>
                    <th className="text-right py-2">Open</th>
                    <th className="text-right py-2">Close</th>
                    <th className="text-right py-2">Net P&L</th>
                    <th className="text-right py-2">Closed</th>
                  </tr>
                </thead>
                <tbody>
                  {allTrades?.map(trade => (
                    <tr key={trade.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-2 text-gray-500">#{trade.id}</td>
                      <td className="py-2 text-gray-900">User {trade.userId}</td>
                      <td className="py-2 font-semibold text-gray-900">{trade.symbol}</td>
                      <td className={`py-2 text-right ${trade.direction === 'buy' ? 'text-green-600' : 'text-red-600'}`}>{trade.direction.toUpperCase()}</td>
                      <td className="py-2 text-right font-mono text-gray-700">{trade.volume}</td>
                      <td className="py-2 text-right font-mono text-gray-700">{Number(trade.openPrice).toFixed(5)}</td>
                      <td className="py-2 text-right font-mono text-gray-700">{Number(trade.closePrice).toFixed(5)}</td>
                      <td className={`py-2 text-right font-mono font-semibold ${Number(trade.netPnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Number(trade.netPnl) >= 0 ? '+' : ''}${Number(trade.netPnl).toFixed(2)}
                      </td>
                      <td className="py-2 text-right text-gray-500">{trade.closedAt ? new Date(trade.closedAt).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* POSITIONS SECTION */}
        {activeSection === 'positions' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">All Open Positions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Symbol</th>
                    <th className="text-right py-2">Dir</th>
                    <th className="text-right py-2">Vol</th>
                    <th className="text-right py-2">Open Price</th>
                    <th className="text-right py-2">Current</th>
                    <th className="text-right py-2">Unrealized P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {allPositions?.map(pos => (
                    <tr key={pos.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-2 text-gray-500">#{pos.id}</td>
                      <td className="py-2 text-gray-900">User {pos.userId}</td>
                      <td className="py-2 font-semibold text-gray-900">{pos.symbol}</td>
                      <td className={`py-2 text-right ${pos.direction === 'buy' ? 'text-green-600' : 'text-red-600'}`}>{pos.direction.toUpperCase()}</td>
                      <td className="py-2 text-right font-mono text-gray-700">{pos.volume}</td>
                      <td className="py-2 text-right font-mono text-gray-700">{Number(pos.openPrice).toFixed(5)}</td>
                      <td className="py-2 text-right font-mono text-gray-700">{Number(pos.currentPrice).toFixed(5)}</td>
                      <td className={`py-2 text-right font-mono font-semibold ${Number(pos.realizedPnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Number(pos.realizedPnl) >= 0 ? '+' : ''}${Number(pos.realizedPnl).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FUNDS SECTION */}
        {activeSection === 'funds' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-150">
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5 text-green-600" />
                  <span>Incoming Deposit Requests</span>
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full">
                  {deposits?.filter(d => d.status === 'pending').length || 0} Pending
                </span>
              </div>

              <div className="space-y-3">
                {deposits?.length === 0 && (
                  <p className="text-xs text-gray-400 py-6 text-center font-semibold">No deposit requests recorded yet.</p>
                )}
                {deposits?.map(d => {
                  const proofImageMatch = d.reference?.match(/Proof: (data:image\/[^|]+)/)?.[1];
                  const senderNameMatch = d.reference?.match(/Sender: ([^|]+)/)?.[1];
                  const refClean = d.reference?.replace(/Proof: data:image\/[^|]+/, '') || '';

                  return (
                    <div key={d.id} className="p-3.5 rounded-xl border border-gray-150 hover:border-gray-300 transition-all bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-black text-gray-900 font-mono">
                            ${Number(d.amount).toFixed(2)} <span className="text-xs text-gray-500 font-normal">{d.currency}</span>
                          </div>
                          <div className="text-xs font-semibold text-gray-600">
                            {d.paymentMethod} • <span className="font-mono text-gray-500">User #{d.userId}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded ${
                            d.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            d.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                          }`}>
                            {d.status}
                          </span>

                          {d.status === 'pending' && (
                            <div className="flex gap-1.5 ml-1">
                              <button 
                                title="Approve & Credit Balance"
                                onClick={() => approveMutation.mutate({ transactionId: d.id })}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                className="px-2.5 py-1 text-xs font-black bg-green-600 text-white hover:bg-green-700 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button 
                                title="Reject Deposit"
                                onClick={() => rejectMutation.mutate({ transactionId: d.id })}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                className="px-2.5 py-1 text-xs font-black bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sender & Reference Banner */}
                      {(senderNameMatch || refClean) && (
                        <div className="text-[11px] bg-white p-2 rounded-lg border border-gray-200 text-gray-700 space-y-1">
                          {senderNameMatch && (
                            <div>
                              <span className="font-black text-gray-500 uppercase text-[9px]">Sender Name: </span>
                              <span className="font-bold text-gray-900">{senderNameMatch}</span>
                            </div>
                          )}
                          {refClean && (
                            <div className="font-mono text-[10px] text-gray-500 truncate">
                              <span className="font-black uppercase text-[9px]">Ref/Notes: </span>
                              {refClean}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Receipt Screenshot Thumbnail */}
                      {proofImageMatch && (
                        <div className="pt-1 flex items-center justify-between bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                          <span className="text-[10px] font-extrabold uppercase text-blue-900">Transfer Receipt Screenshot:</span>
                          <button
                            type="button"
                            onClick={() => setPreviewImage(proofImageMatch)}
                            className="text-[10px] font-black uppercase text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Image</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Withdrawals List */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-150">
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                  <span>Withdrawal Requests</span>
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full">
                  {withdrawals?.filter(w => w.status === 'pending').length || 0} Pending
                </span>
              </div>

              <div className="space-y-3">
                {withdrawals?.length === 0 && (
                  <p className="text-xs text-gray-400 py-6 text-center font-semibold">No withdrawal requests recorded yet.</p>
                )}
                {withdrawals?.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/50">
                    <div>
                      <div className="text-sm font-black text-gray-900 font-mono">${Number(w.amount).toFixed(2)}</div>
                      <div className="text-xs font-semibold text-gray-600">{w.paymentMethod} · User #{w.userId}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${w.status === 'completed' ? 'bg-green-100 text-green-700' : w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {w.status}
                      </span>
                      {w.status === 'pending' && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => approveMutation.mutate({ transactionId: w.id })}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="p-1 text-green-600 hover:bg-green-100 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => rejectMutation.mutate({ transactionId: w.id })}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS SECTION */}
        {activeSection === 'settings' && (
          <div className="max-w-xl bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-950 mb-1">Deposit Receiving Accounts & Instructions</h3>
            <p className="text-sm text-gray-500 mb-6 font-semibold">
              Configure the active Bank, Chime/Zelle, Wire, and Crypto wallet details provided to users on the Deposit page.
            </p>

            <form onSubmit={handleSaveBankDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Bank / Institution Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. JPMorgan Chase / Chime / Revolut"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#D31C2B] outline-none font-semibold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Account / Beneficiary Name</label>
                <input
                  type="text"
                  required
                  value={beneficiary}
                  onChange={e => setBeneficiary(e.target.value)}
                  placeholder="e.g. Carding Buddy / Axi Financial Services Ltd"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#D31C2B] outline-none font-semibold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">Account Number / IBAN</label>
                  <input
                    type="text"
                    required
                    value={iban}
                    onChange={e => setIban(e.target.value)}
                    placeholder="US89 CHAS 0210 0002 1482"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#D31C2B] outline-none font-mono font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">Phone / Tag (Chime/Zelle)</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="9066967623"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#D31C2B] outline-none font-mono font-bold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">SWIFT / BIC Code</label>
                <input
                  type="text"
                  required
                  value={swift}
                  onChange={e => setSwift(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#D31C2B] outline-none font-mono font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Deposit Reference Prefix</label>
                <input
                  type="text"
                  required
                  value={referencePrefix}
                  onChange={e => setReferencePrefix(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#D31C2B] outline-none font-mono font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#D31C2B] mb-1">
                  Crypto Receiver Wallet Address (USDT TRC20)
                </label>
                <p className="text-[11px] text-gray-500 mb-1.5 font-semibold">
                  Receiving address pre-filled into Transak, MoonPay & Crypto On-Ramp checkout widgets for card payments.
                </p>
                <input
                  type="text"
                  required
                  value={cryptoWalletAddress}
                  onChange={e => setCryptoWalletAddress(e.target.value)}
                  placeholder="TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"
                  className="w-full px-4 py-2.5 text-xs font-mono font-black text-[#D31C2B] rounded-lg border border-red-200 bg-red-50/50 focus:border-[#D31C2B] outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updateBankMutation.isPending}
                  className="w-full py-3 bg-[#D31C2B] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {updateBankMutation.isPending ? 'Saving Details...' : 'Save Bank Details'}
                </button>
              </div>
            </form>

            {/* STRIPE LIVE CONNECTION STATUS CARD */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-sm font-extrabold text-gray-900">Stripe Account Connection Notice</h4>
                </div>
                <button
                  type="button"
                  onClick={() => refetchStripeTest()}
                  disabled={isTestingStripe}
                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-lg border border-indigo-200 flex items-center gap-1.5 transition-all"
                >
                  {isTestingStripe ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <span>Test Stripe API Connection</span>
                  )}
                </button>
              </div>

              {stripeTestResult && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  stripeTestResult.connected
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-red-50 border-red-200 text-red-950"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[10px] tracking-wider">
                      Status: {stripeTestResult.connected ? "CONNECTED & ACTIVE" : "CONNECTION DISCONNECTED / FAILED"}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                      stripeTestResult.mode === "LIVE"
                        ? "bg-emerald-600 text-white"
                        : stripeTestResult.mode === "TEST"
                        ? "bg-amber-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}>
                      {stripeTestResult.mode} Mode
                    </span>
                  </div>

                  <p className="font-semibold text-xs">{stripeTestResult.message}</p>

                  {stripeTestResult.keyPrefix && (
                    <div className="text-[11px] font-mono text-gray-700 bg-white/70 p-2 rounded border border-black/10">
                      Active Key Prefix: {stripeTestResult.keyPrefix}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECEIPT IMAGE PREVIEW MODAL */}
        <AnimatePresence>
          {previewImage && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-4 relative shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b mb-3">
                  <h4 className="text-xs font-black uppercase text-gray-900">Transfer Receipt Proof Screenshot</h4>
                  <button onClick={() => setPreviewImage(null)} className="p-1 text-gray-400 hover:text-black">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="max-h-[80vh] overflow-auto flex items-center justify-center bg-gray-900 rounded-xl p-2">
                  <img src={previewImage} alt="Receipt Proof" className="max-h-[70vh] object-contain rounded" />
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* WEBHOOKS & IPN SECTION */}
        {activeSection === 'webhooks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Globe className="w-6 h-6 text-[#D31C2B]" />
                  <h3 className="text-xl font-bold text-gray-950">Payment Gateway & Telegram Bot Integration</h3>
                </div>
                <p className="text-sm text-gray-500 max-w-3xl leading-relaxed font-medium">
                  Configure payment gateway IPNs and monitor live notifications dispatched to your Telegram support bot.
                </p>
              </div>

              {/* Telegram Confirmation Trigger Button */}
              <button
                type="button"
                onClick={() => testTelegramMutation.mutate()}
                disabled={testTelegramMutation.isPending}
                className="shrink-0 px-4 py-3 bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {testTelegramMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Telegram Test Confirmation</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* STRIPE WEBHOOKS */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Stripe Webhooks</h4>
                      <p className="text-xs text-gray-400">Processes credit card deposits</p>
                    </div>
                  </div>

                  {/* Dev Endpoint */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Development Endpoint URL</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">Dev Environment</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <code className="text-xs font-mono text-gray-700 break-all flex-1">{stripeDevWebhook}</code>
                      <button
                        onClick={() => handleCopy(stripeDevWebhook)}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Prod Endpoint */}
                  <div className="space-y-1 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production / Shared Endpoint URL</span>
                      <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded border border-green-200">Live Environments</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <code className="text-xs font-mono text-gray-700 break-all flex-1">{stripeProdWebhook}</code>
                      <button
                        onClick={() => handleCopy(stripeProdWebhook)}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h5 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Setup Instructions
                    </h5>
                    <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside leading-relaxed">
                      <li>Log in to your <strong className="text-gray-800">Stripe Dashboard</strong>.</li>
                      <li>Navigate to <strong className="text-gray-800">Developers &gt; Webhooks</strong>.</li>
                      <li>Click <strong className="text-gray-800">"Add an endpoint"</strong>.</li>
                      <li>Paste the matching endpoint URL (Development or Production) from above.</li>
                      <li>Click <strong className="text-gray-800">"+ Select events"</strong> and choose: <code className="font-mono bg-white px-1 py-0.5 rounded border text-blue-600 font-semibold">checkout.session.completed</code></li>
                      <li>Click <strong className="text-gray-800">"Add endpoint"</strong>.</li>
                      <li>Reveal and copy the <strong className="text-gray-800">Signing secret</strong> (starts with <code className="font-mono">whsec_</code>) and set it as the <code className="font-mono bg-white px-1 py-0.5 rounded border">STRIPE_WEBHOOK_SECRET</code> environment variable.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* NOWPAYMENTS IPN */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">NOWPayments IPN</h4>
                      <p className="text-xs text-gray-400">Processes cryptocurrency deposits</p>
                    </div>
                  </div>

                  {/* Dev Endpoint */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Development IPN URL</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">Dev Environment</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <code className="text-xs font-mono text-gray-700 break-all flex-1">{nowPaymentsDevWebhook}</code>
                      <button
                        onClick={() => handleCopy(nowPaymentsDevWebhook)}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Prod Endpoint */}
                  <div className="space-y-1 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production / Shared IPN URL</span>
                      <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded border border-green-200">Live Environments</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <code className="text-xs font-mono text-gray-700 break-all flex-1">{nowPaymentsProdWebhook}</code>
                      <button
                        onClick={() => handleCopy(nowPaymentsProdWebhook)}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h5 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Setup Instructions
                    </h5>
                    <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside leading-relaxed">
                      <li>Log in to your <strong className="text-gray-800">NOWPayments Account</strong>.</li>
                      <li>Navigate to <strong className="text-gray-800">Store Settings &gt; Instant Payment Notifications (IPN)</strong>.</li>
                      <li>Paste the matching IPN URL (Development or Production) in the <strong className="text-gray-800">Instant Payment Notification URL</strong> field.</li>
                      <li>Click <strong className="text-gray-800">"Save"</strong>.</li>
                      <li>Copy the generated <strong className="text-gray-800">IPN secret key</strong> and set it as the <code className="font-mono bg-white px-1 py-0.5 rounded border">NOWPAYMENTS_IPN_KEY</code> environment variable.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KYC SECTION */}
        {activeSection === 'kyc' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#D31C2B]" />
                    <span>Manual KYC & Identity Verification Queue</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Review uploaded Driver's Licenses, Passports, and National IDs for manual account approval. Approved users receive instant dashboard activation and Telegram notification.
                  </p>
                </div>
                <button
                  onClick={() => refetchKyc()}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
                >
                  Refresh Queue
                </button>
              </div>

              {(!kycRequests || kycRequests.length === 0) ? (
                <div className="text-center py-12 text-gray-500 space-y-2">
                  <ShieldCheck className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm font-medium">No KYC submission requests found in database.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Submission / User</th>
                        <th className="py-3 px-4">Document Details</th>
                        <th className="py-3 px-4">Address / Contact</th>
                        <th className="py-3 px-4">Uploaded Images</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {kycRequests.map((req: any) => (
                        <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-gray-900">{req.fullName || "User #" + req.userId}</div>
                            <div className="text-[11px] text-gray-500 font-mono">User ID: {req.userId}</div>
                            <div className="text-[10px] text-gray-400 mt-1">DOB: {req.dob}</div>
                            <div className="text-[10px] text-gray-400">
                              Submitted: {new Date(req.submittedAt || req.createdAt).toLocaleString()}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider mb-1">
                              {req.idType?.replace('_', ' ')}
                            </span>
                            <div className="font-mono text-gray-900 font-bold">{req.idNumber}</div>
                          </td>

                          <td className="py-4 px-4 text-[11px]">
                            <div>{req.address}</div>
                            <div className="text-gray-500">{req.city}, {req.country} ({req.postalCode})</div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {req.frontImage && (
                                <button
                                  onClick={() => setSelectedKycPhoto(req.frontImage)}
                                  className="group relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 hover:ring-2 hover:ring-[#D31C2B] transition-all"
                                  title="Click to zoom Front ID"
                                >
                                  <img src={req.frontImage} alt="Front ID" className="w-full h-full object-cover" />
                                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold">Front</span>
                                </button>
                              )}

                              {req.backImage && (
                                <button
                                  onClick={() => setSelectedKycPhoto(req.backImage)}
                                  className="group relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 hover:ring-2 hover:ring-[#D31C2B] transition-all"
                                  title="Click to zoom Back ID"
                                >
                                  <img src={req.backImage} alt="Back ID" className="w-full h-full object-cover" />
                                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold">Back</span>
                                </button>
                              )}

                              {req.selfieImage && (
                                <button
                                  onClick={() => setSelectedKycPhoto(req.selfieImage)}
                                  className="group relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 hover:ring-2 hover:ring-[#D31C2B] transition-all"
                                  title="Click to zoom Selfie"
                                >
                                  <img src={req.selfieImage} alt="Selfie" className="w-full h-full object-cover" />
                                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold">Selfie</span>
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                              {req.status === 'pending' && <Clock className="w-3 h-3" />}
                              {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                              <span>{req.status}</span>
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => approveKycMutation.mutate({ kycId: req.id })}
                                  disabled={approveKycMutation.isPending}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectionModalId(req.id);
                                    setRejectionReason('');
                                  }}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px] italic">Decision Finalized</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LIGHTBOX PHOTO PREVIEW MODAL */}
        {selectedKycPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
              <div className="p-4 bg-gray-950 flex items-center justify-between border-b border-gray-800 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">KYC Identification Photo Inspection</span>
                <button
                  onClick={() => setSelectedKycPhoto(null)}
                  className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-auto flex items-center justify-center bg-black">
                <img src={selectedKycPhoto} alt="Document Zoom" className="max-h-[75vh] w-auto object-contain rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {/* ADMINISTRATIVE ACTIVITY & AUDIT LOGS SECTION */}
        {activeSection === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#D31C2B]" />
                  Administrative Audit & Action Logs
                </h2>
                <p className="text-xs text-gray-500">
                  Full, tamper-evident log tracking all balance adjustments, KYC reviews, settings updates, and admin decisions.
                </p>
              </div>
              <button
                onClick={() => refetchAuditLogs()}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Clock className="w-3.5 h-3.5" />
                Refresh Logs
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="text-left px-4 py-3">Timestamp</th>
                    <th className="text-left px-4 py-3">Administrator</th>
                    <th className="text-left px-4 py-3">Action Type</th>
                    <th className="text-left px-4 py-3">Target User / Email</th>
                    <th className="text-left px-4 py-3">Details & Parameters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-sans">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 font-sans">
                          {log.adminEmail}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.action.includes('APPROVE') || log.action.includes('BALANCE')
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action.includes('REJECT')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-sans">
                          {log.targetEmail || (log.targetUserId ? `User #${log.targetUserId}` : 'System Wide')}
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-sans">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 font-sans">
                        No administrative audit entries logged yet. All future actions will be recorded here automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LIVE SUPPORT CHAT DESK SECTION */}
        {activeSection === 'support' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Headset className="w-5 h-5 text-[#D31C2B]" />
                  Axi Admin Live Support Desk
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Direct communication hub for user inquiries, transferred chats, and real-time support requests.
                </p>
              </div>
              <button 
                onClick={() => refetchSupportMessages && refetchSupportMessages()} 
                className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                Refresh Live Feed
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Threads List */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[520px]">
                <div className="p-3 bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Recent User Inquiries</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#D31C2B] text-[10px]">Live</span>
                </div>
                <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                  {supportMessages && supportMessages.length > 0 ? (
                    Array.from(new Set(supportMessages.map((m: any) => m.userId))).map((uId: any) => {
                      const userMsgs = supportMessages.filter((m: any) => m.userId === uId);
                      const lastMsg = userMsgs[0];
                      const isSelected = selectedSupportUserId === uId;
                      const userObj = users?.users?.find((u: any) => u.id === uId);
                      return (
                        <div
                          key={uId}
                          onClick={() => setSelectedSupportUserId(uId)}
                          className={`p-3.5 cursor-pointer hover:bg-red-50/50 transition-colors ${isSelected ? 'bg-red-50 border-l-4 border-[#D31C2B]' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-gray-900">
                              {userObj?.name || lastMsg.userName || `User #${uId}`}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">{lastMsg.message}</div>
                          <div className="mt-1 flex items-center gap-1">
                            {lastMsg.transferredToAdmin && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                Transferred to Admin
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">{userObj?.email || lastMsg.userEmail}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-xs text-gray-400">
                      No support chat messages yet. When users submit live chat inquiries or request a transfer to Admin, they will appear here.
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Conversation & Reply Panel */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[520px]">
                {selectedSupportUserId ? (
                  <>
                    <div className="p-3 bg-gray-900 text-white flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold">
                          Chatting with {users?.users?.find((u: any) => u.id === selectedSupportUserId)?.name || `User #${selectedSupportUserId}`}
                        </h4>
                        <p className="text-[10px] text-gray-400">
                          {users?.users?.find((u: any) => u.id === selectedSupportUserId)?.email || 'Live Account Support'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Admin Session Active
                      </span>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                      {supportMessages
                        ?.filter((m: any) => m.userId === selectedSupportUserId)
                        ?.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        ?.map((msg: any) => (
                          <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl text-xs ${
                              msg.sender === 'admin'
                                ? 'bg-[#D31C2B] text-white'
                                : msg.sender === 'user'
                                ? 'bg-white border border-gray-200 text-gray-900'
                                : 'bg-amber-50 border border-amber-200 text-amber-900'
                            }`}>
                              <div className="font-bold text-[10px] opacity-75 mb-0.5">
                                {msg.sender === 'admin' ? 'Administrator' : msg.sender === 'user' ? (msg.userName || 'User') : 'Bot System'}
                              </div>
                              <div>{msg.message}</div>
                              <div className="text-[9px] opacity-60 text-right mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type response to user..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && replyText.trim()) {
                            replySupportMutation.mutate({
                              userId: selectedSupportUserId,
                              message: replyText.trim(),
                            });
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#D31C2B]"
                      />
                      <button
                        onClick={() => {
                          if (replyText.trim()) {
                            replySupportMutation.mutate({
                              userId: selectedSupportUserId,
                              message: replyText.trim(),
                            });
                          }
                        }}
                        disabled={replySupportMutation.isPending}
                        className="px-4 py-2 bg-[#D31C2B] hover:bg-[#b01723] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Reply
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-xs p-6">
                    <MessageSquare className="w-10 h-10 mb-2 text-gray-300" />
                    Select a user conversation thread from the left panel to begin live admin support chat.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BALANCE ADJUSTMENT MODAL */}
        {adjustBalanceUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Manual User Balance Adjustment
              </h3>
              <p className="text-xs text-gray-500">
                Adjust balance for User ID #{adjustBalanceUserId}. Use positive values to credit, negative to debit. This action is permanently tracked in the administrative audit log.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Adjustment Amount (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 500 or -100"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full mt-1 p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Audit Compliance Reason</label>
                  <input
                    type="text"
                    placeholder="e.g. Wire transfer verification #892"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full mt-1 p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setAdjustBalanceUserId(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const amt = parseFloat(adjustAmount);
                    if (isNaN(amt) || amt === 0) {
                      toast.error("Please enter a valid non-zero adjustment amount.");
                      return;
                    }
                    if (!adjustReason.trim()) {
                      toast.error("Please provide an audit compliance reason.");
                      return;
                    }
                    adjustBalanceMutation.mutate({
                      userId: adjustBalanceUserId,
                      amount: amt,
                      reason: adjustReason.trim(),
                    });
                  }}
                  disabled={adjustBalanceMutation.isPending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm & Audit Log
                </button>
              </div>
            </div>
          </div>
        )}
        {rejectionModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Reject KYC Document Submission</h3>
              <p className="text-xs text-gray-500">
                Please enter the reason for rejecting this document (e.g. "Blurry ID photo", "Expired driver's license"). This reason will be communicated to the user.
              </p>
              <textarea
                rows={3}
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectionModalId(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => rejectKycMutation.mutate({ kycId: rejectionModalId, rejectionReason })}
                  disabled={rejectKycMutation.isPending}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
