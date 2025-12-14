---
sidebar_position: 4
title: "Advanced Behavior Trees"
---

# Behavior Trees: Programming the Robot Mind

## 1. Why Finite State Machines (FSM) Fail

In an FSM (SMACH), you have states like `WALKING` and `SITTING`.
The number of transitions explodes: $N^2$.
Adding "Low Battery" logic requires drawing an arrow from *every* state to "Charge".

**Behavior Trees (BT)** are hierarchical.
You just add a "Check Battery" Condition Node at the root. If it fails, the robot goes to charge, regardless of what it was doing.

---

## 2. Nav2 Behavior Tree Nodes

Nav2 provides a C++ library `behaviortree_cpp_v3`.

### 2.1 Anatomy of a Custom Node

Let's write a node `SayHello`.

```cpp
class SayHello : public BT::SyncActionNode
{
public:
  SayHello(const std::string& name, const BT::NodeConfiguration& config)
    : BT::SyncActionNode(name, config)
  {}

  static BT::PortsList providedPorts()
  {
    return { BT::InputPort<std::string>("message") };
  }

  BT::NodeStatus tick() override
  {
    std::string msg;
    if (!getInput<std::string>("message", msg)) {
      throw BT::RuntimeError("missing required input [message]");
    }
    
    std::cout << "Robot says: " << msg << std::endl;
    return BT::NodeStatus::SUCCESS;
  }
};
```

---

## 3. Blackboards

The **Blackboard** is the shared memory of the brain.
-   *Perception Node* writes `target_x = 5.0` to Blackboard.
-   *Navigation Node* reads `target_x` from Blackboard.

This decouples the nodes. The Navigation node doesn't care *who* found the target (Camera, Voice, or Hardcoded), it just moves.

### 3.1 Decorators (Control Flow)

-   **RetryNode**: "Keep trying until Success".
-   **Fallback (Selector)**: "Try Plan A. If fail, Try Plan B."
-   **Sequence**: "Do A, then B, then C."
-   **Parallel**: "Walk AND Talk at the same time."
