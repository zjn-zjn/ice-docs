---
title: Python SDK
description: Complete guide for Ice Rule Engine Python SDK
head:
  - - meta
    - name: keywords
      content: ice,python,rule-engine,decision-engine,SDK
---

# Python SDK

Python implementation of the Ice rule engine, fully compatible with Java and Go SDKs.

## Installation

```bash
pip install ice-rules
```

**Requirements:** Python >= 3.11

## Quick Start

### 1. Define Leaf Nodes

Use the `@ice.leaf` decorator to register leaf nodes, with `IceField` for field descriptions and `alias` for multi-language compatibility:

```python
import ice
from ice import Roam, IceField, IceIgnore
from typing import Annotated

@ice.leaf(
    "com.example.ScoreFlow",
    name="Score Check",
    desc="Check if score meets threshold",
    alias=["score_flow"]  # Alias for multi-language compatibility
)
class ScoreFlow:
    """Check if score meets threshold"""
    # Use Annotated + IceField for field descriptions (recommended)
    threshold: Annotated[int, IceField(name="Threshold", desc="Score threshold")] = 0
    key: Annotated[str, IceField(name="Key", desc="Key to get value from roam")] = "score"
    
    def do_roam_flow(self, roam: Roam) -> bool:
        return roam.get_int(self.key, 0) >= self.threshold


@ice.leaf("com.example.AmountResult", name="Amount Calc", desc="Calculate amount based on score")
class AmountResult:
    """Calculate reward amount"""
    multiplier: Annotated[float, IceField(name="Multiplier", desc="Calculation multiplier")] = 1.0
    
    def do_roam_result(self, roam: Roam) -> bool:
        score = roam.get_int("score", 0)
        roam.put("amount", score * self.multiplier)
        return True


@ice.leaf("com.example.LogNone")
class LogNone:
    """Logging"""
    def do_roam_none(self, roam: Roam) -> None:
        print(f"Processing: {roam}")
```

### 2. Start Client (Synchronous)

```python
import ice
from ice import Pack

# Import modules containing leaf node definitions (ensures decorators are executed)
from my_flows import ScoreFlow, AmountResult

# Create and start client
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()

# Wait for startup
client.wait_started()

# Execute rules
pack = Pack(ice_id=1)
pack.roam.put("score", 85)

results = ice.sync_process(pack)

# Get results
for ctx in results:
    print(f"Amount: {ctx.pack.roam.get('amount')}")
    print(f"Process: {ctx.get_process_info()}")

# Shutdown
client.destroy()
```

### 3. Async Usage

```python
import asyncio
import ice
from ice import Pack

async def main():
    # Create async client
    client = ice.AsyncFileClient(app=1, storage_path="./ice-data")
    await client.start()
    
    # Execute rules
    pack = Pack(ice_id=1)
    pack.roam.put("score", 85)
    
    results = await ice.async_process(pack)
    
    for ctx in results:
        print(f"Amount: {ctx.pack.roam.get('amount')}")
    
    await client.destroy()

asyncio.run(main())
```

## Leaf Node Interfaces

Python SDK supports 9 leaf node interfaces with automatic type detection:

### Flow Type (returns True/False)

```python
@ice.leaf("com.example.Flow1")
class ContextFlow:
    def do_flow(self, ctx: ice.Context) -> bool:
        return ctx.pack.roam.get_int("score") > 60

@ice.leaf("com.example.Flow2")
class PackFlow:
    def do_pack_flow(self, pack: ice.Pack) -> bool:
        return pack.roam.get_int("score") > 60

@ice.leaf("com.example.Flow3")
class RoamFlow:
    def do_roam_flow(self, roam: ice.Roam) -> bool:
        return roam.get_int("score") > 60
```

### Result Type (returns True/False)

```python
@ice.leaf("com.example.Result1")
class ContextResult:
    def do_result(self, ctx: ice.Context) -> bool:
        ctx.pack.roam.put("result", "done")
        return True

@ice.leaf("com.example.Result2")
class PackResult:
    def do_pack_result(self, pack: ice.Pack) -> bool:
        pack.roam.put("result", "done")
        return True

@ice.leaf("com.example.Result3")
class RoamResult:
    def do_roam_result(self, roam: ice.Roam) -> bool:
        roam.put("result", "done")
        return True
```

### None Type (no return value)

```python
@ice.leaf("com.example.None1")
class ContextNone:
    def do_none(self, ctx: ice.Context) -> None:
        print(f"Processing {ctx.ice_id}")

@ice.leaf("com.example.None2")
class PackNone:
    def do_pack_none(self, pack: ice.Pack) -> None:
        print(f"TraceId: {pack.trace_id}")

@ice.leaf("com.example.None3")
class RoamNone:
    def do_roam_none(self, roam: ice.Roam) -> None:
        print(f"Score: {roam.get('score')}")
```

## Roam Data Structure

