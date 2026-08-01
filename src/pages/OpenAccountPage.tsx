import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ChevronRight, User, Mail, Globe, Lock, DollarSign } from "lucide-react";
import { COUNTRIES, CURRENCIES, DEFAULT_CURRENCY } from "@/lib/constants";

const accountTypes = [
  { value: "standard", label: "Standard Account", desc: "Spreads from 0.6 pips. No commission. Best for beginners." },
  { value: "pro", label: "Pro Account", desc: "Raw spreads from 0.0 pips + $7/lot commission. For active traders." },
];

export default function OpenAccountPage() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState("standard");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!country) e.country = "Please select your country of residence.";
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Please enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    if (!agreed) e.terms = "You must agree to the terms and conditions.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4" style={{ backgroundColor: "#EDE8E0" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[480px] text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald-600">
            <Check size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-950">Welcome to Axi!</h2>
          <p className="mt-3 text-base text-gray-600">
            Your account has been created successfully. Check your email to verify your account and start trading.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/login" className="py-3 px-6 bg-[#FFC800] hover:bg-black text-black hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-md transition-all">GO TO LOGIN</Link>
            <Link to="/" className="text-sm text-gray-500 hover:text-black hover:underline font-semibold">Return to homepage</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4" style={{ backgroundColor: "#EDE8E0" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[520px]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-baseline font-black text-4xl text-gray-950 tracking-tighter select-none mb-4">
            ax<span className="text-[#D31C2B]">i</span>
            <div className="w-2.5 h-2.5 bg-[#FFC800] rounded-full ml-0.5 animate-pulse" />
          </Link>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight uppercase">Open Your Account</h1>
          <p className="mt-1 text-xs uppercase font-black tracking-widest text-gray-500">Start trading in minutes. No minimum deposit required.</p>
        </div>

        <div className="p-8 rounded-2xl shadow-xl bg-white border border-gray-200">
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-[#FFC800] text-black" : "bg-[#F5F2ED] text-[#9B9590]"}`}>1</div>
            <div className={`w-16 h-0.5 ${step >= 2 ? "bg-[#FFC800]" : "bg-gray-200"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-[#FFC800] text-black" : "bg-[#F5F2ED] text-[#9B9590]"}`}>2</div>
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                  <Globe size={14} /> Country of Residence *
                </label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/60 bg-gray-50 focus:bg-white transition-all font-semibold"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.label}>{c.label} ({c.code})</option>)}
                </select>
                {errors.country && <p className="text-xs mt-1 text-red-600 font-bold">{errors.country}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                    <User size={14} /> First Name *
                  </label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/60 bg-gray-50 focus:bg-white transition-all font-semibold" />
                  {errors.firstName && <p className="text-xs mt-1 text-red-600 font-bold">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">Last Name *</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/60 bg-gray-50 focus:bg-white transition-all font-semibold" />
                  {errors.lastName && <p className="text-xs mt-1 text-red-600 font-bold">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                  <Mail size={14} /> Email Address *
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.smith@example.com"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/60 bg-gray-50 focus:bg-white transition-all font-semibold" />
                {errors.email && <p className="text-xs mt-1 text-red-600 font-bold">{errors.email}</p>}
              </div>

              <button onClick={() => validateStep1() && setStep(2)}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md text-black bg-[#FFC800] hover:bg-black hover:text-white flex items-center justify-center gap-2 active:scale-95"
              >
                Continue <ChevronRight size={14} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">Select Account Type</h3>
              <div className="space-y-3">
                {accountTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setAccountType(type.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      accountType === type.value
                        ? "border-[#FFC800] bg-[#FFC800]/5"
                        : "border-gray-200 bg-white hover:border-[#FFC800]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-950">{type.label}</span>
                      {accountType === type.value && <div className="w-4 h-4 rounded-full bg-[#FFC800]" />}
                    </div>
                    <p className="text-xs mt-1 text-gray-500 font-semibold">{type.desc}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                  <Lock size={14} /> Create Password *
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/60 bg-gray-50 focus:bg-white transition-all font-semibold" />
                {errors.password && <p className="text-xs mt-1 text-red-600 font-bold">{errors.password}</p>}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded text-[#FFC800] focus:ring-[#FFC800]" />
                <span className="text-xs leading-relaxed text-gray-500 font-semibold">
                  I agree to the <a href="#" className="underline text-[#FFC800]">Terms & Conditions</a> and <a href="#" className="underline text-[#FFC800]">Privacy Policy</a>. I confirm I am 18 years or older.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-600 font-bold">{errors.terms}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                  Back
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md text-black bg-[#FFC800] hover:bg-black hover:text-white"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs mt-6 text-gray-500">
            Already have an account? <Link to="/login" className="underline text-[#FFC800] font-black">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
