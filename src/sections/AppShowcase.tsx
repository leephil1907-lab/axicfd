import { useState, useEffect } from 'react'

const slides = [
  { balance: '$12,547.83', change: '+$284.62 (2.3%)' },
  { balance: '$18,923.45', change: '+$512.18 (3.5%)' },
  { balance: '$8,231.17', change: '-$123.45 (1.2%)' },
]

export default function AppShowcase() {
  const [slide, setSlide] = useState(0)
  useEffect(() => { const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000); return () => clearInterval(t) }, [])
  const s = slides[slide]

  return (
    <section className="py-16 bg-[#F5F0EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">650+ markets. One app.</h2>
            <p className="text-gray-600 text-lg mb-8">Trade 650+ assets across forex, crypto, commodities, share CFDs, ETFs and global indices without switching apps.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#C5A059] hover:bg-[#B08C4A] text-gray-900 px-8 py-3 rounded text-sm font-bold transition-colors">Download now</button>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded text-sm font-bold transition-colors">Learn more</button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-72 bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
              <div className="bg-white rounded-[2rem] overflow-hidden h-[480px] relative">
                <div className="flex items-center justify-between px-5 py-2">
                  <span className="text-xs font-semibold">9:41</span>
                  <div className="w-20 h-5 bg-gray-900 rounded-full" />
                  <span className="text-xs">\uD83D\uDCF6 \uD83D\uDD0B</span>
                </div>
                <div className="px-5 pt-2 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Total Balance</span>
                    <div className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-sm font-bold">+</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{s.balance}</div>
                  <div className="text-sm text-green-500 font-medium">{s.change}</div>
                </div>
                <div className="flex gap-2 px-5 mb-4">
                  <span className="bg-[#D31C2B] text-white text-xs px-4 py-1.5 rounded-full">All</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-4 py-1.5 rounded-full">Forex</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-4 py-1.5 rounded-full">Crypto</span>
                </div>
                <div className="px-5 mb-4">
                  <svg viewBox="0 0 250 80" className="w-full h-16">
                    <defs><linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.2"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs>
                    <path d="M0,60 Q30,55 60,45 Q90,30 120,35 Q150,25 180,30 Q210,15 250,10 L250,80 L0,80 Z" fill="url(#miniGrad)" />
                    <path d="M0,60 Q30,55 60,45 Q90,30 120,35 Q150,25 180,30 Q210,15 250,10" fill="none" stroke="#22c55e" strokeWidth="2" />
                    <text x="210" y="72" fill="#22c55e" fontSize="10" fontWeight="bold">+5.2%</text>
                  </svg>
                </div>
                <div className="px-5 space-y-3">
                  {[{s:'EURUSD',p:'1.14237',c:'+0.12%'}, {s:'XAUUSD',p:'2,650.50',c:'+0.45%'}].map(m => (
                    <div key={m.s} className="flex items-center justify-between">
                      <div><div className="font-bold text-sm text-gray-900">{m.s}</div><div className="text-[10px] text-gray-500">{m.s.slice(0,3)}/{m.s.slice(3)}</div></div>
                      <div className="text-right"><div className="font-mono text-sm">{m.p}</div><div className="text-[10px] text-green-500">{m.c}</div></div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {slides.map((_, i) => <span key={i} className={`w-2 h-2 rounded-full ${i === slide ? 'bg-[#D31C2B]' : 'bg-gray-300'}`} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}