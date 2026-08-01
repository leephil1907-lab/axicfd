#!/bin/bash
# AXI Trading Platform - Auto Push Script
# Run this in your terminal after extracting the zip

echo "🚀 Pushing AXI Trading Platform to GitHub..."

# Configure git (temporary for this push)
git config user.email "deploy@axi-trading.com"
git config user.name "Deploy Bot"

# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: full merge with Axi-Trader backup - 27 pages, 31 sections, 53 components, light theme, enhanced trading"

# Push to origin
git push origin main --force

echo "✅ Push complete! Check your GitHub repo."
