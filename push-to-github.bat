@echo off
echo Pushing AXI TRADES to GitHub...
git config user.email "deploy@axitrades.com"
git config user.name "Deploy Bot"
git remote set-url origin https://github.com/leephil1907-lab/axicfd.git
git branch -M main
git add .
git commit -m "feat: AXI TRADES release - domain axitrades.com and support updates"
git push -u origin main
echo Push complete! Check https://github.com/leephil1907-lab/axicfd
pause

