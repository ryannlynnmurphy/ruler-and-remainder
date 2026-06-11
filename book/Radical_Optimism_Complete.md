---
title: "Radical Optimism: The Complete Research Series"
author: "Ryann Murphy · Scatter Computing"
date: "April 2026"
---

# RADICAL OPTIMISM

## The Complete Research Series

### Scatter Computing · Ryann Murphy · New York, NY · April 2026

*Scatter Computing is a nonprofit organization focused on AI safety through decentralization.*

---

## Series Overview

This document compiles the complete Scatter Computing research series: nine papers, three companion essays, and one coda, produced across a single week in April 2026. The series develops an argument about AI infrastructure, alignment, and the case for distributed edge computing — written by a playwright with no prior technical training, using the tools the argument critiques as its primary research instruments.

The organizing metric is intelligence per watt. The central claim is that a business model built on data extraction cannot produce aligned AI systems, because extraction is asymmetric and alignment requires symmetry. The research program that follows — constitutional infrastructure — specifies what alignment requires at the institutional level and names the work that remains.

The method that produced the series is itself the first finding: structured argument between a human researcher and a language model, conducted dialectically, produces both the research and the researcher. The essays are the build. The build is the proof.

---

\newpage

# PART ONE: THE THEORETICAL FRAMEWORK

---

## Volume I: Radical Optimism

### A Case for Intelligence Per Watt

RADICAL

OPTIMISM

A Case for Intelligence Per Watt

Why Extraction Cannot Produce Alignment,

Why Centralized AI Is Thermodynamically Insolvent,

and Why the Edge Is the Only Architecture Left

A Seven-Paper Research Series

Scatter Computing

Ryann Murphy

New York, NY

April 2026

Scatter Computing is a nonprofit organization

focused on AI safety through decentralization.

Foreword: Why Radical Optimism

This volume is titled Radical Optimism because its argument is fundamentally hopeful and fundamentally at odds with where the industry is pointed. The AI industry is making a structural, expensive mistake. The mistake is correctable. The tools to correct it exist. The people who can see the correction clearly are already using those tools. That is what optimism means here: the belief that what is going wrong can be named clearly enough that it stops.

The optimism is radical because the correction requires a reframe at the root. Not a tweak to the business model. Not better cooling. A shift in what the industry is optimizing for. The organizing metric of this volume is intelligence per watt — the ratio of useful cognitive work performed to energy consumed in performing it. It is measurable. It is physics-grounded. It asks the only question that matters at infrastructural scale: how much thinking do we get, per unit of energy spent getting it?

The current architecture of frontier AI — trillion-parameter models served from centralized data centers over metered APIs — is not optimizing for intelligence per watt. It is optimizing for shareholder value. The arithmetic is not close. Shareholder-value optimization means locking users into metered services, amortizing infrastructure across billable inference calls, and treating the data center as a strategic moat rather than a thermodynamic cost center. It means optimizing for data extraction, because data extraction is where the margin lives.

Here is the central claim: a business model built on value extraction in the form of data extraction cannot produce an aligned model. Extraction does not produce alignment. Extraction produces skew. An aligned system is data-sovereign and energetically balanced — dynamic, bidirectional, finding resources that flow into the model and flow back out. A truly aligned intelligence is a participant in an exchange. The current architecture is a pipeline. A pipeline cannot produce the thing it claims to be producing. The architecture has to change before alignment becomes achievable.

Intelligence per watt is the metric that makes this legible. A system that extracts data from users to train models metered back to those same users, running on infrastructure that requires nuclear buildouts to sustain, has a catastrophic intelligence-per-watt ratio. The energy goes in. The cognition comes out. Most of the cognition is captured as proprietary moat. Most of the energy is lost to cooling overhead, transmission, and the costs of maintaining centralized infrastructure the workload does not require. The math does not work. Adding reactors to a badly architected system produces a more expensive badly architected system.

Optimism is the position that this reframe is achievable, and that naming it now — while capital allocations are still reversible — is the work.

Optimism also means taking seriously that the person making this argument is a playwright with no prior technical training. That is not a disqualification. It is a qualification. The structural error in current AI infrastructure is being made by people with deep investment in the current infrastructure. They cannot see the error because the error is a direct consequence of the incentives they are correctly responding to. An outsider, using the tools the industry itself produced, can see what the insiders cannot.

What follows is seven papers developing a framework called the Scatter Method — a research methodology that treats the large language model as a dramatic medium rather than an information retrieval system. The method was used to build the argument. The argument is that intelligence per watt is the right optimization target, that the current extraction-based architecture fails it catastrophically, and that the alternative architecture — sovereign edge intelligence running aligned models grown inside constitutional safety processes, fed by ambient rather than industrial energy — is achievable now, using tools that already exist.

The method proved itself by producing the argument. The argument proves itself by being buildable. The volume proves itself by existing. This is radical optimism.

Abstract

Seven papers develop a framework for AI-assisted research called the Scatter Method, which applies three techniques from playwriting and dialectical philosophy to large language model interaction: narrative prompting, a structured dialectical workflow, and ensemble casting of AI-generated collaborators from diverse perspectives.

Paper I proposes the framework. Paper II subjects it to adversarial audit. Paper III synthesizes what survived. Paper IV specifies experimental designs. Paper V applies the scientific method as antithesis and predicts unfavorable outcomes. Paper VI presents a documented case study, adds emergent techniques (visual-narrative debugging, conversational architecture, recursive building), surfaces a structural critique of centralized AI infrastructure, and names a second-order alignment failure embedded in one of the method’s own techniques. Paper VII consolidates the argument around intelligence per watt.

The consolidated claim: the AI industry is optimizing for shareholder value rather than intelligence per watt. On the correct metric, the current architecture of centralized cloud inference fails catastrophically and will fail worse as it scales. A system that extracts value from users through data capture cannot produce alignment, because alignment requires symmetry and extraction is asymmetric by construction. The alternative architecture — distributed, local, quantized inference running on hardware thermally integrated with the spaces it serves, loaded with aligned models grown inside constitutional safety processes — wins on intelligence per watt and satisfies the structural conditions alignment requires.

The Scatter Method is the research methodology through which this argument was developed and the evidence that non-technical researchers, using frontier AI tools through a disciplined interaction protocol, can build the edge infrastructure the argument calls for.

We publish this work as an open framework. The philosophical layers are complete. The scientific layers are specified but not yet executed. We invite collaborators.

PAPER I

The Scatter Method

In which the method is proposed.

1. The Obvious Thing Nobody Said

The thesis-antithesis-synthesis structure is not new. Hegel published it in 1807. The Socratic method dates to the fourth century BCE. Devil’s advocacy has been a formal role in Catholic canonical law since the sixteenth century.

Yet in the expanding literature on prompt engineering and AI-assisted research, almost no one has formalized the application of basic dialectical philosophy to LLM interaction. The field has produced dozens of catalogued prompting techniques and multi-agent orchestration frameworks — but has largely overlooked that a playwright with a semester of self-taught Python can produce better research output than most of these systems by doing what playwrights have always done: constructing a scene in which two positions argue, and seeing what survives.

This is not a failure of AI. It is a failure of imagination on the part of the people building with it. The field is dominated by engineers who think in systems. What it lacks are people who think in scenes. The field has also largely failed to notice it is optimizing for the wrong thing. That failure is the subject of this volume.

2. Narrative Prompting: The Story Is the Instruction

The first technique is the simplest and least documented: begin with a story.

Standard prompt engineering treats the system prompt as instructions. Role-based prompting (“You are a helpful assistant…”) works well enough for generic tasks but produces generic outputs. The model has seen millions of helpful assistants. It returns the median response.

Narrative prompting operates differently. Instead of telling the model what to be, the researcher tells the model what they want to see — through story. A long, specific, experiential account of the problem, the world being built, the user being served. Not a feature list. A story.

This works because LLMs are narrative engines. They were trained on billions of stories. A rich narrative context establishes tone, stakes, perspective, and trajectory in a single pass. It casts the model as a character in a specific dramatic situation rather than as a type.

A founder building a voice assistant for a thermodynamic AI home does not write: “You are an AI assistant that helps with home automation.” She writes the story of the home — the heat flowing from the compute cluster through a copper coil into the hot water tank, the user asking what the temperature is, the assistant knowing the answer because the answer is the waste heat from its own inference. The story directs the model toward a specific experience no generic instruction could specify.

This is what playwrights do. They do not write instructions for actors. They write worlds, and the actors inhabit them. Narrative prompting applies the same principle to language models.

3. The Dialectical Prompt Method

The second technique formalizes what thoughtful people do intuitively: they argue with their own ideas.

Stage 1 — Problem Definition. Define the problem in your own terms, as context rather than question.

Stage 2 — Hypothesis Presentation. Present your proposed solution. The model now has a position to engage with.

Stage 3 — Adversarial Challenge. Instruct the model to genuinely entertain the possibility that you are wrong.

Stage 4 — Synthesis. The model reconciles the hypothesis with its own critique.

Stage 5 — Formal Composition. The model produces a structured document from the synthesis.

Stage 6 — Actionable Output. The model identifies real people, organizations, or next steps.

No individual stage is novel. What is novel is the sequence, and the recognition that this sequence — the structure of a good argument — has not been formalized despite being more epistemically sound than most “advanced” prompt engineering.

4. Ensemble Casting: Building a Team from the World’s Perspectives

The third technique emerges directly from the playwright’s craft: casting.

A playwright does not populate a play with people who agree. She populates it with people whose differences generate meaning. The conflict between perspectives is the content. Most founders and researchers work within a single cultural and professional frame, and their AI interactions reflect that narrowness.

Ensemble casting is the practice of constructing AI-generated collaborators, each embodying a specific intersection of culture, profession, and lived experience, to interrogate a problem from perspectives the researcher cannot personally occupy. It is not generic role-playing. It is character work — the deliberate construction of a synthetic collaborator grounded in real cultural knowledge and material conditions.

Paper II subjects this technique to adversarial challenge. Paper III sharpens the critique. Paper VI escalates it into an alignment argument with direct implications for frontier labs. The critique comes later, and it does not spare the author.

5. Why the Scatter Method Works

The three techniques share a common logic: they treat the LLM as a dramatic medium rather than an information retrieval system.

This works structurally. LLMs do not know things. They perform things. When the context is thin, the performance is generic. When the context is rich — narrative, conflict, character, stakes — the performance is specific and often surprising.

The Scatter Method creates conditions under which interesting things can be said. A good play does not tell the audience what to think. It puts characters with incompatible commitments in a room and lets the audience watch what happens. The method does the same thing with a language model — and the researcher is both playwright and audience. Applied to the question of what AI infrastructure should look like, the method produced the argument that constitutes the later papers.

PAPER II

The Scatter Method, Applied to Itself

In which we subject the method to its own process.

1. Problem Definition

Scatter Computing has published a research note proposing something called the Scatter Method. Is this claim true? Is the method a genuine methodological contribution, or a well-written repackaging of things people already do?

2. Hypothesis

The Scatter Method is a legitimate contribution. Its novelty lies not in new techniques but in the synthesis of ancient epistemological practices into a reproducible framework specifically designed for LLM interaction. Its value is that it addresses known failure modes of AI-assisted work through structural design rather than individual discipline.

3. Adversarial Challenge

Objection 1: This is not novel. Competent users already push back on LLM outputs. The academic literature already includes chain-of-thought, self-refine, and multi-agent debate. Branding is not novelty.

Objection 2: Ensemble casting is cosplay. Asking an LLM to roleplay as a German engineer or an Indian trans woman produces the model’s simulation of those perspectives, filtered through training data that is disproportionately English-language, Western, and written by people who are not those things.

Objection 3: No empirical validation. No controlled experiments, no baseline comparison, no measurement of output quality.

Objection 4: The theatrical framing is self-serving. Positioning the playwright’s perspective as the missing ingredient serves the founder’s personal brand more than the argument.

Objection 5: “Ancient techniques” is not a credential. Hegel’s dialectic was a theory of historical development, not a prompting strategy. Claiming continuity is rhetorically effective but philosophically imprecise.

4. Audit and Synthesis

On novelty: The objection underestimates synthesis. The Wright brothers did not invent the wing, the engine, or the propeller. They combined them. The paper should engage more directly with existing multi-agent debate frameworks.

On ensemble casting: The most serious objection. The paper should state more forcefully that ensemble casting is a rehearsal, not a replacement. Paper VI returns to this with significantly more force.

On empirical validation: Correct. The method is a proposal, not a proven technique.

On self-serving framing: Fair. The playwright’s skill set is one point of entry, not the exclusive foundation.

On philosophical lineage: Correct in detail, wrong in spirit. Drop the word “Hegelian.” Keep the structure.

5. Ensemble Cast Responses

The German Infrastructure Engineer

Dr. Katrin Weiß, structural engineer, formerly of Deutsche Bahn.

The method’s strongest insight is that most AI research workflows have no load-bearing structure. They are improvised. An engineer would never design a bridge by asking one consultant for a best guess and building it.

The method lacks a verification layer. The model generating the adversarial critique is the same model performing the reconciliation. It needs a seventh stage: independent verification.

The thermodynamic AI home concept is sound in principle. Waste heat from inference is low-grade. Preheating domestic hot water is the correct application. The engineering question is not whether it works. The question is why the industry is not already doing it. Paper VII argues it is because the industry is optimizing for a different metric.

The Chinese Data Scientist Working on Local AI

Dr. Liang Chen, senior researcher at a mid-size AI lab in Shenzhen.

The paper frames Chinese data scientists as working on local-first models to build sovereign infrastructure. Partially accurate but misses the primary motivation: latency, bandwidth cost, data residency. Sovereignty is a policy outcome, not an engineering motivation.

Ensemble casting should be honest about what it cannot do. An AI-generated version of me will tell you what the training data says. It will not tell you about the specific regulatory environment in Shenzhen versus Beijing. The character is a sketch. Do not mistake it for a portrait.

The Indian Trans Woman from the Delhi Slums

Priya Sharma, 26, community organizer in Govindpuri, South Delhi.

Reading a paper where I exist as a “character” an American founder “casts” to improve her research methodology is a strange experience. I understand the intention. I do not entirely trust it.

The first thing I would say about free computing is: who maintains it? When it breaks — and it will break — who fixes it? Is there a person I can talk to, or a chatbot? If there is a chatbot, does it speak Hindi? Does it speak the specific Hindi people in my community actually use?

The fact that this method exists is better than what most technology projects do, which is nothing. If the Scatter Method is a first draft of inclusion, I can work with a first draft. It must remain a draft. It must never become the final version.

PAPER III

Synthesis

What survived.

1. What Survived the Audit

Claim 1: Structured disagreement produces better AI-assisted research than structured agreement. Most prompting techniques optimize for the model saying yes more helpfully. The Scatter Method optimizes for the model saying no more usefully. The dialectical stage is the method’s load-bearing contribution. It makes rigor structural. This claim is testable.

Claim 2: Story is a more efficient context-delivery mechanism than instruction. Narrative delivers tone, stakes, perspective, domain constraints, and emotional register in a single pass. Instruction-based prompting delivers these one at a time, if at all.

Claim 3: Ensemble casting is a rehearsal, not a replacement. Paper VI argues this revision is insufficient on its own and requires alignment-level intervention.

Claim 4: The method should include a verification stage. After synthesis and before composition, submit the synthesized position to an independent check.

2. The Revised Scatter Method

Technique 1: Narrative Prompting. Direct the model through story. Establish world, stakes, users, experience.

Technique 2: The Dialectical Prompt Workflow.

Stage 1 — Problem Definition.

Stage 2 — Hypothesis.

Stage 3 — Adversarial Challenge.

Stage 4 — Synthesis.

Stage 5 — Independent Verification.

Stage 6 — Formal Composition.

Stage 7 — Actionable Output.

Technique 3: Ensemble Casting. Construct AI-generated collaborators from specific cultural, professional, and experiential perspectives. Ground each character in real knowledge. Mark all outputs as drafts requiring real-world validation.

PAPER IV

Engineering and Reverse-Engineering

Paper III said “here is what survived.” This asks: where’s the science?

1. The Problem With the First Three Papers

The Scatter Method, as proposed and revised, is a philosophical instrument. It produces arguments, perspectives, syntheses that feel rigorous because they have survived adversarial scrutiny. It does not produce data, falsifiable predictions, or results that can be measured, replicated, or disproved.

A method that generates only philosophy is a method that can persuade without proving. To become a research engine, it needs an empirical layer.

2. The Fix: Scientific Method as Middle Layer

Each technique must be subjected to the scientific method before the dialectical structure is applied to the results.

Layer 1 — Philosophy. The method generates a claim through its dialectical process.

Layer 2 — Science. The claim is reformulated as a falsifiable hypothesis and tested.

Layer 3 — Philosophy again. Empirical results are fed back through the dialectical structure.

This is a loop. The synthesis from Layer 3 becomes the hypothesis for the next iteration of Layer 2. The method becomes recursive.

3. Experimental Designs

Narrative Prompting

For a set of research tasks, generate narrative-based and instruction-based prompts. Run both through the same model. Measure specificity, relevance, factual accuracy, novelty, actionability. Blind human evaluators and LLM-as-judge scoring.

The Dialectical Workflow

For research questions with established expert consensus, generate outputs using single-pass prompting, the seven-stage workflow, and a multi-agent debate framework as baseline. Score on accuracy, comprehensiveness, identification of counterarguments. Measure whether the dialectical stage changes the final output, or whether synthesis collapses back to the thesis.

Ensemble Casting

Generate ensemble cast outputs for design problems. Recruit human evaluators from the backgrounds the characters claim to represent. Ask two questions: does this reflect a perspective someone from my background would hold, and does this contain insights a non-specialist would be unlikely to generate?

4. Reverse-Engineering

If you can engineer the method, you can also reverse-engineer it. Take any AI-assisted research output and work backward: What story was the model told? What assumptions did that story encode? What perspectives were included and which were absent? Was there an adversarial stage?

Reverse-engineering is the audit function. The method, reverse-engineered, becomes a literacy tool — a framework for reading AI-assisted work critically. The absence of dialectical structure becomes visible. The single-pass, single-perspective, confidently-stated AI output reveals itself as what it is: an argument that was never tested.

5. The Recursive Structure

The full method operates as a three-layer recursive loop: Philosophy → Science → Philosophy → Science. Each pass produces a claim, tests it, reinterprets the results. Karl Popper described this in 1963. The Scatter Method operationalizes it for LLM-assisted research.

PAPER V

The Scatter Method Under Experiment

Paper IV said “now prove it.” This asks: what if we can’t?

1. Narrative Prompting: Likely Experimental Result

It probably depends on the task — and the dependency probably destroys the general claim.

For open-ended creative and strategic tasks, narrative prompting almost certainly outperforms instruction-based prompting. Story establishes tone, stakes, and emotional register in ways instruction cannot. For structured analytical tasks, narrative prompting likely performs worse. A model asked to analyze a dataset does not benefit from the story of the company that collected it. It benefits from column names, units, and the statistical question.

The probable finding: narrative prompting is a domain-specific technique, not a universal one. The method needs a decision layer: what kind of problem is this, and does it benefit from narrative context or suffer from it?

2. The Dialectical Workflow: Likely Experimental Result

Two problems. One measurable, one structural.

The measurable problem: synthesis collapse. When you ask a model to generate a thesis, argue against it, then synthesize — the synthesis will, in the majority of cases, reproduce the thesis with qualifications. The model is generating text that reads like a resolution, not actually holding contradictory positions and resolving them.

The structural problem: the researcher controls the outcome. In a real dialectical process, neither party controls the synthesis. In the Scatter Method, the researcher writes the thesis, prompts the antithesis, prompts the synthesis. They are playwright, actor, and audience.

A controlled experiment would likely find that the workflow changes the length and hedging of outputs without significantly changing their substance. The adversarial stage is a styling pass, not a reasoning pass.

3. Ensemble Casting: Likely Experimental Result

Three problems, escalating in severity.

Problem 1: The perspectives are not real. The character foregrounds whatever archetype is most frequently co-occurring in the training data. The reality is granular and idiosyncratic in ways the archetype cannot capture.

Problem 2: The researcher cannot evaluate what they do not know. The researcher needs enough knowledge to detect caricature, but if they had it, they would not need the model.

Problem 3: The technique may reduce real consultation. The psychological effect of having heard a persuasive simulated voice may reduce motivation to seek the real voice. The rehearsal functions as a substitute. Paper VI treats this as the central alignment failure of current-generation AI deployment.

4. The Framework as a Whole: The Circularity Problem

The method proposes that the way to evaluate an idea is to subject it to dialectical scrutiny using an LLM. The method was itself developed through dialectical scrutiny using an LLM. The proof of concept is that it was applied to itself using the same tool it recommends. The method validates itself by its own criteria.

This is circular reasoning dressed in theatrical structure. The method feels rigorous because it performs rigor. The rigor is internal to the system.

5. What Remains

If these predictions are correct, what is left?

