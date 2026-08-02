import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Check, 
  Bitcoin, 
  CreditCard, 
  Wallet, 
  Landmark, 
  AlertCircle,
  Loader2,
  Lock,
  ShieldCheck,
  Building2,
  DollarSign,
  Info,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Zap,
  HelpCircle,
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

const withdrawalMethods = [
  { 
    id: "crypto", 
    name: "Crypto Wallet (USDT TRC20 / ERC20)", 
    desc: "15 to 30 mins TRC20 payout, 0% Axi Fee", 
    icon: Bitcoin, 
    color: "#F7931A", 
    badge: "Fastest Payout",
    fields: ["walletAddress", "network"] 
  },
  { 
    id: "card", 
    name: "Credit / Debit Card Refund (Visa & Mastercard)", 
    desc: "Instant to 24h card payout, 0% Fee", 
    icon: CreditCard, 
    color: "#D31C2B", 
    badge: "Direct Card",
    fields: ["cardLast4", "cardHolderName"] 
  },
  { 
    id: "bank", 
    name: "Bank Wire Transfer (SEPA / SWIFT / Wire)", 
    desc: "1 to 3 business days, Tier-1 Bank Direct", 
    icon: Landmark, 
    color: "#2563EB", 
    badge: "High Limit",
    fields: ["bankName", "accountName", "iban", "swiftCode"] 
  },
  { 
    id: "skrill", 
    name: "Skrill / Neteller E-Wallet", 
    desc: "Instant payout to registered e-wallet, 0% Fee", 
    icon: Wallet, 
    color: "#862165", 
    badge: "E-Wallet",
    fields: ["accountEmail"] 
  },
];

