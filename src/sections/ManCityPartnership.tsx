import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import { Trophy, ArrowRight, ShieldCheck } from "lucide-react";

export default function ManCityPartnership() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="partnership" ref={ref} className="relative w-full overflow-hidden py-24 bg-gradient-to-r from-[#F5F2ED] via-[#FAFAF8] to-[#F5F2ED]">
      {/* Dynamic background sashes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6CABDD]/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC800]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="container-axi relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#6CABDD]/10 border border-[#6CABDD]/20 px-4 py-1.5 rounded-full text-xs font-black text-[#4B88BD] uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-[#FFC800] fill-[#FFC800]" />
            <span>Official Global Partner</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight uppercase">
            A Winning <span className="text-[#6CABDD]">Partnership</span> Built on <span className="text-gray-950 font-black">Precision</span>
          </h2>
          
          <p className="text-base md:text-lg leading-relaxed text-gray-600 font-medium">
            We're incredibly proud to be the **Official Online Trading Partner of Manchester City Football Club**. In both global financial markets and elite sports, the formula for victory is identical: rigorous preparation, rapid millisecond execution, and total risk control.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Shared dedication to peak performance and continuous improvement",
              "Access to custom masterclass trading guides and mental discipline tools",
              "Exclusive seasonal draws for VIP Etihad Stadium tickets & signed merchandise"
            ].map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-start gap-3 text-sm text-gray-700 font-semibold">
                <ShieldCheck className="w-5 h-5 text-[#6CABDD] shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link to="/manchester-city">
              <button className="bg-gray-950 hover:bg-[#6CABDD] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2">
                <span>EXPLORE PARTNERSHIP</span>
                <ArrowRight className="w-4 h-4 text-[#FFC800]" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Cinematic Image Frame Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2"
        >
          <div className="relative group overflow-hidden rounded-[2.5rem] border-4 border-white bg-white p-2 shadow-2xl shadow-[#6CABDD]/15 transition-all duration-500 hover:shadow-sky-300/30">
            {/* Interactive outer glow container */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6CABDD]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none rounded-[2rem]"></div>
            
            <div className="overflow-hidden rounded-[2.2rem] relative">
              <img
                src="https://d2tpnh780x5es.cloudfront.net/rebrand-prod/inxgd1cl/axi-mancity-extend-partnership-1920-x-500-px-v2.jpg?anchor=center&mode=crop&rnd=133247128942470000"
                alt="Manchester City Partnership"
                className="w-full h-[320px] md:h-[420px] object-cover transition-all duration-[1500ms] ease-out group-hover:scale-105 group-hover:rotate-1 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Glassmorphic Co-branded Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-white z-20 flex items-center justify-between shadow-lg">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-black text-[#6CABDD] tracking-widest block">Axi x Manchester City</span>
                  <p className="text-sm font-bold tracking-tight">The Official Online Trading Partner</p>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white border border-white/10">
                  EST. 2020
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
