import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { TrendingUp, Globe, DollarSign } from "lucide-react";

const pairs = [
  { name: "EURUSD", full: "Euro / US Dollar", bid: 1.14237, ask: 1.14243, spread: 0.6, change: 0.12 },
  { name: "GBPUSD", full: "British Pound / US Dollar", bid: 1.33928, ask: 1.33936, spread: 0.8, change: 0.23 },
  { name: "USDJPY", full: "US Dollar / Japanese Yen", bid: 162.483, ask: 162.490, spread: 0.7, change: -0.08 },
  { name: "AUDUSD", full: "Australian Dollar / US Dollar", bid: 0.65432, ask: 0.65445, spread: 0.8, change: 0.15 },
  { name: "USDCAD", full: "US Dollar / Canadian Dollar", bid: 1.41650, ask: 1.41658, spread: 0.8, change: -0.05 },
  { name: "EURGBP", full: "Euro / British Pound", bid: 0.85241, ask: 0.85252, spread: 0.7, change: 0.09 },
  { name: "NZDUSD", full: "New Zealand Dollar / US Dollar", bid: 0.58932, ask: 0.58948, spread: 1.0, change: 0.18 },
  { name: "USDCHF", full: "US Dollar / Swiss Franc", bid: 0.91245, ask: 0.91258, spread: 0.9, change: -0.12 },
  { name: "GBPJPY", full: "British Pound / Japanese Yen", bid: 217.608, ask: 217.622, spread: 1.4, change: 0.31 },
  { name: "EURJPY", full: "Euro / Japanese Yen", bid: 185.523, ask: 185.538, spread: 1.2, change: 0.19 },
];

const features = [
  { icon: Globe, title: "80+ Currency Pairs", desc: "Trade major, minor and exotic pairs" },
  { icon: DollarSign, title: "Spreads from 0.0 pips", desc: "Ultra-competitive pricing on all pairs" },
  { icon: TrendingUp, title: "24/5 Trading", desc: "Trade forex around the clock" },
];

export default function ForexPage() {
  const [prices, setPrices] = useState(pairs);

  const simulate = useCallback(() => {
    setPrices(prev => prev.map(p => {
      const vol = p.bid > 100 ? 0.05 : p.bid > 1 ? 0.0001 : 0.00005;
      const change = (Math.random() - 0.5) * vol;
      return { ...p, bid: p.bid + change, ask: p.ask + change };
    }));
  }, []);

  useEffect(() => { const t = setInterval(simulate, 2000); return () => clearInterval(t); }, [simulate]);

  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="absolute inset-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200" 
            alt="Forex background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container-axi relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-left">
            <span className="text-[#FFC800] text-xs font-space font-extrabold uppercase tracking-widest block mb-3">AXI MARKETS</span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-5xl font-space font-black tracking-tight text-white"
            >
              Forex Trading
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.15 }} 
              className="mt-4 text-base text-gray-300 leading-relaxed"
            >
              Trade 80+ currency pairs with ultra-competitive spreads from 0.0 pips, lightning-fast execution, and institutional-grade liquidity.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }} 
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/signup" className="btn-yellow px-7 py-3 rounded text-[11px] font-semibold uppercase tracking-[1.5px] inline-block">
                START TRADING FOREX
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600" 
              alt="Forex Trading Desk" 
              className="rounded-[8px] shadow-2xl border border-gray-800 object-cover max-h-[320px] w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <section className="py-12" style={{ backgroundColor: "#fff" }}>
        <div className="container-axi">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-lg text-center border" style={{ borderColor: "#D9D3CB" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D31C2B" }}><f.icon size={22} className="text-white" /></div>
                <h3 className="text-base font-bold" style={{ color: "#1A1A1A" }}>{f.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "#6B6560" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4" style={{ color: "#1A1A1A" }}>Live Forex Prices</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "#D9D3CB" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F5F2ED" }}>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Pair</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Description</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Bid</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Ask</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Spread</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Change</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.name} style={{ borderBottom: "1px solid #F5F2ED" }}>
                    <td className="px-4 py-3.5 text-sm font-bold" style={{ color: "#1A1A1A" }}>{p.name}</td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "#6B6560" }}>{p.full}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{p.bid.toFixed(p.bid > 100 ? 3 : 5)}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{p.ask.toFixed(p.ask > 100 ? 3 : 5)}</td>
                    <td className="px-4 py-3.5 text-right"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: "rgba(34,169,88,0.1)", color: "#22A958" }}>{p.spread}</span></td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold" style={{ color: p.change >= 0 ? "#22A958" : "#D31C2B" }}>{p.change >= 0 ? "+" : ""}{p.change.toFixed(2)}%</td>
                    <td className="px-4 py-3.5 text-right"><button className="btn-yellow text-[10px] py-1.5 px-3">Trade</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
