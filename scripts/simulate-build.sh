#!/bin/bash

set -e

rm -rf ./out
rsync -a --delete \
  --exclude='.dev' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='node_modules' \
  ./ ./out
cd ./out
bun i
bun run next build
cd ..
bunx lint-staged --verbose
