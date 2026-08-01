import { useState, useEffect, useMemo } from 'react'
import { trpc } from '@/providers/trpc'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Newspaper, TrendingUp, TrendingDown, RefreshCw, 
  Sparkles, AlertCircle, Info, ExternalLink, SlidersHorizontal 
} from 'lucide-react'

interface MarketNewsProps {
  selectedSymbol: string
  setSelectedSymbol: (symbol: string) => void
  isAuthenticated: boolean
}

export default function MarketNews({ selectedSymbol, setSelectedSymbol, isAuthenticated }: MarketNewsProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'asset'>('asset')
  const [isRotating, setIsRotating] = useState(false)
  const [breakingNews, setBreakingNews] = useState<any | null>(null)

  // Query parameters based on filter mode
  const queryParams = useMemo(() => {
    if (filterMode === 'asset') {
      return { symbol: selectedSymbol, limit: 12 }
    }
    return { limit: 12 }
  }, [filterMode, selectedSymbol])

  // Fetch from the news-router TRPC endpoint
  const { data: newsItems, isLoading, refetch, isRefetching } = trpc.news.latest.useQuery(
    queryParams, 
    { 
      refetchInterval: 45000, 
      enabled: isAuthenticated,
      keepPreviousData: true
    }
  )

  // Rotate refresh icon during active requests
  useEffect(() => {
    if (isRefetching) {
      setIsRotating(true)
    } else {
      const timer = setTimeout(() => setIsRotating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isRefetching])

  // Generate simulated real-time "Breaking Alerts" when symbol changes
  useEffect(() => {
    if (!selectedSymbol) return

    // Create a matching breaking alert relevant to the active asset
    const alerts: Record<string, any> = {
      EURUSD: {
        title: "ECB Policymakers Hint at Impending Rate Cuts on Softening Eurozone PMIs",
        summary: "Several members of the European Central Bank's governing council suggested that the central bank is open to lowering borrowing costs as early as the next meeting due to cooling private sector business activity.",
        source: "Financial Times",
        impact: "high",
        sentiment: "bearish",
        time: "Just Now"
      },
      GBPUSD: {
        title: "UK Wage Growth Moderates, Fueling Bank of England Rate Cut Projections",
        summary: "Average earnings excluding bonuses rose less than forecast in the latest three-month period, clearing the path for the BoE to consider easing policy.",
        source: "Bloomberg",
        impact: "medium",
        sentiment: "bearish",
        time: "1m ago"
      },
      XAUUSD: {
        title: "Gold Resumes Climb as Geopolitical Risks Reignite Safe-Haven Bids",
        summary: "Gold futures edged back toward all-time highs following renewed escalations in regional conflicts, prompting traders to build protective hedge positions in physical bullion.",
        source: "Reuters",
        impact: "high",
        sentiment: "bullish",
        time: "Just Now"
      },
      BTCUSD: {
        title: "Bitcoin Network Hashrate Reaches Lifetime Peak as Difficulty Adjusts Upward",
        summary: "The computational power securing the Bitcoin network has reached a new record high, indicating continued robust commitment from global institutional miners.",
        source: "CoinDesk",
        impact: "medium",
        sentiment: "bullish",
        time: "2m ago"
      },
      USDJPY: {
        title: "Japan's Finance Minister Refuses to Rule Out Action Against Weak Yen Speculation",
        summary: "In a stern press conference, officials warned that the authorities are ready to execute extreme measures to tackle unilateral, speculative moves on the Yen.",
        source: "Nikkei Asia",
        impact: "high",
        sentiment: "bearish", // negative for USDJPY, meaning Yen strengthening
        time: "Just Now"
      },
      OILUSD: {
        title: "OPEC+ Expresses Unanimous Commitment to Supply Cut Discipline",
        summary: "Member states reiterated full compliance with designated production limits, successfully neutralizing fears of near-term oversupply.",
        source: "CNBC",
        impact: "high",
        sentiment: "bullish",
        time: "Just Now"
      }
    }

    // Set a matching alert or generate a generic one
    if (alerts[selectedSymbol]) {
      setBreakingNews(alerts[selectedSymbol])
    } else {
      setBreakingNews({
        title: `Macro Volatility Rises for ${selectedSymbol} Amid Yield Curve Movements`,
        summary: `Bond yields and currency swaps indicate tightening credit markets, forcing macro funds to adjust leverage ratios across key pairs, including ${selectedSymbol}.`,
        source: "Reuters",
        impact: "medium",
        sentiment: "neutral",
        time: "Just Now"
      })
    }

    // Dismiss alert after some time or let it stay
  }, [selectedSymbol])

  // Compute sentiment analysis index from articles
  const sentimentScore = useMemo(() => {
    if (!newsItems || newsItems.length === 0) return { label: 'Neutral', value: 50, color: 'text-amber-400', bg: 'bg-amber-400/10' }
    
    let score = 0
    let count = 0
    
    // Simple sentiment analyzer based on financial vocabularies
    const positiveWords = ['surges', 'rallies', 'gains', 'up', 'high', 'bullish', 'climb', 'strong', 'growth', 'rise', 'support']
    const negativeWords = ['drops', 'falls', 'slumps', 'down', 'low', 'bearish', 'cut', 'weak', 'risk', 'ease', 'pressure']
    
    newsItems.forEach((article: any) => {
      const text = `${article.title} ${article.summary}`.toLowerCase()
      let posCount = 0
      let negCount = 0
      
      positiveWords.forEach(w => { if (text.includes(w)) posCount++ })
      negativeWords.forEach(w => { if (text.includes(w)) negCount++ })
      
      if (posCount > negCount) {
        score += 1
      } else if (negCount > posCount) {
        score -= 1
      }
      count++
    })
    
    if (count === 0) return { label: 'Neutral', value: 50, color: 'text-amber-400', bg: 'bg-amber-400/10' }
    
    const normalized = score / count // range [-1, 1]
    const val = Math.round(((normalized + 1) / 2) * 100) // scale to [0, 100]
    
    if (val > 55) {
      return { label: 'Bullish Sentiment', value: val, color: 'text-green-400', bg: 'bg-green-500/10' }
    } else if (val < 45) {
      return { label: 'Bearish Sentiment', value: val, color: 'text-red-400', bg: 'bg-red-500/10' }
    } else {
      return { label: 'Neutral Outlook', value: val, color: 'text-amber-400', bg: 'bg-amber-400/10' }
    }
  }, [newsItems])

  const handleManualRefresh = () => {
    refetch()
  }

  return (
    <div className="flex flex-col h-full bg-gray-950/40 rounded-xl" id="axi-market-news-dashboard">
      {/* Widget Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-800 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Newspaper className="w-4 h-4 text-[#FFC800]" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-space">Live Axi Intelligence Feed</h3>
            <p className="text-[10px] text-gray-500 font-mono">Simulated algorithmic financial wire</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {/* Toggle filter */}
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-0.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterMode('asset')}
              className={`flex-1 sm:flex-none px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-md tracking-wider transition-all ${
                filterMode === 'asset' 
                  ? 'bg-gray-800 text-[#FFC800]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {selectedSymbol} Only
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`flex-1 sm:flex-none px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-md tracking-wider transition-all ${
                filterMode === 'all' 
                  ? 'bg-gray-800 text-[#FFC800]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Assets
            </button>
          </div>

          <button
            onClick={handleManualRefresh}
            className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-[#FFC800] transition-colors"
            title="Refresh Wire"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Breaking News Flash Section */}
      {breakingNews && (
        <div className="mt-3 bg-red-950/20 border border-red-900/40 rounded-xl p-3.5 flex items-start gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none" />
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1 shrink-0" />
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest bg-red-500 text-black px-1.5 py-0.5 rounded">BREAKING</span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">{selectedSymbol} Market Impact</span>
              <span className="text-[9px] text-gray-500 font-mono ml-auto">{breakingNews.time}</span>
            </div>
            <h4 className="text-xs font-bold text-gray-200 leading-snug">{breakingNews.title}</h4>
            <p className="text-[10.5px] text-gray-400 leading-relaxed">{breakingNews.summary}</p>
            <div className="flex items-center gap-1.5 pt-1 text-[9px] text-gray-500">
              <span>Source: <strong className="text-red-400/80">{breakingNews.source}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-red-400/80 uppercase font-black font-mono">
                {breakingNews.sentiment === 'bullish' ? <TrendingUp className="w-2.5 h-2.5 inline text-green-400" /> : <TrendingDown className="w-2.5 h-2.5 inline text-red-400" />}
                {breakingNews.sentiment} IMPACT
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Index Dashboard Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3 items-center bg-gray-900/30 border border-gray-800/80 rounded-xl p-3">
        <div className="col-span-12 md:col-span-5 space-y-1">
          <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest font-space">Algorithmic Sentiment Index</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-sm font-black uppercase tracking-tight ${sentimentScore.color}`}>{sentimentScore.label}</span>
            <span className="text-[11px] text-gray-500 font-mono font-bold">({sentimentScore.value}%)</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7 flex items-center gap-3">
          <div className="h-2 flex-1 bg-gray-850 rounded-full overflow-hidden relative border border-gray-800">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${sentimentScore.value}%` }}
            />
            {/* Center threshold line */}
            <div className="absolute top-0 left-1/2 -ml-px w-0.5 h-full bg-gray-950 opacity-50" />
          </div>
          <div className="flex gap-4 text-[10px] text-gray-500 font-mono shrink-0 select-none">
            <span className="text-red-400 font-bold">Bearish</span>
            <span className="text-green-400 font-bold">Bullish</span>
          </div>
        </div>
      </div>

      {/* Main Headlines List Area */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 max-h-[350px] space-y-3 no-scrollbar">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="animate-spin w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full" />
              <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase animate-pulse">Retrieving Global Feed...</div>
            </div>
          ) : !newsItems || newsItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500 rounded-xl border border-dashed border-gray-850">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-30 text-[#FFC800]" />
              <p className="text-xs font-semibold text-gray-400">No active reports for {selectedSymbol}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">Toggle filter mode to 'All Assets' to view macro wire events.</p>
            </div>
          ) : (
            newsItems.map((article: any, index: number) => {
              const isHighImpact = article.impact === 'high'
              const isMediumImpact = article.impact === 'medium'
              
              return (
                <motion.div
                  key={article.id || index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="p-3.5 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700/80 hover:bg-gray-900/80 transition-all duration-200 relative group"
                >
                  {/* Card Background subtle gradient focus */}
                  <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#FFC800]/0 group-hover:from-[#FFC800]/2 transition-all pointer-events-none rounded-r-xl" />

                  {/* Meta Details */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Impact Tag */}
                      <span className={`text-[8.5px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                        isHighImpact ? 'bg-red-950/70 text-red-400 border border-red-800/40' :
                        isMediumImpact ? 'bg-amber-950/70 text-amber-400 border border-amber-800/40' :
                        'bg-blue-950/70 text-blue-400 border border-blue-800/40'
                      }`}>
                        {article.impact} Impact
                      </span>

                      {/* Category Tag */}
                      <span className="text-[9.5px] text-[#FFC800] font-black uppercase tracking-tight">{article.category}</span>
                      
                      <span className="text-[10px] text-gray-600">•</span>
                      
                      {/* Source */}
                      <span className="text-[10px] text-gray-400 font-semibold">{article.source}</span>
                    </div>

                    {/* Timestamp */}
                    <span className="text-[9px] text-gray-500 font-mono">
                      {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h4 className="text-xs font-extrabold text-gray-200 mb-1.5 leading-snug tracking-tight group-hover:text-white transition-colors">
                    {article.title}
                  </h4>

                  {/* Body Summary */}
                  <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                    {article.summary}
                  </p>

                  {/* Symbol Action badging */}
                  {article.symbol && (
                    <div className="mt-3 flex items-center justify-between border-t border-gray-800/40 pt-2.5">
                      <div className="text-[9px] text-gray-500 flex items-center gap-1">
                        <span>Affected Asset:</span>
                        <button 
                          onClick={() => {
                            setSelectedSymbol(article.symbol)
                            // Display quick feedback
                            toast.info(`Switched active chart to ${article.symbol} based on headline insights.`)
                          }}
                          className={`font-mono font-black text-[10px] px-2 py-0.5 rounded transition-all hover:scale-105 active:scale-95 ${
                            article.symbol === selectedSymbol 
                              ? 'bg-[#FFC800] text-black shadow-md shadow-[#FFC800]/10 font-bold' 
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          {article.symbol}
                        </button>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9.5px] text-[#FFC800] font-bold flex items-center gap-0.5">
                        Trade Now <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
