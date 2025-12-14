---
sidebar_position: 6
title: "Cloud Robotics with AWS RoboMaker"
---

# Cloud Robotics: The Infinite Brain

## 1. The Onboard Limit

Even a Jetson AGX Orin has limits (64GB RAM).
What if you want to run a 70B parameter VLM or store a map of the entire world?
You need the Cloud.

---

## 2. Fog Robotics Architecture

We split the robot into layers:
1.  **Edge (Micro-ROS)**: Motor control, Safety stops (1000 Hz).
2.  **Fog (Jetson)**: VSLAM, Obstacle Avoidance (30 Hz).
3.  **Cloud (AWS)**: Long-term planning, Fleet Analytics, Large Map merging (0.1 Hz).

### 2.1 AWS RoboMaker

RoboMaker allows you to run Gazebo simulations in the cloud for CI/CD, but also deploy **Greengrass** components.

**Scenario**: "Find the lost keys."
1.  Robot uploads images to S3.
2.  AWS Lambda triggers a massive Vision Transformer (ViT) to scan the images.
3.  Lambda replies to the robot via MQTT: "Keys found in image_405 at coordinates (x,y)."

---

## 3. Remote Teleoperation (WebRTC)

Controlling a robot over 5G requires low latency video.
Standard ROS topics (`/camera/image_raw`) are too heavy.
We use **WebRTC** (the tech behind Zoom/Google Meet) to stream hardware-encoded H.264 video from the robot to the browser.

**Tech Stack**:
-   `gstreamer` on Jetson (NVENC hardware encoder).
-   `kinesis_video_streams_webrtc` (ROS node).
