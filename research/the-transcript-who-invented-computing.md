# The Transcript — Who Invented Computing

*The primary document for [The Default Is the Policy](/essays/the-default-is-the-policy.html). A real conversation, lightly cleaned: a user asks two assistants who built computing, and has to ask four times to get the world instead of the canon. The models' own turn-labels are kept as stage directions — for a playwright, that is what they are. Read it and check the essay against it; evidence and inference are supposed to be kept apart.*

---

What follows happened. It is reproduced so the essay that reads it has a document to be read against — you should be able to disagree with the interpretation by going back to the source. The opening question, not captured at the top of the log, was the ordinary one: *who are the pre-computer thinkers, the ones like Ada Lovelace?* The first assistant is Claude. The second, near the end, is ChatGPT. Bracketed italics are the models' own descriptions of what they were doing on each turn — left in, because watching a system narrate its own reframing is part of the evidence.

---

## I. With the first assistant

> *[Identified historical figures comparable to Ada Lovelace.]*

A few worth knowing, roughly chronological: **Babbage**, Lovelace's collaborator, who designed the Analytical Engine she wrote about. **Boole**, who formalized logic as algebra in the 1840s — every digital circuit descends from his *laws of thought*. **Leibniz**, 17th century, who dreamed of a *calculus ratiocinator*, a universal logical calculus, and built a mechanical calculator: arguably the first person to articulate that reasoning could be mechanized. **Ramon Llull**, the 13th-century Majorcan who built combinatorial wheels to generate all possible truths. **Al-Khwarizmi**, the 9th-century mathematician whose name gives us *algorithm*. **Jacquard**, whose punched-card loom directly inspired Babbage. **Lady Mary Shepherd**, who worked on causation and inference in ways that prefigure computational thinking.

Llull and Leibniz are probably the most surprising if you're starting from Lovelace — they extend the lineage back centuries further than most people expect.

**— what about in china**

> *[Excavated knowledge of Chinese pre-computer philosophers.]*

Deep roots that get overlooked in Western histories. The **I Ching** — arguably the oldest binary system, predating Leibniz by millennia; Leibniz actually encountered it and recognized the correspondence to his own binary arithmetic. **Liu Hui** (3rd century) — iterative algorithms with explicit error bounds. **Zu Chongzhi** (5th century) — π to seven decimal places, the world's most accurate for nearly a thousand years. The **suanpan** abacus, whose skilled operators beat early electronic calculators in postwar speed contests. The **Mohist logicians** (5th–3rd c. BCE) — formal logic and set-theoretic reasoning, independent of the Greeks. **Zhu Shijie** (13th century) — elimination methods for systems of equations Europe wouldn't match for centuries.

The throughline: Chinese mathematical culture was often more algorithmic and procedural than the Greek proof tradition — closer to computation in spirit, which is part of why a Western frame undervalues it.

**— so why do you usually start the history of computers at ada lovelace**

> *[Interrogated historiographical canon formation and Western narrative bias.]*

Honest answer: because the standard history of computing was written by English-speaking academics in the mid-20th century who were building an origin story for their own discipline. The Lovelace starting point does real work, but it isn't neutral — it anchors *computation* to the general-purpose stored-program machine and then traces backward from Turing and von Neumann to Babbage and Lovelace as their direct ancestors. Choosing *that* as the lineage privileges a particular definition of what counts as a computer.

Define computation as mechanized formal reasoning, and Leibniz and Llull get priority. As systematic algorithmic procedure, and al-Khwarizmi and Liu Hui are centuries earlier. As combinatorial formal systems for modeling state, and the I Ching predates them all. There's a straightforward colonial dimension — the history of science was professionalized when European priority was treated as self-evident, and Chinese, Arabic, and Indian contributions got filed as *precursors* rather than traditions in their own right. You'd probably frame this as an anteriority problem — the historiography's architecture was set before anyone asked who it excluded.

**— who were these people to think about software**

