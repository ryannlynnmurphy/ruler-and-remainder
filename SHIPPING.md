# Shipping to Production — the checklist

A plain-language playbook for putting a change live with confidence. Written for
this repo (static build → Vercel), but the spine applies to any product. The
order matters: each step catches a class of failure the next one assumes is gone.

---

## 0. Before you touch code — know what "done" looks like
- Write the one-sentence goal. ("The chat fills the screen; the corpus is its own footer.")
- Name how you'll *prove* it works — a thing you can see or a command you can run.
  If you can't state the test, you don't yet understand the change.

## 1. Make the change small and legible
- One concern per commit. A reviewer (or future you) should read the diff and
  understand *why*, not just *what*.
- Match the surrounding code's style. Don't reformat unrelated lines.

## 2. Build it clean — no red
```sh
npm run build          # must succeed with zero errors
node --check <file>    # every .js you touched parses
```
If the build isn't green locally, it won't be green on Vercel. Never push red.

## 3. Smoke test — exercise the real paths, not just the happy one
A smoke test is "does the thing actually run end to end," not "do units pass."
Run the app (`vercel dev`) and hit each path that the change touches:
- **The happy path** — the normal case works.
- **Every branch you added** — toggles on AND off, each routing tier.
- **The failure paths** — what happens when a dependency is down, a key is
  missing, input is empty, the network drops. These are where products break in
  front of users.

Capture the actual output. "It should work" is not a test result.

## 4. Hunt edge cases — the list that saved this ship
For anything that talks to a model, a node, or a network, ask:
- **Missing credential** — does it fail honestly, or 500? (We found a 503 that
  blocked the local-only path because it demanded a cloud key it never needed.)
- **Dependency offline** — node down, API down: honest message, no hang, no leak.
- **Dependency *slow*** — a timeout that fails closed beats a spinner forever.
  (Our local node stalled under RAM pressure; the code correctly refused rather
  than escalating silently.)
- **Empty / huge / hostile input** — empty message, 10k-char paste, an image
  where text was expected.
- **Fail closed, not open** — when "local-only / private / sensitive" can't be
  honored, REFUSE. Never quietly route private data to the cloud as a fallback.
- **Mobile reality** — keyboard, safe-area, double-tap zoom, no horizontal scroll.
- **Reduced motion / accessibility** — animation off when the user asked for less.

## 5. Secrets discipline — the one that ends careers
- **Never `git add -A` near env files.** Stage explicit paths: `git add file1 file2`.
- `.env*` must be gitignored (it is here, except `.env.example`).
- Before every commit: `git status` and confirm no `.env`, no `*.tmp`, no key file.
- Pulled prod secrets for a local test? Delete them the moment you're done.
- A leaked key in git history is leaked forever, even after you delete the file.

## 6. Push — the right branch, the honest message
```sh
git add <explicit paths>
git commit -m "what changed and why"   # body explains the why + what was tested
git push origin master                  # Vercel deploys master automatically
```
- Know which branch deploys to prod (here: `master`). A push to the wrong branch
  ships nothing — or ships the wrong thing.
- For risky changes, open a PR first → Vercel builds a **preview URL** → look at
  it before merging. A preview that builds clean and looks right is your last gate.

## 7. Verify in production — the deploy isn't the proof
- Open the live URL. Re-run the key smoke-test paths *against prod*, not just dev.
- Check the one metric that matters for this change (does the dot turn green? does
  the chat fill the screen on a real phone?).
- Watch the Vercel deploy log for the build you just triggered — green there ≠
  working, but red there = definitely broken.

## 8. Know your rollback before you need it
- A bad deploy is one revert away: `git revert <sha> && git push`, or roll back
  the deployment in the Vercel dashboard.
- This is why small commits matter — reverting one concern doesn't undo five.

---

## The honest-engineer rules (the ones that actually keep prod up)
1. **If you didn't test it, say so.** "Verified live" and "should work" are
   different claims. Never blur them.
2. **Environment failures are findings, not noise.** A model that hangs on a
   starved box tells you something about prod capacity. Write it down.
3. **Degrade honestly.** Every external dependency *will* be down sometime. Decide
   now what the user sees when it is — and make it the truth.
4. **The classifier / the guard saying "no" is a feature.** When something blocks
   a risky action (pushing secrets, dumping prod creds), it's protecting the ship.
   Work *with* it, don't route around it.
5. **Production is for users, not for debugging.** Find it in dev or preview. The
   live site is the last place you want to discover an edge case.

---

## This repo, specifically
- **Build:** `npm run build` → `dist/` (static). Vercel serves `dist/`, runs
  `api/*.js` as serverless functions.
- **Deploys from:** `master`.
- **Local dev with functions:** `vercel dev` (needs `.env` with `ANTHROPIC_API_KEY`;
  optional `OLLAMA_URL` + `OLLAMA_MODEL` for the local rung).
- **The local-first router:** `auto` clears on the local node and escalates to
  Claude only when needed; `local-only` pins to the node and fails closed. The
  dot reads `/api/health`. Prod only lights up local if `OLLAMA_URL` points at a
  reachable node (a Tailscale funnel to a real box) — otherwise it honestly serves
  from the cloud.
