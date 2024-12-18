#!/bin/bash

set -e

DB_PUSH=false

DEPLOYMENT_URL="https://vercel.com/nrjdalals-projects/spacewall/${VERCEL_DEPLOYMENT_ID#dpl_}"

notify_failure() {
  curl -s \
    --form-string "token=$PUSHOVER_TOKEN" \
    --form-string "user=$PUSHOVER_USER" \
    --form-string "title=error building $VERCEL_ENV" \
    --form-string "html=1" \
    --form-string "message=please check <a href="$DEPLOYMENT_URL">deployment logs</a>" \
    https://api.pushover.net/1/messages.json
}

trap 'notify_failure' ERR

false

# Record the start time
start_time=$(date +%s)

if [ "$DB_PUSH" = true ]; then
  bun run drizzle-kit push
fi

# Build process
bun run next build

# Record the end time
end_time=$(date +%s)

# Calculate the duration
elapsed_time=$((end_time - start_time))

# Convert to minutes and seconds (optional)
minutes=$((elapsed_time / 60))
seconds=$((elapsed_time % 60))

# Send success notification with build duration
curl -s \
  --form-string "token=$PUSHOVER_TOKEN" \
  --form-string "user=$PUSHOVER_USER" \
  --form-string "title=$VERCEL_ENV build is ready" \
  --form-string "message=Build completed in $minutes minutes and $seconds seconds." \
  https://api.pushover.net/1/messages.json
