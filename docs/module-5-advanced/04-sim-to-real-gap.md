---
sidebar_position: 4
title: "Crossing the Reality Gap (Sim2Real)"
---

# Sim2Real: The Holy Grail of Learning

## 1. Why Robots Fail in Reality

You trained a PPO policy in Isaac Lab. The robot runs perfectly in sim.
You deploy it to the Go2. It vibrates, falls over, and breaks a leg.
**Why?**
1.  **Latency**: Sim is instant. Real motors have 20ms delay.
2.  **Friction**: Sim ground is uniform. Real ground has dust.
3.  **Flex**: Sim URDF assumes rigid bodies. Real carbon fiber bends.

---

## 2. Domain Randomization

The solution is not to model reality perfectly, but to randomize simulation so much that reality just looks like "another variation".

```python
# Randomize dynamics
rigid_shape_props.friction = np.random.uniform(0.5, 1.25)
rigid_shape_props.restitution = np.random.uniform(0.0, 0.4) # Bounciness

# Randomize mass
payload_mass = np.random.uniform(-1.0, 5.0) # Add/subtract mass errors

# Randomize motor strength
motor_strength = np.random.uniform(0.8, 1.2) # Weak/Strong motors
```

If the agent learns to walk despite these chaotic changes, it will handle the "chaos" of the real world easily.

---

## 3. System Identification (SysID)

Alternatively, we can teach the robot to *estimate* the parameters online.
-   **Teacher Policy**: Has access to "Privileged Information" (Friction, Mass, Gravity vector) during training.
-   **Student Policy**: Only sees Joint Positions/IMU.
-   **Adaptation Module**: An RNN/Transformer that looks at the history of joint movements (e.g., "I commanded 50% torque but only moved 10 degrees -> Mass must be heavy") and outputs a latent vector estimating the physics.

This allows the robot to "feel" if it's carrying a heavy box and adjust its gait instantly.
