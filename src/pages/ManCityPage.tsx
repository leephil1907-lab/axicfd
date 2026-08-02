import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { 
  Trophy, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  HelpCircle, 
  Award, 
  Play, 
  Star, 
  Percent, 
  Activity, 
  Users, 
  Target,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Gift,
  MapPin
} from "lucide-react";

// Quiz types & data
interface QuizQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    type: "striker" | "midfielder" | "defender" | "goalkeeper";
    desc: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "The market undergoes a sudden, massive spike in volatility during a high-impact news event. What is your immediate reaction?",
    options: [
      {
        text: "Capitalize immediately! Ride the momentum with high leverage on Gold or Crypto.",
        type: "striker",
        desc: "Aggressive forward action to capture swift gains."
      },
      {
        text: "Review the technical charts, determine the trend support, and enter a calculated position.",
        type: "midfielder",
        desc: "Tactical distribution of order sizing based on structure."
      },
      {
        text: "Stand aside, protect my capital, or tighten my trailing stop losses closely.",
        type: "defender",
        desc: "Strict defense and capital preservation rules."
      },
      {
        text: "Hedge my existing trades with opposite directions to completely lock in safety.",
        type: "goalkeeper",
        desc: "Ultimate protective lockdown against potential threat."
      }
    ]
  },
  {
    id: 2,
    text: "How do you construct and view your typical trading plan or strategy?",
    options: [
      {
        text: "Go with my instincts and high-conviction breakout momentum. Speed over excessive prep.",
        type: "striker",
        desc: "High-octane execution seeking maximum returns."
      },
      {
        text: "A balanced macro playbook using a diversified mix of Forex, Indices, and Commodities.",
        type: "midfielder",
        desc: "Commanding the center field with optimal asset allocation."
      },
      {
        text: "Heavy reliance on risk-reward ratios (minimum 1:3) and strict position size limits.",
        type: "defender",
        desc: "Building a fortress layout that prevents drawdown runs."
      },
      {
        text: "Triple-verifying news feeds, exchange spreads, and trading only highly secure liquid pairs.",
        type: "goalkeeper",
        desc: "Absolute final line of defense against market surprises."
      }
    ]
  },
  {
    id: 3,
    text: "You experience a consecutive streak of three losing trades. What does your playbook say?",
    options: [
      {
        text: "Increase my size on the next trade to recover losses immediately. No fear.",
        type: "striker",
        desc: "Double down on attack to break the goal drought."
      },
      {
        text: "Take a brief break, re-analyze my trade journals, and recalibrate my entry filters.",
        type: "midfielder",
        desc: "Tactical team talk to adjust positioning."
      },
      {
        text: "Halve my trading volume on subsequent trades to ensure drawdown is completely limited.",
        type: "defender",
        desc: "Fall back to a defensive block and lower the risk profile."
      },
      {
        text: "Switch to a demo account environment or a safe-haven asset like USD cash to preserve total confidence.",
        type: "goalkeeper",
        desc: "Clean sheet protection until the team settles."
      }
    ]
  }
];

