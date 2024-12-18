#!/bin/bash

set -e

DB_PUSH=false

if [ "$DB_PUSH" = true ]; then
  bun run drizzle-kit push
fi

bun run next build
