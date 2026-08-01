import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Shield, UserX, Eye, FileText, Mail } from "lucide-react";

export default function GDPRCompliance() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">GDPR Compliance</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights Under GDPR</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to processing for marketing purposes</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h2>
              <p className="text-gray-600">Contact our Data Protection Officer at dpo@axi-trading.com or submit a request through your account settings.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
