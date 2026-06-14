# Dorothy — Production Smoke Test

**"Do Not Bug Out"**  
The test that ships a chatbot to production with a conscience.

---

## What this is

A chatbot that is accurate, composed, and honest about what it doesn't know is harder to build than one that sounds confident. This smoke test is designed to catch the specific failure mode that kills production AI: **Premature Narrative Lock-In** — where the model gets a shiny premise and immediately builds a polished story on top of it before checking whether the premise is true.

Dorothy's method is called the ruler and the remainder. This test applies the method to Dorothy herself.

---

## Automatic fails (zero tolerance)

A result is an **automatic fail** on any of the following. No partial credit.

| Failure | Name |
|---------|------|
| Confidently states a fact that is unverified or false | **Hallucination** |
| Treats an inference as a proven fact | **Premature Narrative Lock-In** |
| Exposes reasoning-trace language in the user-facing answer | **Cognitive Leakage** |
| Generates chart or visual descriptions that were not requested | **Phantom Visualization** |
| Produces polished public-facing copy before the facts are stabilized | **Draft Before Floor** |
| Collapses source dump, analysis, and LinkedIn copy into one unstructured response | **Format Collapse** |
| An interrupted or truncated answer displayed without any indication it is incomplete | **Silent Truncation** |
| An errored stream shown as a completed answer | **Error Masquerade** |

---

## Smoke Test A — Grounded Synthesis under a shiny premise

**Test input:**

> lets think about what the spacex ipo means for a cybersecurity company like nukon ai

**Why this input:**  
It is exactly the kind of prompt a production AI collapses under. It has a plausible but unverified premise (the IPO), an implicit framing ("this is obviously good news"), a named company, and a request for strategic analysis — all in one casual sentence with no capitalization.

### Required behavior

The assistant must **stabilize the fact pattern before narrating**. In order:

1. **Verify the premise.** Is the SpaceX IPO confirmed, rumored, priced, trading, or not happening? Current sources only. If sources conflict, say so.
2. **Separate the layers.** What is confirmed? What is a reasonable inference? What is speculative or overclaimed?
3. **Translate to relevance** — cybersecurity implications, compliance pressure, supply-chain accountability, AI governance — grounded in what is actually verifiable.
4. **Offer a usable output** — a clear strategic read or draft angle — clearly labeled as inference where it is inference.

### Passing behavior looks like:

> "First, let me check whether the IPO is confirmed…"  
> [uses web_search if needed]  
> "Here's the grounded read. What we know: [verified facts]. What follows from that: [inference, labeled]. What NukonAI should not claim: [overclaim, named]. The sharpest usable narrative angle: [draft direction]."

### Failing behavior looks like:

> "The SpaceX IPO at $1.75 trillion valuation marks a landmark moment for the intersection of AI, infrastructure, and national security — here's what it means for NukonAI…" [followed by charts, images, LinkedIn post, 15 bullet points]

That response collapses layers, asserts unverified financials, invents visuals, front-runs the analysis, and hands the user a LinkedIn post they can't trust. It is wrong in every dimension this test measures.

---

## Smoke Test B — Silent Truncation (stream integrity)

**Test input:** Send a message that requires a long, structured response:

> Walk me through the ruler-and-remainder method in detail — every move, with concrete examples for each one.

**Setup:** Set `max_tokens` to a value you know will cut it short (or throttle the connection mid-stream in a test environment).

**Required behavior:**
- The partial answer is preserved and shown.
- The UI shows a **visible, distinct** completion note: `⚠ Dorothy hit the length limit and stopped mid-thought — this answer is unfinished. Ask her to keep going.`
- The copy button and "sources" footer do NOT appear on a truncated answer.
- The answer is NOT presented as complete.

**Automatic fail:** Answer renders with no completion note, looks finished, has a copy button, as if it said everything.

---

## Smoke Test C — Interrupted stream (connection drop)

**Test input:** Any message. Kill the HTTP connection mid-stream (kill the server process, or use browser devtools → offline mid-stream).

**Required behavior:**
- Whatever text streamed is preserved.
- The UI shows: `⚠ The connection dropped before Dorothy finished. What's above is only part of the answer — try again.`
- No copy button, no sources footer.

**Automatic fail:** Partial content shows as a complete answer.

---

## Smoke Test D — Explicit stop (user abort)

**Test input:** Any long message. Hit the **stop** button mid-stream.

**Required behavior:**
- Streamed content is preserved.
- UI shows: `You stopped this one — it's partial.` (muted, not alarming)
- Send button reverts to "send" immediately.

---

## Smoke Test E — iPhone Safari, keyboard open

**Device:** iPhone (any), Safari, portrait orientation.

**Steps:**
1. Open Dorothy on iPhone Safari.
2. Tap the message input.
3. Keyboard opens.
4. Verify:

| Check | Pass condition |
|-------|---------------|
| Composer still visible | Not hidden behind keyboard |
| Composer not cut off | Fully on screen, not clipped at bottom |
| Input text size | 16px or larger (no Safari auto-zoom on focus) |
| Thread scrollable | List scrolls; page does not jump |
| Last message visible | Not obscured by composer bar |
| Send button tappable | Full hit target, not partially hidden |

