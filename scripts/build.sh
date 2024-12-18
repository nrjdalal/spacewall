#!/bin/bash

set -e

DB_PUSH=false
DEPLOYMENT_URL="https://vercel.com/nrjdalals-projects/spacewall/${VERCEL_DEPLOYMENT_ID#dpl_}"

notify_failure() {
  # curl -s \
  #   --form-string "token=$PUSHOVER_TOKEN" \
  #   --form-string "user=$PUSHOVER_USER" \
  #   --form-string "html=1" \
  #   --form-string "message=🔴 $VERCEL_ENV build failed, <a href=\"$DEPLOYMENT_URL\">check logs</a>" \
  #   https://api.pushover.net/1/messages.json
  curl \
    -H "Icon: https://registry.npmmirror.com/@lobehub/icons-static-png/1.10.0/files/dark/vercel.png" \
    -H "Title: $VERCEL_ENV build failed" \
    -H "Priority: high" \
    -H "Tags: red_circle" \
    -H "Click: $DEPLOYMENT_URL" \
    -H "Actions: view, deployment logs, $DEPLOYMENT_URL" \
    -d "Vercel" \
    ntfy.sh/nrjdalal
}

trap 'notify_failure' ERR

false

start_time=$(date +%s)

if [ "$DB_PUSH" = true ]; then
  bun run drizzle-kit push
fi

bun run next build

end_time=$(date +%s)
elapsed_time=$((end_time - start_time))
minutes=$((elapsed_time / 60))
seconds=$((elapsed_time % 60))

curl -s \
  --form-string "token=$PUSHOVER_TOKEN" \
  --form-string "user=$PUSHOVER_USER" \
  --form-string "priority=-1" \
  --form-string "message=🟢 $VERCEL_ENV build completed in ${minutes}m ${seconds}s" \
  https://api.pushover.net/1/messages.json
