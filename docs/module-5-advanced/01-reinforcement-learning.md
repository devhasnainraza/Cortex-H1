---
sidebar_position: 1
title: Reinforcement Learning (Isaac Lab)
---

# Deep Reinforcement Learning for Locomotion

## 1. The Classical vs Learning Approach

-   **Classical Control**: You write the math equations for walking (ZMP, LIPM). It is stable but hard to tune for uneven terrain.
-   **Deep RL**: You tell the robot "Don't fall" (Reward Function) and let it try 10 million times in simulation.

**NVIDIA Isaac Lab** (built on Isaac Sim) allows us to simulate these 10 million steps in minutes by running the physics on the GPU.

---

## 2. The PPO Algorithm

**Proximal Policy Optimization (PPO)** is the standard for robotics.
-   **Actor Neural Net**: Takes State (joint positions, IMU) -> Outputs Action (joint targets).
-   **Critic Neural Net**: Estimates "How good is this state?"

### 2.1 The Reward Function

Writing the reward function is the "Art" of RL.

```python
def compute_rewards(self):
    # 1. Survival Reward (Don't fall)
    reward = 1.0
    
    # 2. Velocity Tracking (Go target speed)
    lin_vel_error = torch.square(self.commands[:, :2] - self.base_lin_vel[:, :2])
    reward -= 1.0 * torch.exp(-lin_vel_error / 0.25)
    
    # 3. Energy Penalty (Don't be jittery)
    reward -= 0.01 * torch.square(self.torques).sum(dim=1)
    
    # 4. Foot Air Time (Lift feet high)
    reward += 0.5 * self.feet_air_time
    
    return reward
```

If you forget the "Energy Penalty", the robot might vibrate its motors at 100Hz to stay upright!

---

## 3. Training Pipeline

1.  **Randomization**: Randomize friction (0.5-1.5), payload mass (+5kg), and push the robot randomly.
2.  **Training**: Run for 10,000 iterations.
3.  **Sim-to-Real**: Export the Policy (`policy.onnx`).
4.  **Deployment**: Run the ONNX model on the Jetson Orin.

The beauty of RL is that the final policy is just a small neural network (e.g., 256x128x64) that runs incredibly fast (microseconds).
