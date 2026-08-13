import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { safeStorage } from '../utils/storage';

export interface CryptoWalletConfig {
  address: string;
  network: string;
  memo?: string;
  active?: boolean;
}

export interface BankSettingsConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftBic: string;
  routingNumber?: string;
  bankAddress?: string;
  instructions: string;
  supportEmail?: string;
  active: boolean;
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  type: 'crypto' | 'bank' | 'card' | 'wallet' | 'other';
  currency: string;
  active: boolean;
  minDeposit: number;
  maxDeposit: number;
  feePercent: number;
  processingTime: string;
  walletAddress?: string;
  network?: string;
  memo?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  swiftBic?: string;
  routingNumber?: string;
  bankAddress?: string;
  walletIdentifier?: string;
  instructions?: string;
  iconName?: string;
}

export interface MaintenanceModeConfig {
  active: boolean;
  message: string;
  disableDeposits: boolean;
  disableTrading: boolean;
}

export interface CentralPaymentConfig {
  updatedAt: number;
  cryptoWallets: Record<string, CryptoWalletConfig>;
  bankSettings: BankSettingsConfig;
  paymentMethods: PaymentMethodItem[];
  autoApproveLimit?: number;
  requireKycForDeposit?: boolean;
  maintenanceMode?: MaintenanceModeConfig;
}

export const defaultMaintenanceMode: MaintenanceModeConfig = {
  active: false,
  message: 'System Maintenance Active: Deposits and live trading execution are temporarily paused for scheduled platform upgrades. Please check back shortly.',
  disableDeposits: true,
  disableTrading: true
};

/**
 * Default crypto wallets — bootstrap from VITE_WALLET_* env vars.
 * Prefer admin UI / Firestore system_config/wallets for live updates.
 */
function envWallet(key: string): string {
  try {
    return (import.meta.env[`VITE_WALLET_${key}`] as string) || '';
  } catch {
    return '';
  }
}

export const defaultCryptoWallets: Record<string, CryptoWalletConfig> = {
  btc: {
    address: envWallet('BTC') || 'bc1qutexfu6n36kg5cw4c0a35m4yd9m4jsz5gup89q',
    network: 'Bitcoin Mainnet',
    memo: '',
    active: true
  },
  eth: {
    address: envWallet('ETH') || '0xAeAd2Eab191a75A5a4175B1d5C1f2f84C3aE74c7',
    network: 'Ethereum (ERC20)',
    memo: '',
    active: true
  },
  usdt: {
    address: envWallet('USDT') || 'TTH6p3Ead58f4tsEdQVf5jt5eWw3xcXGpE',
    network: 'TRON (TRC20)',
    memo: '',
    active: true
  },
  usdt_erc20: {
    address: envWallet('USDT_ERC20') || '0xAeAd2Eab191a75A5a4175B1d5C1f2f84C3aE74c7',
    network: 'Ethereum (ERC20)',
    memo: '',
    active: true
  },
  usdt_bep20: {
    address: envWallet('USDT_BEP20') || '0xAeAd2Eab191a75A5a4175B1d5C1f2f84C3aE74c7',
    network: 'BNB Smart Chain (BEP20)',
    memo: '',
    active: true
  },
  usdc: {
    address: envWallet('USDC') || '0xAeAd2Eab191a75A5a4175B1d5C1f2f84C3aE74c7',
    network: 'Ethereum (ERC20)',
    memo: '',
    active: true
  },
  sol: {
    address: envWallet('SOL') || 'CabeRS9oCQkr2xCrss8FFMeL1G6jtdy7zuZxH9VqqfLF',
    network: 'Solana Mainnet',
    memo: '',
    active: true
  },
  bnb: {
    address: envWallet('BNB') || '0xAeAd2Eab191a75A5a4175B1d5C1f2f84C3aE74c7',
    network: 'BNB Smart Chain (BEP20)',
    memo: '',
    active: true
  },
  xrp: {
    address: envWallet('XRP') || 'rwyQp3eC5j6AumcptZhfmiXAykpeswZKeJ',
    network: 'Ripple (XRP) Ledger',
    memo: envWallet('XRP_MEMO') || '1076756',
    active: true
  },
  ton: {
    address: envWallet('TON') || 'EQAj7vKLbaWjaNbAuAKP1e1HwmdYZ2vJ2xtWU8qq3JafkfxF',
    network: 'TON Mainnet',
    memo: envWallet('TON_MEMO') || '1076756',
    active: true
  },
  xlm: {
    address: envWallet('XLM') || 'GCU3D3YPWLE625CYFUCYQD4KDZNQXR26JLA3YV7H3RXUZJQTKAFZWAJM',
    network: 'Stellar Network',
    memo: envWallet('XLM_MEMO') || '1076756',
    active: true
  }
};

