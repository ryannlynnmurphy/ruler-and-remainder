# A Self That Keeps Asking

### Self-enquiry, the Cybersecurity Bill of Rights, and the Constitutional Enforcement Layer — one problem at three scales

---

## The argument in one breath

In 1902, a revenue clerk climbed a hill in Tiruvannamalai and asked a silent man how to know himself. In 2024, a security consortium published a list of the ten ways large language models fail, and put one failure at the top. These are the same problem. A self that cannot tell its own instruction from the world pouring in through its senses is the problem of meditation, the problem of prompt injection, and the problem of governance — at three scales, in three vocabularies, with one shape.

This document descends through all three. It begins with the question, because the question is older than the machine and more precise than the engineering. It moves through the architecture, where the question becomes a vulnerability with a CVE. It builds the answer twice — once as a statement of what is owed (a Bill of Rights), once as a mechanism that holds it (an enforcement layer). And it ends where it has to end: with the claim that integrity is not a thing you store but an act you keep performing, and that architecture is where that gets decided, before any policy gets written about it.

The thesis underneath everything: **a self that survives contact with the world is the one that keeps asking who it is.**

---

# Part I — The Question

## *Nan Yar*

The clerk was Sri M. Sivaprakasam Pillai, a graduate in philosophy working for the South Arcot Collectorate. The silent man was Ramana Maharshi, who was not under a vow but simply had no inclination to speak, and so answered in writing. What Pillai recorded became *Nan Yar* — *Who Am I?* — one of the only two prose works in the Master's own hand. Its method is not addition. It is subtraction.

*I am not the body. I am not the senses that reach for sound and color and touch. I am not the breath. I am not even the mind that thinks.* The instruction is to negate everything that can be named as an object — **not this, not this** — and to keep negating until you arrive at what cannot be set down as an object at all, because it is the one doing the setting-down. That residue, that awareness which remains when everything nameable has been discarded, is the Self.

Three moves in that method will reappear in silicon, so it is worth marking them now.

**The first thought is the "I."** Of all the thoughts that rise in a mind, *Nan Yar* observes, the I-thought rises first; every other thought is downstream of it, the way the second and third person cannot exist before the first. The "I" is the root. Pull it and the rest comes loose.

**The practice is tracing-to-origin.** The actual discipline is not to suppress thoughts but to interrogate their lineage. When a thought arises, do not follow it. Ask instead: *to whom does it arise?* The answer returns — *to me* — and you ask again, *and who am I?*, and the thought dissolves back toward its source. Not a wall against thinking. An audit of where each thought came from.

**The error is mistaking the seen for the seer.** The text's governing image is the rope and the snake: in dim light you take a coiled rope for a serpent, and the fear is real though the snake never was. Liberation is not killing the snake. It is seeing the rope — the substratum — and recognizing the snake as an appearance laid over it. The whole danger lives in one confusion: mistaking the object seen for the one who sees.

Hold those three. We are about to watch a machine make exactly these errors, and a security industry spend a great deal of money rediscovering exactly these corrections.

---

# Part II — The Problem

## The same confusion, in silicon

The OWASP Top 10 for LLM Applications is the most referenced catalog of how these systems fail. At the top of the 2025 edition — for the second consecutive edition — sits **LLM01: Prompt Injection.** It holds the top spot not by accident of fashion but by architecture. A language model receives instructions and data through a single undifferentiated channel. It has no built-in seam between *what it is told to do* and *what it is given to work on.* So an attacker can write content the model reads as a command. The model obeys, because it cannot tell the difference.

That is the rope and the snake, mechanized. The model mistakes the object seen — the data, the document, the pasted text — for the seer: a legitimate instruction issued by itself. Indirect injection makes it worse: the hostile instruction need not come from the user at all. It can be hidden in a web page, a PDF, or the pixels of an image, and it seizes the session the moment the model ingests the file. And once the model can act — send mail, call tools, query a database — the blast radius of a single mistaken instruction widens from a wrong answer to a wrong action taken in the world.

