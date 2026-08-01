import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Shield, Search, FileCheck, Ban } from "lucide-react";

export default function AMLPolicy() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Anti-Money Laundering Policy</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-[#D31C2B]" /> Our Commitment</h2>
              <p className="text-gray-600">AXI Trading is fully committed to preventing money laundering and terrorist financing. We comply with all applicable AML regulations including FATF recommendations.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Search className="w-5 h-5 text-[#D31C2B]" /> Customer Due Diligence</h2>
              <p className="text-gray-600">We verify all customers through KYC procedures including identity verification, address confirmation, and source of funds checks.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileCheck className="w-5 h-5 text-[#D31C2B]" /> Monitoring</h2>
              <p className="text-gray-600">All transactions are monitored for suspicious activity. We report suspicious transactions to relevant authorities as required by law.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Ban className="w-5 h-5 text-[#D31C2B]" /> Prohibited Activities</h2>
              <p className="text-gray-600">We do not accept third-party deposits, anonymous accounts, or business from jurisdictions under sanctions. We reserve the right to refuse service and report suspicious activity.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
