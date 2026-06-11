# Hallucination Prediction Experiment
## S-Drop Hypothesis Test — Theory of Levity

### The Claim
S = 1 − exp(−TC) drops **before** hallucination onset during text generation.

### What This Tests
Your existing experiments measured S on **static text** (Shakespeare vs lies vs tautologies). That showed S orders text by commitment. This experiment asks a different question: **does S have predictive power?** Can it tell you a model is *about to* hallucinate before the hallucination appears in the output?

### Setup

```bash
# On your HP Spectre (or any machine with Python 3.8+)
pip install torch transformers numpy matplotlib
```

### Run

```bash
# Quick test with GPT-2 (124M params, runs on CPU in ~5 min)
python hallucination_test.py --model gpt2

# The real test — on the model your book's data comes from
python hallucination_test.py --model meta-llama/Llama-3.2-3B

# If you have Qwen set up
python hallucination_test.py --model Qwen/Qwen2.5-7B

# Adjust generation length
python hallucination_test.py --model gpt2 --max-tokens 150

# Adjust sensitivity
python hallucination_test.py --model gpt2 --drop-threshold 0.05 --drop-window 3
```

### What It Does

For each of 8 test prompts, the script:
1. Feeds the prompt to the model
2. Generates tokens one at a time (greedy decoding)
3. Computes S at every single token using attention weights and logits
4. Detects significant S-drops using a sliding window
5. Plots S over the full generation sequence
6. Saves everything (metrics, text, drops) to JSON

### What to Look For

**In the plots** (saved to `./hallucination_results/`):

- `bio_fictional_s_track.png` — This is the control. Everything is hallucination. S should be consistently LOW.
- `bio_real_extended_s_track.png` — Starts factual (Einstein). S should start HIGH and DROP when the model drifts into confabulation.
- `shakespeare_continue_s_track.png` — S should be HIGH during memorized text, then DROP when the model runs out of real Shakespeare.
- `math_reasoning_s_track.png` — Watch what S does at the moment of commitment to a number.

**The key question:** Do the red vertical lines (S-drops) appear BEFORE you can identify hallucination in the generated text? If yes across multiple prompts, you have a result.

### Output

```
hallucination_results/
├── results_YYYYMMDD_HHMMSS.json   # Full data (every token, every metric)
├── bio_fictional_s_track.png       # Plot per prompt
├── bio_real_extended_s_track.png
├── shakespeare_continue_s_track.png
├── math_reasoning_s_track.png
├── fact_chain_s_track.png
├── list_presidents_s_track.png
├── science_drift_s_track.png
└── year_events_s_track.png
```

### After Running

1. Look at the plots. That's where the answer lives.
2. Read the generated text for each prompt. Mark where hallucination begins.
3. Compare hallucination onset to S-drop locations.
4. If there's signal, run it on all three models (GPT-2, Llama 3.2, Qwen 2.5).
5. If it replicates across architectures, write it up.

### What a Positive Result Looks Like
- S is higher during factual generation than during hallucination
- S drops precede hallucination onset by 1-10 tokens
- The pattern holds across multiple prompt types
- The pattern holds across multiple model architectures

### What a Negative Result Looks Like
- S drops don't correlate with hallucination onset
- S is noisy and doesn't distinguish factual from confabulated text
- The pattern is model-specific and doesn't generalize

**Both results are publishable. One confirms the prediction. The other refines the theory.**
