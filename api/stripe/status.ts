import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const configured = !!process.env.STRIPE_SECRET_KEY;
  const webhookConfigured = !!process.env.STRIPE_WEBHOOK_SECRET;
  res.status(200).json({
    configured,
    webhookConfigured,
    webhookEndpoint: '/api/stripe/webhook',
    mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live')
      ? 'live'
      : process.env.STRIPE_SECRET_KEY
        ? 'test'
        : 'none',
    appUrl: process.env.APP_URL || null,
  });
}
