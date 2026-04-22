#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

node scripts/build.mjs

if git diff --quiet -- data/latest.json data/latest.js; then
  echo "No publishable changes."
  exit 0
fi

git add data/latest.json data/latest.js
git commit -m "Update Eisbach tracker"
git push origin main