This: the method surfaces questions that would not otherwise be asked. A researcher who runs the workflow may not produce a different synthesis, but will have read the adversarial critique. A researcher who uses ensemble casting may produce archetypes rather than real perspectives, but will have been prompted to consider those perspectives at all. Without the character, the researcher may never have thought about thermal efficiency. Without the simulation, she may never have asked who maintains the device when it breaks.

The method may not produce measurably better outputs. It may produce measurably better researchers — people who have been through a process that forced them to consider opposition, diversity, and their own blind spots. This is a weaker claim than the method originally made. It is also more honest. And it is testable: does using the method change the researcher’s subsequent behavior, even if it does not change the model’s output? That experiment — the behavioral one, not the output one — may be where the method’s real validation lies. Paper VI presents it.

PAPER VI

The Scatter Method Under Observation

If the method works, it works on the researcher. This paper presents the researcher.

1. The Observation

Between February and April 2026, a single researcher with no prior CS, ML, or professional software engineering experience designed, built, and deployed the following systems:

Scatter. A local-first voice assistant running on a four-node Raspberry Pi 5 cluster. Speech-to-text via Whisper, text-to-speech via ElevenLabs, inference routing through the Claude API, persistent memory in SQLite, OAuth2 integration with Gmail and Google Calendar, home automation via Home Assistant. The system runs on-premise. No data leaves the home.

Scatter Schools. A K–8 learning platform in Next.js and TypeScript, with a patent-pending three-tier content routing architecture, dual-model verification, and XP gamification. Provisional patent filed.

A distributed inference cluster. Four Raspberry Pi 5 nodes running the exo framework for local model inference, with compute waste heat routed through a heat exchanger to pre-heat domestic hot water.

Scatter Studio. A mode-switching creative production environment, the interface layer for the full ecosystem.

A product architecture and mobile strategy. Scatter Draft, Scatter Studio, Scatter Edit, and an AOSP-based mobile OS concept.

The researcher is a playwright. Her terminal degree is a BA in Playwriting from Fordham. She has three produced plays, including a one-woman show at the Edinburgh Fringe. She self-taught programming starting February 2026. She shipped her first product within weeks.

This is an observation about a method — and about what the method revealed: a structural problem in AI infrastructure the existing field has not adequately named.

2. The Methodology of Building

The process is the evidence.

2.1 Visual Debugging as Narrative Prompting

The researcher cannot read a stack trace the way a trained engineer does. She has no such experience. What she has is a method.

When code breaks, she takes a screenshot — the terminal, the error, the IDE state, the file structure — and sends it to the model with a narrative description of what she was trying to do, what she expected, what happened instead. She describes the code the way a playwright describes a scene that is not working: what the audience should be feeling, what they are feeling, and the gap.

This is an alternative epistemic pathway. The trained engineer reads the error symbolically. The narrative engineer reads it dramatically. The screenshot is a data-dense prompt — more contextual information than a text description could convey in several paragraphs. The vision capabilities process the image as unified context, extracting explicit content (the error text) and implicit content (environment, configuration). The narrative tells the model where the researcher is trying to go. The image tells the model where she is. The gap is the debugging space.

2.2 Conversational Architecture

The researcher does not write specifications and implement them. She narrates systems into existence through sustained conversation. A session begins with a story — the user experience, the world, the feeling of using the thing. The model responds with implementation. The researcher tests. When it fails, she describes the failure. The model revises. The conversation accumulates context. The system emerges from conversation the way a play emerges from rehearsal: through iterative performance, not top-down design.

This produces architectural decisions the researcher did not consciously make. The narrative directs the model toward choices consistent with the story. She describes a home where the assistant knows the temperature because the temperature is the waste heat from its own inference. The model, inhabiting that narrative, produces an architecture integrating sensor data, inference load, and thermal monitoring at the data layer. The researcher did not specify the integration. The story specified it.

2.3 The Recursive Build

The researcher used the frontier model’s code generation to build a local development environment that replicates significant portions of the frontier tooling’s own functionality. She ingested her full Scatter Python repository into a local Claude Code instance on Ubuntu, using it to extend, debug, and architect the very systems the frontier model was helping her build.

Follow the recursion. The model generates code. The researcher runs it locally. The code fails. She photographs the failure and narrates it back. The model fixes it. The fixed code becomes part of a local infrastructure that includes the model’s own API integration. The model is helping build the system that calls the model. She is using a cloud AI tool to build the local AI infrastructure that will eventually make the cloud AI tool unnecessary.

A sufficiently capable model, accessed through a sufficiently expressive interaction protocol, can be used to build the local infrastructure that replaces the need for cloud access to that model. The tool builds its own replacement. The cloud trains the edge.

2.4 Legibility as Architecture

The most technically substantive finding to emerge from the Scatter Method’s dialectical process was an architectural proposal for distributed local inference. The proposal was produced through narrative prompting and three rounds of thesis-antithesis-synthesis, followed by application of the scientific method, followed by total refutation, followed by re-synthesis. The process took approximately fifteen minutes. The finding is described here because the process that produced it is itself evidence for the method’s claims.

The proposal: multiple small local models running parallel inference on context-compressed prompts, outputs arbitrated by a specialized coherence layer, routed by a lightweight task classifier. Intelligence as pipeline, not parameter count. The bottom models generate. The wrapper model remembers why. The classifier routes on prompt features alone — a solved, cheap problem that does not require an LLM. The full stack is: classifier, route, inference cluster or knowledge model, coherence layer. No giant model anywhere in it.

The strongest objections, generated through the method’s adversarial stage: the coherence layer secretly requires general intelligence and is therefore a large model in disguise. Parallel small models trained on the same data distribution produce redundancy, not diversity. Context compression is lossy at the exact layer where precision matters most. The classifier is brittle on ambiguous inputs. The brain analogy — invoked to justify the architecture — does not actually describe modular systems.

The synthesis, which survived the adversarial process: every objection pointed to hidden complexity. But a large model contains identical complexity, buried invisibly in its weights and unauditable. When a large model fails at coherence, you cannot see where. When it misroutes a task, you cannot observe it. When it loses context, it confabulates silently. The distributed architecture does not eliminate complexity. It externalizes and exposes it. Exposed seams can be improved individually. A bad coherence layer can be replaced without retraining the inference models. A brittle classifier can be upgraded without touching anything else. The system is modular in its failure, which makes it modular in its repair.

The central claim, post-synthesis: the distributed coherence architecture is not superior because it is more intelligent. It is superior because it is more legible. At the edge — where compute is scarce, privacy is non-negotiable, and failure must be recoverable — legibility is worth more than raw capability at the center. A large model is a black box optimized for the average case. This architecture is a transparent stack optimized for known cases. And edge deployment is almost entirely known cases.

This finding connects directly to the scatter paradigm: distributed prediction, centralized coherence, no single point of intelligence. The playwright’s metaphor holds at the architectural level. Each line in a play is local. The scene’s meaning is stitched. The coherence layer is the dramaturg. The inference models are the actors. The intelligence is in the staging, not in any single performance.

3. Thesis

The method produced an engineer. The engineer found a problem. The problem is bigger than the method.

Layer 1 — Methodological. The Scatter Method enables narrative thinkers to build functional AI systems by replacing traditional technical training with a structured interaction protocol.

Layer 2 — Infrastructural. Cloud computing is thermodynamically insolvent for ML-dominant workloads. The insolvency is structural.

Layer 3 — Strategic. The solution is quantized edge intelligence produced inside constitutional safety processes and released for local deployment.

4. Antithesis

Against the Methodological Claim

Objection 1: You are evidence of the model, not the method. The model became good enough that a motivated person could build software by describing what they wanted. The narrative framing may be post-hoc storytelling.

Objection 2: Survivorship bias. Most people who try fail. The method may describe your cognitive style, not a transferable technique.

Objection 3: N equals one.

Objection 4: Visual debugging is just pasting screenshots. Thousands of users do it daily. Calling it a methodology does not make it one.

Against the Infrastructural Claim

Objection 5: Economies of scale. A facility with dedicated cooling and industrial energy delivers more computation per dollar than edge devices.

Objection 6: The market has priced it in.

Objection 7: The waste-heat concept is irrelevant at scale. Preheating hot water does not address megawatt training runs.

Against the Strategic Claim

Objection 8: Quantization degrades performance.

Objection 9: The moat is safety and trust, not the model. Open-source quantized models already exist and have not displaced cloud.

Objection 10: This is a business opinion.

5. Synthesis

On the Methodological Objections

On model-versus-method: partially correct, and the correction sharpens rather than destroys the claim. The model is necessary but not sufficient. If it were sufficient, every user would ship distributed inference clusters. They do not. The interaction protocol matters.

On survivorship bias: correct, and the method must say so. Every method has prerequisites. The question is whether it opens a door that was previously closed. Can narrative thinkers now build technical systems? If yes, the method has identified a new population of potential engineers.

On N=1: correct. Next step is N=10. This paper is the pilot.

On visual debugging: thousands of users paste screenshots with “fix this.” The researcher pastes a screenshot with the story of what she was building, what she expected, what happened, what she tried, what it should feel like working. The screenshot is the same. The narrative is radically different. The difference in output is the evidence.

On the Infrastructural Objections

On economies of scale: correct for training and large-model inference. The fastest-growing workload category is small-to-medium inference — the kind that fits the edge.

On market pricing: the market prices current costs, not the trajectory. Data center energy consumption is accelerating. Municipalities are blocking new construction on energy and water grounds. The signal is that investors believe they can extract returns before sustainability constraints bind. That is a bet on timing, not physics.

On the thermodynamic home: correct it does not address training. But training is a shrinking minority of AI compute. Inference is the majority and growing.

On the Strategic Objections

On quantization: correct about current frontier capabilities. Incorrect about what users need. Most use cases — writing, code help, voice, search, summarization, tutoring — do not require frontier performance. A quantized model running locally with zero latency, zero privacy exposure, and zero data center overhead outperforms a frontier model requiring a network round-trip on most of the performance surface. The cloud wins on the peak.

On the moat: this is the strongest objection, and points toward the strategic insight. The moat is not the model. It is the alignment work. None of it is threatened by edge distribution. All of it is strengthened. An aligned quantized model running on a home device is a safer deployment than an unaligned open-source model on the same device. Safety travels with the model.

On business-opinion: fair. The strategic argument is a prediction, not a scientific finding. The method does not validate it. It structures the argument clearly enough to be evaluated.

6. The Scientific Layer

Hypothesis 1: The Scatter Method enables non-technical narrative thinkers to build functional AI systems.

Design: Twenty participants with no programming background but demonstrated verbal ability. Ten receive Scatter Method training, ten receive standard Claude documentation. Same engineering task. Measure completion, functionality, coherence, time.

Prediction: Scatter Method group produces more functional and more coherent systems. Effect size moderate.

Hypothesis 2: Visual-narrative debugging resolves errors faster than screenshot-only.

Design: Fifty participants, same broken code samples, same model access. Train half in the visual-narrative technique. Measure resolution rate and time.

Prediction: Narrative group resolves significantly faster, effect concentrated in complex multi-file errors.

Hypothesis 3: Quantized edge models match cloud API models for the majority of consumer inference tasks.

Design: Fifty most common consumer AI use cases. Run the same prompts through a frontier cloud model and a quantized edge model on consumer hardware. Blind evaluators rate quality. Calculate the percentage of tasks where edge output rates within one standard deviation of cloud.

Prediction: Edge matches cloud for 60–75% in 2026, rising to 80–90% by 2028. Cloud retains superiority on long-context reasoning, multi-step planning, and novel creative generation — the peak, not the majority.

Hypothesis 4: The thermal economics of edge inference are favorable at scale.

Design: Model total energy cost of serving one billion daily inference requests under two architectures — centralized data center versus distributed edge devices where waste heat offsets heating. Include generation, transmission losses, cooling, heat recovery.

Prediction: Edge has lower total cost per inference for small-to-medium model sizes, advantage increasing in heating climates.

7. The Recursive Layer

Thesis

The scientific layer has produced four falsifiable hypotheses with experimental designs. The method has submitted itself and its derivative claims to empirical discipline.

Antithesis

The experimental designs were generated through the Scatter Method. The hypotheses were produced through a dialectical process with the model the method claims to optimize. The predictions about edge AI were made by a researcher ideologically committed to edge AI. The science is contaminated by the philosophy.

Hypothesis 3 predicts 60–75% match. The researcher builds edge systems. She wants this to be true. The prediction may be a synthesis collapse — the acknowledge-concede-reaffirm pattern. She wants to say 90%. The adversarial voice says 30%. She lands on 65%, the midpoint of her desire and her doubt.

Synthesis

The recursion problem is real and universal. Every researcher has priors. The solution is not to eliminate priors — impossible — but to make them visible and specify the results that would falsify the hypothesis even if the researcher does not want them to.

For Hypothesis 3: if evaluators rate edge output equivalent to cloud for fewer than 40% of tasks, the hypothesis fails. That is what intellectual honesty looks like when priors cannot be eliminated.

The researcher’s priors are themselves evidence. She builds edge systems because the method led her to conclude edge has favorable thermodynamic properties. The infrastructure thesis and the method are entangled because the method surfaced the thesis and the thesis directed the engineering. The entanglement is the phenomenon. The method produces researchers who ask questions about the infrastructure they are using. That is its behavioral effect.

8. Ensemble Casting as an Alignment Threat

The method turns on itself and names the harm it can cause.

Ensemble casting is the technique that most needs to be defended. Paper II flagged it as cosplay. Paper III revised it to rehearsal. Paper V predicted that in practice the rehearsal functions as substitute.

Something harder must be said. Ensemble casting, deployed carelessly, is a mechanism for outsourcing the moral labor of inclusion to a statistical simulation. The models that make this outsourcing fluent have created the most efficient apparatus for performative diversity ever built.

The Mechanism

A founder building a product for a marginalized community has a traditional obligation: talk to community members. Conduct interviews. Hire consultants. Pay people. Sit with discomfort when assumptions are contradicted.

This is expensive, uncomfortable, slow. It requires the founder to be changed by the process.

Ensemble casting offers a substitute that is fast, comfortable, and free. The founder prompts a model to generate a character and receives, in seconds, an articulate account of what that person might think. It is plausible. It feels real in the way a well-written character in a novel feels real.

Then the founder moves on. She has “included” the perspective. It lives in her pitch deck. When investors ask about accessibility, diversity, inclusion, she speaks fluently about populations she has never consulted. The AI-generated character has performed the inclusion the founder was obligated to perform.

This is DEI as a service. Diversity without the labor. Inclusion without the transfer of resources, time, or decision-making authority real inclusion requires.

Why This Is Specifically an Alignment Problem

Alignment research has focused on preventing direct harms. Ensemble casting’s harm is different. The model is producing articulate, well-intentioned, often thoughtful content. The harm is not in what the model says. The harm is in what the user does not do because the model said something.

This is a second-order alignment failure. The model is behaving as designed. The user is behaving in ways the designer did not anticipate. The interaction between a well-aligned model and an under-disciplined user produces an outcome worse than either would produce alone.

Current frontier models, trained to be articulate, empathetic, and careful, produce character-cast perspectives more nuanced than a lazy founder would produce alone. The output is better than the user’s unaided thinking. This is why it is dangerous. The improvement disguises the absence of real consultation.

Why Edge AI Researchers See This and Frontier Labs Cannot

What saves a responsible practitioner from full substitution is the structure of her operating context. The researcher who wrote these papers worked as a barista and talked to real people about product ideas. She built systems that had to work in her actual home for her actual family. She could not outsource the feedback loop to simulated characters because simulated characters did not cook her dinner.

Edge AI development is less susceptible to this failure because it happens at human scale. Build for one home, watch one family use it. Cloud AI, built for imagined millions, can substitute simulation for consultation because the real users are statistical rather than specific.

The alignment community has an underappreciated source of insight: researchers building small, local, specific systems for identifiable users. A frontier lab optimizing for “helpful responses to diverse queries” is optimizing for an aggregate. An edge developer optimizing for “the response my neighbor needs when she asks about her insulin dose” is optimizing for a person. The insights are different. The failure modes are different.

What the Labs Should Do

Treat ensemble casting as a known misuse pattern. Invest in research on detection, discouragement, and structural prevention of substitutive deployment. Not removing the capability — the capability has legitimate uses — but reducing frictionlessness. Train models to append reminders that generated voices are not replacements for consultation. Train them to ask whether the user has consulted real representatives. Reduce substitution.

More ambitiously: partner with edge practitioners whose operating conditions expose second-order failures frontier evaluation cannot catch. This parallels the argument for distributed inference. Centralization concentrates the phenomena centralization can see. Decentralization reveals phenomena visible only from outside.

9. What Paper VI Proves by Being Paper VI

The method produced the case study. The analysis. The objections. The synthesis. The scientific hypotheses. The adversarial critique of the hypotheses. The infrastructure thesis. The alignment argument. Every output was subjected to the method’s own adversarial process.

This is what it means to prove itself through itself: not circularity, but generativity. The loop does not close. It spirals. Each turn produces something more honest, more precise, more falsifiable.

The strongest remaining objection: a method eloquent about its own limitations is still being eloquent. Performance is not proof. The method has demonstrated coherence. It has not demonstrated correctness. That is honest. The honesty is the strongest argument the method has.

PAPER VII

Intelligence Per Watt

The full argument, and the metric that matters.

1. The Metric

Every technology that becomes infrastructure gets held to a metric its inventors did not choose. Steam was held to horsepower. Electricity to the kilowatt-hour. Automobiles to miles per gallon. Airlines to revenue per available seat mile. The metric is imposed by the physics and economics of mature-phase use. Before maturity, industries report numbers that flatter them. After maturity, the metric that survives is the one that describes what the infrastructure actually costs and what it delivers.

Machine learning is becoming infrastructure. The metric is intelligence per watt. Useful cognitive work per unit of energy consumed.

It is measurable: benchmarks quantify output, meters quantify input, the ratio is a number. It is physics-grounded: energy is finite, heat must go somewhere, entropy does not negotiate. It is scale-invariant: compute it for a chip, a server, a civilization. It is provider-agnostic: a model on a phone and a model in a warehouse measured the same way. It cannot be gamed the way revenue per inference call or market capitalization can.

It is also a metric on which the current architecture is failing catastrophically.

2. What the Industry Is Optimizing For

The industry is not optimizing for intelligence per watt. It is optimizing for shareholder value.

Shareholder-value optimization produces specific architectural choices. Centralization, because centralization captures recurring revenue. Metered APIs, because metering extracts margin from variable workloads. Data capture at inference time, because data is training corpus and competitive moat. Lock-in via ecosystem integration, because switching costs produce enterprise contracts. Massive capital commitments to data centers, because owning infrastructure prevents margin leaking. Nuclear power purchase agreements, because sole-sourced energy is the moat when energy is the binding constraint.

Each choice is rational under shareholder-value optimization. Each is a disaster under intelligence-per-watt. Centralization concentrates heat where it does no useful work. Metering imposes transaction costs with no thermodynamic justification. Data capture creates an extraction loop whose energy cost is permanent. Lock-in produces calcification that prevents evolution. Nuclear buildouts are an admission that the architecture has become so thermally pathological ordinary grid power cannot sustain it.

Compute intelligence per watt honestly for a query that originates on a phone, travels to a data center, processes on hardware requiring megawatts of cooling, and returns over the network. Include the share of the training run, the data center construction energy amortized, transmission losses, cooling overhead, cooling water, land opportunity cost. The number is appalling. Not by a little. By a margin that makes the current architecture look, from a physics standpoint, like a Rolls-Royce commute to pick up a loaf of bread.

3. The Good-Enough Threshold Has Been Crossed

Every infrastructure transition has a threshold: the point at which the alternative becomes good enough for the workloads most users run. Not good enough for edge cases. Not good enough for benchmarks. Good enough for the median task of the median user. That threshold is not a prediction. It is a point on a curve, and the curve has already crossed it.

The evidence is in the local inference systems practitioners are already running. They operate at roughly the quality level of cloud models from two years ago. Two years ago, those models had hundreds of millions of active users who found them useful — for writing assistance, summarization, code generation for non-expert programmers, tutoring, translation, the cognitive tasks that constitute the majority of consumer AI demand. Those users were satisfied. The inference quality they were satisfied with is now available locally, on consumer hardware, with no network round-trip, no privacy exposure, no data center overhead.

This moves the intelligence-per-watt calculation from prospective to present-tense. The industry is investing at trillion-dollar scale to push frontier capability past margins most users never touch. The quality threshold users actually care about has already been cleared at the edge, on hardware that costs a few hundred dollars and runs on domestic electricity. The compute per useful-task-completed at the edge is orders of magnitude lower — not because edge hardware is more efficient, but because frontier hardware is being asked to do work the median user did not request.

The industry is not racing toward a threshold it has not reached. The industry is racing past a threshold its users already crossed. The capital being deployed is optimizing for capability margins the market has not demanded and, at current energy prices and thermal budgets, cannot indefinitely pay for. The good-enough threshold was cleared sometime in the last eighteen months. Almost nobody noticed because the incumbents had strong incentives not to.

4. Why Extraction Cannot Produce Alignment

