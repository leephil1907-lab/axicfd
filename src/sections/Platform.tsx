import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  "Industry-standard MT4",
  "A suite of trading resources",
];

export default function Platform() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="platform" ref={ref} className="py-20 bg-neutral-950 border-y border-neutral-800">
      <div className="container-axi flex flex-col md:flex-row items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Powerful platforms. You at the Controls.
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-white/90 text-base"
              >
                <span className="text-white font-light">/</span>
                <span>{f}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-8"
          >
            <button className="btn-yellow">GET THE TECHNOLOGY EDGE</button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <div className="relative group p-2 bg-transparent rounded-3xl transition-all duration-500">
            <img 
              src="https://d2tpnh780x5es.cloudfront.net/rebrand-prod/sg1bjgdx/powerful-platforms-homepage.svg" 
              alt="Trading Platform" 
              className="max-w-full md:max-w-[500px] h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-103" 
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
