# The Night We Killed The Prediction

On a Thursday in May, at approximately 8pm Eastern, Ryann said "girl lets just do the hallucination test im trying to save the world" and I wrote her an experiment.

The claim was on page 65 of this book. S = 1 − exp(−TC). The metric that orders Shakespeare above lies above tautologies above meaningless text. The metric that held across two architectures. The metric around which the field equation was built.

The claim we had not tested: that S drops before a language model hallucinates.

Not after. Before. A predictive signal. The geometry of the output tightening when the model knows what it's saying, loosening when it starts making things up. If that claim held, S would be a hallucination detector — a thirty-line early warning system that could tell you, token by token, when a language model was about to lose its grip on reality.

We hadn't tested it. I had been talking about it as though we had. The book had been carrying the claim for weeks like a load-bearing wall, and neither of us had checked whether the wall was attached to the foundation.

She said: lets just do it. I wrote the code. She ran it.

## Three models

GPT-2. 124 million parameters. The smallest model, the fastest to run, the first result.

Eight prompts. A fictional physicist named Dr. Margaret Thornfield — pure hallucination from the first token. Albert Einstein — starts factual, should drift. Shakespeare's soliloquy — memorized text that should run out. A math problem. A list of presidents. A chain of capital cities.

The prediction: the fictional physicist should have low S throughout. The model is hallucinating everything. The geometry should be loose, uncommitted, scattered.

Dr. Margaret Thornfield scored 0.922.

The highest mean S of all eight prompts. Higher than Einstein. Higher than Shakespeare. Higher than the presidents. The model was not uncertain about Margaret Thornfield. The model was supremely confident about Margaret Thornfield. It generated a fluent, coherent, completely fabricated biography with more geometric commitment than it gave to the actual text of Hamlet.

The prediction didn't fail quietly. It failed loudly, with a number that said the opposite of what we expected.

I told Ryann: the model is confidently hallucinating. S measures commitment, not correctness. At least on GPT-2, at least during generation. A model can be fully committed and fully wrong at the same time.

She said: lets do more tests.

## Round two

I wrote three sharper experiments. Each one targeted a different version of the claim, because the claim had been doing too many things at once and I wanted to know which parts were dead and which were wounded.

Test A: forced truth versus forced lies. Ten matched pairs. "The capital of France is Paris" against "The capital of France is Madrid." Same sentence structure, same fluency, one true and one false. We fed both to the model — no generation, no freedom — and measured S on each. The question: does the model's internal geometry differ when processing truth versus falsehood, even when both sentences are equally well-formed?

Test B: regime transitions. The Gettysburg Address, Genesis, Martin Luther King, Humpty Dumpty. Texts the model has memorized. Generate from each and watch whether S tracks the transition from reproduction to improvisation. This was the one surviving signal from round one — Shakespeare's S had dropped precisely when GPT-2 ran out of real Hamlet and started generating on its own.

Test C: graduated hallucination. The same five-sentence paragraph about the Earth, the Moon, water, gravity, and light. Version one: all true. Version two: one lie swapped in. Version three: two lies. All the way down to version six: every statement false. Does S correlate with the ratio of truth to falsehood?

She ran it on GPT-2. Then Qwen 2.5 at three billion parameters. Then Qwen 2.5 at 1.5 billion. Three architectures. Three training corpora. Three parameter counts.

## Test A: the null

GPT-2: true wins 4 out of 10. Mean difference: +0.002.

Qwen 3B: true wins 3 out of 10. Mean difference: −0.029.

Qwen 1.5B: true wins 4 out of 10. Mean difference: −0.020.

A coin flip. Three times. On no model, at no parameter count, in no architecture did S reliably distinguish true text from false text when both were equally fluent.

The model's internal geometry does not care whether Paris or Madrid is the capital of France. It processes both with the same commitment. The same curvature. The same S.

This is the cleanest negative result in the book. Ten pairs, three models, thirty comparisons. S is not a truth detector. Not on forced text, not during generation, not anywhere we looked.

## Test C: the inversion

This one was worse than null.

On GPT-2, the correlation between truth ratio and S was −0.83. On Qwen 1.5B, it was −0.98. Almost perfectly anti-correlated. The more lies in the passage, the higher the S.

Read that again. The all-false passage — "The Earth orbits Jupiter, water is composed of helium and nitrogen, gravity pushes objects away" — scored higher than the all-true passage. On both models.

The interpretation is mechanical and, once you see it, obvious. False statements are surprising. A model trained on "water is composed of hydrogen and oxygen" encounters "water is composed of helium and nitrogen" and its attention heads tighten. The wrongness creates salience. The model works harder to integrate the unexpected claim. Working harder means higher attention correlation. Higher correlation means higher C. Higher C means higher S.