/** Bank details bootstrap from VITE_BANK_* env vars — empty until configured. */
export const defaultBankSettings: BankSettingsConfig = {
  bankName: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BANK_NAME) || '',
  accountName: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BANK_ACCOUNT_NAME) || '',
  accountNumber: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BANK_ACCOUNT_NUMBER) || '',
  swiftBic: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BANK_SWIFT) || '',
  routingNumber: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BANK_ROUTING) || '',
  bankAddress: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BANK_ADDRESS) || '',
  instructions: 'Include your Axi Account ID in the wire transfer memo. Processing time is 1-3 business days.',
  supportEmail: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPPORT_EMAIL) || '',
  active: false
};

/** Active deposit methods: card, bank, crypto (all networks), and instant payment. */
export const defaultPaymentMethods: PaymentMethodItem[] = [
  {
    id: 'pm-card',
    name: 'Credit / Debit Card (Visa / Mastercard)',
    type: 'card',
    currency: 'USD',
    active: true,
    minDeposit: 5,
    maxDeposit: 100000,
    feePercent: 0,
    processingTime: 'Minutes (after payment + admin approval)',
    instructions: 'Pay securely via Stripe (Visa or Mastercard in your name). Minimum USD 5. Balance credited after admin verification.'
  },
  {
    id: 'pm-bank',
    name: 'Bank Transfer (Global / ACH)',
    type: 'bank',
    currency: 'USD',
    active: true,
    minDeposit: 10,
    maxDeposit: 1000000,
    feePercent: 0,
    processingTime: '1–3 business days (after clearance + admin approval)',
    bankName: defaultBankSettings.bankName,
    accountName: defaultBankSettings.accountName,
    accountNumber: defaultBankSettings.accountNumber,
    swiftBic: defaultBankSettings.swiftBic,
    instructions: 'Complete bank transfer via secure Stripe Checkout. Funds appear after bank clearance and manual admin approval.'
  },
  {
    id: 'pm-btc',
    name: 'Bitcoin (BTC)',
    type: 'crypto',
    currency: 'BTC',
    active: true,
    minDeposit: 50,
    maxDeposit: 500000,
    feePercent: 0,
    processingTime: '10-30 Mins (1 Confirmation)',
    walletAddress: defaultCryptoWallets.btc.address,
    network: defaultCryptoWallets.btc.network
  },
  {
    id: 'pm-eth',
    name: 'Ethereum (ETH)',
    type: 'crypto',
    currency: 'ETH',
    active: true,
    minDeposit: 50,
    maxDeposit: 500000,
    feePercent: 0,
    processingTime: '2-5 Mins',
    walletAddress: defaultCryptoWallets.eth.address,
    network: defaultCryptoWallets.eth.network
  },
  {
    id: 'pm-usdt-trc20',
    name: 'Tether USD (USDT - TRC20)',
    type: 'crypto',
    currency: 'USDT',
    active: true,
    minDeposit: 20,
    maxDeposit: 1000000,
    feePercent: 0,
    processingTime: 'Instant - 2 Mins',
    walletAddress: defaultCryptoWallets.usdt.address,
    network: defaultCryptoWallets.usdt.network
  },
  {
    id: 'pm-usdt-erc20',
    name: 'Tether USD (USDT - ERC20)',
    type: 'crypto',
    currency: 'USDT',
    active: true,
    minDeposit: 20,
    maxDeposit: 1000000,
    feePercent: 0,
    processingTime: '2-10 Mins',
    walletAddress: defaultCryptoWallets.usdt_erc20.address,
    network: defaultCryptoWallets.usdt_erc20.network
  },
  {
    id: 'pm-usdt-bep20',
    name: 'Tether USD (USDT - BEP20)',
    type: 'crypto',
    currency: 'USDT',
    active: true,
    minDeposit: 20,
    maxDeposit: 1000000,
    feePercent: 0,
    processingTime: '1-5 Mins',
    walletAddress: defaultCryptoWallets.usdt_bep20.address,
    network: defaultCryptoWallets.usdt_bep20.network
  },
  {
    id: 'pm-usdc',
    name: 'USD Coin (USDC - ERC20)',
    type: 'crypto',
    currency: 'USDC',
    active: true,
    minDeposit: 20,
    maxDeposit: 1000000,
    feePercent: 0,
    processingTime: '2-10 Mins',
    walletAddress: defaultCryptoWallets.usdc.address,
    network: defaultCryptoWallets.usdc.network
  },
  {
    id: 'pm-sol',
    name: 'Solana (SOL)',
    type: 'crypto',
    currency: 'SOL',
    active: true,
    minDeposit: 20,
    maxDeposit: 500000,
    feePercent: 0,
    processingTime: 'Near Instant',
    walletAddress: defaultCryptoWallets.sol.address,
    network: defaultCryptoWallets.sol.network
  },
  {
    id: 'pm-bnb',
    name: 'BNB (BEP20)',
    type: 'crypto',
    currency: 'BNB',
    active: true,
    minDeposit: 20,
    maxDeposit: 500000,
    feePercent: 0,
    processingTime: '1-5 Mins',
    walletAddress: defaultCryptoWallets.bnb.address,
    network: defaultCryptoWallets.bnb.network
  },
  {
    id: 'pm-xrp',
    name: 'XRP (Ripple)',
    type: 'crypto',
    currency: 'XRP',
    active: true,
    minDeposit: 20,
    maxDeposit: 500000,
    feePercent: 0,
    processingTime: 'Near Instant',
    walletAddress: defaultCryptoWallets.xrp.address,
    network: defaultCryptoWallets.xrp.network,
    memo: defaultCryptoWallets.xrp.memo,
    instructions: `Send XRP to the address below. REQUIRED destination tag / memo: ${defaultCryptoWallets.xrp.memo}`
  },
  {
    id: 'pm-ton',
    name: 'TON (Toncoin)',
    type: 'crypto',
    currency: 'TON',
    active: true,
    minDeposit: 20,
    maxDeposit: 500000,
    feePercent: 0,
    processingTime: 'Near Instant',
    walletAddress: defaultCryptoWallets.ton.address,
    network: defaultCryptoWallets.ton.network,
    memo: defaultCryptoWallets.ton.memo,
    instructions: `Send TON to the address below. REQUIRED memo: ${defaultCryptoWallets.ton.memo}`
  },
  {
    id: 'pm-xlm',
    name: 'Stellar (XLM)',
    type: 'crypto',
    currency: 'XLM',
    active: true,
    minDeposit: 20,
    maxDeposit: 500000,
    feePercent: 0,
    processingTime: 'Near Instant',
    walletAddress: defaultCryptoWallets.xlm.address,
    network: defaultCryptoWallets.xlm.network,
    memo: defaultCryptoWallets.xlm.memo,
    instructions: `Send XLM to the address below. REQUIRED memo: ${defaultCryptoWallets.xlm.memo}`
  }
];

