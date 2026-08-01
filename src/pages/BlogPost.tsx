import { useParams } from "react-router";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Calendar, Clock, User, Share2, Bookmark, ChevronLeft, Tag } from "lucide-react";
import { Link } from "react-router";

const posts = {
  1: {
    title: "EUR/USD Analysis: ECB Decision Looms Large",
    author: "Sarah Chen",
    date: "July 10, 2026",
    readTime: "5 min read",
    category: "Forex Analysis",
    tags: ["EUR/USD", "ECB", "Forex", "Technical Analysis", "Macro"],
    content: `
      <p>The euro faces a critical test this week as the European Central Bank prepares its latest monetary policy decision. With inflation data showing mixed signals across the Eurozone, traders are closely watching for any hints about the future trajectory of interest rates.</p>

      <h3>Technical Outlook</h3>
      <p>From a technical perspective, EUR/USD is trading within a well-defined ascending channel on the daily timeframe. The pair has found strong support at the 1.0850 level, with the 50-period moving average providing dynamic support. Resistance is seen at 1.0950 and 1.1000.</p>

      <p>The RSI indicator is currently reading 62.5, suggesting room for further upside before reaching overbought conditions. MACD remains bullish with the signal line above the histogram.</p>

      <h3>Fundamental Drivers</h3>
      <p>The ECB is widely expected to maintain rates at 4.50%, but the press conference will be crucial. Markets are pricing in approximately 75 basis points of cuts by year-end. Any deviation from this expectation could trigger significant volatility.</p>

      <p>Key levels to watch:</p>
      <ul>
        <li>Support: 1.0850, 1.0800, 1.0750</li>
        <li>Resistance: 1.0950, 1.1000, 1.1050</li>
      </ul>

      <h3>Trading Strategy</h3>
      <p>Given the current setup, a breakout above 1.0950 could target 1.1000. Alternatively, a rejection at resistance may see a pullback to 1.0850 support. Risk management is essential given the event risk.</p>
    `,
  },
};

export default function BlogPost() {
  const { id } = useParams();
  const post = posts[Number(id)] || posts[1];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <article className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#D31C2B] text-white text-xs px-3 py-1 rounded-full font-semibold">{post.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
            <div className="ml-auto flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Share2 className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Bookmark className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
