import { motion } from "framer-motion";
import { Shield, Globe, Award, Users, Clock, TrendingUp } from "lucide-react";

const stats = [
  { value: "100+", label: "Countries served" },
  { value: "60,000+", label: "Active traders" },
  { value: "$2.5T", label: "Monthly volume" },
  { value: "2007", label: "Founded" },
];

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "We operate with complete transparency, keeping your funds secure in segregated accounts with tier-1 banks" },
  { icon: Globe, title: "Global Reach", desc: "Serving traders in 100+ countries with localised support and multi-language customer service" },
  { icon: Award, title: "Award-Winning", desc: "Multiple industry awards for Best CFD Provider, Best Forex Broker, and Best Trading Platform" },
  { icon: Users, title: "Customer First", desc: "24/5 dedicated customer support with industry-leading response times and satisfaction rates" },
  { icon: Clock, title: "Since 2007", desc: "Over 15 years of experience providing reliable, innovative trading services to clients worldwide" },
  { icon: TrendingUp, title: "Continuous Innovation", desc: "Constantly investing in technology and tools to give our traders the best possible edge" },
];

const awards = [
  { year: "2023", title: "Best Forex Provider", source: "Online Money Awards" },
  { year: "2023", title: "Best Forex Trading Platform", source: "Online Money Awards" },
  { year: "2022", title: "Best CFD Provider", source: "Shares Awards" },
  { year: "2021", title: "Best CFD Provider", source: "Shares Awards" },
];

export default function CompanyPage() {
  return (
    <div>
      <section className="py-20" style={{ backgroundColor: "#D31C2B" }}>
        <div className="container-axi text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            About Axi
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 text-lg text-white/80 max-w-[700px] mx-auto">
            A globally recognised, award-winning broker committed to providing traders with the edge they need to succeed
          </motion.p>
        </div>
      </section>

      <section className="py-12" style={{ backgroundColor: "#EDE8E0" }}>
        <div className="container-axi">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold" style={{ color: "#D31C2B" }}>{stat.value}</div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "#6B6560" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#fff" }}>
        <div className="container-axi">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1A1A1A" }}>
                Our Story
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: "#6B6560" }}>
                Founded in 2007, Axi has grown from a small Australian startup to a globally recognised online broker serving traders in over 100 countries. Our mission has always been the same: to give traders the edge they need to succeed.
              </p>
              <p className="mt-3 text-base leading-relaxed" style={{ color: "#6B6560" }}>
                We believe in transparent pricing, reliable execution, and providing our clients with the best tools and education available. With over 15 years of experience, we've built a reputation for trust, innovation, and customer service excellence.
              </p>
              <p className="mt-3 text-base leading-relaxed" style={{ color: "#6B6560" }}>
                Axi is a member of The Financial Commission, an independent external dispute resolution body, and operates under strict regulatory standards to ensure the highest levels of client protection.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex justify-center">
              <img src="/axi-select-person.jpg" alt="Axi Team" className="max-w-full rounded-lg shadow-lg" style={{ maxHeight: "350px", objectFit: "cover" }} />
            </motion.div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "#1A1A1A" }}>
            What drives us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border hover:shadow-md transition-shadow"
                style={{ borderColor: "#D9D3CB" }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#D31C2B" }}>
                  <val.icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: "#1A1A1A" }}>{val.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6B6560" }}>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#EDE8E0" }}>
        <div className="container-axi">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "#1A1A1A" }}>
            Awards & Recognition
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15 }}
                className="p-6 rounded-lg text-center"
                style={{ backgroundColor: "#fff", border: "1px solid #D9D3CB" }}
              >
                <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D31C2B" }}>
                  <Award size={32} className="text-white" />
                </div>
                <div className="text-sm font-bold" style={{ color: "#D31C2B" }}>{award.year}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: "#1A1A1A" }}>{award.title}</div>
                <div className="text-xs mt-1" style={{ color: "#6B6560" }}>{award.source}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