const POSITION_RESULTS = {
  striker: {
    title: "Market Striker",
    role: "Aggressive Growth & High Momentum",
    style: "As a Striker, you look for direct, high-impact trading opportunities. You thrive in ultra-volatile markets like Gold, Tech Shares, and Cryptocurrencies. You aren't afraid of high leverage and act with extreme speed of execution. Your edge lies in explosive momentum breakouts.",
    assets: ["XAU/USD (Gold)", "NASDAQ CFDs", "Bitcoin / Solana CFDs", "High-Beta Tech Stocks"],
    stat: "High Win-Rate, High Volatility Playbook",
    coachTip: "Ensure your passion is backed by solid stop losses. Even the most elite forwards need a defensive block behind them to win the season!"
  },
  midfielder: {
    title: "Tactical Midfielder",
    role: "Precision Trend-Playmaker",
    style: "As a Midfielder, you are the brain of the trading desk. You balance risk and reward with extreme precision. You analyze market macro structures, distribute your capital across Forex majors and Index trackers, and look to control the flow of the trade. You are balanced, technical, and versatile.",
    assets: ["EUR/USD & GBP/USD", "S&P 500 CFDs", "Crude Oil CFDs", "Major FX Crosses"],
    stat: "Optimized Sharpe Ratio & High Consistency",
    coachTip: "Keep leveraging technical indicators (moving averages, RSI) to maintain optimal possession. Don't let side-to-side congestion delay your execution."
  },
  defender: {
    title: "Defense Sentinel",
    role: "Capital Guardian & Drawdown Specialist",
    style: "As a Defender, your number one rule is: 'Protect your capital first, score second.' You are a risk management master. You calculate exact position sizes down to the pip, utilize rigid stop losses, and strictly prevent drawdown runs. You excel in range-bound swing trades and steady compounding.",
    assets: ["US Dollar Index (DXY)", "US Treasury Notes", "EUR/CHF & USD/CAD", "Blue-Chip Utilities"],
    stat: "Maximum Drawdown Limited to <2%",
    coachTip: "A solid defense wins championships! While capital preservation is key, ensure you occasionally authorize your trailing stops to capture long-range trends."
  },
  goalkeeper: {
    title: "Hedged Goalkeeper",
    role: "Ultimate Capital Shield & Hedging Master",
    style: "As a Goalkeeper, you are the final line of defense. You focus on ultimate security, market neutral strategies, and absolute preservation of account value. You favor heavy hedging, zero-risk arbitrage, safe-haven gold reserves, and institutional-tier liquidity protection. You intercept extreme market shocks.",
    assets: ["Spot Gold & Silver", "Swiss Franc (CHF)", "Japanese Yen (JPY)", "Hedged Arbitrage Pairs"],
    stat: "Zero Unmanaged Exposure & Ultra-Safe Compound",
    coachTip: "Your vigilance protects against black-swan event goals. Balance your safety-first outlook with occasional selective directional positions."
  }
};

