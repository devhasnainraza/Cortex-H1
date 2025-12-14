---
sidebar_position: 5
title: "CAD to URDF Pipeline"
---

# From SolidWorks to Simulation

## 1. The Engineer's Nightmare

Mechanical Engineers work in SolidWorks/Fusion360. Robotics Engineers need URDF.
Manually recreating a 500-part assembly in XML is impossible.

---

## 2. Fusion 360 to URDF Exporter

This is the standard plugin.
1.  **Define Joints**: In Fusion, use "Revolute Joint" to define axes.
2.  **Define Links**: Group bodies into components (e.g., "Lower Leg Assembly").
3.  **Export**: The script generates `.stl` meshes and the `.urdf` file.

**Gotcha**: High-poly meshes crash physics engines.
**Fix**: You need two sets of meshes:
1.  **Visual**: High detail (fine threads, logos).
2.  **Collision**: Simplified Hulls (Cylinders, Boxes).

### 2.1 Mesh Simplification (Blender)

1.  Import generated STL into Blender.
2.  Use **Decimate Modifier** to reduce polygon count by 90%.
3.  Export as `.dae` (Collada) or binary `.stl`.

---

## 3. Onshape to Robot

A newer cloud-based workflow.
-   Use `onshape-to-robot` (Python script).
-   It pulls the CAD via API and builds the URDF automatically.
-   It calculates the **Inertia Tensors** automatically based on the material density (Aluminum vs Plastic) defined in CAD. This is a huge time saver.
