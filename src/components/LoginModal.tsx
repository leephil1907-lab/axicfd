import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, LogIn } from "lucide-react";
import { trpc } from "../providers/trpc";
import { useAuth } from "../hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

export default function LoginModal({ isOpen, onClose, onSignUp }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [portal, setPortal] = useState<"email" | "mt4">("email");

  const { login } = useAuth();

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      login(data.token, data.user);
      onClose();
      window.location.href = data.user.role === 'admin' ? '/admin' : '/trading';
    },
    onError: (err) => {
      setError(err.message || "Invalid credentials. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[420px] rounded-xl p-8 relative"
            style={{ backgroundColor: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-colors"
              style={{ color: "#9B9590" }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>Login</h2>
            <p className="mt-1 text-sm" style={{ color: "#6B6560" }}>
              Login with your email or your MT4 credentials.
            </p>

            {/* Portal tabs */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setPortal("email")}
                className="flex-1 py-3 rounded-lg border text-center text-sm font-medium transition-colors"
                style={{
                  borderColor: portal === "email" ? "#D31C2B" : "#D9D3CB",
                  color: portal === "email" ? "#D31C2B" : "#6B6560",
                  backgroundColor: portal === "email" ? "rgba(211,28,43,0.05)" : "#fff",
                }}
              >
                New Portal
              </button>
              <button
                onClick={() => setPortal("mt4")}
                className="flex-1 py-3 rounded-lg border text-center text-sm font-medium transition-colors"
                style={{
                  borderColor: portal === "mt4" ? "#D31C2B" : "#D9D3CB",
                  color: portal === "mt4" ? "#D31C2B" : "#6B6560",
                  backgroundColor: portal === "mt4" ? "rgba(211,28,43,0.05)" : "#fff",
                }}
              >
                Old Portal
              </button>
            </div>

            {portal === "email" ? (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full py-4 rounded-lg border flex items-center justify-center gap-3 hover:border-[#D31C2B] transition-colors"
                  style={{ borderColor: "#D9D3CB" }}
                >
                  <Mail size={20} style={{ color: "#6B6560" }} />
                  <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>Login with email</span>
                  <span style={{ color: "#D31C2B" }}>&rarr;</span>
                </button>

                <div>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/30"
                    style={{ borderColor: "#D9D3CB" }}
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/30 pr-10"
                    style={{ borderColor: "#D9D3CB" }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#9B9590" }}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {error && (
                  <div className="text-sm p-3 rounded-lg" style={{ backgroundColor: "rgba(211,28,43,0.08)", color: "#D31C2B" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit" disabled={loginMutation.isPending}
                  className="w-full py-3 rounded-lg text-[11px] font-semibold uppercase tracking-[1.5px] text-white transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: loginMutation.isPending ? "#B91623" : "#D31C2B" }}
                >
                  <LogIn size={16} />
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <div className="mt-5">
                <button
                  className="w-full py-4 rounded-lg border flex items-center justify-center gap-3 hover:border-[#D31C2B] transition-colors"
                  style={{ borderColor: "#D9D3CB" }}
                >
                  <img src="/mt4-icon.png" alt="MT4" className="w-6 h-6" />
                  <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>Login with MT4</span>
                  <span style={{ color: "#D31C2B" }}>&rarr;</span>
                </button>
              </div>
            )}

            <p className="mt-5 text-sm text-center" style={{ color: "#6B6560" }}>
              New to Axi? <button onClick={onSignUp} className="underline font-medium" style={{ color: "#D31C2B" }}>Sign up</button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
