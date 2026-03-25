---
title: Node Types
description: Complete reference for all node types in the Ice rule engine, including 5 relation node types (serial + parallel) and 3 leaf node types with their behavior definitions.
keywords: node types,relation nodes,leaf nodes,AND,ANY,ALL,Flow,Result,None,parallel nodes
---

# Node Type Reference

## Relation Nodes

Relation nodes control how child nodes are executed and how results are aggregated. Each type has both serial and parallel versions.

### Serial Relation Nodes

| Type | Execution | Child returns true | Child returns false | No children |
|------|-----------|-------------------|---------------------|-------------|
| **AND** | Sequential, **short-circuits** on false | All true -> true | Any false -> false (returns immediately) | none |
| **ANY** | Sequential, **short-circuits** on true | Any true -> true (returns immediately) | All false -> false | none |
| **ALL** | **Executes all**, no short-circuit | Has true and no false -> true | Any false -> false | none |
| **NONE** | **Executes all** | Always returns **none** | Always returns **none** | none |
| **TRUE** | **Executes all** | Always returns **true** | Always returns **true** | true |

::: tip Return Value Notes
- When all child nodes return none, AND / ANY / ALL all return none
- TRUE is the only relation node that returns true even with no children
- none means "does not participate in evaluation" and is not equivalent to true or false
:::

### Parallel Relation Nodes

Each serial relation node has a corresponding parallel version that submits child nodes to a thread pool or goroutine pool for concurrent execution:

| Type | Concurrency Strategy |
|------|---------------------|
| **ParallelAnd** | Executes all children concurrently. **Returns early** when any completes with false |
| **ParallelAny** | Executes all children concurrently. **Returns early** when any completes with true |
| **ParallelAll** | Executes all children concurrently. **Waits for all** to complete before returning |
| **ParallelNone** | Executes all children concurrently. Waits for all to complete, always returns none |
| **ParallelTrue** | Executes all children concurrently. Waits for all to complete, always returns true |

::: warning Note
Child nodes of parallel nodes should not have data dependencies on each other. Each child node uses a shallow copy of the Roam; writing to the same key may cause race conditions.
:::

## Leaf Nodes

Leaf nodes are the terminal nodes that execute business logic.

| Type | Return Value | Purpose | Typical Scenarios |
|------|-------------|---------|-------------------|
| **Flow** | true / false | Conditional checks that control flow direction | Amount validation, level checks, time filtering, permission checks |
| **Result** | true / false | Execute business operations and return results | Issue coupons, deduct inventory, send notifications, call external APIs |
| **None** | none (does not affect flow) | Auxiliary operations | Query user info, logging, data assembly, cache warming |

### Language Implementation

| Language | Flow | Result | None |
|----------|------|--------|------|
| **Java** | `BaseLeafFlow` | `BaseLeafResult` | `BaseLeafNone` |
| **Go** | `DoFlow(ctx, roam)` | `DoResult(ctx, roam)` | `DoNone(ctx, roam)` |
| **Python** | `do_flow(roam)` | `do_result(roam)` | `do_none(roam)` |

## Common Node Configuration

All nodes (both relation and leaf) share the following configurations:

| Configuration | Description | Default |
|--------------|-------------|---------|
| **Time Window** | Effective time range for the node. Nodes outside the window return none and are treated as non-existent | Unrestricted |
| **Inverse** | Inverts true to false and vice versa. none is not affected | false |
| **Forward Node** | When the forward node returns false, the main node is not executed and directly returns false. Semantically equivalent to an AND connection | None |
| **Error Handling** | Behavior when a node throws an error: SHUT_DOWN (terminate flow) or return a specified state to continue | SHUT_DOWN |
| **Debug Flag** | Whether to record this node's execution information in processInfo | false |

## Execution Flow

Each node's `process()` method executes in the following order:

1. **Time window check** -> Returns none if outside the window
2. **Forward node execution** -> Refuses execution if forward node returns false
3. **Self logic execution** -> Relation node traverses children / leaf node executes business logic
4. **Inverse processing** -> If inverse is configured, flips true/false
5. **Error handling** -> Handles exceptions according to the configured strategy
