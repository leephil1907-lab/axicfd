import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Factory, TrendingUp, Fuel } from "lucide-react";

const commodities = [
  { name: "WTI", full: "West Texas Intermediate", bid: 78.45, ask: 78.52, spread: 0.04, change: 1.23 },
  { name: "BRENT", full: "Brent Crude Oil", bid: 82.65, ask: 82.72, spread: 0.04, change: 1.15 },
  { name: "NGAS", full: "Natural Gas", bid: 2.145, ask: 2.152, spread: 0.005, change: -0.82 },
  { name: "COPPER", full: "Copper", bid: 4.125, ask: 4.135, spread: 0.006, change: 0.45 },
  { name: "WHEAT", full: "Wheat", bid: 5.42, ask: 5.45, spread: 0.03, change: -0.34 },
  { name: "CORN", full: "Corn", bid: 3.85, ask: 3.88, spread: 0.03, change: 0.21 },
  { name: "SOYBEAN", full: "Soybean", bid: 11.25, ask: 11.30, spread: 0.05, change: 0.56 },
  { name: "COFFEE", full: "Coffee", bid: 1.82, ask: 1.85, spread: 0.03, change: -1.12 },
];

const features = [
  { icon: Fuel, title: "Energy & Agriculture", desc: "Trade oil, gas and agricultural products" },
  { icon: Factory, title: "Metals & Softs", desc: "Access copper, wheat, coffee and more" },
  { icon: TrendingUp, title: "Leverage up to 100:1", desc: "Maximize your commodity trades" },
];

export default function CommoditiesPage() {
  const [prices, setPrices] = useState(commodities);
  const simulate = useCallback(() => {
    setPrices(prev => prev.map(p => {
      const vol = p.bid * 0.005;
      const change = (Math.random() - 0.5) * vol;
      return { ...p, bid: Math.max(0.01, p.bid + change), ask: Math.max(0.01, p.ask + change) };
    }));
  }, []);
  useEffect(() => { const t = setInterval(simulate, 2000); return () => clearInterval(t); }, [simulate]);

  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="absolute inset-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200" 
            alt="Commodities background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container-axi relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-left">
            <span className="text-[#FFC800] text-xs font-space font-extrabold uppercase tracking-widest block mb-3">AXI COMMODITIES</span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-5xl font-space font-black tracking-tight text-white"
            >
              Commodities Trading
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.15 }} 
              className="mt-4 text-base text-gray-300 leading-relaxed"
            >
              Trade crude oil, natural gas, precious metals, and key agricultural products. Access deep market liquidity with leverage up to 100:1 and no hidden fees.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }} 
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/signup" className="btn-yellow px-7 py-3 rounded text-[11px] font-semibold uppercase tracking-[1.5px] inline-block">
                TRADE COMMODITIES
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=600" 
              alt="Oil Rig & Resources" 
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
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1A1A1A" }}>Commodity Prices</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "#D9D3CB" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F5F2ED" }}>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Instrument</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Description</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Bid</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Ask</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Spread</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Change</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody>
                {prices.map(p => (
                  <tr key={p.name} style={{ borderBottom: "1px solid #F5F2ED" }}>
                    <td className="px-4 py-3.5 text-sm font-bold" style={{ color: "#1A1A1A" }}>{p.name}</td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "#6B6560" }}>{p.full}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{p.bid.toFixed(p.bid < 10 ? 3 : 2)}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{p.ask.toFixed(p.ask < 10 ? 3 : 2)}</td>
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
