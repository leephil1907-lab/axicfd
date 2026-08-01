import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Bitcoin, TrendingUp, Shield, FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { fetchCoinGeckoMarkets, CoinGeckoMarket, FALLBACK_COINS } from "@/services/coingecko";

const features = [
  { icon: Bitcoin, title: "Trade Crypto CFDs", desc: "Trade Bitcoin, Ethereum and more without a wallet" },
  { icon: Shield, title: "No Wallet Required", desc: "Trade crypto price movements without owning the asset" },
  { icon: TrendingUp, title: "Leverage up to 20:1", desc: "Amplify your crypto trading potential with Axi" },
];

export default function CryptoPage() {
  const [coins, setCoins] = useState<CoinGeckoMarket[]>(FALLBACK_COINS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoins() {
      setLoading(true);
      const data = await fetchCoinGeckoMarkets();
      setCoins(data);
      setLoading(false);
    }
    loadCoins();
    const interval = setInterval(async () => {
      const data = await fetchCoinGeckoMarkets();
      setCoins(data);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="absolute inset-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1200" 
            alt="Crypto background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container-axi relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-left">
            <span className="text-[#FFC800] text-xs font-space font-extrabold uppercase tracking-widest block mb-3">AXI CRYPTO CFDS</span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-5xl font-space font-black tracking-tight text-white"
            >
              Cryptocurrency Trading
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.15 }} 
              className="mt-4 text-base text-gray-300 leading-relaxed"
            >
              Trade Bitcoin, Ethereum, Ripple, and other major tokens with leverage. Powered by live CoinGecko prices, tight spreads, and zero wallet setup required.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }} 
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/trading-sessions" className="btn-yellow px-7 py-3 rounded text-[11px] font-semibold uppercase tracking-[1.5px] inline-block">
                OPEN TRADING SESSION
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=600" 
              alt="Crypto Coins and Charts" 
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
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>Real-Time Cryptocurrency Metrics (CoinGecko)</h2>
            <span className="text-xs text-gray-500 font-mono">Live 24h Updates</span>
          </div>

          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "#D9D3CB" }}>
            <table className="w-full">
              <thead><tr style={{ backgroundColor: "#F5F2ED" }}>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Asset</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Market Cap Rank</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>Live Price ($)</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>24h High</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>24h Low</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#6B6560" }}>24h Change</th>
                <th className="px-4 py-3 text-right"></th>
              </tr></thead>
              <tbody>
                {coins.map(coin => {
                  const isPos = coin.price_change_percentage_24h >= 0;
                  return (
                    <tr key={coin.id} style={{ borderBottom: "1px solid #F5F2ED" }}>
                      <td className="px-4 py-3.5 text-sm font-bold flex items-center gap-3" style={{ color: "#1A1A1A" }}>
                        <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full object-contain" referrerPolicy="no-referrer" />
                        <div>
                          <div className="font-extrabold uppercase">{coin.symbol}/USD</div>
                          <div className="text-xs font-normal text-gray-500">{coin.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-mono text-gray-600">
                        Rank #{coin.market_cap_rank}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-sm" style={{ color: "#1A1A1A" }}>
                        ${coin.current_price < 1 ? coin.current_price.toFixed(4) : coin.current_price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-gray-600">
                        ${coin.high_24h ? (coin.high_24h < 1 ? coin.high_24h.toFixed(4) : coin.high_24h.toLocaleString()) : "-"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-gray-600">
                        ${coin.low_24h ? (coin.low_24h < 1 ? coin.low_24h.toFixed(4) : coin.low_24h.toLocaleString()) : "-"}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono ${
                          isPos ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}>
                          {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link to="/trading-sessions" className="btn-yellow text-[10px] py-1.5 px-3 rounded inline-block">
                          Trade Live
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-center gap-2 p-4 rounded-lg border" style={{ borderColor: "#D9D3CB", backgroundColor: "#F5F2ED" }}>
            <FileText size={18} style={{ color: "#D31C2B" }} />
            <span className="text-sm" style={{ color: "#6B6560" }}>
              Before trading crypto, please read our{" "}
              <a href="/docs/cryptoasset-product-information.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "#D31C2B" }}>
                Cryptoasset Product Information
              </a>{" "}
              document.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
