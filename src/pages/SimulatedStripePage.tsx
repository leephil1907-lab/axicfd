import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Loader2, ArrowLeft, CreditCard } from "lucide-react";

export default function SimulatedStripePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const sessionId = searchParams.get("sessionId") || "cs_test_123";
  const amount = searchParams.get("amount") || "100.00";
  const currency = searchParams.get("currency") || "USD";
  const account = searchParams.get("account") || "AXI89021";

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      setTimeout(() => {
        // Redirect back to Axi dashboard with success query param
        window.location.href = `/dashboard?deposit_status=success&session_id=${sessionId}`;
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-[#30313d] select-none">
      {/* Left panel: Order Summary */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e3e8ee]">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-xs font-bold text-[#635bff] mb-12 hover:underline">
            <ArrowLeft size={14} /> Back to Axi Platform
          </button>
          
          <span className="text-xs font-bold text-[#6a7383] uppercase tracking-wider block mb-2">Axi Financial Services Ltd</span>
          <h1 className="text-3xl font-extrabold text-[#1f2937] tracking-tight mb-3">Trading Account Funding</h1>
          <p className="text-sm font-semibold text-[#6a7383] mb-8">Live Account: <span className="font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">{account}</span></p>

          <div className="flex items-baseline gap-2 text-5xl font-extrabold text-[#1f2937] tracking-tight">
            <span>{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-2xl text-[#6a7383] font-bold uppercase">{currency}</span>
          </div>
        </div>

        <div className="mt-12 md:mt-0 text-xs font-semibold text-[#6a7383] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#22a958]" />
          <span>Powered by Stripe Sandbox Gateway. All data transmitted is fully mock-encrypted.</span>
        </div>
      </div>

      {/* Right panel: Payment form */}
      <div className="md:w-1/2 p-8 md:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          {paySuccess ? (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 bg-[#22a958]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#22a958]">
                <ShieldCheck className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black text-[#1a1f36] uppercase tracking-tight mb-2">Payment Authorized!</h2>
              <p className="text-sm font-semibold text-gray-500 mb-6">Your transaction has been securely processed by the Stripe Engine.</p>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#635bff]" />
                <span>Redirecting you back to Axi...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-extrabold text-[#1a1f36] mb-6">Pay with Card</h2>
              
              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#6a7383] mb-1">Email address</label>
                  <input type="email" required defaultValue="trader@axi-client.com"
                    className="w-full px-4 py-3 rounded-lg border border-[#e3e8ee] focus:border-[#635bff] text-sm font-bold shadow-sm outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6a7383] mb-1">Card details</label>
                  <div className="rounded-lg border border-[#e3e8ee] shadow-sm overflow-hidden divide-y divide-[#e3e8ee]">
                    <div className="relative">
                      <input type="text" required defaultValue="4242 •••• •••• 4242" disabled
                        className="w-full px-4 py-3 bg-[#f8f9fa] text-sm font-mono font-bold select-none outline-none" />
                      <CreditCard className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex divide-x divide-[#e3e8ee]">
                      <input type="text" required defaultValue="12 / 29" disabled
                        className="w-1/2 px-4 py-3 bg-[#f8f9fa] text-sm font-mono font-bold select-none outline-none" />
                      <input type="text" required defaultValue="•••" disabled
                        className="w-1/2 px-4 py-3 bg-[#f8f9fa] text-sm font-mono font-bold select-none outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6a7383] mb-1">Cardholder name</label>
                  <input type="text" required defaultValue="Axi Live Trader"
                    className="w-full px-4 py-3 rounded-lg border border-[#e3e8ee] focus:border-[#635bff] text-sm font-bold shadow-sm outline-none transition-all" />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isPaying}
                    className="w-full py-3.5 rounded-lg bg-[#635bff] hover:bg-[#564df0] text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-80">
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing with Stripe...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay {currency} {parseFloat(amount).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-[#e3e8ee] pt-6 flex items-start gap-2 text-[10px] font-semibold text-[#6a7383] leading-relaxed">
                <Lock className="w-3.5 h-3.5 text-[#22a958] shrink-0 mt-0.5" />
                <span>
                  This connection is secured using standard 256-bit SSL encryption. All card details are processed directly on sandbox infrastructure and never recorded in plain text.
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
