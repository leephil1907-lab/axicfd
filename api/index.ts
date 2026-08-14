/**
 * Vercel serverless entry for /api/*
 * Loads Express app lazily and surfaces import errors as JSON.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

type ExpressApp = (req: VercelRequest, res: VercelResponse) => void;

let cachedApp: ExpressApp | null = null;
let loadError: string | null = null;

async function loadApp(): Promise<ExpressApp> {
  if (cachedApp) return cachedApp;
  if (loadError) throw new Error(loadError);
  try {
    const mod = await import('../server');
    const app = (mod.default || mod) as ExpressApp;
    if (typeof app !== 'function') {
      throw new Error('server export is not an Express app function');
    }
    cachedApp = app;
    return app;
  } catch (e: any) {
    loadError = e?.message || 'Failed to load server';
    throw new Error(loadError);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await loadApp();
    return app(req, res);
  } catch (err: any) {
    console.error('[api] handler error:', err);
    res.status(500).json({
      error: 'API function failed',
      message: err?.message || String(err),
      hint: 'Check Vercel env vars and function logs',
    });
  }
}
