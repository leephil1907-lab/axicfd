import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Handshake, 
  TrendingUp, 
  DollarSign, 
  Headphones, 
  Users, 
  Award, 
  FileText, 
  CheckCircle, 
  Globe, 
  Layers, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Percent, 
  Check 
} from "lucide-react";

export default function PartnershipsPage() {
  const [activeTab, setActiveTab] = useState<'ib' | 'affiliate' | 'select'>('ib');
  
  // Commission Calculator States
  const [referredClients, setReferredClients] = useState<number>(25);
  const [avgLotsPerClient, setAvgLotsPerClient] = useState<number>(8);
  const [rebateRate, setRebateRate] = useState<number>(6.5); // USD per lot

  // Application Form States
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "United Kingdom",
    programType: "Introducing Broker (IB)",
    trafficSource: "Social Media / Community",
    experience: "Intermediate (1-3 years)",
    agreeTerms: false
  });

  const estimatedMonthlyCommission = referredClients * avgLotsPerClient * rebateRate;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the Partner Terms & Conditions.");
      return;
    }
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      country: "United Kingdom",
      programType: "Introducing Broker (IB)",
      trafficSource: "Social Media / Community",
      experience: "Intermediate (1-3 years)",
      agreeTerms: false
    });
    setFormSubmitted(false);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-gray-900 font-sans selection:bg-[#D31C2B] selection:text-white">
      
      {/* 1. Hero Section: Premium Red & Carbon Wave */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#12131A] via-[#1F1F2E] to-gray-950 py-24 px-4 text-white border-b border-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D31C2B]/15 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#D31C2B]/10 border border-[#D31C2B]/30 px-4 py-1.5 rounded-full mb-6"
          >
            <Award className="w-4 h-4 text-[#FFC800] animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-[#FFC800] uppercase">Official Axi Partner Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]"
          >
            Partner with a <span className="text-[#D31C2B]">World-Leading</span> Global Broker
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Unlock industry-leading CPA payouts, competitive multi-tier rebates, and access to the elite Axi Select funded program. Turn your community into a powerhouse.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a 
              href="#apply-form" 
              className="bg-[#D31C2B] hover:bg-[#B91623] text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <span>Apply to Partner Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#calculator" 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-95"
            >
              Estimate Commissions
            </a>
          </motion.div>

          {/* Key Trust Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto pt-10 border-t border-white/10">
            <div className="p-4 text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-white">$1.2B+</span>
              <span className="block text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Partner Rebates Paid</span>
            </div>
            <div className="p-4 text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-white">22,000+</span>
              <span className="block text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Active Global Partners</span>
            </div>
            <div className="p-4 text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-[#FFC800]">Up to $1k</span>
              <span className="block text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">CPA Commission Per Client</span>
            </div>
            <div className="p-4 text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-white">24/5</span>
              <span className="block text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Dedicated Account managers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Program Tabs & Offerings */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-[#D31C2B] uppercase tracking-widest block mb-2">Our Programs</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Flexible Structures Designed for Your Success</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto font-medium">Choose a pathway that integrates seamlessly with your audience, from direct traffic monetization to high-impact capital backing.</p>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-xl mx-auto mb-12 border border-gray-300/40">
          <button 
            onClick={() => setActiveTab('ib')}
            className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'ib' 
                ? 'bg-white text-gray-900 shadow-md' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Introducing Broker (IB)
          </button>
          <button 
            onClick={() => setActiveTab('affiliate')}
            className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'affiliate' 
                ? 'bg-white text-gray-900 shadow-md' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Affiliate Program
          </button>
          <button 
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'select' 
                ? 'bg-white text-gray-900 shadow-md' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Axi Select (Funded)
          </button>
        </div>

        {/* Tab Content Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {activeTab === 'ib' && (
              <>
                {/* Introducing Broker Details */}
                <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="w-14 h-14 bg-[#D31C2B]/10 rounded-2xl flex items-center justify-center text-[#D31C2B]">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">Introducing Broker (IB) Program</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      Ideal for educators, forum moderators, trading community leaders, and copy trading providers. Earn continuous lifetime commissions on every single volume trade generated by your referred clients.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {[
                        "Competitive rebates up to $9 per lot",
                        "Sub-IB tracking to recruit downline partners",
                        "Automatic daily commission payouts",
                        "Dedicated client conversion support",
                        "Instant link generator with cookie tracking",
                        "Detailed live MT4/MT5 statistics"
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Typical Commission</span>
                      <span className="text-2xl font-black text-gray-950">$5 - $10 <span className="text-sm font-medium text-gray-500">per lot</span></span>
                    </div>
                    <a href="#apply-form" className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all">
                      Apply as IB
                    </a>
                  </div>
                </div>

                {/* IB Side Panel Showcase */}
                <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-8 text-white flex flex-col justify-between border border-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#D31C2B]/10 via-transparent to-transparent"></div>
                  <div className="relative z-10 space-y-6">
                    <span className="text-xs font-black text-[#D31C2B] uppercase tracking-wider">Partner Showcase</span>
                    <h4 className="text-xl font-bold">Why educators love our IB structure:</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      "Axi's client onboarding pipeline is so frictionless that my referrals are verified and ready to fund within 10 minutes. The continuous lifetime rebates let me invest back into building state-of-the-art education models."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm text-white">MM</div>
                      <div>
                        <span className="block text-sm font-bold text-white">Mateo Mendez</span>
                        <span className="block text-xs text-gray-500">FX Academy Founder (2.3k students)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-800/80 relative z-10">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-[#FFC800]" />
                        <span className="text-xs font-bold text-gray-300">ASIC, FCA, & DFSA regulated platform</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'affiliate' && (
              <>
                {/* Affiliate Program Details */}
                <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                      <TrendingUp className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">Digital Marketing Affiliate Program</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      Designed for bloggers, review portals, comparison websites, and online publishers with search or social media traffic. Drive high-volume traffic to Axi and cash out with generous CPA models up to $1,000 USD per qualified user.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {[
                        "Generous CPA up to $1,000 based on country",
                        "High-converting visual banners and widgets",
                        "60-day tracking cookie duration",
                        "Transparent real-time lead reporting portal",
                        "Flexible localization support across 15+ languages",
                        "Advanced deep-linking capabilities"
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">CPA Structure</span>
                      <span className="text-2xl font-black text-gray-950">Up to $1,000 <span className="text-sm font-medium text-gray-500">per acquisition</span></span>
                    </div>
                    <a href="#apply-form" className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all">
                      Apply as Affiliate
                    </a>
                  </div>
                </div>

                {/* Affiliate Side Panel */}
                <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-8 text-white flex flex-col justify-between border border-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#D31C2B]/10 via-transparent to-transparent"></div>
                  <div className="relative z-10 space-y-6">
                    <span className="text-xs font-black text-[#D31C2B] uppercase tracking-wider">Affiliate Insights</span>
                    <h4 className="text-xl font-bold">Monetize global traffic:</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      "Our team operates multiple comparison blogs across EMEA and Southeast Asia. Working with Axi is incredibly smooth because they provide custom localization kits, multi-region compliance handling, and absolute reliability with monthly wire transfer payouts."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm text-white">SA</div>
                      <div>
                        <span className="block text-sm font-bold text-white">Sarah Al-Dosari</span>
                        <span className="block text-xs text-gray-500">Director of Affiliations at FinMedia Global</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-800/80 relative z-10">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-5 h-5 text-[#FFC800]" />
                        <span className="text-xs font-bold text-gray-300">Custom local landing pages provided</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'select' && (
              <>
                {/* Axi Select Funded Pathway */}
                <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Layers className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">Axi Select Capital Allocation</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      Introduce your highly skilled traders to Axi Select, our premier capital allocation pathway. We fund talented retail traders with up to $1,000,000 USD of Axi corporate capital, keeping a 90% profit share for the trader. No sign-up fees.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {[
                        "No evaluation or sign-up fees",
                        "Capital backing up to $1,000,000 USD",
                        "90% profit share paid to traders",
                        "Structured Edge Score tracking system",
                        "Earn rebates when clients join Axi Select",
                        "Perfect for professional account managers"
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Funded Allocation Max</span>
                      <span className="text-2xl font-black text-gray-950">$1,000,000 <span className="text-sm font-medium text-gray-500">USD</span></span>
                    </div>
                    <a href="/axi-select" className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all">
                      Explore Axi Select
                    </a>
                  </div>
                </div>

                {/* Axi Select Side Panel */}
                <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-8 text-white flex flex-col justify-between border border-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#D31C2B]/10 via-transparent to-transparent"></div>
                  <div className="relative z-10 space-y-6">
                    <span className="text-xs font-black text-[#D31C2B] uppercase tracking-wider">Capital Backing Pathway</span>
                    <h4 className="text-xl font-bold">A revolutionary prop model:</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      "Unlike other prop firms that charge huge evaluation fees and rely on trader failure, Axi Select allocates real capital from their own balance sheet to traders who demonstrate reliable risk metrics. It's a true win-win partnerships ecosystem."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm text-white">GK</div>
                      <div>
                        <span className="block text-sm font-bold text-white">Greg Kempton</span>
                        <span className="block text-xs text-gray-500">Professional Funded Trader (Incubation Stage)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-800/80 relative z-10">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Percent className="w-5 h-5 text-[#FFC800]" />
                        <span className="text-xs font-bold text-gray-300">Keep 90% of your generated profits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. Interactive Commission Earnings Calculator */}
      <section id="calculator" className="py-20 px-4 bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black text-[#D31C2B] uppercase tracking-widest block">Earnings Estimator</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
                Calculate Your Potential Partner Revenue
              </h2>
              <p className="text-gray-500 leading-relaxed font-semibold">
                Adjust the sliders below based on your estimated target community referral volume and average client activity to calculate your monthly introducing broker (IB) payout estimate.
              </p>
              
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 text-xs text-gray-500">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Clock className="w-4 h-4 text-[#D31C2B]" />
                  <span>Real-Time commission tracking & Daily payouts</span>
                </div>
                <p className="leading-relaxed">
                  Commissions are processed every 24 hours. You can withdraw your earnings instantly using Bank Wire, Neteller, Skrill, Cryptocurrencies, or direct trading account transfer.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 border border-gray-200 shadow-xl space-y-8 text-gray-950">
              <div className="space-y-6">
                
                {/* Slider 1: Active Referred Clients */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-sm text-gray-700">Active Referred Clients</span>
                    <span className="text-lg text-[#D31C2B]">{referredClients} Traders</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="200" 
                    step="5"
                    value={referredClients} 
                    onChange={(e) => setReferredClients(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D31C2B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                    <span>5 Clients</span>
                    <span>200+ Clients</span>
                  </div>
                </div>

                {/* Slider 2: Average Monthly Lots Per Client */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-sm text-gray-700">Avg. Lots Traded Per Client (Monthly)</span>
                    <span className="text-lg text-[#D31C2B]">{avgLotsPerClient} Lots</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="30" 
                    step="1"
                    value={avgLotsPerClient} 
                    onChange={(e) => setAvgLotsPerClient(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D31C2B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                    <span>2 Lots</span>
                    <span>30 Lots</span>
                  </div>
                </div>

                {/* Slider 3: Rebate Rate (USD per lot) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-sm text-gray-700">Axi Rebate Tier (USD per Lot)</span>
                    <span className="text-lg text-[#D31C2B]">${rebateRate.toFixed(1)} / Lot</span>
                  </div>
                  <input 
                    type="range" 
                    min="3" 
                    max="10" 
                    step="0.5"
                    value={rebateRate} 
                    onChange={(e) => setRebateRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D31C2B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                    <span>$3.0 Tier 1</span>
                    <span>$10.0 Tier 3 VIP</span>
                  </div>
                </div>

              </div>

              {/* Monthly Earnings Output Container */}
              <div className="bg-[#12131A] text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-800">
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Monthly Commission</span>
                  <span className="text-3xl md:text-4xl font-black text-[#FFC800] font-mono leading-none block mt-1">
                    ${estimatedMonthlyCommission.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  <span className="block text-[10px] text-gray-500 mt-2 font-medium">Calculated based on referred trading activity in a 30-day billing cycle.</span>
                </div>
                <a 
                  href="#apply-form"
                  className="bg-[#D31C2B] hover:bg-[#B91623] text-white text-xs font-extrabold text-center uppercase tracking-wider py-4 px-6 rounded-xl transition-all shadow-md shadow-red-500/10 shrink-0"
                >
                  Lock In My Tier
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Partner Dashboard / Showcase Platform Footprint */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-black text-[#D31C2B] uppercase tracking-widest block">The Partner Hub</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
              Client Portal & Real-Time Tracking Link Hub
            </h2>
            <p className="text-gray-500 leading-relaxed font-semibold">
              Get full transparency with our state-of-the-art Client Portal (`clientportal.axi.com`). Monitor referral clicks, track conversions, generate customized links, and visualize your payout trends.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D31C2B]/10 flex items-center justify-center text-[#D31C2B] shrink-0 font-bold text-xs mt-0.5">1</div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Campaign Management</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Create multiple tracking identifiers (sub-IDs) to split-test campaigns, social media bios, YouTube links, and educational seminars.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D31C2B]/10 flex items-center justify-center text-[#D31C2B] shrink-0 font-bold text-xs mt-0.5">2</div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Automated Media Center</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Access high-converting banner designs, responsive html landing pages, market widget widgets, and customizable email templates.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D31C2B]/10 flex items-center justify-center text-[#D31C2B] shrink-0 font-bold text-xs mt-0.5">3</div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Transparency Analytics</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">No black box calculations. View the raw lot volumes, symbol spreads, and commissions earned for every individual trade executed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Portal UI Mockup Panel */}
          <div className="bg-gray-950 text-white rounded-3xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[4/3]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D31C2B]/10 rounded-full filter blur-3xl opacity-50"></div>
            
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500 font-bold font-mono ml-3 uppercase tracking-wider">Axi Partner Portal v3.1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">ID: 80921-PARTNER</span>
              </div>
            </div>

            {/* Dashboard Mock Body */}
            <div className="space-y-6 py-4 flex-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Clicks</span>
                  <span className="block text-lg font-black text-white mt-0.5">4,912</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Conversions</span>
                  <span className="block text-lg font-black text-emerald-400 mt-0.5">284</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Lots</span>
                  <span className="block text-lg font-black text-[#FFC800] mt-0.5">3,120</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Default Campaign Link</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Active</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="/signup?partner=80921" 
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg text-[11px] font-mono p-2 text-gray-400 focus:outline-none"
                  />
                  <button 
                    onClick={() => alert("Copied partner link to clipboard! (Client Sandbox)")}
                    className="bg-[#D31C2B] text-xs font-bold px-3 rounded-lg hover:bg-[#B91623]"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Progress bar mock */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                  <span>MONTHLY TIER TARGET (LOTS)</span>
                  <span>78% ACHIEVED (3,120 / 4,000 Lots)</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D31C2B] h-full rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>

            {/* Footer lock badge */}
            <div className="border-t border-gray-800 pt-4 flex items-center justify-between text-[11px] text-gray-500 font-bold uppercase">
              <span>Next Payout: 15th July (24h Processing)</span>
              <span className="flex items-center gap-1 text-[#FFC800]">
                <ShieldCheck className="w-4 h-4" /> Secure SSL Connection
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Core Partner Program Benefits */}
      <section className="py-20 px-4 bg-[#12131A] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-[#D31C2B] uppercase tracking-widest block mb-2">Why Partner with us</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">The Axi Footprint Advantage</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto font-medium">Align your brand with an award-winning broker that prioritizes transparency, high conversion, and local compliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Regulatory Security",
                desc: "We are licensed in tier-1 jurisdictions (FCA, ASIC, DFSA, SCB, FSA) protecting your brand equity and providing security."
              },
              {
                icon: Percent,
                title: "Squeeze Spreads",
                desc: "Clients get access to institutional-grade liquidity, meaning ultra-tight spreads, 99.9% fill rates, and zero trade intervention."
              },
              {
                icon: Headphones,
                title: "1-on-1 VIP Managers",
                desc: "Never chat with a generic support bot. Every partner gets an exclusive expert manager to configure custom promotion campaigns."
              },
              {
                icon: Award,
                title: "Multi-Asset Catalog",
                desc: "Our catalog includes MT4/MT5 accounts for Forex pairs, commodities, indices, global tech shares, and standard cryptocurrencies."
              }
            ].map((b, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#D31C2B]/15 flex items-center justify-center text-[#D31C2B]">
                  <b.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{b.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High-Impact Partner Application Form */}
      <section id="apply-form" className="py-20 px-4 max-w-4xl mx-auto scroll-mt-6">
        <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 md:p-12 text-gray-950">
          
          <AnimatePresence mode="wait">
            {!formSubmitted ? (
              <motion.div 
                key="form-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex w-12 h-12 bg-[#D31C2B]/10 rounded-2xl items-center justify-center text-[#D31C2B] mb-2">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Partner Application Form</h3>
                  <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto font-semibold">
                    Complete the form below to submit your official partner onboarding application. Our partner manager will reach out to you within 24 business hours.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Full Name *</label>
                      <input 
                        type="text" 
                        name="fullName"
                        required 
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 bg-gray-50 focus:bg-white transition-all font-semibold"
                      />
                    </div>

                    {/* Email address */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. partner@mybrand.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 bg-gray-50 focus:bg-white transition-all font-semibold"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Phone / WhatsApp Number *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +44 7911 123456"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 bg-gray-50 focus:bg-white transition-all font-semibold"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Country of residence *</label>
                      <select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 bg-gray-50 focus:bg-white transition-all font-semibold"
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Australia">Australia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Other">Other Region / Country</option>
                      </select>
                    </div>

                    {/* Program Type */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Preferred Partnership *</label>
                      <select 
                        name="programType"
                        value={formData.programType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 bg-gray-50 focus:bg-white transition-all font-semibold"
                      >
                        <option value="Introducing Broker (IB)">Introducing Broker (IB)</option>
                        <option value="Affiliate Program">CPA Affiliate Partner</option>
                        <option value="White Label">White Label / Institutional</option>
                        <option value="Axi Select Referral">Axi Select Capital Ambassador</option>
                      </select>
                    </div>

                    {/* Traffic Source */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Main Traffic / Client Source *</label>
                      <select 
                        name="trafficSource"
                        value={formData.trafficSource}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/50 bg-gray-50 focus:bg-white transition-all font-semibold"
                      >
                        <option value="Social Media / Community">Social Media Channels / Community</option>
                        <option value="Website SEO / Blog">Website Comparison Blog / SEO</option>
                        <option value="Signals / Copy Trading">Signals Provider / Copy Trading</option>
                        <option value="offline Educators">Offline Classroom / Educator</option>
                        <option value="Other">Other Promotion Method</option>
                      </select>
                    </div>

                  </div>

                  {/* Agree checkbox */}
                  <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-4">
                    <input 
                      type="checkbox" 
                      id="agreeTerms"
                      required
                      checked={formData.agreeTerms}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 rounded border-gray-300 text-[#D31C2B] focus:ring-[#D31C2B] mt-1 cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="text-xs text-gray-500 font-semibold leading-relaxed cursor-pointer select-none">
                      I agree that Axi may contact me regarding the partner program. I confirm that I have read and agree to be bound by the <a href="/terms-of-service" className="text-[#D31C2B] underline">Axi Partner Terms and Conditions</a> and the <span className="text-[#D31C2B] underline">Conflict of Interest Policy</span>.
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#D31C2B] hover:bg-[#B91623] text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-red-500/10 hover:scale-[1.01] active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <span>Submit Partner Application</span>
                    <Check className="w-5 h-5 text-[#FFC800]" />
                  </button>

                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10 space-y-6"
              >
                <div className="inline-flex w-20 h-20 bg-emerald-50 rounded-full items-center justify-center text-emerald-500 mx-auto border border-emerald-100 shadow-md">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900">Application Submitted Successfully!</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto font-semibold">
                    Thank you, <span className="text-[#D31C2B] font-black">{formData.fullName}</span>. Your request for the <span className="text-[#D31C2B] font-black">{formData.programType}</span> has been securely recorded.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl max-w-lg mx-auto text-left text-xs text-gray-600 space-y-3 font-semibold">
                  <div className="text-gray-800 font-bold uppercase tracking-wider border-b border-gray-200 pb-2">Onboarding Roadmap:</div>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Submission verification (Complete)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#D31C2B]/15 text-[#D31C2B] flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Exclusive Partner Manager contact via email (Within 24 business hours)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>KYC approval & customized tracking link generation</span>
                  </div>
                </div>

                <button 
                  onClick={resetForm}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3.5 px-8 rounded-xl transition-all"
                >
                  Back to form
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 7. Legal Disclaimer Footer Footprint */}
      <section className="bg-gray-950 border-t border-gray-900 py-12 px-4 text-xs text-gray-500 leading-relaxed">
        <div className="max-w-7xl mx-auto space-y-4 font-semibold text-center md:text-left">
          <p>
            <span className="font-bold text-gray-400">Risk Warning:</span> Trading Financial Instruments (including CFDs, Forex, and physical assets) carries high risk and may result in the loss of all your invested capital. You do not own or have rights to the underlying assets. Axi Select is our capital incubation pathway and does not represent direct financial advisory or deposit-backed options.
          </p>
          <p>
            Axi is a registered brand name of AxiCorp Financial Services Pty Ltd (ACN 127 606 348), regulated by the Australian Securities and Investments Commission (ASIC) and globally by regulatory authorities under FCA, DFSA, FSA, and SCB registries.
          </p>
        </div>
      </section>

    </div>
  );
}
