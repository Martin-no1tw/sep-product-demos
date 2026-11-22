#!/usr/bin/env bash
set -euo pipefail

# SEP V4 static showcase only. Do not publish archived V3 folders or repo docs.
rm -rf dist
mkdir -p dist
cp index.html dist/index.html
cp robots.txt dist/robots.txt
cp -R assets dist/assets
cat > dist/_headers <<'EOF'
/*
  X-Robots-Tag: noindex, nofollow, noarchive
EOF
printf 'SEP V4 demo is ready in dist/\n'
