import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useFirebase } from '@/providers/FirebaseProvider'
import Navbar from '@/sections/Navbar'
import { toast } from 'sonner'

const depositMethods = [
  { name: 'Crypto', desc: 'Instantly, 0% Fee', icon: '₿' },
  { name: 'Binance Pay', desc: 'Instantly, 0% Fee', icon: '💎' },
  { name: 'Google Pay', desc: 'Instantly, 0% Fee', icon: 'G' },
  { name: 'Skrill', desc: 'Instantly, 0% Fee', icon: 'S' },
  { name: 'Credit or Debit Card', desc: 'Instantly, 0% Fee', icon: '💳' },
]

export default function Funds() {
  const { isAuthenticated } = useAuth()
  const { isFirebase, userProfile, transactions, createTransactionInFirestore } = useFirebase()
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit')
  
  // Interactive flow states
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [selectedWithdrawAccount, setSelectedWithdrawAccount] = useState<string | null>(null)

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      <div className="pt-32 text-center max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-6">Please log in to your authorized secure client portal to manage account funds.</p>
        <Link to="/login" className="inline-block bg-[#C5A059] text-gray-900 px-8 py-3 rounded text-sm font-black tracking-wider uppercase transition-colors hover:bg-[#B08C4A]">
          Log In
        </Link>
      </div>
    </div>
  )

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid deposit amount.')
      return
    }

    if (isFirebase) {
      try {
        await createTransactionInFirestore({
          type: 'deposit',
          amount,
          currency: 'USD',
          method: selectedMethod || 'Credit/Debit Card'
        })
        toast.success(`Successfully deposited $${amount.toFixed(2)} USD via ${selectedMethod}!`)
        setDepositAmount('')
        setSelectedMethod(null)
      } catch (err: any) {
        toast.error(`Deposit failed: ${err.message}`)
      }
    } else {
      toast.success(`Deposit request of $${amount.toFixed(2)} submitted successfully!`)
      setDepositAmount('')
      setSelectedMethod(null)
    }
  }

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid withdrawal amount.')
      return
    }

    const maxWithdrawable = isFirebase ? (userProfile?.balance ?? 0.00) : 0.00
    if (amount > maxWithdrawable) {
      toast.error('Insufficient funds available for withdrawal.')
      return
    }

    if (isFirebase) {
      try {
        await createTransactionInFirestore({
          type: 'withdrawal',
          amount,
          currency: 'USD',
          method: 'Bank Transfer'
        })
        toast.success(`Withdrawal request of $${amount.toFixed(2)} USD submitted successfully!`)
        setWithdrawAmount('')
        setSelectedWithdrawAccount(null)
      } catch (err: any) {
        toast.error(`Withdrawal failed: ${err.message}`)
      }
    } else {
      toast.success(`Withdrawal request of $${amount.toFixed(2)} submitted successfully!`)
      setWithdrawAmount('')
      setSelectedWithdrawAccount(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-gray-900">
      <Navbar />
      <div className="pt-24 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">Funds Management</h1>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl overflow-hidden px-4">
          {[
            { key: 'deposit' as const, label: 'Deposit Funds' },
            { key: 'withdraw' as const, label: 'Withdraw Funds' },
            { key: 'history' as const, label: 'Funding History' }
          ].map(t => (
            <button 
              key={t.key} 
              onClick={() => {
                setTab(t.key)
                setSelectedMethod(null)
                setSelectedWithdrawAccount(null)
              }} 
              className={`px-6 py-4 text-xs font-black tracking-wider uppercase border-b-2 transition-all ${
                tab === t.key 
                  ? 'border-[#D31C2B] text-[#D31C2B]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Balance Stats Bar for reference */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Account Number</div>
            <div className="text-base font-black text-gray-900 font-mono">
              {isFirebase ? `AXI-FB-${userProfile?.id?.substring(0, 6).toUpperCase()}` : 'AXI-LOCAL-832183'}
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Balance</div>
              <div className="text-2xl font-black text-[#D31C2B] font-mono">
                ${isFirebase ? (userProfile?.balance ?? 0.00).toFixed(2) : '0.00'}
              </div>
            </div>
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Equity</div>
              <div className="text-2xl font-black text-gray-900 font-mono">
                ${isFirebase ? (userProfile?.equity ?? 0.00).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Tab */}
        {tab === 'deposit' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {!selectedMethod ? (
              <>
                <div className="bg-[#D31C2B] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded inline-block mb-4">
                  Select Payment Method
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase">Choose your preferred deposit method</h2>
                <p className="text-sm text-gray-500 mb-6">Axi charges zero commissions or fees on standard funding deposits.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {depositMethods.map(m => (
                    <button 
                      key={m.name} 
                      onClick={() => setSelectedMethod(m.name)}
                      className="flex items-center gap-4 bg-[#F9F9FB] rounded-xl p-4 border border-gray-100 hover:border-[#D31C2B] hover:bg-white hover:shadow-md transition-all text-left group"
                    >
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                        {m.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">{m.name}</div>
                        <div className="text-xs text-gray-400 font-medium">{m.desc}</div>
                      </div>
                      <span className="text-gray-400 text-lg group-hover:text-[#D31C2B] transition-colors">›</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleDepositSubmit} className="max-w-md mx-auto py-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedMethod(null)} 
                  className="text-xs font-black text-gray-400 hover:text-gray-900 mb-4 inline-flex items-center gap-1 uppercase"
                >
                  ← Change Method
                </button>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fund Account via {selectedMethod}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Deposit Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                      <input 
                        type="number" 
                        required
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="100.00"
                        className="w-full pl-8 pr-4 py-3 bg-[#F9F9FB] border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent font-mono"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-[#C5A059] hover:bg-[#B08C4A] text-gray-900 font-black text-xs uppercase tracking-widest py-4 rounded-lg transition-colors shadow-sm"
                  >
                    Authorize Deposit
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Withdraw Tab */}
        {tab === 'withdraw' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {!selectedWithdrawAccount ? (
              <>
                <div className="bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded inline-block mb-4">
                  Select Withdrawal Target
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase">Which account would you like to withdraw from?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { type: 'Standard', login: '60332183', platform: 'MT4', label: 'AXI SELECT', balance: isFirebase ? (userProfile?.balance ?? 0.00) : 0.00 },
                    { type: 'Standard', login: '60332182', platform: 'MT5', label: null, balance: 0 }
                  ].map((acc, i) => (
                    <div key={i} className="bg-[#F9F9FB] rounded-xl p-5 border border-gray-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gray-800 text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wider">{acc.platform}</span>
                        {acc.label && <span className="bg-[#D31C2B] text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wider">{acc.label}</span>}
                        <span className="text-xs font-bold text-gray-700">{acc.type} {acc.login}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Withdrawable (USD)</div>
                          <div className="text-xl font-black text-gray-900 font-mono">${acc.balance.toFixed(2)}</div>
                        </div>
                        <button 
                          disabled={acc.balance <= 0}
                          onClick={() => setSelectedWithdrawAccount(acc.login)}
                          className="bg-white border border-gray-200 text-gray-700 font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="max-w-md mx-auto py-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedWithdrawAccount(null)} 
                  className="text-xs font-black text-gray-400 hover:text-gray-900 mb-4 inline-flex items-center gap-1 uppercase"
                >
                  ← Change Account
                </button>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Withdraw from Account {selectedWithdrawAccount}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Withdrawal Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                      <input 
                        type="number" 
                        required
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="50.00"
                        className="w-full pl-8 pr-4 py-3 bg-[#F9F9FB] border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent font-mono"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 mt-1 block">Maximum withdrawable: ${isFirebase ? (userProfile?.balance ?? 0.00).toFixed(2) : '0.00'}</span>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-[#D31C2B] text-white font-black text-xs uppercase tracking-widest py-4 rounded-lg transition-colors hover:bg-[#b01722] shadow-sm"
                  >
                    Request Secure Withdrawal
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase">Your Funding Activity Log</h2>
            
            {isFirebase ? (
              transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="font-medium text-sm">No transactions logged yet.</p>
                  <p className="text-xs text-gray-500 mt-1">Authorized deposits and withdrawal requests will display here in real-time.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-black uppercase tracking-widest">
                        <th className="py-3 px-4">Transaction ID</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-900">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4 font-mono text-[11px] text-gray-500">{tx.id}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              tx.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold">${tx.amount.toFixed(2)}</td>
                          <td className="py-4 px-4 text-gray-600">{tx.method}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              tx.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              tx.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-500 font-mono text-[10px]">
                            {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="font-medium text-sm">No Recent Transactions</p>
                <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">Please sign in to your verified trading account to view your live account ledger and history.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
