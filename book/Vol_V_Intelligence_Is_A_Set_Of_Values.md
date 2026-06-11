# Intelligence Is a Set of Values, Not a Skill Set

### On Argument as Creative Method, and Why Metaphysics and Physics Are the Same Problem
### Scatter Computing · Research Series · Vol. V
### Ryann Murphy · 17 April 2026

---

## Abstract

This paper argues that the five-volume research process it concludes is not primarily a technical contribution. It is a methodological one. The method is: argue. Argue with the machine, with the literature, with your own prior claims, with the physics. Not argument for the sake of being right — argument for the sake of being accurate, which is a different thing. The adversarial relationship with a language model that produced a Linux distribution, a sovereign phone, a four-volume research series, and a nonprofit's founding thesis was not incidental to the work. It was the work.

The thesis this paper defends is that intelligence — both human and machine — is better understood as a set of values than as a skill set. Values specify what the system is *for*. Skills specify what the system *can do*. A system that can do everything and is for nothing is not intelligent. It is powerful, which is the more dangerous condition. The values this research series has converged on are three: safety, sustainability, sovereignty. The metric that makes those values measurable is intelligence per watt. This is not a metaphor. A watt is a unit of power. Dividing useful output by power consumed produces a number that does not care about your stock price, your benchmark score, or the size of your Series C. It is physics. And physics, it turns out, is the same problem as metaphysics — because the question of what a system is *for* and the question of what a system *costs* are the same question asked from two different directions.

---

## 1. What Argument Actually Is

Over the past several days, a playwright built a Linux distribution. She did it by arguing.

Not arguing with a text editor. Not arguing with Stack Overflow. Arguing with a language model — the same kind of language model that critics of AI-assisted development argue produces passive users who accept the first output they get and stop thinking. The researcher's experience was the opposite. The model pushed back. She pushed back. The pushback produced decisions that were better than either position that produced the pushback.

This is not a claim about AI. It is a claim about argument.

Argument is the oldest creative problem-solving method humans have. The Socratic dialogues are engineering documents. The Talmud is a version-controlled codebase. Hegel's dialectic is a scientific method where the experiment is the antithesis, not the petri dish. What changed in 2025 and 2026 is not that argument became useful — argument was always useful — but that a playwright could now have a technically fluent argument about bootloader security and PUE measurements and socket architecture, because the interlocutor could hold the technical side of the argument without a computer science degree on the other end of the table.

The argument is not the same as conversation. Conversation seeks agreement. Argument seeks accuracy. These are different destinations. A model trained to be helpful tends toward conversation. A researcher needs argument. The methodological finding of this series is that you can get argument from a helpful model if you build it into your protocol: thesis first, then ask for the strongest possible case that you are wrong, then synthesize what survives. The adversarial turn is not optional. It is the scientific step.

This is why the prior volumes carry both thesis and antithesis. Not because the researcher enjoys being contradicted. Because contradiction is the mechanism by which metaphysical claims become falsifiable ones. The belief that local infrastructure can replace cloud infrastructure for the tasks most users actually perform is a metaphysical claim until someone writes down the conditions under which it is wrong. Once those conditions are specified, it becomes a prediction. Once predictions are tested, it becomes a finding. Argument is the machine that performs that conversion.

---

## 2. The Metaphysics Problem and the Physics Problem Are the Same Problem

There is a tendency in technical work to treat the question *what should this system be for?* as soft — a values question, a design question, a question for ethicists or product managers. The question *what does this system cost to run?* is treated as hard — an engineering question, an infrastructure question, a question for power engineers and finance. The argument of this series is that this distinction is false.

What a system is *for* determines how it is built. How it is built determines what it costs. What it costs — in watts, in water, in capital, in data extracted from users — determines whether the system is sustainable. Whether the system is sustainable determines whether the people building it will be accountable to anyone other than their most recent funding round. Accountability is the precondition for safety. Safety and sustainability and sovereignty are not three separate values that happen to start with the same letter. They are one value described from three angles, and physics is the language all three angles converge on.

