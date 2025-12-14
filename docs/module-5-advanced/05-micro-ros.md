---
sidebar_position: 5
title: "Micro-ROS: ROS 2 on Microcontrollers"
---

# Micro-ROS: The Nervous System's Edge

## 1. Why ESP32?

A Jetson Orin costs $500. An ESP32 costs $5.
For simple tasks like "Read IMU" or "Control LED Ring", a full Linux computer is overkill.
**Micro-ROS** puts a DDS node directly on the microcontroller.

---

## 2. Architecture

Micro-ROS does not speak standard DDS (RTPS). It uses **XRCE-DDS** (Extremely Resource Constrained Environments).
-   **Client (ESP32)**: Runs the application logic.
-   **Agent (Jetson)**: A Linux process that acts as a bridge, translating XRCE-DDS to standard ROS 2.

## 3. Hello World on ESP32

Using the PlatformIO or Arduino environment:

```cpp
#include <micro_ros_arduino.h>
#include <rcl/rcl.h>
#include <rclc/rclc.h>
#include <std_msgs/msg/int32.h>

rcl_publisher_t publisher;
std_msgs__msg__Int32 msg;

void setup() {
  set_microros_transports();
  
  // Init allocator
  rcl_allocator_t allocator = rcl_get_default_allocator();
  rclc_support_t support;
  rclc_support_init(&support, 0, NULL, &allocator);

  // Create Node
  rcl_node_t node;
  rclc_node_init_default(&node, "micro_ros_node", "", &support);

  // Create Publisher
  rclc_publisher_init_default(
    &publisher,
    &node,
    ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
    "micro_ros_counter");
}

void loop() {
  msg.data++;
  rcl_publish(&publisher, &msg, NULL);
  delay(1000);
}
```

Now your $5 chip is a first-class citizen of the Robot Operating System.
