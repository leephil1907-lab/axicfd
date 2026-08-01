import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-20"
      style={{ background: "linear-gradient(135deg, #FF4757 0%, #D31C2B 50%, #B91623 100%)" }}
    >
      <div className="container-axi text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          Ready to trade your edge?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-3 text-base text-white/80"
        >
          Start trading with a global, award-winning broker.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link to="/signup" className="btn-yellow px-7 py-3 rounded text-[11px] font-semibold uppercase tracking-[1.5px] inline-block">
            OPEN A LIVE ACCOUNT
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
