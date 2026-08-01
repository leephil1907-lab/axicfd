import { trpc } from "@/providers/trpc";
import { useCallback, useMemo, useState } from "react";
import { useFirebase } from "@/providers/FirebaseProvider";

export function useAuth() {
  const utils = trpc.useUtils();
  const { isFirebase, firebaseUser, userProfile, isLoading: firebaseLoading, logoutFromFirebase, loginWithGoogle } = useFirebase();
  
  // Local storage user state
  const [localStoredUser, setLocalStoredUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem("local_auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const { data: oauthUser, isLoading: oauthLoading } = trpc.auth.me.useQuery(undefined, { 
    staleTime: 1000 * 60 * 5, 
    retry: false,
    enabled: !localStoredUser && !isFirebase
  });
  
  const { data: localUser, isLoading: localLoading } = trpc.localAuth.me.useQuery(undefined, { 
    staleTime: 1000 * 60 * 5, 
    retry: false,
    enabled: !localStoredUser && !isFirebase
  });

  const logoutMutation = trpc.auth.logout.useMutation({ 
    onSuccess: async () => { 
      await utils.invalidate(); 
    } 
  });

  // Merge Firebase user profile with existing user types
  const user = isFirebase ? userProfile : (localStoredUser || oauthUser || localUser || null);
  const isLoading = isFirebase ? firebaseLoading : (!localStoredUser && (oauthLoading || localLoading));
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const login = useCallback((token: string, userData: any) => {
    localStorage.setItem("local_auth_token", token);
    localStorage.setItem("local_auth_user", JSON.stringify(userData));
    setLocalStoredUser(userData);
    utils.invalidate();
  }, [utils]);

  const logout = useCallback(() => {
    if (isFirebase) {
      logoutFromFirebase().then(() => {
        window.location.href = '/';
      });
    } else {
      localStorage.removeItem("local_auth_token");
      localStorage.removeItem("local_auth_user");
      setLocalStoredUser(null);
      logoutMutation.mutate(undefined, { 
        onSettled: () => {
          window.location.href = '/';
        } 
      });
    }
  }, [isFirebase, logoutFromFirebase, logoutMutation]);

  return useMemo(() => ({ 
    user, 
    isAuthenticated, 
    isAdmin, 
    isLoading, 
    logout, 
    login, 
    isFirebase, 
    loginWithGoogle 
  }), [user, isAuthenticated, isAdmin, isLoading, logout, login, isFirebase, loginWithGoogle]);
}
