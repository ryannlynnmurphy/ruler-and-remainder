# The Studio — the agentic research workstation

The dramaturg, made into a workstation: a living **archive** of research you grow
by machine-arguing. Built **additively** on the proven dramaturg brain
(`api/argue`) — the teaching walk at `/` is untouched.

- **Voice:** one character, two modes (`teach` at `/learn`, `build` at `/studio`).
- **Corpus boundary:** passive archive — kept artifacts are stored & displayed,
  the teaching brain does not drift.
- **Autonomy:** propose-only — the dramaturg proposes; the click is the user's.

See `SYSTEM_PROMPT.md` (disposition) and `SKILL_MAP.md` (prompt modules).

## Session memory format

The **artifact** is the atom. Continuity lives in Neon.

```yaml
# artifact — the keep-worthy unit (the distillation, not the transcript)
id / title / kind(argument|finding|verdict|map|brief) / tier(established|exploratory|speculative)
body / source_conversation_id / status(draft|promoted|in_chapter) / created

# conversation
id / title / mode / messages(jsonb) / starred / created / updated

# corpus_entry — artifact promoted into the living archive (Phase 2; display-only)
artifact_id / note / promoted_at

# chapter — artifacts composed into draft prose (Phase 3)
title / artifact_ids[] / body / status / created
```

**Session checkpoint** (what carries between sessions):
mode · open questions · unresolved tensions · next actions · artifacts created ·
what NOT to touch (load-bearing tooling).

## Build plan & status

1. **Persistence floor** — ✅ `conversations` + `artifacts` tables (`lib/db.js`,
   separate `ensureStudioSchema`), `api/conversations.js` + `api/artifacts.js`,
   the `/studio` surface with a "keep this" button. *(this phase)*
2. **Corpus loop** — promote artifacts → `corpus_entries` (display-only archive).
3. **Chapters** — the agent drafts a chapter from selected artifacts (opus via the router).
4. **Agent tool-use** — the dramaturg *proposes* keeps inline (still propose-only).

## Hard rules (held every step)
- Never edit `api/argue`, `api/reality`, `api/feed`, `api/checks`, the existing
  `lib/db.js` functions, `reality.js`, `audit.js`, or the walk game. Build additively.
- `ensureStudioSchema()` is **separate** from `ensureSchema()` so a Studio failure
  cannot take down the ledger / feed / reality check.
- Re-prove the four live APIs (200/alive) after each ship.

## Open / honest caveats
- **No auth yet.** Like the public ledger, Studio writes are unauthenticated and
  rate-limited best-effort — a public/single-user scratch space for now. Auth +
  per-user scoping is a later phase before this holds anyone's private research.
