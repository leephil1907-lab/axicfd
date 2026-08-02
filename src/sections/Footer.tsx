import { Link } from "react-router";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

export default function Footer() {

  return (
    <footer className="relative z-10 bg-[#0F1015] border-t border-gray-900 text-gray-400 font-sans select-none">
      
      {/* SECTION 1: Top Dynamic CTA Bar */}
      <div className="bg-gradient-to-r from-[#16171E] to-[#0D0E12] border-y border-[#D31C2B]/20 py-12 px-6">
        <div className="container-axi flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D31C2B] animate-pulse"></span>
              <span>Join over 60,000+ elite global traders</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Start Trading Your Edge with Axi
            </h3>
            <p className="mt-1 text-sm text-white/80 max-w-2xl font-medium">
              Open a premium live trading account in minutes. Secure your capital, enjoy spreads from 0.0 pips, and gain institutional liquidity access.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0 w-full lg:w-auto justify-start lg:justify-end">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-[#D31C2B] hover:bg-white text-white hover:text-black font-black text-xs uppercase tracking-[1.5px] rounded transition-all shadow-lg shadow-black/10 active:scale-95"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Open Live Account
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 2: Corporate Contact Information Strip */}
      <div className="bg-[#12131A] border-b border-gray-900 py-6 px-6">
        <div className="container-axi grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-semibold">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-800/60 flex items-center justify-center text-[#D31C2B]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white uppercase font-black text-[10px] tracking-wider text-gray-500">Support Hours</p>
              <Link to="/contact" className="text-gray-300 hover:text-white mt-0.5 block transition-colors">24/7 Customer Support Live</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-800/60 flex items-center justify-center text-[#D31C2B]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white uppercase font-black text-[10px] tracking-wider text-gray-500">Contact Email</p>
              <a href="mailto:axicustomersupport@gmail.com" className="text-gray-300 hover:text-white mt-0.5 block transition-colors">axicustomersupport@gmail.com</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-800/60 flex items-center justify-center text-[#D31C2B]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white uppercase font-black text-[10px] tracking-wider text-gray-500">Enquiry Email</p>
              <a href="mailto:customersupport@axitrades.com" className="text-gray-300 hover:text-white mt-0.5 block transition-colors">customersupport@axitrades.com</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-800/60 flex items-center justify-center text-[#D31C2B]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white uppercase font-black text-[10px] tracking-wider text-gray-500">WhatsApp Support</p>
              <a href="https://wa.me/18649358993" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white mt-0.5 block transition-colors">+18649358993</a>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Five-Column Sitemap Structure */}
      <div className="container-axi py-16 px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 text-left">
          
          {/* Column 1: Quick Links */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] mb-5 text-[#D31C2B] border-l-2 border-[#D31C2B] pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/trading" className="hover:text-white transition-colors">Live Account</Link></li>
              <li><Link to="/demo-trading" className="hover:text-white transition-colors">Demo Account</Link></li>
              <li><Link to="/deposit" className="hover:text-white transition-colors">Payment Methods</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Reset Password</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Centre</Link></li>
              <li><Link to="/platforms/mt4" className="hover:text-white transition-colors">Download MT4</Link></li>
              <li><Link to="/platforms/mt5" className="hover:text-white transition-colors">Download MT5</Link></li>
            </ul>
          </div>

          {/* Column 2: Trading & Markets */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] mb-5 text-[#D31C2B] border-l-2 border-[#D31C2B] pl-2">
              Trading & Markets
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/markets" className="hover:text-white transition-colors">All Markets</Link></li>
              <li><Link to="/markets/forex" className="hover:text-white transition-colors">Forex Trading</Link></li>
              <li><Link to="/markets/crypto" className="hover:text-white transition-colors">Cryptocurrency</Link></li>
              <li><Link to="/markets/shares" className="hover:text-white transition-colors">Share CFDs</Link></li>
              <li><Link to="/markets/indices" className="hover:text-white transition-colors">Indices</Link></li>
              <li><Link to="/markets/commodities" className="hover:text-white transition-colors">Commodities & Gold</Link></li>
              <li><Link to="/trading-tools" className="hover:text-white transition-colors">Trading Tools</Link></li>
            </ul>
          </div>

          {/* Column 3: Education */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] mb-5 text-[#D31C2B] border-l-2 border-[#D31C2B] pl-2">
              Education
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/blog" className="hover:text-white transition-colors">Axi Blog</Link></li>
              <li><Link to="/learn" className="hover:text-white transition-colors">Axi Academy</Link></li>
              <li><Link to="/learn" className="hover:text-white transition-colors">Free eBooks</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/trading-hours" className="hover:text-white transition-colors">Trading Hours</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] mb-5 text-[#D31C2B] border-l-2 border-[#D31C2B] pl-2">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/fees-schedule" className="hover:text-white transition-colors">Fees and Charges</Link></li>
              <li><Link to="/regulatory-information" className="hover:text-white transition-colors">Legal Documentation</Link></li>
              <li><Link to="/fees-schedule" className="hover:text-white transition-colors">Product Schedule</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Client Agreement</Link></li>
              <li><Link to="/risk-disclosure" className="hover:text-white transition-colors">Risk Disclosure</Link></li>
              <li><Link to="/complaints-procedure" className="hover:text-white transition-colors">Complaints Handling</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 5: Client Support */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] mb-5 text-[#D31C2B] border-l-2 border-[#D31C2B] pl-2">
              Client Support
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/contact" className="hover:text-white transition-colors">Request a Callback</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">WhatsApp Support</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Centre</Link></li>
              <li><Link to="/deposit" className="hover:text-white transition-colors">Deposit Funds</Link></li>
              <li><Link to="/withdrawal" className="hover:text-white transition-colors">Withdraw Funds</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 4: Head Offices & Regional Presence */}
      <div className="bg-[#0B0C10] border-t border-b border-gray-900 py-10 px-6 text-xs text-gray-500 font-semibold">
        <div className="container-axi grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h5 className="text-gray-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D31C2B]" />
              <span>United Kingdom Office</span>
            </h5>
            <p className="leading-relaxed">
              Axi Financial Services (UK) Limited<br />
              1 Finsbury Market, London EC2A 2BN, United Kingdom<br />
              Authorised and regulated by the Financial Conduct Authority (FCA Reference Number 466201)
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-gray-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D31C2B]" />
              <span>Australian Head Office</span>
            </h5>
            <p className="leading-relaxed">
              AxiCorp Financial Services Pty Ltd<br />
              Level 10, 90 Arthur Street, North Sydney NSW 2060, Australia<br />
              Authorised and regulated by the Australian Securities and Investments Commission (ASIC Regulated AFSL 318232)
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: Highly-Detailed Regulatory Disclosure Blocks */}
      <div className="container-axi py-12 px-6 text-left text-[10px] leading-relaxed text-gray-500 font-semibold space-y-6">
        
        <p className="border-l-2 border-[#D31C2B] pl-4 bg-red-950/20 p-4 rounded text-gray-400">
          <strong className="text-[#D31C2B] font-black tracking-wider uppercase block mb-1">RISK WARNING / LEVERAGE WARNING:</strong> 
          Warning: Spread betting and derivatives trading both a high level of risk to your capital with the possibility of losing your initial investment. These products may not be suitable for all investors, and are not available to individuals under the age of 18. Please ensure that you are fully aware of the risks involved and refer to our <Link to="/risk-disclosure" className="text-red-400 underline">Risk Warning</Link>. If necessary, seek independent financial advice. The Customer Agreement and Execution Policy available at <Link to="/terms-of-service" className="text-red-400 underline">Legal Documentation</Link> are important and should be reviewed prior to deciding whether to acquire, hold or dispose of Axi’s products.
        </p>

        <p>
          Axi is a trading name of Axi Financial Services (UK) Limited which is registered in England and Wales under number 6050593. Axi Financial Services (UK) Limited is authorised and regulated by the Financial Conduct Authority - Firm Reference Number 466201. Our registered address is 1 Finsbury Market, London EC2A 2BN.
        </p>

        {/* Brand Copyright and Social Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-900 mt-6">
          <div className="flex flex-wrap items-center gap-4">
            <img 
              src="https://d2tpnh780x5es.cloudfront.net/rebrand-prod/onla2r0j/logo-red2.svg" 
              alt="Axi Logo" 
              className="h-6 object-contain" 
              referrerPolicy="no-referrer"
            />
            <p className="text-gray-500 font-semibold text-[11px]">
              &copy; {new Date().getFullYear()} Axi Financial Services (UK) Limited. All rights reserved. | Global Forex & CFD Broker.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/axiofficial.UK" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800/60 hover:bg-[#D31C2B] hover:text-white flex items-center justify-center text-gray-400 transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com/axiofficial_UK" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800/60 hover:bg-[#D31C2B] hover:text-white flex items-center justify-center text-gray-400 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/axiofficial_uk/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800/60 hover:bg-[#D31C2B] hover:text-white flex items-center justify-center text-gray-400 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/axicorp/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800/60 hover:bg-[#D31C2B] hover:text-white flex items-center justify-center text-gray-400 transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

    </footer>
  );
}
