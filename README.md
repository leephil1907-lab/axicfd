# Axi Trading Platform

A full-stack trading broker website clone built with React, TypeScript, tRPC, Drizzle ORM, Hono, and MySQL. Features a complete trading dashboard with real-time market data, multi-language support, admin panel, and more.

## Features

### Landing Page
- **Red Axi header** with logo, OPEN ACCOUNT button, Login button, language selector (20 languages)
- **Since 2007 tagline** banner
- **Hero section** with "220+ products" headline and carousel dots
- **Stats bar**: $5 minimum deposit, 220+ products, 0.7 spreads, 30:1 leverage
- **Platforms section** with red background and feature list
- **Markets section** with pill-shaped category tabs (Forex, Crypto, Metals, Indices, Commodities) and live bid/ask table
- **App Showcase** with animated phone mockup (auto-rotating slides)
- **Axi Select** section with pathway progress, funded traders, Seed->Pro comparison table
- **Features, Awards, Partnership, Reviews, Education, Help Center** sections
- **Footer** with 6-column links and regulatory disclaimers

### Trading Dashboard (`/trading`)
- Live watchlist with 25+ instruments (real-time prices from live APIs)
- SVG candlestick chart with timeframe selector
- Order panel with buy/sell, volume control
- Positions, pending orders, and trade history tabs
- Account balance, equity, margin tracking

### Admin Dashboard (`/admin`)
- Stats cards (users, accounts, positions, P&L)
- Full user list with search, pagination, role management
- All positions and trade history across all users
- Protected by admin middleware

### Sign Up Flow (`/signup`)
- 2-step: Country selection (30+ countries) -> Sign up form
- Email/password fields with validation
- Privacy and marketing consent checkboxes
- Social login placeholders (Google, Apple, Facebook)

### Login (`/login`)
- Dual mode: Trader Login (OAuth + email/password) / Admin Login (hidden tab)
- Admin: `Kaspertrading9@gmail.com` / `admin123`

### Funds (`/funds`)
- Deposit/Withdraw/History tabs
- Payment methods: Crypto, Binance Pay, Google Pay, Skrill, Card
- Account selection for withdrawal

### Deposits & Withdrawals (`/deposits`)
- Yellow hero banner
- Deposits/Withdrawals tabbed table with payment methods
- FAQ accordion
- CTA buttons

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Hono, tRPC 11.x, Drizzle ORM |
| Database | MySQL |
| Auth | OAuth 2.0 (Kimi) + Local email/password (bcrypt + JWT) |
| Real-time Data | exchangerate-api.com (Forex), CoinGecko (Crypto) |
