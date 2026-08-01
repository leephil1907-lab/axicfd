# AXI Trading Platform - Complete Professional Deployment Guide

## Pre-Deployment Checklist

### SEO & Marketing
- [ ] Replace `G-XXXXXXXXXX` with real Google Analytics 4 ID in `.env`
- [ ] Replace `xxxxxxxxxx` with real Microsoft Clarity ID in `.env`
- [ ] Add Google Search Console verification code to `public/google-site-verification.html`
- [ ] Add Bing Webmaster verification code to `public/BingSiteAuth.xml`
- [ ] Upload real OG image to `public/og-image.jpg` (1200x630)
- [ ] Upload real favicon to `public/favicon.ico`
- [ ] Update `siteConfig` in `src/lib/seo.ts` with real URLs and social handles

### Legal
- [ ] Review all legal documents (Privacy Policy, Terms, Risk Disclosure)
- [ ] Add company registration numbers and regulatory licenses
- [ ] Update contact information and DPO details
- [ ] Add jurisdiction-specific disclaimers

### Analytics Setup
1. **Google Analytics 4**:
   - Create property at analytics.google.com
   - Copy Measurement ID (G-XXXXXXXXXX)
   - Add to `.env` as `VITE_GA_ID`
   - Set up custom events for trading actions

2. **Microsoft Clarity**:
   - Sign up at clarity.microsoft.com
   - Create project and copy Project ID
   - Add to `.env` as `VITE_CLARITY_ID`
   - Enable heatmaps and session recordings

3. **Google Search Console**:
   - Add property at search.google.com/search-console
   - Verify via HTML file upload
   - Submit sitemap.xml

4. **Bing Webmaster Tools**:
   - Add site at bing.com/webmasters
   - Verify via XML file
   - Submit sitemap

### Database
- [ ] Set up MySQL database (PlanetScale recommended for Vercel)
- [ ] Run migrations: `npx drizzle-kit migrate`
- [ ] Seed instruments: `npx tsx db/seed.ts`
- [ ] Create admin user

### Environment Variables
```env
DATABASE_URL=mysql://...
LOCAL_AUTH_SECRET=...
VITE_GA_ID=G-XXXXXXXXXX
VITE_CLARITY_ID=xxxxxxxxxx
VITE_BASE_URL=https://your-domain.com
```

## Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete professional deployment with SEO, analytics, legal"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to vercel.com/new
   - Import GitHub repo
   - Framework: Other
   - Add all environment variables
   - Deploy

3. **Post-Deployment**:
   - Verify sitemap at `/sitemap.xml`
   - Check robots.txt at `/robots.txt`
   - Test OG tags with Facebook Debugger
   - Test structured data with Google Rich Results Test
   - Submit sitemap to Search Console

## Pages Included (50+)

### Public Pages
- Home, Markets (Forex, Crypto, Commodities, Indices, Shares)
- Platforms (MT4, MT5, WebTrader)
- Trading Tools, Learn, Partnerships, Company
- Blog, Help Center, Contact
- Open Account, Login, Register

### Legal Pages
- Privacy Policy, Terms of Service, Risk Disclosure
- Cookie Policy, AML Policy, GDPR Compliance

### Trading Pages
- Dashboard, Trading Dashboard, Admin Dashboard
- Funds (Deposit, Withdraw, Transfer)
- Settings, Axi Select (Leaderboard)

### Support Pages
- Help Center, FAQ, Contact Form
- Live Chat integration

## SEO Features
- ✅ Schema.org structured data (Organization, Breadcrumb, FAQ, Article)
- ✅ XML sitemap generation
- ✅ robots.txt
- ✅ Open Graph & Twitter Cards
- ✅ Canonical URLs
- ✅ Internal linking
- ✅ Breadcrumb navigation
- ✅ Meta tags for all pages
- ✅ Google Analytics 4
- ✅ Microsoft Clarity
- ✅ Google Search Console ready
- ✅ Bing Webmaster Tools ready

## Performance
- Lazy loading for all pages
- Code splitting
- Image optimization ready
- CDN ready (Vercel Edge)
