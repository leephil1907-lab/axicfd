import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { prefix: "$", value: 5, suffix: "", display: "$5", label: "Starting deposit" },
  { value: 1000, suffix: "+", display: "1000+", label: "Products to trade" },
  { value: 0.7, suffix: "", display: "0.7", label: "Average spreads" },
  { value: 1000, suffix: ":1", display: "1000:1", label: "Max leverage" },
];

function AnimatedValue({ stat, inView }: { stat: typeof stats[0]; inView: boolean }) {
  const [display, setDisplay] = useState(stat.display.replace(/[\d.]+/, "0"));

  useEffect(() => {
    if (!inView) return;
    const target = stat.value;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let formatted: string;
      if (target >= 1000) {
        formatted = Math.round(current).toLocaleString();
      } else if (target >= 1) {
        formatted = current.toFixed(target >= 10 ? 0 : 1);
      } else {
        formatted = current.toFixed(1);
      }
      setDisplay(`${stat.prefix || ""}${formatted}${stat.suffix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, stat.prefix, stat.suffix, stat.value]);

  return <span>{display}</span>;
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-8" style={{ backgroundColor: "#EDE8E0" }}>
      <div className="container-axi flex flex-wrap items-center justify-center gap-0">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="flex flex-col items-center min-w-[120px] md:min-w-[160px] px-4"
            >
              <span className="text-3xl md:text-4xl font-bold" style={{ color: "#1A1A1A" }}>
                <AnimatedValue stat={stat} inView={inView} />
              </span>
              <span className="text-xs uppercase tracking-wider mt-1 text-center" style={{ color: "#6B6560" }}>
                {stat.label}
              </span>
            </motion.div>
            {idx < stats.length - 1 && (
              <span className="text-2xl font-light mx-4 md:mx-8 hidden sm:block" style={{ color: "#FFC800" }}>
                /
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