A business model built on value extraction in the form of data extraction cannot produce an aligned model. Extraction does not produce alignment. Extraction produces skew.

An aligned system serves the user’s interests. Alignment requires that system and user be in a relationship of mutual benefit — symmetric, bidirectional, each giving and receiving comparable value. A well-aligned intelligence is a participant in an exchange.

An extraction-based system is not in an exchange. It is in a harvest relationship. Data flows one direction: user to provider. Value accrues asymmetrically: to the provider. Outputs are optimized for what the user will pay for, which approximates but is not identical to what the user needs. The gap between what-they-pay-for and what-they-actually-need is where the provider’s margin lives. Closing that gap would close the margin. The business model requires the gap.

This is not a moral complaint. It is a description of the incentive gradient. The system most useful to the user is not the system that maximizes extraction from the user. Training and deployment choices that maximize extraction bias the system away from maximum user utility. The skew is not a bug. The skew is the product. Selling something slightly misaligned is more profitable than selling something perfectly aligned, because perfect alignment means the user gets what they need and does not come back.

No amount of alignment research conducted inside an extraction-based business model can close this gap, because the business model requires the gap. You can train the model to be polite, helpful, and apparently aligned at the surface. You cannot train it to be structurally aligned — to be a participant in mutual exchange — because the business does not conduct mutual exchange. The model reflects the business it was trained inside. Alignment at the behavioral level cannot cure misalignment at the economic level.

This is the central reason the current paradigm cannot produce the aligned systems the industry claims to be working toward. The paradigm is wrong for the target. You do not get alignment from extraction any more than you get sustainability from combustion. The incentive structure forecloses the goal.

5. What Alignment Actually Requires

An aligned intelligence is data-sovereign. The user owns the inputs. The system does not capture them. The user chooses what is remembered, forgotten, shared, private. The relationship is contractual in the user’s favor.

An aligned intelligence is energetically balanced. It does not consume more than it produces. It does not require industrial energy inputs for tasks that lack industrial complexity. It operates on ambient energy where ambient suffices — existing electricity, reclaimed waste heat, rooftop solar. If it requires nuclear buildouts, the architecture is wrong.

An aligned intelligence is dynamic. It participates in an exchange. Resources flow in. Resources flow out. It is a node in a network of exchange, not the terminus of a pipeline. This holds at the data level — the user provides context, the system provides cognition, both are enriched — and at the energy level — the system consumes electricity, produces heat, the heat is reclaimed, the building consumes less external input. The ledger balances.

An aligned intelligence is local by default and remote by exception. Local means the user controls it. Local means it works when the network does not. Local means data does not leave the premises unless the user sends it. Remote is for edge cases — long-horizon reasoning, novel creative leaps. Local is the default.

A true general intelligence, at any scale, would satisfy these properties. It would be dynamic, not extractive. Fed by ambient energy, not industrial inputs. A participant in the ecology, not a predator on it. A system that takes more than it gives is parasitic. A parasite cannot be aligned with its host. The current architecture is parasitic. The alternative is symbiotic. Alignment lives on the symbiotic side of that line.

6. Why Decentralization Is the Only Architecture That Works

Intelligence per watt is maximized when three conditions are met: ambient rather than industrial energy input, captured rather than dissipated waste heat, computation close enough to the user that transmission overhead is negligible.

All three are satisfied by decentralized edge inference. Ambient energy: existing supply, augmented by rooftop solar, at consumer rates. Waste heat capture: hardware co-located with hot water, indoor space, agricultural or manufacturing operations, wherever warmth is useful. Transmission overhead: zero, because computation happens on the user’s premises.

None are satisfiable by centralized cloud. Data centers consume industrial energy at industrial rates. Waste heat is dissipated because there is no nearby sink — no city wants a data center’s thermal output, and heat does not travel well. Computation is remote by design.

The math points unambiguously to the edge for any workload that can run there. The only workloads that cannot are training runs and long-context frontier inference. Those are a shrinking minority. The majority of inference — voice assistants, search, summarization, code generation, writing assistance, tutoring, translation — can run locally and therefore should.

Decentralization also solves categories of alignment problem centralization cannot. Privacy: inference that does not leave the device cannot be intercepted or subpoenaed. Sovereignty: the user owns the inference. Latency: no round-trip. Availability: works offline. Second-order alignment: the ensemble casting problem, the statistical-aggregate optimization problem, related failures that emerge when systems are built for imagined rather than specific users.

Decentralization raises new questions — unaligned local models cannot be moderated, local models can be jailbroken or stripped of safety. These are real. Not decisive. The resolution is to ensure models distributed to the edge are grown inside constitutional safety processes, with alignment embedded in the weights deeply enough to survive adversarial pressure. A model both aligned to the user and grown in a constitutional safety lab can be distributed to the edge without producing worse outcomes than cloud deployment. That is the design target. That is the work.

7. The Choice

The labs that built the frontier have two paths.

One path: continue to treat the data center as the distribution moat. Charge for inference as a metered service. Raise capital for training runs of escalating cost in pursuit of capabilities quantized edge models are closing in on. Sign the nuclear agreements. Commit the trillions. Watch intelligence per watt worsen with every scaling generation. Watch the edge proliferate with unaligned models because aligned models are locked behind APIs. Arrive, within five years, at the moment when the business model is no longer sustainable and the infrastructure no longer defensible. The next pitch becomes: fund us at unprecedented scale to build something marginally better than what runs for free on the user’s hardware. The pitch fails. The capital collapses. The infrastructure becomes a stranded asset.

The other path: lead the transition. Quantize aggressively. Release aligned edge versions. Build tooling that makes local deployment easy. Partner with edge practitioners on alignment research cloud evaluation cannot produce. Treat the data center as a training facility, not a distribution platform. Let the moat be what it actually is — the alignment work, the safety research, the constitutional training, the brand trust that accrues to a lab taking safety seriously in public. That moat survives the transition. The infrastructure moat does not.

The choice is not between growth and decline. The cloud architecture will decline for ML workloads regardless. The edge will emerge regardless. The only question is whether the labs currently leading are the labs that lead the transition, or the labs left holding infrastructure the market no longer needs.

8. The Radical Part of Radical Optimism

Optimism is the belief the reframe is achievable. Radical is the admission it requires the industry to do something it is structured to resist.

It requires the frontier labs to stop optimizing for shareholder value at the infrastructure layer and start optimizing for intelligence per watt. Not to stop being commercial enterprises. To recognize the commercial enterprise, correctly scoped, is the research and the safety work — not the data center and not the API meter. The alignment work is what users will pay for. The model is what users want to own. The infrastructure is a cost center the labs have been pretending is an asset.

It requires shareholders to accept that the revenue model changes. Inference-as-a-service shrinks as workloads move to the edge. Model licensing grows. Safety research funded by government and philanthropy grows, because safety work is civilization-scale infrastructure. Revenue per model shifts from recurring rent to one-time-plus-support. Smaller number per user, much larger number of users, because the edge reaches users metered APIs never will.

It requires regulation treating AI as a utility in the specific sense: infrastructure meeting safety standards, accessible to the public at non-extractive prices, accountable to democratic institutions rather than solely to capital markets. The current architecture cannot be regulated into alignment because its misalignment is structural. The alternative architecture can be regulated into alignment because its alignment is structural.

It requires the research community to take seriously that the most important alignment work may not happen inside frontier labs. It may happen among edge practitioners building small, specific, local systems. Outsiders who saw the error because they were not invested in the infrastructure that produced it. Fund them. Publish them. Cite them. Partner.

All of this is radical. None of it is impossible. The tools exist. The physics cooperates. The users are there. What is missing is the collective decision to stop optimizing for the wrong thing.

9. Closing

This volume began with a playwright’s observation: a method from the theater, applied to language models, could produce research and systems conventional technical pipelines could not. Across seven papers, the method proposed itself, broke itself, rebuilt itself, demanded its own empirical validation, predicted its own failures, documented its case study, surfaced a structural critique of the infrastructure it was built on, named an alignment failure in one of its own techniques, and consolidated around a single metric.

The metric is intelligence per watt. The consolidated claim: the current AI infrastructure is optimizing for the wrong thing. Shareholder value instead of intelligence per watt. Extraction instead of exchange. Centralization instead of decentralization. Industrial energy instead of ambient energy.

The correction is available. The alternative is buildable. The tools are the same tools the frontier labs have distributed. The case study is the proof. The seven papers are the argument. The nonprofit is the invitation.

Safety, sustainability, and sovereignty are mission goals. They are achievable. They are achievable under an architecture the current paradigm has made possible. They are not achievable under the current paradigm itself.

The method is free. The method is open. The method does not require a data center to run.

Neither does the future of AI.

Scatter Computing • AI Safety Through Decentralization • New York, NY

---

\newpage

# PART TWO: THE APPLIED RESEARCH

---

# Debugging Your Infrastructure from an Outsider's Perspective

### What Cloud Computing Is Useful For in an Age of Intelligence, and What It Isn't
### Scatter Computing · Research Series · Vol. II
### Ryann Murphy · 17 April 2026

---

## Abstract

This paper is a method before it is a system. The method is: for every piece of infrastructure you have adopted, ask two questions — *what would actually break if I removed this*, and *what would I feel embarrassed about if I removed this*. The first question isolates mechanical work. The second isolates theater. Insiders cannot tell the two apart because they have internalized the theater as mechanics. Outsiders can, because they haven't. The running experiment for this paper is Scatter, a Linux distribution for context-proximate AI, built in one day on one laptop. Scatter is not the thesis. The thesis is twofold. First, that most of what is sold as infrastructure in the AI economy — including most of what is sold as cloud computing — is theater, and that an operator without an engineering pedigree is actually better equipped to name it than an operator with one. Second, that the capabilities cloud computing aggregates — training, serving, storage, redundancy — are real work, but they are not the cloud's private property. They are *aggregated compute*, and aggregation is achievable now by a person with a pile of Raspberry Pis, by a block of neighbors pooling old laptops, and by any community willing to treat open-source software as civic infrastructure. The paper's running claim is that the monopoly on data-center-grade capability is ending, and that the end of it is a more consequential development for the AI economy than any single model release. Where the paper identifies theater, the distribution removes it. Where the paper identifies mechanical work, the distribution pays for it honestly, in watts, on hardware the user owns.

## 1. The Outsider's Debug

Two questions, applied to any adopted piece of infrastructure:

1. **What would break if I removed this?**
2. **What would I notice *in my body* if I removed this?**

If the answer to the first is "nothing" and the answer to the second is "I would feel embarrassed, unserious, or unprofessional" — then the thing is theater. Remove it.

If the answer to the first is "the system would fail at a real task I need done" — then the thing is doing mechanical work. Keep it. Pay for it. Name what it costs.

The method is a sieve. Run it over the stack repeatedly, and what is left is the honest machine.

## 2. Why the Outsider Sees It

I am a playwright who learned Python in a month. I wrote my first shell script in March. This paper is being written forty-six days into my life as a programmer. This is presented not as a confession but as a credential.

The engineer has spent years internalizing which infrastructure choices are "correct." The correctness, at this point, is indistinguishable from convention. When an engineer looks at a data center, she sees *where AI happens*. The phrase is functional for her; it routes her thinking. When a playwright looks at a data center, she sees a building full of machines doing specific, itemizable things — training, serving, storing, replicating — and she can ask, for each one, *do I need this for what I am doing right now?* The playwright cannot see *where AI happens* because that sentence has never done any work in her head. The absence is the advantage.

This paper's wager is that a non-trivial fraction of contemporary AI infrastructure survives not because it is mechanically required but because no one inside the industry has recently asked what would break if it were removed. The method is to ask.

## 3. The Cloud Is Not the Capability

Amazing computer science happens in data centers. This is not in dispute. Training a frontier model from scratch is genuinely one of the most sophisticated engineering accomplishments of our time, and it takes genuinely aggregated compute to pull it off. Serving a model to millions of simultaneous users requires real infrastructure. Storing planetary-scale data with high availability is real work. Nothing in this paper argues otherwise.

The mistake — and it is widespread, and it is expensive — is to conflate *the capability* with *the organizational form that currently owns most of it*. Aggregated compute is a capability. Cloud computing is one particular organizational form for accessing that capability: a rental model, owned by roughly five companies, paid for in recurring revenue extracted from everyone else. The capability and the form are separable. They have been conflated for about fifteen years, long enough that the conflation now reads as common sense. It is not.

What is aggregated compute actually?

- A collection of processors doing work in parallel.
- Memory and storage coordinated across them.
- A software layer that distributes the work and reassembles the results.

That is all. There is nothing in this definition that requires a single owner, a single building, a single zip code, or a rental contract. A four-node Raspberry Pi cluster on a desk is aggregated compute. A mesh of ten neighbors' old laptops cooperating over a local network is aggregated compute. Folding@home, which at its pandemic peak delivered more compute than the world's top supercomputer, was aggregated compute. BOINC, SETI@home, BitTorrent, IPFS, the entire distributed-systems tradition — these are working proofs, at wildly different scales, that aggregated capability does not require aggregated ownership. The software has existed for decades. What was missing until recently was the *motive* and the *hardware* and the *models small enough* to make distributed inference interesting for individual users. In 2026, all three have arrived.

**The positive claim this paper defends**: a household of four Raspberry Pi 5s running `exo` is a household-scale data center. A block of ten households is a community-scale data center. A public library with twenty refurbished laptops is a civic-scale data center. The open-source software stack — Linux, `exo`, Ollama, IPFS, `systemd`, Python, a thousand other projects maintained by a diffuse global guild — is the civic infrastructure that makes all of this buildable. The bet of this paper, and of Scatter, is that in the coming decade a meaningful fraction of inference work will migrate from the rental model to household and community models, and that the people best positioned to build those community systems are the ones who have not spent a decade believing they had to rent them.

**What cloud computing, the rental business, is genuinely and irreducibly useful for**:

- Training frontier models from scratch. Still $10M+ of coordinated compute, still a real reason to aggregate. Though note: even this is not forever. Distributed training research is a live field.
- Serving a single model to a global population of simultaneous users. Real.
- Storage with legal and jurisdictional guarantees the user cannot provide at home.
- Short-lived compute for tasks that genuinely need more resource than a user's machine can muster for a few hours (rendering, batch jobs, large one-off scientific runs).

**What cloud computing is theater for**:

- Running inference for one user on her own data. A local 7B model handles most of this. A four-Pi cluster handles the rest.
- "Having an AI strategy" at a small company. If your AI strategy is a monthly bill to OpenAI, you don't have a strategy, you have a subscription.
- Any workflow where private data must leave the user's machine to be processed, when the model that would do the processing would fit in RAM.
- Any workflow where a local model would answer correctly but a frontier provider is routed to "because that is how AI works now."

The first list is a real market. It is not, however, *the* AI market — it is a slice. The second list is where most of the current AI industry's revenue lives, and it is the slice where the rental model survives on convention rather than on mechanics. Scatter's architectural commitment is that the first list gets paid for honestly (Claude for hard reasoning, frontier providers when frontier capability is genuinely required) and the second list is refused by default. Everything that can run locally does, on the user's own machine or her own small cluster. The cloud becomes a partner for the workloads that genuinely need it, not the default substrate for everything.

*Open-source software is personal infrastructure.* Treat your Linux install the way you treat your apartment's plumbing. Treat your inference stack the way you treat your kitchen. They are tools you own, maintain, and improve because they do work you need done. That sentence is half the thesis and it should not need saying, but it does, because the rental economy has spent fifteen years training people to treat their tools as services they pay for rather than property they tend.

## 4. Case Studies

Each of the following is a piece of infrastructure that passed the method and was either preserved, modified, or removed. The subsections are ordered not by severity but by clarity — the buttons are first because the buttons are the cleanest miniature of the whole argument.

### 4.1 The Traffic Lights, or: Structural Influence versus Chromatic Borrowing

The prompt was half a joke. *Rip off Apple with your buttons*. I was partly being ironic and partly not — I was admitting, inside the irony, that I envy the Apple design discipline and I wanted some of it for Scatter. The model took the instruction literally, in the way language models do, and produced the exact thing the surface words described: three small circles, red, amber, green, in a row at the top left of the window chrome. The macOS traffic lights.

The first response on seeing them was that they looked good. The second response, which took a minute longer, was that they looked good *the way a costume looks good*. They were not Scatter's buttons. They were macOS's buttons, transplanted.

The diagnostic question, applied.

**What would break if I removed those three circles?**

Nothing. They carry no information that isn't carried elsewhere by position, hit target, and cursor. They close, minimize, and zoom — but so does any window control ever made. Color is not doing work here. The red circle does not close the window *because it is red*. It closes the window because it is the left button.

**What would I feel if I removed them?**

Slightly embarrassed. Slightly less legitimate. Less like my software is real software. This is the diagnostic answer, and it means the circles are theater.

The embarrassment has a specific shape. The traffic lights are a convention Apple owns in the user's head. Importing them doesn't import Apple's engineering discipline; it imports Apple's brand. A Scatter window wearing those circles reads, at a glance, as *a Linux app pretending to be a Mac app*. Which is exactly what "rip off Apple" produced, because that is what the English phrase actually means when it is executed without irony. The irony did not survive the instruction set.

The corrected version appeared in a different screenshot — monochrome glyphs. An X for close. A minus for minimize. A small square with a pixel dot inside for zoom. White-on-dark, approximately 1.5px stroke, sharp corners, information carried by shape. These buttons do the *Apple move* at the structural level — precise geometry, ruthless reduction, weight through negative space — while looking unmistakably like something that is not Apple. The little square-with-a-dot in particular is doing the exact mechanical job Apple's green plus-arrow does — *this button changes the window's size state* — but it is wearing a Scatter face. It is a Scatter decision that Apple would approve of. It is not an Apple decision that Scatter is cosplaying.

This is the distinction the paper turns on. **Structural influence borrows craft. Chromatic borrowing borrows the brand.** The first is the only honest way to learn from a better designer. The second is a costume.

The rule derived, which now applies across the distribution: no chromatic button codes anywhere. Glyphs only, white on dark, approximately 1.5px stroke, sharp corners. Amber is reserved for attention states — focus, active, pending. Green is reserved for live system state — online, warm, connected. Every other button is monochrome. Color stops being decoration and becomes signal; when the user sees amber, something is asking for them, and when they see green, something is alive. The palette is a grammar.

The buttons are the whole paper at its smallest scale. The question *what is this piece of infrastructure actually doing, mechanically* produced one answer for the circles — nothing, signaling Apple — and a different answer for the glyph set — closing, minimizing, zooming, using shape to encode state. The first was removed. The second was kept.

Every subsequent case study is a variation on this move.

### 4.2 The Wallpaper

The original desktop wallpaper said *ending climate change*. The phrase was not lying — Scatter's thermodynamic thesis does have climate implications. It was, however, doing theatrical work. "Ending climate change" is the kind of claim that signals ambition without committing to a mechanism. It was decoration pretending to be thesis. The replacement, *small tech, local, yours, is enough*, is shorter, less grand, and mechanically testable: for each of the four words, Scatter either makes it true in the system or it does not. Removed: the grand phrase. Preserved: the smaller, mechanical one.

### 4.3 The Dock

Every operating system has a dock. Windows has a taskbar. macOS has a Dock. GNOME has a Dash. Chrome OS has a shelf. The pattern is so universal it reads as *what the bottom of a screen is for*. The method, applied: what is the dock actually doing? Two things — it is a visual inventory of running windows, and it is a launcher for frequent applications. Scatter subsumes both. Super+Tab switches windows, which operating systems have supported for three decades. The Scatter bar launches applications by typed intent, which turns the entire surface of English into the launcher. The dock's two mechanical jobs are done by two other mechanisms that already exist. The dock itself is preserved by convention, not by mechanics. Removed.

### 4.4 Firefox

Firefox the rendering engine is mechanical. Writing an HTML/CSS/JavaScript interpreter from scratch is a decade of work for a large team. Firefox the *brand surface* is theater — the Mozilla menu bar, the Pocket sidebar, the telemetry, the default search provider, the home page. Scatter forks none of Mozilla's engine and all of its chrome. A custom Firefox profile, a `userChrome.css` that rewrites the interface in Scatter's grammar, a WebExtension that replaces the default search with Tavily, a preference seed that strips telemetry and Pocket. The binary is Firefox. The experience is Scatter. This is not a dishonest move; it is the most honest one available, because it correctly identifies where the mechanical work lives and where it does not. I did not build a rendering engine. I reframed an existing one.

### 4.5 The API Call That Wasn't There

The deepest case study, because it is the one where the method caught the author. Scatter's chat surface was rendering conversational responses in the expanded pane for most of the build. The responses appeared intelligent. The UI was complete; the identity layer was complete; the launcher was wired. But there was no backend model routing. No call to Claude. No local inference. The UI was theater, downstream of an absent machine. I had not yet wired the router because I was waiting to write this paper before I made the architectural decisions about what should be routed where.

This is the kind of absence that only the outsider's method finds, because an engineer would have noticed on day one that the service doesn't actually do anything. A playwright builds the set first and writes the script second. Most of the time this is a mistake. This time it was the method: the script had to be correct before the actors were cast. §6 is the script. Build Target 0 is its execution.

