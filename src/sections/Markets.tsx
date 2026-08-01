import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

type Instrument = { name: string; bid: number; ask: number; std: number | string; pro: string };

const marketData: Record<string, Instrument[]> = {
  Popular: [
    { name: "XAUUSD", bid: 4074.8, ask: 4074.96, std: 16, pro: "9" },
    { name: "NAS100.fs", bid: 29514, ask: 29516.5, std: 250, pro: "n/a" },
    { name: "GBPUSD", bid: 1.33928, ask: 1.33936, std: 0.8, pro: "0" },
    { name: "GBPJPY", bid: 217.608, ask: 217.622, std: 1.4, pro: "0.9" },
    { name: "EURUSD", bid: 1.14237, ask: 1.14243, std: 0.6, pro: "0" },
    { name: "USDJPY", bid: 162.483, ask: 162.49, std: 0.7, pro: "0" },
    { name: "US30", bid: 52380.35, ask: 52381.55, std: 120, pro: "n/a" },
    { name: "USDCAD", bid: 1.4165, ask: 1.41658, std: 0.8, pro: "0" },
  ],
  Forex: [
    { name: "EURUSD", bid: 1.14237, ask: 1.14243, std: 0.6, pro: "0" },
    { name: "GBPUSD", bid: 1.33928, ask: 1.33936, std: 0.8, pro: "0" },
    { name: "USDJPY", bid: 162.483, ask: 162.49, std: 0.7, pro: "0" },
    { name: "AUDUSD", bid: 0.65432, ask: 0.65445, std: 0.8, pro: "0.1" },
    { name: "USDCAD", bid: 1.4165, ask: 1.41658, std: 0.8, pro: "0" },
    { name: "EURGBP", bid: 0.85241, ask: 0.85252, std: 0.7, pro: "0.1" },
    { name: "NZDUSD", bid: 0.58932, ask: 0.58948, std: 1.0, pro: "0.2" },
    { name: "USDCHF", bid: 0.91245, ask: 0.91258, std: 0.9, pro: "0.1" },
  ],
  Metals: [
    { name: "XAUUSD", bid: 4074.8, ask: 4074.96, std: 16, pro: "9" },
    { name: "XAGUSD", bid: 27.845, ask: 27.885, std: 0.025, pro: "0.012" },
    { name: "XPTUSD", bid: 965.20, ask: 967.50, std: 2.5, pro: "1.8" },
    { name: "XPDUSD", bid: 1023.50, ask: 1026.00, std: 3.0, pro: "2.2" },
  ],
  Indices: [
    { name: "US30", bid: 52380.35, ask: 52381.55, std: 120, pro: "n/a" },
    { name: "NAS100.fs", bid: 29514, ask: 29516.5, std: 250, pro: "n/a" },
    { name: "US500", bid: 5268.25, ask: 5269.75, std: 0.5, pro: "0.3" },
    { name: "UK100", bid: 8234.5, ask: 8238.0, std: 1.5, pro: "0.8" },
    { name: "GER40", bid: 18342.0, ask: 18346.0, std: 1.2, pro: "0.6" },
  ],
  Commodities: [
    { name: "WTI", bid: 78.45, ask: 78.52, std: 0.04, pro: "0.03" },
    { name: "BRENT", bid: 82.65, ask: 82.72, std: 0.04, pro: "0.03" },
    { name: "NGAS", bid: 2.145, ask: 2.152, std: 0.005, pro: "0.003" },
    { name: "COPPER", bid: 4.125, ask: 4.135, std: 0.006, pro: "0.004" },
  ],
  Cryptocurrencies: [
    { name: "BTCUSD", bid: 62175.99, ask: 62187.99, std: 1200, pro: "n/a" },
    { name: "ETHUSD", bid: 1738.79, ask: 1740.04, std: 125, pro: "n/a" },
    { name: "LTCUSD", bid: 43.5, ask: 43.68, std: 18, pro: "n/a" },
    { name: "XRPUSD", bid: 1.0863, ask: 1.0895, std: 32, pro: "n/a" },
    { name: "BCHUSD", bid: 234.82, ask: 235.62, std: 80, pro: "n/a" },
  ],
};