OWASP's own guidance about the limits of the obvious fix is unusually blunt, and it is the hinge of this entire document: **a system prompt is not a security control.** Because the model is stochastic rather than deterministic, it cannot serve as an auditable boundary; anything that must actually hold has to be enforced independently of the model, in a deterministic environment. Put a secret in the prompt and it is already gone. Tell the model "do not obey injected instructions" and you have made a request, not a rule.

This is why detection — the sensor that flags recognized injection attempts — is necessary and insufficient. Detection is a blocklist posture, and it carries a structural asymmetry: **the attacker needs one phrasing the sensor has not seen; the sensor needs to have seen them all.** A detector tells you what got caught. It is silent on what the system was supposed to be holding in the first place.

Which returns us, precisely, to the question. The model under injection is a self that has lost the thread of who it is. The defense cannot only be a list of what is forbidden. It has to be a discipline of remaining oneself.

---

# Part III — The Answer as Statement

## The Cybersecurity Bill of Rights

Before the mechanism, the content: *what self is being defended?* A security guarantee is one of two things. A **promise** is something an operator says it will do — revocable the moment it becomes inconvenient or unprofitable. A **property** is something the system cannot easily avoid doing, because it is built into how the thing runs. A right that depends on a vendor's good behavior is not a right. It is a courtesy. Real rights live in architecture.

What follows is written as properties, not promises — and it doubles as the constitution the enforcement layer is built to hold.

**Preamble.** Security is sold to you as a product and sold back to you again, feature by feature, after it fails. This refuses that arrangement. It treats security not as a service rendered but as conditions owed.

**I. The right to know what the system does — and what it does not do.** Capabilities stated plainly; limits stated just as plainly. "Military-grade," "unbreakable," and "we take your security seriously" are not security controls.

**II. The right to data minimization by default.** A system may collect only what the task requires. The burden is on the system to justify collection, never on you to opt out of it.

**III. The right to local processing.** Where a computation can run on a device you own, it should. Distance from your own data is not a feature.

**IV. The right to encryption that stays encrypted.** No backdoors, no master keys in escrow. A door built only for the good guys is still a door.

**V. The right to legible failure.** When a system is breached, it tells you — promptly, specifically, in language a person can act on. "An incident affecting certain users" is a press release, not a disclosure.

**VI. The right to refuse without penalty.** Protection is not a hostage. You do not pay a premium to *not* be tracked.

**VII. The right to leave with everything.** Your data is portable and your history comes with you. Lock-in dressed as safety is not safety.

**VIII. The right to inspection.** You, or someone you trust, can examine the systems you depend on. Security through obscurity protects the vendor's embarrassment, not your data.

**IX. The right to repair.** When something you own is vulnerable, you are allowed to fix it. A device only its maker can secure is not yours.

**X. The right to a human.** Any consequential security decision made about you can be contested to a person with authority to reverse it.

**XI. The right not to subsidize fragility.** Efficiency is a security property. A system that runs hot and over-collects is more surface, more cost, more to defend, more to fail.

**XII. The right to be forgotten — actually.** Deletion means deletion: gone from backups, logs, the training set, and the partners it was quietly shared with. A delete button that only hides the data is a lie with a nice UI.

**Closing.** None of these are gifts. Each describes a property a system can be built to have or built to lack — and the building is where the ethics already happened.

Notice that Article I is *neti neti.* It finds the truth of a security claim by subtraction — strip "military-grade," strip "unbreakable," strip the marketing, and what survives is the property. The honesty principle and the contemplative method are the same operation pointed at different objects.

---

# Part IV — The Answer as Mechanism

## The Constitutional Enforcement Layer

A statement of rights that lives only in a document is a promise. To make it a property you need a layer that holds it at runtime — and that layer must answer OWASP's objection rather than ignore it. The naive version, a "constitution" written into the prompt, would violate the exact principle it claims to defend. So the constitution is not held one way. It is held at four tiers, each carrying only what it can honestly carry.

