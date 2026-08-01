import { Link } from 'react-router'

const pathway = [
  { stage: 'Seed', funding: '$5,000', share: '0%', multiplier: 'x10', minEquity: '$500', edgeScore: '50', duration: '30' },
  { stage: 'Incubation', funding: '$20,000', share: '40%', multiplier: 'x10', minEquity: '$1,000', edgeScore: '60', duration: '60' },
  { stage: 'Acceleration', funding: '$100,000', share: '50%', multiplier: 'x25', minEquity: '$2,000', edgeScore: '70', duration: '60' },
  { stage: 'Pro', funding: '$200,000', share: '60%', multiplier: 'x40', minEquity: '$5,000', edgeScore: '90', duration: '60' },
]

export default function AxiSelectSection() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-400 mb-2">Welcome to</p>
          <h2 className="text-2xl font-bold mb-2"><span className="text-[#D31C2B]">axi</span>SELECT</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">Your first step to start your path to get $1,000,000 funding</h3>
          <p className="text-gray-400 max-w-lg mx-auto mb-6">Congratulation! You are in the program. Start trade and build your edge score and reach $500 capital to qualify for <strong className="text-white">Seed stage</strong>.</p>
          <div className="flex justify-center gap-3">
            <Link to="/funds" className="bg-[#D31C2B] hover:bg-[#B91623] text-white px-6 py-2.5 rounded text-sm font-bold transition-colors">ADD FUNDS</Link>
            <Link to="/trading" className="border border-white/30 hover:bg-white/10 text-white px-6 py-2.5 rounded text-sm font-bold transition-colors">TRADE NOW</Link>
          </div>
        </div>
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2"><h4 className="font-semibold">Axi Select Pathway</h4><span className="text-sm text-gray-400 cursor-pointer">Detail Pathway \u2192</span></div>
          <div className="flex items-center gap-2">
            {['Joined Axi Select', 'Next: Seed', 'Incubation', 'Acceleration'].map((step, i) => (
              <div key={i} className={`flex-1 py-2 px-3 rounded text-xs font-medium text-center ${i===0?'bg-green-600 text-white':i===1?'bg-[#D31C2B] text-white':'bg-gray-800 text-gray-500'}`}>{i===0&&'\u2713 '}{step}</div>
            ))}
          </div>
        </div>
        <div className="mb-12">
          <h4 className="font-semibold mb-4">Traders Already Funded</h4>
          <p className="text-sm text-gray-400 mb-4">Real results from the Axi Select community</p>
          <div className="space-y-3">
            {[{ initials: 'HZ', name: 'Haibin Z.', flag: '\uD83C\uDDE8\uD83C\uDDF3', profit: '$ 17,475.83' },{ initials: 'YG', name: 'Yimy G.', flag: '\uD83C\uDDEA\uD83C\uDDF8', profit: '$ 8,741.64' },{ initials: 'AF', name: 'Alvaro F.', flag: '\uD83C\uDDEA\uD83C\uDDF8', profit: '$ 6,309.28' }].map((trader, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">{trader.initials}</div>
                  <div><div className="text-sm font-medium">{trader.name} <span className="text-xs">{trader.flag}</span></div><div className="text-xs text-gray-500">{['2y 3m ago','5m ago','10m ago'][i]}</div></div>
                </div>
                <div className="text-right"><div className="text-xs text-gray-500">Profit</div><div className="text-green-400 font-semibold">{trader.profit}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <h4 className="text-center text-lg font-bold mb-4"><span className="text-[#D31C2B]">axi</span> SELECT Pathway</h4>
          <p className="text-center text-sm text-gray-400 mb-6">Advance to the next stage of your trading journey with our structured pathway</p>
          <table className="w-full text-xs">
            <thead><tr className="text-gray-400 border-b border-gray-700"><th className="text-left py-2 px-3"></th>{pathway.map(p => <th key={p.stage} className="text-center py-2 px-3 font-semibold text-white">{p.stage}</th>)}</tr></thead>
            <tbody className="text-gray-300">
              {['Max Funding','Your Profit Share','Leverage','Max Funding Multiplier','Minimum Equity','Edge Score','Stage Duration (Days)'].map((label, li) => (
                <tr key={li} className="border-b border-gray-800">
                  <td className="py-2 px-3 text-gray-400">{label}</td>
                  {pathway.map(p => <td key={p.stage} className="text-center py-2 px-3 font-bold text-white">{[p.funding,p.share,'1:100',p.multiplier,p.minEquity,p.edgeScore,p.duration][li]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}