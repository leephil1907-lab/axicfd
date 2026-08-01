import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Education() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" ref={ref} className="py-20" style={{ backgroundColor: "#EDE8E0" }}>
      <div className="container-axi flex flex-col md:flex-row items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <div className="relative group p-2 bg-transparent rounded-3xl transition-all duration-500">
            <img 
              src="https://d2tpnh780x5es.cloudfront.net/rebrand-prod/whajyhfk/committed-long-term-success-homepage.svg" 
              alt="Education Resources" 
              className="max-w-full md:max-w-[500px] h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-103" 
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: "#1A1A1A" }}>
            Committed to your long-term success
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "#6B6560" }}>
            Fundamental tools, training resources,{" "}
            <a href="#" className="text-black hover:text-[#FFC800] font-black transition-colors underline">trading education</a>
            {" "}and expert coaching to help you continuously improve.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="btn-yellow">AXI ACADEMY</button>
            <button className="btn-yellow">LEARN TO TRADE</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
