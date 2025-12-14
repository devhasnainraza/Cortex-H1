---
sidebar_position: 5
title: "Multi-Robot Fleet Management"
---

# Coordinating a Fleet (Open-RMF)

## 1. The Traffic Jam Problem

If you have 10 robots in a warehouse, Nav2 is not enough.
Robot A plans a path. Robot B plans a path.
They meet in a narrow hallway. **Deadlock**.

**Open-RMF (Robotics Middleware Framework)** solves this.
It acts like Air Traffic Control.

---

## 2. Traffic Negotiation

RMF requires robots to submit their **Trajectory Proposals** (Time + Space).
-   Robot A: "I will be in Hallway 1 from t=10 to t=20."
-   Robot B: "I want to be in Hallway 1 at t=15."
-   **Conflict!** RMF tells Robot B: "Wait at the door until t=21."

### 2.1 Fleet Adapters

RMF doesn't control the motors. It talks to a **Fleet Adapter**.
The Adapter translates RMF commands ("Go to Waypoint 4") into specific robot API calls (REST, MQTT, or ROS 2).

---

## 3. Integrating Elevators and Doors

RMF standardizes infrastructure.
-   **IoT Bridge**: RMF talks to the building's elevator server.
-   **Flow**:
    1.  Robot arrives at lobby.
    2.  RMF calls elevator.
    3.  RMF holds door open.
    4.  Robot enters.
    5.  RMF selects floor.

This turns the entire building into a robot-accessible machine.
