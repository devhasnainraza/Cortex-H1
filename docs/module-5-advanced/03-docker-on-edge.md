---
sidebar_position: 3
title: Docker on Jetson Orin
---

# Deploying to the Edge: Docker on Jetson

## 1. Dependency Hell

Robots have complex dependencies: `PyTorch`, `CUDA`, `ROS 2`, `RealSense SDK`. Installing these manually on every robot is a nightmare. **Docker** solves this.

## 2. The Base Image

On NVIDIA Jetson, you cannot use standard `ubuntu` images. You must use `l4t` (Linux for Tegra) base images that have access to the GPU hardware.

### `Dockerfile.jetson`

```dockerfile
# Base image from NVIDIA NGC (JetPack 5.1)
FROM nvcr.io/nvidia/l4t-ml:r35.2.1-py3

# Install ROS 2 Humble (from source or pre-built)
# (Simplified for brevity)
RUN apt-get update && apt-get install -y ros-humble-ros-base

# Copy your workspace
WORKDIR /ws
COPY src ./src

# Install dependencies
RUN rosdep install -y --from-paths src --ignore-src

# Build
RUN . /opt/ros/humble/setup.sh && colcon build

# Entrypoint
COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
CMD ["ros2", "launch", "my_robot", "bringup.launch.py"]
```

---

## 3. Running with Hardware Access

To let the container see the GPU and USB sensors, you need specific flags:

```bash
docker run -it --rm --net=host --runtime=nvidia \
    --device /dev/video0 \
    --device /dev/ttyUSB0 \
    -v /tmp/argus_socket:/tmp/argus_socket \
    my-robot-image
```

-   `--net=host`: Share network (needed for DDS/ROS 2 discovery).
-   `--runtime=nvidia`: Enable GPU acceleration.
-   `--device`: Pass through cameras and IMUs.

This ensures your "Brain" runs identically on your laptop and the robot.

```