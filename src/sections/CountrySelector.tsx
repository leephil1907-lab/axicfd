import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { COUNTRIES } from "@/lib/constants";

interface Country {
  code: string;
  name: string;
  flag: string;
  regulation: string;
  leverage: string;
}

// Convert code to flag emoji
function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const REGULATED_SPECIFICS: Record<string, { regulation: string; leverage: string }> = {
  GB: { regulation: "FCA (Financial Conduct Authority)", leverage: "1:30" },
  AU: { regulation: "ASIC (Australian Securities and Investments Commission)", leverage: "1:30" },
  DE: { regulation: "BaFin (Federal Financial Supervisory Authority)", leverage: "1:30" },
  FR: { regulation: "AMF (Autorité des Marchés Financiers)", leverage: "1:30" },
  SG: { regulation: "MAS (Monetary Authority of Singapore)", leverage: "1:20" },
  AE: { regulation: "DFSA (Dubai Financial Services Authority)", leverage: "1:50" },
  NZ: { regulation: "FMA (Financial Markets Authority)", leverage: "1:30" },
  CH: { regulation: "FINMA (Swiss Financial Market Supervisory Authority)", leverage: "1:100" },
  ES: { regulation: "CNMV (Comisión Nacional del Mercado de Valores)", leverage: "1:30" },
  CA: { regulation: "IIROC (Investment Industry Regulatory Organization)", leverage: "1:50" },
  JP: { regulation: "FSA (Financial Services Agency)", leverage: "1:25" },
  US: { regulation: "CFTC / NFA (Commodity Futures Trading Commission)", leverage: "1:50" },
};

const countriesList: Country[] = COUNTRIES.map(c => {
  const spec = REGULATED_SPECIFICS[c.code] || {
    regulation: "Global International Entity (FSA Regulated)",
    leverage: "1:500"
  };
  return {
    code: c.code,
    name: c.label,
    flag: getFlagEmoji(c.code),
    regulation: spec.regulation,
    leverage: spec.leverage
  };
});

export default function CountrySelector() {
  const [selected, setSelected] = useState<Country>(countriesList[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countriesList.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country: Country) => {
    setSelected(country);
    setIsOpen(false);
    setSearch("");
    toast.success(`Switched jurisdiction to ${country.name} (${country.regulation})`);
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Selected region confirmed: ${selected.name}`, {
        description: `Regulations: ${selected.regulation} with max leverage up to ${selected.leverage}. Redirecting to onboarding...`,
      });
      window.location.href = `/signup?country=${selected.code}`;
    }, 1200);
  };

  return (
    <section className="bg-white py-20 md:py-24 border-t border-gray-100 font-sans select-none" id="country-jurisdiction-section">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[#D31C2B] text-[10px] font-black uppercase tracking-widest rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Regulated Global Broker</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Trade under world-class regulation
            </h2>
            
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
              Axi is trusted by over 60,000+ traders globally. Because our clients come from different regions, we offer services through various fully regulated entities. Select your country of residence to find the account terms and regulations suited specifically to you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Licensing Entity</span>
                <span className="text-xs font-bold text-gray-800 mt-1 block">{selected.regulation}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Default Retail Leverage</span>
                <span className="text-xs font-bold text-gray-800 mt-1 block">Up to {selected.leverage}</span>
              </div>
            </div>
          </div>

          {/* Form Right Column */}
          <div className="lg:col-span-5">
            <div className="bg-[#f9fafb] p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-lg">
              <form onSubmit={handleProceed} className="space-y-5">
                
                <div className="space-y-2" ref={dropdownRef}>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                    Your Country of Residence
                  </label>
                  
                  {/* Selector Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className={`w-full flex items-center justify-between p-4 bg-white border-2 rounded-xl transition-all hover:border-[#D31C2B] text-left focus:outline-none ${
                        isOpen ? "border-[#D31C2B] shadow-md" : "border-gray-200/80"
                      }`}
                      id="country-select-trigger"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl select-none" role="img" aria-label={selected.name}>
                          {selected.flag}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block">{selected.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium block truncate max-w-[200px] md:max-w-[250px]">{selected.regulation}</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                    </button>

                    {/* Selector Dropdown Panel */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                          {/* Search Input Box */}
                          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="Search country..."
                              className="w-full text-xs font-bold text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
                              autoFocus
                            />
                          </div>

                          {/* Options List */}
                          <div className="max-h-60 overflow-y-auto py-1">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => handleSelect(c)}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                                    selected.code === c.code ? "bg-rose-50/50" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl" role="img" aria-label={c.name}>{c.flag}</span>
                                    <div>
                                      <span className={`text-xs block ${selected.code === c.code ? "font-black text-[#D31C2B]" : "font-bold text-gray-800"}`}>
                                        {c.name}
                                      </span>
                                      <span className="text-[9.5px] text-gray-400 font-medium block">{c.regulation}</span>
                                    </div>
                                  </div>
                                  {selected.code === c.code && <Check className="w-4 h-4 text-[#D31C2B]" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-6 text-center text-xs text-gray-400 font-bold">
                                No countries match your search.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Regulation disclosures & links */}
                <div className="p-4 bg-white/75 rounded-xl border border-gray-200 text-[11px] text-gray-500 leading-relaxed font-medium space-y-2">
                  <p>
                    By clicking continue, your request is being directed to the entity authorized under <span className="font-bold text-gray-800">{selected.regulation}</span>.
                  </p>
                  <div className="flex items-center gap-3 pt-1 border-t border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <a href="/risk-disclosure" target="_blank" className="hover:text-[#D31C2B] flex items-center gap-1">
                      <span>Risk Warning</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span>•</span>
                    <a href="/privacy-policy" target="_blank" className="hover:text-[#D31C2B] flex items-center gap-1">
                      <span>Privacy Policy</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Continue / Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#D31C2B] hover:bg-black disabled:bg-rose-900 text-white font-extrabold text-xs uppercase tracking-[1.5px] rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-red-500/10 active:scale-98 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue & Register Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <span className="text-[11px] text-gray-400 font-bold">Already have an account? </span>
                  <a href="/login" className="text-[11px] text-[#D31C2B] hover:underline font-black uppercase tracking-wider ml-1">
                    Log In
                  </a>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
