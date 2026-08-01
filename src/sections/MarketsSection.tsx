import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'

const tabs = [
  { key: 'all', label: 'Popular' },
  { key: 'forex', label: 'Forex' },
  { key: 'metals', label: 'Metals' },
  { key: 'indices', label: 'Indices' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'crypto', label: 'Crypto' },
]

export default function MarketsSection() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const { data: prices } = trpc.market.livePrices.useQuery(
    activeTab !== 'all' ? { category: activeTab } : undefined,
    { refetchInterval: 5000 }
  )

  return (
    <section id="markets" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">A world of opportunity</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">Ultra-competitive pricing and fairer charges, so more of your money is invested in the markets.</p>
          <Link to={isAuthenticated ? '/trading' : '/signup'} className="inline-block bg-[#C5A059] hover:bg-[#B08C4A] text-gray-900 px-8 py-3 rounded text-sm font-bold transition-colors">Power up your portfolio</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all ${activeTab === tab.key ? 'bg-[#D31C2B] text-white border-[#D31C2B]' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-semibold">Instrument</th>
                <th className="text-right px-6 py-3 font-semibold">Bid</th>
                <th className="text-right px-6 py-3 font-semibold">Ask</th>
              </tr></thead>
              <tbody>
                {(prices?.slice(0, 10) || []).map((p, i) => (
                  <tr key={p.instrument.symbol} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{p.instrument.symbol}</td>
                    <td className="px-6 py-3.5 text-right font-mono text-gray-700">{p.bid}</td>
                    <td className="px-6 py-3.5 text-right font-mono text-gray-700">{p.ask}</td>
                  </tr>
                ))}
                {!prices?.length && <tr><td colSpan={3} className="text-center py-12 text-gray-400">Loading prices...</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Discover popular markets to trade</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
            {['Forex','Shares','Indices','Commodities','Cryptocurrencies'].map((label, i) => (
              <div key={label} className="text-center group cursor-pointer">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl group-hover:scale-110 transition-transform ${['bg-red-100','bg-blue-100','bg-green-100','bg-yellow-100','bg-purple-100'][i]}`}>
                  {['\uD83D\uDCB1','\uD83D\uDCC8','\uD83D\uDCCA','\uD83D\uDE2E','\u20BF'][i]}
                </div>
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}