@echo off
echo Pushing AXI Trading Platform to GitHub...
git config user.email "deploy@axi-trading.com"
git config user.name "Deploy Bot"
git add .
git commit -m "feat: full merge with Axi-Trader backup - 27 pages, 31 sections, 53 components, light theme, enhanced trading"
git push origin main --force
echo Push complete! Check your GitHub repo.
pause
