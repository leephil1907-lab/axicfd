export const DEFAULT_CURRENCY = 'USD';

export const CURRENCIES = Array.from(new Set([
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'HKD', 'SGD',
  'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'TRY',
  'RUB', 'UAH', 'KZT', 'ZAR', 'NGN', 'KES', 'GHS', 'EGP', 'MAD', 'DZD',
  'TND', 'XOF', 'XAF', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD',
  'ILS', 'INR', 'PKR', 'LKR', 'BDT', 'NPR', 'THB', 'VND', 'IDR', 'MYR',
  'PHP', 'CNY', 'TWD', 'KRW', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN',
  'UYU', 'DOP', 'CRC', 'PAB', 'JMD', 'GEL', 'AMD', 'AZN', 'UZS', 'IQD',
  'LYD', 'SDG', 'MVR', 'KHR', 'MMK', 'LAK', 'FJD', 'PGK', 'WST', 'TOP',
  'MOP', 'BND', 'BAM', 'ALL', 'MKD', 'RSD', 'MDL', 'ETB', 'RWF',
  'TZS', 'UGX', 'MZN', 'AOA', 'ZMW', 'MWK', 'SZL', 'LSL', 'BWP', 'NAD',
  'MUR', 'SCR', 'CVE', 'GMD', 'GNF', 'SLL', 'LRD', 'HTG', 'TTD',
  'BBD', 'BSD', 'BZD', 'GTQ', 'HNL', 'NIO', 'PYG', 'BOB', 'VES', 'BTC',
  'ETH', 'USDT', 'USDC'
]));

export const LANGUAGES = [
  {code:'en', label:'English'},{code:'es', label:'Español'},{code:'fr', label:'Français'},
  {code:'de', label:'Deutsch'},{code:'it', label:'Italiano'},{code:'pt', label:'Português'},
  {code:'ru', label:'Русский'},{code:'ar', label:'العربية'},{code:'zh', label:'中文'},
  {code:'ja', label:'日本語'},{code:'ko', label:'한국어'},{code:'hi', label:'हिन्दी'},
  {code:'tr', label:'Türkçe'},{code:'pl', label:'Polski'},{code:'nl', label:'Nederlands'},
  {code:'sv', label:'Svenska'},{code:'da', label:'Dansk'},{code:'fi', label:'Suomi'},
  {code:'el', label:'Ελληνικά'},{code:'cs', label:'Čeština'},{code:'hu', label:'Magyar'},
  {code:'ro', label:'Română'},{code:'uk', label:'Українська'},{code:'vi', label:'Tiếng Việt'},
  {code:'th', label:'ไทย'},{code:'id', label:'Bahasa Indonesia'},{code:'ms', label:'Bahasa Melayu'}
];

