import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { FileText, AlertTriangle, Scale, Gavel, Handshake, Clock } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: July 12, 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-[#D31C2B]" /> Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed">By accessing or using AXI Trading services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Scale className="w-5 h-5 text-[#D31C2B]" /> Eligibility</h2>
              <p className="text-gray-600 leading-relaxed">You must be at least 18 years old and legally capable of entering into contracts. You must not be a resident of jurisdictions where CFD trading is prohibited.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#D31C2B]" /> Risk Disclosure</h2>
              <p className="text-gray-600 leading-relaxed">CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 74-89% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Gavel className="w-5 h-5 text-[#D31C2B]" /> Account Rules</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>One person may only hold one live account unless approved by us</li>
                <li>Account information must be accurate and kept current</li>
                <li>You are responsible for maintaining account security</li>
                <li>We reserve the right to suspend accounts for suspicious activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Handshake className="w-5 h-5 text-[#D31C2B]" /> Deposits & Withdrawals</h2>
              <p className="text-gray-600 leading-relaxed">All deposits must come from accounts in your name. Withdrawals will be processed to the original deposit method where possible. Processing times vary by method.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-[#D31C2B]" /> Termination</h2>
              <p className="text-gray-600 leading-relaxed">We may terminate or suspend your account immediately for violations of these terms. You may close your account at any time subject to settlement of open positions.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
