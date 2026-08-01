import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Search, MessageCircle, Phone, Mail, BookOpen, Video, FileText, ChevronRight, ChevronDown, ChevronUp, Clock, Globe, Shield, FileSpreadsheet } from "lucide-react";

const categories = [
  { icon: BookOpen, title: "Getting Started", articles: 24, color: "blue" },
  { icon: Shield, title: "Account & Verification", articles: 18, color: "green" },
  { icon: Globe, title: "Deposits & Withdrawals", articles: 32, color: "purple" },
  { icon: MessageCircle, title: "Trading Platforms", articles: 28, color: "orange" },
  { icon: FileText, title: "Trading Conditions", articles: 21, color: "red" },
  { icon: Video, title: "Video Tutorials", articles: 15, color: "cyan" },
];

const faqs = [
  {
    category: "Account",
    questions: [
      { q: "How do I open a trading account?", a: "Click 'Open Account' on our homepage, complete the registration form, verify your email, and submit KYC documents. Account approval typically takes 1-2 business days." },
      { q: "What documents do I need for verification?", a: "You need a valid government-issued ID (passport, driver's license, or national ID) and a proof of address (utility bill or bank statement dated within the last 3 months)." },
      { q: "Can I have multiple trading accounts?", a: "Yes, you can create multiple accounts with different base currencies and leverage settings. However, each account must be verified individually." },
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page, enter your registered email, and follow the instructions in the reset email." },
    ]
  },
  {
    category: "Deposits",
    questions: [
      { q: "What is the minimum deposit?", a: "There is no minimum deposit for Standard accounts. However, we recommend at least $100 to effectively manage risk. Pro accounts require $25,000 minimum." },
      { q: "How long do deposits take?", a: "Card deposits and e-wallets are instant. Bank transfers take 1-3 business days. Crypto deposits are confirmed within 15 minutes." },
      { q: "Are there deposit fees?", a: "AXI does not charge deposit fees. However, your payment provider may charge processing fees." },
      { q: "Can I deposit in a different currency?", a: "Yes, we accept deposits in 50+ currencies. Funds are converted to your account base currency at prevailing market rates." },
    ]
  },
  {
    category: "Trading",
    questions: [
      { q: "What is the minimum trade size?", a: "The minimum trade size is 0.01 lots (1,000 units) for forex and 0.01 for other instruments." },
      { q: "What leverage do you offer?", a: "Leverage ranges from 1:1 to 1:500 depending on the instrument and your account type. Professional clients can access higher leverage." },
      { q: "Do you allow hedging?", a: "Yes, hedging is fully permitted on all account types. You can hold both long and short positions simultaneously." },
      { q: "What are your trading hours?", a: "Forex markets are open 24/5 (Sunday 22:00 GMT to Friday 22:00 GMT). Other instruments have specific trading sessions listed on our markets page." },
    ]
  },
  {
    category: "Platforms",
    questions: [
      { q: "Which platforms do you support?", a: "We support MetaTrader 4, MetaTrader 5, and our proprietary WebTrader platform. All platforms are available on desktop, web, and mobile." },
      { q: "Can I use Expert Advisors (EAs)?", a: "Yes, EAs are fully supported on MT4 and MT5. We also offer a VPS service for uninterrupted EA operation." },
      { q: "Is mobile trading available?", a: "Yes, our mobile apps are available for iOS and Android. They support full trading functionality including charting, order management, and account funding." },
    ]
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-gray-400 mb-8">Search our knowledge base or browse categories below</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D31C2B]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(cat.title)}
              className={`bg-white rounded-xl border-2 p-6 text-left transition-all hover:shadow-md ${activeCategory === cat.title ? 'border-[#D31C2B]' : 'border-gray-200'}`}
            >
              <cat.icon className={`w-8 h-8 mb-3 ${cat.color === 'blue' ? 'text-blue-500' : cat.color === 'green' ? 'text-green-500' : cat.color === 'purple' ? 'text-purple-500' : cat.color === 'orange' ? 'text-orange-500' : cat.color === 'red' ? 'text-red-500' : 'text-cyan-500'}`} />
              <h3 className="font-semibold text-gray-900">{cat.title}</h3>
              <p className="text-sm text-gray-500">{cat.articles} articles</p>
            </button>
          ))}
        </div>

        {/* Contact Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MessageCircle className="w-8 h-8 text-[#D31C2B]" />
              <div>
                <div className="font-semibold text-sm">Live Chat</div>
                <div className="text-xs text-gray-500">Available 24/7</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-8 h-8 text-[#D31C2B]" />
              <div>
                <div className="font-semibold text-sm">Email</div>
                <div className="text-xs text-gray-500">support@axi-trading.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-8 h-8 text-[#D31C2B]" />
              <div>
                <div className="font-semibold text-sm">Phone</div>
                <div className="text-xs text-gray-500">+1 800 888 888</div>
              </div>
            </div>
            <Link 
              to="/workspace-forms" 
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg transition-all"
            >
              <FileSpreadsheet className="w-8 h-8 text-purple-600 animate-pulse" />
              <div>
                <div className="font-semibold text-sm text-purple-950">Surveys & Forms</div>
                <div className="text-xs text-purple-700">Google Workspace Hub</div>
              </div>
            </Link>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((category) => (
              <div key={category.category}>
                <div className="px-6 py-3 bg-gray-50 text-sm font-semibold text-gray-700">
                  {category.category}
                </div>
                {category.questions.map((faq, i) => {
                  const key = `${category.category}-${i}`;
                  const isOpen = expandedFAQ === key;
                  return (
                    <div key={key} className="border-b border-gray-100 last:border-0">
                      <button
                        onClick={() => setExpandedFAQ(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