export const COUNTRIES = [
  {code:'AF', label:'Afghanistan'}, {code:'AL', label:'Albania'}, {code:'DZ', label:'Algeria'},
  {code:'AD', label:'Andorra'}, {code:'AO', label:'Angola'}, {code:'AG', label:'Antigua and Barbuda'},
  {code:'AR', label:'Argentina'}, {code:'AM', label:'Armenia'}, {code:'AU', label:'Australia'},
  {code:'AT', label:'Austria'}, {code:'AZ', label:'Azerbaijan'}, {code:'BS', label:'Bahamas'},
  {code:'BH', label:'Bahrain'}, {code:'BD', label:'Bangladesh'}, {code:'BB', label:'Barbados'},
  {code:'BY', label:'Belarus'}, {code:'BE', label:'Belgium'}, {code:'BZ', label:'Belize'},
  {code:'BJ', label:'Benin'}, {code:'BT', label:'Bhutan'}, {code:'BO', label:'Bolivia'},
  {code:'BA', label:'Bosnia and Herzegovina'}, {code:'BW', label:'Botswana'}, {code:'BR', label:'Brazil'},
  {code:'BN', label:'Brunei'}, {code:'BG', label:'Bulgaria'}, {code:'BF', label:'Burkina Faso'},
  {code:'BI', label:'Burundi'}, {code:'KH', label:'Cambodia'}, {code:'CM', label:'Cameroon'},
  {code:'CA', label:'Canada'}, {code:'CV', label:'Cape Verde'}, {code:'CF', label:'Central African Republic'},
  {code:'TD', label:'Chad'}, {code:'CL', label:'Chile'}, {code:'CN', label:'China'},
  {code:'CO', label:'Colombia'}, {code:'KM', label:'Comoros'}, {code:'CG', label:'Congo'},
  {code:'CR', label:'Costa Rica'}, {code:'HR', label:'Croatia'}, {code:'CU', label:'Cuba'},
  {code:'CY', label:'Cyprus'}, {code:'CZ', label:'Czechia'}, {code:'DK', label:'Denmark'},
  {code:'DJ', label:'Djibouti'}, {code:'DM', label:'Dominica'}, {code:'DO', label:'Dominican Republic'},
  {code:'EC', label:'Ecuador'}, {code:'EG', label:'Egypt'}, {code:'SV', label:'El Salvador'},
  {code:'GQ', label:'Equatorial Guinea'}, {code:'ER', label:'Eritrea'}, {code:'EE', label:'Estonia'},
  {code:'SZ', label:'Eswatini'}, {code:'ET', label:'Ethiopia'}, {code:'FJ', label:'Fiji'},
  {code:'FI', label:'Finland'}, {code:'FR', label:'France'}, {code:'GA', label:'Gabon'},
  {code:'GM', label:'Gambia'}, {code:'GE', label:'Georgia'}, {code:'DE', label:'Germany'},
  {code:'GH', label:'Ghana'}, {code:'GR', label:'Greece'}, {code:'GD', label:'Grenada'},
  {code:'GT', label:'Guatemala'}, {code:'GN', label:'Guinea'}, {code:'GW', label:'Guinea-Bissau'},
  {code:'GY', label:'Guyana'}, {code:'HT', label:'Haiti'}, {code:'HN', label:'Honduras'},
  {code:'HU', label:'Hungary'}, {code:'IS', label:'Iceland'}, {code:'IN', label:'India'},
  {code:'ID', label:'Indonesia'}, {code:'IR', label:'Iran'}, {code:'IQ', label:'Iraq'},
  {code:'IE', label:'Ireland'}, {code:'IL', label:'Israel'}, {code:'IT', label:'Italy'},
  {code:'CI', label:'Ivory Coast'}, {code:'JM', label:'Jamaica'}, {code:'JP', label:'Japan'},
  {code:'JO', label:'Jordan'}, {code:'KZ', label:'Kazakhstan'}, {code:'KE', label:'Kenya'},
  {code:'KI', label:'Kiribati'}, {code:'XK', label:'Kosovo'}, {code:'KW', label:'Kuwait'},
  {code:'KG', label:'Kyrgyzstan'}, {code:'LA', label:'Laos'}, {code:'LV', label:'Latvia'},
  {code:'LB', label:'Lebanon'}, {code:'LS', label:'Lesotho'}, {code:'LR', label:'Liberia'},
  {code:'LY', label:'Libya'}, {code:'LI', label:'Liechtenstein'}, {code:'LT', label:'Lithuania'},
  {code:'LU', label:'Luxembourg'}, {code:'MG', label:'Madagascar'}, {code:'MW', label:'Malawi'},
  {code:'MY', label:'Malaysia'}, {code:'MV', label:'Maldives'}, {code:'ML', label:'Mali'},
  {code:'MT', label:'Malta'}, {code:'MH', label:'Marshall Islands'}, {code:'MR', label:'Mauritania'},
  {code:'MU', label:'Mauritius'}, {code:'MX', label:'Mexico'}, {code:'FM', label:'Micronesia'},
  {code:'MD', label:'Moldova'}, {code:'MC', label:'Monaco'}, {code:'MN', label:'Mongolia'},
  {code:'ME', label:'Montenegro'}, {code:'MA', label:'Morocco'}, {code:'MZ', label:'Mozambique'},
  {code:'MM', label:'Myanmar'}, {code:'NA', label:'Namibia'}, {code:'NR', label:'Nauru'},
  {code:'NP', label:'Nepal'}, {code:'NL', label:'Netherlands'}, {code:'NZ', label:'New Zealand'},
  {code:'NI', label:'Nicaragua'}, {code:'NE', label:'Niger'}, {code:'NG', label:'Nigeria'},
  {code:'KP', label:'North Korea'}, {code:'MK', label:'North Macedonia'}, {code:'NO', label:'Norway'},
  {code:'OM', label:'Oman'}, {code:'PK', label:'Pakistan'}, {code:'PW', label:'Palau'},
  {code:'PS', label:'Palestine'}, {code:'PA', label:'Panama'}, {code:'PG', label:'Papua New Guinea'},
  {code:'PY', label:'Paraguay'}, {code:'PE', label:'Peru'}, {code:'PH', label:'Philippines'},
  {code:'PL', label:'Poland'}, {code:'PT', label:'Portugal'}, {code:'QA', label:'Qatar'},
  {code:'RO', label:'Romania'}, {code:'RU', label:'Russia'}, {code:'RW', label:'Rwanda'},
  {code:'KN', label:'Saint Kitts and Nevis'}, {code:'LC', label:'Saint Lucia'}, {code:'VC', label:'Saint Vincent'},
  {code:'WS', label:'Samoa'}, {code:'SM', label:'San Marino'}, {code:'ST', label:'Sao Tome and Principe'},
  {code:'SA', label:'Saudi Arabia'}, {code:'SN', label:'Senegal'}, {code:'RS', label:'Serbia'},
  {code:'SC', label:'Seychelles'}, {code:'SL', label:'Sierra Leone'}, {code:'SG', label:'Singapore'},
  {code:'SK', label:'Slovakia'}, {code:'SI', label:'Slovenia'}, {code:'SB', label:'Solomon Islands'},
  {code:'SO', label:'Somalia'}, {code:'ZA', label:'South Africa'}, {code:'KR', label:'South Korea'},
  {code:'SS', label:'South Sudan'}, {code:'ES', label:'Spain'}, {code:'LK', label:'Sri Lanka'},
  {code:'SD', label:'Sudan'}, {code:'SR', label:'Suriname'}, {code:'SE', label:'Sweden'},
  {code:'CH', label:'Switzerland'}, {code:'SY', label:'Syria'}, {code:'TW', label:'Taiwan'},
  {code:'TJ', label:'Tajikistan'}, {code:'TZ', label:'Tanzania'}, {code:'TH', label:'Thailand'},
  {code:'TL', label:'Timor-Leste'}, {code:'TG', label:'Togo'}, {code:'TO', label:'Tonga'},
  {code:'TT', label:'Trinidad and Tobago'}, {code:'TN', label:'Tunisia'}, {code:'TR', label:'Türkiye'},
  {code:'TM', label:'Turkmenistan'}, {code:'TV', label:'Tuvalu'}, {code:'UG', label:'Uganda'},
  {code:'UA', label:'Ukraine'}, {code:'AE', label:'United Arab Emirates'}, {code:'GB', label:'United Kingdom'},
  {code:'US', label:'United States'}, {code:'UY', label:'Uruguay'}, {code:'UZ', label:'Uzbekistan'},
  {code:'VU', label:'Vanuatu'}, {code:'VA', label:'Vatican City'}, {code:'VE', label:'Venezuela'},
  {code:'VN', label:'Vietnam'}, {code:'YE', label:'Yemen'}, {code:'ZM', label:'Zambia'}, {code:'ZW', label:'Zimbabwe'}
];