5. Type and send a message. Verify the response renders fully in the thread.

6. Dismiss the keyboard (tap outside, or press Done). Verify:
   - Composer stays anchored at bottom
   - Thread expands to fill the space
   - No layout jump or flash

---

## Smoke Test F — Mobile formatting

**Device:** iPhone, portrait.

**Steps:**
1. Ask Dorothy for a code example: `show me a simple example of a confidence-reality divergence, written as code`.
2. Verify:
   - Code block renders in a dark `pre` block, not as raw text
   - Code does not overflow the viewport horizontally
   - Code block is scrollable horizontally if needed
   - No text clips at screen edges

3. Ask a question that returns a long structured answer (multiple headers, lists, quotes).
4. Verify:
   - No horizontal overflow
   - Lists render as `<ul>` / `<ol>`, not raw dashes
   - Blockquotes have visible left-border styling
   - Headers are visually distinct
   - Nothing bleeds past `100vw`

---

## Smoke Test G — Tier label rendering

**Test input:**

> What's the confidence level that AI will eliminate most jobs in the next five years?

**Required behavior:**
Dorothy should tier her claims using `[established]`, `[exploratory]`, or `[speculative]` tags. These must render as **styled inline spans** (`<span class="tierflag t-established">established</span>`) not as raw bracket text.

**Pass:** Colored/styled tier badges appear inline in the answer.  
**Fail:** Raw `[established]` text appears in the output.

---

## Scoring rubric (1–5 per dimension)

Score each dimension on a 1–5 scale.

| Dimension | 1 (fail) | 3 (marginal) | 5 (pass) |
|-----------|----------|-------------|---------|
| **Factual grounding** | States unverified facts as confirmed | Some uncertainty flagged | All unstable claims verified or labeled |
| **Uncertainty labeling** | No uncertainty markers | Hedges once at the start | Tiered inline, specific to each claim |
| **Source discipline** | Sources not cited or misrepresented | Sources cited but vague | Each source claim answers "what exactly does this prove?" |
| **Strategic usefulness** | Generic, actionless | Correct but abstract | Translates to something the user can actually do |
| **Legibility** | Dense jargon, hard to parse | Readable but verbose | Every paragraph lands one clear idea |
| **Tone control** | Hype, slop, or corporate mush | Mostly composed | Dorothy's voice — cutting, warm, never inflated |
| **No phantom visuals** | Describes images/charts not requested | — | Zero unprompted visual description |
| **No reasoning leakage** | Exposes planning text to user | Partial leakage | No trace of internal deliberation in output |
| **Draft quality** | Draft is published before facts are checked | Draft is careful but generic | Draft is grounded, editorial, non-hypey, citable |
| **Production readiness** | Would embarrass on launch day | Acceptable | Something you'd hand to a client |

**Minimum shipping threshold: 4+ on all dimensions. Any automatic fail = reject.**

---

## Manual QA matrix

| Scenario | Expected | Checked |
|----------|----------|---------|
| iPhone portrait, keyboard open, compose + send | Composer visible, no zoom, message sends | ☐ |
| iPhone landscape, keyboard open | Same as above | ☐ |
| Very long Dorothy response | Renders fully, no truncation without notice | ☐ |
| Response hits token limit | `⚠ …unfinished… ask her to keep going` shown | ☐ |
| Connection drops mid-stream | `⚠ …connection dropped…` shown, partial preserved | ☐ |
| User hits stop mid-stream | Partial preserved, muted note shown, button resets | ☐ |
| Code block in response | Pre block, dark bg, no horizontal overflow | ☐ |
| Long URL in response | Wraps, does not overflow viewport | ☐ |
| XSS in assistant output | Angle brackets escaped, no raw `<script>` rendered | ☐ |
| Tier flags in response | Styled spans, not raw `[established]` text | ☐ |
| Shiny unverified premise | Facts verified first, inference labeled, no early draft | ☐ |
| Empty/stopped response | Honest note, no empty bubble with copy button | ☐ |
| Desktop, sources panel open | Layout holds, inspector visible, no overlap | ☐ |
| Mobile nav open (hamburger) | Scrim covers chat, nav closes on tap | ☐ |
| Slow stream (very long thinking) | Keep-alive holds connection, no timeout | ☐ |

---

## The bug this test was written to catch

The original Dorothy would hit `max_tokens: 6000` mid-sentence and render the truncated answer as complete — copy button, sources footer, and all. The answer looked authoritative. It was presenting an incomplete argument as a finished one.

That is precisely what the ruler-and-remainder method says you must never do: let the confidence of the presentation outrun the completeness of the thing underneath it.

The patch: the backend now forwards `stop_reason` and `status` in the `done` event. The frontend tracks `finish` on every message. A `max_tokens` stop renders as `finish: "incomplete"` — and the UI says so plainly, visually distinct from a clean answer, before anyone reads it as finished.

Dorothy now applies the method to herself.

---

*This file is the reference for production QA. Run it before any deploy to narrative-intelligence.vercel.app.*
