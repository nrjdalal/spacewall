#!/bin/bash

set -e

excludes=(
  '.git'
  '.next'
  'node_modules'
  'test'
)

rm -rf ./out
rsync -a --delete \
  "${excludes[@]/#/--exclude=}" \
  ./ ./out
cd ./out
bun i
bun run next lint
bun run next build
cd ..
bunx lint-staged --verbose