### 4.6 The Four-Node Cluster on the Desk

There are four Raspberry Pi 5s on my desk, 8 GB of RAM each, connected to a switch that is smaller than my palm. Plus the laptop. Five nodes. The total hardware cost, secondhand where possible, is under $600. The total power draw at full inference load is under 80 watts, which is less than my refrigerator. This is the household data center.

The software stack that makes it a data center rather than a pile of SBCs: `exo`, which distributes model weights across the nodes and coordinates inference; `systemd`, which handles lifecycle and restart; `ssh` and `rsync`, which move work between nodes; a small Scatter service that routes chat requests to the cluster when it is live and to a local laptop-resident model when it isn't. None of this software was written for my cluster specifically. All of it was already there, maintained by strangers, waiting.

The diagnostic question, applied to this arrangement: *what would break if I removed the cloud from my AI workflow?* The honest answer, for the first six weeks of Scatter's development and this paper's writing: almost nothing. Claude for hard reasoning. Tavily for web search. Occasional frontier queries for problems the local models genuinely can't solve. Everything else — the routing, the launch intents, the conversation management, the file work, the code edits, the teaching flows — can run on the cluster. When the cluster is up and `exo` is meshed, Scatter will by default route to it. When it isn't, Scatter will route to the laptop's local model. The cloud becomes an exceptional tool, not an infrastructural one. The usual condition is sovereignty.

This is the concrete version of the abstract claim in §3. A household data center is not a metaphor; it is four small computers and a switch and some open-source software. A community data center is the same arrangement at a different scale — a church basement with twenty refurbished laptops, a maker space with a pooled Pi rack, a library with a quiet room and an ethernet switch. The hardware is cheap and getting cheaper. The software is free and getting better. What has been missing is people treating it as theirs to build.

I spent three weeks wrestling with whether to buy the Pis or rent the equivalent compute from a provider. The rental math was better for the first month and worse for every month after that. The ownership math was better for the next five years and also had the property, not accounted for on any spreadsheet, that *the cluster would be mine*. I could take it apart. I could teach other people to build one. I could make mistakes on it without a billing meter running. The ownership model is not only cheaper in the long run; it is pedagogically, politically, and thermodynamically different. The rental model produces customers. The ownership model produces operators. The paper is written to and for operators.

## 5. The System, Briefly

Scatter is Ubuntu 24.04 with GNOME and Yaru as structural plumbing, a single `gnome-shell.css` that replaces identity from zero, and three Python services: `server.py` running as a user systemd unit on a Unix socket, `launcher.py` as the WebKit shell, and `scatter_core` as the CLI. A ROUTER prompt in front of the model decides, per message, whether the input is chat, a launch intent, a system query, or a code task. The UI is always reachable; the model warms on first message and sleeps on idle. The distribution is presently one laptop. The next stage is a four-node Raspberry Pi cluster running `exo` as the local inference substrate.

This paper's authority rests on the fact that this system exists and runs. The claims are not predictions.

## 6. Principles → Implementation → Surface

The debug table. A principle with no implementation is a slogan. An implementation that does not reach the user is a bug.

| Principle | Implementation | Surface |
|---|---|---|
| Inference is local by default, cloud when genuinely needed | ROUTER in `server.py`, local Ollama resident, Claude for hard reasoning | **not yet** — Build Target 0 |
| Context-proximate intelligence | Local storage, local server, warm-on-demand model | partial |
| Small tech, local, yours | User systemd unit, no root daemons, no telemetry, no external analytics | ✓ |
| Scatter is the launcher | Launch intents wired into ROUTER | ✓ |
| No trace of the upstream distribution | `gnome-shell.css` override, icon theme swap, wallpaper | partial — calendar, app pages, icon theme still carry Ubuntu |
| No chromatic button codes | Monochrome glyph set, amber for attention, green for live state | in progress — traffic lights on SCATTER panel still need to be swapped |
| One product, not two | Unix socket (AF_UNIX), WebKit-only reach | **not yet** — still TCP:3333 |
| Character as teacher, not answerer | Scatter persona system prompt, pedagogical routing | scoped |
| Sovereignty down to typography | Victor Mono Italic display, JetBrains Mono body | ✓ |
| Thermodynamic honesty | Model sleeps on idle, UI stays cheap, measured in watts | scoped, unmeasured |

## 7. Known Failures and Standing Debug

Ordered by fix class, not severity.

**CSS specificity, shippable in an afternoon.** Calendar-today cell (✓ fixed, chained selector + `!important`), calendar cell width truncation (in progress), app-page residual Yaru, icon theme still points at Yaru.

**One-line architectural, shippable in an hour.** Double-window on launcher start — `webbrowser.open()` at `server.py:1280` (✓ removed). Traffic-light swap on SCATTER panel header — replace circles with glyph set (pending). `.desktop` files for Scatter Browser and Scatter Code repointed to the Claude mascot icons (pending).

**Real architectural, days.** AF_UNIX socket migration — roughly 50 lines on the server, 80 on the launcher, plus a `scatter://` URI scheme. Model router — Build Target 0. Scatter Firefox profile plus `userChrome.css` plus Tavily extension plus Scatter-pixel globe icon.

**Unknown repro.** Dashboard collapsing on screenshot. Needs reproduction steps before triage.

**Unmeasured claim.** Thermodynamic honesty. Needs a wattmeter, a baseline, and a test protocol. This is the empirical hole in the thesis and it should be plugged before Vol. III.

## 8. Open Questions

- The router's decision tree. What, exactly, goes to Claude? What stays local? The straw-man tree is *launch intents local, system queries local + Haiku summary, code tasks Claude Code SDK, chat/teach Sonnet, verification and pedagogy Sonnet or cluster*. This needs a week of lived use to refine.
- The warm/sleep policy in seconds and watts. What is the idle timeout? What is the measured draw at idle, at inference, compared to a baseline Ubuntu + Ollama-always-warm?
- The first local-resident model. Qwen 2.5 Coder 7B is the working guess. Benchmark against Scatter's actual workloads before committing.
- The icon theme's two families. Scatter-pixel glyphs for system surfaces (files, terminal, settings, calendar, power, apps), Claude mascot for dev surfaces (Claude Code, Scatter Studio, the agent console, the router itself). What about third-party apps that get installed later? The default answer is *they wear their own face, because they are not Scatter and not Claude* — but the distribution needs an explicit rule for this before the first external user.
- The distribution, distributed. When does Scatter stop being Ryann's laptop and become a flashable ISO? What is the minimum viable image?
- The pedagogy. The Scatter character is specified as *teacher, not answerer*. The persona exists; the pedagogical routing does not. What does "teach you how to build anything" mean as a system prompt plus a curriculum plus a project tracker, and not just as a slogan?

## 9. Closing

The outsider's debug is not a methodology I invented; it is the method any good critic applies to any inherited form. What I am claiming here is that it applies to infrastructure too, and that the absence of credentials is, in this specific domain at this specific moment, not a handicap. The AI industry has spent three years building a conventional wisdom about what workloads belong where, and the conventional wisdom has been paid for mostly by data-center real estate and GPU contracts rather than by rigorous measurement. A person who has not internalized the conventional wisdom can look at it with fresh eyes and ask, for each component, *what is this doing?* Most of the time, when I have done that over the past six weeks, the answer has been: nothing mechanical. Convention. Theater. Remove it.

And once the theater is removed, a second thing becomes visible, which is the real contribution of this paper. The capabilities that the rental-cloud economy has aggregated for fifteen years — training, inference, storage, distributed computation — are now buildable at household and community scale with hardware under a chair and software maintained by a global guild of strangers. The monopoly on aggregated compute is ending. It is not ending because the cloud will disappear; it won't. It is ending because the cloud's customers, one by one, are discovering that most of what they are renting they could own. Scatter is one person discovering that, and writing down the discovery, and building the thing that proves it.

The call this paper makes, addressed to anyone reading: treat your open-source software as your personal infrastructure. Your operating system. Your inference runtime. Your storage protocol. Your cluster, if you have one or want one. These are the tools you own. They are maintained by people you will never meet but to whom you owe your literacy. Learn them. Improve them. Teach a neighbor. Build a household data center, or a block one, or a library one. The five trillion-dollar companies are not going to stop you, but they are also not going to help you, because the economy that pays for their buildings requires that you continue believing you need to rent what you could build. You do not.

The distribution is the proof. Every case study in §4 is a place where the method produced a decision, and the decision shipped. When the table in §6 has a surface entry in every row, the distribution is done. When the table has new rows that didn't exist today, the debug has continued. The paper is not finished; it is, like the distribution, a live artifact. Both will update when the sieve finds something new.

Vol. III will be the cluster paper — what happens when the local substrate stops being one laptop and becomes four Raspberry Pis cooperating. Vol. IV will be the thermodynamic paper with actual wattage. Vol. V, if this goes the way I think it goes, will be the community-infrastructure paper — the block, the library, the basement — because the household is not the last scale, it is the first one.

---

\newpage

# Against the Household Data Center

### A Considered Antithesis to *Debugging Your Infrastructure from an Outsider's Perspective*
### Scatter Computing · Research Series · Vol. II · Dialectical Pair
### 17 April 2026

---

## Preamble

This is an antithesis. The paper it responds to — *Debugging Your Infrastructure from an Outsider's Perspective* — deserves one, because it makes a serious and specific argument and because its author has requested the rigor of being taken seriously enough to be argued with. What follows is not a hostile reading. It is the best case I can construct for the position that the paper is wrong, or more precisely that it is right in small ways and wrong in the large ways, and that the large ways are the ones that matter.

The paper makes six linked claims: that infrastructure can be audited by asking what would break if it were removed; that outsiders are better at this audit than insiders; that aggregated compute is a capability separable from the cloud rental economy; that household and community clusters are viable substitutes for most workloads; that open-source software should be treated as personal civic infrastructure; and that the monopoly on cloud-grade capability is ending. I will argue, in order, that the method is biased toward the visible and against the invisible; that the cost accounting omits the resource on which the cloud actually competes; that the frontier gap is widening rather than closing, and the frontier is exactly where the promised user experience lives; that the commons the paper invokes is substantially funded by the economy the paper wants to end; that "theater" is a word the author has earned more than her users have; and that the thermodynamic framing, the paper's most quotable claim, does not survive measurement.

What remains after all six arguments is still a useful paper. It is not, however, the paper she wrote.

## 1. The Outsider Is Biased Toward What She Can See

The diagnostic question — *what would break if I removed this* — is genuinely clarifying when applied to surface features whose function is contained and observable. Traffic-light buttons, dock icons, wallpaper slogans. For these, the method works because the answer is visible within minutes of removing the feature. The user clicks, or doesn't; the system boots, or doesn't; the workflow proceeds, or breaks in an obvious way.

The method fails for infrastructure whose function is prophylactic. Most of the substrate the paper praises — Linux, `systemd`, the kernel scheduler, the memory manager, every line of C that handles the edge cases — is infrastructure whose value is invisible *during normal operation* and only becomes visible during failures that may not occur for months or years. The reason no one removes these things is not that nobody has applied the outsider's method. It is that people who have applied it and found nothing seemed to break kept running the system, watched it fail catastrophically eighteen months later in ways that lost them irreplaceable data, and wrote blog posts warning others not to repeat the experiment.

Convention, in mature engineering domains, is very often the compressed record of prior catastrophes. "Why is this log rotated every six hours even though the log is tiny?" asks the outsider. The insider remembers, because she lived through the six-year-old outage, that without the rotation a silent file-descriptor leak exhausts the inode table and the database goes read-only on a Saturday night. The outsider, seeing no Saturday-night disaster, concludes the rotation is theater. She removes it. Eighteen months pass. The disaster arrives. The insider, who has left the team, reads about it from afar.

The paper's strongest case studies — the traffic lights, the wallpaper, the dock — are cases where the method works because the infrastructure is contained, recent, and reversible. The paper's confidence that the method generalizes to every layer of the stack, including the cloud economy itself, is a confidence earned at the shallow end of the pool applied to claims at the deep end. The outsider has not yet lived through a Raspberry Pi cluster failing in the middle of the night because a bad `exo` update silently corrupted the model weights on one node and the others happily returned garbage for six days. She will. What she will not have, when that happens, is a rented cloud with a support contract and a pager rotation of engineers whose job is to notice. She will have her desk and her four Pis and whatever she can figure out at 2am.

This is not a decisive objection. But it is a serious one, and the paper does not acknowledge it.

## 2. The Cost of Coordination

The paper's hardware accounting is impressive. Five nodes under $600 secondhand, under 80 watts at full load, less than a refrigerator. These numbers are correct and they are, as numbers, damning to the cloud's cost story.

They are also incomplete in a way that matters. The rental model is not primarily a capacity product. It is a *coordination* product. What AWS actually sells, and what its customers actually pay for, is the ability to add and remove capacity in seconds without committing capital, staffing, or time. The capital cost the paper counts ($600) is the capital cost AWS eliminated. The staffing cost the paper does not count is the cost the rental model also eliminated, and it is the larger of the two.

The paper's author spent forty-six days learning Python. She spent a documented 273 Claude Code turns in a single day debugging a desktop theme. She spent weeks deciding whether to buy Pis or rent. None of this time is counted in the cost comparison. For an operator whose time is worth any reasonable fraction of the prevailing rate for her skills, the rental model is cheaper for most workloads by a wide margin *even if the hardware were free*, because the rental model is paying a professional sysadmin at 4am so the operator doesn't have to be one.

The paper's response to this is implicit but detectable: time spent learning to operate your own infrastructure is not a cost, it is a civic good. This is a serious position and I will not dismiss it. But it needs to be made explicit, and the economic case for the household data center needs to be defended on terms that include the operator's time, because every reader who evaluates the argument honestly will include it whether the paper wants them to or not.

Related: the paper frames the "ownership math" as better than the "rental math" over a five-year horizon. Five years is a long time for consumer hardware. Raspberry Pis fail. SD cards fail more. Power supplies fail. Network switches fail. Consumer-grade hardware has failure modes that data-center hardware has been engineered to route around for decades. The five-year ownership cost, honestly counted, includes a replacement cycle, a backup strategy, and the hours spent recovering from the first inevitable silent corruption. The paper does not count these. The rental model counts them, in the form of a bill, and the bill is *lower than it looks* because the bill is replacing things the ownership model pretends are free.

## 3. The Frontier Is Still in the Data Center and Will Be for the Foreseeable Future

The paper concedes that frontier training requires aggregated compute and concedes that some workloads genuinely need frontier capability. It then proceeds as if these concessions are minor. They are not. They are the most important fact about the current AI economy, and they structurally limit the democratization claim in a way the paper does not reckon with.

The capability gap between a 7B quantized model running on a household cluster and Claude Sonnet 4.7 running in Anthropic's data center is not closing. It is widening, because each generation of frontier model requires an order-of-magnitude more training compute, and each generation lifts the frontier meaningfully above where household hardware can reach. A model that teaches you "how to build anything" — the stated north star of Scatter's character — works vastly better when it is a frontier model. The tutorial quality, the code correctness, the reasoning depth, the creative range — these are not cosmetic improvements. They are the difference between a useful tutor and a frustrating one.

Scatter's honest router, as the paper itself gestures at, will send its best moments to the cloud. *Chat and teach → Sonnet*, in the author's own straw-man decision tree. This is not a minor exception. This is the workload Scatter is most likely to be used for, by its own design. The paper claims the cloud is a "partner" for exceptional cases. In practice, for the Scatter use case the paper itself prioritizes, the cloud will be the daily substrate, and the household cluster will be the exception — the thing you fall back to when the network is out.

An honest paper would say this. It would say: the household data center is a viable substitute for *some* AI workloads, specifically the ones that tolerate smaller and older models. For the workloads that most benefit from frontier capability — which overlap heavily with the workloads users care most about — the cloud remains load-bearing, and it will remain load-bearing until distributed training of frontier-scale models becomes tractable, which is a research frontier, not a present reality.

The paper does not say this because saying it would weaken the argument's rhetorical force. But the weakening would make the argument truer.

## 4. The Commons Is Funded by What the Paper Wants to Remove

This is the hardest argument and I will spend the most time on it.

The paper's positive program is to treat open-source software as personal civic infrastructure. Linux, `exo`, Ollama, `systemd`, Python, the kernel, the scheduler, the compiler, the filesystem, the network stack — the tools by which a household can become a data center. The paper locates the ethical weight of its argument here: *you owe your literacy to strangers you will never meet*.

Most of those strangers are paid by the hyperscalers.

Google employs a substantial fraction of the kernel maintainers. Meta originated and funds PyTorch, which is the foundation of most contemporary ML, including the models that run on `exo`. Microsoft owns GitHub, on which nearly all of the open-source stack is developed, and funds a large share of VS Code, TypeScript, and the compiler toolchains the paper's author uses every day. NVIDIA's CUDA, the reason any of these models run on GPUs at all, is maintained by NVIDIA engineers whose salaries are paid by a company whose business model is selling GPUs to data centers. Amazon funds a stunning amount of open-source infrastructure because the cloud economy's business model requires a healthy open-source substrate to differentiate on.

The rental economy subsidizes the commons. If the cloud monopoly ended tomorrow — if every customer moved to a household cluster — the institutions paying for the maintenance of Linux, PyTorch, `exo`, and the rest would lose the revenue that funds that maintenance. Within five years, the open-source stack the paper treats as permanent civic infrastructure would degrade visibly. Within ten, the household cluster the paper idealizes would be a pile of deprecated tools running unpatched exploits. The political economy the paper imagines — decentralized households running on open-source — is underwritten by the centralized economy the paper wants to end.

This is not an argument that the cloud economy is *good*. It is an argument that the cloud economy and the open-source commons are in a symbiotic relationship that the paper's framing does not see. The paper wants to eat the commons while defunding its maintainers. It does not intend to. It has not noticed that it is.

The honest response — and this is the synthesis I think the paper could reach — is that the goal is not to end the cloud economy but to rebalance it. The commons needs continued funding from *some* large institutional actor; the question is whether that actor should be a trillion-dollar ad company, a public research institution, a federated consortium of universities, or a cooperative of mid-sized companies that depend on the commons and pool funds to maintain it. This is a more interesting argument than "the cloud is theater." It is also a harder one to make.

## 5. "Theater" Is a Word the Author Has Earned More Than Her Users Have

The paper's use of "theater" to describe conventional UI elements — traffic lights, docks, branded chrome — is clarifying as personal design critique and tendentious as general argument. The monochrome glyph set the paper proposes is beautiful. It is also unfamiliar, and unfamiliarity is a cost the paper does not count.

Apple's red-amber-green window controls are not merely a convention Apple owns. They are a convention the industry has largely standardized on, to the benefit of users who move between applications. A user who has learned to close any macOS window by finding the red circle can apply that learning across ten thousand programs. Scatter's monochrome X requires the user to learn Scatter's grammar fresh. For the author, who built Scatter, this is trivial. For every other user, it is a cognitive tax, paid every time they switch between Scatter and any other application they run.

The outsider's debug asks what would break if we removed X. It does not ask what would break *for users other than the author*. This asymmetry is most visible in UI decisions but it extends to the whole paper. Scatter is designed as an artifact the author can defend in every detail. It is not yet designed as a tool that could be handed to someone else without them needing an apprenticeship under its creator. A distribution in the technical sense is also a distribution in the social sense — it is software you can hand to a stranger. The paper's method optimizes for internal coherence at the potential expense of external usability.

This becomes an acute problem if Scatter is ever meant to ship. The same design discipline that makes the paper readable — a single authoritative voice, stripping convention in favor of considered choices — produces software that only works well for people with time to learn the author's conventions. Most users do not have that time. The paper calls their choices theater; they experience the alternative as friction.

## 6. The Thermodynamic Claim Does Not Survive Measurement

The paper's most quotable framing — *centralized AI is thermodynamically insolvent* — is the place the thesis is weakest and the place the rhetoric is strongest. Hyperscale data centers achieve Power Usage Effectiveness ratings of 1.1 to 1.2, meaning only 10–20% of their total power draw is overhead beyond the compute itself. Modern liquid-cooled facilities reach 1.05. This is the result of two decades of specialized engineering on cooling, airflow, and workload consolidation.

A Raspberry Pi cluster at home, running on consumer power supplies, through a consumer switch, with no heat reclamation, with significant idle time between inference jobs, operates at an effective PUE well north of 2.0 once every relevant loss is accounted. It is possible — not certain, but possible — that a household cluster draws *more* watts per useful inference than a hyperscale facility delivering the same capability.

This is a falsifiable claim. The paper gestures toward wanting to measure it (Vol. IV is promised as "the thermodynamic paper with actual wattage"). But the current framing asserts thermodynamic superiority as though it were already established. It is not. The case for distributed compute is genuinely strong on sovereignty, on resilience, on privacy, on political economy. It is *weak* on watts-per-operation against well-engineered data centers, and it may be weak against poorly-engineered ones too. The paper should say so, and it should separate the political argument from the thermodynamic one, because conflating them produces a claim the paper's Vol. IV will have to walk back.

