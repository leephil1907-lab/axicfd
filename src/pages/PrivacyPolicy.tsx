import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Shield, Lock, Eye, Database, Share2, Globe, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <TopBar /><Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: July 12, 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-[#D31C2B]" /> Introduction</h2>
              <p className="text-gray-600 leading-relaxed">AXI Trading ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, trading platforms, and services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Database className="w-5 h-5 text-[#D31C2B]" /> Information We Collect</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Personal Information:</strong> Name, email, phone, address, date of birth, nationality</li>
                <li><strong>Financial Information:</strong> Bank details, payment method information, transaction history</li>
                <li><strong>Trading Data:</strong> Positions, orders, account balances, trading history</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                <li><strong>KYC Documents:</strong> ID, passport, proof of address, utility bills</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Eye className="w-5 h-5 text-[#D31C2B]" /> How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide and maintain our trading services</li>
                <li>Process deposits, withdrawals, and transfers</li>
                <li>Verify identity and comply with KYC/AML regulations</li>
                <li>Send service notifications and market updates</li>
                <li>Improve our platforms and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Share2 className="w-5 h-5 text-[#D31C2B]" /> Data Sharing</h2>
              <p className="text-gray-600 leading-relaxed">We do not sell your personal data. We may share information with:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                <li>Regulatory authorities (FCA, CySEC, ASIC) as required by law</li>
                <li>Payment processors for transaction execution</li>
                <li>Identity verification services for KYC compliance</li>
                <li>Technology providers who assist in platform operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Lock className="w-5 h-5 text-[#D31C2B]" /> Data Security</h2>
              <p className="text-gray-600 leading-relaxed">We implement industry-standard security measures including 256-bit SSL encryption, two-factor authentication, regular security audits, and segregated client funds held in tier-1 banks.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-[#D31C2B]" /> International Transfers</h2>
              <p className="text-gray-600 leading-relaxed">Your data may be transferred to and processed in countries outside your jurisdiction. We ensure adequate protection through Standard Contractual Clauses and adequacy decisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Mail className="w-5 h-5 text-[#D31C2B]" /> Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">For privacy-related inquiries, contact our Data Protection Officer at privacy@axi-trading.com or through our Help Center.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