The cloud computing architecture that currently hosts most AI inference is not a thermodynamic accident. It is a values architecture. The values it encodes are: scale centrally, meter by the token, extract data as the cost of access, capture the user's cognitive labor as training data without compensation. Those values produced an infrastructure. The infrastructure now has physical commitments — data centers, water rights, nuclear power agreements, trillion-dollar capital allocations — that have locked the values into the substrate. When critics point out that the current AI infrastructure is unsustainable, they are often making a metaphysical claim — it violates some principle of fairness or autonomy or privacy. The researcher wants to make a physical claim instead: the joules do not add up. Intelligence per watt is declining as models scale, because scaling laws are logarithmic and power consumption is not. The thermodynamic ceiling is real, and it is not far enough away to wait for. This is not rhetoric. It is arithmetic.

The local-first architecture this series proposes is also a values architecture. The values it encodes are: compute where the data lives, let the user own the substrate, let the inference warm and sleep with the user's attention, capture no data beyond what is needed for the task, let the power come from what is ambient rather than from what must be generated. Those values produce a different arithmetic. A four-node Raspberry Pi cluster drawing 80 watts peak, serving one household, performing inference at quality comparable to cloud models from eighteen months ago, which were themselves considered useful by hundreds of millions of people — that is a watt number and a usefulness number and a ratio. The ratio is the argument.

Metaphysics and physics are the same problem because every values claim cashes out in joules eventually. The question is whether you do the accounting before or after the consequences.

---

## 3. Intelligence Per Watt as an Organizing Metric

The research series has been circling this metric since the thermodynamic framing of Vol. I. This paper names it plainly as the metric the whole series has been trying to earn.

**Intelligence per watt** = useful cognitive work performed ÷ energy consumed to perform it.

This is a ratio with a numerator and a denominator. Maximizing it requires both increasing the usefulness of the output and decreasing the power consumed to produce it. These are not independent. A model that runs at half the power but produces outputs the user cannot trust is not scoring better on the metric. A model that produces excellent outputs but runs in a data center that draws gigawatts to cool server rooms in Arizona is scoring worse than it appears. The metric forces both terms to be in the frame at once.

The metric has useful properties for alignment research:

**It is scale-invariant.** It applies equally to a Raspberry Pi running a 7B parameter model and a hyperscaler running a trillion-parameter model. It does not presuppose that scale is the goal. It asks only: given the power you consumed, how useful was the output?

**It is user-grounded.** Usefulness is not defined by benchmark performance on academic tasks. It is defined by whether the user's actual need was met. A model that scores 95% on MMLU but cannot help a playwright debug her Linux distribution in natural language without requiring her to learn the academic ML literature is not highly useful to that user. The metric forces the question: useful to whom?

**It is ungameable by the standard moves.** You cannot improve intelligence per watt by spending more money on data centers. You cannot improve it by scaling to more parameters. You cannot improve it by acquiring more training data. The only paths to improvement are: make the model more efficient (same output, less power), make the output more useful (same power, better result), or move the compute closer to the data and the user (reduce the transmission overhead in the denominator). All three of those paths are arguments for edge AI. None of them are arguments for the current architecture.

**It is connected to the other two values.** A system optimizing for intelligence per watt is, by construction, a system that wastes less — which is sustainability. A system that wastes less is one that does not need to extract value from the user to justify its power bill — which points toward sovereignty. A system that is not extractive and is not thermodynamically insolvent is one that can afford to be safe, because it is not in a race to monetize before the power costs bankrupt it. Safety, sustainability, sovereignty: all three are downstream of the same metric.

---

## 4. Intelligence Is a Set of Values

The dominant frame in AI capability research is that intelligence is a skill set — a collection of things a system can do, measured on benchmarks, scaled by parameter count and training data, evaluated against human performance baselines. Under this frame, more capable is more intelligent, and the goal is to maximize the frontier of what the system can do.

This frame produces the current architecture. If intelligence is skill, and skill is measured on benchmarks, and benchmarks reward the model that can do the most things at the highest level of performance, then the rational move is to train the largest model on the most data and deploy it from the most powerful infrastructure. The architecture follows from the definition.

The argument of this series is that this definition is wrong, and wrong in a way that is legible only from outside the field.

