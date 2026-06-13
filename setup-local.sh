#!/usr/bin/env sh
# Dorothy — one-shot local model setup.
# Installs Ollama (if missing), starts it, and pulls the models the local rung uses.
# Safe to re-run: every step is idempotent.
#
#   curl -fsSL https://ruler-and-remainder.vercel.app/setup-local.sh | sh
#
set -e

TEXT_MODEL="${OLLAMA_MODEL:-qwen2.5}"
VISION_MODEL="${OLLAMA_VISION_MODEL:-llava}"

say() { printf '\033[31m> %s\033[0m\n' "$1"; }

say "Dorothy — setting up the local rung"

# 1. Install Ollama if it isn't here yet.
if ! command -v ollama >/dev/null 2>&1; then
  say "Installing Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
else
  say "Ollama already installed ($(ollama --version 2>/dev/null | head -1))"
fi

# 2. Make sure the server is up (localhost:11434).
if ! curl -fsS http://localhost:11434/api/tags >/dev/null 2>&1; then
  say "Starting ollama serve..."
  (ollama serve >/dev/null 2>&1 &)
  i=0
  while [ $i -lt 20 ]; do
    curl -fsS http://localhost:11434/api/tags >/dev/null 2>&1 && break
    i=$((i + 1)); sleep 1
  done
fi

# 3. Pull the models the cascade reaches for.
say "Pulling $TEXT_MODEL (the local text rung)..."
ollama pull "$TEXT_MODEL"
say "Pulling $VISION_MODEL (the local vision rung)..."
ollama pull "$VISION_MODEL" || say "Skipped $VISION_MODEL (optional — images escalate to the cloud)."

say "Done. The local node is live at http://localhost:11434"
say "To use it from the deployed site: expose this node (Tailscale funnel) and set OLLAMA_URL."