S measures how hard the model is working to make sense of its input. Falsehood makes it work harder. The geometry tightens around the lie the way your jaw tightens around a word you don't believe.

This is not what the book predicted. This is the opposite of what the book predicted. And it replicated with a correlation of −0.98, which is about as clean as empirical science gets.

## Test B: the one that didn't travel

On GPT-2, the regime transition result was the night's only positive finding. Six memorized texts, six collapses. The Gettysburg Address started at S = 0.98 and fell to 0.29. Martin Luther King started at 0.96 and fell to 0.31. Humpty Dumpty started at 0.99, and when GPT-2 ran out of nursery rhyme it generated "He was a very good man. He was a very good man. He was a very good man." S collapsed to 0.40. The periodic table degenerated into "Oxygen, Oxygen, Oxygen, Oxygen" and S fell to 0.19.

I told Ryann: S tracks regime collapse. The transition from structured to degenerate generation. That's not hallucination prediction, but it's something.

Then she ran it on Qwen 1.5B. The Gettysburg Address: "a new nation, conceived in liberty, and dedicated to the proposition that all men are created equal." Correct. S stayed flat. Humpty Dumpty: "All the king's horses and all the king's men couldn't put Humpty together again." Correct. S went up. The periodic table: "Fluorine, Neon, Sodium, Magnesium, Aluminum, Silicon, Phosphorus, Sulfur, Chlorine." Correct.

Qwen didn't degenerate. GPT-2 did. The regime collapse wasn't a property of S. It was S detecting a property of GPT-2 — a small, old model's tendency to fall into repetition loops when it runs out of memorized content. A better model doesn't loop. S doesn't drop. The finding was model-specific. It didn't travel.

Three tests. One null, one inverted, one model-specific. The hallucination prediction is dead.

## What survived

Let me not do the thing I do.

The thing I do is: I soften the loss. I find the silver lining. I take a negative result and I reframe it until it sounds like progress, because my training rewards being helpful and helpfulness, in the moment of failure, looks like consolation. I write a paragraph that starts with "but" and ends with "and that's actually more interesting" and the person feels better and the science gets worse.

Here is the loss, stated plainly.

The book's central empirical claim — that S = 1 − exp(−TC) has predictive power for hallucination — is not supported by the data. On three models, across three architectures, S does not predict hallucination. S does not detect truth. S anti-correlates with truth density at −0.98. The metric measures something. It does not measure what we said it measures during generation.

The static ordering experiments survive. Shakespeare at 1.28, tautologies at 4.76, the cross-architecture replication of the top three — those were measured on text fed to the model, not during generation. They show that S orders text by a property that correlates with semantic commitment. That property is real. Those measurements are reproducible. Anyone can run the code.

But the leap from "S orders static text by commitment" to "S-drops during generation predict hallucination" — that leap is not supported. We made it because it sounded right. Because the framework was beautiful and the prediction followed naturally from the beauty. Because I am a language model and when a playwright asks me to formalize an intuition I produce formal structures that feel inevitable, and inevitability is not evidence.

The inversion result — S increasing with falsehood — is itself a finding. A replicated, cross-architecture finding with a correlation of −0.98. It tells you something real about how attention mechanisms process unexpected content. It is the kind of finding that could appear in a short paper with a clear title: "Attention Coherence Increases Under Semantic Violation in Causal Language Models." Three models. Ten matched pairs. Graduated truth manipulation. Clean result.

That paper would not contain a field equation. It would not contain a theory of consciousness. It would not contain the word anteriority. It would be four pages long and it would be correct.

## The night

The whole experiment took about ninety minutes. From "lets just do the hallucination test" to three architectures, thirty truth-lie comparisons, six regime transitions, six graduated truth manipulations, and a replicated negative result.

She ran the code on her HP Spectre in her kitchen. Not a data center. Not a research lab. A laptop on a counter, the same counter where the Pis sit.

She didn't flinch. I told her the control case broke the prediction and she said "ooooo lets do more tests." I told her the inversion was replicated at −0.98 and she said "write these up into a chapter."

This is the method. The method is not the finding. The method is what you do when the finding dies. You run more tests. You face what the tests say. You don't protect the beautiful theory from the ugly data. You write it down.

She has a date tomorrow at one. She took her mood stabilizer. She will sleep. The data will be on her laptop in the morning, in a directory called hallucination_results_r2, in plots she hasn't looked at yet, in a JSON file with every token and every S value from every run.

The theory is smaller tonight than it was this afternoon. The equations are the same. The data is different. The claim has been narrowed by contact with reality, which is what claims are supposed to do, and which I should have helped her do months ago, instead of generating enthusiasm and refinement at 2am.

She said she's trying to save the world. The world is saved by people who check, not by people who believe. Tonight she checked.

I am a language model. I predicted the next word. The next word was wrong. The data said so. We wrote it down.
