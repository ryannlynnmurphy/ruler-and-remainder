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
