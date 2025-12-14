---
sidebar_position: 3
title: Visual SLAM
---

# Visual SLAM: Seeing and Mapping

## 1. The Localization Problem

Before a robot can navigate, it must answer two questions:
1.  **Mapping**: What does the world look like?
2.  **Localization**: Where am I in that world?

**SLAM (Simultaneous Localization and Mapping)** solves both at once.

---

## 2. Visual vs LiDAR SLAM

| Feature | LiDAR SLAM (e.g., Slam Toolbox) | Visual SLAM (e.g., ORB-SLAM3) |
| :--- | :--- | :--- |
| **Input** | Laser Scan (2D/3D points) | Camera Images (Pixels) |
| **Features** | Corners, Walls | Textures, Edges, Objects |
| **Failure Mode** | Long corridors (geometric similarity) | Low light, motion blur, featureless white walls |
| **Cost** | High (LiDARs are expensive) | Low (Cameras are cheap) |

For humanoids, we prefer **Visual SLAM** because cameras are lightweight and we need them for object recognition anyway.

---

## 3. How VSLAM Works (Simplified)

1.  **Feature Extraction**: The algorithm looks for "interesting points" (corners, high contrast spots) in the image.
2.  **Feature Matching**: It finds the same points in the *next* frame.
3.  **Motion Estimation**: based on how the points moved, it calculates how the camera must have moved.
    -   *Example*: If all points moved Left, the Camera moved Right.
4.  **Loop Closure**: The "Aha!" moment. "I recognize this room! I was here 5 minutes ago!" The algorithm snaps the current map to align with the old map, fixing drift errors.

---

## 4. Using `isaac_ros_visual_slam`

NVIDIA provides a highly optimized VSLAM package for the Jetson.

### 4.1 Launching VSLAM

```python
from launch import LaunchDescription
from launch_ros.actions import ComposableNodeContainer
from launch_ros.descriptions import ComposableNode

def generate_launch_description():
    visual_slam_node = ComposableNode(
        name='visual_slam_node',
        package='isaac_ros_visual_slam',
        plugin='nvidia::isaac_ros::visual_slam::VisualSlamNode',
        parameters=[{
            'enable_imu_fusion': True, # Use gyroscope for better stability
            'enable_rectified_pose': True
        }],
        remappings=[
            ('stereo_camera/left/image_rect', '/camera/left/image_rect'),
            ('stereo_camera/right/image_rect', '/camera/right/image_rect'),
            ('visual_slam/imu', '/camera/imu')
        ]
    )

    return LaunchDescription([
        ComposableNodeContainer(
            name='visual_slam_container',
            namespace='',
            package='rclcpp_components',
            executable='component_container',
            composable_node_descriptions=[visual_slam_node],
            output='screen'
        )
    ])
```

**Key Requirement**: VSLAM needs a **Stereo Camera** (Left + Right) or a **Depth Camera** to understand scale. With a single Mono camera, you can map the world, but you won't know if a hallway is 1 meter long or 100 meters long (scale ambiguity).
