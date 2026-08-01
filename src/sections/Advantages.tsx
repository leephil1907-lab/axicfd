import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const leftFeatures = [
  "Ultra-competitive pricing, unbeatable value",
  "Raw spreads, high liquidity, flexible leverage",
  "High-performance, innovative trading technology",
  "Lightning-fast execution, rock-solid platform",
];

const rightFeatures = [
  "Award-winning 24/7 customer service",
  "Free education to sharpen your skills",
  "Self-service portal + multilingual support",
  "An established global broker since 2007",
];

export default function Advantages() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="advantages" ref={ref} className="py-16" style={{ backgroundColor: "#EDE8E0" }}>
      <div className="container-axi">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-10"
          style={{ color: "#1A1A1A" }}
        >
          The edge for thousands of traders in 100+ countries
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-3 max-w-[850px] mx-auto">
          {leftFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 flex-shrink-0 text-sm" style={{ color: "#D31C2B" }}>/</span>
              <span className="text-[15px]" style={{ color: "#1A1A1A" }}>{f}</span>
            </motion.div>
          ))}
          {rightFeatures.map((f, i) => (
            <motion.div
              key={i + 4}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: (i + 4) * 0.1, duration: 0.4 }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 flex-shrink-0 text-sm" style={{ color: "#D31C2B" }}>/</span>
              <span className="text-[15px]" style={{ color: "#1A1A1A" }}>{f}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex justify-center mt-10"
        >
          <button className="btn-yellow">TRADE WITH A TOP BROKER</button>
        </motion.div>
      </div>
    </section>
  );
}
