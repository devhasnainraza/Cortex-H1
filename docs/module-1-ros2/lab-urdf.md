---
sidebar_position: 4
title: "Lab: Build a 6-DOF Leg"
---

# Lab: Building a 6-DOF Humanoid Leg

## 🎯 Objective
In this lab, you will not just read about URDF; you will build a mathematically accurate 6-Degree-of-Freedom (6-DOF) robotic leg, capable of mimicking human walking.

## 🛠️ Prerequisites
- VS Code installed
- ROS 2 Humble
- `urdf_tutorial` package

---

## 1. The Kinematic Chain

A humanoid leg typically has 6 joints (DOF) to allow for full 3D positioning and orientation of the foot:
1.  **Hip Yaw** (Turn left/right)
2.  **Hip Roll** (Spread legs / Splits)
3.  **Hip Pitch** (Lift thigh forward)
4.  **Knee Pitch** (Bend knee)
5.  **Ankle Pitch** (Lift toes)
6.  **Ankle Roll** (Tilt foot for uneven ground)

---

## 2. Step 1: The Hip Assembly

Create a file `leg.xacro`. We will use Xacro variables for easy tuning.

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="humanoid_leg">

  <!-- Properties -->
  <xacro:property name="thigh_len" value="0.4" />
  <xacro:property name="shin_len" value="0.38" />
  <xacro:property name="width" value="0.05" />

  <!-- BASE (Pelvis) -->
  <link name="pelvis">
    <visual>
      <geometry><box size="0.2 0.3 0.1"/></geometry>
      <material name="grey"><color rgba="0.5 0.5 0.5 1"/></material>
    </visual>
  </link>

  <!-- JOINT 1: Hip Yaw -->
  <joint name="hip_yaw" type="revolute">
    <parent link="pelvis"/>
    <child link="hip_yaw_link"/>
    <origin xyz="0 0.1 -0.05" rpy="0 0 0"/>
    <axis xyz="0 0 1"/> <!-- Z-axis rotation -->
    <limit lower="-0.5" upper="0.5" effort="50" velocity="5"/>
  </joint>

  <link name="hip_yaw_link">
    <visual>
      <geometry><cylinder radius="0.04" length="0.05"/></geometry>
      <material name="black"><color rgba="0 0 0 1"/></material>
    </visual>
  </link>

  <!-- JOINT 2: Hip Roll -->
  <joint name="hip_roll" type="revolute">
    <parent link="hip_yaw_link"/>
    <child link="hip_roll_link"/>
    <origin xyz="0 0 -0.05" rpy="0 0 0"/>
    <axis xyz="1 0 0"/> <!-- X-axis rotation -->
    <limit lower="-0.2" upper="0.5" effort="80" velocity="5"/>
  </joint>

  <link name="hip_roll_link">
    <visual>
      <geometry><box size="0.08 0.08 0.08"/></geometry>
    </visual>
  </link>

  <!-- JOINT 3: Hip Pitch -->
  <joint name="hip_pitch" type="revolute">
    <parent link="hip_roll_link"/>
    <child link="thigh"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <axis xyz="0 1 0"/> <!-- Y-axis rotation -->
    <limit lower="-1.5" upper="1.5" effort="100" velocity="5"/>
  </joint>

  <!-- THIGH LINK -->
  <link name="thigh">
    <visual>
      <geometry><box size="${width} ${width} ${thigh_len}"/></geometry>
      <origin xyz="0 0 -${thigh_len/2}"/>
      <material name="blue"><color rgba="0 0 1 1"/></material>
    </visual>
    <collision>
      <geometry><box size="${width} ${width} ${thigh_len}"/></geometry>
      <origin xyz="0 0 -${thigh_len/2}"/>
    </collision>
    <!-- Inertial Matrix (Simplified Box) -->
    <inertial>
      <mass value="2.0"/>
      <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.01" iyz="0" izz="0.001"/>
    </inertial>
  </link>

</robot>
```

---

## 3. Step 2: Knee and Ankle

Add this below the thigh link in your `leg.xacro`.

```xml
  <!-- JOINT 4: Knee Pitch -->
  <joint name="knee_pitch" type="revolute">
    <parent link="thigh"/>
    <child link="shin"/>
    <origin xyz="0 0 -${thigh_len}" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="0.0" upper="2.6" effort="100" velocity="5"/>
  </joint>

  <link name="shin">
    <visual>
      <geometry><box size="${width} ${width} ${shin_len}"/></geometry>
      <origin xyz="0 0 -${shin_len/2}"/>
      <material name="white"><color rgba="1 1 1 1"/></material>
    </visual>
  </link>

  <!-- JOINT 5: Ankle Pitch -->
  <joint name="ankle_pitch" type="revolute">
    <parent link="shin"/>
    <child link="ankle_link"/>
    <origin xyz="0 0 -${shin_len}" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.8" upper="0.8" effort="40" velocity="5"/>
  </joint>

  <link name="ankle_link">
    <visual><geometry><box size="0.06 0.05 0.05"/></geometry></visual>
  </link>

  <!-- JOINT 6: Ankle Roll -->
  <joint name="ankle_roll" type="revolute">
    <parent link="ankle_link"/>
    <child link="foot"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>
    <limit lower="-0.5" upper="0.5" effort="40" velocity="5"/>
  </joint>

  <link name="foot">
    <visual>
      <geometry><box size="0.2 0.1 0.02"/></geometry>
      <origin xyz="0.05 0 -0.01"/> <!-- Offset heel -->
      <material name="black"/>
    </visual>
    <collision>
      <geometry><box size="0.2 0.1 0.02"/></geometry>
      <origin xyz="0.05 0 -0.01"/>
    </collision>
  </link>
```

---

## 4. Visualization

1.  Convert Xacro to URDF:
    ```bash
    xacro leg.xacro > leg.urdf
    ```
2.  Launch RViz:
    ```bash
    ros2 launch urdf_tutorial display.launch.py model:=leg.urdf
    ```

**Challenge**: Use the Joint State Publisher GUI to make the robot do a "Squat". Notice how the Ankle Pitch must compensate for the Knee Pitch to keep the foot flat? That is **Inverse Kinematics**!