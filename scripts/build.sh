#!/bin/bash

set -e

DB_PUSH=false
DEPLOYMENT_URL="https://vercel.com/nrjdalals-projects/spacewall/${VERCEL_DEPLOYMENT_ID#dpl_}"

notify_failure() {
  curl \
    -H "Title: Vercel" \
    -H "Priority: high" \
    -H "Click: $DEPLOYMENT_URL" \
    -H "Actions: view, deployment logs, $DEPLOYMENT_URL" \
    -d "🔴 $VERCEL_ENV build failed, click to check logs" \
    ntfy.sh/nrjdalal &>/dev/null
}

trap 'notify_failure' ERR

start_time=$(date +%s)

if [ "$DB_PUSH" = true ]; then
  bun run drizzle-kit push
fi

bun run next build

end_time=$(date +%s)
elapsed_time=$((end_time - start_time))
minutes=$((elapsed_time / 60))
seconds=$((elapsed_time % 60))

curl \
  -H "Title: Vercel" \
  -H "Priority: low" \
  -H "Click: $DEPLOYMENT_URL" \
  -H "Actions: view, deployment logs, $DEPLOYMENT_URL" \
  -d "🟢 $VERCEL_ENV build completed in ${minutes}m ${seconds}s" \
  ntfy.sh/nrjdalal &>/dev/null
