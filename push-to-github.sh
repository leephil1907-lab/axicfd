#!/bin/bash
# AXI TRADES Platform - Auto Push Script
# Run this in your terminal after extracting the zip

echo "🚀 Pushing AXI TRADES to GitHub..."

# Configure git
git config user.email "deploy@axitrades.com"
git config user.name "Deploy Bot"

# Ensure remote URL is set
git remote set-url origin https://github.com/leephil1907-lab/axicfd.git 2>/dev/null || git remote add origin https://github.com/leephil1907-lab/axicfd.git
git branch -M main

# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: AXI TRADES release - domain axitrades.com and support updates"

# Push to origin
git push -u origin main

echo "✅ Push complete! Check https://github.com/leephil1907-lab/axicfd"

