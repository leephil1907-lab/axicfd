import { Handshake, TrendingUp, Users, DollarSign } from 'lucide-react'

const stats = [
  { icon: Users, value: '100K+', label: 'Active Partners' },
  { icon: DollarSign, value: '$25M+', label: 'Paid in Commissions' },
  { icon: TrendingUp, value: '50%', label: 'Revenue Share' },
  { icon: Handshake, value: 'Global', label: 'Partner Program' },
]

export default function PartnershipSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Handshake className="w-4 h-4 text-[#D31C2B]" /><span className="text-sm text-gray-300">Partnership Program</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Partner with a <span className="text-[#D31C2B]">Global Leader</span></h2>
            <p className="text-gray-400 text-lg mb-8">Join our award-winning partnership program and earn competitive commissions.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s, i) => <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4"><s.icon className="w-5 h-5 text-[#D31C2B] mb-2" /><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-gray-400">{s.label}</div></div>)}
            </div>
            <button className="bg-[#D31C2B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B91623] transition-colors">Become a Partner</button>
          </div>
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8">
            <h3 className="text-xl font-semibold mb-6">Commission Structure</h3>
            <div className="space-y-4">
              {[{tier:'Standard',lots:'1-100',cpl:'$5',cpa:'$500'},{tier:'Premium',lots:'101-500',cpl:'$7',cpa:'$700'},{tier:'VIP',lots:'500+',cpl:'$10',cpa:'$1,000'}].map((t,i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                  <div><div className="font-semibold">{t.tier}</div><div className="text-sm text-gray-400">{t.lots} lots/month</div></div>
                  <div className="text-right"><div className="text-sm text-[#D31C2B] font-semibold">{t.cpl}/lot</div><div className="text-xs text-gray-400">CPA: {t.cpa}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}