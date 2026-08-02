import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import Breadcrumb from "@/components/Breadcrumb";
import { Search, ChevronDown, ChevronUp, Phone, Mail } from "lucide-react";

const faqCategories = [
  { id: 'account', label: 'Account' },
  { id: 'trading', label: 'Trading' },
  { id: 'funds', label: 'Funds' },
  { id: 'security', label: 'Security' },
  { id: 'platform', label: 'Platform' },
];

const faqs = [
  { category: 'account', question: 'How do I open an account?', answer: 'Click "Open Account" and complete the 3-step registration. You\'ll need email, password, and identity verification.' },
  { category: 'account', question: 'What documents do I need?', answer: 'Government-issued photo ID and proof of address (utility bill or bank statement from last 3 months).' },
  { category: 'account', question: 'How long does verification take?', answer: 'Standard: 1-2 business days. Enhanced: 3-5 business days.' },
  { category: 'trading', question: 'What is the minimum deposit?', answer: 'No minimum for Standard accounts. Pro accounts require $500 minimum.' },
  { category: 'trading', question: 'What leverage is available?', answer: 'Up to 1:500 for professionals, 1:30 for retail clients under ESMA regulations.' },
  { category: 'trading', question: 'Do you offer negative balance protection?', answer: 'Yes, all retail clients have negative balance protection automatically.' },
  { category: 'funds', question: 'How do I deposit funds?', answer: 'Go to Funds > Deposit, select payment method, and follow instructions. Most deposits are instant.' },
  { category: 'funds', question: 'What payment methods are accepted?', answer: 'Cards, bank transfers, Skrill, Neteller, crypto, Google Pay, and Binance Pay.' },
  { category: 'funds', question: 'How long do withdrawals take?', answer: 'Cards: 1-3 days. Bank transfers: 3-5 days. E-wallets: Instant. Crypto: Up to 15 mins.' },
  { category: 'security', question: 'Is my money safe?', answer: 'Yes. Client funds are segregated with tier-1 banks. We are members of the Investor Compensation Fund.' },
  { category: 'security', question: 'What security measures exist?', answer: '256-bit SSL encryption, 2FA, regular security audits, and GDPR compliance.' },
  { category: 'platform', question: 'What platforms are available?', answer: 'MetaTrader 4, MetaTrader 5, and WebTrader. Mobile apps for iOS and Android.' },
  { category: 'platform', question: 'Can I use Expert Advisors?', answer: 'Yes, both MT4 and MT5 support EAs and automated trading strategies.' },
  { category: 'platform', question: 'Can I practice trading safely?', answer: 'Absolutely. Registered users can access our interactive real-time price charts and use demo account trading capabilities directly in their client portal to analyze and experiment with market movements.' },
  { category: 'funds', question: 'Are there deposit fees?', answer: 'No deposit fees. Your payment provider may charge fees.' },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [openQuestions, setOpenQuestions] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (question) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(question)) newOpen.delete(question);
    else newOpen.add(question);
    setOpenQuestions(newOpen);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = faq.category === activeCategory;
    const matchesSearch = !searchQuery || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar />
      <Navbar />
      <Breadcrumb />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about trading with AXI</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#D31C2B]"
          />
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-[#D31C2B] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleQuestion(faq.question)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openQuestions.has(faq.question) ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              </button>
              {openQuestions.has(faq.question) && (
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#D31C2B] to-red-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-white/80 mb-6">Our support team is available 24/7</p>
          <div className="flex justify-center gap-4">
            <a href="mailto:customersupport@axitrades.com" className="bg-white text-[#D31C2B] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Support
            </a>
            <a href="tel:+18008888888" className="bg-white/20 border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> Call Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
