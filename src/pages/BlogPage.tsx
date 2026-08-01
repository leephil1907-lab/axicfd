import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Search, Calendar, Clock, User, TrendingUp, TrendingDown, ArrowRight, Tag, ChevronRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "EUR/USD Analysis: ECB Decision Looms Large",
    excerpt: "The euro faces a critical test this week as the European Central Bank prepares its latest monetary policy decision. With inflation data showing mixed signals...",
    category: "Forex Analysis",
    author: "Sarah Chen",
    date: "2026-07-10",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    trending: "up",
    tags: ["EUR/USD", "ECB", "Forex", "Technical Analysis"],
  },
  {
    id: 2,
    title: "Gold Breaks $2,700: What's Next for XAU/USD?",
    excerpt: "Gold has surged to new all-time highs as geopolitical tensions and inflation concerns drive safe-haven demand. Our technical analysis suggests...",
    category: "Commodities",
    author: "Michael Torres",
    date: "2026-07-09",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
    trending: "up",
    tags: ["Gold", "XAU/USD", "Commodities", "Safe Haven"],
  },
  {
    id: 3,
    title: "Bitcoin ETF Inflows Hit Record $500M in Single Day",
    excerpt: "Institutional adoption of Bitcoin continues to accelerate as spot ETFs see unprecedented inflows. This marks a significant milestone for the crypto market...",
    category: "Crypto",
    author: "Alex Kim",
    date: "2026-07-08",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    trending: "up",
    tags: ["Bitcoin", "ETF", "Crypto", "Institutional"],
  },
  {
    id: 4,
    title: "Fed Chair Powell Speech: Market Expectations",
    excerpt: "Markets are pricing in a dovish pivot from the Federal Reserve. We break down what traders should watch for in tomorrow's speech and how it could impact...",
    category: "Market News",
    author: "Emma Williams",
    date: "2026-07-07",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    trending: "down",
    tags: ["Fed", "USD", "Interest Rates", "Macro"],
  },
  {
    id: 5,
    title: "OPEC+ Maintains Production Cuts: Oil Market Outlook",
    excerpt: "Crude oil prices found support as OPEC+ members agreed to maintain current production cuts through Q3 2026. The decision reflects concerns about...",
    category: "Commodities",
    author: "David Patel",
    date: "2026-07-06",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=1200&q=80",
    trending: "up",
    tags: ["Oil", "OPEC", "Commodities", "Energy"],
  },
  {
    id: 6,
    title: "GBP/USD Under Pressure as BoE Signals Dovish Pivot",
    excerpt: "The British pound weakened against the dollar as the Bank of England hinted at potential rate cuts. Technical levels to watch include...",
    category: "Forex Analysis",
    author: "Sarah Chen",
    date: "2026-07-05",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    trending: "down",
    tags: ["GBP/USD", "BoE", "Forex", "Technical"],
  },
];

const categories = ["All", "Forex Analysis", "Crypto", "Commodities", "Market News", "Education", "Trading Strategy"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blogPosts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = blogPosts[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Market Insights & Analysis</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">Expert analysis, market updates, and trading strategies from our team of professional analysts.</p>
          </div>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#D31C2B]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Post */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-12">
          <div className="grid grid-cols-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#D31C2B] text-white text-xs px-3 py-1 rounded-full font-semibold">FEATURED</span>
                <span className="text-gray-400 text-sm">{featured.category}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{featured.title}</h2>
              <p className="text-gray-400 mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {featured.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {featured.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featured.readTime}</span>
              </div>
              <Link to={`/blog/${featured.id}`} className="inline-flex items-center gap-2 text-[#D31C2B] font-semibold mt-4 hover:underline">
                Read Analysis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-full min-h-[280px]">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#D31C2B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.slice(1).map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group">
              <article className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                <div className="h-48 overflow-hidden relative bg-slate-900">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-950/90 text-[#FFC800] border border-yellow-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs text-[#E31B23] font-bold uppercase tracking-wider">{post.category}</span>
                      {post.trending === "up" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                    </div>
                    <h3 className="font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-[#E31B23] transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-slate-600"><User className="w-3.5 h-3.5 text-[#E31B23]" /> {post.author}</span>
                      <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
