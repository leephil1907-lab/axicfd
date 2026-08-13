# Production Migration Guide — Axi Trades

This guide moves the app from demo/mock behaviour to a production-ready deployment with live market data and real user funds.

## 1. Prerequisites

- Node.js 20+
- Firebase project (Auth + Firestore + Storage)
- Stripe account (live keys for production)
- Domain with HTTPS
- Optional: Gemini API key, SMTP, Telegram bot, Finnhub / Alpha Vantage

## 2. Environment

```bash
cp .env.example .env
```

Fill **all** `VITE_FIREBASE_*` variables (the client will throw if any are missing).

Set at minimum:

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_*` | Auth & database |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `VITE_STRIPE_PUBLISHABLE_KEY` | Deposits |
| `VITE_ADMIN_ACCESS_CODE` | Admin panel (Ctrl/Cmd+Shift+A) |
| `APP_URL` / `CORS_ORIGINS` | Production origin |
| `GEMINI_API_KEY` | AI assistant |

Wallet and bank details should be configured in the admin UI (stored under Firestore `system_config/wallets` and `config/paymentConfig`). Env `VITE_WALLET_*` / `VITE_BANK_*` are optional bootstrap only.

## 3. Firebase

1. Deploy rules:

```bash
firebase deploy --only firestore:rules
```

2. Create at least one admin document:

```
Collection: admins
Document ID: <your Firebase Auth UID>
Fields: { role: "admin", createdAt: <timestamp> }
```

3. Ensure Auth providers (Email, Google, etc.) are enabled.

## 4. Stripe webhooks

Point Stripe to:

```
POST https://your-domain.com/api/stripe/webhook
```

Events: `payment_intent.succeeded`, `checkout.session.completed` (as needed).

Deposits are credited only after `/api/stripe/verify-deposit` confirms the PaymentIntent server-side.

## 5. Build & run

```bash
npm install
npm run build
npm start
```

Or deploy the `Dockerfile` / `cloudbuild.yaml` / Vercel as configured in the repo.

## 6. What was removed from demo mode

- Premade admin users and fake volume stats  
- Seeded heatmap / sample news headlines  
- Hardcoded wallet addresses and bank numbers in source  
- Artificial P&L override injection  
- Embedded Firebase config fallback  
- Hardcoded admin password (`axitrading2026`)  
- Default $10,000 practice balance on signup (now `0`)  
- Fake master-trader roster (empty until admin adds)  

## 7. Live data sources

| Data | Provider |
|------|----------|
| Crypto spots | Binance public API |
| FX / metals / indices / stocks | Yahoo Finance (`yahoo-finance2`) |
| News | Finnhub → Alpha Vantage → Google News RSS |
| Candles | Binance klines / Yahoo chart |

Frontend polls `/api/markets/quotes` every ~2.5s. Server refreshes live markets every 3s.

## 8. Post-deploy checklist

- [ ] Firebase rules deployed; admin UID in `admins`  
- [ ] Stripe webhook signature verification working  
- [ ] Test deposit with small amount; balance only updates after verify  
- [ ] Market quotes update without page reload  
- [ ] News ticker loads from API (not empty permanently if RSS is reachable)  
- [ ] Admin access only via `VITE_ADMIN_ACCESS_CODE`  
- [ ] No real secrets in git or client bundles beyond `VITE_*` publishable keys  

## 9. Broker execution (optional next step)

Trade endpoints in `server.ts` are structured for OANDA / Interactive Brokers integration. Wire order placement to your broker REST API and persist fills into Firestore `users/{uid}/openPositions` under the same schema used by the UI.
