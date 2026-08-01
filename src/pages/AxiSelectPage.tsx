import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { AXI_SELECT_TIERS } from "@/lib/constants";
import { 
  Trophy, TrendingUp, Users, Star, ChevronRight, 
  Medal, Crown, Target, Zap, ArrowRight
} from "lucide-react";

const leaderboardData = [
  { rank: 1, name: 'Haibin Z.', flag: '🇨🇳', level: 'Pro M', profitPaid: 17475.83, gain: 2.19, equity: 19982.89, allocation: 999178.50 },
  { rank: 2, name: 'Yimy G.', flag: '🇪🇸', level: 'Acceleration', profitPaid: 8741.64, gain: 16.51, equity: 4384.67, allocation: 100000.00 },
  { rank: 3, name: 'Alvaro F.', flag: '🇪🇸', level: 'Pro 500', profitPaid: 6309.28, gain: 1.80, equity: 10781.06, allocation: 499869.90 },
  { rank: 4, name: 'Martin H.', flag: '🇨🇭', level: 'Pro 500', profitPaid: 6291.38, gain: 4.54, equity: 11000.00, allocation: 200000.00 },
  { rank: 5, name: 'Francesco M.', flag: '🇮🇹', level: 'Acceleration', profitPaid: 6266.99, gain: 23.70, equity: 2115.10, allocation: 100000.00 },
  { rank: 6, name: 'Ivan L.', flag: '🇪🇸', level: 'Pro', profitPaid: 6229.08, gain: 5.19, equity: 8715.28, allocation: 200000.00 },
  { rank: 7, name: 'Enyenih A.', flag: '🇮🇹', level: 'Incubation', profitPaid: 6008.59, gain: 61.12, equity: 9182.71, allocation: 100000.00 },
  { rank: 8, name: 'Linyan W.', flag: '🇨🇳', level: 'Pro M', profitPaid: 5558.65, gain: 1.39, equity: 21021.64, allocation: 999178.50 },
  { rank: 9, name: 'Gina N.', flag: '🇪🇸', level: 'Pro', profitPaid: 4922.75, gain: 4.08, equity: 5622.44, allocation: 200000.00 },
  { rank: 10, name: 'Alejandro G.', flag: '🇪🇸', level: 'Pro', profitPaid: 4754.57, gain: 7.27, equity: 8925.42, allocation: 200000.00 },
];

const tierFilters = [
  { label: 'All', value: 'all' },
  { label: 'Incubation: $20K', value: 'incubation' },
  { label: 'Acceleration: $100K', value: 'acceleration' },
  { label: 'Pro: $250K', value: 'pro' },
  { label: 'Pro 500: $500K', value: 'pro500' },
  { label: 'Pro M: $1M+', value: 'prom' },
];

