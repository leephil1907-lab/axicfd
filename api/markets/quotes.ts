import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const symbols = ['EURUSD=X', 'GBPUSD=X', 'BTC-USD', 'GC=F', 'SI=F'];
    const results: Record<string, any> = {};
    await Promise.all(
      symbols.map(async (s) => {
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s)}?interval=1m&range=1d`;
          const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          const j = await r.json();
          const meta = j?.chart?.result?.[0]?.meta;
          if (meta?.regularMarketPrice != null) {
            results[s] = {
              symbol: s,
              price: meta.regularMarketPrice,
              previousClose: meta.chartPreviousClose ?? meta.previousClose,
              currency: meta.currency,
            };
          }
        } catch {
          /* skip */
        }
      })
    );
    res.status(200).json({ quotes: results, source: 'yahoo', ts: Date.now() });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'quotes failed' });
  }
}
