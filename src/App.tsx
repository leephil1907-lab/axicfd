import { Routes, Route, useLocation } from "react-router";
import { Suspense, lazy, ComponentType } from "react";
import { I18nProvider } from "./hooks/useI18n";
import Navbar from "./sections/Navbar";
import Footer from "./sections/Footer";
import TopBar from "./sections/TopBar";
import LiveChat from "./components/LiveChat";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";

// ── Lazy load pages with auto-retry on dynamic chunk fetch errors ───────
const lazyRetry = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) =>
  lazy(async () => {
    try {
      const component = await factory();
      sessionStorage.removeItem("retry-lazy-refreshed");
      return component;
    } catch (error) {
      const storageKey = "retry-lazy-refreshed";
      const hasRefreshed = sessionStorage.getItem(storageKey);
      if (!hasRefreshed) {
        sessionStorage.setItem(storageKey, "true");
        window.location.reload();
      }
      throw error;
    }
  });

const MT4TradingPage = lazyRetry(() => import("./pages/MT4TradingPage"));
const MT5TradingPage = lazyRetry(() => import("./pages/MT5TradingPage"));
const AxiSelectPage = lazyRetry(() => import("./pages/AxiSelectPage"));
const TradingSessionsPage = lazyRetry(() => import("./pages/TradingSessionsPage"));
const FAQPage = lazyRetry(() => import("./pages/FAQPage"));
const ContactPage = lazyRetry(() => import("./pages/ContactPage"));
const BlogPage = lazyRetry(() => import("./pages/BlogPage"));
const BlogPost = lazyRetry(() => import("./pages/BlogPost"));
const TermsOfService = lazyRetry(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazyRetry(() => import("./pages/PrivacyPolicy"));
const RiskDisclosure = lazyRetry(() => import("./pages/RiskDisclosure"));
const CookiePolicy = lazyRetry(() => import("./pages/CookiePolicy"));
const GDPRCompliance = lazyRetry(() => import("./pages/GDPRCompliance"));
const AMLPolicy = lazyRetry(() => import("./pages/AMLPolicy"));
const KYCPolicy = lazyRetry(() => import("./pages/KYCPolicy"));
const RefundPolicy = lazyRetry(() => import("./pages/RefundPolicy"));
const Disclaimer = lazyRetry(() => import("./pages/Disclaimer"));
const ComplaintsProcedure = lazyRetry(() => import("./pages/ComplaintsProcedure"));
const ConflictsOfInterest = lazyRetry(() => import("./pages/ConflictsOfInterest"));
const BestExecutionPolicy = lazyRetry(() => import("./pages/BestExecutionPolicy"));
const LeveragePolicy = lazyRetry(() => import("./pages/LeveragePolicy"));
const NegativeBalanceProtection = lazyRetry(() => import("./pages/NegativeBalanceProtection"));
const InvestorCompensation = lazyRetry(() => import("./pages/InvestorCompensation"));
const RegulatoryInformation = lazyRetry(() => import("./pages/RegulatoryInformation"));
const Licenses = lazyRetry(() => import("./pages/Licenses"));
const FeesSchedule = lazyRetry(() => import("./pages/FeesSchedule"));
const TradingHours = lazyRetry(() => import("./pages/TradingHours"));
const Accessibility = lazyRetry(() => import("./pages/Accessibility"));

const GoogleFormsPage = lazyRetry(() => import("./pages/GoogleFormsPage"));
const RegisterPage = lazyRetry(() => import("./pages/RegisterPage"));
const TradingDashboard = lazyRetry(() => import("./pages/TradingDashboard"));
const AdminDashboard = lazyRetry(() => import("./pages/AdminDashboard"));
const FundsPage = lazyRetry(() => import("./pages/FundsPage"));
const DepositWithdrawPage = lazyRetry(() => import("./pages/DepositsWithdrawals"));
const UserDepositPage = lazyRetry(() => import("./pages/UserDepositPage"));
const UserWithdrawalPage = lazyRetry(() => import("./pages/UserWithdrawalPage"));
const SettingsPage = lazyRetry(() => import("./pages/SettingsPage"));
const MarketsPage = lazyRetry(() => import("./pages/MarketsPage"));
const ForexPage = lazyRetry(() => import("./pages/ForexPage"));
const CryptoPage = lazyRetry(() => import("./pages/CryptoPage"));
const CommoditiesPage = lazyRetry(() => import("./pages/CommoditiesPage"));
const IndicesPage = lazyRetry(() => import("./pages/IndicesPage"));
const SharesPage = lazyRetry(() => import("./pages/SharesPage"));
const TradingToolsPage = lazyRetry(() => import("./pages/TradingToolsPage"));
const PlatformsPage = lazyRetry(() => import("./pages/PlatformsPage"));
const LearnToTradePage = lazyRetry(() => import("./pages/LearnToTradePage"));
const PartnershipsPage = lazyRetry(() => import("./pages/PartnershipsPage"));
const ManCityPage = lazyRetry(() => import("./pages/ManCityPage"));
const CompanyPage = lazyRetry(() => import("./pages/CompanyPage"));
const HelpCenterPage = lazyRetry(() => import("./pages/HelpCenterPage"));
const OpenAccountPage = lazyRetry(() => import("./pages/OpenAccountPage"));
const Home = lazyRetry(() => import("./pages/Home"));
const Login = lazyRetry(() => import("./pages/Login"));
const SignUp = lazyRetry(() => import("./pages/SignUp"));
const NotFound = lazyRetry(() => import("./pages/NotFound"));
const SimulatedStripePage = lazyRetry(() => import("./pages/SimulatedStripePage"));
const SimulatedNowpaymentsPage = lazyRetry(() => import("./pages/SimulatedNowpaymentsPage"));

function App() {
  const location = useLocation();
  const globalLayoutPaths = [
    "/",
    "/markets",
    "/trading-tools",
    "/platforms",
    "/learn",
    "/partnerships",
    "/manchester-city",
    "/mancity",
    "/company",
    "/help",
    "/open-account",
    "/workspace-forms",
    "/trading-sessions",
    "/axi-select",
    "/blog",
    "/faq",
    "/contact"
  ];
  const showGlobalLayout = globalLayoutPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path + "/")
  );

  return (
    <I18nProvider>
      <ErrorBoundary>
        {showGlobalLayout && <Navbar />}
        <div className={showGlobalLayout ? "pt-[60px] md:pt-[64px]" : ""}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]"><div className="animate-spin w-8 h-8 border-2 border-[#FFC800] border-t-transparent rounded-full" /></div>}>
            <Routes>
                                {/* MT4/MT5 Trading Pages */}
                <Route path="/platforms/mt4" element={<MT4TradingPage />} />
                <Route path="/platforms/mt5" element={<MT5TradingPage />} />

                {/* Landing Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/markets/forex" element={<ForexPage />} />
                <Route path="/markets/crypto" element={<CryptoPage />} />
                <Route path="/markets/commodities" element={<CommoditiesPage />} />
                <Route path="/markets/indices" element={<IndicesPage />} />
                <Route path="/markets/shares" element={<SharesPage />} />
                <Route path="/trading-tools" element={<TradingToolsPage />} />
                <Route path="/platforms" element={<PlatformsPage />} />
                <Route path="/learn" element={<LearnToTradePage />} />
                <Route path="/partnerships" element={<PartnershipsPage />} />
                <Route path="/manchester-city" element={<ManCityPage />} />
                <Route path="/mancity" element={<ManCityPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/open-account" element={<OpenAccountPage />} />
                <Route path="/workspace-forms" element={<GoogleFormsPage />} />

                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/login-old" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Trading Dashboard */}
                <Route path="/dashboard" element={<TradingDashboard isDemoPage={false} />} />
                <Route path="/trading" element={<TradingDashboard isDemoPage={false} />} />
                <Route path="/trading-sessions" element={<TradingSessionsPage />} />
                <Route path="/demo-trading" element={<TradingDashboard isDemoPage={true} />} />

                {/* Funds */}
                <Route path="/funds" element={<FundsPage />} />
                <Route path="/deposit-withdraw" element={<DepositWithdrawPage />} />
                <Route path="/deposit" element={<UserDepositPage />} />
                <Route path="/withdrawal" element={<UserWithdrawalPage />} />

                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-v2" element={<AdminDashboard />} />
                <Route path="/axi-select" element={<AxiSelectPage />} />
                <Route path="/leaderboard" element={<AxiSelectPage />} />

                {/* 404 */}
                                {/* Legal Pages */}
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/risk-disclosure" element={<RiskDisclosure />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
                <Route path="/aml-policy" element={<AMLPolicy />} />
                <Route path="/kyc-policy" element={<KYCPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/complaints-procedure" element={<ComplaintsProcedure />} />
                <Route path="/conflicts-of-interest" element={<ConflictsOfInterest />} />
                <Route path="/best-execution-policy" element={<BestExecutionPolicy />} />
                <Route path="/leverage-policy" element={<LeveragePolicy />} />
                <Route path="/negative-balance-protection" element={<NegativeBalanceProtection />} />
                <Route path="/investor-compensation" element={<InvestorCompensation />} />
                <Route path="/regulatory-information" element={<RegulatoryInformation />} />
                <Route path="/licenses" element={<Licenses />} />
                <Route path="/fees-schedule" element={<FeesSchedule />} />
                <Route path="/trading-hours" element={<TradingHours />} />
                <Route path="/accessibility" element={<Accessibility />} />

                {/* Support Pages */}
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPost />} />

                {/* Simulated Gateways */}
                <Route path="/simulated-stripe" element={<SimulatedStripePage />} />
                <Route path="/simulated-nowpayments" element={<SimulatedNowpaymentsPage />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          {showGlobalLayout && <Footer />}
          <LiveChat />
          <Toaster position="top-right" richColors />
      </ErrorBoundary>
    </I18nProvider>
  );
}

export default App;
