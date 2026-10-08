#!/usr/bin/env bash
# Builds the single-file site from src/.
#   dist/index.html    standalone page (open directly or host anywhere)
#   dist/artifact.html same page without <!doctype>/<html>/<head>/<body>, for publishing as a claude.ai Artifact
#   dist/test.html     standalone page that loads ./three.min.js locally (for headless screenshot tools)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
THREE='<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
body() {
  cat src/head.html
  echo '<style>'; cat src/style.css; echo '</style>'
  cat src/body.html
  echo "$1"
  echo '<script>'; cat src/app.js; echo '</script>'
}
body "$THREE" > dist/artifact.html
{ echo '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'; cat dist/artifact.html; echo '</body></html>'; } > dist/index.html
{ echo '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'; body '<script src="three.min.js"></script>'; echo '</body></html>'; } > dist/test.html
[ -f dist/three.min.js ] || cp tools/vendor/three.min.js dist/three.min.js 2>/dev/null || true
echo "built dist/index.html dist/artifact.html dist/test.html"
