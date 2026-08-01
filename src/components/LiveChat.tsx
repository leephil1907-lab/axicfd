import { useState } from "react";
import { MessageCircle, X, Send, UserCheck, ShieldAlert, Headset } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

export default function LiveChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot" | "admin"; text: string; time?: string }[]>([
    { from: "bot", text: "Welcome to Axi Official Support. How can we assist with your trading account today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessageMutation = trpc.trading.sendSupportMessage.useMutation();

  const handleTransferToAdmin = async () => {
    setIsTransferred(true);
    const transferNotice = "Requesting direct connection with Axi Senior Compliance & Operations Admin...";
    setMessages((prev) => [
      ...prev,
      { from: "user", text: "Connect me with a live Admin agent." },
      { from: "bot", text: "Connecting you now... Your request has been transferred to the Axi Admin Desk. An Administrator will respond directly." }
    ]);

    if (user) {
      try {
        await sendMessageMutation.mutateAsync({
          message: transferNotice,
          sender: "user",
          transferredToAdmin: true,
        });
      } catch (e) {
        console.error("Failed to sync transfer message:", e);
      }
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    if (!textToSend) setInput("");

    if (user) {
      try {
        await sendMessageMutation.mutateAsync({
          message: text,
          sender: "user",
          transferredToAdmin: isTransferred,
        });
      } catch (e) {
        console.error("Error sending support message:", e);
      }
    }

    if (!isTransferred) {
      setTimeout(() => {
        const lower = text.toLowerCase();
        let botReply = "Thank you for reaching out. If you need dedicated account help, click 'Transfer to Admin' below.";
        if (lower.includes("deposit") || lower.includes("fund") || lower.includes("stripe")) {
          botReply = "Instant deposits are available via Visa/Mastercard (Stripe Gateway), Crypto (USDT TRC20), Chime, and Wire Transfer. Go to Funds -> Deposit.";
        } else if (lower.includes("withdraw") || lower.includes("payout")) {
          botReply = "Withdrawal requests are processed within 15–30 minutes by our Treasury desk. Minimum withdrawal is $5.00 USD.";
        } else if (lower.includes("leverage") || lower.includes("spread")) {
          botReply = "Axi offers flexible leverage up to 1:500 with raw spreads from 0.0 pips on Pro trading accounts.";
        } else if (lower.includes("human") || lower.includes("admin") || lower.includes("agent")) {
          botReply = "Click the 'Transfer to Admin' button at the top to chat directly with a live administrator.";
        }

        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      }, 800);
    }
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-[90] w-[340px] md:w-[380px] rounded-2xl overflow-hidden shadow-2xl transition-all"
          style={{ backgroundColor: "#fff", border: "1px solid #D9D3CB" }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between" style={{ backgroundColor: "#D31C2B" }}>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Headset size={18} />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#D31C2B] rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Axi Live Desk</h4>
                <p className="text-[10px] text-white/80">
                  {isTransferred ? "Connected to Admin Desk" : "24/7 Multi-Asset Support"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isTransferred && (
                <button
                  onClick={handleTransferToAdmin}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/20 hover:bg-white text-white hover:text-[#D31C2B] transition-all flex items-center gap-1 shadow-sm"
                  title="Transfer chat directly to an Administrator"
                >
                  <UserCheck size={12} />
                  Transfer to Admin
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Action Pills */}
          {!isTransferred && (
            <div className="px-3 py-2 bg-gray-50 border-b flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
              <button
                onClick={() => sendMessage("How do I deposit with Credit Card?")}
                className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#D31C2B] hover:text-[#D31C2B] whitespace-nowrap transition-colors"
              >
                💳 Deposits
              </button>
              <button
                onClick={() => sendMessage("How long do withdrawals take?")}
                className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#D31C2B] hover:text-[#D31C2B] whitespace-nowrap transition-colors"
              >
                💸 Withdrawals
              </button>
              <button
                onClick={handleTransferToAdmin}
                className="px-2.5 py-1 rounded-full bg-[#D31C2B]/10 border border-[#D31C2B]/30 text-[#D31C2B] font-semibold whitespace-nowrap hover:bg-[#D31C2B] hover:text-white transition-colors flex items-center gap-1"
              >
                <ShieldAlert size={10} /> Live Admin
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="h-[320px] overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[82%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed shadow-sm"
                  style={{
                    backgroundColor: msg.from === "user" ? "#D31C2B" : msg.from === "admin" ? "#1A1A1A" : "#FFFFFF",
                    color: msg.from === "user" || msg.from === "admin" ? "#fff" : "#1A1A1A",
                    border: msg.from === "bot" ? "1px solid #E2E8F0" : "none",
                  }}
                >
                  {msg.from === "admin" && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1">
                      <ShieldAlert size={10} /> Senior Admin Response
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 flex gap-2 bg-white" style={{ borderTop: "1px solid #D9D3CB" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isTransferred ? "Type message to Admin..." : "Ask a question..."}
              className="flex-1 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/30"
              style={{ borderColor: "#D9D3CB" }}
            />
            <button onClick={() => sendMessage()} className="px-3 py-2 rounded-lg text-white font-medium hover:bg-[#b01723] transition-colors" style={{ backgroundColor: "#D31C2B" }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-[90] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
        style={{ backgroundColor: "#D31C2B" }}
      >
        {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>
    </>
  );
}
