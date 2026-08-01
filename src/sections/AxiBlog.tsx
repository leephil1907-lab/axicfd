import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Clock, User, Sparkles } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    category: "Education",
    title: "Best proprietary trading firms and forex prop firms",
    author: "Milan Cutkovic",
    readTime: "5 min read",
    excerpt: "Discover the top proprietary trading programs and forex prop firms with Axi Select capital allocation models compared.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    category: "Stocks & AI",
    title: "Anthropic & AI Market Forecast: What Traders Need to Know",
    author: "Alex Macris",
    readTime: "4 min read",
    excerpt: "Key financial metrics, valuation outlooks, and how global equity traders can capitalize on technology stock momentum.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    category: "Cryptocurrencies",
    title: "Bitcoin Price Predictions: Bull & Bear Scenarios Analyzed",
    author: "Alex Macris",
    readTime: "6 min read",
    excerpt: "Fact-checked technical price forecasts for Bitcoin (BTC), ETF institutional flows, and macroeconomic volatility drivers.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    category: "Risk Management",
    title: "How to Master Stop-Loss & Take-Profit Orders in MT4/MT5",
    author: "Milan Cutkovic",
    readTime: "5 min read",
    excerpt: "Essential risk management strategies, position sizing formulas, and avoiding slippage in fast-moving market conditions.",
  },
];

export default function AxiBlog() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Axi Edge Blog & Market Analysis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Market Insights & Education
            </h2>
            <p className="text-slate-400 text-sm font-semibold mt-2 max-w-xl">
              Stay ahead of financial markets with expert analysis, strategy guides, and macro news written by Axi market strategists.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFC800] hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 hover:scale-105"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Link
                to={`/blog`}
                className="group flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative overflow-hidden aspect-video bg-slate-800">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-slate-950/90 backdrop-blur-md text-[#FFC800] border border-yellow-500/30 text-[10px] font-black uppercase tracking-wider rounded-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2.5 text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <User className="w-3.5 h-3.5 text-red-500" />
                      <span>{post.author}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

