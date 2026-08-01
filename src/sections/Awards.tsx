import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const awards = [
  { image: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/rqpp5q0f/awards-new-1.png", title: "Best CFD Provider", sub: "Global Forex Awards", year: "2021" },
  { image: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/44wdwqkk/awards-new-2.png", title: "Best CFD Broker", sub: "Ultimate Fintech", year: "2022" },
  { image: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/fmulswz2/mt4-awards.png", title: "Best Trading Platform", sub: "UK Forex Awards", year: "2023" },
  { image: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/jghfw14g/awards-new.png", title: "Best Forex Provider", sub: "Holistic Finance", year: "2023" },
];

export default function Awards() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="awards" ref={ref} className="py-24 relative overflow-hidden bg-gradient-to-b from-[#F2EEE6] via-[#FAF9F6] to-[#F2EEE6] border-y border-[#D9D3CB]/30">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#FFC800]/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FFC800]/10 rounded-full filter blur-3xl pointer-events-none"></div>
      
      <div className="container-axi relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs font-black text-gray-800 bg-[#FFC800] px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3">GLOBAL TRUST & EXCELLENCE</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-950">
            24/5 Award-Winning Service.
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mt-2 text-gray-700">
            100% Committed to Your Edge.
          </h3>
          <p className="mt-4 text-base text-gray-600 leading-relaxed max-w-xl mx-auto font-medium">
            We are proud of our globally recognized excellence, built on transparency, industry-leading reliability, and world-class customer service.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-16">
          {awards.map((award, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
            >
              {/* Gold light corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFC800]/5 rounded-bl-full group-hover:bg-[#FFC800]/15 transition-all"></div>
              
              <div className="w-[100px] md:w-[130px] h-[100px] md:h-[130px] flex items-center justify-center p-2 mb-4 group-hover:scale-110 transition-transform duration-300">
                <img 
                  src={award.image} 
                  alt={award.title} 
                  className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:brightness-105" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-2 space-y-1">
                <span className="text-[10px] font-black text-black bg-[#FFC800] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  WINNER {award.year}
                </span>
                <h4 className="text-sm font-extrabold text-gray-900 uppercase tracking-tight pt-2">
                  {award.title}
                </h4>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  {award.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-12 font-semibold" style={{ color: "#9B9590" }}>
          ** Axi Group of companies global industry recognition milestones.
        </p>
      </div>
    </section>
  );
}