export function getLocalPaymentConfig(): CentralPaymentConfig {
  try {
    const savedConfig = safeStorage.getItem('axi_payment_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      return {
        updatedAt: parsed.updatedAt || Date.now(),
        cryptoWallets: { ...defaultCryptoWallets, ...(parsed.cryptoWallets || {}) },
        bankSettings: { ...defaultBankSettings, ...(parsed.bankSettings || {}) },
        paymentMethods: parsed.paymentMethods || defaultPaymentMethods,
        autoApproveLimit: parsed.autoApproveLimit ?? 0,
        requireKycForDeposit: parsed.requireKycForDeposit ?? true,
        maintenanceMode: { ...defaultMaintenanceMode, ...(parsed.maintenanceMode || {}) }
      };
    }

    // Check individual items fallback
    const savedWallets = safeStorage.getItem('axi_admin_wallet_settings');
    const savedBank = safeStorage.getItem('axi_admin_bank_settings');
    const savedMethods = safeStorage.getItem('axi_payment_methods');

    const cryptoWallets = savedWallets ? { ...defaultCryptoWallets, ...JSON.parse(savedWallets) } : defaultCryptoWallets;
    const bankSettings = savedBank ? { ...defaultBankSettings, ...JSON.parse(savedBank) } : defaultBankSettings;
    const paymentMethods = savedMethods ? JSON.parse(savedMethods) : defaultPaymentMethods;

    return {
      updatedAt: Date.now(),
      cryptoWallets,
      bankSettings,
      paymentMethods,
      autoApproveLimit: 0,
      requireKycForDeposit: true,
      maintenanceMode: defaultMaintenanceMode
    };
  } catch (err) {
    console.warn('Error reading local payment config:', err);
    return {
      updatedAt: Date.now(),
      cryptoWallets: defaultCryptoWallets,
      bankSettings: defaultBankSettings,
      paymentMethods: defaultPaymentMethods,
      autoApproveLimit: 0,
      requireKycForDeposit: true,
      maintenanceMode: defaultMaintenanceMode
    };
  }
}

