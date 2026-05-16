#!/bin/bash
set -e

# NOTE: Stripe webhook, checkout, and email routes require a server.
# For those to work, deploy to Netlify (netlify.toml already configured) or Vercel.
# Surge.sh deployment is for the public-facing static marketplace pages only.
# Admin dashboard also requires server functions — use Netlify for full deployment.

echo "Building for static export..."
npm run build
echo "Deploying to Surge..."
npx surge ./out fulatelier.surge.sh --domain fulatelier.surge.sh
echo "Deployed! Visit https://fulatelier.surge.sh"
