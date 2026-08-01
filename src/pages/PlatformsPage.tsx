import { Link } from "react-router";
import { motion } from "framer-motion";
import { Monitor, Smartphone, TrendingUp, Shield, Zap, BarChart3, Laptop } from "lucide-react";

const platforms = [
  {
    name: "MetaTrader 4",
    tagline: "The world's most popular trading platform",
    desc: "MT4 is the industry-standard platform for forex and CFD trading. With advanced charting, automated trading capabilities, and a massive library of indicators and EAs, MT4 gives you everything you need to trade with confidence.",
    features: ["Advanced charting with 30+ indicators", "Automated trading with Expert Advisors", "One-click trading execution", "Customisable interface and charts", "Available on desktop, web and mobile"],
    icon: Monitor,
    color: "#D31C2B",
  },
  {
    name: "MetaTrader 5",
    tagline: "Next-generation multi-asset trading",
    desc: "MT5 takes your trading to the next level with more timeframes, additional order types, an economic calendar, and improved strategy testing. Trade a wider range of markets with greater precision.",
    features: ["38 technical indicators and 44 analytical objects", "21 timeframes for detailed analysis", "Economic calendar integrated", "Depth of Market (DOM) display", "Multi-threaded strategy tester"],
    icon: BarChart3,
    color: "#3EBDB0",
  },
  {
    name: "Axi Mobile App",
    tagline: "Trade anywhere, anytime",
    desc: "Stay connected to the markets with our powerful mobile trading app. Monitor positions, execute trades, and manage your account from anywhere in the world.",
    features: ["Real-time price alerts and notifications", "Full account management", "Deposit and withdraw on the go", "Advanced charting tools", "Secure biometric login"],
    icon: Smartphone,
    color: "#F5C842",
  },
];

const tools = [
  { icon: Zap, title: "Lightning-fast execution", desc: "Sub-millisecond execution speeds ensure you get the price you see" },
  { icon: Shield, title: "Secure and regulated", desc: "Your funds are held in segregated accounts with tier-1 banks" },
  { icon: TrendingUp, title: "Advanced trading tools", desc: "Autochartist, PsyQuation, and more premium tools included" },
  { icon: Laptop, title: "VPS hosting", desc: "Free VPS hosting for eligible clients to run EAs 24/7" },
];

export default function PlatformsPage() {
  return (
    <div>
      <section className="py-20" style={{ backgroundColor: "#D31C2B" }}>
        <div className="container-axi text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            Trading Platforms
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 text-lg text-white/80 max-w-[600px] mx-auto">
            Industry-leading platforms with powerful tools, lightning-fast execution, and complete control
          </motion.p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#fff" }}>
        <div className="container-axi">
          {platforms.map((platform, idx) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="flex flex-col md:flex-row gap-10 mb-16 last:mb-0 items-center"
            >
              <div className="w-full md:w-1/2">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: platform.color }}>
                  <platform.icon size={28} className="text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1A1A1A" }}>{platform.name}</h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider" style={{ color: platform.color }}>{platform.tagline}</p>
                <p className="mt-4 text-base leading-relaxed" style={{ color: "#6B6560" }}>{platform.desc}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {platform.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#1A1A1A" }}>
                      <span style={{ color: "#22A958" }}>+</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="btn-yellow mt-6">DOWNLOAD {platform.name.split(" ")[1]?.toUpperCase() || "NOW"}</button>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={idx === 0 ? "/platform-illustration.png" : idx === 1 ? "/hero-trader.jpg" : "/education-illustration.png"}
                  alt={platform.name}
                  className="max-w-full rounded-lg shadow-lg"
                  style={{ maxHeight: "320px", objectFit: "cover" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#EDE8E0" }}>
        <div className="container-axi">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "#1A1A1A" }}>
            Why trade with Axi platforms?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, idx) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg text-center"
                style={{ backgroundColor: "#fff", border: "1px solid #D9D3CB" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D31C2B" }}>
                  <tool.icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: "#1A1A1A" }}>{tool.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "#6B6560" }}>{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
