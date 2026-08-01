import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AxiSelect() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ backgroundColor: "#D31C2B" }} className="py-20 overflow-hidden">
      <div className="container-axi flex flex-col md:flex-row items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Selecting traders with the best edge
          </h2>
          <p className="mt-4 text-base text-white/80 leading-relaxed">
            Axi Select is our program to find promising traders and turn them into professionals. We&apos;ll even back you with Axi funds.
          </p>
          <p className="mt-3 text-sm text-white/70">
            <a href="/docs/Axi+Select+Terms+of+Service.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
              Read Axi Select Terms of Service
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <img
            src="/axi-select-person.jpg"
            alt="Axi Select Trader"
            className="max-w-full md:max-h-[350px] h-auto object-cover rounded-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
