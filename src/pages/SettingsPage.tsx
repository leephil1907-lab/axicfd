import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, CreditCard, Globe, Moon, Sun, ChevronRight, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import KycVerificationModal from "@/components/KycVerificationModal";

const settingsSections = [
  { id: "profile", icon: User, label: "Profile", desc: "Manage your personal information" },
  { id: "verification", icon: ShieldCheck, label: "Identity Verification (KYC)", desc: "Upload Driver's License or Passport" },
  { id: "notifications", icon: Bell, label: "Notifications", desc: "Email, SMS and push notification preferences" },
  { id: "security", icon: Shield, label: "Security", desc: "Password, 2FA and login history" },
  { id: "language", icon: Globe, label: "Language & Region", desc: "Language, timezone and regional settings" },
  { id: "appearance", icon: Moon, label: "Appearance", desc: "Theme and display preferences" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [active, setActive] = useState("profile");
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true, marketing: false });
  const [language, setLanguage] = useState("en");
  const [saved, setSaved] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const lastName = user?.name && user.name.split(" ").length > 1 ? user.name.split(" ").slice(1).join(" ") : "";
  const email = user?.email || "";

  const kycStatusQuery = trpc.trading.getKycStatus.useQuery(undefined, { refetchInterval: 10000 });
  const kycStatus = kycStatusQuery.data?.status || "unverified";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: "#EDE8E0" }}>
      <div className="container-axi">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-6" style={{ color: "#1A1A1A" }}>Settings</motion.h1>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: "#fff", borderColor: "#D9D3CB" }}>
              {settingsSections.map(s => (
                <button key={s.id} onClick={() => setActive(s.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-0" style={{ backgroundColor: active === s.id ? "rgba(211,28,43,0.05)" : "#fff", borderColor: "#F5F2ED" }}>
                  <s.icon size={18} style={{ color: active === s.id ? "#D31C2B" : "#9B9590" }} />
                  <span className="text-sm font-medium" style={{ color: active === s.id ? "#D31C2B" : "#1A1A1A" }}>{s.label}</span>
                  <ChevronRight size={14} className="ml-auto" style={{ color: "#9B9590" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border p-6" style={{ backgroundColor: "#fff", borderColor: "#D9D3CB" }}>
              {saved && <div className="mb-4 p-3 rounded-lg text-sm font-semibold" style={{ backgroundColor: "rgba(34,169,88,0.1)", color: "#22A958" }}>Settings saved successfully!</div>}

              {active === "profile" && (
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#6B6560" }}>First Name</label><input type="text" defaultValue={firstName} key={firstName} className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/30" style={{ borderColor: "#D9D3CB" }} /></div>
                    <div><label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#6B6560" }}>Last Name</label><input type="text" defaultValue={lastName} key={lastName} className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31C2B]/30" style={{ borderColor: "#D9D3CB" }} /></div>
                    <div><label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#6B6560" }}>Email</label><input type="email" defaultValue={email} key={email} readOnly className="w-full px-4 py-3 text-sm border rounded-lg bg-gray-50 focus:outline-none cursor-not-allowed text-gray-600" style={{ borderColor: "#D9D3CB" }} /></div>
                    <div><label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#6B6560" }}>Account Role / Status</label><input type="text" defaultValue={user?.role === "admin" ? "Administrator" : "Trader Account"} readOnly className="w-full px-4 py-3 text-sm border rounded-lg bg-gray-50 focus:outline-none cursor-not-allowed text-gray-600 font-semibold" style={{ borderColor: "#D9D3CB" }} /></div>
                  </div>
                </div>
              )}

              {active === "verification" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold mb-1" style={{ color: "#1A1A1A" }}>Identity Verification (KYC Compliance)</h2>
                    <p className="text-xs text-gray-600">
                      Submit clear photos of your Driver's License, International Passport, or National ID. Verification is processed by Axi compliance within 15 to 30 minutes.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                    kycStatus === 'approved'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : kycStatus === 'pending'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-center gap-3">
                      {kycStatus === 'approved' ? (
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                      ) : kycStatus === 'pending' ? (
                        <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      )}
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider">
                          Status: {kycStatus === 'approved' ? 'Verified Account' : kycStatus === 'pending' ? 'Manual Inspection Pending (15-30m)' : 'Action Required / Unverified'}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {kycStatus === 'approved'
                            ? 'Your identity documents have been approved. Full trading and withdrawal limits are enabled.'
                            : kycStatus === 'pending'
                            ? 'Your Driver\'s License / Passport was submitted. Please allow 15 to 30 minutes for compliance approval.'
                            : 'Upload your Driver\'s License or Passport to complete manual verification.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsKycModalOpen(true)}
                      className="px-5 py-2.5 bg-[#D31C2B] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
                    >
                      {kycStatus === 'approved' ? 'View Details' : kycStatus === 'pending' ? 'Check Review Status' : 'Start Manual KYC'}
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs text-gray-600 space-y-2">
                    <h5 className="font-bold text-gray-800">Accepted Identification Documents:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      <li>💳 Valid Driver's License (Front & Back)</li>
                      <li>📖 International Passport (Biometric Page)</li>
                      <li>🪪 Government National Identity Card</li>
                    </ul>
                  </div>
                </div>
              )}

              {active === "notifications" && (
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>Notification Preferences</h2>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#F5F2ED" }}>
                        <div><p className="text-sm font-semibold capitalize" style={{ color: "#1A1A1A" }}>{key} Notifications</p><p className="text-xs" style={{ color: "#6B6560" }}>Receive {key} notifications about your account</p></div>
                        <button onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))} className="w-12 h-6 rounded-full transition-colors relative" style={{ backgroundColor: value ? "#D31C2B" : "#D9D3CB" }}><div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: value ? "26px" : "2px" }} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === "security" && (
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>Security Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border" style={{ borderColor: "#D9D3CB", backgroundColor: "#F5F2ED" }}>
                      <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Change Password</p>
                      <p className="text-xs mt-1" style={{ color: "#6B6560" }}>Last changed 30 days ago</p>
                      <button className="mt-3 px-4 py-2 rounded border text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "#D31C2B", color: "#D31C2B" }}>Change</button>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ borderColor: "#D9D3CB", backgroundColor: "#F5F2ED" }}>
                      <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Two-Factor Authentication</p>
                      <p className="text-xs mt-1" style={{ color: "#6B6560" }}>Add an extra layer of security</p>
                      <button className="mt-3 btn-yellow text-[10px] py-2 px-4">Enable 2FA</button>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ borderColor: "#D9D3CB", backgroundColor: "#F5F2ED" }}>
                      <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Login History</p>
                      <p className="text-xs mt-1" style={{ color: "#6B6560" }}>View recent login activity</p>
                      <button className="mt-3 px-4 py-2 rounded border text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "#D9D3CB", color: "#6B6560" }}>View</button>
                    </div>
                  </div>
                </div>
              )}

              {active === "language" && (
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>Language & Region</h2>
                  <div className="space-y-4">
                    <div><label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#6B6560" }}>Language</label>
                      <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none" style={{ borderColor: "#D9D3CB" }}>
                        <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option>
                      </select>
                    </div>
                    <div><label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#6B6560" }}>Timezone</label>
                      <select className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none" style={{ borderColor: "#D9D3CB" }}>
                        <option>UTC (GMT+0)</option><option>EST (GMT-5)</option><option>CET (GMT+1)</option><option>JST (GMT+9)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {active === "appearance" && (
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>Theme & Appearance</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#F5F2ED" }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Dark Mode</p>
                        <p className="text-xs" style={{ color: "#6B6560" }}>Enable dark theme for pro trading aesthetic</p>
                      </div>
                      <button 
                        onClick={toggleTheme} 
                        className="w-12 h-6 rounded-full transition-colors relative" 
                        style={{ backgroundColor: resolvedTheme === "dark" ? "#D31C2B" : "#D9D3CB" }}
                      >
                        <div 
                          className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all flex items-center justify-center text-[10px]" 
                          style={{ left: resolvedTheme === "dark" ? "26px" : "2px" }}
                        >
                          {resolvedTheme === "dark" ? "🌙" : "☀️"}
                        </div>
                      </button>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#6B6560" }}>Theme Mode</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setTheme("light")}
                          className={`p-3 rounded-lg border text-center text-xs font-bold transition-all ${
                            theme === "light" ? "border-[#D31C2B] bg-red-50 text-[#D31C2B]" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          ☀️ Light
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`p-3 rounded-lg border text-center text-xs font-bold transition-all ${
                            theme === "dark" ? "border-[#D31C2B] bg-gray-900 text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          🌙 Dark
                        </button>
                        <button
                          onClick={() => setTheme("system")}
                          className={`p-3 rounded-lg border text-center text-xs font-bold transition-all ${
                            theme === "system" ? "border-[#D31C2B] bg-amber-50 text-amber-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          💻 System
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t" style={{ borderColor: "#F5F2ED" }}>
                <button onClick={handleSave} className="btn-yellow">Save Changes</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <KycVerificationModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        onSuccess={() => kycStatusQuery.refetch()}
      />
    </div>
  );
}
