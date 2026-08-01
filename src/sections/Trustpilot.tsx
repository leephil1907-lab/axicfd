import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "btranko", time: "5h ago", title: "User friendly portal", rating: 5 },
  { name: "Ashraf", time: "6h ago", title: "Amazing trading platform", rating: 5 },
  { name: "Cedric B.", time: "9h ago", title: "Fast deposits", rating: 5 },
  { name: "trader99", time: "12h ago", title: "Great spreads & execution", rating: 5 },
  { name: "Maria K.", time: "1d ago", title: "Reliable broker for EUR pairs", rating: 5 },
  { name: "Jean D.", time: "1d ago", title: "Excellent EU support", rating: 5 },
];

export default function Trustpilot() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-8" style={{ backgroundColor: "#fff" }}>
      <div className="container-axi">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Badge - compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill={i <= 4 ? "#22A958" : "#22A958"} stroke="#22A958" />
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: "#6B6560" }}>
                <span className="font-semibold" style={{ color: "#22A958" }}>Trustpilot</span> 7,083 reviews
              </p>
            </div>
          </motion.div>

          {/* Review strip */}
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
                  className="flex-shrink-0 px-3 py-2 rounded-md border"
                  style={{ borderColor: "#F5F2ED", backgroundColor: "#FAFAF8" }}
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} fill={s <= r.rating ? "#22A958" : "none"} stroke={s <= r.rating ? "#22A958" : "#D9D3CB"} />
                    ))}
                  </div>
                  <p className="text-xs font-semibold mt-1" style={{ color: "#1A1A1A" }}>{r.title}</p>
                  <p className="text-[10px]" style={{ color: "#9B9590" }}>{r.name} · {r.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
