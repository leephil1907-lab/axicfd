import { Link } from "react-router";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import Breadcrumb from "@/components/Breadcrumb";

export default function RegulatoryInformation() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar />
      <Navbar />
      <Breadcrumb items={[{ label: "Regulatory Information" }]} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Regulatory Information</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p className="leading-relaxed">This Regulatory Information governs your use of AXI Trading services. By accessing or using our platform, you agree to be bound by these terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Definitions</h2>
              <p className="leading-relaxed">"AXI Trading" refers to AXI Trading Ltd and its affiliates. "Platform" refers to our website, trading platforms, and mobile applications.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Eligibility</h2>
              <p className="leading-relaxed">You must be at least 18 years old and legally capable of entering into contracts. Services are not available in restricted jurisdictions.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Account Registration</h2>
              <p className="leading-relaxed">You must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Trading Services</h2>
              <p className="leading-relaxed">We provide CFD trading services on various financial instruments. All trading involves significant risk of loss.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Information</h2>
              <p className="leading-relaxed">For questions regarding this Regulatory Information, contact us at legal@axi-trading.com or call +1-800-888-8888.</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last Updated: July 12, 2026. For questions, contact 
              <a href="mailto:legal@axi-trading.com" className="text-[#D31C2B] hover:underline">legal@axi-trading.com</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
