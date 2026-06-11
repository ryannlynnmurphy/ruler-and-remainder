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
