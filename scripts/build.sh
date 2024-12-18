#!/bin/bash

set -e

DB_PUSH=false
DEPLOYMENT_URL="https://vercel.com/nrjdalals-projects/spacewall/${VERCEL_DEPLOYMENT_ID#dpl_}"

notify_failure() {
  curl -s \
    --form-string "token=$PUSHOVER_TOKEN" \
    --form-string "user=$PUSHOVER_USER" \
    --form-string "html=1" \
    --form-string "title=error building $VERCEL_ENV" \
    --form-string "message=<font color=\"#ef4444\">your last $VERCEL_ENV deployment failed</font>" \
    --form-string "url_title=deployment logs" \
    --form-string "url=$DEPLOYMENT_URL" \
    https://api.pushover.net/1/messages.json
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

curl -s \
  --form-string "token=$PUSHOVER_TOKEN" \
  --form-string "user=$PUSHOVER_USER" \
  --form-string "html=1" \
  --form-string "title=$VERCEL_ENV build is ready" \
  --form-string "message=build completed in $minutes min and $seconds sec" \
  --form-string "priority=-1" \
  https://api.pushover.net/1/messages.json