export default function AxiSelectPage() {
  const [activeTier, setActiveTier] = useState('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard'>('overview');

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <TopBar />
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#D31C2B] to-red-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-black/30 text-white text-xs px-3 py-1 rounded font-semibold">AXI SELECT</span>
            <span className="text-white/80 text-sm">60332183</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-white/80 hover:text-white">Overview</button>
            <button className="text-sm text-white/80 hover:text-white flex items-center gap-1">
              <Trophy className="w-4 h-4" /> Leaderboard
            </button>
            <button className="bg-yellow-500 text-black text-sm px-4 py-1.5 rounded font-semibold hover:bg-yellow-400">
              Add funds
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-2">Welcome to</p>
          <h1 className="text-4xl font-bold mb-4">axi<span className="text-[#D31C2B]">SELECT</span></h1>
          <h2 className="text-2xl font-semibold mb-4">Your first step to start your path to get <span className="text-[#D31C2B]">$1,000,000</span> funding</h2>
          <p className="text-gray-400 mb-6">Congratulations! You are in the program. Start trade and build your edge score and reach $500 capital to qualify for Seed stage.</p>

          <div className="flex gap-4">
            <button className="bg-[#D31C2B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">ADD FUNDS</button>
            <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700">TRADE NOW</button>
          </div>
        </div>

        {/* Pathway */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Axi Select Pathway</h3>
            <button className="text-sm text-[#D31C2B] flex items-center gap-1">Detail Pathway <ChevronRight className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-gray-400 mb-4">Your pathway to reach the next stage of your trading journey.</p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-900/50 text-green-400 px-3 py-2 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" /> Joined Axi Select
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center gap-2 bg-[#D31C2B] text-white px-3 py-2 rounded-lg text-sm font-semibold">
              Next: Seed
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center gap-2 bg-gray-800 text-gray-400 px-3 py-2 rounded-lg text-sm">Incubation</div>
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center gap-2 bg-gray-800 text-gray-400 px-3 py-2 rounded-lg text-sm">Acceleration</div>
          </div>

          <div className="flex gap-2 mt-4">
            {['Pro', 'Pro 500', 'Pro M'].map((tier) => (
              <div key={tier} className="bg-gray-800 text-gray-500 px-3 py-2 rounded-lg text-sm">{tier}</div>
            ))}
          </div>
        </div>

        {/* Edge Score */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Edge Score</h3>
            <button className="text-sm text-gray-400">What is Edge Score?</button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Trade now to get your edge score</p>

          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-8 border-gray-800"></div>
              <div className="absolute inset-0 rounded-full border-8 border-gray-700" style={{ clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-xs text-gray-500">Edge Score</div>
                  <div className="text-xs text-gray-600">(50 required for Seed)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              {['Skill', 'Risk', 'Consistency', 'Experience'].map((metric) => (
                <div key={metric} className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold">0</span>
                  </div>
                  <div className="text-sm text-gray-400">{metric}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seed Stage Qualification */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-center mb-2">Seed Stage Qualification</h3>
          <p className="text-sm text-gray-400 text-center mb-2">Complete these requirements to reach the Seed Stage</p>
          <p className="text-sm text-[#D31C2B] text-center mb-6">0 of 3 Complete</p>

          <div className="space-y-3">
            {[
              { task: 'Complete 20 unique trade', current: '0', action: 'Trade Now' },
              { task: 'Edge Score 50+', current: '0', action: 'Trade Now' },
              { task: 'Minimum equity $500', current: '$0.00', action: 'Add funds' },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                <div>
                  <div className="font-semibold">{req.task}</div>
                  <div className="text-sm text-gray-400">Your {req.task.toLowerCase().includes('equity') ? 'current equity' : req.task.toLowerCase().includes('score') ? 'current score' : 'unique trades'}: <span className="text-white">{req.current}</span></div>
                </div>
                <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400">
                  {req.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <p className="text-sm text-gray-400 mb-4">Top 3 trader in June 2026</p>

          {/* Top 3 Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {leaderboardData.slice(0, 3).map((trader) => (
              <div key={trader.rank} className="bg-gray-900 rounded-xl p-4 relative">
                <div className="absolute top-4 right-4">
                  {trader.rank === 1 && <Crown className="w-6 h-6 text-yellow-400" />}
                  {trader.rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                  {trader.rank === 3 && <Medal className="w-6 h-6 text-orange-400" />}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {trader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{trader.name} <span className="text-lg">{trader.flag}</span></div>
                    <div className="text-xs text-gray-400">{trader.level}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <div className="text-gray-500">Profit Paid</div>
                    <div className="text-green-400 font-semibold">${trader.profitPaid.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Gain</div>
                    <div className="text-green-400 font-semibold">+{trader.gain}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Equity</div>
                    <div className="text-white font-semibold">${trader.equity.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Allocation</div>
                <div className="text-white font-semibold">${trader.allocation.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Tier Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {tierFilters.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setActiveTier(tier.value)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${activeTier === tier.value ? 'bg-yellow-500 text-black font-semibold' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {tier.label}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-500">Total: 643</span>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500">
                  <th className="text-left px-4 py-3">Rank</th>
                  <th className="text-left px-4 py-3">Trader</th>
                  <th className="text-left px-4 py-3">Level</th>
                  <th className="text-right px-4 py-3">Profit Paid</th>
                  <th className="text-right px-4 py-3">Gain</th>
                  <th className="text-right px-4 py-3">Equity</th>
                  <th className="text-right px-4 py-3">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((trader) => (
                  <tr key={trader.rank} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${trader.rank <= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                        {trader.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {trader.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{trader.name} <span>{trader.flag}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{trader.level}</td>
                    <td className="px-4 py-3 text-right text-green-400 font-semibold">${trader.profitPaid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-400">{trader.gain}%</td>
                    <td className="px-4 py-3 text-right">${trader.equity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-400">${trader.allocation.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 text-center text-sm text-gray-500">
              Showing 10 results
            </div>
          </div>
        </div>

        {/* Traders Already Funded */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Traders Already Funded</h3>
          <p className="text-sm text-gray-400 mb-4">Real results from the Axi Select community</p>

          <div className="space-y-3">
            {leaderboardData.slice(0, 5).map((trader) => (
              <div key={trader.rank} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {trader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Start {trader.rank * 2}m ago</div>
                    <div className="font-medium text-sm">{trader.name} <span>{trader.flag}</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Profit</div>
                  <div className="text-green-400 font-semibold">${trader.profitPaid.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
