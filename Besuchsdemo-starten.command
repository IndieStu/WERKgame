#!/bin/bash
set -e
cd "$(dirname "$0")"
DEMO_NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [ ! -x "$DEMO_NODE" ]; then DEMO_NODE="$(command -v node || true)"; fi
if [ -z "$DEMO_NODE" ]; then echo 'Node.js fehlt. Bitte die bereits gestartete Vorschau über http://localhost:4190/?demo=visit öffnen.'; read -r; exit 1; fi
if /usr/bin/curl -fsS 'http://localhost:4190/index.html' >/dev/null 2>&1; then
  /usr/bin/open 'http://localhost:4190/?demo=visit'
  exit 0
fi
if [ ! -f dist/index.html ]; then echo 'Der Produktionsbuild fehlt. Bitte zuerst pnpm build ausführen.'; read -r; exit 1; fi
(sleep 2; /usr/bin/open 'http://localhost:4190/?demo=visit') &
echo 'WERK-Besuchsdemo. Dieses Fenster während der Vorführung offen lassen.'
exec "$DEMO_NODE" node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4190 --strictPort