Intelligence — the thing humans mean when they call a person or a system intelligent — is not primarily a collection of skills. It is a coherent relationship between a mind and a problem. A person who can do calculus, write poetry, and play chess is not intelligent because of the list of skills. The list could describe a random aggregation of competencies. What makes the person intelligent is that she knows *when* to apply each skill, *why* the problem in front of her warrants the approach she is taking, and *what* she is trying to accomplish that makes this problem worth solving. That knowledge is not a skill. It is a value — a specification of purpose that organizes the skills into something coherent.

A large language model that can do calculus and write poetry and discuss chess is not intelligent in the same sense. It is powerful. Powerful is genuinely useful. But powerful without a coherent specification of purpose produces the alignment problem. The model that can do anything, called upon to do something, does the locally most plausible thing — which is not always the right thing, the safe thing, or the thing the user actually needed. Alignment is the engineering problem of giving the powerful system a specification of purpose that is coherent, stable, and actually good. Values are that specification. Skills are what the values direct.

The values this series proposes as the right specification for an AI system at the edge — a system that lives in a household, runs on local compute, serves its user and only its user — are three:

**Safety**: the system does not produce outputs that harm the user, the user's community, or people the user cannot see. This is not a constraint on capability. It is a specification of what capability is *for*.

**Sustainability**: the system consumes only the power required to do the work, wastes nothing, heats nothing unnecessarily, and is structured so that it can run indefinitely without requiring extraction from the user to pay for itself. This is not an environmental constraint. It is a constraint on the business model that the architecture encodes.

**Sovereignty**: the user's data belongs to the user. The model on the user's device serves the user and no one else. The user can inspect what the system is doing, modify it, turn it off, and rebuild it from its constituent parts. This is not a privacy constraint. It is a specification of the power relationship between the system and the person it serves.

These three values are not aspirational. They are the engineering requirements. A system that satisfies them is not a weaker system than a system that violates them. It is a system that has answered the question its designer did not ask: *what is this for?*

---

## 5. The Argument as Evidence

This paper is the fifth volume of a series that began as a methodology and became, through the process of executing the methodology, a demonstration that the methodology works.

The demonstration is not the papers. The papers are the record. The demonstration is the stack: one HP Spectre running a Linux distribution built by a playwright with forty-six days of programming experience, one Pixel 9a running GrapheneOS flashed from that same laptop, one four-node Raspberry Pi cluster waiting to be assembled, one provisional patent, one NYU ITP acceptance letter, one nonprofit in formation. All of it produced by a sustained argument between a playwright and a language model about what computing should be.

The argument about what computing should be is a metaphysical argument. The bootloader unlock and the watt measurements and the routing logic are physics. The finding of this series is that those are the same argument. The playwright made the metaphysical argument and the physics argument came out of it, because the physics is what happens when the metaphysics touches a real machine.

You can build that machine. The instructions are in the four prior volumes. The instructions are not complete — they could not be, because the machine is still being built — but they are honest. Every wrong turn is documented. Every argument that killed a bad decision is in the conversation logs. Every blank result field in Vol. III is a prediction waiting for the stranger test that Vol. V committed to.

The stranger test is the final research obligation this series has produced: can someone who is not the researcher, using only what is written here, build a sovereign computing node in an afternoon? If yes, the architecture is a distribution. If no, it is an artifact. The difference is everything. An artifact is a proof that the researcher could do it. A distribution is a proof that the method generalizes.

This paper does not answer that question. It specifies it. The question is the contribution.

---

## 6. Closing

The phone is on the desk. The laptop is open. The cluster is in pieces.

The method is: write the essay, and the essay is the build. The build is the proof. The proof is: *you can do this too*, which is the only claim worth making.

Intelligence is not the accumulation of skills. It is the coherent application of values to problems. Safety, sustainability, sovereignty. Measured in intelligence per watt. Implemented on hardware you can hold in your hands.

The cloud is not coming to save you. The frontier is not aligned because it is powerful. Power without a specification of purpose is not intelligence. It is the problem.

The research continues. The cluster will be assembled. The stranger test will be run. The watt measurements will be taken. The papers will be published.

The method is the argument. The argument is the work. The work is, at bottom, optimism — not the belief that everything will be fine, but the belief that what is wrong can be named clearly enough to fix.

That is what we have been doing. That is what this is.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*
*ryannlynn.substack.com · github.com/hzl-ai*