const tabs = Object.keys(marketData);

function formatPrice(value: number, name: string): string {
  if (name.includes("BTC") || name.includes("ETH")) return value.toFixed(2);
  if (value >= 10000) return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (value >= 1000) return value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  if (value >= 100) return value.toFixed(1);
  if (value >= 1) return value.toFixed(5);
  return value.toFixed(4);
}

export default function Markets() {
  const [activeTab, setActiveTab] = useState("Popular");
  const [prices, setPrices] = useState(marketData);
  const [search, setSearch] = useState("");
  const [flashStates, setFlashStates] = useState<Record<string, "up" | "down" | null>>({});
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const simulatePrices = useCallback(() => {
    setPrices((prev) => {
      const next = { ...prev };
      tabs.forEach((tab) => {
        next[tab] = prev[tab].map((inst) => {
          const volatility =
            inst.name.includes("BTC") ? 50 :
            inst.name.includes("ETH") ? 8 :
            inst.name.includes("XAU") ? 0.5 :
            inst.bid > 10000 ? 2 :
            inst.bid > 1000 ? 0.5 :
            inst.bid > 1 ? 0.0002 :
            0.002;
          const change = (Math.random() - 0.5) * volatility;
          const newBid = Math.max(0.0001, inst.bid + change);
          const newAsk = Math.max(0.0001, inst.ask + change);
          const flashKey = `${tab}-${inst.name}`;
          setFlashStates((f) => ({ ...f, [flashKey]: change > 0 ? "up" : "down" }));
          setTimeout(() => setFlashStates((f) => ({ ...f, [flashKey]: null })), 500);
          return { ...inst, bid: newBid, ask: newAsk };
        });
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(simulatePrices, 2000);
    return () => clearInterval(interval);
  }, [simulatePrices]);

  const filtered = prices[activeTab].filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="markets" ref={ref} className="py-16" style={{ backgroundColor: "#fff" }}>
      <div className="container-axi">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1A1A1A" }}>
            A world of opportunity
          </h2>
          <p className="mt-3 text-base max-w-[600px] mx-auto" style={{ color: "#6B6560" }}>
            Ultra-competitive pricing and fairer charges, so more of your money is invested in the markets.
          </p>
          <button className="btn-yellow mt-6">POWER UP YOUR PORTFOLIO</button>
        </motion.div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b" style={{ borderColor: "#D9D3CB" }}>
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 md:px-5 py-3 text-[13px] uppercase transition-colors relative whitespace-nowrap"
                style={{
                  color: activeTab === tab ? "#D31C2B" : "#6B6560",
                  fontWeight: activeTab === tab ? 600 : 400,
                  borderBottom: activeTab === tab ? "2px solid #D31C2B" : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative mb-2 sm:mb-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9B9590" }} />
            <input
              type="text" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border rounded w-[200px] focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/30"
              style={{ borderColor: "#D9D3CB" }}
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#F5F2ED" }}>
                {["Instrument", "Bid", "Ask", "Std", "Pro"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560", textAlign: h === "Instrument" ? "left" : "right" }}>
                    {h}
                  </th>
                ))}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inst) => {
                const flash = flashStates[`${activeTab}-${inst.name}`];
                return (
                  <tr key={inst.name} className="transition-colors duration-150" style={{ borderBottom: "1px solid #F5F2ED" }}>
                    <td className="px-4 py-3.5">
                      <Link to={`/markets/${inst.name.toLowerCase()}`} className="text-sm font-bold underline" style={{ color: "#1A1A1A" }}>{inst.name}</Link>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm" style={{ color: flash === "up" ? "#22A958" : flash === "down" ? "#D31C2B" : "#1A1A1A" }}>
                      {formatPrice(inst.bid, inst.name)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm" style={{ color: "#1A1A1A" }}>{formatPrice(inst.ask, inst.name)}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm" style={{ color: "#1A1A1A" }}>{inst.std}</td>
                    <td className="px-4 py-3.5 text-right font-mono-axi text-sm" style={{ color: "#6B6560" }}>{inst.pro}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="btn-yellow text-[10px] py-1.5 px-4">Trade Now</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