export default function UserWithdrawalPage() {
  const { user } = useAuth();
  const { data: account, isLoading: accountLoading } = trpc.trading.account.useQuery();
  const { data: kycData } = trpc.trading.getKycStatus.useQuery();

  const [step, setStep] = useState<"method" | "details" | "confirm" | "success">("method");
  const [selectedMethodId, setSelectedMethodId] = useState<string>("crypto");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  
  // Destination inputs
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [network, setNetwork] = useState<string>("TRC20");
  const [cardLast4, setCardLast4] = useState<string>("");
  const [cardHolderName, setCardHolderName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [swiftCode, setSwiftCode] = useState<string>("");
  const [accountEmail, setAccountEmail] = useState<string>("");
  const [userNotes, setUserNotes] = useState<string>("");

  const [submittedTx, setSubmittedTx] = useState<{
    reference: string;
    amount: number;
    currency: string;
    methodName: string;
  } | null>(null);

  const selectedMethod = withdrawalMethods.find((m) => m.id === selectedMethodId) || withdrawalMethods[0];
  const availableBalance = account ? parseFloat(account.balance.toString()) : 0;

  // tRPC Withdrawal Mutation
  const createWithdrawalMutation = trpc.trading.createWithdrawal.useMutation({
    onSuccess: (data) => {
      setSubmittedTx({
        reference: data.reference,
        amount: data.amount,
        currency: data.currency,
        methodName: data.paymentMethod,
      });
      setStep("success");
      toast.success(`Withdrawal request submitted successfully!`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to process withdrawal request.");
    }
  });

  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
    setStep("details");
  };

  const handleQuickAmount = (val: number) => {
    if (val > availableBalance) {
      setAmount(availableBalance.toFixed(2));
    } else {
      setAmount(val.toString());
    }
  };

  const getDestinationDetailsString = () => {
    if (selectedMethodId === "crypto") {
      return `USDT (${network}) -> ${walletAddress}`;
    }
    if (selectedMethodId === "card") {
      return `Card ending in ${cardLast4} (${cardHolderName})`;
    }
    if (selectedMethodId === "bank") {
      return `${bankName} | ${accountName} | IBAN: ${iban} | SWIFT: ${swiftCode}`;
    }
    if (selectedMethodId === "skrill") {
      return `Skrill Email: ${accountEmail}`;
    }
    return "Standard Account";
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!numAmt || isNaN(numAmt) || numAmt < 5) {
      toast.error("Please enter a valid withdrawal amount (Min $5.00 USD).");
      return;
    }
    if (numAmt > availableBalance) {
      toast.error(`Amount exceeds available live balance of $${availableBalance.toFixed(2)} USD.`);
      return;
    }

    if (selectedMethodId === "crypto" && !walletAddress.trim()) {
      toast.error("Please provide a valid crypto wallet payout address.");
      return;
    }
    if (selectedMethodId === "card" && (!cardLast4 || cardLast4.length < 4)) {
      toast.error("Please enter the last 4 digits of your card.");
      return;
    }
    if (selectedMethodId === "bank" && (!bankName || !iban)) {
      toast.error("Please fill in bank name and IBAN/Account number.");
      return;
    }
    if (selectedMethodId === "skrill" && !accountEmail.includes("@")) {
      toast.error("Please enter a valid e-wallet account email.");
      return;
    }

    setStep("confirm");
  };

  const handleFinalSubmit = () => {
    createWithdrawalMutation.mutate({
      amount: parseFloat(amount),
      currency: currency,
      paymentMethod: selectedMethod.name,
      destination: getDestinationDetailsString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-gray-100 flex flex-col font-sans">
      
      {/* AXI BRANDED NAVBAR */}
      <header className="bg-[#0c0f17] border-b border-gray-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D31C2B] to-red-700 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-950/50">
                AXI
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-wide">Axi</span>
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded">PRO</span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider">Client Banking Portal</span>
              </div>
            </Link>
          </div>

          {/* Quick Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
            <Link to="/deposit" className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-colors">
              Deposit
            </Link>
            <Link to="/withdrawal" className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#D31C2B] text-white shadow-md">
              Withdrawal
            </Link>
            <Link to="/funds" className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-colors">
              Assets & Balance
            </Link>
            <Link to="/trading" className="px-4 py-1.5 rounded-lg text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              Live Trader
            </Link>
          </div>

          {/* Account Status Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-400 font-semibold uppercase leading-none">Live Balance</span>
                <span className="font-mono text-xs font-bold text-emerald-400 leading-tight">
                  ${availableBalance.toFixed(2)} USD
                </span>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
              title="Back to Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* SUB HEADER BREADCRUMB */}
      <div className="bg-[#0e121d] border-b border-gray-800/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <Link to="/funds" className="hover:text-white transition-colors">Banking</Link>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-white font-semibold">Funds Withdrawal</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-300 font-semibold">Axi Segregated Tier-1 Account Protected</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title Banner */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/40 via-gray-900 to-gray-900 border border-red-500/20 p-6 rounded-2xl shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Withdraw Funds</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950 border border-red-600/40 text-red-400">
                  Axi Verified Gateway
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Withdraw funds instantly or via bank wire to your verified account with 0% processing fees.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-gray-950/80 px-4 py-3 rounded-xl border border-gray-800">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider block">Account ID</span>
                <span className="font-mono text-xs font-bold text-white">{account?.accountNumber || 'AXI-LIVE-MAIN'}</span>
              </div>
              <div className="h-6 w-px bg-gray-800" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider block">Available to Withdraw</span>
                <span className="font-mono text-xs font-bold text-emerald-400">${availableBalance.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP PROGRESS TRACKER */}
        <div className="mb-8 flex items-center justify-between bg-[#0e121d] p-4 rounded-2xl border border-gray-800">
          {[
            { key: "method", label: "1. Select Method" },
            { key: "details", label: "2. Amount & Details" },
            { key: "confirm", label: "3. Review & Security" },
            { key: "success", label: "4. Processing" },
          ].map((s, idx) => {
            const stepOrder = ["method", "details", "confirm", "success"];
            const currentIdx = stepOrder.indexOf(step);
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-emerald-500 text-black"
                      : isCurrent
                      ? "bg-[#D31C2B] text-white shadow-lg shadow-red-900/50 scale-110"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:block ${
                    isCurrent ? "text-white" : isDone ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
                {idx < 3 && <div className={`flex-1 h-0.5 mx-2 rounded ${idx < currentIdx ? "bg-emerald-500" : "bg-gray-800"}`} />}
              </div>
            );
          })}
        </div>

        {/* STEP 1: METHOD SELECTION */}
        {step === "method" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-white">Select Withdrawal Method</h2>
                <p className="text-xs text-gray-400">Choose your preferred destination gateway below.</p>
              </div>
              <span className="text-xs text-amber-400 font-semibold bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                No Axi Commission Fees
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {withdrawalMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMethod(m.id)}
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group flex items-start gap-4 ${
                    selectedMethodId === m.id
                      ? "bg-gradient-to-br from-gray-900 to-[#121827] border-[#D31C2B] shadow-xl shadow-red-950/20"
                      : "bg-[#0e121d] border-gray-800/90 hover:border-gray-700 hover:bg-gray-900/50"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                    style={{ backgroundColor: `${m.color}20` }}
                  >
                    <m.icon className="w-6 h-6" style={{ color: m.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                        {m.name}
                      </h3>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 shrink-0">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{m.desc}</p>

                    <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Min: $5.00 USD
                      </span>
                      <span className="font-bold text-red-400 flex items-center gap-0.5">
                        Select Gateway <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* SECURITY INFORMATION BOX */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Security & Regulation Notice</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    For compliance and anti-money laundering (AML) standards, withdrawals must be returned to account holders matching your Axi registered identity.
                  </p>
                </div>
              </div>
              <Link
                to="/kyc-policy"
                className="text-xs text-amber-400 hover:underline font-bold whitespace-nowrap shrink-0"
              >
                Learn about Axi AML Policy &rarr;
              </Link>
            </div>
          </motion.div>
        )}

        {/* STEP 2: AMOUNT & DESTINATION DETAILS */}
        {step === "details" && (
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-2xl mx-auto">
            <button
              onClick={() => setStep("method")}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Method Selection
            </button>

            <div className="bg-[#0e121d] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center">
                    <selectedMethod.icon className="w-5 h-5" style={{ color: selectedMethod.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{selectedMethod.name}</h3>
                    <p className="text-xs text-gray-400">{selectedMethod.desc}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  Available: ${availableBalance.toFixed(2)} USD
                </span>
              </div>

              <form onSubmit={handleProceedToConfirm} className="space-y-5">
                
                {/* AMOUNT INPUT */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-extrabold uppercase text-gray-300 tracking-wider">
                      Withdrawal Amount
                    </label>
                    <span className="text-[11px] text-gray-400">Min: $5.00 USD</span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-3 text-base font-mono font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                        required
                      />
                    </div>

                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D31C2B]"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
                    {[50, 100, 250, 500, 1000].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => handleQuickAmount(preset)}
                        className="px-3 py-1 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs font-mono font-semibold text-gray-300 transition-colors"
                      >
                        +${preset}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleQuickAmount(availableBalance)}
                      className="px-3 py-1 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-600/40 text-xs font-mono font-bold text-red-300 transition-colors"
                    >
                      MAX (${availableBalance.toFixed(2)})
                    </button>
                  </div>
                </div>

                {/* DESTINATION DYNAMIC INPUTS */}
                {selectedMethodId === "crypto" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                        Network Protocol
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNetwork("TRC20")}
                          className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                            network === "TRC20"
                              ? "bg-red-950/60 border-[#D31C2B] text-white shadow"
                              : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                          }`}
                        >
                          Tron (USDT TRC20)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNetwork("ERC20")}
                          className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                            network === "ERC20"
                              ? "bg-red-950/60 border-[#D31C2B] text-white shadow"
                              : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                          }`}
                        >
                          Ethereum (USDT ERC20)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                        Crypto Payout Wallet Address
                      </label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder={network === "TRC20" ? "T..." : "0x..."}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                        required
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        Ensure you double-check address. Crypto payouts are non-reversible on blockchain.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethodId === "card" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                        Cardholder Full Name
                      </label>
                      <input
                        type="text"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        placeholder="Full name as printed on Visa / Mastercard"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                        Last 4 Digits of Card Used
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={cardLast4}
                        onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                        placeholder="e.g. 4829"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                        required
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        Card refunds will be credited directly to the original funding card.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethodId === "bank" && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g. BNP Paribas / Barclays"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          placeholder="Full name on bank account"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                          IBAN / Account Number
                        </label>
                        <input
                          type="text"
                          value={iban}
                          onChange={(e) => setIban(e.target.value)}
                          placeholder="FR76..."
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                          SWIFT / BIC Code
                        </label>
                        <input
                          type="text"
                          value={swiftCode}
                          onChange={(e) => setSwiftCode(e.target.value)}
                          placeholder="BNPAFRPPXXX"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethodId === "skrill" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                        Skrill / Neteller Account Email
                      </label>
                      <input
                        type="email"
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        placeholder="your-email@domain.com"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-300 tracking-wider mb-2">
                    Additional Reference / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Any special instructions for Axi compliance team..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D31C2B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#D31C2B] hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
                >
                  <span>Review & Security Verification</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REVIEW & CONFIRMATION */}
        {step === "confirm" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto space-y-6">
            <button
              onClick={() => setStep("details")}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>

            <div className="bg-[#0e121d] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="text-center pb-4 border-b border-gray-800">
                <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-white">Confirm Withdrawal Request</h3>
                <p className="text-xs text-gray-400 mt-0.5">Please review the payout details before final dispatch.</p>
              </div>

              <div className="bg-gray-950/80 rounded-xl p-4 border border-gray-800/80 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-sans">Trading Account:</span>
                  <strong className="text-white">{account?.accountNumber || "AXI-LIVE-MAIN"}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-sans">Payout Method:</span>
                  <strong className="text-amber-400">{selectedMethod.name}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-sans">Destination Target:</span>
                  <strong className="text-white max-w-[200px] truncate text-right">{getDestinationDetailsString()}</strong>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                  <span className="text-gray-400 font-sans text-sm font-bold">Total Amount:</span>
                  <strong className="text-emerald-400 text-base">${parseFloat(amount).toFixed(2)} {currency}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-sans">Processing Fee:</span>
                  <strong className="text-emerald-400">$0.00 USD (0% Axi Fee)</strong>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-200 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Axi Processing Notice</p>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Your request will be dispatched to Axi Financial Compliance for review. standard review time is 1 to 24 business hours.
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={createWithdrawalMutation.isPending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createWithdrawalMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Transmitting Request...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span>Confirm & Authorize Withdrawal</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === "success" && submittedTx && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto space-y-6 text-center py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-950">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Withdrawal Request Dispatched!</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Your request of <strong className="text-emerald-400">${submittedTx.amount.toFixed(2)} {submittedTx.currency}</strong> has been transmitted to the compliance queue.
              </p>
            </div>

            <div className="bg-[#0e121d] border border-gray-800 rounded-2xl p-6 shadow-xl text-left font-mono text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400 font-sans">Reference Number:</span>
                <span className="text-amber-400 font-bold">{submittedTx.reference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-sans">Amount:</span>
                <span className="text-white font-bold">${submittedTx.amount.toFixed(2)} {submittedTx.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-sans">Gateway Method:</span>
                <span className="text-gray-300">{submittedTx.methodName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-sans">Review Status:</span>
                <span className="text-amber-300 font-sans font-extrabold uppercase px-2 py-0.5 bg-amber-950/60 border border-amber-500/30 rounded">
                  Pending Compliance (1-24h)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs font-bold text-white transition-colors"
              >
                Back to Dashboard
              </Link>
              <Link
                to="/trading"
                className="px-6 py-3 rounded-xl bg-[#D31C2B] hover:bg-red-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow"
              >
                <Zap className="w-4 h-4 fill-current" />
                Return to Live Trading
              </Link>
            </div>
          </motion.div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#0c0f17] border-t border-gray-800/80 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Axi Financial Trading Services. All Rights Reserved. Fully Regulated Broker.</p>
        </div>
      </footer>
    </div>
  );
}