`Roam` is a thread-safe dictionary for business data:

```python
from ice import Roam

roam = Roam()

# Basic operations
roam.put("key", "value")
roam.put_multi({"a": 1, "b": 2})
value = roam.get("key")
value = roam.get("key", "default")

# Multi-level key access
roam.put("user", {"name": "test", "profile": {"age": 25}})
name = roam.get_multi("user.name")  # "test"
age = roam.get_multi("user.profile.age")  # 25

# Reference other keys
roam.put("score", 100)
roam.put("ref", "@score")
value = roam.get_union(roam.get("ref"))  # 100

# Type-safe getters
roam.get_str("key", "")
roam.get_int("key", 0)
roam.get_float("key", 0.0)
roam.get_bool("key", False)
roam.get_list("key")
roam.get_dict("key")
```

## Client Configuration

### Basic

```python
# Simplest way
client = ice.FileClient(app=1, storage_path="./ice-data")
```

### Full Configuration

```python
client = ice.FileClient(
    app=1,                      # App ID
    storage_path="./ice-data",  # Storage path (shared with ice-server)
    parallelism=-1,             # Parallelism (-1 = CPU count)
    poll_interval=5.0,          # Poll interval (seconds)
    heartbeat_interval=30.0,    # Heartbeat interval (seconds)
)
```

### Lifecycle

```python
# Start
client.start()

# Wait for startup (optional)
client.wait_started(timeout=30.0)

# Check version
print(f"Loaded version: {client.loaded_version}")

# Shutdown
client.destroy()
```

## Custom Logger

```python
from ice.log import Logger, set_logger
from typing import Any


class MyLogger(Logger):
    def debug(self, msg: str, **kwargs: Any) -> None:
        print(f"[DEBUG] {msg} {kwargs}")
    
    def info(self, msg: str, **kwargs: Any) -> None:
        print(f"[INFO] {msg} {kwargs}")
    
    def warn(self, msg: str, **kwargs: Any) -> None:
        print(f"[WARN] {msg} {kwargs}")
    
    def error(self, msg: str, **kwargs: Any) -> None:
        print(f"[ERROR] {msg} {kwargs}")


# Set custom logger
set_logger(MyLogger())
```

## Field Description & Ignore

### Field Description (IceField)

Use `typing.Annotated` and `IceField` to add field descriptions:

```python
from typing import Annotated
from ice import IceField

@ice.leaf("com.example.MyNode")
class MyNode:
    # iceField - Show name and description in UI
    score: Annotated[float, IceField(name="Threshold", desc="Score threshold")] = 0.0
    key: Annotated[str, IceField(name="Key", desc="Key to get value from roam")] = ""
    
    # hideField - No IceField, configurable but hidden
    internal: str = ""
```

### Field Ignore (IceIgnore)

Fields that should not be configurable can be ignored:

```python
from typing import Annotated, Any
from ice import IceIgnore

@ice.leaf("com.example.MyNode")
class MyNode:
    # Method 1: _ prefix - Private fields automatically ignored
    _cache: dict = None
    
    # Method 2: IceIgnore - Explicitly ignore
    service: Annotated[Any, IceIgnore()] = None
```

### Alias

Support multi-language compatible configuration:

```python
@ice.leaf(
    "com.example.ScoreFlow",
    alias=["score_flow", "ScoreFlow"]  # Respond to multiple class names
)
class ScoreFlow:
    ...
```

## Compatibility

- Can share `ice-data` directory with Java/Go SDKs
- JSON serialization format is consistent
- Node types and relation semantics are consistent

## Complete Example

```python
import ice
from ice import Roam, Pack

# Define leaf nodes
@ice.leaf("com.example.ScoreCheck")
class ScoreCheck:
    threshold: int = 60
    
    def do_roam_flow(self, roam: Roam) -> bool:
        return roam.get_int("score", 0) >= self.threshold


@ice.leaf("com.example.CalculateReward")
class CalculateReward:
    rate: float = 0.1
    
    def do_roam_result(self, roam: Roam) -> bool:
        score = roam.get_int("score", 0)
        roam.put("reward", score * self.rate)
        return True


def main():
    # Start client
    client = ice.FileClient(app=1, storage_path="./ice-data")
    client.start()
    client.wait_started()
    
    try:
        # Execute rules
        pack = Pack(ice_id=1)
        pack.roam.put("score", 85)
        pack.roam.put("userId", "user123")
        
        results = ice.sync_process(pack)
        
        for ctx in results:
            reward = ctx.pack.roam.get("reward")
            if reward:
                print(f"User reward: {reward}")
            else:
                print("Score too low, no reward")
            
            # Print execution process
            print(f"Process: {ctx.get_process_info()}")
    finally:
        client.destroy()


if __name__ == "__main__":
    main()
```

## Requirements

- Python >= 3.11
- No external dependencies (pure standard library)

## License

Apache-2.0

