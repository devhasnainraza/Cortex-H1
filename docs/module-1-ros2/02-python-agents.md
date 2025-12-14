---
sidebar_position: 2
title: "Advanced Agents: The Follow Me Logic"
---

# Building a "Follow Me" Agent with PID Control

## 1. From Reflex to Control Theory

A simple "reflex" agent (if X, then Y) is often too jerky for a physical robot. If a person takes one step back, a reflex robot might lurch forward instantly. To make movement smooth and human-like, we use **PID Controllers** (Proportional-Integral-Derivative).

### 1.1 The Control Loop

We want to maintain a specific **Target Distance** (e.g., 1.0 meter) from the human.

-   **Error** = (Current Distance) - (Target Distance)
-   **Proportional (P)**: Move fast if error is large, slow if error is small.
-   **Derivative (D)**: "Dampen" the movement to prevent overshooting (stopping too late).
-   **Integral (I)**: Fix small, long-term errors (like getting stuck 1.01m away).

---

## 2. Implementation: The `FollowerAgent`

This agent subscribes to a hypothetical "Person Detector" topic (which might come from a YOLO model) and outputs velocity commands to the robot's wheels/legs.

### `follower_agent.py`

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Float32

class FollowerAgent(Node):
    def __init__(self):
        super().__init__('follower_agent')
        
        # Sub: Distance to person (from Depth Camera/YOLO)
        self.sub_dist = self.create_subscription(
            Float32, 
            '/vision/person_distance', 
            self.control_loop, 
            10
        )
        
        # Pub: Velocity command
        self.pub_vel = self.create_publisher(Twist, '/cmd_vel', 10)
        
        # Parameters
        self.target_dist = 1.0  # meters
        self.kp = 0.5           # Proportional gain
        self.kd = 0.1           # Derivative gain
        
        # State
        self.prev_error = 0.0
        
        self.get_logger().info("Follower Agent Armed via PID")

    def control_loop(self, msg):
        current_dist = msg.data
        
        # 1. Calculate Error
        error = current_dist - self.target_dist
        
        # 2. Deadzone (Ignore small errors to prevent jitter)
        if abs(error) < 0.1:
            cmd = Twist() # Stop
            self.pub_vel.publish(cmd)
            return

        # 3. PID Calculation (PD only for simplicity)
        p_term = self.kp * error
        d_term = self.kd * (error - self.prev_error)
        
        control_signal = p_term + d_term
        
        # 4. Safety Cap (Max speed 1.0 m/s)
        control_signal = max(min(control_signal, 1.0), -1.0)
        
        # 5. Publish Command
        cmd = Twist()
        cmd.linear.x = control_signal # Move forward/backward
        cmd.angular.z = 0.0           # Assume person is centered for now
        
        self.pub_vel.publish(cmd)
        
        # Update state
        self.prev_error = error
        self.get_logger().info(f"Dist: {current_dist:.2f}m | Error: {error:.2f} | Cmd: {control_signal:.2f}")

def main(args=None):
    rclpy.init(args=args)
    agent = FollowerAgent()
    rclpy.spin(agent)
    agent.destroy_node()
    rclpy.shutdown()
```

---

## 3. Integration with Hardware Profiles

<HardwareOnly profile="Unitree_Go2">

### Unitree Go2 Specifics

The Go2 robot does not use standard `/cmd_vel` for all modes. To use this agent with the Go2, you must be in **Sport Mode** or use the high-level API wrapper.

**Remapping**:
If you are using the `unitree_ros2` wrapper, you might need to remap the topic:

```bash
ros2 run my_package follower_agent --ros-args -r /cmd_vel:=/sport/request
```

*(Note: Actual Unitree topic names vary by firmware version; check your `ros2 topic list`)*

</HardwareOnly>

<HardwareOnly profile="Jetson_Orin_Kit">

### Jetson + Kobuki Base

If you are using the "Proxy Robot" (Jetson on a wheeled base), `/cmd_vel` is standard. However, ensure your PID gains (`kp`, `kd`) are tuned lower, as wheeled bases have less friction than legged robots and can drift easily.

</HardwareOnly>