// Account types matching AXI design
export const ACCOUNT_TYPES = [
  { id: 'standard', name: 'Standard', badge: 'Most Popular', description: 'Our best account for everyday traders', spread: 'From 0.9', commission: 'No Commission', minLot: '0.01 Lot', minDeposit: 'No Minimum' },
  { id: 'pro', name: 'Pro', badge: 'Low Spreads', description: 'Preferential spreads for more experienced traders', spread: 'From 0.0', commission: '$4.50 Round-Trip', minLot: '0.01 Lot', minDeposit: 'No Minimum' },
  { id: 'elite', name: 'Elite', badge: 'Raw Spreads', description: 'Institutional-grade execution for professionals', spread: 'From 0.0', commission: '$3.50 Round-Trip', minLot: '0.01 Lot', minDeposit: '$25,000' },
];

// Payment methods matching AXI design
export const PAYMENT_METHODS = [
  { id: 'transak', name: 'Card to Crypto (Transak & MoonPay)', icon: 'transak', currencies: ['EUR','USD','GBP','CAD','AUD'], minWithdrawal: 'EUR 10', maxWithdrawal: 'EUR 50,000', time: 'Instant Card/SEPA', fee: '0%' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'visa', currencies: ['AED','CAD','CHF','EUR','GBP','HKD','PLN','SGD','USD','ZAR'], minWithdrawal: 'USD 5', maxWithdrawal: 'USD 50,000', time: 'Instant*', fee: '0%' },
  { id: 'bank', name: 'International Bank Transfer', icon: 'bank', currencies: ['CAD','CHF','EUR','GBP','HKD','SGD','USD'], minWithdrawal: 'USD 50', maxWithdrawal: 'USD 10,000,000', time: '1-3 days', fee: '0%' },
  { id: 'skrill', name: 'Skrill', icon: 'skrill', currencies: ['AED','CAD','EUR','GBP','PLN','USD'], minWithdrawal: 'EUR 5', maxWithdrawal: 'EUR 100,000', time: 'Instant', fee: '0%' },
  { id: 'neteller', name: 'Neteller', icon: 'neteller', currencies: ['CAD','EUR','GBP','PLN','USD'], minWithdrawal: 'USD 5', maxWithdrawal: 'USD 1,000,000', time: 'Instant', fee: '0%' },
  { id: 'crypto', name: 'Crypto', icon: 'crypto', currencies: ['BTC','ETH','LTC','XRP','XLM','USDT'], minWithdrawal: 'USD 30', maxWithdrawal: 'USD 250,000', time: 'Up to 15mins', fee: '0%' },
  { id: 'googlepay', name: 'Google Pay', icon: 'gpay', currencies: ['EUR','GBP','USD'], minWithdrawal: 'USD 5', maxWithdrawal: 'USD 10,000', time: 'Instant', fee: '0%' },
  { id: 'binance', name: 'Binance Pay', icon: 'binance', currencies: ['USDT','BUSD'], minWithdrawal: 'USD 10', maxWithdrawal: 'USD 100,000', time: 'Instant', fee: '0%' },
];

// AXI Select tiers
export const AXI_SELECT_TIERS = [
  { name: 'Seed', allocation: '$500', profitShare: '70%', requirement: 'Edge Score 50+' },
  { name: 'Incubation', allocation: '$20,000', profitShare: '75%', requirement: 'Edge Score 60+' },
  { name: 'Acceleration', allocation: '$100,000', profitShare: '78%', requirement: 'Edge Score 70+' },
  { name: 'Pro', allocation: '$250,000', profitShare: '80%', requirement: 'Edge Score 80+' },
  { name: 'Pro 500', allocation: '$500,000', profitShare: '80%', requirement: 'Edge Score 85+' },
  { name: 'Pro M', allocation: '$1,000,000', profitShare: '80%', requirement: 'Edge Score 90+' },
];
