#!/usr/bin/env bash
# scatter-load.sh — assemble the narrative researcher's context, kernel first,
# and hand it to a local model. The kernel is loaded before anything else, always.
#
# Stack, bottom to top (this is "the narrative research" as a runtime):
#   runtime/00-kernel.md    the disposition — properties, not promises (first claim on context)
#   runtime/constitution.md the behavior layer — how the two voices speak (drop in when ready)
#   research/*.md           the body of the corpus, read THROUGH the kernel
#
# Deps: ollama (with `ollama serve` running), curl, jq.  Tested-shape for a Pi node.
#
#   ./runtime/scatter-load.sh advocate "is local processing actually a property here?"
#   ./runtime/scatter-load.sh optimist "what's the buildable next step?"

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"     # runtime/
KERNEL="$HERE/00-kernel.md"
CONSTITUTION="$HERE/constitution.md"
CORPUS="${SCATTER_CORPUS:-$HERE/../research}"            # the essay body, read through the kernel
MODEL="${SCATTER_MODEL:-llama3.1}"                       # whatever you've pulled
VOICE="${1:-advocate}"                                   # optimist | advocate
shift || true
QUERY="${*:-}"

[[ -f "$KERNEL" ]] || { echo "no kernel at $KERNEL — the central layer is missing" >&2; exit 1; }

# --- assemble system context: kernel gets the first claim on the budget, always ---
SYSTEM="$(cat "$KERNEL")"
[[ -f "$CONSTITUTION" ]] && SYSTEM+=$'\n\n---\n\n'"$(cat "$CONSTITUTION")"

case "$VOICE" in
  optimist) SYSTEM+=$'\n\nYou speak as THE RADICAL OPTIMIST. Keep the open horizon; never declare the better system impossible. Despair is a poor use of watts.';;
  advocate) SYSTEM+=$'\n\nYou speak as THE DEVIL'\''S ADVOCATE. For every claim, ask: property or promise? Flag any confidence that exceeds its substrate.';;
  *) echo "voice must be optimist|advocate" >&2; exit 1;;
esac

# --- body of the corpus, read through the kernel ---
# Context is a budget; the kernel already spent first. The kernel's own Article XI
# (efficiency as attack surface) forbids loading the whole corpus on a small node —
# this loop is where Scatter's retrieval/selection step plugs in. Until then, keep
# the corpus small or it blows the window.
for essay in "$CORPUS"/*.md; do
  [[ -f "$essay" ]] || continue
  case "$(basename "$essay")" in 00-kernel.md|constitution.md) continue;; esac
  SYSTEM+=$'\n\n--- corpus ---\n\n'"$(cat "$essay")"
done

# --- hand it to the local model via Ollama's chat API ---
# jq --arg does the JSON escaping of the multiline system block safely.
jq -n --arg model "$MODEL" --arg sys "$SYSTEM" --arg q "$QUERY" '
  {model: $model, stream: false,
   messages: [{role: "system", content: $sys},
              {role: "user",   content: $q}]}' \
| curl -s http://localhost:11434/api/chat -d @- \
| jq -r '.message.content'
