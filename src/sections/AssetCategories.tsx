import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const categories = [
  { icon: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/xe3h1t0y/forex-trading.svg", label: "Forex" },
  { icon: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/monb1gni/axi_icon_shares.svg", label: "Shares" },
  { icon: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/v5sdzo02/indices-trading.svg", label: "Indices" },
  { icon: "https://d2tpnh780x5es.cloudfront.net/rebrand-prod/awlbqsrt/commodities-trading.svg", label: "Commodities" },
  { icon: "https://aximedia.s3.amazonaws.com/rebrand-prod/p5wlcird/derivatives-3-new-2020-v4.png", label: "Cryptocurrencies" },
];

export default function AssetCategories() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-12" style={{ backgroundColor: "#fff" }}>
      <div className="container-axi">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "#1A1A1A" }}>
          Discover popular markets to trade
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img src={cat.icon} alt={cat.label} className="w-full h-full object-contain" />
              </div>
              <span className="mt-3 text-sm font-medium" style={{ color: "#1A1A1A" }}>{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
