import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Position, Transaction } from '@/types';

interface FirebaseContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: any | null;
  isLoading: boolean;
  isFirebase: boolean;
  positions: Position[];
  transactions: Transaction[];
  loginWithGoogle: () => Promise<any>;
  logoutFromFirebase: () => Promise<void>;
  googleAccessToken: string | null;
  setGoogleAccessToken: (token: string | null) => void;
  openPositionInFirestore: (params: {
    symbol: string;
    direction: 'Buy' | 'Sell';
    volume: number;
    openPrice: number;
    sl?: number;
    tp?: number;
  }) => Promise<void>;
  closePositionInFirestore: (posId: string, currentPrice: number, pnl: number) => Promise<void>;
  createTransactionInFirestore: (params: {
    type: 'deposit' | 'withdrawal';
    amount: number;
    currency: string;
    method: string;
  }) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  // Restore token on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('google_access_token');
      if (savedToken) {
        setGoogleAccessToken(savedToken);
      }
    } catch (e) {}
  }, []);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUserProfile(null);
        setPositions([]);
        setTransactions([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Monitor User Document and Nested Collections once authenticated
  useEffect(() => {
    if (!firebaseUser) return;

    const uid = firebaseUser.uid;

    // 1. Real-time User Profile sync
    const unsubscribeProfile = onSnapshot(doc(db, 'users', uid), async (snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.data());
      } else {
        // Create initial default user profile document if it doesn't exist (0.00 balance until real deposit)
        const defaultProfile = {
          id: uid,
          name: firebaseUser.displayName || 'Axi Trader',
          email: firebaseUser.email || '',
          role: 'user',
          balance: 0.00,
          equity: 0.00,
          joined: new Date().toISOString().split('T')[0],
          phone: firebaseUser.phoneNumber || '',
          country: 'AU',
          language: 'en',
          currency: 'USD'
        };
        try {
          await setDoc(doc(db, 'users', uid), defaultProfile);
          setUserProfile(defaultProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
        }
      }
      setIsLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
      setIsLoading(false);
    });

    // 2. Real-time Positions sync
    const unsubscribePositions = onSnapshot(collection(db, 'users', uid, 'positions'), (snapshot) => {
      const posList: Position[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        posList.push({
          id: data.id,
          symbol: data.symbol,
          name: data.name || data.symbol,
          type: data.direction as 'Buy' | 'Sell', // copy to type for App's native Position type compatibility
          volume: data.volume,
          openPrice: data.openPrice,
          currentPrice: data.currentPrice,
          sl: data.sl || undefined,
          tp: data.tp || undefined,
          time: data.time || new Date().toISOString(),
          pnl: data.pnl || 0,
          status: data.status || 'open'
        } as any);
      });
      setPositions(posList);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/positions`);
    });

    // 3. Real-time Transactions sync
    const unsubscribeTransactions = onSnapshot(collection(db, 'users', uid, 'transactions'), (snapshot) => {
      const txList: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        txList.push({
          id: data.id,
          userId: 0, // mock legacy fields
          userName: data.userName || '',
          userEmail: data.userEmail || '',
          type: data.type as 'deposit' | 'withdrawal',
          amount: data.amount,
          currency: data.currency,
          method: data.method || '',
          status: data.status as 'pending' | 'approved' | 'rejected',
          reason: data.reason || undefined,
          createdAt: data.createdAt
        });
      });
      setTransactions(txList);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/transactions`);
    });

    return () => {
      unsubscribeProfile();
      unsubscribePositions();
      unsubscribeTransactions();
    };
  }, [firebaseUser]);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive');
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/forms.body');
    provider.addScope('https://www.googleapis.com/auth/forms.body.readonly');
    provider.addScope('https://www.googleapis.com/auth/forms.responses.readonly');
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
        try {
          localStorage.setItem('google_access_token', credential.accessToken);
        } catch (e) {}
      }
      return result.user;
    } catch (err: any) {
      setIsLoading(false);
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        console.log('Google Auth popup was closed by user.');
        return null;
      }
      console.error('Google Auth Sign In Error:', err);
      throw err;
    }
  }, []);

  const logoutFromFirebase = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setGoogleAccessToken(null);
      try {
        localStorage.removeItem('google_access_token');
      } catch (e) {}
    } catch (err) {
      console.error('Sign Out Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openPositionInFirestore = useCallback(async (params: {
    symbol: string;
    direction: 'Buy' | 'Sell';
    volume: number;
    openPrice: number;
    sl?: number;
    tp?: number;
  }) => {
    if (!firebaseUser) return;
    const uid = firebaseUser.uid;
    const posId = `pos-${Date.now()}`;
    const newPosition = {
      id: posId,
      userId: uid,
      symbol: params.symbol,
      name: params.symbol,
      direction: params.direction,
      volume: params.volume,
      openPrice: params.openPrice,
      currentPrice: params.openPrice,
      sl: params.sl || null,
      tp: params.tp || null,
      pnl: 0,
      status: 'open',
      time: new Date().toISOString()
    };
    const path = `users/${uid}/positions/${posId}`;
    try {
      await setDoc(doc(db, 'users', uid, 'positions', posId), newPosition);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }, [firebaseUser]);

  const closePositionInFirestore = useCallback(async (posId: string, currentPrice: number, pnl: number) => {
    if (!firebaseUser || !userProfile) return;
    const uid = firebaseUser.uid;
    const path = `users/${uid}/positions/${posId}`;
    try {
      // Update position status
      await updateDoc(doc(db, 'users', uid, 'positions', posId), {
        status: 'closed',
        currentPrice,
        pnl
      });

      // Update user balance
      const newBalance = userProfile.balance + pnl;
      const newEquity = userProfile.equity + pnl;
      await updateDoc(doc(db, 'users', uid), {
        balance: newBalance,
        equity: newEquity
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }, [firebaseUser, userProfile]);

  const createTransactionInFirestore = useCallback(async (params: {
    type: 'deposit' | 'withdrawal';
    amount: number;
    currency: string;
    method: string;
  }) => {
    if (!firebaseUser || !userProfile) return;
    const uid = firebaseUser.uid;
    const txId = `tx-${Date.now()}`;
    
    // All deposit and withdrawal transactions require manual admin compliance review
    const status = 'pending';
    
    const newTx = {
      id: txId,
      userId: uid,
      userName: userProfile.name,
      userEmail: userProfile.email,
      type: params.type,
      amount: params.amount,
      currency: params.currency,
      method: params.method,
      status: status,
      createdAt: new Date().toISOString()
    };

    const txPath = `users/${uid}/transactions/${txId}`;
    try {
      // Log transaction as pending review
      await setDoc(doc(db, 'users', uid, 'transactions', txId), newTx);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, txPath);
    }
  }, [firebaseUser, userProfile]);

  const isFirebase = !!firebaseUser;

  const value = useMemo(() => ({
    firebaseUser,
    userProfile,
    isLoading,
    isFirebase,
    positions,
    transactions,
    loginWithGoogle,
    logoutFromFirebase,
    googleAccessToken,
    setGoogleAccessToken,
    openPositionInFirestore,
    closePositionInFirestore,
    createTransactionInFirestore
  }), [
    firebaseUser,
    userProfile,
    isLoading,
    isFirebase,
    positions,
    transactions,
    loginWithGoogle,
    logoutFromFirebase,
    googleAccessToken,
    setGoogleAccessToken,
    openPositionInFirestore,
    closePositionInFirestore,
    createTransactionInFirestore
  ]);

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    return {
      firebaseUser: null,
      userProfile: null,
      isLoading: false,
      isFirebase: false,
      positions: [],
      transactions: [],
      loginWithGoogle: async () => {},
      logoutFromFirebase: async () => {},
      googleAccessToken: null,
      setGoogleAccessToken: () => {},
      openPositionInFirestore: async () => {},
      closePositionInFirestore: async () => {},
      createTransactionInFirestore: async () => {},
    };
  }
  return context;
};
