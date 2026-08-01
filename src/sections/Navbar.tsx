import { useState, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLocale, languages } from "@/hooks/useLocale";
import GlobalDropdown from "@/components/GlobalDropdown";
import { 
  Globe, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  HelpCircle, 
  LogOut, 
  ArrowRight,
  TrendingUp,
  Smartphone,
  ShieldCheck,
  Zap,
  BookOpen,
  Users,
  Briefcase,
  BarChart2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  name: string;
  desc: string;
  href: string;
  badge?: "NEW" | "BETA";
}

interface NavCategory {
  title: string;
  items: MenuItem[];
  icon?: React.ComponentType<{ className?: string }>;
}

const navMenu: NavCategory[] = [
  {
    title: "Our Edge",
    items: [
      { name: "Axi Select", desc: "Path to $1 Million funding program", href: "/axi-select", badge: "BETA" },
      { name: "Elite Execution", desc: "Lightning fast speed with spreads from 0.0 pips", href: "/platforms/mt4" },
      { name: "Copy Trading", desc: "Mirror top performing global traders instantly", href: "/trading-tools" },
      { name: "Capital Protection", desc: "FCA & ASIC segregated client account safety", href: "/licenses" },
      { name: "Regulation & Safety", desc: "Fully licensed across premium tier-1 jurisdictions", href: "/licenses" }
    ],
    icon: Zap
  },
  {
    title: "Trading",
    items: [
      { name: "Live WebTrader Terminal", desc: "Launch MT4/MT5 WebTrader with live order book", href: "/trading", badge: "NEW" },
      { name: "Trading Sessions Hub", desc: "Sydney, Tokyo, London, NY live clocks & volatility", href: "/trading-sessions", badge: "NEW" },
      { name: "Live Market Prices & Spreads", desc: "Real-time FX, Crypto & Indices quotes from CoinGecko", href: "/markets" },
      { name: "Axi Select Program", desc: "Trade with up to $1M funded capital allocation", href: "/axi-select" },
      { name: "Copy Trading Network", desc: "Automatically copy top profitable global traders", href: "/trading-tools" },
      { name: "Trading Hours & Holidays", desc: "Global exchange operating schedules and session overlaps", href: "/trading-hours" }
    ],
    icon: BarChart2
  },
  {
    title: "Markets",
    items: [
      { name: "Forex Trading", desc: "Trade major, minor and exotic currency pairs", href: "/markets/forex" },
      { name: "Share CFDs", desc: "600+ blue-chip global companies with low margin", href: "/markets/shares" },
      { name: "Index CFDs", desc: "Trade S&P 500, DAX 40, FTSE 100 & major indices", href: "/markets/indices" },
      { name: "Commodities CFDs", desc: "Access Gold, Silver, Oil, Gas and soft futures", href: "/markets/commodities" },
      { name: "Cryptocurrencies", desc: "Trade BTC, ETH, SOL CFDs 24/7 with tight pricing", href: "/markets/crypto" },
      { name: "Precious Metals", desc: "Leveraged Gold and Silver trading", href: "/markets/commodities", badge: "NEW" }
    ],
    icon: TrendingUp
  },
  {
    title: "Trading Platforms",
    items: [
      { name: "MetaTrader 4 (MT4)", desc: "The world's most popular FX trading terminal", href: "/platforms/mt4" },
      { name: "MetaTrader 5 (MT5)", desc: "Next-gen multi-asset platform with advanced tools", href: "/platforms/mt5" },
      { name: "Axi Mobile App", desc: "Trade 650+ global markets on the go", href: "/platforms", badge: "NEW" },
      { name: "Axi WebTrader", desc: "Zero installation required, trade from any browser", href: "/platforms" },
      { name: "MT4 NexGen Add-ons", desc: "Advanced sentiment maps and alarm indicators", href: "/trading-tools" }
    ],
    icon: Smartphone
  },
  {
    title: "Learn to Trade",
    items: [
      { name: "Axi Academy", desc: "Comprehensive structured courses for all levels", href: "/learn", badge: "NEW" },
      { name: "Free eBook Library", desc: "In-depth trading guides, tutorials and books", href: "/learn" },
      { name: "Video Seminars", desc: "Live webinars and expert strategy sessions", href: "/learn" },
      { name: "Market Analysis & Blog", desc: "Daily market updates and insights from top analysts", href: "/blog" },
      { name: "Learn Forex Trading", desc: "Step-by-step introduction to currency markets", href: "/learn" }
    ],
    icon: BookOpen
  },
  {
    title: "Partnerships",
    items: [
      { name: "Manchester City FC", desc: "Official Online Trading Partner of the champions", href: "/manchester-city" },
      { name: "Introducing Broker (IB)", desc: "Earn competitive referral rebates on client trades", href: "/partnerships" },
      { name: "Affiliate Program", desc: "Highest-paying partner plan in the industry", href: "/partnerships" },
      { name: "White Label Solutions", desc: "Launch your own branded premium brokerage", href: "/partnerships" }
    ],
    icon: Users
  },
  {
    title: "Company",
    items: [
      { name: "About Axi", desc: "A world-leader in global online CFD brokerage", href: "/company" },
      { name: "Regulation & Licenses", desc: "ASIC, FCA, DFSA and FSA authorized and regulated", href: "/licenses" },
      { name: "Careers at Axi", desc: "Join an innovative, high-performance global team", href: "/company" },
      { name: "Press & Media", desc: "Latest corporate news and official statements", href: "/company" },
      { name: "Contact Us", desc: "Get 24/5 dedicated multi-lingual assistance", href: "/contact" }
    ],
    icon: Briefcase
  }
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, setLang } = useLocale();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (categoryTitle: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(categoryTitle);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleLanguageSelect = (code: string) => {
    setLang(code as any);
  };

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <>
      {/* Main Header Wrapper - Signature Axi Red Bar */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans border-b border-[#B0152D] bg-[#E31C3A] text-white shadow-md select-none"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[60px] md:h-[64px] flex items-center justify-between">
          
          {/* Brand Logo - Official Axi Style */}
          <Link 
            to="/" 
            className="flex items-center select-none shrink-0 group"
            onClick={() => {
              setActiveMenu(null);
              setMobileOpen(false);
            }}
          >
            <div className="flex items-baseline text-white text-2xl md:text-3xl font-bold tracking-tighter select-none">
              <span>ax</span>
              <span className="font-normal">i</span>
              <div className="w-1.5 h-1.5 bg-white rounded-full ml-0.5 self-start mt-2"></div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 ml-8 mr-auto">
            {navMenu.map((cat) => {
              const isCurrentActive = activeMenu === cat.title;
              return (
                <div 
                  key={cat.title}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-md flex items-center gap-1 focus:outline-none ${
                      isCurrentActive 
                        ? "text-[#FFD700] bg-black/20 font-black" 
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{cat.title}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCurrentActive ? "rotate-180 text-[#FFD700]" : "rotate-0 opacity-80"}`} />
                  </button>

                  {/* Mega Dropdown Panel */}
                  <AnimatePresence>
                    {isCurrentActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.99 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-1 w-[400px] rounded-2xl shadow-2xl border border-gray-100 bg-white text-gray-900 p-4 overflow-hidden z-50"
                      >
                        <div className="grid grid-cols-1 gap-1">
                          <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-gray-100">
                            {cat.icon && <cat.icon className="w-4 h-4 text-[#E31C3A]" />}
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.title} Options</span>
                          </div>
                          {cat.items.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={() => setActiveMenu(null)}
                              className="group flex flex-col p-2.5 rounded-xl transition-colors hover:bg-red-50/60"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-900 group-hover:text-[#E31C3A] transition-colors">{sub.name}</span>
                                {sub.badge && (
                                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                    sub.badge === "BETA" 
                                      ? "bg-amber-100 text-amber-800 border border-amber-300" 
                                      : "bg-red-100 text-red-700 border border-red-200"
                                  }`}>
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10.5px] mt-0.5 font-medium leading-relaxed text-gray-500">{sub.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            
            {/* Help Center */}
            <Link 
              to="/help" 
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white uppercase tracking-wide px-2 py-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-white/80" />
              <span>Support</span>
            </Link>

            {/* Reusable Global Language Dropdown */}
            <GlobalDropdown
              trigger={{
                label: currentLang.code,
                icon: Globe,
                variant: 'outline',
                size: 'sm',
                className: 'text-xs uppercase tracking-wide font-bold'
              }}
              align="right"
              width="w-48"
              items={languages.map((l) => ({
                id: l.code,
                label: (
                  <div className="flex items-center justify-between w-full">
                    <span>{l.label}</span>
                    <span className="ml-2 font-normal">{l.flag}</span>
                  </div>
                ),
                selected: lang === l.code,
                onClick: () => handleLanguageSelect(l.code)
              }))}
            />

            {/* Secure Auth Actions OR User Dashboard Global Dropdown */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 rounded-lg uppercase tracking-wider transition-colors border border-white/20"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-[#FFD700] hover:bg-[#E6C200] text-[#1A1A1A] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>Open account</span>
                </Link>
              </div>
            ) : (
              <GlobalDropdown
                trigger={{
                  label: user?.name || "My Portal",
                  icon: User,
                  variant: 'gold',
                  size: 'sm',
                  className: 'uppercase tracking-wider font-extrabold shadow-sm'
                }}
                align="right"
                width="w-64"
                header={
                  <div className="bg-gradient-to-r from-red-50 to-amber-50 p-3 rounded-xl border border-red-100">
                    <span className="text-[9px] text-[#E31C3A] font-black uppercase block tracking-widest">Axi Live Account</span>
                    <span className="text-[11px] text-gray-900 block truncate font-black mt-0.5">{user?.name || "Trader"}</span>
                    <span className="text-[10px] text-gray-500 block truncate font-medium">{user?.email}</span>
                  </div>
                }
                items={[
                  { id: 'trading', label: 'Trading Terminal', icon: BarChart2, href: '/trading' },
                  { id: 'deposit', label: 'Deposit Funds', icon: ArrowRight, href: '/deposit' },
                  { id: 'withdrawal', label: 'Withdraw Funds', icon: ArrowRight, href: '/withdrawal' },
                  { id: 'funds', label: 'Portfolio & Funds', icon: ShieldCheck, href: '/funds' },
                  { id: 'axi-select', label: 'Axi Select Program', badge: 'BETA', icon: Zap, href: '/axi-select' },
                  { id: 'settings', label: 'Profile & Settings', icon: User, href: '/settings', divider: true },
                  ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Console', icon: ShieldCheck, href: '/admin', divider: true }] : []),
                  {
                    id: 'logout',
                    label: 'Log Out',
                    icon: LogOut,
                    danger: true,
                    onClick: () => logout()
                  }
                ]}
              />
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 text-white hover:bg-black/20 rounded-lg transition-colors focus:outline-none"
              title="Toggle Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-[60px] bg-white z-30 overflow-y-auto px-6 py-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              
              {/* Category expansion blocks */}
              {navMenu.map((cat) => (
                <div key={cat.title} className="space-y-2 border-b border-gray-100 pb-4">
                  <h4 className="text-xs font-black text-[#C5A059] uppercase tracking-widest flex items-center gap-2">
                    {cat.icon && <cat.icon className="w-4 h-4" />}
                    <span>{cat.title}</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {cat.items.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-gray-800 block">{sub.name}</span>
                          <span className="text-[10.5px] text-gray-500 block leading-tight font-medium">{sub.desc}</span>
                        </div>
                        {sub.badge && (
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-red-100 text-red-600 rounded uppercase tracking-wider">
                            {sub.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mobile Help Link */}
              <Link
                to="/help"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 text-gray-800 font-bold text-sm uppercase tracking-wider"
              >
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span>Help Centre Support</span>
              </Link>

            </div>

            {/* Mobile Footer Auth Options */}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest text-center rounded-xl transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 bg-[#FFC800] hover:bg-black text-black hover:text-white font-black text-xs uppercase tracking-widest text-center rounded-xl transition-all shadow-md"
                >
                  Open Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main offset spacers */}
      <div className="h-[60px] md:h-[64px]" />
    </>
  );
}
