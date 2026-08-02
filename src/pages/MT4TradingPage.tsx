import { useState } from "react";
import { Link } from "react-router";
import { 
  Download, Monitor, Smartphone, Globe, CheckCircle, 
  ArrowRight, Shield, Zap, BarChart3, TrendingUp, 
  Clock, Users, Star, ChevronDown, ChevronUp, Play,
  Laptop, Tablet, Apple, Cpu
} from "lucide-react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";

const mt4Features = [
  { icon: BarChart3, title: "Advanced Charting", desc: "30+ built-in indicators, 9 timeframes, 3 chart types" },
  { icon: Zap, title: "One-Click Trading", desc: "Execute trades instantly with a single click" },
  { icon: Shield, title: "Secure Trading", desc: "256-bit SSL encryption, two-factor authentication" },
  { icon: TrendingUp, title: "Automated Trading", desc: "Expert Advisors (EAs) for algorithmic strategies" },
  { icon: Clock, title: "Real-Time Quotes", desc: "Live market data with sub-second latency" },
  { icon: Users, title: "Social Trading", desc: "Copy trades from top-performing traders" },
];

const systemRequirements = [
  { os: "Windows", version: "Windows 7/8/10/11", ram: "2 GB RAM", storage: "100 MB free space", icon: Monitor },
  { os: "macOS", version: "macOS 10.14+", ram: "2 GB RAM", storage: "100 MB free space", icon: Laptop },
  { os: "iOS", version: "iOS 12.0+", ram: "N/A", storage: "50 MB free space", icon: Smartphone },
  { os: "Android", version: "Android 5.0+", ram: "N/A", storage: "30 MB free space", icon: Tablet },
];

const comparisonData = [
  { feature: "Spreads", simulated: "Same as real", real: "From 0.0 pips" },
  { feature: "Leverage", simulated: "Up to 1:500", real: "Up to 1:500" },
  { feature: "Instruments", simulated: "All 1000+", real: "All 1000+" },
  { feature: "Execution", simulated: "Instant", real: "Instant" },
  { feature: "Virtual Funds", simulated: "$10,000 - $100,000", real: "Your deposit" },
  { feature: "Risk", simulated: "None (virtual)", real: "Real money risk" },
  { feature: "Profit", simulated: "Not withdrawable", real: "Fully withdrawable" },
  { feature: "EAs & Indicators", simulated: "Full access", real: "Full access" },
];