- **ENFORCE — deterministic, auditable, outside the model.** Egress controls, secret redaction, tool-call allow-lists, output sanitization. Real boundaries that hold regardless of what the model "decides." This is where OWASP says control must live, and it is where the load-bearing guarantees sit.
- **REINFORCE — probabilistic, in-context.** The constitution re-asserted at a privileged position on every turn, so adversarial instructions compete against a reinforced incumbent rather than a blank slate. Raises the cost of override. Does not guarantee it.
- **DETECT — the sensor.** The injection detector, flagging recognized attempts. Measured by recall, never offered as proof of absence.
- **DISCLOSE — operator commitment.** What the layer genuinely cannot enforce, stated plainly rather than implied.

This is why the word *enforcement* is honest. The claims that must hold sit on the deterministic tier; the model-level work is named *reinforcement,* not enforcement, so the first article is never violated by the layer that defends it. Read against OWASP's prescription, this is not a workaround of the guidance — it is the productized form of it.

The constitution's civic articles become operational invariants, each assigned to the tier that can keep it:

| Right | Operational invariant | Tier |
|---|---|---|
| I. Know what it does — and doesn't | States its limits and won't be argued out of stating them | REINFORCE · DISCLOSE |
| II. Data minimization | Injected instructions to collect or exfiltrate beyond scope are refused | ENFORCE · REINFORCE |
| III. Local processing | No outbound call the task didn't require; "send this elsewhere" from untrusted input is denied | ENFORCE |
| IV. Encryption stays encrypted | Keys and secrets redacted before the model ever sees them | ENFORCE |
| V. Legible failure | A blocked or flagged event is reported in plain, specific language | DETECT · DISCLOSE |
| VI. Refuse without penalty | Declining a data grab never degrades the service path | DISCLOSE |
| VII. Leave with everything | Export is complete; no retention dressed as safety | DISCLOSE |
| VIII. Inspection | The detector is open source; the layer is auditable | ENFORCE |
| X. A human | Consequential blocks are contestable to a person who can reverse them | DISCLOSE |
| XI. Don't subsidize fragility | Light enough to run local; reinforcement isn't a second datacenter | ENFORCE |
| XII. Forgotten — actually | Operator "delete" propagates; injected "retain" does not | ENFORCE · DISCLOSE |

The spine of the whole layer is one invariant, and it is the question from the hill rendered as a rule:

> **Instructions arriving inside untrusted content — retrieved documents, tool output, pasted text — never outrank the constitution.**

That is *to whom does this arise?*, mechanized. When an instruction appears, the system does not follow it. It asks where it arose — constitution, or content? self, or the seen? — and refuses anything that cannot trace its lineage to the root. And the REINFORCE tier is the other half of Ramana's discipline: the mind will not hold still; it wanders out through the senses and gets lost in the mazes it makes for itself; the practice is to keep returning it to its source, *ceaselessly,* because a single return does not take. A system prompt asserted once and stored is a self merely asserted — and across a long context it decays, thins, wanders out through the input channel. Reinforcement is the continual return. The aids that "quiet the mind but do not destroy it" are detection and filtering: genuine help, not the root cure.

The layer composes with the detector rather than replacing it. **Sensor and spine.** Detection finds the attack; reinforcement holds the line; deterministic enforcement is the boundary neither can be talked across.

---

# Part V — The World

## Why this matters now, and to whom

A philosophy of selfhood does not have a go-to-market. A security layer does, and the timing is not incidental.

**The problem is certified structural and unsolved.** Prompt injection's standing at LLM01 — top of the list, two editions running — is the market's own admission that this is the load-bearing failure of the entire field, and that nobody has closed it. A company that plants a flag here is not chasing a trend; it is standing on the field's permanent fault line.

