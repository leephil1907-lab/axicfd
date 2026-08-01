import { Zap, Shield, Headphones, Globe, Award, BarChart3 } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Ultra-Fast Execution', desc: 'Trade with execution speeds under 50ms. No requotes, no dealer intervention.' },
  { icon: Shield, title: 'Regulated & Secure', desc: 'Fully regulated by FCA, ASIC, DFSA, and FSCA. Client funds held in segregated accounts.' },
  { icon: Headphones, title: '24/7 Expert Support', desc: 'Dedicated support team available around the clock in multiple languages.' },
  { icon: Globe, title: 'Global Market Access', desc: 'Trade 220+ instruments across Forex, Crypto, Indices, Commodities and Shares.' },
  { icon: Award, title: 'Award-Winning Platform', desc: 'Recognized globally with over 40 industry awards for excellence in trading.' },
  { icon: BarChart3, title: 'Advanced Tools', desc: 'MT4 & MT5 support, Autochartist, PsyQuation, and comprehensive trading tools.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Traders Choose Axi</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">We provide the tools, technology, and support you need to trade with confidence.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-[#D31C2B]/20 transition-all duration-300">
              <div className="w-12 h-12 bg-[#D31C2B]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D31C2B] transition-colors">
                <f.icon className="w-6 h-6 text-[#D31C2B] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}