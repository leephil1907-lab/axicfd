import { useState } from 'react';
import { 
  Menu, X, Search, Check, Globe, HelpCircle, 
  MessageSquare, Star, ArrowRight, ArrowUpRight, TrendingUp, ChevronDown, Coins, ShieldCheck
} from 'lucide-react';
import { MarketInstrument, AppView } from '../types';
import { TRUSTPILOT_REVIEWS, BLOG_POSTS, HELP_TOPICS } from '../mockData';

interface LandingPageProps {
  markets: MarketInstrument[];
  setView: (view: AppView) => void;
  onShowToast: (message: string) => void;
}

export default function LandingPage({ markets, setView, onShowToast }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMarketTab, setActiveMarketTab] = useState<'popular' | 'forex' | 'metal' | 'index' | 'commodity' | 'crypto'>('popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('GLOBAL');

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter instruments based on tab, region, and search term
  const getFilteredMarkets = () => {
    let list = markets;
    if (activeMarketTab !== 'popular') {
      list = markets.filter(m => m.type === activeMarketTab);
    } else {
      // Popular presets
      const popularSymbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'US30', 'BTC/USD', 'ETH/USD', 'SOL/USD'];
      list = markets.filter(m => popularSymbols.includes(m.symbol));
    }

    if (selectedRegion === 'NG') {
      list = list.filter(m => ['USD/NGN', 'EUR/USD', 'GBP/USD', 'XAU/USD', 'BTC/USD', 'US30'].includes(m.symbol) || m.type === 'crypto' || m.type === 'forex');
    } else if (selectedRegion === 'EU') {
      list = list.filter(m => m.symbol.includes('EUR') || m.symbol.includes('GER') || m.type === 'index' || m.type === 'forex');
    } else if (selectedRegion === 'UK') {
      list = list.filter(m => m.symbol.includes('GBP') || m.symbol.includes('UK') || m.type === 'forex');
    }

    if (searchTerm.trim() !== '') {
      list = list.filter(m => 
        m.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return list;
  };

  const handleLearnMore = (topic: string) => {
    onShowToast(`Details about "${topic}" coming soon in our platform update.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-[#D31C2B] selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#D31C2B] text-white shadow-md transition-shadow">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-baseline font-bold text-3xl tracking-tighter cursor-pointer select-none"
              onClick={() => setView('landing')}
            >
              ax<span className="text-white font-black">i</span>
              <div className="w-1.5 h-1.5 bg-[#FFC800] rounded-full ml-0.5 animate-pulse"></div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#markets" className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity relative group py-2">
                Markets
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all group-hover:w-full"></span>
              </a>
              <a href="#platforms" className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity relative group py-2">
                Platforms
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all group-hover:w-full"></span>
              </a>
              <a href="#education" className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity relative group py-2">
                Learn
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all group-hover:w-full"></span>
              </a>
              <a href="#help" className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity relative group py-2">
                Support
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all group-hover:w-full"></span>
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('login')}
                className="bg-[#FFC800] hover:bg-[#E5B400] text-gray-950 px-5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow active:scale-95"
              >
                Open account
              </button>
              
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-40 bg-white transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
        style={{ top: '64px' }}
      >
        <div className="p-6 space-y-6">
          <ul className="space-y-4 text-lg font-semibold text-gray-900">
            <li>
              <a 
                href="#features" 
                onClick={() => { setMobileMenuOpen(false); }}
                className="block py-2 border-b border-gray-100 hover:text-[#D31C2B]"
              >
                Our Edge
              </a>
            </li>
            <li>
              <a 
                href="#markets" 
                onClick={() => { setMobileMenuOpen(false); }}
                className="block py-2 border-b border-gray-100 hover:text-[#D31C2B]"
              >
                Markets
              </a>
            </li>
            <li>
              <a 
                href="#platforms" 
                onClick={() => { setMobileMenuOpen(false); }}
                className="block py-2 border-b border-gray-100 hover:text-[#D31C2B]"
              >
                Trading Platforms
              </a>
            </li>
            <li>
              <a 
                href="#education" 
                onClick={() => { setMobileMenuOpen(false); }}
                className="block py-2 border-b border-gray-100 hover:text-[#D31C2B]"
              >
                Learn to Trade
              </a>
            </li>
            <li>
              <a 
                href="#help" 
                onClick={() => { setMobileMenuOpen(false); }}
                className="block py-2 border-b border-gray-100 hover:text-[#D31C2B]"
              >
                Company Support
              </a>
            </li>
          </ul>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2 text-[#D31C2B] font-semibold text-sm">
              <Globe className="w-5 h-5" />
              <span>English International</span>
            </div>
            <p className="text-xs text-gray-500">Regulated global CFD broker since 2007.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setMobileMenuOpen(false); setView('login'); }}
              className="w-full bg-[#D31C2B] hover:bg-[#B91623] text-white py-3 rounded-xl font-bold transition-all text-center text-sm"
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); handleLearnMore('Help Centre'); }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-bold transition-all text-center text-sm"
            >
              Help Centre
            </button>
          </div>

          <div className="p-6 bg-gradient-to-br from-[#0D9488] to-teal-500 text-white rounded-2xl">
            <h3 className="text-xl font-extrabold mb-2">Power up your strategy</h3>
            <p className="text-xs opacity-90 mb-4">Discover algorithmic execution and low latency server syncs to stay on the edge.</p>
            <button 
              onClick={() => handleLearnMore('AI Analytics')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] via-[#EDE8E0] to-[#E8E6E1] py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 max-w-lg">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-950 leading-none tracking-tight">
                650+ markets.<br className="hidden md:inline" /> One application.
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium">
                Trade indices, forex, gold, oil, and cryptocurrencies with lightning-fast execution, raw spreads, and flexible leverage on a single interface.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setView('login')}
                  className="bg-[#C5A059] hover:bg-[#B08C4A] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-950/15 active:scale-95 transition-all text-sm tracking-wide"
                >
                  Download application
                </button>
                <button 
                  onClick={() => handleLearnMore('Accounts Demo')}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3.5 rounded-xl active:scale-95 transition-all text-sm tracking-wide"
                >
                  Try free demo
                </button>
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="flex justify-center">
              <div className="w-full max-w-[320px] bg-gray-950 rounded-[40px] p-3 shadow-2xl border-4 border-gray-900 ring-1 ring-white/10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-950 rounded-b-2xl z-20 flex items-center justify-center">
                  <div className="w-16 h-3 bg-gray-900 rounded-full"></div>
                </div>
                
                <div className="bg-white rounded-[32px] overflow-hidden aspect-[9/19] flex flex-col relative select-none text-gray-900 text-xs">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 pt-3 pb-1 font-semibold text-[10px] text-gray-900 bg-white">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <div className="w-4 h-2 bg-gray-900 rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Interface Header */}
                  <div className="p-4 pb-2 border-b border-gray-100 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Fund Equity</div>
                        <div className="text-xl font-extrabold text-gray-950">$5,301.23</div>
                        <div className="text-[10px] font-bold text-teal-600">Unrealised P&L +$32.11</div>
                      </div>
                      <button 
                        onClick={() => handleLearnMore('Add Funds')}
                        className="bg-[#FFC800] hover:bg-[#E5B400] text-gray-950 text-[10px] font-bold px-3 py-1.5 rounded-full shadow transition-all"
                      >
                        Add funds
                      </button>
                    </div>

                    <div className="flex gap-2 text-[10px] font-bold">
                      <span className="bg-[#D31C2B] text-white px-3 py-1 rounded-full">CFDs</span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Perps</span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Crypto</span>
                    </div>
                  </div>

                  {/* Chart Visual inside phone */}
                  <div className="p-4 bg-gray-50/50 flex-1 overflow-y-auto">
                    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-gray-900">BTC / USD</span>
                        <span className="text-teal-600 font-bold">+2.40%</span>
                      </div>
                      <div className="h-16 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path 
                            d="M 0 35 Q 20 28 40 22 T 80 15 T 100 5 L 100 40 L 0 40 Z" 
                            fill="rgba(20, 184, 166, 0.08)"
                          />
                          <path 
                            d="M 0 35 Q 20 28 40 22 T 80 15 T 100 5" 
                            fill="none" 
                            stroke="#0D9488" 
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Lists */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                        <div>
                          <div className="font-extrabold text-gray-900">SOL / USD</div>
                          <div className="text-[9px] text-gray-500 font-medium">Solana</div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-gray-950">$165.42</div>
                          <div className="text-[9px] text-teal-600 font-bold">+1.20%</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                        <div>
                          <div className="font-extrabold text-gray-900">EUR / JPY</div>
                          <div className="text-[9px] text-gray-500 font-medium">Euro / Japanese Yen</div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-gray-950">162.341</div>
                          <div className="text-[9px] text-red-500 font-bold">-0.30%</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                        <div>
                          <div className="font-extrabold text-gray-900">XAU / USD</div>
                          <div className="text-[9px] text-gray-500 font-medium">Gold Spot</div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-gray-950">$2,342.15</div>
                          <div className="text-[9px] text-teal-600 font-bold">+0.80%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="border-t border-gray-100 p-2 grid grid-cols-4 text-center font-bold text-[9px] text-gray-400 bg-white">
                    <span className="text-[#D31C2B]">Home</span>
                    <span>Markets</span>
                    <span>Trade</span>
                    <span>Funds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-gray-100 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 border-r border-gray-100 last:border-0">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-950">$5</div>
              <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">Minimum Deposit</div>
            </div>
            <div className="space-y-2 border-r border-gray-100 last:border-0">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-950">1000+</div>
              <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">Assets to trade</div>
            </div>
            <div className="space-y-2 border-r border-gray-100 last:border-0">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-950">0.0 pips</div>
              <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">Minimum Spreads</div>
            </div>
            <div className="space-y-2 last:border-0">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-950">1000:1</div>
              <div className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-wider">Maximum Leverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Edge Features */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
              The edge for thousands of traders in 100+ countries
            </h2>
            <p className="text-gray-500 mt-4 text-base">
              Axi has spent over 15 years developing top-tier technology infrastructure to provide traders with robust liquidity, maximum protection, and absolute speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#D31C2B] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Ultra-competitive pricing, unbeatable value</h3>
                <p className="text-xs text-gray-500 mt-1">Enjoy narrow bid-ask gaps with customizable retail spreads starting from absolute zero.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#D31C2B] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Award-winning 24/7 customer service</h3>
                <p className="text-xs text-gray-500 mt-1">Our multilingual support desks operate round-the-clock to coordinate account queries instantly.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#D31C2B] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Raw spreads, high liquidity, flexible leverage</h3>
                <p className="text-xs text-gray-500 mt-1">Direct-market-access (DMA) connection hooks you up straight into tier-1 commercial bank networks.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#D31C2B] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Free education to sharpen your skills</h3>
                <p className="text-xs text-gray-500 mt-1">Access the complete library of advanced training videos, webinars, and market books.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#D31C2B] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">High-performance, innovative trading technology</h3>
                <p className="text-xs text-gray-500 mt-1">Direct execution links via LD4 server cages in London ensure less than 5ms latency.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#D31C2B] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Global broker built on Trust since 2007</h3>
                <p className="text-xs text-gray-500 mt-1">Licensed and overseen by strict watchdogs globally including ASIC, FCA, and DFSA.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => setView('login')}
              className="bg-[#D31C2B] hover:bg-[#B91623] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md"
            >
              Trade with a top broker
            </button>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="bg-[#D31C2B] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none">
                Powerful platforms.<br />You at the Controls.
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-lg">
                Gain direct connection to MetaTrader 4, the global gold standard for technical analysis, custom indicators, and programmatic expert advisor scripts. Sync trade portfolios instantly between desktop client and phone terminals.
              </p>
              <ul className="space-y-2 text-sm font-semibold opacity-95">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                  <span>Industry-standard MetaTrader 4 (MT4) engine</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                  <span>Custom charts, timeframes, and drawing instruments</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                  <span>Free integrated VPS services for algorithmic accounts</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                  <span>24/5 server reliability and rock-solid connections</span>
                </li>
              </ul>
              <button 
                onClick={() => handleLearnMore('MetaTrader 4 Download')}
                className="bg-[#FFC800] hover:bg-[#E5B400] text-gray-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/10 text-sm"
              >
                Get the technology edge
              </button>
            </div>

            <div className="flex justify-center">
              <div className="bg-white/10 rounded-2xl border border-white/20 w-full max-w-md h-64 flex flex-col items-center justify-center relative p-8">
                <span className="text-7xl font-extrabold text-white/20 select-none tracking-widest">MT4</span>
                <p className="text-sm font-bold mt-2">Axi MetaTrader Client Terminal</p>
                <p className="text-xs text-white/60 mt-1">Optimised for rapid tick processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section with Search & Categories */}
      <section id="markets" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">A world of opportunity</h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Find the assets right for your strategies. Filter instruments across categories or use search to view live bids, asks, and spreads.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => setView('login')}
                className="bg-[#C5A059] hover:bg-[#B08C4A] text-white px-6 py-3 rounded-xl font-bold transition-all inline-flex items-center gap-2 text-sm"
              >
                Power up your portfolio
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Box & Global Region Listing Dropdown */}
          <div className="max-w-xl mx-auto mb-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Search symbol (e.g. EUR/USD, XAU/USD, BTC)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 focus:bg-white transition-all shadow-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Global Region Listing Dropdown */}
            <div className="relative sm:w-48">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 appearance-none cursor-pointer"
              >
                <option value="GLOBAL">🌍 Global Markets</option>
                <option value="US">🇺🇸 United States (USD)</option>
                <option value="EU">🇪🇺 Europe (EUR)</option>
                <option value="UK">🇬🇧 United Kingdom (GBP)</option>
                <option value="AU">🇦🇺 Australia (AUD)</option>
                <option value="NG">🇳🇬 Nigeria (NGN/FX)</option>
              </select>
              <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Categories Slider/Tabs */}
          <div className="flex gap-2 justify-start md:justify-center overflow-x-auto pb-4 mb-8">
            <button 
              onClick={() => setActiveMarketTab('popular')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeMarketTab === 'popular' 
                  ? 'bg-[#D31C2B] text-white shadow-lg shadow-red-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D31C2B] hover:text-[#D31C2B]'
              }`}
            >
              Popular in Nigeria
            </button>
            <button 
              onClick={() => setActiveMarketTab('forex')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeMarketTab === 'forex' 
                  ? 'bg-[#D31C2B] text-white shadow-lg shadow-red-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D31C2B] hover:text-[#D31C2B]'
              }`}
            >
              Forex
            </button>
            <button 
              onClick={() => setActiveMarketTab('metal')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeMarketTab === 'metal' 
                  ? 'bg-[#D31C2B] text-white shadow-lg shadow-red-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D31C2B] hover:text-[#D31C2B]'
              }`}
            >
              Metals
            </button>
            <button 
              onClick={() => setActiveMarketTab('index')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeMarketTab === 'index' 
                  ? 'bg-[#D31C2B] text-white shadow-lg shadow-red-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D31C2B] hover:text-[#D31C2B]'
              }`}
            >
              Indices
            </button>
            <button 
              onClick={() => setActiveMarketTab('commodity')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeMarketTab === 'commodity' 
                  ? 'bg-[#D31C2B] text-white shadow-lg shadow-red-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D31C2B] hover:text-[#D31C2B]'
              }`}
            >
              Commodities
            </button>
            <button 
              onClick={() => setActiveMarketTab('crypto')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeMarketTab === 'crypto' 
                  ? 'bg-[#D31C2B] text-white shadow-lg shadow-red-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D31C2B] hover:text-[#D31C2B]'
              }`}
            >
              Cryptocurrencies
            </button>
          </div>

          {/* Instruments Table */}
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Instrument</th>
                    <th className="px-6 py-4">Bid</th>
                    <th className="px-6 py-4">Ask</th>
                    <th className="px-6 py-4">Standard Spread</th>
                    <th className="px-6 py-4">Pro Spread</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {getFilteredMarkets().length > 0 ? (
                    getFilteredMarkets().map((m) => {
                      const decimalPlaces = m.symbol.includes('JPY') ? 3 : m.symbol.includes('USD') && m.symbol.length === 7 ? 5 : 2;
                      const standardSpread = (m.ask - m.bid) * (m.symbol.includes('JPY') ? 100 : m.symbol.includes('USD') && m.symbol.length === 7 ? 10000 : 1);
                      const proSpread = Math.max(0.1, standardSpread * 0.1);
                      return (
                        <tr key={m.symbol} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-extrabold text-gray-900">{m.symbol}</span>
                            <span className="block text-[10px] text-gray-400 font-semibold">{m.name}</span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-gray-800">{m.bid.toFixed(decimalPlaces)}</td>
                          <td className="px-6 py-4 font-mono font-bold text-gray-800">{m.ask.toFixed(decimalPlaces)}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-md">
                              {standardSpread.toFixed(1)} pips
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-700 rounded-md border border-teal-100">
                              {proSpread.toFixed(1)} pips
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 font-medium">
                        No instruments match your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Popular grid */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Discover popular markets to trade</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Explore multi-asset categories with standard leverage limits.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <div 
              onClick={() => { setActiveMarketTab('forex'); scrollToSection('markets'); }}
              className="bg-white hover:bg-emerald-50/50 p-6 rounded-2xl border border-gray-200 shadow-sm text-center cursor-pointer hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00875A] to-[#005236] text-white font-extrabold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-md shadow-emerald-600/20">
                FX
              </div>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-[#00875A]">Forex</span>
            </div>

            <div 
              onClick={() => handleLearnMore('Share CFDs')}
              className="bg-white hover:bg-blue-50/50 p-6 rounded-2xl border border-gray-200 shadow-sm text-center cursor-pointer hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0052CC] to-[#0747A6] text-white font-extrabold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-md shadow-blue-600/20">
                SH
              </div>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-[#0052CC]">Shares</span>
            </div>

            <div 
              onClick={() => { setActiveMarketTab('index'); scrollToSection('markets'); }}
              className="bg-white hover:bg-purple-50/50 p-6 rounded-2xl border border-gray-200 shadow-sm text-center cursor-pointer hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6554C0] to-[#403294] text-white font-extrabold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-md shadow-purple-600/20">
                IX
              </div>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-[#6554C0]">Indices</span>
            </div>

            <div 
              onClick={() => { setActiveMarketTab('commodity'); scrollToSection('markets'); }}
              className="bg-white hover:bg-amber-50/50 p-6 rounded-2xl border border-gray-200 shadow-sm text-center cursor-pointer hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D2B] text-white font-extrabold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-md shadow-amber-600/20">
                CM
              </div>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-[#B08C4A]">Commodities</span>
            </div>

            <div 
              onClick={() => { setActiveMarketTab('crypto'); scrollToSection('markets'); }}
              className="bg-white hover:bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80 shadow-sm text-center cursor-pointer hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F7931A] via-[#FFAB00] to-[#E07D10] text-white font-black text-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-lg shadow-orange-500/30 border border-amber-300/50">
                ₿
              </div>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-[#F7931A]">Cryptocurrencies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Committed to Success Education section */}
      <section id="education" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">
                Committed to your long-term success
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                We believe that knowledgeable traders execute better decisions. That is why we offer complete, free access to fundamental tools, advanced masterclasses, daily analytical briefs, and one-on-one professional training webinars.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => handleLearnMore('Axi Academy')}
                  className="bg-[#FFC800] hover:bg-[#E5B400] text-gray-950 px-6 py-3 rounded-xl font-bold text-xs"
                >
                  Axi Academy
                </button>
                <button 
                  onClick={() => handleLearnMore('Learn to trade video modules')}
                  className="bg-gray-950 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-xs"
                >
                  Learn to trade
                </button>
              </div>
            </div>

            <div className="relative h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80" 
                alt="Axi Academy Trading Education" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#E31C3A] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md mb-2 inline-block shadow">
                  Axi Academy Masterclass
                </span>
                <h3 className="font-extrabold text-base leading-snug">Structured Forex & CFD Learning Hub</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Awards Section */}
      <section className="py-16 bg-[#FAF8F5] border-y border-gray-150">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              <span className="text-[#D31C2B]">24/5</span> award-winning service. 100% committed to you.
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-3">
              We are proud of our stellar reputation, engineered through transparency, tight spreads, and instant account settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-left relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#D31C2B]"></div>
              <h3 className="font-extrabold text-xs text-[#D31C2B] uppercase tracking-wider mb-2">Best CFD Provider Winner</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Shares Awards 2021</p>
              <div className="text-5xl font-extrabold text-gray-100 absolute bottom-1 right-3 select-none leading-none">2021</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-left relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#D31C2B]"></div>
              <h3 className="font-extrabold text-xs text-[#D31C2B] uppercase tracking-wider mb-2">Best CFD Provider Winner</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Shares Awards 2022</p>
              <div className="text-5xl font-extrabold text-gray-100 absolute bottom-1 right-3 select-none leading-none">2022</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-left relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#D31C2B]"></div>
              <h3 className="font-extrabold text-xs text-[#D31C2B] uppercase tracking-wider mb-2">Best Forex Provider</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Online Money Awards</p>
              <div className="text-5xl font-extrabold text-gray-100 absolute bottom-1 right-3 select-none leading-none">2023</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-left relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#D31C2B]"></div>
              <h3 className="font-extrabold text-xs text-[#D31C2B] uppercase tracking-wider mb-2">Best Forex platform</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Online Money Awards</p>
              <div className="text-5xl font-extrabold text-gray-100 absolute bottom-1 right-3 select-none leading-none">2023</div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-6 font-semibold">** Axi Group of companies regulatory directory details available on support desks.</p>
        </div>
      </section>

      {/* Man City Partnership section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">A winning partnership</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Axi is proud to be the Official Online Trading Partner of Manchester City Football Club. Together, we share a deep passion for high-precision statistics, high execution speed, and clinical performance on the world stage.
              </p>
              <button 
                onClick={() => handleLearnMore('Manchester City Partnership')}
                className="bg-[#C5A059] hover:bg-[#B08C4A] text-white px-6 py-3 rounded-xl font-bold text-xs"
              >
                Passion to perform
              </button>
            </div>

            <div className="relative h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80" 
                alt="Manchester City Partnership" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-white/95 text-[10px] px-3.5 py-1.5 rounded-full border border-blue-100 font-extrabold text-blue-900 shadow-md">
                ⚽ Manchester City FC Official Online Trading Partner
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trustpilot Reviews */}
      <section className="py-16 bg-[#FAF8F5] border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex flex-col items-center gap-1.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-gray-950">Great</span>
              <div className="flex text-teal-500 gap-0.5">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
            <p className="text-xs text-gray-500 font-semibold">
              Based on <span className="underline cursor-pointer hover:text-[#D31C2B]">7,083 reviews</span> on Trustpilot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-10">
            {TRUSTPILOT_REVIEWS.map(r => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-left flex flex-col justify-between">
                <p className="text-xs text-gray-700 italic leading-relaxed">"{r.text}"</p>
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3 text-[10px] text-gray-400 font-bold">
                  <div>
                    <span className="text-gray-900 font-extrabold block">{r.author}</span>
                    <span>{r.time}</span>
                  </div>
                  {r.verified && <span className="text-teal-600 font-extrabold flex items-center gap-1">✓ Verified Trader</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Axi Blog section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Axi Blog & Insights</h2>
            <p className="text-xs text-gray-500 mt-2">Get the latest analyses from our global desk researchers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {BLOG_POSTS.map(post => (
              <div 
                key={post.id} 
                onClick={() => handleLearnMore(post.title)}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col"
              >
                <div className="h-32 bg-gradient-to-br from-[#D31C2B] to-[#B91623] text-white p-4 font-black flex items-center justify-center text-center relative select-none">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <span className="relative z-10 text-xs tracking-wider uppercase">{post.image}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-[#D31C2B] tracking-wider block mb-1">{post.tag}</span>
                    <h3 className="font-extrabold text-xs text-gray-900 leading-snug line-clamp-2 hover:text-[#D31C2B] transition-colors">{post.title}</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold mt-4">By {post.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support / "Hi, how can we help?" Help center grid */}
      <section id="help" className="py-16 bg-gray-50 border-t border-gray-150">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-950 mb-12">
            Hi, how can we help?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {HELP_TOPICS.map((topic, i) => (
              <div 
                key={i} 
                onClick={() => handleLearnMore(topic.title)}
                className="bg-white border border-gray-200 hover:border-[#D31C2B] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-red-50 text-gray-600 group-hover:text-[#D31C2B] flex items-center justify-center font-extrabold text-lg mb-4 transition-colors">
                    {topic.icon}
                  </div>
                  <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#D31C2B] transition-colors mb-2">{topic.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{topic.description}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#D31C2B] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Read FAQs</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Risk Warnings */}
      <footer className="bg-gray-950 text-white py-12 md:py-16 text-xs">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-wider">Markets</h4>
              <ul className="space-y-2.5 text-gray-400 font-medium">
                <li><a onClick={() => { setActiveMarketTab('forex'); scrollToSection('markets'); }} className="hover:text-white cursor-pointer transition-colors">Forex CFDs</a></li>
                <li><a onClick={() => { setActiveMarketTab('metal'); scrollToSection('markets'); }} className="hover:text-white cursor-pointer transition-colors">Metal Spot CFDs</a></li>
                <li><a onClick={() => { setActiveMarketTab('index'); scrollToSection('markets'); }} className="hover:text-white cursor-pointer transition-colors">Indices CFDs</a></li>
                <li><a onClick={() => { setActiveMarketTab('commodity'); scrollToSection('markets'); }} className="hover:text-white cursor-pointer transition-colors">Commodities Spot</a></li>
                <li><a onClick={() => { setActiveMarketTab('crypto'); scrollToSection('markets'); }} className="hover:text-white cursor-pointer transition-colors">Crypto Index</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-wider">Platforms</h4>
              <ul className="space-y-2.5 text-gray-400 font-medium">
                <li><a onClick={() => handleLearnMore('MetaTrader 4 Client')} className="hover:text-white cursor-pointer transition-colors">MetaTrader 4</a></li>
                <li><a onClick={() => handleLearnMore('Axi Mobile Terminal')} className="hover:text-white cursor-pointer transition-colors">Axi Trading App</a></li>
                <li><a onClick={() => handleLearnMore('WebTrader Portal')} className="hover:text-white cursor-pointer transition-colors">WebTrader Client</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 text-gray-400 font-medium">
                <li><a onClick={() => handleLearnMore('About Axi Group')} className="hover:text-white cursor-pointer transition-colors">About Axi</a></li>
                <li><a onClick={() => handleLearnMore('Regulatory Licenses')} className="hover:text-white cursor-pointer transition-colors">Regulation & Licenses</a></li>
                <li><a onClick={() => handleLearnMore('Careers at Axi')} className="hover:text-white cursor-pointer transition-colors">Careers</a></li>
                <li><a onClick={() => handleLearnMore('Contact Support')} className="hover:text-white cursor-pointer transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-2.5 text-gray-400 font-medium">
                <li><a onClick={() => scrollToSection('help')} className="hover:text-white cursor-pointer transition-colors">Help Centre</a></li>
                <li><a onClick={() => handleLearnMore('Live Support Chat')} className="hover:text-white cursor-pointer transition-colors">Live 24/5 Chat</a></li>
                <li><a onClick={() => handleLearnMore('Email Support Ticket')} className="hover:text-white cursor-pointer transition-colors">Email Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 text-gray-500 font-semibold space-y-4 text-center md:text-left">
            <p className="text-[10px] leading-relaxed">
              &copy; {new Date().getFullYear()} Axi. All rights reserved. Axi is a registered brand name of Axi Group of Companies.
            </p>
            <p className="text-[10px] leading-relaxed">
              <strong className="text-gray-300">Risk Warning:</strong> Over-the-counter leveraged derivative products (including contracts for difference) carry high structural risks and can result in sudden, significant losses of deposited capitals. Ensure you possess complete familiarity with product specifications, leverage constraints, and automatic liquidation systems before executing orders. Local regulatory variations apply.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
