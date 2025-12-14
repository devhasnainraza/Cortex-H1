---
sidebar_position: 6
title: "ROS 2 Control Framework"
---

# ROS 2 Control: The Hardware Bridge

## 1. Why `ros2_control`?

Writing a node that directly writes to `/dev/ttyUSB0` for motors is amateur.
**ROS 2 Control** creates a standard abstraction layer.
-   **Controller Manager**: Runs real-time loops.
-   **Hardware Interface**: The C++ driver for your specific motor (Dynamixel, EtherCAT, Unitree).
-   **Controllers**: Standard algorithms (DiffDrive, JointTrajectory).

---

## 2. The Resource Manager

In `ros2_control`, resources (Joints) are claimed by controllers.
-   **Claim**: `joint_trajectory_controller` claims `hip_joint`, `knee_joint`.
-   **Conflict**: If `walking_controller` tries to claim `knee_joint` while `standing_controller` has it, the Manager denies access.

### 2.1 Writing a Hardware Interface

You must inherit from `SystemInterface`.

```cpp
class MyRobotHardware : public hardware_interface::SystemInterface
{
public:
  CallbackReturn on_init(const HardwareInfo & info) override {
    // Connect to USB
    return CallbackReturn::SUCCESS;
  }

  CallbackReturn on_read(const Time & time, const Duration & period) override {
    // Read Encoders from USB
    hw_positions_[0] = read_encoder(0);
    return CallbackReturn::SUCCESS;
  }

  CallbackReturn on_write(const Time & time, const Duration & period) override {
    // Write PWM to Motor
    write_motor(0, hw_commands_[0]);
    return CallbackReturn::SUCCESS;
  }
};
```

---

## 3. Joint Trajectory Controller (JTC)

For arms and legs, we don't just set "Speed". We set a **Trajectory** (Path over time).
The JTC takes a list of waypoints (Time, Position, Velocity) and interpolates between them (Splines) to ensure smooth motion.

**Command Example:**
"Move elbow to 45 degrees in 2 seconds, then 90 degrees in 5 seconds."
JTC handles the math to make sure velocity is 0 at the start and end.
