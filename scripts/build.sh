#!/bin/bash

set -e

DB_PUSH=false

if [ "$DB_PUSH" = true ]; then
  bun run drizzle-kit push
fi

bun run next build

curl -s \
  --form-string "token=$PUSHOVER_TOKEN" \
  --form-string "user=$PUSHOVER_USER" \
  --form-string "message=BUILD SUCCESSFUL" \
  https://api.pushover.net/1/messages.json
