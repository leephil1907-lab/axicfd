import { createContext, useContext, useState, type ReactNode } from 'react'

export const languages = [
  { code: 'en', label: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { code: 'es', label: 'Espa\u00F1ol', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { code: 'fr', label: 'Fran\u00E7ais', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { code: 'de', label: 'Deutsch', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { code: 'it', label: 'Italiano', flag: '\uD83C\uDDEE\uD83C\uDDF9' },
  { code: 'pt', label: 'Portugu\u00EAs', flag: '\uD83C\uDDF5\uD83C\uDDF9' },
  { code: 'zh', label: '\u4E2D\u6587', flag: '\uD83C\uDDE8\uD83C\uDDF3' },
  { code: 'ja', label: '\u65E5\u672C\u8A9E', flag: '\uD83C\uDDEF\uD83C\uDDF5' },
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\uD83C\uDDF8\uD83C\uDDE6' },
  { code: 'ko', label: '\uD55C\uAD6D\uC5B4', flag: '\uD83C\uDDF0\uD83C\uDDF7' },
  { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: '\uD83C\uDDF7\uD83C\uDDFA' },
  { code: 'hi', label: '\u0939\u093F\u0928\u094D\u0926\u0940', flag: '\uD83C\uDDEE\uD83C\uDDF3' },
  { code: 'tr', label: 'T\u00FCrk\u00E7e', flag: '\uD83C\uDDF9\uD83C\uDDF7' },
  { code: 'vi', label: 'Ti\u1EBFng Vi\u1EC7t', flag: '\uD83C\uDDFB\uD83C\uDDF3' },
  { code: 'th', label: '\u0E44\u0E17\u0E22', flag: '\uD83C\uDDF9\uD83C\uDDED' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '\uD83C\uDDEE\uD83C\uDDE9' },
  { code: 'ms', label: 'Bahasa Melayu', flag: '\uD83C\uDDF2\uD83C\uDDFE' },
  { code: 'nl', label: 'Nederlands', flag: '\uD83C\uDDF3\uD83C\uDDF1' },
  { code: 'pl', label: 'Polski', flag: '\uD83C\uDDF5\uD83C\uDDF1' },
  { code: 'sv', label: 'Svenska', flag: '\uD83C\uDDF8\uD83C\uDDEA' },
] as const;

export const currencies = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', label: 'Euro' },
  { code: 'GBP', symbol: '\u00A3', label: 'British Pound' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
  { code: 'JPY', symbol: '\u00A5', label: 'Japanese Yen' },
  { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', label: 'Hong Kong Dollar' },
  { code: 'CNY', symbol: '\u00A5', label: 'Chinese Yuan' },
  { code: 'NGN', symbol: '\u20A6', label: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'AED', symbol: '\u062F.\u0625', label: 'UAE Dirham' },
  { code: 'SAR', symbol: '\uFDFC', label: 'Saudi Riyal' },
  { code: 'INR', symbol: '\u20B9', label: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', label: 'Mexican Peso' },
] as const;

export type LangCode = (typeof languages)[number]['code']
export type CurrencyCode = (typeof currencies)[number]['code']

interface LocaleContextType { lang: LangCode; setLang: (l: LangCode) => void; currency: CurrencyCode; setCurrency: (c: CurrencyCode) => void; t: (key: string) => string }
const LocaleContext = createContext<LocaleContextType>({ lang: 'en', setLang: () => {}, currency: 'USD', setCurrency: () => {}, t: (k) => k })

const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.openAccount': 'OPEN ACCOUNT', 'nav.login': 'Log in here', 'nav.trading': 'Trading', 'nav.platforms': 'Platforms', 'nav.tools': 'Tools', 'nav.education': 'Education', 'nav.partners': 'Partners', 'nav.support': 'Support',
    'hero.title': 'Trade with Axi funds up to $1 million USD', 'hero.subtitle': 'Axi has launched a capital allocation program. No registration fees. No monthly fees. 100% FREE', 'hero.cta': 'JOIN NOW', 'hero.community': 'Join the Axi Select community',
    'stat.deposit': 'STARTING DEPOSIT', 'stat.products': 'PRODUCTS TO TRADE', 'stat.spreads': 'AVERAGE SPREADS', 'stat.leverage': 'MAX LEVERAGE',
    'signup.title': 'Sign up', 'signup.email': 'Email address', 'signup.password': 'Password', 'signup.consent': 'I have read and consent to my data being used in accordance with the', 'signup.privacy': 'Privacy Policy', 'signup.marketing': 'I would like to receive free market analysis or promotional content from Axi.', 'signup.continue': 'Continue', 'signup.hasAccount': 'Already have an Axi account?', 'signup.or': 'OR', 'signup.google': 'Sign up with Google', 'signup.apple': 'Sign up with Apple', 'signup.facebook': 'Sign up with Facebook',
    'account.title': 'Create your account in minutes', 'account.country': 'Country of Residence', 'account.agree': 'By creating an account, you agree to the', 'account.and': 'and to receive economic and marketing communications from Axi. You can remove yourself from the mailing list at any time.', 'account.client': 'Already an Axi client?',
  },
  es: {
    'nav.openAccount': 'ABRIR CUENTA', 'nav.login': 'Inicia sesi\u00F3n aqu\u00ED', 'hero.title': 'Opere con fondos de Axi hasta 1 mill\u00F3n USD', 'hero.subtitle': 'Axi ha lanzado un programa de asignaci\u00F3n de capital. Sin tarifas de registro. Sin tarifas mensuales. 100% GRATIS', 'hero.cta': '\u00DANETE AHORA',
    'signup.title': 'Registrarse', 'signup.continue': 'Continuar', 'signup.email': 'Correo electr\u00F3nico', 'signup.password': 'Contrase\u00F1a',
  },
  fr: {
    'nav.openAccount': 'OUVRIR UN COMPTE', 'nav.login': 'Connectez-vous ici', 'hero.title': "Tradez avec les fonds Axi jusqu'\u00E0 1 million USD", 'hero.cta': 'REJOIGNEZ-NOUS',
    'signup.title': "S'inscrire", 'signup.continue': 'Continuer', 'signup.email': 'Adresse email', 'signup.password': 'Mot de passe',
  },
  de: {
    'nav.openAccount': 'KONTO ER\u00D6FFNEN', 'nav.login': 'Hier einloggen', 'hero.title': 'Handeln Sie mit Axi-Geldern bis zu 1 Million USD', 'hero.cta': 'JETZT BEITRETEN',
    'signup.title': 'Registrieren', 'signup.continue': 'Weiter', 'signup.email': 'E-Mail-Adresse', 'signup.password': 'Passwort',
  },
  ar: {
    'nav.openAccount': '\u0627\u0641\u062A\u062D \u062D\u0633\u0627\u0628', 'nav.login': '\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0647\u0646\u0627', 'hero.title': '\u062A\u062F\u0627\u0648\u0644 \u0628\u0623\u0645\u0648\u0627\u0644 Axi \u062A\u0635\u0644 \u0625\u0644\u0649 1 \u0645\u0644\u064A\u0648\u0646 \u062F\u0648\u0644\u0627\u0631', 'hero.cta': '\u0627\u0646\u0636\u0645 \u0627\u0644\u0622\u0646',
    'signup.title': '\u0627\u0644\u062A\u0633\u062C\u064A\u0644', 'signup.continue': '\u0645\u062A\u0627\u0628\u0639\u0629',
  },
  zh: {
    'nav.openAccount': '\u5F00\u8BBE\u8D26\u6237', 'nav.login': '\u5728\u6B64\u767B\u5F55', 'hero.title': '\u4F7F\u7528Axi\u8D44\u91D1\u4EA4\u6613\uFF0C\u9AD8\u8FBE100\u4E07\u7F8E\u5143', 'hero.cta': '\u7ACB\u5373\u52A0\u5165',
    'signup.title': '\u6CE8\u518C', 'signup.continue': '\u7EE7\u7EED',
  },
  ja: {
    'nav.openAccount': '\u53E3\u5EA7\u958B\u8A2D', 'nav.login': '\u3053\u3061\u3089\u304B\u3089\u30ED\u30B0\u30A4\u30F3', 'hero.title': 'Axi\u8CC7\u91D1\u3067\u6700\u5927100\u4E07USD\u53D6\u5F15', 'hero.cta': '\u4ECA\u3059\u3050\u53C2\u52A0',
    'signup.title': '\u30B5\u30A4\u30F3\u30A2\u30C3\u30D7', 'signup.continue': '\u7D9A\u3051\u308B',
  },
  pt: {
    'nav.openAccount': 'ABRIR CONTA', 'nav.login': 'Entre aqui', 'hero.title': 'Negocie com fundos Axi at\u00E9 1 milh\u00E3o USD', 'hero.cta': 'JUNTE-SE AGORA',
    'signup.title': 'Cadastrar-se', 'signup.continue': 'Continuar',
  },
  ru: {
    'nav.openAccount': '\u041E\u0422\u041A\u0420\u042B\u0422\u042C \u0421\u0427\u0415\u0422', 'nav.login': '\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044C', 'hero.title': '\u0422\u043E\u0440\u0433\u0443\u0439\u0442\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430\u043C\u0438 Axi \u0434\u043E 1 \u043C\u043B\u043D USD', 'hero.cta': '\u041F\u0420\u0418\u0421\u041E\u0415\u0414\u0418\u041D\u0418\u0422\u042C\u0421\u042F',
    'signup.title': '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F', 'signup.continue': '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C',
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en')
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const t = (key: string): string => translations[lang]?.[key] || translations['en']?.[key] || key
  return <LocaleContext.Provider value={{ lang, setLang, currency, setCurrency, t }}>{children}</LocaleContext.Provider>
}

export function useLocale() { return useContext(LocaleContext) }