#!/bin/bash

set -e

rm -rf ./out
excludes=(
  '.git'
  '.next'
  'node_modules'
  'test'
)

rsync -a --delete \
  "${excludes[@]/#/--exclude=}" \
  ./ ./out
cd ./out
bun i
bun run next lint
bun run next build
cd ..
bunx lint-staged --verbose
