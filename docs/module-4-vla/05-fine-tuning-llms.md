---
sidebar_position: 5
title: "Fine-Tuning LLMs for Robotics"
---

# Creating a "Robot Brain" Model

## 1. Why GPT-4 is Not Enough

General LLMs are too chatty.
**User**: "Pick up the cup."
**GPT-4**: "Certainly! I would be happy to help you with that task. Picking up a cup involves..."
**Robot**: *Crashes because it expected JSON.*

We need to **Fine-Tune** a model to be terse and structural.

---

## 2. LoRA (Low-Rank Adaptation)

Full fine-tuning of Llama 3 (8B params) requires massive VRAM.
**LoRA** freezes the main weights and trains only a tiny adapter layer (1% of params).
You can train a robot controller on a single consumer GPU (RTX 4090).

### 2.1 The Dataset

Input-Output pairs:
```json
{"input": "Grab the red block", "output": "PICK(block_red)"}
{"input": "Move to kitchen", "output": "NAV(kitchen)"}
```

### 2.2 Training Code (Unsloth)

```python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/llama-3-8b-bnb-4bit",
    max_seq_length = 2048,
    load_in_4bit = True,
)

# Train on 1000 examples...
```

The result is a model that speaks "Robot" fluently.
