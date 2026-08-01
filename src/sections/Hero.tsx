import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Cpu } from "lucide-react";

interface SlideData {
  id: number;
  tag: string;
  heading: string;
  headingAccent?: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageD: string;
  imageM: string;
  theme: "light" | "dark";
  badgeIcon: React.ReactNode;
  badgeText: string;
  bullets?: string[];
}

const slides: SlideData[] = [
  {
    id: 1,
    tag: "650+ MARKETS. ONE APP.",
    heading: "650+ markets.",
    headingAccent: "One app.",
    subtext: "Trade 650+ assets across forex, crypto, commodities, share CFDs, ETFs and global indices without switching apps.",
    ctaText: "Download Now",
    ctaLink: "/trading",
    secondaryCtaText: "Learn More",
    secondaryCtaLink: "/markets",
    imageD: "https://aximedia.s3.amazonaws.com/rebrand-prod/cqwgeo2z/hero-1920-x-500-2-1.png",
    imageM: "https://aximedia.s3.amazonaws.com/rebrand-prod/u53p5rxy/mobile-header.png",
    theme: "light",
    badgeIcon: <Sparkles className="w-3.5 h-3.5 text-[#D31C2B]" />,
    badgeText: "Axi Trading App",
    bullets: ["Zero Commission CFDs", "Spreads from 0.0 pips", "Leverage up to 1000:1", "Instant Execution"]
  },
  {
    id: 2,
    tag: "PRECIOUS METALS",
    heading: "Trade Gold CFDs",
    headingAccent: "Seize safe-haven opportunities on Gold & Silver",
    subtext: "Hedge your portfolio against inflation with competitive pricing, spreads from 0.0 pips, and lightning-fast execution.",
    ctaText: "Trade Gold",
    ctaLink: "/trading",
    secondaryCtaText: "Markets Overview",
    secondaryCtaLink: "/markets",
    imageD: "https://aximedia.s3.amazonaws.com/rebrand-prod/2p4i3qej/gold.png",
    imageM: "https://aximedia.s3.amazonaws.com/rebrand-prod/pkyje0ow/gold-mobile.png",
    theme: "dark",
    badgeIcon: <TrendingUp className="w-3.5 h-3.5 text-[#FFC800]" />,
    badgeText: "Gold CFD Trading"
  },
  {
    id: 3,
    tag: "AXI SELECT PROGRAM",
    heading: "Get funded up to $1,000,000",
    headingAccent: "Our revolutionary allocation program is 100% free",
    subtext: "No registration fees. No hidden charges. Trade your way and access up to $1,000,000 of Axi capital.",
    ctaText: "Apply for Funding",
    ctaLink: "/axi-select",
    secondaryCtaText: "Learn Axi Select",
    secondaryCtaLink: "/axi-select",
    imageD: "https://aximedia.s3.amazonaws.com/rebrand-prod/4lvneggw/desktop-5.png",
    imageM: "https://aximedia.s3.amazonaws.com/rebrand-prod/emch1yyh/mobile-12.png",
    theme: "dark",
    badgeIcon: <Cpu className="w-3.5 h-3.5 text-[#FFC800]" />,
    badgeText: "Axi Select Funding"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  // Tick the progress bar
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / 60); // 100% over 6s (60 ticks of 100ms)
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const slide = slides[current];

  return (
    <section 
      className={`relative w-full min-h-[600px] md:h-[680px] flex items-center overflow-hidden transition-colors duration-500 select-none ${
        slide.theme === "light" ? "bg-[#F5F2ED]" : "bg-[#0A0A0B]"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      id="hero-slideshow-section"
    >
      
      {/* Background Graphic Asset with Smooth Slide transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full z-0"
        >
          {/* Desktop Image */}
          <img 
            src={slide.imageD} 
            alt={slide.heading} 
            className="hidden md:block w-full h-full object-cover object-center filter brightness-90 transition-transform duration-[6000ms] ease-out scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Mobile Image */}
          <img 
            src={slide.imageM} 
            alt={slide.heading} 
            className="block md:hidden w-full h-full object-cover object-center filter brightness-90 transition-transform duration-[6000ms] ease-out scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Dynamic Theme Gradient Overlay to match Axi design system */}
          <div 
            className="absolute inset-0" 
            style={{ 
              background: slide.theme === "light" 
                ? "linear-gradient(90deg, rgba(245,242,237,0.98) 0%, rgba(245,242,237,0.85) 45%, rgba(245,242,237,0.4) 75%, rgba(245,242,237,0.1) 100%)"
                : "linear-gradient(90deg, rgba(10,10,11,0.98) 0%, rgba(10,10,11,0.85) 45%, rgba(10,10,11,0.4) 75%, rgba(10,10,11,0.1) 100%)"
            }} 
          />
          <div 
            className="absolute inset-0"
            style={{
              background: slide.theme === "light"
                ? "radial-gradient(circle at bottom left, rgba(213,24,32,0.06) 0%, transparent 60%)"
                : "radial-gradient(circle at bottom left, rgba(213,24,32,0.15) 0%, transparent 60%)"
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Main Slide Content Grid */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="container-axi w-full px-6 py-16 md:py-24">
          <div className="max-w-[640px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
                }}
              >
                {/* 1. Tagline Badge */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${
                    slide.theme === "light" 
                      ? "bg-white/80 border-gray-200 text-gray-800" 
                      : "bg-[#1A1A1E]/80 border-white/10 text-gray-300"
                  }`}
                >
                  {slide.badgeIcon}
                  <span>{slide.tag}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D31C2B]" />
                  <span className={slide.theme === "light" ? "text-[#D31C2B]" : "text-[#FFC800]"}>
                    {slide.badgeText}
                  </span>
                </motion.div>

                {/* 2. Primary Heading ("Trade Your Edge") */}
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className={`text-4xl sm:text-5xl md:text-6.5xl font-black leading-[1.08] mt-5 tracking-tight font-sans ${
                    slide.theme === "light" ? "text-gray-950" : "text-white"
                  }`}
                >
                  {slide.heading}{" "}
                  {slide.headingAccent && (
                    <span className={slide.theme === "light" ? "text-[#D31C2B] block" : "text-[#FFC800] block"}>
                      {slide.headingAccent}
                    </span>
                  )}
                </motion.h1>

                {/* Optional Bullets */}
                {slide.bullets && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                    }}
                    className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 mb-2"
                  >
                    {slide.bullets.map((bullet, idx) => (
                      <motion.div
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFC800] shrink-0" />
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          slide.theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}>
                          {bullet}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* 3. Description subtext */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                  }}
                  className={`text-sm md:text-base leading-relaxed max-w-[540px] mt-4 font-medium ${
                    slide.theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  {slide.subtext}
                </motion.p>

                {/* 4. Multi-CTA Action Buttons */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                  }}
                  className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                >
                  <a 
                    href={slide.ctaLink} 
                    className={`px-8 py-3.5 font-black text-xs uppercase tracking-[1.5px] rounded transition-all flex items-center justify-center gap-2 active:scale-95 border-2 ${
                      slide.theme === "light" 
                        ? "bg-[#D31C2B] border-[#D31C2B] text-white hover:bg-black hover:border-black" 
                        : "bg-[#FFC800] border-[#FFC800] text-black hover:bg-white hover:border-white shadow-lg shadow-[#FFC800]/10"
                    }`}
                    id={`hero-cta-btn-${slide.id}`}
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                  
                  {slide.secondaryCtaText && (
                    <a
                      href={slide.secondaryCtaLink}
                      className={`px-8 py-3.5 font-black text-xs uppercase tracking-[1.5px] rounded border-2 transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        slide.theme === "light"
                          ? "border-gray-300 hover:border-black text-gray-800 hover:text-black hover:bg-black/5"
                          : "border-white/25 hover:border-white text-white hover:bg-white/5"
                      }`}
                      id={`hero-secondary-btn-${slide.id}`}
                    >
                      <Play className={`w-3.5 h-3.5 fill-current shrink-0 ${
                        slide.theme === "light" ? "text-gray-800" : "text-[#FFC800]"
                      }`} />
                      <span>{slide.secondaryCtaText}</span>
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Swipe/Touch Nav Indicators & Slide Progress Tracks */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container-axi px-6 flex items-center justify-between">
          
          {/* Progress Indicators */}
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrent(idx);
                  setProgress(0);
                }}
                className="group relative flex flex-col items-start text-left focus:outline-none"
                id={`hero-indicator-dot-${s.id}`}
              >
                {/* Red progress line tracker */}
                <div className={`w-10 md:w-16 h-1 rounded-full overflow-hidden transition-all duration-300 ${
                  slide.theme === "light" ? "bg-gray-200" : "bg-white/10"
                }`}>
                  <div 
                    className="h-full bg-[#D31C2B]"
                    style={{ 
                      width: idx === current ? `${progress}%` : idx < current ? "100%" : "0%"
                    }}
                  />
                </div>
                {/* Numeric indicators */}
                <span className={`text-[10px] font-black mt-1.5 tracking-wider transition-colors duration-300 ${
                  idx === current 
                    ? "text-[#D31C2B]" 
                    : slide.theme === "light"
                      ? "text-gray-400 group-hover:text-gray-700"
                      : "text-gray-600 group-hover:text-gray-300"
                }`}>
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive Prev/Next Arrows (Hidden on Mobile, Hover shows on Desktop) */}
          <div className="hidden md:flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={prevSlide}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
                slide.theme === "light" 
                  ? "border-gray-200 bg-white hover:bg-gray-100 text-gray-800" 
                  : "border-white/10 bg-[#12131A] hover:bg-[#1A1A24] text-white"
              }`}
              title="Previous Slide"
              id="hero-arrow-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
                slide.theme === "light" 
                  ? "border-gray-200 bg-white hover:bg-gray-100 text-gray-800" 
                  : "border-white/10 bg-[#12131A] hover:bg-[#1A1A24] text-white"
              }`}
              title="Next Slide"
              id="hero-arrow-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}
