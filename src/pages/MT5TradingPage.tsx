import { useState } from "react";
import { Link } from "react-router";
import { 
  Download, Monitor, Smartphone, Globe, CheckCircle, 
  ArrowRight, Shield, Zap, BarChart3, TrendingUp, 
  Clock, Users, Star, ChevronDown, ChevronUp, Play,
  Laptop, Tablet, Apple, Cpu, Layers, Calendar, BookOpen
} from "lucide-react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";

const mt5Features = [
  { icon: Layers, title: "More Timeframes", desc: "21 timeframes vs 9 in MT4 — more granular analysis" },
  { icon: BarChart3, title: "Advanced Charts", desc: "Unlimited charts, 38 built-in indicators, 44 analytical objects" },
  { icon: Calendar, title: "Economic Calendar", desc: "Built-in economic calendar with real-time news" },
  { icon: BookOpen, title: "Depth of Market", desc: "View market depth and liquidity levels" },
  { icon: Zap, title: "Faster Execution", desc: "64-bit multi-threaded architecture for faster processing" },
  { icon: Shield, title: "Netting & Hedging", desc: "Support for both netting and hedging systems" },
];

const systemRequirements = [
  { os: "Windows", version: "Windows 7/8/10/11", ram: "4 GB RAM", storage: "150 MB free space", icon: Monitor },
  { os: "macOS", version: "macOS 10.14+", ram: "4 GB RAM", storage: "150 MB free space", icon: Laptop },
  { os: "iOS", version: "iOS 13.0+", ram: "N/A", storage: "80 MB free space", icon: Smartphone },
  { os: "Android", version: "Android 6.0+", ram: "N/A", storage: "50 MB free space", icon: Tablet },
];

const comparisonData = [
  { feature: "Timeframes", simulated: "21", real: "21" },
  { feature: "Indicators", simulated: "38 built-in", real: "38 built-in" },
  { feature: "Economic Calendar", simulated: "Built-in", real: "Built-in" },
  { feature: "Depth of Market", simulated: "Available", real: "Available" },
  { feature: "Execution Speed", simulated: "64-bit fast", real: "64-bit fast" },
  { feature: "Virtual Funds", simulated: "$10,000 - $100,000", real: "Your deposit" },
  { feature: "Risk", simulated: "None (virtual)", real: "Real money risk" },
  { feature: "Profit", simulated: "Not withdrawable", real: "Fully withdrawable" },
  { feature: "EAs & Scripts", simulated: "MQL5 full access", real: "MQL5 full access" },
];

export default function MT5TradingPage() {
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
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">NEW</span>
                <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">ADVANCED</span>
              </div>
              <h1 className="text-5xl font-bold mb-4">MetaTrader 5</h1>
              <p className="text-xl text-gray-300 mb-6">The next-generation trading platform with more timeframes, advanced order types, and built-in economic calendar.</p>

              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>4.9/5 (8,200+ reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>5M+ active traders</span>
                </div>
              </div>

              {/* Live Account Button */}
              <div className="flex gap-4">
                <Link 
                  to="/signup?platform=mt5" 
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
                  <span className="text-xs text-gray-500">MetaTrader 5</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">XAU/USD</span>
                    <span className="text-green-400 font-mono">2,650.80 ▲</span>
                  </div>
                  <div className="h-32 bg-gray-900 rounded-lg flex items-end gap-1 p-2">
                    {[45, 65, 50, 75, 60, 85, 70, 95, 80, 90, 65, 100, 75, 93, 60, 83, 87, 70, 95, 77].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%`, opacity: 0.6 + (i * 0.02) }}></div>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why MetaTrader 5?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">MT5 takes everything great about MT4 and adds more power, speed, and flexibility for modern traders.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            {mt5Features.map((feat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <feat.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* MT4 vs MT5 Comparison */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">MT4 vs MT5: What's Different?</h3>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-500">Feature</th>
                    <th className="text-center py-3 text-gray-900 font-semibold">MT4</th>
                    <th className="text-center py-3 text-[#D31C2B] font-semibold">MT5</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Timeframes', '9', '21'],
                    ['Indicators', '30', '38'],
                    ['Chart Objects', '23', '44'],
                    ['Economic Calendar', 'No', 'Built-in'],
                    ['Depth of Market', 'No', 'Yes'],
                    ['Architecture', '32-bit', '64-bit'],
                    ['Order Types', '4', '6'],
                    ['Partial Fills', 'No', 'Yes'],
                    ['Hedging', 'Yes', 'Yes + Netting'],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 text-gray-700">{row[0]}</td>
                      <td className="py-3 text-center text-gray-600">{row[1]}</td>
                      <td className="py-3 text-center text-blue-600 font-semibold">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Demo vs Real Comparison */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-12">
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900">Simulated vs Live Account Comparison</h3>
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
                      <th className="text-center py-3 text-gray-900 font-semibold bg-blue-50">Simulated Sandbox</th>
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Ready for Advanced Trading?</h3>
            <p className="text-white/80 mb-6">Experience the next generation of trading with MT5</p>
            <div className="flex justify-center gap-4">
              <Link to="/signup?platform=mt5" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Charting</h3>
              <ul className="space-y-3">
                {['21 timeframes (M1 to MN1)', '38 built-in technical indicators', '44 analytical objects', 'Unlimited charts', 'Custom indicator support (MQL5)', 'Strategy Tester with real ticks'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Types</h3>
              <ul className="space-y-3">
                {['Market execution', '6 pending order types', 'Buy Stop Limit & Sell Stop Limit', 'Trailing Stop', 'Partial fills policy', 'Close-by (opposite positions)'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Economic Calendar</h3>
              <ul className="space-y-3">
                {['Built-in economic calendar', 'Real-time news feed', 'Impact level indicators', 'Country/event filters', 'Historical data analysis', 'Alert notifications'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">MQL5 & Automation</h3>
              <ul className="space-y-3">
                {['MQL5 programming language', 'Expert Advisors (EAs)', 'Trading robots marketplace', 'Cloud network testing', 'Multi-threaded backtesting', 'Real tick data testing'].map((item, i) => (
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Download MetaTrader 5</h2>
            <p className="text-gray-600">Available for desktop, web, and mobile</p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {systemRequirements.map((sys) => (
              <button
                key={sys.os}
                onClick={() => setSelectedOS(sys.os)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOS === sys.os ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <sys.icon className="w-4 h-4" />
                {sys.os}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            {systemRequirements.filter(s => s.os === selectedOS).map(sys => (
              <div key={sys.os} className="text-center">
                <sys.icon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
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
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download for {sys.os}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-xl p-8 text-white text-center">
            <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">WebTrader</h3>
            <p className="text-gray-400 mb-4">Trade directly from your browser without downloading</p>
            <Link to="/trading?platform=mt5-web" className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
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
