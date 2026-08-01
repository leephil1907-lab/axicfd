import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { AlertTriangle, TrendingDown, Percent, DollarSign, Shield, BookOpen } from "lucide-react";

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-red-800">HIGH RISK INVESTMENT WARNING</h2>
              <p className="text-red-700 text-sm">Trading leveraged products carries significant risk and may not be suitable for all investors.</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Risk Disclosure Statement</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Percent className="w-5 h-5 text-[#D31C2B]" /> Leverage Risk</h2>
              <p className="text-gray-600 leading-relaxed">Leverage amplifies both gains and losses. A small market movement can result in significant losses exceeding your initial deposit. With leverage up to 1:500, a 0.2% adverse move can wipe out your entire margin.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-[#D31C2B]" /> Market Risk</h2>
              <p className="text-gray-600 leading-relaxed">Financial markets are volatile and unpredictable. Prices can gap, slippage may occur, and stop-loss orders may not limit losses in fast-moving markets. Past performance is not indicative of future results.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><DollarSign className="w-5 h-5 text-[#D31C2B]" /> Counterparty Risk</h2>
              <p className="text-gray-600 leading-relaxed">When trading CFDs, you enter into a contract with us as the counterparty. In the unlikely event of our insolvency, you may not receive full compensation for your positions.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-[#D31C2B]" /> Regulatory Protection</h2>
              <p className="text-gray-600 leading-relaxed">Depending on your jurisdiction, you may be entitled to compensation schemes. However, these protections have limits and may not cover all losses. Professional clients waive certain regulatory protections.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#D31C2B]" /> Seek Independent Advice</h2>
              <p className="text-gray-600 leading-relaxed">We strongly recommend seeking independent financial advice before trading. Ensure you fully understand the risks involved and only trade with money you can afford to lose.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
