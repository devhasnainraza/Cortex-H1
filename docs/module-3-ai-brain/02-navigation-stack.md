---
sidebar_position: 2
title: Nav2 Architecture
---

# Nav2: The Navigation Stack

## 1. Moving from A to B

**Nav2** is the industry-standard navigation framework for ROS 2. It turns a "Goal Pose" (x, y, theta) into motor commands, while avoiding obstacles.

### 1.1 The Architecture

Nav2 is not a single node; it is a collection of servers managed by a Behavior Tree.

1.  **Global Planner**: Calculates the path from Start to Goal.
    -   *Algorithms*: Dijkstra, A* (A-Star), Smac Planner (Hybrid A*).
    -   *Map*: Uses the Static Map (from SLAM).
2.  **Local Planner (Controller)**: Follows the path while avoiding dynamic obstacles (people, dogs).
    -   *Algorithms*: DWB (Dynamic Window Approach), MPPI (Model Predictive Path Integral).
    -   *Map*: Uses the Local Costmap (rolling window).
3.  **Recoveries (Behaviors)**: What to do if stuck.
    -   *Examples*: Spin in place, back up, clear costmap.

---

## 2. Costmaps: The World Representation

A **Costmap** is a 2D grid where each cell has a value (0-255).
-   **0**: Free space (Safe).
-   **254**: Lethal Obstacle (Wall).
-   **255**: Unknown.
-   **1-253**: Inflation Radius (Danger zone near walls).

### 2.1 Inflation Layer

Robots are not points; they have a radius. The Inflation Layer adds a "buffer" around obstacles so the center of the robot doesn't get too close to the wall.

---

## 3. Behavior Trees (BT)

Nav2 uses an XML-based **Behavior Tree** to orchestrate the logic. This is more flexible than a state machine.

**Example Logic:**
```xml
<root main_tree_to_execute="MainTree">
  <BehaviorTree ID="MainTree">
    <RecoveryNode number_of_retries="6">
      <PipelineSequence name="NavigateWithReplanning">
        
        <!-- Every 1s, plan a new path -->
        <RateController hz="1.0">
          <ComputePathToPose goal="{goal}" path="{path}"/>
        </RateController>

        <!-- Follow the path -->
        <FollowPath path="{path}" controller_id="FollowPath"/>
        
      </PipelineSequence>

      <!-- If failed, try to recover -->
      <Sequence name="RecoveryActions">
        <ClearEntireCostmap name="ClearLocalCostmap"/>
        <Spin spin_dist="1.57"/>
        <Wait wait_duration="5"/>
      </Sequence>
      
    </RecoveryNode>
  </BehaviorTree>
</root>
```

**Translation**: "Try to plan and follow a path. If that fails, clear the map, spin around to look for a way out, wait 5 seconds, and try again. Do this 6 times before giving up."

---

## 4. MPPI for Humanoids

For humanoid robots, standard controllers (DWB) often fail because they assume a circular or rectangular footprint that moves smoothly.

**MPPI (Model Predictive Path Integral)** is a predictive controller that:
1.  Simulates thousands of random trajectories into the future on the GPU.
2.  Scores them (low cost = good, hit wall = bad).
3.  Executes the weighted average of the best paths.

MPPI is robust for erratic movement and is highly recommended for legged robots.
