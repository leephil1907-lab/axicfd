import { BookOpen, Video, FileText, GraduationCap, ArrowRight } from 'lucide-react'

const resources = [
  { icon: BookOpen, title: 'Trading Guides', desc: 'Comprehensive guides for beginners to advanced traders covering strategies, risk management, and market analysis.', count: '50+ articles' },
  { icon: Video, title: 'Video Tutorials', desc: 'Learn from expert traders with step-by-step video tutorials on platform features and trading techniques.', count: '100+ videos' },
  { icon: FileText, title: 'Market Analysis', desc: 'Daily market updates, technical analysis, and fundamental research from our team of analysts.', count: 'Daily updates' },
  { icon: GraduationCap, title: 'Trading Academy', desc: 'Structured courses from beginner to professional level with certificates of completion.', count: '12 courses' },
]

export default function EducationSection() {
  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 bg-[#D31C2B]/10 rounded-full px-4 py-1.5 mb-6">
              <GraduationCap className="w-4 h-4 text-[#D31C2B]" /><span className="text-sm font-medium text-[#D31C2B]">Education Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Learn to Trade Like a Pro</h2>
            <p className="text-gray-600 mb-6">Access our comprehensive education center with resources for every skill level.</p>
            <button className="flex items-center gap-2 text-[#D31C2B] font-semibold hover:gap-3 transition-all">Explore All Resources <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
            {resources.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:shadow-lg hover:border-[#D31C2B]/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-[#D31C2B]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D31C2B] transition-colors">
                  <r.icon className="w-6 h-6 text-[#D31C2B] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{r.desc}</p>
                <span className="text-xs font-medium text-[#D31C2B]">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}