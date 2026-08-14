import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: 'Stripe is not configured' });
  const stripe = new Stripe(key);
  const { amount, currency = 'usd', method = 'card', depositId = '' } = req.body || {};
  const num = parseFloat(amount);
  if (!num || num <= 0) return res.status(400).json({ error: 'Invalid amount' });
  const base = process.env.APP_URL || `https://${req.headers.host}`;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: method === 'bank' ? (['us_bank_account', 'card'] as any) : (['card'] as any),
      billing_address_collection: 'required',
      line_items: [{
        price_data: {
          currency: String(currency).toLowerCase(),
          product_data: { name: 'AXITRADES Account Funding', description: 'Deposit' },
          unit_amount: Math.round(num * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: { depositId: String(depositId), fundingMethod: String(method) },
      success_url: `${base.replace(/\/$/, '')}/?view=funds&deposit_success=true&amount=${num}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base.replace(/\/$/, '')}/?view=funds&deposit_cancelled=true`,
    });
    res.json({ id: session.id, url: session.url });
  } catch (e: any) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [{
          price_data: {
            currency: String(currency).toLowerCase(),
            product_data: { name: 'AXITRADES Account Funding', description: 'Deposit' },
            unit_amount: Math.round(num * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${base.replace(/\/$/, '')}/?view=funds&deposit_success=true&amount=${num}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base.replace(/\/$/, '')}/?view=funds&deposit_cancelled=true`,
      });
      return res.json({ id: session.id, url: session.url, fallback: 'card_only' });
    } catch (e2: any) {
      return res.status(500).json({ error: e2.message || e.message });
    }
  }
}
