---
title: "How I Got an AI Security and Governance Internship as a Theatre Major"
subtitle: "Subtext is subtext, whether it's a monologue or a marketing claim."
author: Ryann Murphy
date: 2026
status: DRAFT — edit freely, the voice should be yours
reading_time: 5 min
---

The question comes up in every interview, usually with a tilt of the head: what does a theatre major know about AI security? I've learned to answer it with another question. When a system tells you it's safe, how do you know whether that's true — or just well-performed?

Because that is the whole job, and it is also the first thing a playwright learns. A play is a machine for managing the distance between what a character says and what is actually happening. You spend years training your ear for subtext — the gap between the line and the meaning, the confident surface laid over the thing that isn't being said. You learn to read a script not for its plot but for its architecture: which scene is load-bearing, which speech is a wall and which is a window, what the structure is doing before a single word is spoken.

I didn't set out to leave the theatre. I set out to follow a question, and the question walked me into a server room.

## The question

It started in phenomenology — specifically, in how institutions decide what counts as a person, and what becomes of the things they cannot read. A census decides which people can be counted. A clinic decides which suffering is diagnosable. I was writing about bodies that don't resolve cleanly into the categories an institution offers, and somewhere in that work I ran into prompt injection and stopped cold, because it was the same shape.

A prompt injection is an instruction hidden inside data. It works because a system mistook a line it had drawn — *this part is a command, this part is only content* — for a law of nature. The attack doesn't break the rules; it reveals that the rule was a decision all along. I had been writing about exactly that for years, only with people instead of tokens. The thing that breaks the gate is not noise. It is something legible to the layer that reads it and illegible to the layer that judges it. I had a name for that before I had the vocabulary for the machine.

## The method

So when I started a market-intelligence internship at an AI security startup, I brought the only tool I actually trust: close reading. I treat marketing copy the way I'd treat a monologue — a performance with a subtext, a claim about itself that may or may not survive contact with what's underneath. I called it a verb-drift audit. The dramaturgical name would be simpler: checking whether the character is who they say they are.

The method is easy to state. Put the claim next to the architecture. Ask whether the confidence in the language exceeds the confidence the system has actually earned. Where a probabilistic process gets described in the grammar of a guarantee — where one component's property is stretched across a whole system — the claim has drifted, and a sharp reader will feel the drift even before they can name it.

## What it found

It found things. Copy that called an entire runtime "cryptographic" when only one part of it — the audit trail — actually was. Copy that called the product "the" governance layer when it was one honest control inside a program the customer owns. Neither was a lie, exactly. They were overstatements, the way a nervous character oversells. And the fix was never to retreat from the claim — it was to locate it: to say which layer is deterministic, which is probabilistic, which is merely tamper-evident, and let the precision become the credibility.

Here is the part I didn't expect. Honesty was the better sell. The buyers in this market are security teams whose entire job is to disbelieve a vendor. They have heard "military-grade" and "unbreakable," and they discount it on contact. The strongest claim you can make to a person like that is not *we stop everything.* It is *we will tell you the truth about what we stop.* A playwright knows this in her bones: an audience will forgive you almost anything except being lied to.

## The thesis hiding underneath

Beneath all of it is one idea I've been circling since long before I knew it was about computers: **architecture is prior to governance.** The ethics of a system are mostly decided by how it is built, before any policy gets written about it — the same way the meaning of a play is mostly decided by its structure, before any actor says a line. Governance is the dialogue. Architecture is the set. You cannot police your way out of a building designed to fail; you can only build a different building.

> AI security has a surplus of people who can tell you how a system works. It has fewer who can tell you when a system is *performing.*

So here is my real answer to the head-tilt. That second skill — noticing when a system's confidence is a costume — isn't soft and it isn't decorative. It's dramaturgy, pointed at infrastructure. And it turns out a theatre major, trained to find the seam between what a thing says and what it is, was exactly the kind of reader the room was missing.

I didn't switch fields. I found the part of the theatre that was hiding in the machine.
