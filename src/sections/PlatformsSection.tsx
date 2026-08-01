export default function PlatformsSection() {
  return (
    <section id="platforms" className="bg-[#D31C2B] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Powerful platforms.<br />You at the Controls.
            </h2>
            <p className="text-white/80 text-base mb-8">Industry-leading trading platforms with advanced tools and lightning-fast execution.</p>
            <div className="space-y-4 mb-8">
              {['Industry-standard MT4','A suite of trading resources','Available on desktop, web and mobile'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">/</span>
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
            <button className="bg-[#C5A059] hover:bg-[#B08C4A] text-gray-900 px-8 py-3 rounded text-sm font-bold transition-colors">Get the technology edge</button>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&q=80" alt="Trading Platform" className="rounded-xl shadow-2xl w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}