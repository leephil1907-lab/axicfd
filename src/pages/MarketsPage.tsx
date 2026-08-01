import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Search, TrendingUp, BarChart3, DollarSign, Coins, Factory, Globe } from "lucide-react";

const categories = [
  { name: "Forex", icon: DollarSign, desc: "Trade 80+ currency pairs with ultra-tight spreads from 0.0 pips" },
  { name: "Shares CFDs", icon: BarChart3, desc: "Access global share CFDs with zero commission" },
  { name: "Indices", icon: TrendingUp, desc: "Trade major global indices with low margins" },
  { name: "Commodities", icon: Factory, desc: "Trade oil, gas and agricultural products" },
  { name: "Metals", icon: Coins, desc: "Gold, silver and precious metals trading" },
  { name: "Crypto", icon: Globe, desc: "Trade Bitcoin, Ethereum and more CFDs" },
];

type Instrument = { name: string; bid: number; ask: number; spread: string; category: string };

const allInstruments: Instrument[] = [
  { name: "EURUSD", bid: 1.14237, ask: 1.14243, spread: "0.6", category: "Forex" },
  { name: "GBPUSD", bid: 1.33928, ask: 1.33936, spread: "0.8", category: "Forex" },
  { name: "USDJPY", bid: 162.483, ask: 162.49, spread: "0.7", category: "Forex" },
  { name: "AUDUSD", bid: 0.65432, ask: 0.65445, spread: "0.8", category: "Forex" },
  { name: "USDCAD", bid: 1.4165, ask: 1.41658, spread: "0.8", category: "Forex" },
  { name: "XAUUSD", bid: 4074.8, ask: 4074.96, spread: "16", category: "Metals" },
  { name: "XAGUSD", bid: 27.845, ask: 27.885, spread: "0.025", category: "Metals" },
  { name: "US30", bid: 52380.35, ask: 52381.55, spread: "120", category: "Indices" },
  { name: "NAS100", bid: 29514, ask: 29516.5, spread: "250", category: "Indices" },
  { name: "US500", bid: 5268.25, ask: 5269.75, spread: "0.5", category: "Indices" },
  { name: "BTCUSD", bid: 62175.99, ask: 62187.99, spread: "1200", category: "Crypto" },
  { name: "ETHUSD", bid: 1738.79, ask: 1740.04, spread: "125", category: "Crypto" },
  { name: "WTI", bid: 78.45, ask: 78.52, spread: "0.04", category: "Commodities" },
  { name: "BRENT", bid: 82.65, ask: 82.72, spread: "0.04", category: "Commodities" },
];

export default function MarketsPage() {
  const [prices, setPrices] = useState(allInstruments);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const simulatePrices = useCallback(() => {
    setPrices((prev) => prev.map((inst) => {
      const vol = inst.bid > 1000 ? 0.5 : inst.bid > 1 ? 0.0001 : 0.001;
      const change = (Math.random() - 0.5) * vol;
      return { ...inst, bid: Math.max(0.0001, inst.bid + change), ask: Math.max(0.0001, inst.ask + change) };
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(simulatePrices, 2000);
    return () => clearInterval(interval);
  }, [simulatePrices]);

  const filtered = prices.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || inst.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const format = (v: number, n: string) => {
    if (n.includes("BTC") || n.includes("ETH")) return v.toFixed(2);
    if (v >= 10000) return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (v >= 1000) return v.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (v >= 100) return v.toFixed(1);
    if (v >= 1) return v.toFixed(5);
    return v.toFixed(4);
  };

  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="absolute inset-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200" 
            alt="Markets background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container-axi relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-left">
            <span className="text-[#FFC800] text-xs font-space font-extrabold uppercase tracking-widest block mb-3">AXI GLOBAL INSTRUMENTS</span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-5xl font-space font-black tracking-tight text-white animate-fade-in"
            >
              Markets to Trade
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.15 }} 
              className="mt-4 text-base text-gray-300 leading-relaxed"
            >
              Access 1,000+ financial instruments across forex, shares, indices, commodities, precious metals, and cryptocurrency CFDs with high leverage and secure liquidity.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }} 
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/signup" className="btn-yellow px-7 py-3 rounded text-[11px] font-semibold uppercase tracking-[1.5px] inline-block">
                START TRADING
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600" 
              alt="Global Financial Markets" 
              className="rounded-[8px] shadow-2xl border border-gray-800 object-cover max-h-[320px] w-full animate-fade-in"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#fff" }}>
        <div className="container-axi">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border cursor-pointer transition-all hover:shadow-md"
                style={{ borderColor: "#D9D3CB", backgroundColor: "#fff" }}
                onClick={() => setActiveCategory(cat.name)}
              >
                <cat.icon size={32} style={{ color: "#D31C2B" }} />
                <h3 className="mt-4 text-lg font-bold" style={{ color: "#1A1A1A" }}>{cat.name}</h3>
                <p className="mt-2 text-sm" style={{ color: "#6B6560" }}>{cat.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {["All", ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 text-xs uppercase font-semibold rounded transition-colors"
                  style={{
                    backgroundColor: activeCategory === cat ? "#D31C2B" : "#F5F2ED",
                    color: activeCategory === cat ? "#fff" : "#6B6560",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9B9590" }} />
              <input type="text" placeholder="Search instruments..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border rounded w-[250px] focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/30" style={{ borderColor: "#D9D3CB" }} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#F5F2ED" }}>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Instrument</th>
                  <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Bid</th>
                  <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Ask</th>
                  <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Spread</th>
                  <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Category</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inst) => (
                  <tr key={inst.name} style={{ borderBottom: "1px solid #F5F2ED" }}>
                    <td className="px-4 py-3.5 text-sm font-bold" style={{ color: "#1A1A1A" }}>{inst.name}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{format(inst.bid, inst.name)}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm">{format(inst.ask, inst.name)}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm" style={{ color: "#22A958" }}>{inst.spread}</td>
                    <td className="px-4 py-3.5 text-right text-sm" style={{ color: "#6B6560" }}>{inst.category}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="btn-yellow text-[10px] py-1.5 px-4">Trade Now</button>
                    </td>
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