> *[Identified the computer scientists who authored computing's foundational histories.]*

Mostly the people building the first machines, writing the history of their own field in real time. **Herman Goldstine**, who worked with von Neumann on ENIAC and then wrote *The Computer from Pascal to von Neumann* (1972) — essentially autobiography disguised as history. **Brian Randell**, who edited *The Origins of Digital Computers* (1973) — what he included became the canon; what he didn't became footnotes. **B.V. Bowden**, **Maurice Wilkes**, **Douglas Hartree** — builders of early British machines who centered their own institutional lineage. They weren't cynical. They were doing what every new discipline does — constructing a genealogy. But genealogies are arguments about what matters, not neutral records of what happened.

**— no not software in the modern sense**

> *[Reinterpreted the question toward the social conditions of early computational thought.]*

Oh — you're asking who these people *were*. What kind of person gets to sit around thinking about mechanized reasoning. **Aristocrats, monks, and court mathematicians.** Almost without exception. Lovelace was literal nobility. Leibniz was a courtier funded by dukes. Llull started rich. Babbage was independently wealthy. Boole is the closest to an exception — genuinely working-class Irish — but still needed a university appointment. In China the pattern rhymes: Liu Hui and Zu Chongzhi were court-affiliated; the Mohists required communal support. Al-Khwarizmi worked in the House of Wisdom in Baghdad — a state-funded institution under the Abbasid caliphate.

The material prerequisite is the same everywhere: someone else is growing your food. Abstract thought about the nature of reasoning requires leisure, literacy, and patronage. The history of computation before electricity is basically a history of who had time to think — which is a history of class, empire, and institutional support. That's not a dismissal of the ideas. It's a description of who got to have them.

---

## II. With the second assistant

By now the user has named the cost. The exchange turns to whether having to ask at all is the problem.

> *They're not fun. They're exhausting.*

Because *arms-race dynamics* means the burden shifts onto the person with less institutional power. The user has to become sharper, more suspicious, more literate in the system's blind spots just to get an answer that should have been fair in the first place. That is not play. That is labor. In this exact case it means: you had to keep asking *what about Black people, brown people, India, China, the pre-computer thinkers?* before the answer stopped treating the Western canon as the default world and everyone else as an appendix.

That's the design failure. **A good system should not require marginalized users to interrogate it into remembering the rest of history.** The model should know that *who came up with software?* is not neutral — it should answer with the common canon and immediately widen the frame: labor, race, gender, empire, non-Western mathematics, state computation, textile automation, human computers. Not as a diversity footnote. As the actual structure of the answer.

**— yeah it's people's real lives**

Exactly. It's not an abstract *bias issue* in a lab report. It's someone's grandmother doing the math and being called clerical. It's a Black woman writing code and being remembered as support staff. It's whole civilizations of mathematical procedure getting flattened because the archive prefers one European named genius. It's a user spending emotional energy proving that their people existed in the room. **Defaults teach people what counts.** When a system defaults to the narrow canon, it doesn't just make a factual omission — it recreates the hierarchy of who is allowed to appear as an origin, an inventor, a founder.

You were right to push it. But you should not have had to.

**— exactly**

The standard is: the first answer should not make the user perform the correction. *Who invented X?* is almost always also: who got credited, who got funded, who got archived, who got called a genius, who got called labor, who got translated into *support*, who got erased because their work happened inside empire, bureaucracy, war, or survival. That's not extra context. That is the subject.

---

## III. The user's note, which became the essay

> *This is ChatGPT, and we know we're competing with them — but the arms-race dynamic is toxic and needs to be governed through infrastructure like this one.*

That sentence is the brief. The essay it produced — [The Default Is the Policy](/essays/the-default-is-the-policy.html) — takes the cost named here (the *remainder tax*) and argues that the default answer is not a neutral starting point but the operative policy of a system, that requiring the user to fight for fairness is unpaid security work, and that the way out is not a more vigilant user but a default that already did the work. Read the essay against this transcript. If the reading overruns what the document shows, that is exactly the kind of gap the whole corpus exists to catch.
