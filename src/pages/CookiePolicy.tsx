import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Cookie, Settings, Eye, Shield } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">What Are Cookies</h2>
              <p className="text-gray-600">Cookies are small text files stored on your device that help us provide and improve our services.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Types We Use</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Essential:</strong> Required for platform functionality</li>
                <li><strong>Analytical:</strong> Help us understand user behavior</li>
                <li><strong>Marketing:</strong> Used for personalized advertising</li>
                <li><strong>Preference:</strong> Remember your settings and choices</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