export default function ManCityPage() {
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<keyof typeof POSITION_RESULTS | null>(null);

  // Giveaway Form State
  const [giveawaySubmitted, setGiveawaySubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [mcName, setMcName] = useState("");

  const handleAnswerSelect = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate result based on majority vote
      const counts = { striker: 0, midfielder: 0, defender: 0, goalkeeper: 0 };
      newAnswers.forEach(ans => {
        counts[ans as keyof typeof counts] = (counts[ans as keyof typeof counts] || 0) + 1;
      });

      // Find highest score
      let bestType: keyof typeof counts = "midfielder";
      let maxCount = -1;
      (Object.keys(counts) as (keyof typeof counts)[]).forEach(k => {
        if (counts[k] > maxCount) {
          maxCount = counts[k];
          bestType = k;
        }
      });

      setQuizResult(bestType);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizResult(null);
  };

  const handleGiveawaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !mcName) return;
    setGiveawaySubmitted(true);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-gray-900 font-sans selection:bg-[#6CABDD] selection:text-white">
      
      {/* 1. HERO HEADER: Cosmic Sky Blue & Axi Crimson */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F111A] via-[#121929] to-[#0A0D14] text-white py-24 px-4 border-b border-gray-900">
        
        {/* Sky blue ambient glow + grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#6CABDD]/20 via-[#D31C2B]/5 to-transparent opacity-75"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Partnership badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md"
          >
            <span className="flex items-baseline font-black text-lg tracking-tighter text-white">
              ax<span className="text-[#D31C2B]">i</span>
              <span className="inline-block w-1 h-1 bg-[#FFC800] rounded-full ml-0.5 animate-pulse" />
            </span>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#6CABDD] uppercase">
              <Trophy className="w-4 h-4 text-[#FFC800]" />
              <span>Manchester City Official Partner</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-none uppercase"
          >
            Sprinting to the Edge of <span className="text-[#6CABDD]">Performance</span> & <span className="text-[#D31C2B]">Precision</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Axi is proud to be the **Official Online Trading Partner of Manchester City FC**. In both global trading and elite football, the formula for victory remains identical: rigorous preparation, rapid execution, and absolute risk control.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="pt-4 flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/signup" 
              className="bg-[#D31C2B] hover:bg-[#B91623] text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Trade Your Edge</span>
              <ArrowRight className="w-4 h-4 text-[#FFC800]" />
            </Link>
            <a 
              href="#quiz-section" 
              className="bg-[#6CABDD] hover:bg-[#5293C4] text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#6CABDD]/10"
            >
              Take Position Quiz
            </a>
          </motion.div>

          {/* Quick Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto pt-10 border-t border-white/10 text-center">
            <div>
              <span className="block text-3xl md:text-4xl font-extrabold text-[#6CABDD]">100%</span>
              <span className="block text-[10px] text-gray-400 font-black tracking-wider uppercase mt-1">Dedication to Performance</span>
            </div>
            <div>
              <span className="block text-3xl md:text-4xl font-extrabold text-white">Under 1ms</span>
              <span className="block text-[10px] text-gray-400 font-black tracking-wider uppercase mt-1">Order Execution Latency</span>
            </div>
            <div>
              <span className="block text-3xl md:text-4xl font-extrabold text-[#FFC800]">10+</span>
              <span className="block text-[10px] text-gray-400 font-black tracking-wider uppercase mt-1">Years Joint Corporate Trust</span>
            </div>
            <div>
              <span className="block text-3xl md:text-4xl font-extrabold text-white">Segregated</span>
              <span className="block text-[10px] text-gray-400 font-black tracking-wider uppercase mt-1">Tier-1 Client Funds Safety</span>
            </div>
          </div>

        </div>

        {/* Diagonal Pitch-line illustration at the base of Hero */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6CABDD]/30 to-transparent"></div>
      </section>

      {/* 2. THE ANALOGY: Football Strategy meets Trading Edge */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-black text-[#D31C2B] uppercase tracking-widest block">Aligned Core Values</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase">Why Aligned Values Drive Success</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">To conquer the pitch or navigate the live markets, champions operate on the exact same four foundational columns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Zap,
              title: "Lightning Speed",
              sub: "Striker Reflexes vs Millisecond Fills",
              desc: "In front of goal, a split-second delay can block the strike. Axi's server infrastructure delivers under-1ms trading latency and institutional-grade order routes, ensuring your entry occurs exactly when you execute.",
              color: "text-[#6CABDD]",
              bgColor: "bg-[#6CABDD]/10"
            },
            {
              icon: Target,
              title: "Tactical Playbooks",
              sub: "Match Day Tactics vs Chart Analysis",
              desc: "Pep Guardiola's tactical playbooks align team coordinates perfectly. Axi supports traders with MT4 NextGen add-ons, Autochartist signals, and daily technical analysis to create structured, repeatable setups.",
              color: "text-[#FFC800]",
              bgColor: "bg-[#FFC800]/10"
            },
            {
              icon: ShieldCheck,
              title: "Drawdown Defense",
              sub: "Back-Four Block vs Stop Loss Precision",
              desc: "A flawless back-four prevents threat breakthroughs. Our custom margin tools, leverage customization (up to 1000:1), and instant stop-loss orders construct a secure defensive block around your balance.",
              color: "text-emerald-600",
              bgColor: "bg-emerald-50"
            },
            {
              icon: Award,
              title: "Scouting Talent",
              sub: "Man City Academy vs Axi Select",
              desc: "We spot the next generation of performers. Through the Axi Select incubation program, we provide up to $1,000,000 USD of corporate funding to talented retail traders with NO entry fees.",
              color: "text-[#D31C2B]",
              bgColor: "bg-[#D31C2B]/10"
            }
          ].map((card, idx) => (
            <div key={idx} className="bg-white border border-gray-200/80 rounded-3xl p-8 space-y-6 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-0 transition-colors group-hover:bg-gray-100"></div>
              <div className="relative z-10 space-y-4">
                <div className={`w-12 h-12 ${card.bgColor} ${card.color} rounded-2xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                  <span className="text-[10px] uppercase font-black text-gray-400 block tracking-wider mt-0.5">{card.sub}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE MINI-GAME: Find Your Trading Position Quiz */}
      <section id="quiz-section" className="py-20 px-4 bg-gray-100 border-y border-gray-200 scroll-mt-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#121929] to-[#0A0D14] p-8 text-white flex items-center justify-between border-b border-gray-800">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black tracking-widest text-[#6CABDD]">Interactive Axi Stadium</span>
                <h3 className="text-2xl font-black tracking-tight uppercase">Trading Position Match-maker</h3>
              </div>
              <Activity className="w-8 h-8 text-[#6CABDD] animate-pulse shrink-0" />
            </div>

            {/* Quiz Body */}
            <div className="p-6 md:p-12 min-h-[380px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                
                {/* STATE 1: Start Screen */}
                {!quizStarted && (
                  <motion.div 
                    key="start-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6 my-auto"
                  >
                    <div className="inline-flex w-16 h-16 bg-[#6CABDD]/10 text-[#6CABDD] rounded-full items-center justify-center mb-2 mx-auto">
                      <Target className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold text-gray-900 uppercase">What's Your Role on the Market Pitch?</h4>
                      <p className="text-sm text-gray-500 max-w-md mx-auto font-semibold">
                        Are you an aggressive high-frequency Striker, a tactical Midfielder play-maker, a rigid Defense sentinel, or a protected Goalkeeper? Take this short 3-question mock scenario test.
                      </p>
                    </div>
                    <button 
                      onClick={() => setQuizStarted(true)}
                      className="bg-gray-950 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Start Position Scout
                    </button>
                  </motion.div>
                )}

                {/* STATE 2: Answering Questions */}
                {quizStarted && !quizResult && (
                  <motion.div 
                    key={`question-${currentQuestionIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center text-xs font-black text-gray-400 uppercase tracking-widest">
                      <span>QUESTION {currentQuestionIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
                      <span className="text-[#6CABDD]">{Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
                      {QUIZ_QUESTIONS[currentQuestionIndex].text}
                    </h4>

                    <div className="space-y-3 pt-2">
                      {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerSelect(opt.type)}
                          className="w-full text-left p-4 rounded-2xl border border-gray-200 hover:border-[#6CABDD] hover:bg-[#6CABDD]/5 bg-gray-50/50 transition-all font-semibold flex items-start gap-3 text-sm group"
                        >
                          <div className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#6CABDD]">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#6CABDD] scale-0 group-hover:scale-100 transition-transform"></div>
                          </div>
                          <div>
                            <span className="block text-gray-800 font-bold leading-tight group-hover:text-gray-950">{opt.text}</span>
                            <span className="block text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide font-medium">{opt.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STATE 3: Display Result */}
                {quizResult && (
                  <motion.div 
                    key="result-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center"
                  >
                    <div className="inline-flex items-center gap-1.5 bg-[#FFC800]/10 border border-[#FFC800]/20 px-4 py-1.5 rounded-full text-xs font-black text-[#FFC800] uppercase mx-auto">
                      <Star className="w-4 h-4 fill-[#FFC800]" />
                      <span>SCOUT EVALUATION: COMPLETED</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-3xl font-black text-gray-950 uppercase tracking-tight">
                        {POSITION_RESULTS[quizResult].title}
                      </h4>
                      <p className="text-xs uppercase font-black tracking-widest text-[#6CABDD]">
                        {POSITION_RESULTS[quizResult].role}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed font-semibold">
                      {POSITION_RESULTS[quizResult].style}
                    </p>

                    {/* Recommended Assets */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 max-w-md mx-auto text-left space-y-2">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">RECOMMENDED ASSETS FOR YOUR STYLE:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {POSITION_RESULTS[quizResult].assets.map((asset, aIdx) => (
                          <span key={aIdx} className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-xs font-bold text-gray-700">
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Advice card */}
                    <div className="border-l-4 border-[#D31C2B] bg-red-50 p-4 rounded-r-xl text-left max-w-lg mx-auto">
                      <span className="block text-[9px] font-black uppercase text-[#D31C2B] tracking-widest mb-0.5">COACH'S GAMEPLAY ADVICE:</span>
                      <p className="text-xs text-red-700 font-semibold leading-relaxed">
                        {POSITION_RESULTS[quizResult].coachTip}
                      </p>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <button 
                        onClick={resetQuiz}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black uppercase tracking-widest px-5 py-3.5 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retake Scout</span>
                      </button>
                      <Link 
                        to="/signup"
                        className="bg-[#D31C2B] hover:bg-[#B91623] text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                      >
                        <span>Activate My Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PREMIUM CONTENT: Exclusive Co-branded Giveaways & Rewards */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-[#FAF9F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-black text-[#D31C2B] uppercase tracking-widest block">EXCLSUIVE EXPERIENCES</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase">
              STAND IN THE CHANCE TO WIN VIP TICKETS & SIGNED MERCH
            </h2>
            <p className="text-gray-500 leading-relaxed font-semibold">
              To celebrate our ongoing partnership, Axi is hosting exclusive campaign packages for retail and institutional traders. Every client who registers a live account and trades eligible lots is automatically entered into our seasonal lucky draws!
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#6CABDD]/10 flex items-center justify-center text-[#6CABDD] shrink-0 mt-0.5">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Signed MCFC Jersey Giveaways</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Get authentic home shirts signed by Erling Haaland, Kevin De Bruyne, and Phil Foden shipped to your door.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFC800]/10 flex items-center justify-center text-[#FFC800] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">VIP Tickets to the Etihad Stadium</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Experience a Premier League matchday from the comfort of the executive Axi Corporate box with hospitality catering.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#D31C2B]/10 flex items-center justify-center text-[#D31C2B] shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Exclusive Partner webinars</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Gain access to co-branded sports science, psychology of performance, and risk calibration lectures from elite coaches.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration form block */}
          <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6CABDD]/5 rounded-bl-full"></div>
            
            <AnimatePresence mode="wait">
              {!giveawaySubmitted ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-gray-900 uppercase">ENTER LUCKY DRAW</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Axi x MCFC Campaign Portal</p>
                  </div>

                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    Provide your basic details below to opt into seasonal ticket giveaways, signed merchandise updates, and campaign notifications.
                  </p>

                  <form onSubmit={handleGiveawaySubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={mcName}
                        onChange={(e) => setMcName(e.target.value)}
                        placeholder="e.g. Liam Gallagher"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6CABDD]/40 bg-gray-50 focus:bg-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. fan@mancity.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6CABDD]/40 bg-gray-50 focus:bg-white font-semibold"
                      />
                    </div>

                    <div className="flex items-start gap-2 pt-2 text-xs text-gray-400">
                      <input 
                        type="checkbox"
                        required
                        id="mc-terms"
                        className="w-4 h-4 rounded text-[#6CABDD] focus:ring-[#6CABDD] cursor-pointer mt-0.5"
                      />
                      <label htmlFor="mc-terms" className="cursor-pointer font-semibold select-none leading-relaxed">
                        I agree to receive Axi x Man City promotional emails and lucky draw campaign terms and conditions.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gray-950 hover:bg-[#6CABDD] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-95"
                    >
                      REGISTER FOR REWARDS
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-100">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-2xl font-black text-gray-950 uppercase tracking-tight">YOU ARE REGISTERED!</h4>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Lucky Draw Ticket Issued</p>
                  </div>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-semibold">
                    Thank you, <strong className="text-gray-950">{mcName}</strong>. Your coupon registry is saved. We will contact you at <strong className="text-gray-950">{emailInput}</strong> with official draw results and ticket alerts!
                  </p>
                  <button
                    onClick={() => { setGiveawaySubmitted(false); setEmailInput(""); setMcName(""); }}
                    className="text-xs font-black uppercase text-[#D31C2B] hover:underline"
                  >
                    Enter another address
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 5. BRAND FOOTPRINT STATEMENT */}
      <section className="py-16 bg-[#12131A] text-white border-t border-gray-900 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="text-[10px] uppercase font-black text-[#6CABDD] tracking-widest block">Official Partner Disclaimer</span>
          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed max-w-3xl mx-auto">
            Axi is a registered brand name of AxiCorp Financial Services Pty Ltd (ACN 127 606 348), authorized and regulated by global regulatory frameworks including ASIC (Australia), FCA (United Kingdom), and DFSA (Dubai). Axi is the Official Online Trading Partner of Manchester City Football Club. Manchester City FC and its associated logos are registered trademarks of Manchester City Football Club Limited. Promotional prize draws are run solely by Axi and are subject to regional compliance guidelines.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/signup" className="text-xs font-bold text-white hover:text-[#6CABDD] transition-colors flex items-center gap-1">
              <span>Create Live Account</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/partnerships" className="text-xs font-bold text-white hover:text-[#D31C2B] transition-colors flex items-center gap-1">
              <span>View Other Partnership Programs</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
