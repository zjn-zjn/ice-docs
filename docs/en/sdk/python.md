---
title: Python SDK
description: Complete integration guide for the Ice Python SDK, including installation, decorator-based leaf node registration, synchronous/asynchronous execution, and AsyncFileClient.
keywords: Python SDK,Python rule engine,ice-rules,Python business orchestration,AsyncFileClient
head:
  - - meta
    - property: og:title
      content: Python SDK Guide - Ice Rule Engine Python Client
  - - meta
    - property: og:description
      content: Complete integration guide for the Ice Python SDK, supporting decorator registration and asyncio-based asynchronous execution.
---

# Python SDK

> Ice Python SDK (ice-rules), with full feature parity with the Java/Go SDKs. Supports decorator-based leaf node registration and asyncio-based async client.

## Installation

```bash
pip install ice-rules
```

## Quick Start

```python
import ice

# Register leaf node with decorator
@ice.leaf("com.example.ScoreFlow", name="Score Check")
class ScoreFlow:
    score: float = 0.0
    key: str = "score"

    def do_flow(self, roam):
        value = roam.get(self.key, 0.0)
        return value >= self.score

# Start Client
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()

# Execute rule
roam = ice.Roam.create(id=1)
roam.put("score", 85.0)
result = ice.sync_process(roam)
```

## Leaf Node Development

### Decorator Registration

```python
@ice.leaf(class_name, name=None, desc=None, order=0, alias=None)
```

- `class_name`: Node class name, corresponding to confName in Server configuration
- `name`: Node display name
- `desc`: Node description
- `alias`: List of aliases for compatibility with class names configured by other language SDKs

The SDK automatically detects the node type based on the implemented method:

| Type | Method | Return Value | Description |
|------|--------|-------------|-------------|
| **Flow** | `do_flow(roam)` | bool | Conditional check |
| **Result** | `do_result(roam)` | bool | Business operation |
| **None** | `do_none(roam)` | None | Auxiliary operation |

### Field Declaration

Use `Annotated` type hints to add field descriptions:

```python
from typing import Annotated

@ice.leaf("com.example.AmountResult", name="Amount Dispenser")
class AmountResult:
    key: Annotated[str, ice.IceField(name="User Key", desc="Key for user ID in roam")] = ""
    value: Annotated[float, ice.IceField(name="Dispense Amount")] = 0.0

    # Hidden from configuration interface
    _internal: str = ""  # Underscore prefix is automatically ignored

    def do_result(self, roam):
        uid = roam.get(self.key, 0)
        if uid <= 0 or self.value <= 0:
            return False
        return send_service.send_amount(uid, self.value)
```

`@ice.IceIgnore` is also supported for explicitly ignoring fields.

### Lifecycle Hooks

```python
@ice.leaf("com.example.MyNode")
class MyNode:
    exp: str = ""

    def after_properties_set(self):
        """Automatically called after configuration is loaded/updated"""
        self.compiled = compile_expression(self.exp)
```

## Executing Rules

### Synchronous Execution

```python
roam = ice.Roam.create(id=1)
roam.put("uid", 12345)

# Multiple calling styles
roam_list = ice.sync_process(roam)
result = ice.process_single_roam(roam)
results = ice.process_roam(roam)
```

### Asynchronous Execution

```python
import asyncio

roam = ice.Roam.create(id=1)
roam.put("uid", 12345)
roam_list = await ice.async_process(roam)
```

### Trigger Methods

```python
roam = ice.Roam.create(id=1)              # By iceId
roam = ice.Roam.create(scene="recharge")  # By scene
roam = ice.Roam.create(nid=123)           # By node ID
```

Priority: `ice_id` > `scene` > `nid`.

## Roam Operations

Roam is based on `threading.RLock` and is thread-safe:

```python
roam = ice.Roam()

# Basic operations
roam.put("name", "Alice")
name = roam.get("name")
age = roam.get("age", 0)
score = roam.get("score", 0.0)
flag = roam.get("flag", False)

# Multi-level key
roam.put_deep("user.profile.level", 5)
level = roam.get_deep("user.profile.level")

# Reference syntax
roam.resolve("@user.profile.level")  # 5
```

## Client Configuration

### Synchronous Client

```python
client = ice.FileClient(
    app=1,
    storage_path="./ice-data",
    poll_interval=2,          # Version poll interval (seconds), default 2
    heartbeat_interval=10,    # Heartbeat interval (seconds), default 10
)
client.start()
client.wait_started()
client.destroy()
```

### Asynchronous Client

```python
client = ice.AsyncFileClient(
    app=1,
    storage_path="./ice-data",
)
await client.start()
await client.wait_started()
await client.destroy()
```

AsyncFileClient uses `asyncio.create_task()` to manage background tasks, with file I/O executed via `asyncio.to_thread()`.

## Error Handling

### Global Error Handler

```python
def my_error_handler(node, ctx, error):
    print(f"Node {node.ice_node_id} execution error: {error}")
    return ice.RunState.NONE  # Continue execution

ice.set_global_error_handler(my_error_handler)
```

### Node-Level Error Handling

```python
@ice.leaf("com.example.SafeNode")
class SafeNode:
    def do_result(self, roam):
        # Business logic
        pass

    def error_handle(self, ctx, error):
        return ice.RunState.NONE  # Ignore error, continue execution
```

## Next Steps

- [Java SDK](/en/sdk/java.html) | [Go SDK](/en/sdk/go.html) -- Other language SDKs
- [Node Type Reference](/en/reference/node-types.html) -- All relation and leaf node types
- [Roam API](/en/reference/roam-api.html) -- Complete data container API
