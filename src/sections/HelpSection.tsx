import { MessageCircle, Phone, Mail, Clock, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  { q: 'How do I open a trading account?', a: 'Opening an account takes just a few minutes. Click "Start Trading" and complete the registration form. You will need to verify your identity before making your first deposit.' },
  { q: 'What is the minimum deposit?', a: 'The minimum deposit for a Standard account is $0. For Pro accounts, the minimum deposit is $0. You can start trading with any amount you are comfortable with.' },
  { q: 'How long do withdrawals take?', a: 'Withdrawals are processed within 1-2 business days. The time to reach your account depends on the payment method used.' },
  { q: 'What trading platforms do you offer?', a: 'We offer MetaTrader 4 (MT4) and MetaTrader 5 (MT5), available on desktop, web, iOS, and Android. Both platforms support EA trading and advanced charting.' },
  { q: 'Is my money safe with Axi?', a: 'Yes. We are regulated by multiple top-tier authorities including FCA, ASIC, DFSA, and FSCA. Client funds are held in segregated accounts with tier-1 banks.' },
]

export default function HelpSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <section id="help" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find answers to common questions or reach out to our support team.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[{icon:MessageCircle,title:'Live Chat',desc:'Chat with our support team in real-time',status:'Available Now'},{icon:Phone,title:'Phone Support',desc:'Speak directly with our team',value:'+44 20 3322 1234'},{icon:Mail,title:'Email',desc:'Response within 24 hours',value:'support@axi.com'}].map((c,i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#D31C2B]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <c.icon className="w-6 h-6 text-[#D31C2B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{c.desc}</p>
              {c.status ? <span className="inline-flex items-center gap-1 text-xs text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {c.status}</span> : <span className="text-xs text-gray-500">{c.value}</span>}
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search FAQs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/20 focus:border-[#D31C2B]" />
          </div>
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq===i?'rotate-180':''}`} />
                </button>
                {openFaq===i && <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" /><span>Support available 24/5 (Mon-Fri) and limited hours on weekends</span>
        </div>
      </div>
    </section>
  )
}