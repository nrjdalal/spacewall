#!/bin/bash

set -e

rm -rf ./out
rsync -a --delete \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='test' \
  ./ ./out
cd ./out
bun i
bun run next lint
bun run next build
cd ..
bunx lint-staged --verbose
