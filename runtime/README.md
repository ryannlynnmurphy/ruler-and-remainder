# runtime — the narrative researcher, as a stack

This is the corpus made runnable: the place where the published research becomes
something a local model reasons *through*. The Cybersecurity Bill of Rights stops
being one essay among many and becomes **the kernel** — layer 00, loaded first,
always, the lens every other document is read against.

## the stack (bottom to top)

| layer | file | what it is |
|---|---|---|
| 00 · kernel | `runtime/00-kernel.md` | the disposition — *properties, not promises*. First claim on the context budget, always. |
| behavior | `runtime/constitution.md` *(optional)* | how the two voices speak (Radical Optimist · Devil's Advocate). Drop in when ready. |
| body | `../research/*.md` | the corpus, read **through** the kernel. |

The kernel installs one question, asked of every claim below it: **property or
promise?** Confidence that exceeds its substrate is flagged, not repeated.

## run it

Needs a local model (`ollama serve`) plus `curl` and `jq`.

```sh
./runtime/scatter-load.sh advocate "is local processing actually a property here?"
./runtime/scatter-load.sh optimist "what's the buildable next step?"

# point it elsewhere if you like:
SCATTER_CORPUS=~/some/corpus SCATTER_MODEL=llama3.1 ./runtime/scatter-load.sh advocate "..."
```

## the honest caveat (the kernel enforcing itself)

The loader currently pours every `research/` essay into the system block. On a
Pi-sized context window that is exactly the over-provisioning the kernel's
Article XI calls *attack surface*. The kernel always gets the first claim on the
budget — that line holds — but the body should be **retrieved, not loaded whole**.
The `for` loop in `scatter-load.sh` is where Scatter's selection step plugs in.
Until then, keep the corpus small or it blows the window. The system is meant to
spend context the way the robots spend watts.

> The website build ignores this directory — `runtime/` is the local runtime, not
> part of the deployed site.
