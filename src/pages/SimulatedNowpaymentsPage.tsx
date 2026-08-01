import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Loader2, ArrowLeft, Bitcoin, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/copyToClipboard";

export default function SimulatedNowpaymentsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1199); // 20 minutes countdown

  const invoiceId = searchParams.get("invoiceId") || "np_test_123";
  const amount = searchParams.get("amount") || "100.00";
  const currency = searchParams.get("currency") || "USD";
  const account = searchParams.get("account") || "AXI89021";

  // Calculate USDT equivalent (1:1 with USD for simple testing)
  const usdtAmount = (parseFloat(amount) * 1.00).toFixed(2);
  const destinationAddress = "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX";

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const copyAddress = () => {
    copyToClipboard(destinationAddress, "Wallet Address");
  };

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      setTimeout(() => {
        window.location.href = `/dashboard?deposit_status=success&invoice_id=${invoiceId}`;
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#131418] flex items-center justify-center font-sans text-gray-200 p-4 select-none">
      <div className="w-full max-w-md bg-[#1c1d24] border border-[#2e3039] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <div className="bg-[#2a2c35] p-6 border-b border-[#2e3039] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#f7931a] rounded-full animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#f7931a] flex items-center gap-1.5">
              <Bitcoin className="w-4 h-4 shrink-0" />
              <span>NOWPayments Gateway</span>
            </span>
          </div>
          <button onClick={() => navigate("/dashboard")} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-bold">
            <ArrowLeft size={12} /> Cancel
          </button>
        </div>

        {paySuccess ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Payment Detected!</h2>
            <p className="text-sm font-semibold text-gray-400 leading-relaxed">
              The smart contract has successfully matched your payment on the TRON network block explorer.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f7931a]" />
              <span>Updating trading account...</span>
            </div>
          </motion.div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Amount details */}
            <div className="text-center">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Amount to Send</span>
              <div className="text-3xl font-black text-white font-mono mt-1 flex items-center justify-center gap-1.5">
                <span>{usdtAmount}</span>
                <span className="text-lg text-[#f7931a] uppercase">USDT (TRC20)</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 font-semibold uppercase tracking-wider">
                Funding {currency} {amount} into Live Account {account}
              </p>
            </div>

            {/* Countdown timer */}
            <div className="bg-[#24262f] rounded-xl p-3 border border-[#2e3039] flex justify-between items-center text-xs font-semibold">
              <span className="text-gray-400 uppercase tracking-wide text-[10px] font-bold">Invoice active for</span>
              <span className="font-mono text-white text-sm bg-red-950/40 border border-red-500/30 px-2.5 py-0.5 rounded text-red-400 font-extrabold animate-pulse">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Address input copy box */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wide">USDT Destination Wallet (TRC20 Only)</label>
              <div className="flex gap-2">
                <input type="text" readOnly value={destinationAddress}
                  className="flex-1 px-4 py-3 bg-[#131418] border border-[#2e3039] rounded-xl text-xs font-mono font-bold text-gray-300 outline-none select-all text-center" />
                <button onClick={copyAddress} className="p-3 bg-[#2a2c35] hover:bg-[#343642] border border-[#2e3039] rounded-xl text-gray-300 hover:text-white transition-all">
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-[9px] text-red-400 font-bold leading-relaxed uppercase text-center tracking-wider pt-1">
                ⚠️ Sending any other token or using a different network will result in permanent loss!
              </p>
            </div>

            {/* QR Code Simulation */}
            <div className="flex flex-col items-center justify-center py-4 bg-white/5 border border-dashed border-gray-700 rounded-2xl">
              <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg relative">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=ethereum:${destinationAddress}?amount=${usdtAmount}`} 
                  alt="USDT TRC20 QR Code" className="w-full h-full" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#f7931a]/5 animate-pulse rounded-xl" />
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3.5">Scan from Trust, Binance or MetaMask</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button onClick={handlePay} disabled={isPaying}
                className="w-full py-4 rounded-xl bg-[#f7931a] hover:bg-[#e28112] text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]">
                {isPaying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Transfer on TRON...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Simulate Crypto Transfer Done</span>
                  </>
                )}
              </button>
            </div>

            <div className="border-t border-[#2e3039] pt-4 flex items-center justify-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              <Lock className="w-3 h-3 text-green-500" />
              <span>SSL Fully Protected Gateway Sandbox</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
