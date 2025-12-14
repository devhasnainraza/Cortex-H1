---
sidebar_position: 5
title: "SROS2: Hacking & Defense"
---

# Securing the Robotic Nervous System

## 1. The Vulnerability of Robots

By default, ROS 2 is **open**. Anyone on the same WiFi network can:
1.  See what your robot sees (subscribe to `/camera/image_raw`).
2.  Move your robot (publish to `/cmd_vel`).
3.  Crash your robot (DDS flooding).

For a home vacuum, this is annoying. For a humanoid holding a knife in a kitchen, this is dangerous.

---

## 2. SROS2 (Secure ROS 2)

SROS2 wraps the DDS middleware with **PKI (Public Key Infrastructure)**.
It provides three pillars of security:
1.  **Authentication**: "Are you really the Navigation Node?" (X.509 Certificates).
2.  **Encryption**: "Only we can read this map data." (AES-GCM).
3.  **Access Control**: "The Camera Node is allowed to Publish images, but NOT allowed to command motors." (Governance & Permissions).

### 2.1 Setting up SROS2

```bash
# 1. Create a Keystore
ros2 security create_keystore demo_keystore

# 2. Create keys for your node
ros2 security create_key demo_keystore /my_secure_node

# 3. Enable Security
export ROS_SECURITY_KEYSTORE=~/demo_keystore
export ROS_SECURITY_ENABLE=true
export ROS_SECURITY_STRATEGY=Enforce

# 4. Run!
ros2 run demo_nodes_cpp talker --ros-args --enclave /my_secure_node
```

If you try to run a node without keys now, it will be rejected by the network.

---

## 3. DDS Discovery Attacks

Even with encryption, hackers can sometimes see *traffic patterns* (Traffic Analysis).
-   **Flood Attack**: Spamming discovery packets to overload the CPU.
-   **Reflection Attack**: Using the robot to attack other devices.

**Defense**: Use **DDS Discovery Protection** (vendor specific, e.g., RTI Connext Security) or isolate the robot on a **VLAN**.

## 4. Physical Security

If a hacker has physical access to the Jetson Orin:
1.  **Disk Encryption**: Use LUKS on Ubuntu.
2.  **Secure Boot**: Burn fuses on the Jetson to ensure only signed kernels boot.
3.  **Port Locks**: Disable unused USB/Ethernet ports.
