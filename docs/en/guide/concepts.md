---
title: Core Concepts
description: Deep dive into the core design of the Ice rule engine - tree-based orchestration for decoupling, 5 relation node types, 3 leaf node types, and the Roam data model. Master Ice's orchestration philosophy through a recharge campaign example.
keywords: rule engine concepts,tree orchestration,relation nodes,leaf nodes,IceRoam,IceMeta,business decoupling,Ice design philosophy
head:
  - - meta
    - property: og:title
      content: Ice Core Concepts - The Design Philosophy of Tree-Based Rule Orchestration
  - - meta
    - property: og:description
      content: Deep dive into the core design philosophy of the Ice rule engine - master tree orchestration, relation nodes, and data flow.
---

# Core Concepts

> Ice's core philosophy: organize business rules as tree structures where each node handles only its own logic, passing information through data wrappers (Roam) to achieve true business decoupling.

## Why Tree Structures

In real-world business scenarios, the biggest challenge for rule engines is not "can it run" but rather "what happens when rules change."

Pain points of traditional approaches:
- **Flowchart-based** (Activiti / Flowable): Modifying one node requires rewiring connections, causing ripple effects throughout
- **When-Then** (Drools): Implicit dependencies between rules; changing one may affect others
- **Hardcoded**: Flexible but high maintenance cost; changing rules means changing code and redeploying

Ice's approach: **Organize business rules as tree structures where each node is independently responsible for a single piece of logic.** Nodes do not reference each other directly but pass information through data wrappers (Roam). Modifying any node only affects that node itself, with no need to worry about upstream or downstream impacts.

### Example: Recharge Campaign

Company X's New Year recharge campaign:

- Recharge 100 yuan, get 5 yuan bonus balance (Jan 1 - Jan 7)
- Recharge 50 yuan, get 10 bonus points (Jan 5 - Jan 7)
- Rewards are not stackable

Decomposed business modules:

