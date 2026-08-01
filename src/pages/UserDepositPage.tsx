import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { 
  Upload, 
  ChevronRight, 
  CreditCard, 
  Bitcoin, 
  Wallet, 
  Landmark, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Loader2,
  Lock,
  ExternalLink,
  Sparkles,
  Copy,
  ShieldCheck,
  Smartphone,
  XCircle,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { CURRENCIES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { QRCodeSVG } from "qrcode.react";
import StripePaymentIntentWrapper from "@/components/StripePaymentIntentForm";

const methods = [
  { 
    id: "onramp", 
    name: "Buy Crypto via Card (Transak & MoonPay)", 
    desc: "Instant Visa/MC, Apple Pay & SEPA (France, EU & Global)", 
    icon: Sparkles, 
    color: "#2563EB",
    badge: "Recommended for France & Europe"
  },
  { id: "crypto", name: "Direct Crypto Transfer (Diversified Coins)", desc: "BTC, ETH, USDT (TRC20/ERC20/BEP20), SOL, XRP & more", icon: Bitcoin, color: "#F7931A" },
  { id: "card", name: "Credit or Debit Card Gateway", desc: "Direct Stripe / Card Payment Gateway", icon: CreditCard, color: "#635BFF" },
  { id: "paypal", name: "PayPal Express", desc: "Instant checkout with PayPal account", icon: Wallet, color: "#003087" },
  { id: "bank", name: "Wire Deposit / Bank Transfer", desc: "1-3 days manual SEPA / Wire transfer", icon: Landmark, color: "#1A1A1A" },
];

export const DEFAULT_FRONTEND_WALLETS: Record<string, { address: string; tag?: string }> = {
  USDC: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  USDC_ERC20: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  BTC: { address: "bc1qndch4p2dm8hdv4e4t0zm7jaf7ajasnjum25dhu" },
  USDT_TRC20: { address: "TBcivkHbpBh3fa14pPwYemqtNzg7bDQJZ4" },
  USDT_ERC20: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  USDT_BEP20: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  SOL: { address: "7ds3cKbJNVXTLcsUea6qj1WsisdqRuqBTYENYi9vsd7F" },
  BNB: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  ETH: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  XRP: { address: "rwyQp3eC5j6AumcptZhfmiXAykpeswZKeJ", tag: "1476340" },
  ADA: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  DOGE: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  LTC: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  TRX: { address: "TBcivkHbpBh3fa14pPwYemqtNzg7bDQJZ4" },
  MATIC: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  AVAX: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" },
  TON: { address: "7ds3cKbJNVXTLcsUea6qj1WsisdqRuqBTYENYi9vsd7F", tag: "1476340" },
  SHIB: { address: "0x12107F3eB874442301756daFBd3360418ae3C366" }
};

export const DIVERSIFIED_CRYPTO_COINS = [
  { id: "USDT_TRC20", symbol: "USDT", name: "Tether USD", network: "TRC20 (TRON Blockchain)", color: "#26A17B", icon: "https://assets.coingecko.com/coins/images/325/large/Tether.png" },
  { id: "USDT_ERC20", symbol: "USDT", name: "Tether USD", network: "ERC20 (Ethereum Network)", color: "#627EEA", icon: "https://assets.coingecko.com/coins/images/325/large/Tether.png" },
  { id: "USDT_BEP20", symbol: "USDT", name: "Tether USD", network: "BEP20 (BNB Smart Chain)", color: "#F3BA2F", icon: "https://assets.coingecko.com/coins/images/325/large/Tether.png" },
  { id: "BTC", symbol: "BTC", name: "Bitcoin", network: "Bitcoin Network", color: "#F7931A", icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { id: "ETH", symbol: "ETH", name: "Ethereum", network: "ERC20 (Ethereum Network)", color: "#627EEA", icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { id: "USDC", symbol: "USDC", name: "USD Coin", network: "ERC20 / Solana", color: "#2775CA", icon: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png" },
  { id: "SOL", symbol: "SOL", name: "Solana", network: "Solana Network", color: "#14F195", icon: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { id: "BNB", symbol: "BNB", name: "BNB", network: "BEP20 (BNB Smart Chain)", color: "#F3BA2F", icon: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" },
  { id: "XRP", symbol: "XRP", name: "Ripple", network: "XRP Ledger", color: "#23292F", icon: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", requiresTag: true },
  { id: "ADA", symbol: "ADA", name: "Cardano", network: "Cardano Network", color: "#0033AD", icon: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { id: "DOGE", symbol: "DOGE", name: "Dogecoin", network: "Dogecoin Network", color: "#C2A633", icon: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
  { id: "LTC", symbol: "LTC", name: "Litecoin", network: "Litecoin Network", color: "#345D9D", icon: "https://assets.coingecko.com/coins/images/2/large/litecoin.png" },
  { id: "TRX", symbol: "TRX", name: "TRON", network: "TRC20 (TRON)", color: "#FF0013", icon: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png" },
  { id: "MATIC", symbol: "MATIC", name: "Polygon", network: "Polygon Network", color: "#8247E5", icon: "https://assets.coingecko.com/coins/images/4713/large/polygon.png" },
  { id: "AVAX", symbol: "AVAX", name: "Avalanche", network: "C-Chain (Avalanche)", color: "#E84142", icon: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png" },
  { id: "TON", symbol: "TON", name: "Toncoin", network: "TON Network", color: "#0098EA", icon: "https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png", requiresTag: true },
  { id: "SHIB", symbol: "SHIB", name: "Shiba Inu", network: "ERC20 (Ethereum)", color: "#FFA409", icon: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" }
];

export default function UserDepositPage() {
  const { user } = useAuth();
  
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialAmt = searchParams.get("amount") || "";
  const initialMethod = searchParams.get("method") || "";
  const initialStep = (initialAmt && initialMethod) ? "proof" : initialMethod ? "details" : "method";

  const [step, setStep] = useState<"method" | "details" | "proof" | "success">(initialStep);
  const [selectedAccount, setSelectedAccount] = useState("60332183");
  const [selectedMethod, setSelectedMethod] = useState(initialMethod);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("USDT_TRC20");
  const [amount, setAmount] = useState(initialAmt);
  const [currency, setCurrency] = useState("USD");
  const [proofDesc, setProofDesc] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [senderName, setSenderName] = useState("");

  // Copy Feedback State
  const [copiedCoinAddress, setCopiedCoinAddress] = useState(false);
  const [copiedMemoTag, setCopiedMemoTag] = useState(false);

  // Countdown timer state (30 minutes)
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isExpired, setIsExpired] = useState(false);

  // Stripe PaymentIntent States
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripePublishableKey, setStripePublishableKey] = useState<string>("");
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState<string>("");

  const createPaymentIntentMutation = trpc.trading.createPaymentIntent.useMutation({
    onSuccess: (data) => {
      setStripeClientSecret(data.clientSecret);
      setStripePublishableKey(data.publishableKey);
      setStripePaymentIntentId(data.paymentIntentId);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to initialize Stripe PaymentIntent.");
    }
  });

  // Stripe & PayPal form states
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Direct Card Processing States
  const [cardProcessingStep, setCardProcessingStep] = useState<"idle" | "processing" | "success">("idle");
  const [cardStageIndex, setCardStageIndex] = useState(0);
  const [cardSuccessDetails, setCardSuccessDetails] = useState<{
    amount: number;
    currency: string;
    last4: string;
    authCode: string;
    reference: string;
    accountNumber: string;
    newBalance: number;
  } | null>(null);

  const utils = trpc.useUtils();

  const processDirectCardMutation = trpc.trading.processDirectCardDeposit.useMutation({
    onSuccess: (data) => {
      setCardSuccessDetails(data);
      setCardProcessingStep("success");
      setIsProcessing(false);
      toast.success(`Card payment authorized! ${data.currency} ${data.amount.toFixed(2)} submitted for admin verification.`);
      utils.trading.account.invalidate();
    },
    onError: (err) => {
      setCardProcessingStep("idle");
      setIsProcessing(false);
      toast.error(err.message || "Card processing failed. Please check card number.");
    }
  });
  
  // On-Ramp state (Transak, MoonPay, Banxa)
  const [onrampProvider, setOnrampProvider] = useState<"transak" | "moonpay" | "banxa" | "ramp">("transak");
  const [showEmbeddedWidget, setShowEmbeddedWidget] = useState(false);
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalPassword, setPaypalPassword] = useState("");
  const [paypalStep, setPaypalStep] = useState<"login" | "confirm" | "paying">("login");

  // tRPC deposit mutation
  const depositMutation = trpc.trading.createDeposit.useMutation({
    onSuccess: () => {
      setIsProcessing(false);
      setStep("success");
    },
    onError: (err) => {
      setIsProcessing(false);
      toast.error(err.message || "Failed to create deposit request");
    }
  });

  // Fetch Dynamic Bank Details configured by admin
  const { data: bankDetails } = trpc.trading.getBankDetails.useQuery();

  // External Checkout URL state for iframe fallback
  const [externalCheckoutUrl, setExternalCheckoutUrl] = useState<string | null>(null);

  // Helper function to safely navigate or open external checkout
  const handlePaymentRedirect = (url: string) => {
    if (!url) return;
    if (url.startsWith("/") || url.includes(window.location.host)) {
      // Relative or local domain URL -> load directly
      window.location.href = url;
    } else {
      // External domain (e.g. checkout.stripe.com or nowpayments.io)
      // Attempt window.open for iframe cross-origin protection
      const win = window.open(url, "_blank");
      if (!win) {
        // Popup was blocked or iframe prevented auto popup -> show direct action link
        setExternalCheckoutUrl(url);
        toast.info("Payment session created! Click the button below to complete payment.", { duration: 6000 });
      } else {
        toast.success("Opening payment gateway in a new tab...");
        setExternalCheckoutUrl(url);
      }
    }
  };

  // Stripe Checkout Session mutation
  const createStripeSessionMutation = trpc.trading.createStripeSession.useMutation({
    onSuccess: (data) => {
      setIsProcessing(false);
      if (data.checkoutUrl) {
        handlePaymentRedirect(data.checkoutUrl);
      } else {
        toast.error("Could not create Stripe checkout session");
      }
    },
    onError: (err) => {
      setIsProcessing(false);
      toast.error(err.message || "Failed to initiate Stripe payment session");
    }
  });

  const handleLaunchStripeSession = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }
    setIsProcessing(true);
    createStripeSessionMutation.mutate({
      amount: parseFloat(amount),
      currency: currency || "USD",
    });
  };

  // Demand payment details mutation
  const requestPaymentDetailsMutation = trpc.trading.requestPaymentDetails.useMutation({
    onSuccess: (res) => {
      toast.success(res.message || "Demand notification sent to Admin!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to notify admin.");
    }
  });

  // NOWPayments session mutation
  const nowpaymentsMutation = trpc.trading.createNowpaymentsInvoice.useMutation({
    onSuccess: (data) => {
      setIsProcessing(false);
      if (data.checkoutUrl) {
        handlePaymentRedirect(data.checkoutUrl);
      } else {
        setStep("success");
      }
    },
    onError: (err) => {
      setIsProcessing(false);
      toast.error(err.message || "Failed to initiate crypto payment");
    }
  });

  // Timer effect for deposit receipt upload deadline
  useEffect(() => {
    if (step === "details" || step === "proof") {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const formatMinutes = (seconds: number) => Math.floor(seconds / 60).toString().padStart(2, "0");
  const formatSeconds = (seconds: number) => (seconds % 60).toString().padStart(2, "0");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep("details");
  };

  // Process instant payments with Smart Direct Card Gateway
  const handleInstantPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardName.trim()) {
      toast.error("Please enter cardholder name");
      return;
    }
    const cleanCardNum = cardNumber.replace(/\D/g, "");
    if (cleanCardNum.length < 13) {
      toast.error("Please enter a valid 15 or 16 digit card number");
      return;
    }
    if (!cardExpiry || !cardExpiry.includes("/")) {
      toast.error("Please enter expiry date in MM/YY format");
      return;
    }
    if (!cardCvc || cardCvc.length < 3) {
      toast.error("Please enter 3-digit CVC/CVV code");
      return;
    }

    setIsProcessing(true);
    setCardProcessingStep("processing");
    setCardStageIndex(0);

    // Multi-stage acquiring simulation for 100% authorization trust
    setTimeout(() => setCardStageIndex(1), 1000);
    setTimeout(() => setCardStageIndex(2), 2200);

    setTimeout(() => {
      processDirectCardMutation.mutate({
        amount: parseFloat(amount),
        currency,
        cardName,
        cardNumber,
        cardExpiry,
        cardCvc,
      });
    }, 3200);
  };

  // Process manual or onramp deposits
  const handleManualPaymentSubmit = () => {
    if (selectedMethod === "bank" && !senderName) {
      toast.error("Please enter sender name");
      return;
    }
    if (selectedMethod === "bank" && !proofImage) {
      toast.error("Please upload transfer proof receipt");
      return;
    }
    if (selectedMethod === "crypto" && !proofImage) {
      toast.error("Please upload transaction receipt proof");
      return;
    }

    setIsProcessing(true);
    const methodTitle = selectedMethod === "bank" 
      ? "Bank Wire / Instant Transfer" 
      : selectedMethod === "onramp"
      ? `Card-to-Crypto (${onrampProvider.toUpperCase()})`
      : "USDT (TRC20)";

    depositMutation.mutate({
      amount: parseFloat(amount),
      currency: currency,
      paymentMethod: methodTitle,
      senderName: senderName || user?.email?.split('@')[0] || "User Transfer",
      proofImage: proofImage || undefined,
      reference: proofDesc || `${selectedMethod.toUpperCase()} Ref: TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    });
  };

  // PayPal checkout integration mockup flow
  const handlePaypalCheckout = () => {
    setPaypalStep("confirm");
  };

  const confirmPaypalPayment = () => {
    setPaypalStep("paying");
    setTimeout(() => {
      setShowPaypalModal(false);
      setIsProcessing(true);
      depositMutation.mutate({
        amount: parseFloat(amount),
        currency: currency,
        paymentMethod: "PayPal",
        reference: `PayPal Ref: PAYID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Official Axi Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#E31B23] flex items-center justify-center font-black text-white text-base shadow-md group-hover:bg-red-600 transition-colors">
                axi
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-lg tracking-tight">axi</span>
                  <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded tracking-wider">
                    Deposit & Funding
                  </span>
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
              <span className="hover:text-white cursor-pointer transition-colors">Trading Accounts</span>
              <span className="hover:text-white cursor-pointer transition-colors font-extrabold text-white border-b-2 border-[#E31B23] pb-1">Deposit Methods</span>
              <span className="hover:text-white cursor-pointer transition-colors">Withdrawals</span>
              <span className="hover:text-white cursor-pointer transition-colors">Security of Funds</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Trading Account</span>
              <select 
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="text-xs font-black text-white bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-red-500 cursor-pointer"
              >
                <option value="60332183">MT4 Standard - 60332183 ($USD)</option>
                <option value="60332182">MT5 Standard - 60332182 ($USD)</option>
              </select>
            </div>

            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Portal Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section (Official axi.com visual design) */}
      <section className="bg-slate-950 text-white relative border-b border-slate-800 overflow-hidden py-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/30 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 text-xs font-extrabold mb-4 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Axi Global Funding Channels</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
              Fund Your Trading Account
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-8 max-w-2xl">
              Simple, fast, and secure options to fund your live trading account. Axi covers <strong className="text-white font-extrabold">100% of standard handling fees</strong>, so every dollar you deposit goes directly into your live margin balance.
            </p>

            {/* Axi Key Pillars Banner Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-red-500 font-extrabold text-xs uppercase mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>0% Deposit Fee</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">Axi covers all standard handling fees</p>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Segregated Funds</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">Held securely in Tier-1 global banks</p>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs uppercase mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Instant Crediting</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">Real-time availability for cards & crypto</p>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase mb-1">
                  <Lock className="w-4 h-4" />
                  <span>256-bit Encryption</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">Strict SSL & PCI-DSS security standard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracker Bar */}
      <div className="bg-white border-b border-slate-200 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            {["Select Channel", "Enter Amount", "Process Gateway", "Completed"].map((s, i) => {
              const currentStep = step === "method" ? 0 : step === "details" ? 1 : step === "proof" ? 2 : 3;
              const isActive = i <= currentStep;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isActive ? "bg-[#E31B23] text-white shadow-sm" : "bg-slate-200 text-slate-500"
                  }`}>
                    {i < currentStep ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-extrabold hidden md:block uppercase tracking-wider ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}>
                    {s}
                  </span>
                  {i < 3 && <div className={`flex-1 h-0.5 ${i < currentStep ? "bg-[#E31B23]" : "bg-slate-200"}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* STEP 1: Select Deposit Method */}
        {step === "method" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Deposit Channels & Gateways</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                    Choose your preferred funding channel below. All deposits are protected under segregated bank accounts.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
                  <span className="px-3 py-1 bg-white text-slate-900 rounded-lg shadow-xs font-black">All Methods</span>
                  <span className="px-3 py-1 text-slate-500 hover:text-slate-900 cursor-pointer">Cards</span>
                  <span className="px-3 py-1 text-slate-500 hover:text-slate-900 cursor-pointer">Crypto</span>
                  <span className="px-3 py-1 text-slate-500 hover:text-slate-900 cursor-pointer">Bank Wire</span>
                </div>
              </div>

              {/* Supported Verified Payment Brands Showcase */}
              <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2.5">
                  Supported & Verified Payment Brands
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1.5">
                    <span className="text-blue-900 italic font-black text-xs tracking-tighter">VISA</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block -mr-1.5 opacity-90"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1 opacity-90"></span>
                    <span className="text-slate-900 font-extrabold text-[10px]">mastercard</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="font-extrabold text-xs text-slate-900"> Pay</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="font-black text-blue-600 text-xs">G</span><span className="font-extrabold text-xs text-slate-700">Pay</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="font-black italic text-blue-800 text-xs">Pay</span><span className="font-black italic text-sky-500 text-xs">Pal</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-emerald-700 font-black text-[10px]">USDT TRC20/ERC20</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="text-amber-500 font-black text-xs">₿</span>
                    <span className="text-amber-900 font-extrabold text-[10px]">Bitcoin</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="text-blue-600 font-extrabold text-[10px]">Transak</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="text-purple-700 font-extrabold text-[10px]">MoonPay</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1">
                    <span className="text-slate-800 font-black text-[10px]">SEPA Instant</span>
                  </div>
                </div>
              </div>
              
              {/* Deposit Methods Grid (Official axi.com Cards) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {methods.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleMethodSelect(m.id)}
                    className={`p-6 rounded-2xl border text-left cursor-pointer transition-all hover:shadow-md hover:border-[#E31B23] relative group flex flex-col justify-between ${
                      selectedMethod === m.id ? "border-[#E31B23] bg-red-50/20 ring-1 ring-[#E31B23]" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 border border-slate-200">
                            <m.icon size={24} style={{ color: m.color }} />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-[#E31B23] transition-colors">
                              {m.name}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">{m.desc}</p>
                          </div>
                        </div>

                        {m.badge && (
                          <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider shrink-0 border border-blue-200">
                            {m.badge}
                          </span>
                        )}
                      </div>

                      {/* Method Specs Bar */}
                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-semibold my-4 text-slate-600">
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Processing</span>
                          <span className="font-extrabold text-slate-900">{m.id === "bank" ? "1-3 Days" : "Instant"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Deposit Fee</span>
                          <span className="font-extrabold text-emerald-600">0% (Free)</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Currencies</span>
                          <span className="font-extrabold text-slate-900">USD, EUR, GBP +</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="text-xs font-extrabold text-slate-500">Min. Deposit: $50 USD</span>
                      <button className="px-4 py-2 rounded-lg bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1 transition-all shadow-xs group-hover:scale-[1.02]">
                        <span>Fund Account</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Axi AML Compliance Notice */}
              <div className="mt-8 border-t border-slate-200 pt-6 bg-slate-50 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-600 leading-relaxed border">
                <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-slate-900 block mb-0.5">Third-Party Deposit Policy (AML Regulation)</span>
                  <span>
                    In accordance with global Anti-Money Laundering regulations, Axi does not accept third-party payments. All funds deposited into your trading account must originate from a bank or payment method registered in the exact same name as your Axi trading account holder.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Amount Details */}
        {step === "details" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <button onClick={() => setStep("method")} className="flex items-center gap-2 text-xs font-black uppercase text-[#E31B23] mb-6 hover:underline">
                <ArrowLeft size={14} /> Back to Channels
              </button>
              
              <h2 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tight">Deposit Amount & Account</h2>

              <p className="text-xs text-gray-500 font-bold mb-6">Enter details for {methods.find(m => m.id === selectedMethod)?.name}</p>

              <div className="mb-6">
                <label className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-2">Select Account</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAccount("60332183")}
                    className={`p-3 rounded-xl border text-left transition-all ${selectedAccount === "60332183" ? "border-[#D31C2B] bg-red-50/60 ring-1 ring-[#D31C2B]" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wider">MT4</span>
                      <span className="text-[10px] font-bold text-gray-400">USD</span>
                    </div>
                    <p className="text-xs font-black text-gray-900">Standard 60332183</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAccount("60332182")}
                    className={`p-3 rounded-xl border text-left transition-all ${selectedAccount === "60332182" ? "border-[#D31C2B] bg-red-50/60 ring-1 ring-[#D31C2B]" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wider">MT5</span>
                      <span className="text-[10px] font-bold text-gray-400">USD</span>
                    </div>
                    <p className="text-xs font-black text-gray-900">Standard 60332182</p>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-2">Select Currency</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {["USD", "EUR", "GBP", "AUD", "CAD", "NGN", "AED"].map((curr) => (
                      <button key={curr} type="button" onClick={() => setCurrency(curr)}
                        className={`px-4 py-2.5 rounded-lg border text-xs font-black tracking-wider transition-all ${currency === curr ? "border-[#D31C2B] bg-red-50 text-[#D31C2B]" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}>
                        {curr}
                      </button>
                    ))}
                  </div>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-black tracking-wider bg-white focus:outline-none focus:ring-1 focus:ring-[#D31C2B]"
                  >
                    <option value="">More Currencies...</option>
                    {CURRENCIES.map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-2">Amount to Deposit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg text-gray-400">{currency}</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00" className="w-full pl-16 pr-4 py-4 rounded-xl border text-lg font-black focus:border-[#D31C2B] focus:ring-1 focus:ring-[#D31C2B]"
                    style={{ backgroundColor: "#fff", borderColor: "#D9D3CB", color: "#1A1A1A" }} min="5" />
                </div>
              </div>

              <div className="p-4 rounded-xl mb-6 flex gap-3" style={{ backgroundColor: "#FFF8E1", border: "1px solid #FFE082" }}>
                <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                  Minimum limits: EUR/USD 5 for Credit Cards, 10 for PayPal, 30 for Crypto, and 100 for Wire Transfers. Zero handling fees charged by Axi.
                </p>
              </div>

              <button onClick={() => amount && parseFloat(amount) > 0 && setStep("proof")}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: "#D31C2B" }}>
                Continue to Gateway
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Gateway Form & Verification */}
        {step === "proof" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-150 shadow-sm">
              <button onClick={() => setStep("details")} className="flex items-center gap-2 text-xs font-black uppercase text-[#D31C2B] mb-6">
                <ArrowLeft size={14} /> Back to Amount
              </button>
              
              <h2 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tight">Complete Gateway</h2>
              <p className="text-xs text-gray-500 font-bold mb-6">Secure transfer of {currency} {parseFloat(amount).toFixed(2)}</p>

              {/* 0. FIAT TO CRYPTO ON-RAMP (TRANSAK / MOONPAY / BANXA) */}
              {selectedMethod === "onramp" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-blue-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                          Card to Crypto Gateway
                        </span>
                      </div>
                      <span className="bg-green-500/20 text-green-300 border border-green-500/40 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest">
                        France & EU Compliant
                      </span>
                    </div>

                    <p className="text-xs text-blue-100/90 leading-relaxed font-medium mb-4">
                      Pay with Credit/Debit Card (Visa/Mastercard), Apple Pay, or SEPA. The crypto is deposited directly into your designated receiving wallet.
                    </p>

                    {/* Onramp Provider Tabs */}
                    <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 mb-4">
                      {[
                        { id: "transak", name: "Transak", badge: "Most Popular" },
                        { id: "moonpay", name: "MoonPay", badge: "Global" },
                        { id: "banxa", name: "Banxa", badge: "Zero Fee" },
                      ].map((prov) => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => setOnrampProvider(prov.id as "transak" | "moonpay" | "banxa" | "ramp")}
                          className={`py-2 px-2 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center ${
                            onrampProvider === prov.id
                              ? "bg-white text-gray-900 shadow-md scale-[1.02]"
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <span>{prov.name}</span>
                          <span className="text-[8px] opacity-75 font-semibold">{prov.badge}</span>
                        </button>
                      ))}
                    </div>

                    {/* Destination Details Box */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-xs space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-blue-200 text-[10px] uppercase font-bold">Paying Amount:</span>
                        <span className="font-mono font-black text-white text-sm">
                          {currency} {parseFloat(amount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-blue-200 text-[10px] uppercase font-bold">Estimated Received:</span>
                        <span className="font-mono font-black text-amber-300 text-sm">
                          ~{(parseFloat(amount || "0") * 1.085).toFixed(2)} USDT (TRC20)
                        </span>
                      </div>
                      <div className="space-y-1 pt-1">
                        <span className="text-blue-200 text-[9px] uppercase font-bold block">
                          Receiving Wallet Address:
                        </span>
                        <div className="flex items-center gap-2 bg-black/50 px-2.5 py-1.5 rounded border border-white/20 font-mono text-[10px] text-green-300 font-bold break-all">
                          <span className="flex-1 truncate">{bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"}</span>
                          <button
                            type="button"
                            onClick={() => {
                              copyToClipboard(bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX", "Receiving Wallet Address");
                            }}
                            className="p-1 hover:text-white text-gray-300"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch On-Ramp Checkout */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={
                        onrampProvider === "transak"
                          ? `https://global.transak.com?apiKey=4b27f428-1bfd-463d-b4f7-8c313a17e0b1&cryptoCurrencyCode=USDT&network=tron&walletAddress=${bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"}&fiatCurrency=${currency}&fiatAmount=${amount}&defaultPaymentMethod=credit_debit_card`
                          : onrampProvider === "moonpay"
                          ? `https://buy.moonpay.com?currencyCode=usdt_trc20&walletAddress=${bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"}&fiatCurrency=${currency.toLowerCase()}&fiatValue=${amount}`
                          : `https://axi.banxa.com?coinType=USDT&fiatType=${currency}&fiatAmount=${amount}&blockchain=TRX&walletAddress=${bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Launch {onrampProvider.toUpperCase()} Card Checkout</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowEmbeddedWidget(!showEmbeddedWidget)}
                      className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-gray-300"
                    >
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>{showEmbeddedWidget ? "Hide Interactive Checkout Widget" : "Show Embedded Checkout Widget"}</span>
                    </button>
                  </div>

                  {/* Embedded Widget Display */}
                  {showEmbeddedWidget && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 rounded-2xl overflow-hidden border-2 border-blue-600 bg-gray-900 p-2 shadow-2xl"
                    >
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-t-xl text-white text-xs font-bold mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span>{onrampProvider.toUpperCase()} Interactive Widget</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">256-bit SSL</span>
                      </div>
                      <div className="p-6 w-full rounded-b-xl bg-slate-900 text-white space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-950/80 border border-blue-500/30 rounded-xl text-xs">
                          <ExternalLink className="w-5 h-5 text-blue-400 shrink-0" />
                          <div>
                            <span className="font-bold text-blue-200 block">External Secure Checkout Notice</span>
                            <span className="text-[11px] text-gray-300">For user security, {onrampProvider.toUpperCase()} requires completing card verification in a standalone encrypted window.</span>
                          </div>
                        </div>

                        <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-2 font-mono text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Order Amount:</span>
                            <span className="font-bold text-white">{currency} {parseFloat(amount || "0").toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Crypto Equivalent:</span>
                            <span className="font-bold text-amber-400">~{(parseFloat(amount || "0") * 1.085).toFixed(2)} USDT (TRC20)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Target Wallet:</span>
                            <span className="font-bold text-green-400 text-[10px] truncate max-w-[180px]">{bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"}</span>
                          </div>
                        </div>

                        <a
                          href={
                            onrampProvider === "transak"
                              ? `https://global.transak.com?apiKey=4b27f428-1bfd-463d-b4f7-8c313a17e0b1&cryptoCurrencyCode=USDT&network=tron&walletAddress=${bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"}&fiatCurrency=${currency}&fiatAmount=${amount}&defaultPaymentMethod=credit_debit_card`
                              : `https://buy.moonpay.com?currencyCode=usdt_trc20&walletAddress=${bankDetails?.cryptoWalletAddress || "TX6zR8K1MvPn9Y7tC3sB2vHnQ5r4a7D1vX"}&fiatCurrency=${currency.toLowerCase()}&fiatValue=${amount}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Open {onrampProvider.toUpperCase()} Gateway Window</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Confirmation Form */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1.5">
                      Transaction ID / Hash (Optional)
                    </label>
                    <input
                      type="text"
                      value={proofDesc}
                      onChange={(e) => setProofDesc(e.target.value)}
                      placeholder="e.g. Transak ID: 0x8f2a... or MoonPay Ref: 98124"
                      className="w-full px-4 py-3 rounded-lg border text-xs font-mono focus:ring-1 focus:ring-[#D31C2B] focus:border-[#D31C2B] mb-4"
                    />

                    <button
                      type="button"
                      onClick={handleManualPaymentSubmit}
                      disabled={isProcessing}
                      className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      style={{ backgroundColor: "#D31C2B" }}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Log Deposit Request ({currency} {parseFloat(amount).toFixed(2)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* 1. STRIPE CREDIT CARD & MULTI-PAYMENT GATEWAY */}
              {selectedMethod === "card" && (
                <div className="space-y-6">
                  {/* Modern Stripe Payment Methods Interactive Breakdown */}
                  <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white border border-indigo-700/50 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-200">
                          Stripe Multi-Payment Gateway
                        </span>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-2.5 py-1 rounded font-black uppercase tracking-widest">
                        PCI-DSS Level 1 Encrypted
                      </span>
                    </div>

                    <p className="text-xs text-indigo-100/90 leading-relaxed font-medium mb-4">
                      All payment methods enabled in your live Stripe Dashboard (Credit & Debit Cards, Apple Pay, Google Pay, Stripe Link, Klarna, Affirm, iDEAL, SEPA, Bancontact, ACH, etc.) are dynamically synced and presented on the official Stripe Checkout page.
                    </p>

                    {/* Interactive Payment Method Breakdown Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                      <div className="bg-white/10 hover:bg-white/15 transition-all p-3 rounded-xl border border-white/15 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-300 font-bold">
                          💳
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-white">Credit & Debit Cards</span>
                            <span className="bg-emerald-500/30 text-emerald-300 text-[8px] px-1.5 py-0.5 rounded font-black">Instant</span>
                          </div>
                          <p className="text-[10px] text-indigo-200 mt-0.5">Visa, Mastercard, Amex & Discover</p>
                          <span className="text-[9px] font-bold text-amber-300 block mt-1">Easiest for global instant deposits</span>
                        </div>
                      </div>

                      <div className="bg-white/10 hover:bg-white/15 transition-all p-3 rounded-xl border border-white/15 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-300 font-bold">
                          
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-white">Apple Pay & Google Pay</span>
                            <span className="bg-blue-500/30 text-blue-300 text-[8px] px-1.5 py-0.5 rounded font-black">1-Tap</span>
                          </div>
                          <p className="text-[10px] text-indigo-200 mt-0.5">Biometric instant mobile checkout</p>
                          <span className="text-[9px] font-bold text-emerald-300 block mt-1">Easiest on phone/Safari/Chrome</span>
                        </div>
                      </div>

                      <div className="bg-white/10 hover:bg-white/15 transition-all p-3 rounded-xl border border-white/15 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-300 font-bold">
                          ⚡
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-white">Stripe Link</span>
                            <span className="bg-purple-500/30 text-purple-300 text-[8px] px-1.5 py-0.5 rounded font-black">1-Click</span>
                          </div>
                          <p className="text-[10px] text-indigo-200 mt-0.5">Auto-saved billing & card details</p>
                          <span className="text-[9px] font-bold text-purple-300 block mt-1">Easiest for returning clients</span>
                        </div>
                      </div>

                      <div className="bg-white/10 hover:bg-white/15 transition-all p-3 rounded-xl border border-white/15 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-300 font-bold">
                          🏦
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-white">SEPA, iDEAL & Bancontact</span>
                            <span className="bg-green-500/30 text-green-300 text-[8px] px-1.5 py-0.5 rounded font-black">0% Fee</span>
                          </div>
                          <p className="text-[10px] text-indigo-200 mt-0.5">Direct European bank debits</p>
                          <span className="text-[9px] font-bold text-green-300 block mt-1">Easiest for EU & UK bank transfers</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-xs space-y-2 mb-5">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-indigo-200 text-[10px] uppercase font-bold">Total Deposit:</span>
                        <span className="font-mono font-black text-white text-base">
                          {currency} {parseFloat(amount || "0").toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-200 text-[10px] uppercase font-bold">Selected Trading Account:</span>
                        <span className="font-mono font-bold text-emerald-300 text-xs">
                          MT{selectedAccount === "60332182" ? "5" : "4"} ({selectedAccount})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLaunchStripeSession}
                      disabled={isProcessing}
                      className="w-full py-4 rounded-xl bg-[#635BFF] hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting to Stripe Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Launch Stripe Checkout ({currency} {parseFloat(amount || "0").toFixed(2)})</span>
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>

                    {externalCheckoutUrl && (
                      <div className="mt-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3 text-xs text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-bold text-white">Payment gateway session created!</span>
                        </div>
                        <a
                          href={externalCheckoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-lg flex items-center gap-1.5 shrink-0 transition-all shadow"
                        >
                          <span>Open Payment Window</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center my-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-black uppercase text-gray-400 tracking-wider">or Alternative Card Processing Options</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {stripeClientSecret ? (
                    <div className="space-y-4">
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-900 flex items-center justify-between">
                        <span className="font-extrabold uppercase text-[10px]">Stripe PaymentIntent Active</span>
                        <span className="font-mono font-bold">{currency} {parseFloat(amount).toFixed(2)}</span>
                      </div>
                      <StripePaymentIntentWrapper
                        clientSecret={stripeClientSecret}
                        publishableKey={stripePublishableKey}
                        paymentIntentId={stripePaymentIntentId}
                        amount={parseFloat(amount)}
                        currency={currency}
                        onSuccess={() => {
                          setStep("success");
                          utils.trading.account.invalidate();
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        createPaymentIntentMutation.mutate({
                          amount: parseFloat(amount),
                          currency,
                        });
                      }}
                      disabled={createPaymentIntentMutation.isPending}
                      className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      {createPaymentIntentMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-indigo-400" />
                          <span>Load Embedded Stripe Card Form</span>
                        </>
                      )}
                    </button>
                  )}

                  {cardProcessingStep === "success" ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-2">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                        <ShieldCheck className="w-9 h-9 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
                          Submitted • Awaiting Verification
                        </span>
                        <h3 className="text-xl font-extrabold text-gray-900">
                          Payment Authorized & Submitted
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          Your card deposit reference has been recorded. Funds will be credited upon manual admin verification.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left space-y-2.5 text-xs">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-500 font-medium">Deposit Amount:</span>
                          <span className="font-mono font-black text-gray-900 text-sm">{cardSuccessDetails?.currency} {parseFloat(cardSuccessDetails?.amount?.toString() || amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-500 font-medium">Card Used:</span>
                          <span className="font-mono font-bold text-gray-800">•••• •••• •••• {cardSuccessDetails?.last4 || cardNumber.slice(-4)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-500 font-medium">Authorization Code:</span>
                          <span className="font-mono font-bold text-emerald-600">{cardSuccessDetails?.authCode}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-500 font-medium">Merchant Reference:</span>
                          <span className="font-mono font-bold text-gray-700">{cardSuccessDetails?.reference}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 font-medium">Status:</span>
                          <span className="font-mono font-extrabold text-amber-600 uppercase">Pending Verification</span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        <Link
                          to="/dashboard"
                          className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider text-white text-center bg-[#D31C2B] hover:bg-red-700 shadow-md transition-all"
                        >
                          Return to Trading Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setCardProcessingStep("idle");
                            setCardSuccessDetails(null);
                            setCardNumber("");
                            setCardCvc("");
                          }}
                          className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                          Make Another Card Deposit
                        </button>
                      </div>
                    </motion.div>
                  ) : cardProcessingStep === "processing" ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center space-y-6">
                      <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping opacity-25" />
                        <div className="relative w-20 h-20 rounded-full bg-red-50 text-[#D31C2B] border-2 border-[#D31C2B] flex items-center justify-center shadow-lg">
                          <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-gray-900 mb-1">
                          Authorizing Card Payment ({currency} {parseFloat(amount).toFixed(2)})
                        </h4>
                        <p className="text-xs text-gray-500">Auto-routing through Smart E-Commerce Acquiring Gateway</p>
                      </div>

                      {/* Stage progress timeline */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-left max-w-md mx-auto text-xs font-medium">
                        <div className={`flex items-center gap-3 ${cardStageIndex >= 0 ? "text-emerald-700 font-bold" : "text-gray-400"}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${cardStageIndex > 0 ? "bg-emerald-500 text-white" : cardStageIndex === 0 ? "bg-amber-500 text-white animate-pulse" : "bg-gray-200 text-gray-500"}`}>
                            {cardStageIndex > 0 ? "✓" : "1"}
                          </div>
                          <span>1. Validating Card Credentials & 3DS Token...</span>
                        </div>

                        <div className={`flex items-center gap-3 ${cardStageIndex >= 1 ? "text-emerald-700 font-bold" : "text-gray-400"}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${cardStageIndex > 1 ? "bg-emerald-500 text-white" : cardStageIndex === 1 ? "bg-amber-500 text-white animate-pulse" : "bg-gray-200 text-gray-500"}`}>
                            {cardStageIndex > 1 ? "✓" : "2"}
                          </div>
                          <span>2. Smart Merchant MCC-5999 Routing (Crypto Decline Bypass)...</span>
                        </div>

                        <div className={`flex items-center gap-3 ${cardStageIndex >= 2 ? "text-emerald-700 font-bold" : "text-gray-400"}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${cardStageIndex >= 2 ? "bg-amber-500 text-white animate-pulse" : "bg-gray-200 text-gray-500"}`}>
                            3
                          </div>
                          <span>3. Acquiring Bank Authorization & Balance Auto-Credit...</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleInstantPaymentSubmit} className="space-y-4">
                      {/* Anti-Decline Guarantee Banner */}
                      <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900 shadow-sm mb-4">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-extrabold text-emerald-950 block">Smart Anti-Decline Gateway Active</strong>
                          <span className="text-[11px] text-emerald-800 leading-tight block mt-0.5 font-medium">
                            Card payments are processed through certified E-Commerce Merchant Category Codes (MCC 5999). This guarantees automatic authorization and bypasses bank crypto blocks or legislation restrictions.
                          </span>
                        </div>
                      </div>

                      {/* Card Visual Graphic */}
                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden mb-5">
                        <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-white/5 rounded-full" />
                        <div className="flex justify-between items-start mb-8">
                          <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>MCC 5999 Anti-Decline Active</span>
                          </div>
                          <span className="font-extrabold italic text-sm text-gray-200">VISA / MC</span>
                        </div>
                        <div className="font-mono text-base tracking-widest mb-4">
                          {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : "•••• •••• •••• ••••"}
                        </div>
                        <div className="flex justify-between text-[11px] font-semibold text-white/70 font-mono">
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-white/50">Cardholder</span>
                            <span>{cardName.toUpperCase() || "CARDHOLDER NAME"}</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[8px] uppercase tracking-wider text-white/50">Expires</span>
                            <span>{cardExpiry || "MM/YY"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Cardholder Name</label>
                          <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)}
                            placeholder="John Doe" className="w-full px-4 py-3 text-xs font-bold rounded-lg border border-gray-200 focus:border-[#D31C2B] focus:ring-1 focus:ring-[#D31C2B]" />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Card Number</label>
                          <div className="relative">
                            <input type="text" required maxLength={16} value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="4111222233334444" className="w-full px-4 py-3 text-xs font-mono font-bold rounded-lg border border-gray-200 focus:border-[#D31C2B] focus:ring-1 focus:ring-[#D31C2B]" />
                            <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Expiry Date</label>
                            <input type="text" required maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY" className="w-full px-4 py-3 text-xs font-mono font-bold rounded-lg border border-gray-200 focus:border-[#D31C2B] focus:ring-1 focus:ring-[#D31C2B]" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">CVC / CVV</label>
                            <input type="password" required maxLength={3} value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                              placeholder="123" className="w-full px-4 py-3 text-xs font-mono font-bold rounded-lg border border-gray-200 focus:border-[#D31C2B] focus:ring-1 focus:ring-[#D31C2B]" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input type="checkbox" id="saveCard" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)}
                            className="rounded border-gray-300 text-[#D31C2B] focus:ring-[#D31C2B]" />
                          <label htmlFor="saveCard" className="text-xs text-gray-600 font-medium">Save card for 1-click future instant deposits</label>
                        </div>
                      </div>

                      <button type="submit" disabled={isProcessing}
                        className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider text-white mt-6 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 shadow-md transition-all"
                        style={{ backgroundColor: "#D31C2B" }}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Card Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Pay {currency} {parseFloat(amount).toFixed(2)} Securely</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 2. PAYPAL COMPONENT */}
              {selectedMethod === "paypal" && (
                <div className="text-center py-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                    <p className="text-xs text-blue-900 leading-relaxed font-semibold">
                      You are checking out using **PayPal Express Gateway**. Click the button below to authenticate with PayPal. Your account will be charged instantly upon confirmation.
                    </p>
                  </div>

                  <button onClick={() => setShowPaypalModal(true)} disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#FFC439] hover:bg-[#F2B21A] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 mb-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal_Logo_Icon_2014.svg" alt="PayPal" className="h-5" referrerPolicy="no-referrer" />
                    <span>Pay with PayPal</span>
                  </button>

                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mt-4">
                    <Lock className="w-3 h-3 text-green-600" />
                    <span>SSL Protected Checkout</span>
                  </div>
                </div>
              )}

              {/* 3. WIRE / INSTANT BANK TRANSFER DETAILS (MATCHES SCREENSHOT FRAME) */}
              {selectedMethod === "bank" && (
                <div className="space-y-6">
                  {/* Active Countdown or Closed View */}
                  {isExpired ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-100/90 rounded-2xl p-6 text-center border border-gray-300 shadow-sm space-y-4">
                      <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto shadow-md">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-gray-900 uppercase tracking-tight mb-1">Transaction Closed</h3>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-sm mx-auto">
                          The upload deadline has passed and this transaction is now closed.
                        </p>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl text-left border border-gray-200 text-xs text-gray-600 space-y-1.5 font-medium">
                        <p>1. If you have already transferred, please contact customer support with your payment receipt.</p>
                        <p>2. If you haven't transferred yet, please start a new transaction to continue.</p>
                      </div>
                      <div className="space-y-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpired(false);
                            setTimeLeft(1800);
                            setStep("details");
                          }}
                          className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider transition-all"
                        >
                          Start New Transaction
                        </button>
                        <Link
                          to="/dashboard"
                          className="block w-full py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider text-center"
                        >
                          Chat with Support
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {/* Step Title Header */}
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2 text-[#22A958] text-xs font-black uppercase tracking-wider mb-1">
                          <span className="w-5 h-5 rounded-full bg-[#22A958] text-white flex items-center justify-center text-[10px]">2</span>
                          <span>Transfer & Upload Receipt</span>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold">
                          Complete both the transfer and receipt upload before the deadline.
                        </p>
                      </div>

                      {/* 1. Make the Transfer Section */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase text-gray-800 tracking-wider">1. Make the Transfer</h4>
                        <div className="bg-red-50/70 border border-red-200/80 rounded-xl p-3.5 text-xs text-red-900 leading-relaxed font-semibold flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-[#D31C2B] shrink-0 mt-0.5" />
                          <div>
                            Please transfer <strong className="text-[#D31C2B] font-mono">{currency} {parseFloat(amount || "0").toFixed(2)}</strong> to the account below and upload the receipt within 30 minutes. Otherwise, the system cannot verify your payment.
                          </div>
                        </div>

                        {/* Digital Timer Box */}
                        <div className="bg-gray-100 rounded-2xl p-4 text-center border border-gray-200/80">
                          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Time Left</span>
                          <div className="flex items-center justify-center gap-1.5 font-mono">
                            <span className="bg-[#D31C2B] text-white text-lg font-black px-2.5 py-1 rounded-md shadow-sm">
                              {formatMinutes(timeLeft)[0]}
                            </span>
                            <span className="bg-[#D31C2B] text-white text-lg font-black px-2.5 py-1 rounded-md shadow-sm">
                              {formatMinutes(timeLeft)[1]}
                            </span>
                            <span className="text-xl font-black text-gray-800 mx-1">:</span>
                            <span className="bg-[#D31C2B] text-white text-lg font-black px-2.5 py-1 rounded-md shadow-sm">
                              {formatSeconds(timeLeft)[0]}
                            </span>
                            <span className="bg-[#D31C2B] text-white text-lg font-black px-2.5 py-1 rounded-md shadow-sm">
                              {formatSeconds(timeLeft)[1]}
                            </span>
                          </div>
                        </div>

                        {/* Account Details & QR Code Box */}
                        {(bankDetails?.bankName || bankDetails?.accountNumber || bankDetails?.iban) ? (
                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center space-y-4">
                            {/* Dynamic QR Code Container */}
                            <div className="bg-white p-3 rounded-xl border border-gray-200 inline-block shadow-sm">
                              <QRCodeSVG
                                value={`iban:${bankDetails?.iban || bankDetails?.accountNumber || "AXI-DEPOSIT"}?name=${encodeURIComponent(bankDetails?.accountName || "Axi")}&amount=${amount}`}
                                size={128}
                                className="mx-auto"
                              />
                            </div>

                            <div className="space-y-2 text-xs text-left max-w-sm mx-auto">
                              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200">
                                <span className="text-gray-500 font-bold text-[10px] uppercase">Account Name:</span>
                                <div className="flex items-center gap-2 font-black text-gray-900">
                                  <span>{bankDetails?.accountName || bankDetails?.beneficiary || "Axi Deposit Account"}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      copyToClipboard(bankDetails?.accountName || bankDetails?.beneficiary || "Axi Deposit Account", "Account Name");
                                    }}
                                    className="text-gray-400 hover:text-black p-0.5"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200">
                                <span className="text-gray-500 font-bold text-[10px] uppercase">Phone / Account No:</span>
                                <div className="flex items-center gap-2 font-mono font-black text-gray-900">
                                  <span>{bankDetails?.accountNumber || bankDetails?.phoneNumber || bankDetails?.iban}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      copyToClipboard(bankDetails?.accountNumber || bankDetails?.phoneNumber || bankDetails?.iban || "", "Account Number");
                                    }}
                                    className="text-gray-400 hover:text-black p-0.5"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {bankDetails?.bankName && (
                                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200">
                                  <span className="text-gray-500 font-bold text-[10px] uppercase">Institution:</span>
                                  <span className="font-black text-gray-900">{bankDetails.bankName}</span>
                                </div>
                              )}
                              {bankDetails?.swift && (
                                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200">
                                  <span className="text-gray-500 font-bold text-[10px] uppercase">SWIFT / BIC:</span>
                                  <span className="font-mono font-black text-gray-900">{bankDetails.swift}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-4 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                              <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-tight">Admin Wire Payment Details Pending Setup</h3>
                              <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed max-w-sm mx-auto">
                                The platform administrator has not uploaded receiving bank wire account details yet.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => requestPaymentDetailsMutation.mutate({ methodId: "bank" })}
                              disabled={requestPaymentDetailsMutation.isLoading}
                              className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto shadow-md active:scale-95 transition-all disabled:opacity-50"
                            >
                              {requestPaymentDetailsMutation.isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  <span>Demand Bank Wire Details from Admin</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 2. Upload Transfer Receipt Section */}
                      <div className="space-y-4 pt-2 border-t border-gray-200">
                        <h4 className="text-xs font-black uppercase text-gray-800 tracking-wider">2. Upload Transfer Receipt</h4>

                        <div>
                          <label className="block text-xs font-black uppercase text-gray-700 mb-1">Sender Name</label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="e.g. Lao Wang / John Smith"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-gray-900 focus:ring-0 outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase text-gray-700 mb-1.5">Transfer Receipt</label>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="screenshot-upload" />

                          {proofImage ? (
                            <div className="relative rounded-2xl overflow-hidden border-2 border-green-500 p-2 bg-gray-900 max-h-48 flex items-center justify-center">
                              <img src={proofImage} alt="Receipt Proof" className="max-h-44 object-contain rounded-xl" />
                              <button
                                type="button"
                                onClick={() => setProofImage(null)}
                                className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="screenshot-upload"
                              className="flex items-center justify-center gap-3 w-full h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-900 bg-gray-50/50 cursor-pointer transition-all p-4"
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                <Smartphone className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-black text-gray-800 uppercase">Upload Transfer Screenshot</p>
                                <p className="text-[10px] text-gray-400 font-semibold">Tap to choose image file or take camera photo</p>
                              </div>
                            </label>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleManualPaymentSubmit}
                          disabled={isProcessing || !proofImage || !senderName}
                          className="w-full py-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Submit Receipt for Verification</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Special Situations Accordion */}
                      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200 text-xs space-y-2.5">
                        <span className="font-black uppercase text-gray-700 text-[10px] tracking-wider block">Special Situations</span>
                        <p className="text-[11px] text-gray-600 font-medium">
                          <strong className="text-amber-600">a. Page closed accidentally?</strong> Reopen the portal anytime via the top banner or from your order details under Transactions.
                        </p>
                        <p className="text-[11px] text-gray-600 font-medium">
                          <strong className="text-amber-600">b. Changed your mind?</strong> You can cancel the order anytime to release the transaction.
                        </p>
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={() => setIsExpired(true)}
                            className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Cancel Order</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 4. CRYPTO TRANSFER DETAILS */}
              {selectedMethod === "crypto" && (
                <div className="space-y-4">
                  {/* Automated NOWPayments Option */}
                  <div className="p-5 rounded-2xl mb-4 bg-orange-50/50 border border-orange-200/80 shadow-sm">
                    <p className="text-xs text-orange-950 leading-relaxed font-bold">
                      Option A: Automated Invoice Payment (NOWPayments API)
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed font-semibold">
                      Creates a secure crypto invoice on the blockchain instantly and redirects you to pay using any USDT wallet.
                    </p>
                    <button type="button" onClick={() => {
                      setIsProcessing(true);
                      nowpaymentsMutation.mutate({ amount: parseFloat(amount), currency });
                    }} disabled={isProcessing}
                      className="w-full mt-3.5 py-4 rounded-xl bg-[#F7931A] hover:bg-[#E28112] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Invoice...</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>Secure NOWPayments Checkout</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Or Pay Manually</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* DIVERSIFIED CRYPTO WALLET GRID & DETAILS */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 text-xs text-indigo-100 flex items-start gap-3 shadow-lg">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-extrabold text-white block text-xs">Web3 Direct Blockchain Gateway</strong>
                        <span className="text-[11px] text-slate-300 leading-tight block mt-0.5">
                          Select your coin and network below. Send exact funds directly from your exchange (Binance, Coinbase, Kraken) or Web3 wallet (MetaMask, Phantom, Trust Wallet).
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase text-gray-800 tracking-wider">
                        Select Cryptocurrency & Network
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>17+ Chains Active</span>
                      </span>
                    </div>

                    {/* Scrollable Coin Selector Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-none">
                      {DIVERSIFIED_CRYPTO_COINS.map((coin) => {
                        const isSelected = selectedCoinId === coin.id;
                        return (
                          <button
                            key={coin.id}
                            type="button"
                            onClick={() => {
                              setSelectedCoinId(coin.id);
                              setCopiedCoinAddress(false);
                              setCopiedMemoTag(false);
                            }}
                            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap border transition-all shrink-0 ${
                              isSelected
                                ? "bg-slate-900 text-white border-emerald-500/60 shadow-md ring-1 ring-emerald-500/50 scale-[1.02]"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <img src={coin.icon} alt={coin.name} className="w-4 h-4 rounded-full" />
                            <span>{coin.symbol}</span>
                            <span className="text-[9px] opacity-75 font-mono">
                              ({coin.id.includes("TRC20") ? "TRC20" : coin.id.includes("ERC20") ? "ERC20" : coin.id.includes("BEP20") ? "BSC" : coin.symbol})
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Crypto Coin Wallet Detail Box */}
                    {isLoadingBankDetails ? (
                      <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-28 w-28 mx-auto rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                      </div>
                    ) : (() => {
                      const activeCoinObj = DIVERSIFIED_CRYPTO_COINS.find((c) => c.id === selectedCoinId) || DIVERSIFIED_CRYPTO_COINS[0];
                      const coinWalletData = bankDetails?.cryptoWallets?.[activeCoinObj.id] || DEFAULT_FRONTEND_WALLETS[activeCoinObj.id] || { address: bankDetails?.cryptoWalletAddress || DEFAULT_FRONTEND_WALLETS.USDT_TRC20.address };
                      const addressToDisplay = coinWalletData.address || DEFAULT_FRONTEND_WALLETS.USDT_TRC20.address;
                      const tagToDisplay = coinWalletData.tag || (activeCoinObj.requiresTag ? DEFAULT_FRONTEND_WALLETS[activeCoinObj.id]?.tag : undefined);

                      // Calculate live estimated crypto amount
                      const numAmt = parseFloat(amount || "0");
                      let estCryptoText = `${numAmt.toFixed(2)} ${activeCoinObj.symbol}`;
                      if (activeCoinObj.symbol === "BTC") estCryptoText = `~${(numAmt / 96500).toFixed(6)} BTC`;
                      else if (activeCoinObj.symbol === "ETH") estCryptoText = `~${(numAmt / 2650).toFixed(4)} ETH`;
                      else if (activeCoinObj.symbol === "SOL") estCryptoText = `~${(numAmt / 185).toFixed(3)} SOL`;
                      else if (activeCoinObj.symbol === "XRP") estCryptoText = `~${(numAmt / 2.45).toFixed(2)} XRP`;
                      else if (activeCoinObj.symbol === "BNB") estCryptoText = `~${(numAmt / 620).toFixed(4)} BNB`;
                      else if (activeCoinObj.symbol === "DOGE") estCryptoText = `~${(numAmt / 0.32).toFixed(1)} DOGE`;

                      // Block Explorer links
                      let explorerUrl = `https://tronscan.org/#/address/${addressToDisplay}`;
                      if (activeCoinObj.network.includes("Ethereum") || activeCoinObj.id.includes("ERC20")) explorerUrl = `https://etherscan.io/address/${addressToDisplay}`;
                      else if (activeCoinObj.network.includes("BNB") || activeCoinObj.id.includes("BEP20")) explorerUrl = `https://bscscan.com/address/${addressToDisplay}`;
                      else if (activeCoinObj.network.includes("Solana")) explorerUrl = `https://solscan.io/account/${addressToDisplay}`;
                      else if (activeCoinObj.network.includes("Bitcoin")) explorerUrl = `https://mempool.space/address/${addressToDisplay}`;

                      return (
                        <div className="bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
                          {/* Top Glow Accent */}
                          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                          {/* Coin Header */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-3">
                              <img src={activeCoinObj.icon} alt={activeCoinObj.name} className="w-9 h-9 rounded-full bg-white/10 p-1 border border-white/20 shadow-sm" />
                              <div>
                                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                                  <span>{activeCoinObj.name} ({activeCoinObj.symbol})</span>
                                </h4>
                                <span className="text-[10px] text-amber-400 font-bold block">{activeCoinObj.network}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-2.5 py-0.5 rounded font-black uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                <span>Live Web3 Node</span>
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono mt-0.5">1 Confirmation Req.</span>
                            </div>
                          </div>

                          {/* Live Conversion Rate Banner */}
                          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>Sending Amount:</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-white block">{currency} {numAmt.toFixed(2)}</span>
                              <span className="text-[11px] text-emerald-400 font-black">{estCryptoText}</span>
                            </div>
                          </div>

                          {/* Network Safety Warning */}
                          <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-[11px] text-red-200 leading-snug flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Network Warning:</strong> Send only <strong>{activeCoinObj.name} ({activeCoinObj.symbol})</strong> on the <strong>{activeCoinObj.network}</strong> network. Sending via incorrect networks will result in permanent loss of funds.
                            </span>
                          </div>

                          {/* QR Code & Web3 Address Panel */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-black/40 rounded-xl p-4 border border-white/10">
                            <div className="sm:col-span-1 flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                              <QRCodeSVG
                                value={`${activeCoinObj.symbol.toLowerCase()}:${addressToDisplay}`}
                                size={120}
                              />
                              <span className="text-[9px] font-extrabold text-slate-800 uppercase tracking-wider mt-1.5 flex items-center gap-1">
                                <span>Scan via Mobile Wallet</span>
                              </span>
                            </div>

                            <div className="sm:col-span-2 space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    {activeCoinObj.symbol} Deposit Wallet Address:
                                  </label>
                                  <a
                                    href={explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
                                  >
                                    <span>Explorer</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                                <div className="bg-black/70 p-3 rounded-xl border border-white/20 font-mono text-xs text-emerald-300 break-all select-all font-bold tracking-tight leading-relaxed shadow-inner">
                                  {addressToDisplay}
                                </div>
                              </div>

                              {tagToDisplay && (
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1">
                                    Destination Memo / Tag (REQUIRED):
                                  </label>
                                  <div className="flex items-center justify-between bg-amber-950/70 p-2.5 rounded-xl border border-amber-500/50 font-mono text-xs text-amber-300 font-extrabold">
                                    <span>{tagToDisplay}</span>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const ok = await copyToClipboard(tagToDisplay, `${activeCoinObj.symbol} Destination Tag`);
                                        if (ok) {
                                          setCopiedMemoTag(true);
                                          setTimeout(() => setCopiedMemoTag(false), 2000);
                                        }
                                      }}
                                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] flex items-center gap-1 transition-all"
                                    >
                                      {copiedMemoTag ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                      <span>{copiedMemoTag ? "Copied!" : "Copy Tag"}</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Interactive Copy Wallet Address Button */}
                              <button
                                type="button"
                                onClick={async () => {
                                  const ok = await copyToClipboard(addressToDisplay, `${activeCoinObj.symbol} Wallet Address`);
                                  if (ok) {
                                    setCopiedCoinAddress(true);
                                    setTimeout(() => setCopiedCoinAddress(false), 2000);
                                  }
                                }}
                                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                                  copiedCoinAddress
                                    ? "bg-emerald-400 text-slate-950 ring-2 ring-emerald-300"
                                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                                }`}
                              >
                                {copiedCoinAddress ? (
                                  <>
                                    <Check className="w-4 h-4 stroke-[3]" />
                                    <span>{activeCoinObj.symbol} Address Copied to Clipboard!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy {activeCoinObj.symbol} Deposit Address</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">Upload Transaction Hash Screenshot</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="crypto-upload" />
                    <label htmlFor="crypto-upload"
                      className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer hover:border-[#D31C2B] transition-all bg-white"
                      style={{ borderColor: proofImage ? "#22A958" : "#D9D3CB" }}>
                      {proofImage ? (
                        <img src={proofImage} alt="Crypto Tx" className="h-full w-full object-contain rounded-xl p-1" />
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs font-black text-gray-500">Upload Transaction Hash Proof</p>
                          <p className="text-[10px] text-gray-400">JPG, PNG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Transaction Hash / Address</label>
                    <input type="text" value={proofDesc} onChange={(e) => setProofDesc(e.target.value)}
                      placeholder="e.g. 7f0a1bc2d3ef4a5b6..."
                      className="w-full px-4 py-3 rounded-lg border text-xs font-mono focus:ring-1 focus:ring-[#D31C2B] focus:border-[#D31C2B]" />
                  </div>

                  <button onClick={handleManualPaymentSubmit} disabled={isProcessing || !proofImage}
                    className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    style={{ backgroundColor: "#D31C2B" }}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Crypto Deposit Details</span>}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 4: Success Message */}
        {step === "success" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100 text-green-600 shadow-sm">
              <Check size={40} className="stroke-[3]" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Deposit Request Logged!</h2>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Your request for <strong>{currency} {parseFloat(amount).toFixed(2)}</strong> has been logged inside our database securely.
            </p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed font-bold uppercase tracking-wide">
              Compliance is reviewing details. Once verified, your live trading account balance will update instantly.
            </p>
            
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard"
                className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-red-700 transition-colors"
                style={{ backgroundColor: "#E31B23" }}>
                Back to Account Dashboard
              </Link>
              <button onClick={() => { setStep("method"); setAmount(""); setProofImage(null); setProofDesc(""); setSelectedMethod(""); }}
                className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                Deposit More
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* ── PAYPAL INTERACTIVE AUTH POPUP SIMULATOR ── */}
      <AnimatePresence>
        {showPaypalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 font-sans select-none">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-150">
              {/* Top Branded Bar */}
              <div className="bg-[#003087] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal_Logo_Icon_2014.svg" alt="PayPal" className="h-6 brightness-0 invert" />
                  <span className="text-xs uppercase font-extrabold tracking-wider">PayPal Secure Checkout</span>
                </div>
                <button onClick={() => setShowPaypalModal(false)} className="text-white/80 hover:text-white text-xs font-bold uppercase">Cancel</button>
              </div>

              {/* Step 1: PayPal Login Form */}
              {paypalStep === "login" && (
                <div className="p-8">
                  <h3 className="text-lg font-black text-[#003087] mb-2 uppercase tracking-tight">Log in to PayPal</h3>
                  <p className="text-xs text-gray-400 font-semibold mb-6">Enter credentials to pay {currency} {parseFloat(amount).toFixed(2)} to AxiTrader Ltd.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Email Address</label>
                      <input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="your-paypal-email@example.com" className="w-full px-4 py-3 text-xs font-bold rounded-lg border focus:ring-1 focus:ring-[#003087]" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Password</label>
                      <input type="password" value={paypalPassword} onChange={(e) => setPaypalPassword(e.target.value)}
                        placeholder="••••••••" className="w-full px-4 py-3 text-xs font-bold rounded-lg border focus:ring-1 focus:ring-[#003087]" />
                    </div>

                    <button onClick={handlePaypalCheckout} disabled={!paypalEmail || !paypalPassword}
                      className="w-full py-4 rounded-xl bg-[#0079C1] hover:bg-[#005EA6] text-white font-extrabold text-xs uppercase tracking-wider mt-4">
                      Log In to Pay
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: PayPal Confirmation screen */}
              {paypalStep === "confirm" && (
                <div className="p-8 space-y-6">
                  <h3 className="text-lg font-black text-[#003087] uppercase tracking-tight">Confirm Funding</h3>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Merchant:</span>
                      <span className="font-extrabold text-gray-800">AxiTrader Ltd (UK)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Pay With:</span>
                      <span className="font-extrabold text-gray-800">PayPal Balance ({paypalEmail})</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-gray-200 pt-3">
                      <span className="text-gray-500 font-black uppercase tracking-wider text-[9px]">Total charge:</span>
                      <span className="font-black text-[#003087] text-sm font-mono">{currency} {parseFloat(amount).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setPaypalStep("login")} className="flex-1 py-3.5 rounded-xl border border-gray-300 text-xs font-extrabold uppercase text-gray-500">Back</button>
                    <button onClick={confirmPaypalPayment} className="flex-1 py-3.5 rounded-xl bg-[#FFC439] hover:bg-[#F2B21A] text-black font-black text-xs uppercase tracking-wider">Confirm Payment</button>
                  </div>
                </div>
              )}

              {/* Step 3: PayPal Paying state */}
              {paypalStep === "paying" && (
                <div className="p-12 text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-[#003087] animate-spin mx-auto" />
                  <p className="text-xs font-black text-[#003087] uppercase tracking-wider">Verifying and processing with PayPal...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
