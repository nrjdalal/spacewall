#!/bin/bash

set -e

DB_PUSH=false

notify_failure() {
  curl -s \
    --form-string "token=$PUSHOVER_TOKEN" \
    --form-string "user=$PUSHOVER_USER" \
    --form-string "message=Build failed at $VERCEL_ENV env" \
    https://api.pushover.net/1/messages.json
}

trap 'notify_failure' ERR

exit 1

if [ "$DB_PUSH" = true ]; then
  bun run drizzle-kit push
fi

bun run next build

curl -s \
  --form-string "token=$PUSHOVER_TOKEN" \
  --form-string "user=$PUSHOVER_USER" \
  --form-string "message=Build successful for $VERCEL_ENV env." \
  https://api.pushover.net/1/messages.json