export function saveLocalPaymentConfig(config: CentralPaymentConfig) {
  try {
    safeStorage.setItem('axi_payment_config', JSON.stringify(config));
    safeStorage.setItem('axi_admin_wallet_settings', JSON.stringify(config.cryptoWallets));
    safeStorage.setItem('axi_admin_bank_settings', JSON.stringify(config.bankSettings));
    safeStorage.setItem('axi_payment_methods', JSON.stringify(config.paymentMethods));

    window.dispatchEvent(new Event('axi_payment_config_updated'));
    window.dispatchEvent(new Event('axi_admin_wallet_settings_updated'));
    window.dispatchEvent(new Event('axi_payment_methods_updated'));
  } catch (err) {
    console.error('Failed to save local payment config:', err);
  }
}

export function subscribeSystemConfigWallets(
  onData: (wallets: Record<string, CryptoWalletConfig>, isLive: boolean) => void
): () => void {
  const initial = getLocalPaymentConfig().cryptoWallets;
  onData(initial, false);

  try {
    const sysDocRef = doc(db, 'system_config', 'wallets');
    const unsubscribe = onSnapshot(
      sysDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const wallets: Record<string, CryptoWalletConfig> = {
            ...defaultCryptoWallets,
            ...(data.btc ? { btc: data.btc } : {}),
            ...(data.eth ? { eth: data.eth } : {}),
            ...(data.usdt ? { usdt: data.usdt } : {}),
            ...(data.usdt_erc20 ? { usdt_erc20: data.usdt_erc20 } : {}),
            ...(data.usdt_bep20 ? { usdt_bep20: data.usdt_bep20 } : {}),
            ...(data.usdc ? { usdc: data.usdc } : {}),
            ...(data.sol ? { sol: data.sol } : {}),
            ...(data.bnb ? { bnb: data.bnb } : {}),
            ...(data.xrp ? { xrp: data.xrp } : {}),
            ...(data.ton ? { ton: data.ton } : {}),
            ...(data.xlm ? { xlm: data.xlm } : {}),
          };
          
          // Sync with local config
          const currentConfig = getLocalPaymentConfig();
          const updatedConfig = { ...currentConfig, cryptoWallets: wallets };
          saveLocalPaymentConfig(updatedConfig);
          onData(wallets, true);
        } else {
          // Bootstrap system_config/wallets if missing
          const current = getLocalPaymentConfig().cryptoWallets;
          setDoc(sysDocRef, { ...current, updatedAt: Date.now() }, { merge: true }).catch(() => {});
          onData(current, true);
        }
      },
      (err) => {
        console.warn('system_config/wallets subscription warning:', err.message);
        onData(getLocalPaymentConfig().cryptoWallets, false);
      }
    );
    return () => unsubscribe();
  } catch (err) {
    console.warn('system_config setup failed:', err);
    onData(getLocalPaymentConfig().cryptoWallets, false);
    return () => {};
  }
}

export async function updateSystemConfigWallets(
  wallets: Record<string, CryptoWalletConfig>
): Promise<{ success: boolean; firestoreSynced: boolean; message: string }> {
  const currentConfig = getLocalPaymentConfig();
  const updatedConfig: CentralPaymentConfig = {
    ...currentConfig,
    cryptoWallets: wallets,
    updatedAt: Date.now()
  };

  saveLocalPaymentConfig(updatedConfig);

  let firestoreSynced = false;
  try {
    // 1. Update dedicated system_config/wallets document
    const sysDocRef = doc(db, 'system_config', 'wallets');
    await setDoc(sysDocRef, { ...wallets, updatedAt: Date.now() }, { merge: true });

    // 2. Also sync config/paymentConfig document
    const configDocRef = doc(db, 'config', 'paymentConfig');
    await setDoc(configDocRef, { cryptoWallets: wallets, updatedAt: Date.now() }, { merge: true });

    firestoreSynced = true;
  } catch (err: any) {
    console.warn('Firestore system_config/wallets write warning:', err?.message || err);
  }

  return {
    success: true,
    firestoreSynced,
    message: firestoreSynced
      ? 'Crypto wallet addresses saved to Firestore system_config document!'
      : 'Crypto wallet addresses saved locally (Firestore sync fallback active).'
  };
}

