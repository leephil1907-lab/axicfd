import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { TrendingUp, Globe, BarChart3 } from "lucide-react";

const indices = [
  { name: "US30", full: "Wall Street 30", bid: 52380.35, ask: 52381.55, spread: 120, change: 0.45 },
  { name: "NAS100", full: "US Tech 100", bid: 29514.0, ask: 29516.5, spread: 250, change: 0.89 },
  { name: "US500", full: "S&P 500", bid: 5268.25, ask: 5269.75, spread: 15, change: 0.34 },
  { name: "UK100", full: "FTSE 100", bid: 8234.5, ask: 8238.0, spread: 35, change: -0.12 },
  { name: "GER40", full: "DAX 40", bid: 18342.0, ask: 18346.0, spread: 40, change: 0.56 },
  { name: "FRA40", full: "CAC 40", bid: 7524.0, ask: 7527.5, spread: 35, change: -0.23 },
  { name: "AUS200", full: "ASX 200", bid: 7824.0, ask: 7828.0, spread: 40, change: 0.18 },
  { name: "JP225", full: "Nikkei 225", bid: 39542.0, ask: 39548.0, spread: 60, change: 1.12 },
];

const features = [
  { icon: Globe, title: "Global Markets", desc: "Trade major indices from around the world" },
  { icon: BarChart3, title: "Low Margins", desc: "Trade with leverage up to 200:1" },
  { icon: TrendingUp, title: "24/5 Access", desc: "Trade indices during market hours" },
];

export default function IndicesPage() {
  const [prices, setPrices] = useState(indices);
  const simulate = useCallback(() => {
    setPrices(prev => prev.map(p => {
      const vol = p.bid * 0.0005;
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
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200" 
            alt="Indices background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container-axi relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-left">
            <span className="text-[#FFC800] text-xs font-space font-extrabold uppercase tracking-widest block mb-3">AXI GLOBAL INDICES</span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-5xl font-space font-black tracking-tight text-white"
            >
              Indices Trading
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.15 }} 
              className="mt-4 text-base text-gray-300 leading-relaxed"
            >
              Trade the world\'s most popular stock indices, including the S&P 500, Dow Jones, NASDAQ, and DAX 40. Access tight spreads, high leverage, and 24-hour liquidity.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }} 
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/signup" className="btn-yellow px-7 py-3 rounded text-[11px] font-semibold uppercase tracking-[1.5px] inline-block">
                TRADE INDICES
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=600" 
              alt="Global Stock Market Indices" 
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
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1A1A1A" }}>Global Indices</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "#D9D3CB" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F5F2ED" }}>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Index</th>
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
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{p.bid.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{p.ask.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
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
