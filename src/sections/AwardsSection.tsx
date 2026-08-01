import { Award, Trophy, Star, Medal } from 'lucide-react'

const awards = [
  { year: '2024', title: 'Best Forex Broker', org: 'Global Forex Awards', icon: Trophy },
  { year: '2024', title: 'Most Trusted Broker', org: 'Ultimate Fintech Awards', icon: Award },
  { year: '2023', title: 'Best Trading Platform', org: 'Forex Expo Dubai', icon: Star },
  { year: '2023', title: 'Best Customer Service', org: 'International Business Magazine', icon: Medal },
  { year: '2023', title: 'Best MT4 Broker', org: 'UK Forex Awards', icon: Trophy },
  { year: '2022', title: 'Fastest Growing Broker', org: 'European CEO Awards', icon: Award },
]

export default function AwardsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Globally Recognized Excellence</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Over 40 industry awards recognizing our commitment to providing exceptional trading services.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((a, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#D31C2B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <a.icon className="w-6 h-6 text-[#D31C2B]" />
              </div>
              <div><div className="text-xs font-medium text-[#D31C2B] mb-1">{a.year}</div><h3 className="text-base font-semibold text-gray-900">{a.title}</h3><p className="text-sm text-gray-500">{a.org}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}