export default function MT4TradingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'download'>('overview');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedOS, setSelectedOS] = useState('Windows');

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#D31C2B] text-white text-xs px-3 py-1 rounded-full font-semibold">POPULAR</span>
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">TRUSTED</span>
              </div>
              <h1 className="text-5xl font-bold mb-4">MetaTrader 4</h1>
              <p className="text-xl text-gray-300 mb-6">The world's most popular trading platform for Forex and CFDs. Trade with confidence using industry-standard tools.</p>

              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>4.8/5 (12,400+ reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>10M+ traders worldwide</span>
                </div>
              </div>

              {/* Live Account Button */}
              <div className="flex gap-4">
                <Link 
                  to="/signup?platform=mt4" 
                  className="flex-1 bg-[#D31C2B] hover:bg-red-700 text-white py-4 px-6 rounded-xl text-center transition-all shadow-lg shadow-red-900/30"
                >
                  <div className="text-sm text-white/80 mb-1">Start Trading Live</div>
                  <div className="text-lg font-bold">Open Live Trading Account</div>
                  <div className="text-xs text-white/70 mt-1">Instant Onboarding</div>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-gray-500">MetaTrader 4</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">EUR/USD</span>
                    <span className="text-green-400 font-mono">1.08920 ▲</span>
                  </div>
                  <div className="h-32 bg-gray-900 rounded-lg flex items-end gap-1 p-2">
                    {[40, 60, 45, 70, 55, 80, 65, 90, 75, 85, 60, 95, 70, 88, 55, 78, 82, 65, 90, 72].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#D31C2B] rounded-t" style={{ height: `${h}%`, opacity: 0.6 + (i * 0.02) }}></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 py-2 rounded text-sm font-semibold">BUY</button>
                    <button className="flex-1 bg-red-600 py-2 rounded text-sm font-semibold">SELL</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'features', label: 'Features' },
              { key: 'download', label: 'Download' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-[#D31C2B] text-[#D31C2B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Why Choose MT4 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MetaTrader 4?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">MT4 is the industry standard for a reason. Powerful, reliable, and packed with features that professional traders demand.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            {mt4Features.map((feat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <feat.icon className="w-10 h-10 text-[#D31C2B] mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Demo vs Real Comparison */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-12">
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900">Demo vs Live Account Comparison</h3>
                <p className="text-sm text-gray-500 mt-1">See the differences before you start</p>
              </div>
              {showComparison ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {showComparison && (
              <div className="px-6 pb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-500">Feature</th>
                      <th className="text-center py-3 text-gray-900 font-semibold bg-blue-50">Demo Account</th>
                      <th className="text-center py-3 text-gray-900 font-semibold bg-green-50">Live Trading Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-3 text-gray-700">{row.feature}</td>
                        <td className="py-3 text-center text-blue-600">{row.simulated}</td>
                        <td className="py-3 text-center text-green-600">{row.real}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#D31C2B] to-red-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Start Trading?</h3>
            <p className="text-white/80 mb-6">Open your live account and download MT4 in minutes</p>
            <div className="flex justify-center gap-4">
              <Link to="/signup?platform=mt4" className="bg-white text-[#D31C2B] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Open Live Trading Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Analysis</h3>
              <ul className="space-y-3">
                {['30 built-in technical indicators', '23 analytical objects', '3 chart types (Bars, Candles, Line)', '9 timeframes (M1 to MN1)', 'Custom indicator support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trading Features</h3>
              <ul className="space-y-3">
                {['Market, Limit, Stop orders', '4 pending order types', 'Trailing Stop', 'One-click trading', 'Hedging allowed', 'Micro lot trading (0.01)'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Trading</h3>
              <ul className="space-y-3">
                {['Expert Advisors (EAs)', 'MQL4 programming language', 'Strategy Tester', 'Backtesting capabilities', 'Custom script support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security</h3>
              <ul className="space-y-3">
                {['256-bit SSL encryption', 'Two-factor authentication', 'IP restriction', 'Real-time monitoring', 'Segregated client funds'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Download Tab */}
      {activeTab === 'download' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Download MetaTrader 4</h2>
            <p className="text-gray-600">Available for desktop, web, and mobile</p>
          </div>

          {/* OS Selector */}
          <div className="flex justify-center gap-2 mb-8">
            {systemRequirements.map((sys) => (
              <button
                key={sys.os}
                onClick={() => setSelectedOS(sys.os)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOS === sys.os ? 'bg-[#D31C2B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <sys.icon className="w-4 h-4" />
                {sys.os}
              </button>
            ))}
          </div>

          {/* Selected OS Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            {systemRequirements.filter(s => s.os === selectedOS).map(sys => (
              <div key={sys.os} className="text-center">
                <sys.icon className="w-16 h-16 text-[#D31C2B] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{sys.os} Version</h3>
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">OS Version</div>
                    <div className="text-sm font-semibold text-gray-900">{sys.version}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">RAM</div>
                    <div className="text-sm font-semibold text-gray-900">{sys.ram}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Storage</div>
                    <div className="text-sm font-semibold text-gray-900">{sys.storage}</div>
                  </div>
                </div>
                <button className="bg-[#D31C2B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download for {sys.os}
                </button>
              </div>
            ))}
          </div>

          {/* Web Trader */}
          <div className="bg-gray-900 rounded-xl p-8 text-white text-center">
            <Globe className="w-12 h-12 text-[#D31C2B] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">WebTrader</h3>
            <p className="text-gray-400 mb-4">Trade directly from your browser without downloading</p>
            <Link to="/trading?platform=mt4-web" className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              <Play className="w-4 h-4" />
              Launch WebTrader
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