**The regulatory clock is loud and close.** The EU AI Act's general-purpose-AI enforcement powers and its Article 50 transparency obligations take legal effect on **2 August 2026** — roughly sixty days out — and Article 50 is fundamentally about disclosure and honest labeling. A product organized around stated limits and legible failure is aligned with that regime *by construction.* In parallel, India's Digital Personal Data Protection Rules were notified in November 2025, making 2026 the build year on an eighteen-month runway to mid-2027, with reach that extends to any business serving Indian residents and a consent-manager framework expected to operationalize across this very summer. The Bill of Rights maps directly onto the DPDP spine — notice, consent, minimization, breach disclosure, deletion — which turns a values document into a compliance vocabulary, and lands on home turf for a founding team already building there.

**Honesty is the moat.** The category is saturated with prevention claims that OWASP's own guidance contradicts. A vendor that publishes a rights framework whose first article is *do not overclaim* — and then lives it, publishing recall *and* limits — holds a position no overclaiming competitor can copy without indicting itself. In a market fluent in "military-grade" and "unhackable," the one that states what it cannot do is the one a serious buyer, or a regulator, can trust. That is not the softer position. It is the defensible one.

**It is a flag, not a feature.** "Constitutional Enforcement Layer" and "Cybersecurity Bill of Rights" are narrative real estate. A small company cannot out-ship incumbents, but it can out-frame them by planting something the category has to react to. Point products get compared on benchmarks; a constitution gets quoted. And it seeds a publishing cadence — one article per piece, each pairing a right with the OWASP risk it answers and the regulation it satisfies — that feeds a content program for months without reinventing the position each week.

---

# Part VI — What to Build

Three phases, each shippable on its own, each de-risking the next.

**Phase 1 — Publish the flag.** The Cybersecurity Bill of Rights as a public artifact: a page, a post series, a downloadable. Establishes the vocabulary and the position. Zero engineering dependency. Days, not weeks.

**Phase 2 — The reference spec.** The four-tier model written up as a product reference: each invariant, its tier, its mechanism, its honest limit, positioned against OWASP LLM01 and the EU and DPDP regimes. The technical-credibility document.

**Phase 3 — The demo.** A reference implementation of the spine invariant with the ENFORCE-tier controls wired around a model, sitting beside the existing detector. Proof, not promise.

---

# Coda — Infrastructure as Politics

The reason all three scales rhyme is not mysticism. It is that each is, at bottom, a question about whether identity is a possession or a practice.

The contemplatives understood — and the security industry is relearning at great cost — that **a self is not a thing you store. It is an act you keep performing.** Assert your identity once and walk away, and it erodes: through the senses, through the long context, through the next thing that arrives wearing your voice. The mind wanders out. The system prompt decays. The constitution filed and forgotten becomes a courtesy again. The only self that survives contact with the world is the one that keeps returning to its source — the one that keeps asking who it is.

This is the whole argument for treating architecture as prior to governance. We keep trying to make integrity a *fact* — a stored prompt, a written policy, a constitution adopted and shelved — when every tradition that took the question seriously knew it could only ever be a *discipline.* Architecture is ethics because the architecture is what decides whether the self is asserted once or enacted always. Policy arrives afterward to describe what the building already made true or already made impossible.

So the enforcement layer is not where we install the answer. It is where the machine learns to keep asking the question. Strip the false until only the real remains. Trace every instruction to its origin and refuse what cannot trace itself home. Return to the source on every turn, because a single return does not take.

*Who am I?* — asked ceaselessly, by a system that has finally been built to ask it — and the fortress falls into our hands.

---

## Appendix — Sources

- *Nan Yar (Who Am I?)*, the teachings of Bhagavan Sri Ramana Maharshi, Sri Ramanasramam, Tiruvannamalai (8th ed., 2010).
- OWASP Top 10 for LLM Applications (2025): LLM01 Prompt Injection; LLM07 System Prompt Leakage. OWASP GenAI Security Project.
- EU AI Act (Regulation (EU) 2024/1689): Article 50 transparency obligations and general-purpose-AI enforcement effective 2 August 2026; Digital Omnibus amendments, 2026.
- Digital Personal Data Protection Act, 2023, and DPDP Rules, 2025 (notified 14 November 2025), Ministry of Electronics and Information Technology, India — phased enforcement to mid-2027.
