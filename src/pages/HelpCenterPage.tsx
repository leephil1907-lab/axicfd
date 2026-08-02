import { motion } from "framer-motion";
import { Search, HelpCircle, MessageSquare, FileText, CreditCard, User, BookOpen, Phone, Mail } from "lucide-react";
import { useState } from "react";

const helpCards = [
  { icon: HelpCircle, title: "About Axi", desc: "Find essential details about Axi, including customer support hours, regulation and company information." },
  { icon: BookOpen, title: "Getting Started", desc: "Everything you need to begin your trading journey - from opening an account to making your first trade." },
  { icon: CreditCard, title: "Trading Accounts", desc: "Whether you're using a live or demo Axi account, our FAQs guide you through account management." },
  { icon: User, title: "My Axi Account", desc: "Find FAQs covering everything related to your account, including documents and verification." },
  { icon: CreditCard, title: "Deposits and Withdrawals", desc: "Everything you should know about Deposits and Withdrawals including processing times and methods." },
  { icon: FileText, title: "Trading Platforms", desc: "Learn how to download, install and use MT4 and MT5 on desktop, web and mobile devices." },
];

const contactMethods = [
  { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support team in real-time", cta: "START CHAT" },
  { icon: Phone, title: "Phone Support", desc: "Speak directly with our customer service team", cta: "CALL NOW" },
  { icon: Mail, title: "Email Us", desc: "Send us an email and we'll respond within 24 hours", cta: "SEND EMAIL" },
];

const faqs = [
  { q: "How do I open an account with Axi?", a: "Opening an account is simple. Click 'Open Account', complete the registration form with your details, verify your identity, and you can start trading within minutes." },
  { q: "What is the minimum deposit?", a: "You can start trading with Axi from just $5. There are no hidden fees for deposits or withdrawals." },
  { q: "What trading platforms do you offer?", a: "We offer MetaTrader 4 (MT4) and MetaTrader 5 (MT5) on desktop, web browser, and mobile devices (iOS & Android)." },
  { q: "Is Axi regulated?", a: "Yes, Axi is regulated by multiple authorities worldwide and is a member of The Financial Commission for dispute resolution." },
  { q: "How do I deposit funds?", a: "We accept various payment methods including bank transfer, credit/debit cards, and e-wallets. Log into your client portal to make a deposit." },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((f) =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <section className="py-20" style={{ backgroundColor: "#D31C2B" }}>
        <div className="container-axi text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            Help Centre
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 text-lg text-white/80 max-w-[600px] mx-auto">
            Find answers, get support, and connect with our team
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 max-w-[500px] mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9B9590" }} />
            <input
              type="text" placeholder="Search for help..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C842]"
              style={{ backgroundColor: "#fff", border: "none" }}
            />
          </motion.div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#fff" }}>
        <div className="container-axi">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "#1A1A1A" }}>
            How can we help you?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border cursor-pointer hover:shadow-md transition-all group"
                style={{ borderColor: "#D9D3CB", backgroundColor: "#fff" }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#F5F2ED" }}>
                  <card.icon size={22} style={{ color: "#D31C2B" }} />
                </div>
                <h3 className="text-base font-bold group-hover:underline" style={{ color: "#1A1A1A" }}>{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6B6560" }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#EDE8E0" }}>
        <div className="container-axi">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "#1A1A1A" }}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-[700px] mx-auto">
            {filteredFaqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="mb-3 rounded-lg overflow-hidden"
                style={{ border: "1px solid #D9D3CB", backgroundColor: "#fff" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>{faq.q}</span>
                  <span className="text-lg ml-4 flex-shrink-0" style={{ color: "#D31C2B" }}>{openFaq === idx ? "-" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#fff" }}>
        <div className="container-axi">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "#1A1A1A" }}>
            Still need help? Contact us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[800px] mx-auto">
            {contactMethods.map((method, idx) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg text-center border"
                style={{ borderColor: "#D9D3CB", backgroundColor: "#fff" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D31C2B" }}>
                  <method.icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: "#1A1A1A" }}>{method.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "#6B6560" }}>{method.desc}</p>
                <button className="btn-yellow mt-4 text-[10px] py-2 px-5">{method.cta}</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
