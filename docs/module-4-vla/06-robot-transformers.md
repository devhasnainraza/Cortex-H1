---
sidebar_position: 6
title: "Robotic Transformers (RT-1, RT-2)"
---

# Google's Robotic Transformers

## 1. The Image-Token Architecture

Traditional VLA separates Vision and Language. **RT-1** treats images as "tokens".
The input sequence is:
`[Image Token 1] [Image Token 2] ... ["Pick up coke"]`

The output is **Action Tokens**:
`[Arm x=12] [Arm y=45] [Gripper=Closed]`

This allows the Transformer to "attend" to parts of the image just like it attends to words in a sentence.

---

## 2. RT-2: Vision-Language-Action

RT-2 is fine-tuned from PaLI-X (a VLM).
It exhibits **Emergent Properties**.
-   Train it on "Pick up apple".
-   Show it a picture of a "Darth Vader figure".
-   Command: "Pick up the dark lord."
-   **Result**: It picks up Vader.

It transferred the semantic knowledge of "Dark Lord" from the web data to the robotic action space without explicit training.

---

## 3. OpenVLA: The Open Source Alternative

Google's models are closed. **OpenVLA** is an open-source 7B model built on Llama 2 + SigLIP (Vision Encoder).
You can run it on a Jetson Orin Nano (quantized) to control a robot end-to-end.

**Pipeline**:
1.  Camera -> Vision Encoder (SigLIP).
2.  Text -> Tokenizer.
3.  Projector -> Fuses Vision embeddings into LLM space.
4.  LLM -> Predicts next action token (0-255 discretized joint value).