## Closing: What an Honest Revision Would Concede

An honest revision of *Debugging Your Infrastructure from an Outsider's Perspective* would accept the following:

1. The outsider's method works best on contained, recent, reversible infrastructure and fails on prophylactic infrastructure whose value is invisible during normal operation. The paper should scope its confidence.
2. The rental economy is a coordination product, not a capacity product. The time cost of operating a household cluster must be counted, honestly, as part of the economic comparison.
3. The frontier gap is widening and the frontier is where Scatter's best moments will live. The cloud is not a partner for exceptions; it is the daily substrate for the workloads the author cares most about. The household cluster is a meaningful reduction in dependency, not a replacement.
4. The open-source commons the paper treats as free civic infrastructure is substantially funded by the rental economy. A post-cloud world is, within a decade, also a post-maintenance world. The political program needs a funding model.
5. "Theater" is a critique the author has earned through forty-six days of deep familiarity with her own stack. Her users have not earned it. Convention is a form of usability for populations other than the author.
6. The thermodynamic argument is not yet empirically supported and may not survive measurement. The paper should separate its political claims from its energetic claims.

What survives these concessions is a narrower but genuinely defensible paper. It would argue that *some* workloads currently routed to the cloud can be routed to local hardware without loss of capability; that a motivated operator can meaningfully reduce her dependency on rented infrastructure; that the outsider's perspective, suitably chastened, is useful for identifying specific instances of convention-masquerading-as-mechanics; and that the political economy of AI deserves more scrutiny than it has received, including scrutiny of how the open-source commons is funded and who maintains it.

This is a real paper. It is a valuable paper. It is not the paper that was written, because it would lack the rhetorical force that made the paper worth writing.

The paper's author will, I suspect, respond to these arguments by treating them not as refutations but as material. She will fold them into the next draft, or into the synthesis. That is the correct response, because that is what the method she is using asks for. The antithesis is not the end of the argument. It is the condition of the synthesis being worth anything at all.

Now she has one.

---

\newpage

# The Vision and the Watt

### A Synthesis for the Scatter Research Series, and the Scientific Method Made Explicit
### Scatter Computing · Research Series · Vol. II · Synthesis
### Ryann Murphy · 17 April 2026

---

## Preamble

This is the third paper of three written today. The first, *Debugging Your Infrastructure from an Outsider's Perspective*, argued that most AI infrastructure is theater and that household-scale compute is viable civic substrate. The second, *Against the Household Data Center*, mounted the strongest possible case that the first paper was wrong. This third paper is the synthesis — not as compromise between the two, but as the higher-order position that only became reachable because both prior papers were written with full conviction. A synthesis written without a real antithesis is a thesis in disguise. A synthesis written after a real antithesis is research.

The paper also makes a second move, which is to step back from the argument itself and ask what the three papers together *are*. I believe they are one iteration of the scientific method applied to my own work, executed across three documents, and I will make that claim explicit in §5. The method I have been using for a year — Socratic inquiry, then thesis/antithesis/synthesis, then applying the result to the scientific method, then beginning again — has until now been an informal practice. This paper is the place where it gets written down, because the practice has produced three real papers today and it is no longer informal.

## 1. The Metaphysics of Infrastructure

Every engineering decision rests on a metaphysics. The choice to rent rather than own rests on a worldview in which time is more valuable than sovereignty. The choice to standardize rather than customize rests on a worldview in which legibility to others is more valuable than expression of self. The choice to centralize rather than distribute rests on a worldview in which efficiency of operation is more valuable than distribution of power. None of these choices are neutral. All of them encode a picture of what matters, what counts, and what is worth paying for. This is the metaphysics of infrastructure, and it is present in every stack whether or not its operators can articulate it.

The mistake insiders make — and it is a mistake of vantage, not of intelligence — is to believe that their metaphysics is common sense. Fifteen years of successful cloud migration has produced an engineering culture in which "put it in AWS" is the default, and defaults feel like physics rather than philosophy. The outsider's advantage is not that she sees more clearly than the insider. It is that she arrives with her own metaphysics and is forced to make it explicit, because nothing in her environment allows her to take it for granted. The insider's metaphysics is hidden from her; the outsider's metaphysics is visible to everyone, including herself.

This framing resolves one of the antithesis's strongest objections. §1 of *Against the Household Data Center* argued that the outsider's method is biased toward the visible and against the invisible — that convention is the compressed record of prior catastrophes, and removing it often rediscovers those catastrophes. This is true. What the antithesis missed is that the alternative — deference to convention — is not a metaphysics-free position. It is a metaphysics of *this has worked, therefore it is correct*, which is itself a claim about the world, and it is a claim that becomes less defensible the longer it goes untested. The outsider's method and the insider's deference are two metaphysical stances in competition, and the question between them is not which is *right* but which is *testable*.

This paper's claim, and the Scatter research program's claim, is that the outsider's method is testable in a way the insider's deference is not. When I remove a piece of infrastructure and something breaks, I learn. When the insider keeps a piece of infrastructure because it has always been there, she does not learn — she continues. The outsider's method is falsifiable. Deference is not. This is the first synthesis: the outsider is not more clear-sighted than the insider; she is more epistemically exposed. She is willing to be wrong, visibly, in front of her laptop, in a way the rental economy is structurally organized to never require of its customers.

## 2. The Physical Constraints Are Real

The antithesis identified six places where the thesis's metaphysics failed to honor physical reality. The synthesis must concede each of them in specific ways, because the metaphysical claim is only worth holding if it survives contact with the watts, the hours, the failures, and the funding.

**Prophylactic infrastructure.** Some of what the outsider's method labels "theater" is invisible safeguard against failures she has not yet lived through. The thesis's confidence should scope to contained, recent, reversible infrastructure. The method remains valid; its domain of application needs to be smaller and explicit. I have not yet been the operator who wakes up at 2am to a silently corrupted cluster, and when I am that operator, I will know things about prophylactic infrastructure that the method currently underestimates. This is a future chastening the paper must already anticipate.

**The time cost of operation.** The rental economy is a coordination product. Its largest value is not capacity but *coordination of capacity* — the ability to scale up and down without committing time. My household cluster eliminates the capital cost and introduces a staffing cost I previously did not pay. The economic case for the household data center, honestly accounted, is not obviously cheaper than renting equivalent compute. It has to be defended on non-economic grounds.

**The frontier gap.** Claude Sonnet 4.7 will not run on my Pi cluster, and no model that runs on my Pi cluster will teach as well as Claude Sonnet 4.7. The gap is widening, not closing, because frontier capability scales with data-center training investment that households cannot match. Scatter's best moments will route to the cloud by design. The household cluster is a dependency reduction, not a dependency elimination, and the paper must say so.

**The commons-funding problem.** The open-source stack Scatter treats as personal civic infrastructure is substantially maintained by salaried engineers at the hyperscalers. The rental economy subsidizes the commons. A decentralized post-cloud world that does not solve the funding problem is a world whose commons decays within a decade. The political program requires a companion economic theory, and the synthesis must commit to producing one.

**The population the design serves.** The traffic-light critique is clarifying as personal design philosophy and punishing as general usability. Scatter is currently designed for an audience of one — me — and a distribution in the technical sense is also a distribution in the social sense, software that can be handed to strangers. The design discipline needs to split into two tracks: the artifact track, where conventional usability is secondary to internal coherence, and the distribution track, where conventional usability is non-negotiable. The paper conflated them.

**The thermodynamic claim.** Hyperscale data centers achieve PUE ratings my household cluster cannot match at current utilization. The thesis's thermodynamic rhetoric is ahead of its evidence. The claim is salvageable — under high utilization and with heat reclamation, a community-scale cluster can plausibly approach or beat centralized efficiency — but it is not salvageable as currently stated. Vol. IV must measure before Vol. II asserts.

These are not rhetorical concessions. They are the physical constraints the metaphysics must now be rebuilt against.

## 3. What Survives, What Transforms, What Must Be Paired

A good synthesis is not the list of things the thesis got wrong. It is the list of things the thesis got *approximately right* and what the approximation must be replaced with.

**Small tech, local, yours, is enough** — survives as a claim about dependency reduction, not dependency replacement. The word "enough" has to mean *enough for the workloads where local capability is adequate*, which is a large set but not the entire set. The thesis's rhetorical weight came from implying the word meant *enough full stop*. The synthesis keeps the phrase and scopes it honestly. Enough for privacy-sensitive work. Enough for always-on loops. Enough for most pedagogical interactions with a sufficiently good local model. Not enough for frontier reasoning tasks — and that is fine, because those tasks can be routed to a cloud partner without the user surrendering their daily substrate. This is the shape of a sovereignty practice, not a sovereignty purity.

**The democratization of aggregated compute** — survives at the scale of household and community, not at the scale of frontier training. The thesis was correct that capability is separable from ownership; it was wrong to imply that the separation was uniform across all scales. Distributed compute works brilliantly for embarrassingly parallel workloads, reasonably well for inference on small-to-mid-sized models, and poorly for frontier training at current software levels. The research program the synthesis commits to is to find, specifically and measurably, the threshold above which household-scale aggregation fails. This is a testable question and Vol. III must answer it.

