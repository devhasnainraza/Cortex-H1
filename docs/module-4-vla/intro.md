---
sidebar_position: 1
title: Vision-Language-Action (VLA)
---

# Module 4: Vision-Language-Action Models

## 1. The End of "Pipeline" AI?

Traditionally, robotics used a modular pipeline:
`Perception -> State Estimation -> Planning -> Control`

**VLA (Vision-Language-Action)** models attempt to fuse these into a single end-to-end model (or at least tightly coupled systems).
-   **Input**: "Put the red apple in the bowl" (Text) + Image of table (Vision).
-   **Output**: End-effector pose (x, y, z, grip) or joint velocities (Action).

Examples: **Google RT-2**, **OpenVLA**.

---

## 2. The Practical VLA Pipeline (Today)

Since end-to-end models are heavy and hard to control, we currently use a **Cognitive Pipeline** for production humanoids:

1.  **Speech-to-Text (Ear)**: OpenAI Whisper.
2.  **Planner (Brain)**: Large Language Model (GPT-4o, Gemini 1.5).
3.  **Vision (Eye)**: Open-Vocabulary Object Detector (OWL-ViT, Grounding DINO).
4.  **Action (Body)**: Behavior Tree / Nav2.

### 2.1 Why separate the LLM?

LLMs are slow (tokens per second). Robots need 500Hz control loops.
-   **High Frequency Loop**: Joint Control (500Hz).
-   **Medium Frequency Loop**: Path Planning (10Hz).
-   **Low Frequency Loop**: LLM Reasoning (0.5Hz).

The LLM is the "General," not the "Soldier." It gives orders; it doesn't pull the trigger.

---

## 3. Grounding: The Biggest Challenge

**Grounding** is the problem of connecting symbols to the physical world.
-   LLM says: "Pick up the cup."
-   Robot asks: "Which set of pixels is the cup? Where is it in 3D space (x,y,z)?"

We solve this with **V-LMs (Vision-Language Models)** or **Zero-Shot Detectors**.

```mermaid
graph TD
    A[User Audio] -->|Whisper| B(Text: 'Get the Apple');
    B -->|Prompt| C{LLM Planner};
    D[Camera Image] --> E[Grounding DINO];
    C -->|Target: 'Apple'| E;
    E -->|Bounding Box| F[Depth Map];
    F -->|3D Coord (x,y,z)| G[Arm Controller];
```

---

## 4. Safety Guardrails

LLMs hallucinate. A robot cannot hallucinate safely.
-   **Hallucination**: "Jump over the building."
-   **Reality**: Robot tries to jump, falls over, breaks $10k hardware.

**Guardrails**:
1.  **Feasibility Check**: Is the target coordinate reachable?
2.  **Safety Policy**: Is the action listed in the "Allowed Actions" file?
3.  **Human in the Loop**: Require confirmation for dangerous actions.