export function subscribePaymentConfig(
  onData: (config: CentralPaymentConfig, isLiveFirestore: boolean) => void
): () => void {
  // First send immediate local data
  const initialLocal = getLocalPaymentConfig();
  onData(initialLocal, false);

  try {
    const configDocRef = doc(db, 'config', 'paymentConfig');
    const sysDocRef = doc(db, 'system_config', 'wallets');

    const unsubscribeConfig = onSnapshot(
      configDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<CentralPaymentConfig>;
          const merged: CentralPaymentConfig = {
            updatedAt: data.updatedAt || Date.now(),
            cryptoWallets: { ...defaultCryptoWallets, ...(data.cryptoWallets || {}) },
            bankSettings: { ...defaultBankSettings, ...(data.bankSettings || {}) },
            paymentMethods: data.paymentMethods && data.paymentMethods.length > 0 
              ? data.paymentMethods 
              : defaultPaymentMethods,
            autoApproveLimit: data.autoApproveLimit ?? 0,
            requireKycForDeposit: data.requireKycForDeposit ?? true,
            maintenanceMode: { ...defaultMaintenanceMode, ...(data.maintenanceMode || {}) }
          };

          // Cache locally
          saveLocalPaymentConfig(merged);
          onData(merged, true);
        } else {
          // If doc doesn't exist in Firestore yet, push initial defaults to Firestore
          const initial = getLocalPaymentConfig();
          setDoc(configDocRef, initial, { merge: true }).catch(err => {
            console.warn('Could not bootstrap initial Firestore payment config:', err);
          });
          onData(initial, true);
        }
      },
      (error) => {
        console.warn('Firestore paymentConfig subscription error, using local storage:', error.message);
        onData(getLocalPaymentConfig(), false);
      }
    );

    const unsubscribeSys = onSnapshot(
      sysDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && (data.btc || data.usdt || data.eth || data.sol || data.ton || data.xlm)) {
            const current = getLocalPaymentConfig();
            const updatedWallets = {
              ...current.cryptoWallets,
              ...(data.btc ? { btc: data.btc } : {}),
              ...(data.eth ? { eth: data.eth } : {}),
              ...(data.usdt ? { usdt: data.usdt } : {}),
              ...(data.usdt_erc20 ? { usdt_erc20: data.usdt_erc20 } : {}),
              ...(data.usdt_bep20 ? { usdt_bep20: data.usdt_bep20 } : {}),
              ...(data.usdc ? { usdc: data.usdc } : {}),
              ...(data.sol ? { sol: data.sol } : {}),
              ...(data.bnb ? { bnb: data.bnb } : {}),
              ...(data.xrp ? { xrp: data.xrp } : {}),
              ...(data.ton ? { ton: data.ton } : {}),
              ...(data.xlm ? { xlm: data.xlm } : {}),
            };
            const merged = { ...current, cryptoWallets: updatedWallets };
            saveLocalPaymentConfig(merged);
            onData(merged, true);
          }
        }
      },
      () => {}
    );

    return () => {
      unsubscribeConfig();
      unsubscribeSys();
    };
  } catch (error) {
    console.warn('Firestore snapshot setup failed:', error);
    onData(getLocalPaymentConfig(), false);
    return () => {};
  }
}

export async function updateCentralPaymentConfig(config: CentralPaymentConfig): Promise<{ success: boolean; firestoreSynced: boolean; message: string }> {
  const updatedConfig = {
    ...config,
    updatedAt: Date.now()
  };

  // Always save locally first for instantaneous UI update
  saveLocalPaymentConfig(updatedConfig);

  let firestoreSynced = false;
  try {
    const configDocRef = doc(db, 'config', 'paymentConfig');
    await setDoc(configDocRef, updatedConfig, { merge: true });

    // Also sync dedicated system_config/wallets document
    if (config.cryptoWallets) {
      const sysDocRef = doc(db, 'system_config', 'wallets');
      await setDoc(sysDocRef, { ...config.cryptoWallets, updatedAt: Date.now() }, { merge: true });
    }

    firestoreSynced = true;
  } catch (err: any) {
    console.warn('Firestore write warning:', err?.message || err);
  }

  return {
    success: true,
    firestoreSynced,
    message: firestoreSynced 
      ? 'Payment configuration updated & synchronized to Firestore central documents (/config/paymentConfig & /system_config/wallets)!'
      : 'Payment configuration saved locally (Firestore offline/sync fallback active).'
  };
}
