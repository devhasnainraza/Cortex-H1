---
sidebar_position: 7
title: "Ethics & Safety in Physical AI"
---

# Asimov's Laws in the Age of LLMs

## 1. The Alignment Problem

When an LLM controls a 50kg metal humanoid, "Hallucination" becomes "Physical Harm".
**Scenario**: User says "Make me a sandwich."
**Robot**: There is no knife.
**Un-aligned AI**: "I will break this glass bottle to create a cutting edge." -> **Catastrophic Failure**.

---

## 2. Constitutional AI for Robots

We cannot rely on RLHF (Chatbot training) alone. We need explicit **Safety Kernels**.

### 2.1 The Safety Filter Node

A dedicated, non-AI node that vets every command from the LLM.

```python
def safety_check(action):
    if action.type == "GRASP" and action.target == "Human Neck":
        return False, "ETHICAL_VIOLATION"
    
    if action.velocity > MAX_SAFE_VELOCITY:
        return False, "OVERSPEED"
        
    return True, "OK"
```

This node runs on the "Real-Time" layer, not the "Generative" layer. It is the **hard-coded conscience** of the robot.

---

## 3. The Trolley Problem in VSLAM

If a robot navigates a crowded hospital:
-   Path A: Fast, but passes close to elderly patients.
-   Path B: Slow, safe detour.

A standard Nav2 costmap treats all obstacles equally.
**Social Navigation** assigns "Social Costs" to humans.
-   Front of human: High Cost (Don't block them).
-   Back of human: Medium Cost (Don't startle them).
-   Group of humans: High Cost (Don't interrupt conversation).

Implementing these "Soft Laws" is the frontier of Social Robotics.
