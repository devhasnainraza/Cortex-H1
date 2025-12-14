---
sidebar_position: 2
title: Voice Command (Whisper)
---

# Voice-to-Action with OpenAI Whisper

## 1. Setting up the Ear

To talk to our robot, we need a microphone array (like ReSpeaker) and a transcription engine. **OpenAI Whisper** is the state-of-the-art for robustness against noise.

### 1.1 Python Audio Loop

We need a script that listens for a "Wake Word" (optional) or records on button press, then sends audio to the API.

```python
import os
import openai
import sounddevice as sd
import soundfile as sf
import numpy as np

# Configure
openai.api_key = os.getenv("OPENAI_API_KEY")
SAMPLE_RATE = 44100
DURATION = 5 # Record for 5 seconds

def record_audio(filename="command.wav"):
    print("Listening... Speak now.")
    audio_data = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1)
    sd.wait()
    print("Processing...")
    sf.write(filename, audio_data, SAMPLE_RATE)
    return filename

def transcribe(filename):
    with open(filename, "rb") as audio_file:
        transcript = openai.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_file
        )
    return transcript.text

if __name__ == "__main__":
    file = record_audio()
    text = transcribe(file)
    print(f"User said: '{text}'")
    # Next: Send 'text' to the LLM Planner
```

---

## 2. Faster Whisper (On-Edge)

Running OpenAI API introduces latency (and cost). For a robot, we often run **Faster-Whisper** locally on the Jetson Orin GPU.

```bash
pip install faster-whisper
```

```python
from faster_whisper import WhisperModel

model_size = "medium.en"
# Run on GPU with FP16
model = WhisperModel(model_size, device="cuda", compute_type="float16")

segments, info = model.transcribe("command.wav", beam_size=5)

for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
```

This reduces latency from ~2s (Cloud) to ~300ms (Edge), making the interaction feel natural.
