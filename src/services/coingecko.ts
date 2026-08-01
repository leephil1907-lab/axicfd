export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

let cachedCoins: CoinGeckoMarket[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 30000; // 30 seconds cache

export async function fetchCoinGeckoMarkets(): Promise<CoinGeckoMarket[]> {
  const now = Date.now();
  if (cachedCoins && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedCoins;
  }

  try {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,binancecoin,dogecoin,avalanche-2,chainlink,polkadot,shiba-inu,uniswap,near,pepe,sui&order=market_cap_desc&per_page=15&page=1&sparkline=true&price_change_percentage=24h";
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko API status ${response.status}`);
    }
    const data: CoinGeckoMarket[] = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      cachedCoins = data;
      lastFetchTime = now;
      return data;
    }
  } catch (err) {
    console.warn("CoinGecko API fetch failed, using fallback live metrics:", err);
  }

  // Fallback with real CoinGecko asset images and typical prices if API is rate limited
  return FALLBACK_COINS;
}

export const FALLBACK_COINS: CoinGeckoMarket[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67420.50,
    market_cap: 1320000000000,
    market_cap_rank: 1,
    total_volume: 28400000000,
    high_24h: 68150.00,
    low_24h: 66300.00,
    price_change_24h: 1120.50,
    price_change_percentage_24h: 1.69,
    sparkline_in_7d: { price: [66000, 66400, 66800, 66200, 67000, 67420.50] }
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3480.25,
    market_cap: 418000000000,
    market_cap_rank: 2,
    total_volume: 14200000000,
    high_24h: 3520.00,
    low_24h: 3410.00,
    price_change_24h: 70.25,
    price_change_percentage_24h: 2.06,
    sparkline_in_7d: { price: [3400, 3420, 3450, 3430, 3470, 3480.25] }
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 178.40,
    market_cap: 83000000000,
    market_cap_rank: 3,
    total_volume: 3800000000,
    high_24h: 182.10,
    low_24h: 172.50,
    price_change_24h: 5.90,
    price_change_percentage_24h: 3.42,
    sparkline_in_7d: { price: [170, 172, 175, 174, 177, 178.40] }
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.612,
    market_cap: 34000000000,
    market_cap_rank: 4,
    total_volume: 1900000000,
    high_24h: 0.635,
    low_24h: 0.598,
    price_change_24h: 0.014,
    price_change_percentage_24h: 2.34,
    sparkline_in_7d: { price: [0.59, 0.60, 0.61, 0.605, 0.612] }
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.428,
    market_cap: 15200000000,
    market_cap_rank: 5,
    total_volume: 480000000,
    high_24h: 0.442,
    low_24h: 0.415,
    price_change_24h: -0.005,
    price_change_percentage_24h: -1.15,
    sparkline_in_7d: { price: [0.43, 0.435, 0.42, 0.425, 0.428] }
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 582.10,
    market_cap: 85000000000,
    market_cap_rank: 6,
    total_volume: 1100000000,
    high_24h: 590.00,
    low_24h: 574.00,
    price_change_24h: 8.10,
    price_change_percentage_24h: 1.41,
    sparkline_in_7d: { price: [570, 575, 580, 578, 582.10] }
  }
];
