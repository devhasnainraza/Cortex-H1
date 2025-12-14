---
sidebar_position: 4
title: "Unity 3D Integration"
---

# Unity 3D: High-Fidelity Human Interaction

## 1. Why Unity over Gazebo?

Gazebo is great for physics, but ugly. **Unity** looks like a AAA video game.
For **Social Robotics**, we need to test:
-   Eye contact.
-   Gestures.
-   Crowd interaction.

Unity provides "Digital Humans" that look real, allowing us to test if people feel comfortable around our robot.

---

## 2. ROS-TCP-Connector

Unity communicates with ROS 2 via the **ROS-TCP-Connector**.
1.  **Unity Side**: `ROSConnection` prefab.
2.  **ROS Side**: `ros_tcp_endpoint` node.

### 2.1 Importing URDF into Unity

Use the **URDF Importer** package.
-   It converts URDF meshes to Unity Prefabs.
-   It adds `ArticulationBody` components (Unity's PhysX wrapper for robots).

**Note on Coordinate Systems**:
-   ROS: Right-Handed (Z-Up).
-   Unity: Left-Handed (Y-Up).
The importer handles the annoying 90-degree rotations automatically.

---

## 3. VR Training

We can put a human in a VR headset (Meta Quest 3) inside the Unity simulation.
-   **Teleoperation**: The human moves their hands, and the robot mimics them (Learning from Demonstration).
-   **Reinforcement Learning**: We record the human solving a task (e.g., folding laundry) 100 times, then train the AI to copy it (Behavior Cloning).