![](/images/introduction/2-dark.png#dark)
![](/images/introduction/2-light.png#light)

When a user recharges, a data container Roam is created containing uid, cost, and other business data along with execution metadata (IceMeta). Each module reads data from the Roam, processes its logic, and writes results back.

### Problems with Flowchart Approach

![](/images/introduction/4-dark.png#dark)
![](/images/introduction/4-light.png#light)

It looks clean, but once business requirements change -- removing the non-stackable restriction, adding inventory control, adjusting time windows -- you need to rearrange connections and evaluation order, where a single change requires considering all upstream and downstream effects.

### Ice's Tree-Based Orchestration

![](/images/introduction/7-dark.png#dark)
![](/images/introduction/7-light.png#light)

Rules are organized using tree structures. Execution starts from the root and traverses child nodes in order. Relation nodes control flow logic, while leaf nodes execute business logic.

When rules change:
- **Change amount threshold**: Directly modify the configuration of the corresponding leaf node
- **Remove non-stackable restriction**: Change the root's ANY to ALL (the stacking logic only lives on this node)
- **Add inventory control**: No changes needed -- if dispensing fails and returns false, the flow automatically continues to the next node

**This is the core advantage of tree-based orchestration: each node is responsible only for its own logic, and changes do not propagate.**

## Relation Nodes

Relation nodes control the execution flow of child nodes. There are 5 types, each with both serial and parallel versions.

### Serial Relation Nodes

| Type | Execution | Return Logic | Analogy |
|------|-----------|-------------|---------|
| **AND** | Sequential, stops on false | All true returns true; any false returns false | Java `&&` |
| **ANY** | Sequential, stops on true | Any true returns true; all false returns false | Java `\|\|` |
| **ALL** | Executes all, no short-circuit | Has true and no false returns true; any false returns false |  |
| **NONE** | Executes all | Always returns none | |
| **TRUE** | Executes all | Always returns true (returns true even with no children) | |

::: tip Key Distinction
AND/ANY use **short-circuit execution**, stopping immediately once the result is determined. ALL/NONE/TRUE **execute all child nodes**. Your choice of relation node depends on whether you need all child nodes to be executed.
:::

### Parallel Relation Nodes

Each serial relation node has a corresponding parallel version (ParallelAnd, ParallelAny, etc.) that submits child nodes to a thread pool or goroutine pool for concurrent execution.

- ParallelAnd / ParallelAny: Support **early termination**, returning immediately once the result is determined
- ParallelAll / ParallelNone / ParallelTrue: Wait for all child nodes to complete

Suitable for scenarios where child nodes have no data dependencies and involve I/O operations.

## Leaf Nodes

Leaf nodes are where business logic is actually executed. There are three types:

| Type | Return Value | Purpose | Examples |
|------|-------------|---------|----------|
| **Flow** | true / false | Conditional checks that control flow direction | Amount validation, level checks, time filtering |
| **Result** | true / false | Execute business operations and return results | Issue coupons, deduct inventory, send notifications |
| **None** | none | Auxiliary operations that don't affect flow | Query user info, logging, data assembly |

### Developing Leaf Nodes

Extend the corresponding base class and implement the business method. Fields are automatically mapped to Server configuration options:

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafResult {

    private String key;      // Config option: key for user ID
    private double value;    // Config option: amount to dispense

    @Override
    protected boolean doResult(IceRoam roam) {
        Integer uid = roam.getDeep(key);
        if (uid == null || value <= 0) {
            return false;
        }
        return sendService.sendAmount(uid, value);
    }
}
```

Each type has a single base class with `IceRoam` as the input parameter:

| Base Class | Method | Return Value |
|-----------|--------|-------------|
| `BaseLeafFlow` | `doFlow(IceRoam roam)` | boolean |
| `BaseLeafResult` | `doResult(IceRoam roam)` | boolean |
| `BaseLeafNone` | `doNone(IceRoam roam)` | void |

## Data Model

### Roam (Data Container)

Roam is the sole data carrier for rule execution. It holds both business data and execution metadata (IceMeta) under the reserved `_ice` key.

**IceMeta fields (stored under `_ice` key):**

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | ID of the rule to trigger |
| `scene` | String | Scene name to trigger; all rules subscribed to this scene will execute |
| `nid` | long | Execute with the specified node as root |
| `ts` | long | Request timestamp (affects node time window evaluation) |
| `trace` | String | Trace ID for distributed tracing, auto-generated |
| `type` | int | Request type |
| `debug` | byte | Debug log level (bitmask) |
| `process` | StringBuilder | Execution process log |

Trigger priority: `id` > `scene` > `nid`.

Roam is also the core container for passing data between nodes. It is based on ConcurrentHashMap (thread-safe) and supports multi-level keys and reference syntax:

```java
// Basic read/write
roam.put("uid", 12345);
roam.getValue("uid");           // 12345

// Multi-level key (automatically builds nested structure)
roam.putDeep("user.level", 5); // {"user": {"level": 5}}
roam.getDeep("user.level");    // 5

// Reference syntax ("@" prefix fetches value from roam)
roam.resolve("@uid");          // 12345 (fetches the value of uid from roam)
roam.resolve("hello");         // "hello" (non-@ prefix returns the raw value)
```

## Forward Nodes

Forward nodes are a mechanism to simplify configuration. When a relation node and a condition node always appear as a pair (AND-bound), the condition node can be set as a forward node of the target node:

![](/images/introduction/10-dark.png#dark)
![](/images/introduction/10-light.png#light)

Semantically equivalent to an AND connection, but reduces tree depth for cleaner configuration. When the forward node returns false, the main node will not execute.

## Common Node Capabilities

Every node (whether relation or leaf) supports the following configurations:

| Configuration | Description |
|--------------|-------------|
| **Time Window** | Sets the effective time range for a node. Nodes outside the time window are treated as non-existent |
| **Inverse** | Inverts the node's true result to false and vice versa (NONE is not affected) |
| **Error Handling** | Behavior when a node throws an error: terminate the flow (default) or return a specified state to continue |
| **Node Reuse** | The same node ID can appear in multiple trees; modifying it once takes effect everywhere |

### Time Windows and Testing

Time window configuration makes nodes automatically inactive outside specified time periods. Combined with a None-type time modification node, you can easily test rules that only take effect in the future:

![](/images/introduction/8-dark.png#dark)
![](/images/introduction/8-light.png#light)

Insert a TimeChangeNone node to modify the requestTime in the pack, and subsequent nodes will execute based on the modified time -- no need to wait for the campaign to actually begin.

## Next Steps

- [Getting Started](/en/guide/getting-started.html) -- Deploy and run your first rule in 5 minutes
- [Architecture](/en/guide/architecture.html) -- Understand how Server + Client + shared storage works
- [Java SDK](/en/sdk/java.html) | [Go SDK](/en/sdk/go.html) | [Python SDK](/en/sdk/python.html) -- Integration guides for each language
- [Node Type Reference](/en/reference/node-types.html) -- Complete behavior reference for all relation and leaf nodes

### Video Tutorial

Full video tutorial: [Bilibili](https://www.bilibili.com/video/BV1hg411A7jx)
