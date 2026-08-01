import React, { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { COUNTRIES } from "@/lib/constants";
import { 
  ShieldCheck, Upload, FileText, CheckCircle2, Clock, AlertCircle, 
  X, ChevronRight, User, CreditCard, Lock, Loader2, ArrowLeft, RefreshCw
} from "lucide-react";

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function KycVerificationModal({ isOpen, onClose, onSuccess }: KycVerificationModalProps) {
  const [step, setStep] = useState<"intro" | "form" | "upload" | "status">("intro");
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [postalCode, setPostalCode] = useState("");
  const [idType, setIdType] = useState<"drivers_license" | "passport" | "national_id">("drivers_license");
  const [idNumber, setIdNumber] = useState("");

  // Upload States (Base64)
  const [frontImage, setFrontImage] = useState<string>("");
  const [frontName, setFrontName] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");
  const [backName, setBackName] = useState<string>("");
  const [selfieImage, setSelfieImage] = useState<string>("");
  const [selfieName, setSelfieName] = useState<string>("");

  // Countdown timer for pending review (15-30 mins)
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 mins default

  const statusQuery = trpc.trading.getKycStatus.useQuery(undefined, {
    enabled: isOpen,
    refetchInterval: 10000,
  });

  const submitMutation = trpc.trading.submitManualKyc.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Manual verification documents submitted!");
      statusQuery.refetch();
      setStep("status");
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit verification request.");
    },
  });

  // Keep countdown in sync
  useEffect(() => {
    if (statusQuery.data?.timeRemainingSec) {
      setTimeLeft(statusQuery.data.timeRemainingSec);
    }
  }, [statusQuery.data]);

  useEffect(() => {
    let timer: any;
    if (step === "status" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Set initial step based on status
  useEffect(() => {
    if (statusQuery.data?.status === "pending" || statusQuery.data?.status === "approved") {
      setStep("status");
    }
  }, [statusQuery.data]);

  if (!isOpen) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (b64: string) => void,
    nameSetter: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      nameSetter(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !dob.trim() || !address.trim() || !city.trim() || !country.trim() || !postalCode.trim() || !idNumber.trim()) {
      toast.error("Personal details are incomplete. Please complete Step 1 first.");
      setStep("form");
      return;
    }
    if (!frontImage) {
      toast.error("Please upload the front photo of your ID document.");
      return;
    }
    if ((idType === "drivers_license" || idType === "national_id") && !backImage) {
      toast.error("Back photo of ID document is required for Driver's License or National ID.");
      return;
    }

    submitMutation.mutate({
      fullName,
      dob,
      address,
      city,
      country,
      postalCode,
      idType,
      idNumber,
      frontImage,
      backImage,
      selfieImage,
    });
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const kycStatus = statusQuery.data?.status || "unverified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-gray-900 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] text-white px-6 py-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D31C2B]/20 border border-[#D31C2B]/40 flex items-center justify-center text-[#D31C2B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Identity Verification (KYC)</h2>
              <p className="text-xs text-gray-400">Axi Financial Compliance & Regulatory Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">

          {/* STATUS VIEW */}
          {step === "status" && (
            <div className="space-y-6 text-center py-4">
              {kycStatus === "approved" ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-emerald-950">Account Fully Verified</h3>
                    <p className="text-sm text-emerald-700 max-w-md mx-auto mt-2 font-medium">
                      Your identity verification documents have been reviewed and approved by Axi Compliance. Your live trading limits and withdrawal access are fully activated.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              ) : kycStatus === "pending" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 space-y-5">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-ping" />
                    <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Clock className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
                      ⏳ Manual Compliance Review
                    </span>
                    <h3 className="text-2xl font-black text-gray-950">Documents Under Inspection</h3>
                    <p className="text-sm text-gray-600 max-w-lg mx-auto mt-2 leading-relaxed">
                      Your submitted identification documents (Driver's License / Passport) are currently being reviewed by our compliance officers.
                    </p>
                  </div>

                  {/* Live Countdown Box */}
                  <div className="bg-white border border-amber-200 rounded-xl p-5 max-w-md mx-auto shadow-sm space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Approval Timeframe</p>
                    <div className="text-3xl font-black font-mono text-[#D31C2B]">
                      {formatCountdown(timeLeft)}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Verification is typically approved within <strong>15 to 30 minutes</strong>. Your user dashboard will update automatically.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => statusQuery.refetch()}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Check Status</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 space-y-4">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-red-950">Verification Needs Attention</h3>
                    <p className="text-sm text-red-700 max-w-md mx-auto mt-2 font-medium">
                      {statusQuery.data?.record?.rejectionReason || "Your previous submission required clearer document uploads. Please resubmit your Driver's License or Passport."}
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setStep("form")}
                      className="px-6 py-3 bg-[#D31C2B] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      Resubmit Documents
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INTRO VIEW */}
          {step === "intro" && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="font-bold">Automated Check Status:</strong> Automated identity lookup is unavailable or requires manual review. Please complete the manual verification form below by uploading your valid Driver's License, Passport, or National ID.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-[#D31C2B]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">1. Select ID Type</h4>
                  <p className="text-[11px] text-gray-500">Driver's License, Passport or National Identity Card</p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-[#D31C2B]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">2. Upload Photos</h4>
                  <p className="text-[11px] text-gray-500">Clear front and back photos of your original ID</p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-emerald-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">3. 15-30m Approval</h4>
                  <p className="text-[11px] text-gray-500">Axi compliance team verifies your dashboard</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="px-6 py-3 bg-[#D31C2B] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Start Manual Verification</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* FORM VIEW: Personal Details */}
          {step === "form" && (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!fullName.trim() || !dob.trim() || !address.trim() || !city.trim() || !country.trim() || !postalCode.trim() || !idNumber.trim()) {
                toast.error("Please fill in all mandatory personal information fields.");
                return;
              }
              setStep("upload");
            }} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31C2B]">
                  <User className="w-4 h-4" />
                  <span>Step 1 of 2: Personal Information</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("intro")}
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street name, house/apartment number"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none bg-white font-medium"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.label}>
                        {c.label} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Postal / Zip Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Document Type *
                  </label>
                  <select
                    value={idType}
                    onChange={(e: any) => setIdType(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none bg-white"
                  >
                    <option value="drivers_license">💳 Driver's License</option>
                    <option value="passport">📖 International Passport</option>
                    <option value="national_id">🪪 National ID Card</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Document Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-983021948 or Passport #"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D31C2B] focus:border-transparent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D31C2B] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Proceed to Upload ID</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* UPLOAD VIEW: Document Photos */}
          {step === "upload" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31C2B]">
                  <Upload className="w-4 h-4" />
                  <span>Step 2 of 2: Upload Identification ({idType.toUpperCase().replace("_", " ")})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="space-y-4">
                {/* FRONT IMAGE UPLOAD */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100/80 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#D31C2B]" />
                      <span>1. Front Photo / Scan of ID Document *</span>
                    </label>
                    {frontImage && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Attached</span>}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    id="frontImageInput"
                    onChange={(e) => handleFileChange(e, setFrontImage, setFrontName)}
                    className="hidden"
                  />

                  {frontImage ? (
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={frontImage} alt="Front ID" className="w-12 h-12 object-cover rounded-md border" />
                        <span className="text-xs font-medium text-gray-700 truncate">{frontName || "Front_ID.jpg"}</span>
                      </div>
                      <label htmlFor="frontImageInput" className="text-xs font-bold text-[#D31C2B] cursor-pointer hover:underline shrink-0">
                        Change
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="frontImageInput" className="flex flex-col items-center justify-center py-6 cursor-pointer text-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs font-bold text-gray-700">Click to upload or drag & drop Front ID photo</p>
                      <p className="text-[11px] text-gray-500 mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
                    </label>
                  )}
                </div>

                {/* BACK IMAGE UPLOAD (Required for License / National ID) */}
                {(idType === "drivers_license" || idType === "national_id") && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100/80 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#D31C2B]" />
                        <span>2. Back Photo / Scan of ID Document *</span>
                      </label>
                      {backImage && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Attached</span>}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      id="backImageInput"
                      onChange={(e) => handleFileChange(e, setBackImage, setBackName)}
                      className="hidden"
                    />

                    {backImage ? (
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={backImage} alt="Back ID" className="w-12 h-12 object-cover rounded-md border" />
                          <span className="text-xs font-medium text-gray-700 truncate">{backName || "Back_ID.jpg"}</span>
                        </div>
                        <label htmlFor="backImageInput" className="text-xs font-bold text-[#D31C2B] cursor-pointer hover:underline shrink-0">
                          Change
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="backImageInput" className="flex flex-col items-center justify-center py-6 cursor-pointer text-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs font-bold text-gray-700">Click to upload or drag & drop Back ID photo</p>
                        <p className="text-[11px] text-gray-500 mt-1">Required for Driver's License & National ID</p>
                      </label>
                    )}
                  </div>
                )}

                {/* SELFIE UPLOAD (Optional) */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>3. Selfie Holding ID Document (Optional)</span>
                    </label>
                    {selfieImage && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Attached</span>}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    id="selfieImageInput"
                    onChange={(e) => handleFileChange(e, setSelfieImage, setSelfieName)}
                    className="hidden"
                  />

                  {selfieImage ? (
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={selfieImage} alt="Selfie" className="w-12 h-12 object-cover rounded-md border" />
                        <span className="text-xs font-medium text-gray-700 truncate">{selfieName || "Selfie.jpg"}</span>
                      </div>
                      <label htmlFor="selfieImageInput" className="text-xs font-bold text-[#D31C2B] cursor-pointer hover:underline shrink-0">
                        Change
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="selfieImageInput" className="flex flex-col items-center justify-center py-4 cursor-pointer text-center">
                      <p className="text-xs font-bold text-gray-600">Click to upload Selfie holding ID (Speeds up approval)</p>
                    </label>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
                <Lock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Your information is encrypted with 256-bit SSL and handled according to strict GDPR and Axi AML policies.</span>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="px-6 py-3 bg-[#D31C2B] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to Compliance...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Documents for Approval</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
