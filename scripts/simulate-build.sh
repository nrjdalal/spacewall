#!/bin/bash

set -e

ignore=(
  '.git'
  '.next'
  '.sst'
  'node_modules'
  'sst.config.ts'
  'test'
)

rm -rf ./out
rsync -a --delete \
  "${ignore[@]/#/--exclude=}" \
  ./ ./out
cd ./out
bun i
bun run next lint
bun run next build
cd ..
bunx lint-staged --verbose
