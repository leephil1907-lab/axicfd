import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import RiskWarning from "../sections/RiskWarning";
import LoginModal from "./LoginModal";
import LiveChat from "./LiveChat";
import { useAuth } from "../hooks/useAuth";
import { Clock } from "lucide-react";
import { toast } from "sonner";

export default function Layout() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(30);

  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set inactivity warning after 120 seconds (2 minutes)
  const INACTIVITY_LIMIT = 120000;

  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated) return;

    // Clear any existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Reset countdown and warning if active
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    setShowInactivityWarning(false);
    setInactivityCountdown(30);

    // Schedule new warning modal after inactivity limit
    activityTimeoutRef.current = setTimeout(() => {
      setShowInactivityWarning(true);
      
      // Start 30s countdown ticking down every second
      let currentCount = 30;
      setInactivityCountdown(currentCount);

      countdownIntervalRef.current = setInterval(() => {
        currentCount -= 1;
        setInactivityCountdown(currentCount);

        if (currentCount <= 0) {
          // Time is up! Perform automatic logout
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
          logout();
          setShowInactivityWarning(false);
          toast.error("Session Expired", {
            description: "You have been logged out automatically due to inactivity.",
            duration: 8000,
          });
        }
      }, 1000);

    }, INACTIVITY_LIMIT);
  }, [isAuthenticated, logout]);

  // Track user events for activity
  useEffect(() => {
    if (!isAuthenticated) {
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setShowInactivityWarning(false);
      return;
    }

    // Initialize timer on mount or auth state change
    resetInactivityTimer();

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    const handleEvent = () => {
      // Only reset if warning modal is NOT currently showing
      // That way the user MUST actively click "Keep Session Active" once warning triggers
      if (!showInactivityWarning) {
        resetInactivityTimer();
      }
    };

    events.forEach(event => {
      window.addEventListener(event, handleEvent);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleEvent);
      });
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isAuthenticated, resetInactivityTimer, showInactivityWarning]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#EDE8E0" }}>
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <main className="flex-1">
        <Outlet context={{ setLoginOpen }} />
      </main>
      <Footer />
      <RiskWarning />
      
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignUp={() => { setLoginOpen(false); window.location.hash = "#/signup"; }}
      />
      <LiveChat />

      {/* Session Inactivity Warning Modal */}
      {showInactivityWarning && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1A1A1A] text-white border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="p-3 bg-red-950/40 rounded-full text-[#E31C3A] animate-pulse">
                  <Clock className="w-8 h-8" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC800] text-[10px] font-extrabold text-black">
                  !
                </span>
              </div>
              <h3 className="text-lg font-extrabold uppercase tracking-tight text-white font-sans">Inactivity Alert</h3>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                You have been inactive for a while. For your security, you will be automatically signed out in:
              </p>
            </div>

            {/* Countdown Display */}
            <div className="py-2 flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-red-950 bg-red-950/20 text-3xl font-black font-mono text-[#FFC800]">
                {inactivityCountdown}
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  resetInactivityTimer();
                  toast.success("Session extended", {
                    description: "Your session remains secure and active.",
                  });
                }}
                className="w-full bg-[#FFC800] hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors focus:outline-none"
              >
                Keep Session Active
              </button>
              <button
                onClick={() => {
                  if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
                  if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                  logout();
                  setShowInactivityWarning(false);
                  toast.info("Session ended");
                }}
                className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors"
              >
                Sign Out Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
