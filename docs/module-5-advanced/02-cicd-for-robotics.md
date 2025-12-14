---
sidebar_position: 2
title: CI/CD for Robotics
---

# Continuous Integration for ROS 2

## 1. "It Works on My Machine" is Not Enough

In robotics, a bad code update can physically break hardware. **CI/CD** ensures that every Pull Request is tested before it touches the robot.

---

## 2. Industrial CI Pipeline

We use **GitHub Actions** + **Docker** to test ROS 2 nodes.

### `.github/workflows/ros2-test.yml`

```yaml
name: ROS 2 CI

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    container: osrf/ros:humble-desktop
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Dependencies
        run: |
          apt-get update && rosdep update
          rosdep install --from-paths src -y --ignore-src
      
      - name: Build
        run: |
          . /opt/ros/humble/setup.sh
          colcon build --symlink-install
      
      - name: Test
        run: |
          . /opt/ros/humble/setup.sh
          colcon test
          colcon test-result --verbose
```

---

## 3. Unit Testing Nodes

You must write `pytest` tests for your nodes.

```python
# test/test_simple_node.py
import rclpy
import pytest
from my_package.simple_node import SimpleNode

def test_node_startup():
    rclpy.init()
    node = SimpleNode()
    assert node.get_name() == 'simple_node'
    node.destroy_node()
    rclpy.shutdown()
```

## 4. Simulation Testing (Integration)

Advanced CI pipelines launch Gazebo in the cloud (headless) to verify the robot doesn't crash.

```bash
# In CI script
timeout 60s ros2 launch my_robot_bringup simulation.launch.py headless:=True
```
If the process exits with code != 0 (crash), the Build Fails.