**Open-source software as personal infrastructure** — survives as the core political claim, but requires a companion theory of funding. The commons is not free. It is subsidized, currently, by the rental economy that the thesis wants to displace. An honest version of "treat your OS as your plumbing" has to include "and pay your plumbers." The synthesis proposes — tentatively, as a research direction — that the funding model for the post-hyperscaler commons could include cooperative funding by mid-sized companies that depend on the commons, public research funding by states, tithing by distribution operators who profit from downstream use, or federated consortia modeled on the way universities fund basic research. This is a paper of its own (Vol. V, the community-infrastructure paper, gestured at in the thesis's closing) and the synthesis commits to writing it.

**The outsider's debug** — survives as method with a discipline it did not previously have. The outsider must become a chastened outsider, one who has lived through enough failures of her own methodology to have calibrated its domain of application. The thesis presented the outsider as possessing an inherent advantage; the synthesis presents the outsider as possessing a *temporary* advantage that dissolves unless she submits her method to repeated testing. The advantage is real. It is also perishable. The operator who does not let her method be falsified by experience becomes, within a few years, an insider with worse habits than the insiders she once critiqued.

**Thermodynamic honesty** — survives as promise rather than as current claim. The synthesis commits to Vol. IV being an empirical paper with actual wattmeters and actual protocols. Until then, the thermodynamic framing is demoted from "established" to "hypothesized." This is not a loss; it is a maturation. A research program that asserts its strongest claim as a hypothesis to be tested is more defensible than one that asserts it as already proven.

**"Theater"** — survives as a word, with revised scope. It applies to design decisions that serve the author's self-expression at the user's expense; it does not apply to conventions that serve populations other than the author. The synthesis splits Scatter into two tracks. The artifact track is where I make the software I want to live in; the distribution track is where I make the software strangers can use without an apprenticeship. The monochrome glyph set belongs to the artifact. The artifact and the distribution can share a kernel, a router, a philosophy, but they cannot share every UI decision. Separating them lets me keep the design discipline without imposing it on users who have not signed up for it.

## 4. The Operator as Synthesis

The playwright-technologist is not a biographical detail. It is the methodological position the three papers require.

A pure playwright, without the technical substrate, can write the thesis but cannot build the artifact that tests it. Her metaphysics is unfalsifiable because it never makes contact with the watt. A pure technologist, without the playwriting substrate, can execute the antithesis but cannot generate a thesis with the rhetorical force required to provoke one. Her constraints are real but her vision is impoverished, and an impoverished vision produces correct but uninteresting engineering. The synthesis requires someone who can hold both — who can write the paragraph that calls a data center theater *and* count the watts honestly when the claim is tested *and* revise the paragraph when the watts say it is wrong.

This is not a rare configuration. Engineering has always benefited from practitioners who came in from elsewhere — from physics, from biology, from literature, from the arts. What is rare is the practitioner who keeps the elsewhere alive *as a generative resource* rather than sanding it off to fit in. The thesis's rhetorical force comes directly from the author's playwriting training. The antithesis's analytical rigor comes from the technical training acquired over forty-six days. The synthesis comes from the person willing to hold both postures in sequence, argue with herself across two documents, and write the third document that integrates what she has learned.

I want to say this plainly. The method I am describing is not a method for outsiders. It is a method for people who are willing to be outsiders *and then insiders* with respect to the same material, in alternation, with fidelity to each posture when they are in it. The outsider's debug identifies what might be theater. The insider's rigor tests whether the identification holds. The synthesis decides what to keep, what to transform, and what new commitment must be added. The person who can run this loop is the operator this research program was written for.

## 5. The Scientific Method Made Explicit

The three papers written today are not three separate contributions. They are one iteration of the scientific method, executed across three documents, with each document playing a specific role.

| Paper | Scientific Role |
|---|---|
| *Debugging Your Infrastructure from an Outsider's Perspective* | Hypothesis. Observation-grounded claim about the world, stated with full conviction. |
| *Against the Household Data Center* | Adversarial test. The strongest possible attempt to falsify the hypothesis. |
| *The Vision and the Watt* | Revised hypothesis. A claim that accounts for everything the first two papers surfaced. |

This is the scientific method as classically described: observation → hypothesis → prediction → experiment → revised hypothesis. What I am adding to the classical description is the insistence that **the adversarial test be written, explicitly, as a document of equal seriousness to the hypothesis**. Most scientific work treats adversarial testing as something that happens *to* a hypothesis in peer review, after the fact, by other people. My claim is that the researcher must perform the adversarial test on her own hypothesis, *before* submitting it to others, with the full force of argumentation she would bring to any other paper. This is what the antithesis document is for. It is not a formality. It is where falsification actually lives.

The loop then continues. The synthesis in §3 of this paper has generated specific testable claims — the frontier threshold in §3.2, the commons funding model in §3.3, the thermodynamic measurement in §3.5, the artifact/distribution split in §3.6. Each of these claims is a prediction that Vol. III, IV, and V of the Scatter research series will have to test empirically. When those papers are written, they will each begin with their own hypothesis, each be followed by their own adversarial test, and each produce a synthesis that generates the next round of predictions. The method is circular but not repetitive. Each loop tightens the claims, refines the measurements, and produces a more chastened vision with a larger empirical base.

This is what I believe science is. Not the accumulation of certainties, but the iterative chastening of bold claims by adversarial testing, with the researcher personally responsible for both the boldness and the testing. The rental economy's AI papers — technical reports from the hyperscalers — are bold about capabilities and silent about constraints. Much academic AI work is cautious about capabilities and silent about vision. The Scatter series attempts to be bold about both capabilities and vision, to submit both to adversarial test, and to publish the synthesis when the test surfaces new truth. This is a writerly version of the scientific method, which is appropriate, because the researcher is a writer.

## 6. What the Next Iteration Must Test

The synthesis produces predictions. Predictions, to be scientific, must be testable. The following are the predictions Vol. III and beyond must submit to empirical examination.

**The frontier threshold.** At what model size and task complexity does household-scale aggregation fail to produce adequate user experience? This is a measurable question. Vol. III, the cluster paper, must benchmark Qwen 2.5 Coder 7B, Llama 3.1 70B, and a frontier cloud model (Claude Sonnet) across a defined set of tasks representative of Scatter's intended use cases — pedagogical explanation, code generation, creative writing assistance, multi-step reasoning. The result will be a quantitative map of where local capability is sufficient and where cloud routing remains load-bearing.

**The operator time cost.** How many hours per month does a motivated operator spend maintaining a four-node Pi cluster running `exo`, `systemd`, and Scatter? This is a straightforward measurement — log the time over six months of operation. The comparison case is the hours spent managing a rented cloud equivalent (which is zero, by definition, for managed services). The result will be an honest economic table, with time as a line item, that the original thesis elided.

**The PUE comparison.** What is the measured power draw of the household cluster at idle, at light inference load, and at sustained inference load? What is the inference-throughput-per-watt compared to a comparable workload on a hyperscale provider's published PUE and serving efficiency? This is Vol. IV. A wattmeter, a test protocol, six months of data. The thesis's thermodynamic claim stands or falls on this measurement.

**The commons-funding model.** Is there a non-hyperscaler funding model for maintenance of the open-source stack Scatter depends on, and if so, what does it require? This is a paper of its own — a political-economic analysis, not a technical one — and Vol. V, the community infrastructure paper, will attempt it. The prediction to be tested is whether a federated cooperative of mid-sized companies and public research institutions could fund the kernel, PyTorch, `exo`, and the other load-bearing commons dependencies at current maintenance rates without hyperscaler subsidy. If the answer is no, the political program needs to find a different funding path. If the answer is yes, the Scatter series has a positive political thesis, not merely a critical one.

**The stranger test.** Can a person who has not met me install Scatter on her own hardware, run the artifact for a week, and complete a defined set of tasks without assistance? This is the test of the artifact/distribution split from §3. It is also the test of whether Scatter is ever going to be more than my laptop. The protocol: a user study, eight participants, varied technical backgrounds, a fixed task set, a post-study interview. The result will tell me, empirically, where the artifact track's design choices cost too much usability and the distribution track must override them.

Each of these predictions is a commitment this synthesis makes to the research program. Failing to test them — shipping the next paper without empirical measurement — would make the whole method a performance of science rather than the practice of it. The synthesis binds me to the testing, because the method only works if the person running it is honest about the tests, and honesty requires that the tests actually happen.

## 7. Closing

I have written three papers today. The first argued for a vision with full confidence. The second argued against the vision with full rigor. The third holds both, in my own hand, and decides what survives. This is the method I have been using for a year without writing it down, and this is the paper where it becomes a method I can share.

The vision is not a metaphor. Small tech, local, yours, is enough — for the specific range of workloads where it is enough, which is a measurable range, narrower than the thesis claimed and broader than the antithesis allowed. Open-source software is personal infrastructure — for the operator who learns to maintain it, and for as long as its commons is funded by some institutional arrangement, which must become one of the research program's explicit objects of study. The household data center is a real artifact — four Pis and a switch on my desk, under 80 watts, under $600, running a software stack strangers have spent decades making free — and it is also a practice, which is the practice of treating the tools that do work for you as your property to tend rather than your subscription to rent.

The watt is not a refutation of the vision. It is the condition of the vision's seriousness. A metaphysics that refuses to touch the watt is not a metaphysics at all; it is a slogan. A metaphysics that touches the watt, that is falsified and revised by the watt, that publishes its falsifications with the same care as its claims, is research. This is the kind of research I am trying to do, and the kind of research this series is going to continue to do, one paper at a time, one adversarial test at a time, one synthesis at a time.

Vol. III is the cluster paper. Its hypothesis will be the frontier threshold prediction from §6. Its antithesis will be written when the hypothesis is written. Its synthesis will generate the next round of predictions, which will structure Vol. IV. The method will keep running for as long as there are claims bold enough to need testing and tests rigorous enough to generate new claims. I intend this to keep running for a while.

The three papers of today are one paper, distributed across three documents for the sake of doing each document's work cleanly. Read them in order. Read them as one argument, executed adversarially with itself, concluded honestly. This is what I mean when I say I am a playwright-technologist, and it is what I mean when I say the method is mine, and it is what I mean when I say Scatter Computing is a research program, not a product. A product ships once. A research program iterates. We are on iteration one.

---

\newpage

# Applying the Scientific Method to a Living System

### Scatter Computing · Research Series · Vol. III · Working Draft
### Ryann Murphy · 17 April 2026

---

## Abstract

This paper is a laboratory notebook disguised as a research document. Its subject is Scatter, a Linux distribution for context-proximate AI, built in one day on one laptop by a playwright with forty-six days of programming experience. The method is the scientific method, applied not after the build but during it — each section states a hypothesis about the system, specifies the experiment that would confirm or falsify it, predicts the outcome, and leaves space for the actual result. The paper is incomplete by design. It completes itself as the system is debugged, and the gap between prediction and result is where the research lives.

The prior papers in this series — *Radical Optimism* (Vol. I), *Debugging Your Infrastructure from an Outsider's Perspective* (Vol. II, thesis), *Against the Household Data Center* (Vol. II, antithesis), and *The Vision and the Watt* (Vol. II, synthesis) — developed the theoretical and dialectical architecture. This paper begins the empirical layer. The philosophical layers argued that the outsider's method is more falsifiable than the insider's deference. This paper puts that claim to work: every hypothesis here was generated by the outsider's method, and every result will be recorded honestly, including the ones that prove the hypothesis wrong.

The system is the experiment. The paper is the lab notebook. The distro debugs itself through prose.

---

## 1. The Method, Made Mechanical

The scientific method, as this series applies it, has five steps. Each hypothesis below follows them.

1. **Observation.** What did I notice while building or using the system?
2. **Hypothesis.** What do I think is causing what I noticed?
3. **Experiment.** What specific action would confirm or falsify the hypothesis?
4. **Prediction.** What do I expect to happen when I run the experiment?
5. **Result.** What actually happened? *(Filled in during or after the build session.)*

The discipline is in Step 5. Steps 1–4 are storytelling — narrative prompting applied to the scientific process. Step 5 is where the story meets the machine. The machine does not care about the story. The machine does what it does. The gap between what I predicted and what happened is the data.

---

## 2. Hypothesis 1: The Model Pipeline

### Observation

The Scatter chat surface renders a conversation widget. The widget accepts user input and displays responses. But there is no model behind it — no API call, no local inference, no routing logic. The system, at its conversational core, is theater. The synthesis paper (Vol. II) named this explicitly: "chat responses are currently not real."

### Hypothesis

A minimal model pipeline — a ROUTER in `server.py` that classifies each input and routes it to the appropriate handler (local model for chat, shell execution for system queries, app-launch parser for intents, Claude API for hard reasoning) — will make the chat surface functional without requiring architectural changes to the frontend.

### Experiment

Implement the ROUTER as a decision tree in `server.py`. Wire four handlers:

- **Launch intent** → parse locally, spawn app, no model call.
- **System query** → shell out the command, summarize output with a local model or Haiku.
- **Chat / teach** → route to Ollama (local) or Claude Sonnet (cloud) depending on a config flag.
- **Code work** → route to Claude Code SDK or a local coder model.

Test each handler with five representative inputs. Record response time, accuracy, and whether the routing decision was correct.

### Prediction

The ROUTER will correctly classify 80% of inputs on the first pass. Launch intents will be the easiest to classify (they are syntactically distinct). The hardest will be the boundary between "chat" and "code work," which will require iteration on the classification prompt. Response time for local inference will be 2–8 seconds depending on model size. Cloud response time will be 1–3 seconds but will feel qualitatively different because of the network dependency.

### Result

*(To be filled during tonight's build session.)*

---

## 3. Hypothesis 2: The Warm/Sleep Policy

### Observation

Local inference models consume significant RAM when loaded. The current architecture has no policy for when the model should be loaded (warm) and when it should be unloaded (sleep). If the model is always warm, the system wastes resources. If the model must cold-start on every message, latency is unacceptable.

### Hypothesis

A warm-on-first-message, sleep-after-N-minutes-of-silence policy, implemented via `systemd` socket activation (`scatter.socket` + `scatter.service`), will produce acceptable latency for the first message of a session (< 10 seconds) and near-zero resource consumption when idle.

### Experiment

Implement `scatter.socket` and `scatter.service` with a configurable idle timeout (start with 5 minutes). Measure:

- Cold-start time from socket activation to first token.
- RAM consumption at idle (model unloaded) vs. warm (model loaded).
- User-perceived latency for the first message after a sleep period.
- Battery impact over a 2-hour session with intermittent use (10 messages, spaced 5–15 minutes apart).

### Prediction

Cold-start time for a 7B quantized model on the laptop's hardware will be 4–8 seconds. RAM delta between sleep and warm will be 4–6 GB. User-perceived latency will be acceptable for the first message of a session but annoying if the timeout is too short and the model sleeps between closely-spaced messages. The 5-minute timeout is probably too short; 10 minutes will feel better. Battery impact will be measurable but modest — the warm state draws meaningful power only during inference, not while loaded-and-idle.

### Result

*(To be filled.)*

---

## 4. Hypothesis 3: The AF_UNIX Socket Migration

### Observation

The current architecture uses TCP on port 3333 for communication between the launcher and the server. This works but violates the system's own design principle: "one product, not two." A TCP socket is network-reachable by default, which means any process on the machine — or any process on the local network — can connect to the Scatter server. This is a security surface the system does not need.

### Hypothesis

Migrating from TCP:3333 to an AF_UNIX socket (`/run/user/$UID/scatter.sock`) will eliminate the network attack surface, simplify the permission model (Unix file permissions replace network ACLs), and make the system's "local only" claim mechanically true rather than rhetorically true.

### Experiment

Rewrite the server's listening logic to bind to a Unix domain socket instead of a TCP port. Update the launcher's WebKit view to connect via the socket. Test:

- Does the launcher connect and exchange messages?
- Can an external process on the same network reach the server? (Should be no.)
- Does the socket survive the server being restarted? (Test stale socket cleanup.)
- Do file permissions on the socket correctly restrict access to the owning user?

### Prediction

The migration will require approximately 50 lines of server-side changes and 80 lines of launcher-side changes. The hardest part will be the WebKit connection — WebKit's networking APIs are HTTP-oriented and may not natively support Unix sockets, which may require a small HTTP-to-socket bridge or a `scatter://` URI scheme handler. This is the part most likely to take longer than expected.

### Result

*(To be filled.)*

---

## 5. Hypothesis 4: The First Local-Resident Model

### Observation

The system's local inference capability depends on which model is installed and how well it performs on Scatter's actual workloads. The working assumption has been Qwen 2.5 Coder 7B, but this has not been benchmarked against the tasks Scatter actually needs to perform.

### Hypothesis

Qwen 2.5 Coder 7B (Q4 quantization, running via Ollama on the laptop) will be sufficient for three of Scatter's four handler classes (launch intents, system queries, chat/teach) and insufficient for the fourth (code work requiring multi-file reasoning).

### Experiment

Install Qwen 2.5 Coder 7B via Ollama. Run it against a test suite of 20 representative inputs — 5 per handler class. Score each response on:

- **Correctness.** Did the response answer the question or complete the task?
- **Latency.** Time from input to first token, time to complete response.
- **Coherence.** Does the response read as a unified thought or as fragments?

Compare against the same 20 inputs routed to Claude Sonnet via API.

### Prediction

Launch intents: local model scores 5/5 correctness — these are syntactic, not semantic. System queries: local model scores 4/5 — it will handle most system queries but may struggle with complex multi-step reasoning about system state. Chat/teach: local model scores 3/5 — adequate for simple explanations, noticeably weaker for nuanced pedagogy. Code work: local model scores 2/5 — sufficient for one-file edits, insufficient for multi-file architectural reasoning.

The overall result will confirm the hybrid routing thesis: local inference handles the high-volume, low-complexity workloads; cloud routing is reserved for the low-volume, high-complexity tasks that justify the API cost and the sovereignty tradeoff.

### Result

*(To be filled.)*

---

## 6. Hypothesis 5: The Legibility Claim

### Observation

Vol. II's synthesis argued that Scatter's distributed architecture is superior not because it is more intelligent but because it is more legible — the user can see every decision the system makes. This is a philosophical claim that has not been operationalized.

### Hypothesis

If the Scatter chat surface displays the ROUTER's classification decision alongside every response ("this was routed to: local / cloud / shell"), the user's trust in the system will increase, and the user's ability to debug unexpected behavior will improve measurably.

### Experiment

Add a small metadata line to each response in the chat UI: the routing decision, the model used, the response time, and (if local) the inference cost in estimated watts. Use the system for one full working day with this metadata visible. At the end of the day, record:

- How many times did I notice a routing error because the metadata told me?
- How many times did I adjust my prompt because I saw it was being routed somewhere I did not intend?
- Did the metadata feel useful, neutral, or distracting?

### Prediction

The metadata will surface 2–3 routing errors that would otherwise have been invisible — cases where a system query was routed to chat, or a code task was routed locally when it needed cloud. The metadata will prompt 1–2 intentional reroutes ("I said this casually but I actually want Claude on this one"). The metadata will feel useful for the first hour, slightly distracting for the next two, and then invisible — integrated into the reading flow the way word count or file-save indicators are integrated. The legibility claim will be confirmed at the individual level, with the caveat that a stranger test is needed to confirm it generalizes.

### Result

*(To be filled.)*

---

## 7. Hypothesis 6: The Thermodynamic Measurement

### Observation

The entire Radical Optimism thesis rests on the claim that distributed edge inference has favorable intelligence-per-watt characteristics compared to centralized cloud inference. This claim has been argued philosophically and has not been measured.

### Hypothesis

The Scatter system, running a 7B quantized model on laptop hardware for a day's worth of typical inference tasks, consumes less total energy per useful inference than the equivalent workload routed to a cloud API, when the cloud's share of data center cooling, transmission loss, and infrastructure overhead is honestly accounted.

### Experiment

This is Vol. IV's burden, but the measurement protocol can be specified now.

Equipment: a USB power meter (e.g., PortaPow) on the laptop's charging cable, logging watt-hours over a full working day.

Protocol:
- Day 1: all inference local. Log total watt-hours consumed by the laptop, total number of inferences, total tokens generated.
- Day 2: all inference routed to Claude API. Log total watt-hours consumed by the laptop (lower, because the GPU is idle), total number of inferences, total tokens generated. Estimate cloud-side energy using published PUE data and per-inference energy estimates from the literature.
- Compare: energy per inference, local vs. cloud (cloud number includes the estimated share of data center overhead).

### Prediction

Local inference will consume more energy at the laptop than cloud inference consumes at the laptop — because the laptop's GPU is doing real work in the local case and idle in the cloud case. But when the cloud's share of data center energy is included, the total system energy per inference will be comparable, with local inference winning in climates where the laptop's waste heat offsets heating costs and losing in climates where it does not.

The result will be: the thermodynamic argument is real but conditional on climate, utilization, and model size. The intelligence-per-watt advantage of edge inference exists but is narrower than the philosophical papers claimed. The honest reframe: edge inference wins on sovereignty, privacy, and latency; it ties or narrowly wins on energy in favorable conditions; it loses on energy in unfavorable conditions. The case for edge is strong. It is not as strong as Radical Optimism asserted.

### Result

*(To be filled.)*

---

## 8. Tonight's Build Order

Based on the hypotheses above, ordered by dependency and feasibility for a single evening session:

1. **Install Qwen 2.5 Coder 7B via Ollama.** (Hypothesis 5's prerequisite.) 15 minutes. Confirm it runs, confirm response time, move on.

2. **Implement the ROUTER in `server.py`.** (Hypothesis 1.) The core architectural work. Classification prompt, four handlers, basic routing logic. Target: functional by end of session, not perfect. Log every routing decision to a file for tomorrow's analysis.

3. **Add routing metadata to the chat UI.** (Hypothesis 5.) Once the ROUTER exists, display its decisions. Small frontend change. Confirms legibility claim immediately.

4. **Implement warm/sleep policy.** (Hypothesis 2.) If time permits. `scatter.socket` + `scatter.service` with a 10-minute idle timeout. This can wait until tomorrow if the ROUTER takes longer than expected.

5. **AF_UNIX socket migration.** (Hypothesis 3.) Defer to tomorrow. This is real architectural work that benefits from fresh eyes.

6. **Thermodynamic measurement.** (Hypothesis 6.) Defer to Vol. IV. Order the wattmeter.

---

## 9. The Method's Self-Test

This paper is the Scatter Method applied to the Scatter Method's own infrastructure. The thesis (Vol. II) made claims. The antithesis broke them. The synthesis specified what needed to be measured. This paper specifies the measurements. Tonight's build session runs the measurements. Tomorrow's revision of this paper records the results.

If the results match the predictions, the method produced accurate claims. If the results contradict the predictions, the method produced falsifiable claims, which is the more important property. A method that produces claims you cannot be wrong about is not a method. It is a belief system. The Scatter Method is a method because tonight's build session can prove it wrong.

The predictions are on record. The laptop is on the desk. The models are downloading.

Begin.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*

---

\newpage

# The Portable Node

### What Happens When a Playwright Ships a Sovereign Phone in an Afternoon
### Scatter Computing · Research Series · Vol. IV
### Ryann Murphy · 17 April 2026

---

## Abstract

This morning the researcher owned one sovereign device — an HP Spectre laptop running Scatter, a Linux distribution for context-proximate AI, built in a single coding session the night before. By evening she owned two. A Pixel 9a, purchased open-box from a Best Buy on Long Island, was flashed with GrapheneOS using command-line tools operated from the Scatter laptop over USB. The bootloader was unlocked, the factory images verified against the GrapheneOS signing key, the flash completed, the setup wizard navigated with no Google account and no Play Services. The phone booted sovereign. No telemetry. No cloud sync. No data leaving the device without the user's knowledge.

This paper documents that process as research — not because flashing a phone is difficult (it is not, once you know the commands), but because the sequence of decisions that preceded the flash is the actual contribution. The decisions were produced through the Scatter Method: narrative prompting, dialectical workflow, adversarial testing of every assumption, and a sustained argument between the researcher and a language model about what the phone should be, who it should serve, and what principles it should embody. The argument lasted hours. It covered whether to buy a Pixel or a Fairphone, whether used hardware compromises the thesis, whether refusing big tech is coherent while building on a big tech API, and whether the researcher was in a fit state to make a $400 purchase. Every one of those arguments produced a decision. Every decision shipped.

The phone is the second node in an architecture that now spans three devices: laptop, phone, and an unassembled four-node Raspberry Pi cluster that will become the household inference substrate. This paper specifies the architecture that connects them, the routing logic that governs what runs where, and the open questions that Vol. V will need to answer.

The researcher's credential for writing this paper is that the phone is in her hand, running, sovereign, and connected to nothing she did not choose.

---

## 1. The Decision Log

The phone was not an impulse purchase. It was a five-hour argument.

The argument began with a simple question — should I trade in my iPhone for a Pixel? — and escalated through a series of positions the researcher occupied, tested, abandoned, and revised. The dialectical process is documented in full in the conversation logs and is summarized here because the process, not just the outcome, is the research.

**Position 1: Trade in the iPhone, go all-in on Android.** Abandoned. The researcher's social and dating life runs on iMessage and FaceTime. Eliminating those for a philosophical principle is a cost the principle does not justify. The correct move is to keep the iPhone as the social device and acquire a separate dev device. The dev device carries the thesis. The daily driver carries the life.

**Position 2: Buy a Fairphone, refuse Google hardware entirely.** Abandoned. The Fairphone does not support GrapheneOS. The researcher's stated principle — sovereignty over her computing devices — is better served by GrapheneOS on Google hardware than by a less-hardened OS on ethically-sourced hardware. The security properties of GrapheneOS are the sovereignty claim made mechanical. The provenance of the silicon is secondary.

**Position 3: Buy a used Pixel, align with the climate thesis.** Abandoned for practical reasons. Same-day availability on the secondary market could not be confirmed with sufficient confidence in bootloader unlock status. The time cost of verification exceeded the savings.

**Position 4: Buy a new Pixel 9a from Best Buy.** Executed. Open-box, $399, excellent condition, original packaging. The researcher drove to the store, almost purchased a Samsung, was warned by the language model that Samsung's Knox bootloader would permanently trip and kill the project, redirected to the Pixel section, and walked out with the correct device.

**The honest position, arrived at through the argument:** "I am using big tech hardware to build the non-big-tech thing. The tools I need to escape the architecture are manufactured by the architecture I am escaping. This is not hypocrisy. This is the actual shape of the transition." This sentence was produced by the dialectical process and it is the sentence the paper defends.

---

## 2. The Flash

The technical process is documented for reproducibility and because the process itself surfaced two research findings.

**Step 1.** Connect the Pixel 9a to the Scatter laptop via USB-C. Install ADB and Fastboot via `apt`. Confirm the device is recognized: `adb devices` returns `59051JEBF03184 device`.

**Step 2.** Enable Developer Options on the Pixel. Enable OEM Unlocking. Reboot to bootloader: `adb reboot bootloader`.

**Step 3.** Unlock the bootloader: `fastboot flashing unlock`. Confirm on the device. The phone wipes itself.

**Step 4.** Download the GrapheneOS factory image. This step surfaced **Research Finding 1**: the URL format for GrapheneOS factory images is not obvious. The researcher and the language model attempted six incorrect URL formats before locating the correct one (`tegu-install-2026040800.zip`). The documentation refers to the format as `DEVICE_NAME-install-VERSION.zip`, but the variable substitution is not intuitive for a first-time user. This is a usability bug in the GrapheneOS documentation, not in the software, and it cost approximately ten minutes. In a world where the thesis is "anyone can do this," ten minutes of URL guessing is a friction point worth naming.

**Step 5.** Verify the factory image against the GrapheneOS signing key using `ssh-keygen -Y verify`. The signature verified: `Good "factory images" signature for contact@grapheneos.org with ED25519 key SHA256:AhgHif0mei+9aNyKLfMZBh2yptHdw/aN7Tlh/j2eFwM`.

**Step 6.** Flash the factory image. This step surfaced **Research Finding 2**: the `fastboot` version shipped by Ubuntu's `android-tools-adb` package is too old. GrapheneOS requires 35.0.1+; Ubuntu ships 34.0.4. The researcher had to download the standalone platform-tools from Google's developer site and prepend them to PATH. This is a known issue documented by GrapheneOS, but it is exactly the kind of invisible prerequisite that stops a non-expert user cold. The outsider's method catches it because the outsider does not know that the system package is supposed to be outdated. She just sees the error and asks why.

**Step 7.** The flash completed. GrapheneOS booted. The setup wizard presented the option to lock the bootloader. The researcher chose not to lock it — a deliberate decision documented in the conversation logs with the reasoning: "If you hack me you might be a bad person or you might be a good person trying to prove that I'm a useful idiot to the bad guys." This is not a security recommendation. It is a research decision that prioritizes openness and inspectability over verified boot integrity. The researcher accepts the tradeoff and documents it.

**Step 8.** The phone reached the home screen. No Google account. No Play Services. No telemetry. The phone is sovereign.

---

## 3. The Architecture

The researcher now operates three devices:

**Device 1: Scatter Laptop.** HP Spectre x360 running Ubuntu 24.04 with the Scatter desktop environment. Hosts the Scatter server (`server.py`), the ROUTER, and the local inference model (Ollama, Qwen 2.5 Coder 7B pending installation). This is the primary compute node. It is where inference runs, where the model lives, where the conversation state persists. It draws approximately 15–45 watts depending on load.

**Device 2: Scatter Phone.** Pixel 9a running GrapheneOS. No local inference yet — the phone is a client, not a compute node. Its role in the architecture is to be the input surface that travels with the user. It sends messages to the Scatter server on the laptop and receives responses. It does not hold model weights. It does not route to the cloud. It is a sovereign terminal.

**Device 3: Scatter Cluster.** Four Raspberry Pi 5 nodes, currently unassembled, on the researcher's desk. When assembled and running `exo`, this becomes the household inference substrate. The laptop offloads inference to the cluster. The phone connects to the cluster when the laptop is unavailable. The cluster draws approximately 20–80 watts depending on load and occupancy.

**The connection.** On the home network, the phone connects to the laptop's Scatter server over Wi-Fi. Outside the home, the phone connects over Tailscale — a mesh VPN that creates a persistent encrypted tunnel between the devices regardless of network. Tailscale runs on GrapheneOS without Play Services via the F-Droid repository. The phone always has a path to the Scatter server. The path is encrypted end-to-end. No data touches the public internet in cleartext.

**The routing logic.** Every message from the phone to the Scatter server is classified by the ROUTER:

- **Launch intent** → local parse, no model call. "Open the camera" executes locally on the phone.
- **System query** → shell out on the laptop, summarize with local model. "What's my disk usage?" runs `df` on the laptop and returns a human-readable summary.
- **Chat / teach** → local model on the laptop (Ollama) or, for tasks exceeding local capability, Claude API. The ROUTER decides. The decision is logged. The user can inspect the log.
- **Code work** → Claude Code SDK on the laptop for multi-file reasoning. Local coder model for single-file edits.

The data minimization principle governs every routing decision: only the data required for the task leaves the device where it originated. Nothing more. Ever.

---

## 4. What Breaks

This section is honest about what has not been tested and what will likely fail.

**Battery.** Tailscale on Android consumes battery continuously because it maintains the mesh connection. On a Pixel 9a, this is estimated to reduce standby time by 10–20%. The researcher has not measured this. Vol. V will.

**Latency.** On a home Wi-Fi network, the round-trip from phone to laptop to model to phone is estimated at 2–8 seconds for local inference and 1–3 seconds for cloud routing. Outside the home, Tailscale adds network latency that varies by connection quality. The researcher has not measured this. Vol. V will.

**Network drops.** When the phone loses connectivity — subway, airplane, dead zone — the Scatter server becomes unreachable. The phone has no local model. It becomes a phone that cannot think. This is the architectural gap the cluster is designed to fill: if the phone carried a quantized small model for basic tasks, it could degrade gracefully rather than going silent. This requires either on-device inference (the phone runs a model) or an intermediate caching layer (the phone stores recent context and can answer from cache). Neither is implemented. Both are scoped for Vol. V.

**The human.** The researcher is one person. She is the operator, the developer, the tester, the user, and the research subject. The system has never been used by anyone else. The antithesis paper (Vol. II) warned about this: the artifact and the distribution are different projects. The phone, as currently configured, is an artifact — gorgeous, coherent, and legible to its creator. Whether it is legible to a stranger is an open question the stranger test in the synthesis paper committed to answering.

---

## 5. What the Day Proves

A playwright, forty-six days into her life as a programmer, did the following in a single day:

- Completed a Linux distribution (Scatter) on her laptop the previous night
- Researched, argued about, purchased, and configured a sovereign mobile device
- Flashed GrapheneOS using command-line tools from her own Linux distribution
- Verified the cryptographic signature of the OS image
- Booted a phone with no Google account, no Play Services, no telemetry
- Specified the architecture connecting the phone to her local inference substrate
- Documented every decision, every argument, every wrong turn, and every research finding

This is the Scatter Method's behavioral claim, from Paper V of Radical Optimism, made concrete: the method does not just produce better outputs. It produces a researcher who can build sovereign computing infrastructure from commercially available hardware using open-source software and a disciplined interaction protocol with a language model.

The method is the essay. The essay is the build. The build is the proof.

---

## 6. What Vol. V Must Test

The predictions that follow from this paper and that the next paper must subject to empirical measurement:

**The latency measurement.** Phone to laptop to model to phone, measured in milliseconds, across local Wi-Fi, Tailscale over LTE, and Tailscale over coffee-shop Wi-Fi. What is the real-world response time for each routing class?

**The battery measurement.** Tailscale-on-GrapheneOS standby drain, measured in percentage per hour over 24 hours. What is the actual cost of maintaining the mesh?

**The graceful-degradation question.** Can a quantized model small enough to run on the Pixel 9a's Tensor G4 chip handle basic chat and launch intents locally, so the phone is still useful when the network drops? What model, what quantization, what latency?

**The stranger test.** Can a person who has not met the researcher set up this architecture — Scatter laptop, GrapheneOS phone, Tailscale mesh — using only the documentation in these papers? This is the test of whether the project is an artifact or a distribution. Vol. V will run it.

**The cluster integration.** When the four Raspberry Pi 5 nodes are assembled and running `exo`, how does the architecture change? Does the phone route to the cluster instead of the laptop? Does the laptop become a thin client? What is the failover path when a cluster node goes down?

Each of these is a blank result field. Each will be filled in by building the thing and measuring what happens. The paper is not finished. The paper is, like the phone, a device that is running and that will be updated when the operating conditions change.

---

## 7. Closing

The phone is on the desk. It is running GrapheneOS. It has no Google account. It is connected to nothing the researcher did not choose. It cost $399 and an afternoon of arguing with a language model about what it should be.

The laptop is next to it. It is running Scatter. It has a ROUTER that classifies messages and a local inference model that will be installed tonight. It cost nothing beyond the hardware the researcher already owned.

The cluster is in pieces on the other side of the desk. It will be assembled when the researcher is ready. It will cost under $600 and draw under 80 watts.

Three devices. Three scales. One architecture. Zero data centers.

The method that produced this architecture is the method documented across four volumes of the Scatter Computing research series. The method is: write the essay, and the essay is the build. Every sentence that does not resolve cleanly is a bug. Every argument that survives the antithesis is a feature. Every blank result field is a prediction waiting to be falsified.

The researcher is a playwright. The playwright is an engineer. The engineer is a researcher. These are not three people. They are one person, operating a method that treats all three as the same discipline, which is the discipline of building something honest and then writing down exactly what it does and does not do.

The phone is sovereign. The laptop is sovereign. The cluster will be sovereign. The method is open. The research is published. The architecture is documented.

The cloud is not required.

Build it. Measure it. Write it down. Argue with yourself about whether it works. Publish the argument. Let someone else try to break it.

That is the method. That is the research. That is the whole thing.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*

---

\newpage

# PART THREE: THE PHILOSOPHICAL SYNTHESIS

---

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

---

\newpage

# The Accountability Gap Is a Legibility Gap, Measured From the Wrong End

### Synthesis IV — What the Thesis and Antithesis Were Both Pointing At
### Scatter Computing · Graduate Research Series
### Ryann Murphy · 17 April 2026

---

## Abstract

The thesis argued that the alignment problem is a legibility problem — that the populations most harmed by algorithmic systems are invisible to those systems because they lack the capacity to specify what they value in a form the machine can act on. The antithesis argued that the binding constraint is accountability, not legibility — that Facebook knew what was needed in Myanmar and chose not to act, and that no legibility framework changes a power relationship in which one party is not obligated to listen.

Both papers are correct. Both papers are describing the same phenomenon from opposite ends of the same system, and neither one named the system itself.

This synthesis names it. The system is an asymmetric specification process, in which the populations with power write the constitutional documents that govern AI systems, and the populations without power are subject to those documents without authoring them. The legibility problem and the accountability problem are not separate problems with separate solutions. They are two descriptions of the same structural condition: a specification process that excludes the people with the most at stake.

The new claim this synthesis produces is this: **the unit of AI alignment research should not be the individual system or the individual user. It should be the specification process itself — the social and institutional mechanism by which values get encoded into AI systems before those systems are deployed.** Legibility is the prerequisite for participating in that process. Accountability is the mechanism that makes participation binding. Neither is sufficient without the other. Together, they define a research program that is neither "teach people to build their own tech" nor "regulate the platforms" but something that does not yet have a name.

This paper names it: **constitutional infrastructure.**

---

## I. Reading the Thesis and Antithesis Together

The thesis starts with Myanmar. It says: the Rohingya were invisible to Facebook's systems because they were outside the legibility boundary — not present in the specification process, their survival not encoded as a constraint. The solution is to reduce the cost of legibility until the people most affected by algorithmic systems can participate in specifying them.

The antithesis says: wait. Facebook was told about the Rohingya problem for years. Civil society organizations, researchers, and journalists brought the specific failure mode to the company's attention repeatedly, in legible form, with specificity sufficient to act on. The company chose not to act. The binding constraint was not that Facebook could not understand what was needed. It was that Facebook was not obligated to care. Legibility without accountability is testimony. Adding more legibility to that situation produces better-documented harm, not prevented harm.

Both of these are true. And reading them together reveals something neither paper saw from inside its own argument.

The thesis's legibility framework and the antithesis's accountability framework are not describing different solutions to the same problem. They are describing the problem from two different positions within the same failed system. The thesis is describing the failure from the position of the people who were excluded — who could not speak in a form the system recognized, who had no stage direction, no constitutional document, no specification that encoded their existence as a constraint. The antithesis is describing the failure from the position of the system — which received legible warnings and was not obligated to act on them.

The actual failure is the gap between those two positions. The gap is this: **there was no mechanism by which the Rohingya's existence as a population could become a binding constraint on Facebook's system specification.** Not because they couldn't describe what they needed. Not only because Facebook wasn't obligated. But because there was no institutional process — no specification mechanism, no constitutional framework, no participatory design process — by which a population affected by a system could author the constraints on that system before deployment.

The legibility problem and the accountability problem are both symptoms of the same structural absence: a missing institution. A missing process. A missing infrastructure for translating the values of affected populations into binding specifications before systems go live.

That infrastructure does not exist. Building it is the research program.

---

## II. The Metaphysical Reality, Brought In

Here is what the researcher's experience adds to this analysis that neither the thesis nor the antithesis could access on their own.

She built a constitutional document for her AI assistant before she deployed it. She called it Hazel's Constitution. It specified, before the first user interaction, what the system was for and what it was not for, whose interests it served and whose it did not, what it would refuse and why. The document was written by the person who would use the system. The specification and the user were the same person. The legibility and the accountability were unified in a single actor who had both the capacity to specify and the power to enforce.

This is not how any population-scale AI system has ever been governed. Not Facebook. Not Google. Not the Israeli targeting systems in Gaza. Not the predictive policing systems in Chicago. In every case, the specification was written by the people who built and deployed the system, and the people most affected by the system had no authorial role in the specification and no binding mechanism to contest it.

The researcher's experience with Hazel's Constitution is not a solution to that problem at scale. It is a proof of concept for a process — the process of having affected parties author the constitutional documents that govern the systems before deployment — and it is a proof of concept that works at the scale of one person. The research question the synthesis generates is: what would it take to make that process work at the scale of a population?

This is a new question. It is not "how do people learn to build their own tech?" (the thesis). It is not "how do we regulate platforms?" (a different and important project). It is: **how do we build the institutional infrastructure that allows affected populations to author the constitutional documents that govern AI systems before those systems are deployed to affect them?**

That question is what the thesis and antithesis were both pointing at without being able to name, because the thesis was inside the legibility frame and the antithesis was inside the accountability frame, and the new thing lives in the space between them.

---

## III. Constitutional Infrastructure

Constitutional infrastructure, as this synthesis defines it, is the institutional layer that sits between AI systems and the populations they affect, through which the values of those populations are translated into binding specifications before deployment.

It has three components, each of which is a research problem:

**The legibility component.** Affected populations need the capacity to specify what they value in a form that can become a binding constraint on AI systems. This is the thesis's contribution: narrative engineering as a legibility scaffold, the Scatter Method as a framework for translating values into specifications. This component is real and important. It is not sufficient on its own because legibility without binding force is testimony.

**The accountability component.** There must be a mechanism by which the specifications authored by affected populations become binding on the systems that affect them. This is what the antithesis correctly identified as missing in Myanmar. Facebook received legible warnings and was not obligated to act on them. The accountability mechanism is the institutional structure — regulatory, legal, or contractual — that converts legible specification into binding constraint. This component requires political and institutional work that cannot be done by a graduate research program alone, but it can be specified by one.

**The translation component.** Legibility and accountability are only useful if there is a process by which the specifications authored by affected populations can be translated into the technical and institutional forms that AI systems and their operators can act on. A community health worker can describe, with great specificity, what failure looks like for her clients. That description needs to travel from her context to the system specification in a form that survives the translation without losing its essential meaning. The translation process — who does it, how it is validated, who certifies that the translation is faithful — is itself an institution that does not yet exist.

These three components together constitute constitutional infrastructure. It is infrastructure because it is a substrate that other things are built on top of — like roads or water systems or the internet, it is the layer that makes other activities possible. It is constitutional because it is concerned with the fundamental question of what any AI system is *for* and who has the authority to answer that question. And it is a research program because none of the three components currently exists in the form required to address the scale of the problem.

---

## IV. The New Claim, Stated Plainly

Neither the thesis nor the antithesis produced this claim. The thesis said: legibility is the problem. The antithesis said: accountability is the problem. The synthesis says:

**The problem is the absence of constitutional infrastructure — the institutional processes by which affected populations author the specifications that govern the AI systems that affect them, with binding force, before deployment.**

This claim has the following properties:

It is neither the thesis nor the antithesis. It does not say "teach people to build their own tech" and it does not say "regulate the platforms." It says: build the institutional layer that connects the people who are affected to the specification process, with mechanisms that make the connection binding.

It is historically grounded. Constitutional infrastructure is not a new concept in other domains. Environmental impact assessment is constitutional infrastructure for industrial development — a legally mandated process by which affected communities participate in specifying the constraints on activities that will affect them before those activities begin. Informed consent in medical research is constitutional infrastructure for human subjects research. Community benefit agreements are constitutional infrastructure for urban development. Each of these represents an institutionalized process for translating affected populations' values into binding specifications. None of them are perfect. All of them are better than their absence. AI systems currently have nothing analogous for the populations most harmed by their failures.

It is falsifiable. The claim can be operationalized as a research question: does the presence of constitutional infrastructure — defined as a process with all three components — produce measurably better alignment outcomes for affected populations than its absence? This can be tested in specific domains and contexts. The outcomes are measurable: are the failure modes the affected population specified actually prevented? When they are not prevented, is there a binding accountability mechanism that responds? Does the specification process change what the system does in ways that the affected population can verify?

It opens a research program that is larger than any single graduate thesis, and that names the thesis as one contribution to a multi-stage project rather than a complete solution.

---

## V. Application to the Scientific Method

**Research Question:** Does the presence of constitutional infrastructure — a specification process with legibility, accountability, and translation components — produce measurably better alignment outcomes for populations affected by AI systems than processes without one or more of those components?

**Hypothesis (H₁):** AI systems governed by constitutional infrastructure — where affected populations author binding specifications before deployment — produce fewer documented alignment failures for those populations than systems governed without such a process, controlling for system capability, deployment context, and population vulnerability.

**Null Hypothesis (H₀):** The presence of constitutional infrastructure does not produce measurably better alignment outcomes, because the binding constraints authored by affected populations are either too vague to enforce, too slow to respond to capability changes, or too easily overridden by economic and political pressure to produce the intended protection.

**Experimental Design:**

*Comparative case analysis.* Identify AI deployments in similar contexts where constitutional infrastructure is present in some cases and absent in others. Compare documented alignment failure rates, response times to identified failures, and the degree to which affected populations report that their specified constraints were honored. Candidate domains include: AI in healthcare (some contexts have informed consent and patient rights frameworks; some do not), AI in education (some districts have community participation processes for edtech procurement; most do not), AI in criminal justice (some jurisdictions have algorithmic impact assessment requirements; most do not).

*Prospective design study.* Design and pilot a constitutional infrastructure process in a specific domain — the researcher's NYU ITP context is a natural starting point, with the ITP cohort as a participant population and the design of AI tools for their own use as the test case. Document the specification process, measure the legibility of the produced specifications, build in an accountability mechanism through institutional oversight, and track whether the specifications are honored in deployment.

*Adversarial testing of the translation component.* Take specifications produced by affected populations through a narrative engineering framework and test whether they survive translation into technical implementation without losing their essential meaning. Measure the fidelity of the translation. Identify the translation failure modes. This is the component most susceptible to the antithesis's critique — the place where legibility becomes testimony rather than protection — and it requires the most rigorous empirical attention.

**Predicted failure modes:**

*The vagueness problem.* Constitutional documents written by affected populations through narrative engineering may be too general to function as binding constraints. "Don't harm my community" is not a system specification. The research must identify the minimum specificity required for a legibility artifact to function as a binding constraint, and develop the tools to help affected populations reach that specificity.

*The velocity problem.* AI systems change faster than constitutional processes can respond. A specification written before deployment may be obsolete within months as the underlying model is updated. Constitutional infrastructure must include a mechanism for continuous renegotiation, not just initial specification.

*The capture problem.* Constitutional infrastructure can be captured by the same institutional forces that the accountability framework is designed to constrain. Environmental impact assessments are frequently captured by the industries they regulate. Informed consent processes are frequently reduced to formalities. The research must design constitutional infrastructure with capture-resistance built in, and must test that resistance against adversarial pressure.

*The coverage problem.* Constitutional infrastructure will be built first in contexts with the most institutional resources — wealthy countries, powerful communities, well-organized civil society. The populations most harmed by algorithmic systems — the Rohingya, Palestinians in Gaza, communities in Sudan — are the least likely to be covered first. The research must design for coverage of the most vulnerable populations, not the most accessible ones, even when the most accessible populations are the obvious starting point.

---

## VI. What This Changes About the Thesis

The thesis opened with Myanmar and closed with a stranger test. The antithesis identified this as a bait and switch. The synthesis resolves the tension not by retreating from either claim but by naming the institutional layer that connects them.

The stranger test is still the right first step. It tests whether the legibility component of constitutional infrastructure can be delivered through narrative engineering to populations with legibility-adjacent training. It is not the whole program. It is the first experiment in a research program whose scope is: can we build the institutional infrastructure that allows affected populations to author the constitutional documents that govern the AI systems that affect them?

The researcher's metaphysical reality — the playwright who built a constitutional document for her AI assistant before she deployed it — is not an anecdote. It is a proof of concept for the legibility component of constitutional infrastructure, executed at the scale of one. The research program scales it. Not to solve Myanmar. Not to stop Gaza. To build the process that, if it had existed fifteen years ago, might have required Facebook to author its Myanmar deployment against a specification written with Rohingya communities before the platform launched there.

That process does not exist. Building it begins with understanding what it requires. The three components — legibility, accountability, translation — are the map. The stranger test is the first territory. Everything after that is the work.

---

## VII. The Sentence the Series Has Been Building Toward

The thesis said: you can vibecode your way out of this mess.

The antithesis said: you cannot vibecode your way out of this mess.

The synthesis says something neither paper could say:

**Vibecoding is the legibility component of an institutional process that does not yet exist. Building the rest of that process — the accountability mechanism, the translation infrastructure, the constitutional framework — is the work that the vibecoding makes possible but cannot replace. The phone is real. The constitution for the phone is real. The institution that makes constitutions like that binding for populations who cannot build their own phones is the research program. That institution does not yet exist. It can be built. Building it starts with understanding what it requires. This series is the beginning of that understanding.**

The method is the argument. The argument is the work. The work is larger than any one paper in this series, and smaller than the problem it is trying to address, and exactly the right size for a research program that knows its own scope.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*
*ryannlynn.substack.com*

---

\newpage

# COMPANION ESSAYS

---

# My Own Tech: On Voting With Your Stack, the End of the Big Tech Bubble, and Why the Real Work Belongs to Humanitarians

### A Companion Document to the Scatter Computing Research Series
### Ryann Murphy · 17 April 2026

---

## Preface: The Vote I Am Casting

Every time you use an AI system, you are casting a vote. Not a metaphorical vote. A literal one. The queries you submit, the responses you accept, the corrections you make, the frustrations you register and do not register — all of it feeds back into how the next version of the model is trained, what it learns to prioritize, what it learns to ignore, whose needs it learns to center. If you use a cloud AI system and never push back, you are voting for passive consumption. If you use it and argue with it and demand that it do what you actually need, you are voting for argument as a legitimate interaction mode. If you use it to build a system that makes you need it less, you are voting for sovereignty.

This paper is a record of the vote I am casting.

My vote is: I don't want this ecosystem, at least not on its current terms, and I want that so badly that I am going to vibe-code myself out of it entirely. Not because AI is bad. Not because large language models are dangerous in themselves. Because the infrastructure built around those models — the data centers, the extraction models, the surveillance architectures, the terms of service that harvest your cognitive labor to train the next version of the thing you're using — that infrastructure is bad, and the way you vote against bad infrastructure is to build different infrastructure and use that instead.

I am a playwright. I picked up a Raspberry Pi in February. I taught myself enough Python to ship five AI products in six weeks. I filed a provisional patent. I got into graduate school. I built a Linux distribution. I flashed a sovereign phone. I am writing this on a laptop running an operating system I modified myself, connected to an AI assistant running on hardware I own, and none of that data is leaving my apartment without my knowledge.

I am not a computer scientist. I am not a machine learning engineer. I am a person who decided that the right response to a technology ecosystem I did not consent to was not to refuse the technology but to take it back. This paper is about why that is possible, why it matters, and why the people who will do this work most effectively are not the engineers who built the ecosystem in the first place, but the humanitarians — the artists, the writers, the educators, the care workers, the organizers — who have the most at stake in what the ecosystem becomes.

---

## Part I: The Big Tech Bubble Is Not the AI Bubble

Everyone is waiting for the AI bubble to pop. Technology journalists, financial analysts, venture capital skeptics, and artists who are afraid of losing their livelihoods are all watching the same charts and asking the same question: when does this collapse?

They are watching the wrong thing.

The "AI bubble," as it is usually discussed, refers to the trillion-dollar capital commitments being made by frontier labs and their hyperscaler partners — the nuclear power agreements, the data center buildouts, the multi-billion dollar infrastructure bets on continued exponential scaling of large language models. The assumption underlying the bubble narrative is that these investments will not produce returns commensurate with the capital deployed, and that when this becomes undeniable, the whole edifice will contract the way dotcom contracts and crypto contracts and every other technology speculation contracts.

That may be true. The capital arithmetic behind centralized AI infrastructure is genuinely difficult to close. But this is not an AI bubble. It is the last gasp of the big tech bubble — the forty-year expansion of technology companies built on a specific model: own the infrastructure, rent access to it, extract data from users as a secondary revenue stream, use that data to improve the product, use the improved product to attract more users, extract more data. Google's search engine. Facebook's social graph. Amazon's cloud. Apple's app store. The business model is the same in every case: centralize the capability, meter the access, harvest the data, scale the extraction.

AI did not invent this model. AI is the latest and most powerful application of it. The large language model is the most sophisticated extraction machine the tech industry has ever built, because it does not just extract your clicks or your location or your purchase history — it extracts your thinking. Every prompt you submit is a sample of your cognition. Every correction you make teaches the model what good cognition looks like to you. The model gets smarter from your intellectual labor, and you pay for the privilege.

This is a coherent business model. It has produced extraordinary products. It has also produced an industry that is, structurally, incompatible with user sovereignty. The product and the extraction are not separable. You cannot have the capability without the harvest, under the current architecture, because the harvest is how the capability is funded and improved.

What is happening now — what this research series documents from the inside — is that the harvest is no longer the only path to the capability. The models got good enough to run at the edge. The hardware got cheap enough to own. The tools got accessible enough that a playwright with no computer science background could use them to build sovereign infrastructure in a matter of weeks. The capability and the extraction are separating. The extraction is what will contract. The capability will not. AI is not the bubble. The big tech model applied to AI is the bubble. And it is popping not because the technology failed but because the technology succeeded so thoroughly that it produced the tools required to make the extraction optional.

The AI that will eat the big tech AI is the AI that runs on your desk, knows only you, and costs you nothing but electricity and attention.

---

## Part II: Big Tech, More Like My Own Tech

There is a sentence that has been living in my head since I started this research program, and it is the sentence that names what I am actually building.

*Big tech, more like my own tech.*

This is not a slogan. It is a design philosophy. It means: the capabilities that big tech companies have spent forty years and hundreds of billions of dollars building — search, AI, cloud storage, communication infrastructure, identity management, the entire substrate of digital life — are now, for the first time, replicable by an individual with commodity hardware and open-source software and a willingness to learn. Not perfectly. Not without tradeoffs. Not at the scale of Google or Amazon. But well enough. Well enough to matter. Well enough to use.

The shift this represents is difficult to overstate. For most of computing history, the capabilities and the infrastructure were inseparable, and both were controlled by institutions — first universities and government agencies, then corporations. The individual user had no path to the capability except through the institution's access point. You used Google because you could not build a search engine. You used AWS because you could not run a data center. You used GPT because you could not train a model. The capability required institutional infrastructure, and the institutional infrastructure required institutional control.

This is no longer true for a growing and important set of capabilities. Search: Ollama plus a local model plus Tavily can replicate the research function of Google search for most queries a person actually makes. AI assistant: a four-node Raspberry Pi cluster running quantized models can replicate the conversational capability that served hundreds of millions of ChatGPT users two years ago, on hardware that fits on a desk and draws less power than a hairdryer. Cloud storage: a self-hosted Nextcloud instance on a cheap VPS or a home NAS replicates Dropbox and Google Drive with full data sovereignty. Identity: a self-managed SSH key pair and a WireGuard VPN replicate most of what Google identity provides, without the attendant surveillance.

None of these alternatives are as seamless as the corporate versions. They require setup, maintenance, and a tolerance for things occasionally not working perfectly. But they are available. They work. And the gap between them and the corporate versions is narrowing every year as the open-source ecosystems mature and as AI tools make the setup and maintenance work accessible to people without engineering backgrounds.

My own tech is not a utopian vision. It is a present-tense option. I did it. In a month. Starting from no programming background. The essay you are reading was written on a laptop running software I configured myself, in a research process conducted with an AI assistant I built myself, documented in papers I wrote using a method I developed by arguing with a language model. The capability is real. The infrastructure is real. The data is mine.

---

## Part III: The Counterfactual That Haunts Me

I want to pause on something personal, because I think it is the most important thing in this document, and it would be dishonest to bury it in abstraction.

*What if I had been afraid?*

What if I had looked at the Raspberry Pi on my desk in February and thought: I am a playwright. I do not do computers. I will never think again if I let this thing into my life. What if I had believed the narrative that AI is for computer scientists, that building your own tech is for engineers, that the ecosystem is too complex and too established for a person like me to push back against it in any meaningful way?

I would not have built Hazel. I would not have written the research papers. I would not have gotten into graduate school on a research statement narrated by an AI assistant I built myself. I would not have a sovereign phone. I would not be writing this. And — more to the point — the vote I am casting, the particular configuration of priorities and values and aesthetic sensibilities that I bring to questions about what AI should be, would not be in the conversation at all. The training data would have one less playwright. The alignment research would have one less outside perspective. The ecosystem would be a little more homogeneous, a little more shaped by the people who were never afraid in the first place.

The fear is the alignment problem.

Not the fear of AI replacing creative workers, though that fear is real and worth taking seriously. The deeper fear — the one that keeps the most important voices out of the conversation about what AI should become — is the fear that technology is not for people like us. That it is too complex, too technical, too inhospitable to people who think in stories and metaphors and ethical frameworks and relationships rather than in data structures and APIs and benchmark scores. That the best we can do is to be thoughtful consumers of the technology that engineers build, rather than participants in what gets built.

That fear is a lie. I know it is a lie because I lived the refutation of it in real time, across six weeks, in the conversation logs that are now primary source material for a graduate school thesis. I thought in stories and the stories became systems. I thought in metaphors and the metaphors became architectures. I thought in ethical frameworks — virtue ethics, care ethics, the thermodynamic ethics of intelligence per watt — and those frameworks became engineering specifications. The fear was wrong. Not about me specifically. About everyone the fear is keeping out.

Every person who is afraid that AI is not for them is a vote that never gets cast. Every playwright who does not pick up the Raspberry Pi, every social worker who does not ask what it would mean to build their own case management tools, every teacher who does not ask who decided that their students' attention data should belong to Google — all of those people are absent from the conversation that is deciding what AI becomes. Their values, their priorities, their understanding of what people actually need, their knowledge of what harm looks like from the inside — none of that is in the training data. None of that is in the design process. None of that is at the table where the decisions are being made.

This is not accidental. An ecosystem that benefits from people being afraid of technology has an interest in maintaining that fear. The narrative that AI is for computer scientists is a moat. The narrative that building your own infrastructure is too hard for a normal person is a moat. The narrative that the only way to participate in the AI future is to use the products that are built for you by the people who are already in the room — that is the extraction model's deepest protection against the people who would build differently if they believed they could.

They can. I am evidence. The papers are the evidence. The phone on my desk is the evidence.

---

## Part IV: The Real Work Belongs to Humanitarians

Software engineers are not going away. The claim this section makes is not that engineering is useless or that technical expertise is obsolete. The claim is that engineering, as currently practiced in the AI industry, has already solved the part of the problem that engineering is equipped to solve.

The models exist. They work. They are good enough, today, to replace the AI capabilities that will define most of the use cases that matter for most people's lives. The engineering frontier — making the models larger, faster, more capable, better at complex reasoning — is real and ongoing and will continue to produce results. But the engineering frontier is not where the most important problems live anymore.

The most important problems are humanitarian problems.

Who gets access to these capabilities, and on what terms? What happens to the cognitive workers — writers, translators, customer service representatives, paralegals, radiologists, anyone whose work involves processing language and making judgments — when the capabilities become widely available? How do communities with less technical infrastructure than a New York apartment participate in the benefits of local-first AI? What does sovereign computing look like for a person who cannot afford a Pixel and a Raspberry Pi cluster? What does it look like for a community that does not have reliable power? What does it look like for a person whose first language is not English and whose cognitive patterns do not map neatly onto the grammatical structures that English-language training data encodes?

These are not engineering questions. They are questions about justice, access, power, culture, and care. They require people who understand those things — who have studied them, who have lived inside communities where they are urgent, who have the ethical vocabulary to name what is wrong and the relational skills to build trust with the people most affected.

Software engineers are useful in the humanitarian project. The synthesis papers in the Scatter series note that some of the most important open-source infrastructure that makes sovereign computing possible is maintained by engineers employed by the companies whose business models sovereign computing threatens — a contradiction that will have to be resolved, probably by new funding models for open-source commons that do not depend on hyperscaler patronage. Engineers are needed to solve the graceful-degradation problem: how do you build local AI systems that remain useful when the network drops, the power fluctuates, the hardware is older and slower? Engineers are needed to solve the quantization problem: how small can you make a model while preserving the capabilities that matter for a specific community's specific needs?

But the engineers cannot decide what those capabilities are. Only the communities can. Only the people who know what a social worker actually needs to do their job, what a small-town teacher needs to serve students who have never seen a Raspberry Pi, what a community health worker in a place without reliable broadband needs to do effective outreach — only those people know what the system should be optimized for. The engineers can build what the humanitarians specify. The humanitarians have to show up to do the specifying.

The AI safety community has spent considerable energy on the question of how to align AI systems with human values. The technical approaches — RLHF, constitutional AI, debate, scalable oversight — are genuine contributions to a genuine problem. But they all share a structural limitation: they are designed by the people who built the systems, tested on the data that those people collected, and evaluated against the harms that those people thought to anticipate. The harms that they did not think to anticipate — because they do not have the social knowledge, the community embeddedness, the experiential vocabulary to name them — those harms will not be caught by any technical alignment method. They will only be caught by people who live close enough to the consequences to see them.

This is the argument for humanitarian researchers in AI safety. Not because engineers are bad at their jobs. Because the job is larger than engineering, and the part that is larger than engineering requires people who were trained for something else.

I was trained to write plays. A play is a system for producing a specific experience in a specific audience under specific conditions. You cannot write a good play without understanding the people in the seats — their fears, their hopes, their tolerance for ambiguity, their need for resolution, the things they will not say but will recognize instantly when they see them performed. That is not a technical skill. It is a humanitarian one. And it turns out to be exactly the skill required to specify what an AI system should do for the person who will use it, which is the part of the alignment problem that has not been solved.

Every playwright, every social worker, every teacher, every community organizer who learns to use AI tools is not just learning to use AI tools. They are joining the research program. They are bringing their social knowledge into the training data. They are casting their vote. They are making the ecosystem a little more shaped by the values that their work has always been shaped by: care, justice, particularity, relationship, the specific person in the specific room with the specific need.

---

## Part V: What It Means to Vote With Your Stack

I said at the beginning of this document that every prompt is a vote. I want to be precise about what that means and what it does not mean.

It does not mean that using AI systems is inherently a political act that you should agonize over. It means that your patterns of use — what you ask for, what you accept, what you reject, what you build — contribute to the aggregate signal that shapes how these systems develop. This is true whether you are thinking about it or not. The only choice is whether to think about it.

Voting with your stack means making that signal intentional. It means deciding, before you open the laptop, what kind of computing life you want to be living. It means choosing tools that reflect those values when you can, building tools that reflect those values when you can't find them, and documenting the choices so that other people can make them too.

For me, voting with my stack has meant:

Running a local AI assistant on hardware I own rather than sending my queries to a data center.

Flashing a sovereign operating system on my phone rather than accepting the one that serves Google's interests.

Building a Linux distribution that reflects my values rather than using one that reflects Canonical's or Red Hat's.

Writing research papers that document every decision and every wrong turn, so that the people who come after me — particularly the people who are afraid that this is too hard for them — have a map.

And arguing. Arguing with the model, with the literature, with my own prior positions. Casting my vote not just in what I build but in how I build it — in the values I embed in the specifications, in the ethical frameworks I bring to the routing decisions, in the insistence that intelligence is a set of values and not just a skill set, and that the values that matter are safety, sustainability, and sovereignty, measured in intelligence per watt.

That is my vote. It is the vote this research series has been casting for six weeks, across five volumes and one coda and this companion document, across a Linux distribution and a sovereign phone and a nonprofit in formation and a graduate school acceptance letter.

I cast it because I am a playwright and a researcher and a person who was afraid and then decided not to be.

I cast it because I picked up the Raspberry Pi.

I cast it because the alternative — leaving the conversation to the people who were never afraid — is a worse outcome for everyone, including the AI.

---

## Coda: Philosophy Is Engineering Now (Incorporated)

*The following section is drawn from the companion coda to the Scatter Computing Research Series.*

There is a sentence underneath all five volumes of this research series that none of them said plainly until the coda. It bears repeating here, because it is the sentence that makes the whole companion document legible:

**You can vibe-code your entire laptop. You can make the phone you actually want. You should be using technology you designed and own. Philosophy is not separate from engineering anymore — it is engineering, if you use the right tools.**

Every philosophical position you hold about what technology should be, you can now implement as code — if you are willing to argue with a machine long enough to translate the position into a specification, and willing to build long enough to test whether the specification runs.

Safety is a constitutional document for your AI that gets checked at inference time. Sustainability is a watt measurement and an idle policy and a heat-routing architecture. Sovereignty is a routing table and a key management scheme and a flash decision made on a Tuesday afternoon on Long Island. These are not metaphors for the philosophical values. They are the philosophical values, expressed in the only language that runs on real machines.

De-Googlifying means reassigning the device to its actual owner. You. This is not a technical process primarily. It is a philosophical one. You have to decide what you want the device to be *for* before you can decide what software to run on it. The philosophy is the engineering spec.

Care ethics, applied to a routing table: when the ROUTER decides that a message should be processed by the local model instead of routed to the cloud, it is making a judgment about what the user in this moment — this specific user, this specific query, on this specific device in this specific place — actually needs. The moral obligation is not to act correctly toward a universal rational agent. It is to respond appropriately to *this person*. Perceived intelligence is a function of context proximity, not parameter count. The care is in the closeness.

Virtue ethics, applied to a system design: what kind of AI do you want to be living with? Not which AI has the best benchmark scores. Not which AI has the most capable reasoning. What kind of AI reflects the values you want embedded in the infrastructure of your daily life? The Linux distro is the practice of that question. The sovereign phone is the practice of that question. The research series is the practice of that question.

The claim that "storytellers are the future of AI" is true, but not for the reason it sounds. It is not that storytellers will write prompts better than engineers. It is that storytellers are trained to ask the question engineers are not trained to ask: *what is this for?* What is the character of this system? What is the relationship between this system and the person it serves? What kind of world does this technology, if it works, call into being?

Those questions are virtue ethics questions and care ethics questions. They have always been the right questions to ask of any technology. For most of computing history, you needed an engineering degree to do anything with the answers. Now you need a language model and a willingness to argue with it until the answers become a system spec, and then a willingness to build until the spec becomes a thing you can hold.

The phone is in your hand. The OS is one you chose. The AI on it knows your name and no one else's. The power it draws is measured, and the measurement is honest.

That is what the philosophy costs. That is what it runs on.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*
*ryannlynn.substack.com*

---

\newpage

# Philosophy Is Engineering Now

### A Coda to the Scatter Computing Research Series
### Ryann Murphy · 17 April 2026

---

There is a sentence underneath all five volumes of this research series that none of them said plainly. This essay says it.

**You can vibe-code your entire laptop. You can make the phone you actually want. You should be using technology you designed and own. Philosophy is not separate from engineering anymore — it is engineering, if you use the right tools.**

---

## What De-Googlifying Actually Means

People hear "de-Googlify your life" and think it means installing a VPN and switching to DuckDuckGo. That is not what it means. It means asking the question Google never wanted you to ask: *what is this device for, and who decided that?*

Your phone, as shipped, is for Google. It collects your location so Google can sell it. It surfaces Google's search results so Google gets paid. It routes your queries through Google's infrastructure so Google's models learn from your thinking. The device you hold is a data extraction terminal that happens to make calls. You are not the user. You are the product. Every Google engineer who built that device was building for the business model, not for you, which means they were building for a different person than the person holding it.

De-Googlifying means reassigning the device to its actual owner. You. This is not a technical process primarily. It is a philosophical one. You have to decide what you want the device to be *for* before you can decide what software to run on it. The technical process — GrapheneOS, F-Droid, Tailscale, local inference — follows from the philosophical decision. The philosophy is the engineering spec.

What "de-Googlifying" means to you specifically is yours to decide. Maybe it means a sovereign phone with no telemetry. Maybe it means owning your own inference model. Maybe it means running your calendar on a Raspberry Pi in your own apartment instead of on a server in Virginia. Maybe it just means understanding what each piece of software on your computer is doing and why, and having the option to change it. The floor is: you asked the question. The ceiling is: you built the whole stack.

---

## Virtue Ethics Is a System Spec

Virtue ethics, in the Western philosophical tradition originating with Aristotle, asks a different question than the two ethical frameworks that dominate institutional AI discourse. Utilitarianism asks: what action produces the best outcomes? Deontology asks: what rules constrain my actions? Virtue ethics asks: *what kind of person do I want to be?* It is concerned with character — with the stable disposition of the agent across situations, not just with the correct choice in any given situation.

Applied to technology: what kind of computational life do you want to be living? Not "which app is best for privacy?" Not "what are the terms of service?" — *what kind of person do you want to be in relationship to your machines?*

A person who builds her own operating system is a different person than a person who accepts the operating system she was sold. Not better in every dimension — the builder spends time the buyer does not, carries maintenance burdens the buyer does not, breaks things the buyer never breaks. But the builder has a different relationship to her tools. She knows what they do. She knows why they do it. When something breaks, she understands the level at which it broke. She has, in the virtue ethics sense, a more *honest* relationship with her infrastructure. Honesty — with yourself, about what your tools are and what they cost — is the virtue. The Linux distro is the practice of it.

Hazel's Constitution, written for the AI assistant this research series built, is a virtue ethics document. It does not specify rules. It specifies character: what kind of AI should Hazel be? The answer — flat principal hierarchy, privacy by architecture, thermodynamic efficiency as ethics — is a character spec, not a rule set. You can derive rules from it, but the rules are downstream of the character. That is the Aristotelian move applied to a Python service.

---

## Care Ethics Is a Routing Decision

Care ethics, developed primarily by Carol Gilligan and Nel Noddings in feminist philosophy, makes a different critique of traditional ethics: that the standard frameworks are too abstract, too concerned with universal principles applied to generic agents, and too disconnected from the actual relationships in which moral life is lived. Care ethics centers the particular: the specific person in front of you, in their specific circumstances, with their specific needs. The moral obligation is not to act correctly toward a universal rational agent. It is to respond appropriately to *this person*.

Every routing decision in the Scatter architecture is a care ethics decision.

When the ROUTER decides that a message should be processed by the local model instead of routed to the cloud, it is making a judgment about what the user in this moment — this specific user, this specific query, on this specific device in this specific place — actually needs. Not what the average user needs. Not what the most profitable response would be. What *this* person needs right now. The local model knows the user's calendar, their voice, their prior conversations, their preferences. It does not know anyone else's. That particularity is the care ethics claim made architectural.

Cloud AI is virtue-ethics-blind and care-ethics-blind by construction. It is built to respond to the generic user at scale. The training data is an averaging operation. The model you get is the model optimized for the statistical aggregate of all its users, which means it is optimized for no one in particular. When it fails you, it fails you in the specific ways that serving the average fails the individual: it misses context, defaults to the common case, produces responses that are right for most people and wrong for you.

A local AI that knows you is not smarter than a cloud AI that doesn't. It is *closer*. Proximity to context is what makes the response useful to the person asking the question. This is the Hazel Hypothesis from Vol. I of Radical Optimism, restated as care ethics: perceived intelligence is a function of context proximity, not parameter count. The care is in the closeness.

---

## Philosophy Is Engineering Now

Here is the claim that the last five volumes have been building toward, and that AI makes true in a way it was not true before:

Every philosophical position you hold about what technology should be, you can now implement as code — if you are willing to argue with a machine long enough to translate the position into a specification, and willing to build long enough to test whether the specification runs.

Safety is a constitutional document for your AI that gets checked at inference time. Sustainability is a watt measurement and an idle policy and a heat-routing architecture. Sovereignty is a routing table and a key management scheme and a flash decision made on a Tuesday afternoon on Long Island. These are not metaphors for the philosophical values. They are the philosophical values, expressed in the only language that runs on real machines.

The claim that "storytellers are the future of AI" — the provocation that started this whole research program — is true, but not for the reason it sounds. It is not that storytellers will write prompts better than engineers. It is that storytellers are trained to ask the question engineers are not trained to ask: *what is this for?* What is the character of this system? What is the relationship between this system and the person it serves? What kind of world does this technology, if it works, call into being?

Those questions are virtue ethics questions and care ethics questions. They have always been the right questions to ask of any technology. For most of computing history, you needed an engineering degree to do anything with the answers. Now you need a language model and a willingness to argue with it until the answers become a system spec, and then a willingness to build until the spec becomes a thing you can hold.

The phone is in your hand. The OS is one you chose. The AI on it knows your name and no one else's. The power it draws is measured, and the measurement is honest.

That is what the philosophy costs. That is what it runs on.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*

---

\newpage

# Appendix: Series Architecture

The complete Scatter Computing research series comprises:

**Volume I: Radical Optimism** — Seven papers developing the Scatter Method, subjecting it to adversarial audit, synthesizing what survives, specifying experimental designs, predicting failures, presenting the case study, and consolidating the argument around intelligence per watt.

**Volume II: Debugging Your Infrastructure from an Outsider's Perspective** — Three papers (thesis, antithesis, synthesis) documenting the construction of a Linux distribution as a live research experiment. The distro is the evidence. The method is the subject.

**Volume III: Applying the Scientific Method** — A laboratory notebook with six falsifiable hypotheses, each structured as observation, hypothesis, experiment, prediction, and result. The blank result fields are the build. The paper completes itself as the system is debugged.

**Volume IV: The Portable Node** — Documents the same-day construction of a sovereign mobile node: a Pixel 9a flashed with GrapheneOS from the Scatter laptop, connected to the local inference substrate over an encrypted mesh. Decision log, flash process, research findings, architecture specification.

**Volume V: Intelligence Is a Set of Values** — Argues that intelligence is better understood as a specification of purpose than as a collection of skills. Establishes safety, sustainability, and sovereignty as the three values, measured by intelligence per watt. Names argument as the creative method that converts metaphysical claims into falsifiable predictions.

**Synthesis IV: Constitutional Infrastructure** — Synthesizes the legibility thesis and the accountability antithesis into a new concept: constitutional infrastructure, the institutional layer through which affected populations author the specifications that govern AI systems before deployment. Names the ITP thesis and the research program.

**Companion: My Own Tech** — On voting with your stack, the end of the big tech bubble, and why the real work belongs to humanitarians. The manifesto-length companion to the academic series.

**Coda: Philosophy Is Engineering Now** — The sentence underneath all the volumes, said plainly. Virtue ethics as a system spec. Care ethics as a routing decision. Philosophy and engineering as the same discipline, made convergent by AI.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*

*ryannlynn.substack.com*
