# AXI Trading Platform - Push Instructions

## Quick Push (After Downloading Zip)

### Mac/Linux:
```bash
cd axi-trading-platform
chmod +x push-to-github.sh
./push-to-github.sh
```

### Windows:
Double-click `push-to-github.bat`

### Manual (if script doesn't work):
```bash
cd axi-trading-platform
git add .
git commit -m "feat: full merge with Axi-Trader backup"
git remote add origin https://github.com/leephil1907-lab/axi-trading-platform.git
git push -u origin main --force
```

## What's Included
- 27 pages (landing + trading + admin + auth + funds + settings)
- 31 sections (hero, stats, markets, awards, footer, etc.)
- 53 UI components (shadcn/ui)
- Interactive trading dashboard with candlestick charts
- Real P&L engine with margin tracking
- Social trading, economic calendar, market news
- Light theme matching AXI website
- Full backend (tRPC + Hono + Drizzle + MySQL)

## Deployment
After pushing to GitHub:
1. Go to https://vercel.com/new
2. Import your repo
3. Add environment variables (DATABASE_URL, etc.)
4. Deploy
