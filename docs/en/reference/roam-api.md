---
title: Roam API
description: Complete API reference for the IceRoam data container, including basic read/write, multi-level keys, and reference syntax across Java, Go, and Python.
keywords: IceRoam,data container,Roam API,multi-level key,reference syntax,getDeep,putDeep
head:
  - - meta
    - property: og:title
      content: Roam API Reference - Ice Rule Engine Data Container
  - - meta
    - property: og:description
      content: Complete API reference for the IceRoam data container.
---

# Roam API

> Roam is the core container for passing data between nodes. Thread-safe, with support for multi-level keys and reference syntax.

## Implementation Basis

| Language | Underlying Implementation | Thread Safety Mechanism |
|----------|--------------------------|------------------------|
| Java | `ConcurrentHashMap<String, Object>` | CAS + segmented locks |
| Go | `sync.RWMutex` + `map[string]any` | Read-write lock |
| Python | `threading.RLock` + `dict` | Reentrant lock |

## Basic Read/Write

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.put("uid", 12345);
roam.get("uid");              // Object: 12345
roam.putValue("score", 85.0);
roam.getValue("score");       // 85.0 (no cast needed)
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
roam.Put("uid", 12345)
roam.Get("uid")               // any: 12345
// Typed access via Value fluent API:
roam.Value("uid").Int()       // int: 12345
roam.Value("score").Float64() // float64
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
roam.put("uid", 12345)
roam.get("uid")               # 12345
roam.get("uid", 0)            # with default
```

  </CodeGroupItem>
</CodeGroup>

## Multi-Level Keys

Keys separated by `.` automatically build nested data structures:

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.putDeep("user.profile.level", 5);
// Internal structure: {"user": {"profile": {"level": 5}}}

roam.getDeep("user.profile.level"); // 5
roam.getDeep("user.profile");       // {"level": 5}
roam.getDeep("user");               // {"profile": {"level": 5}}
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
roam.PutDeep("user.profile.level", 5)

roam.GetDeep("user.profile.level") // 5
roam.GetDeep("user.profile")       // map[string]any{"level": 5}
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
roam.put_deep("user.profile.level", 5)

roam.get_deep("user.profile.level")  # 5
roam.get_deep("user.profile")        # {"level": 5}
```

  </CodeGroupItem>
</CodeGroup>

### List Traversal

Numeric segments in multi-level keys can read elements from existing lists/arrays. Note: `putDeep` with numeric segments creates nested maps (with numeric strings as keys), not lists.

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
// First, put a list into roam
List<Map<String, Object>> items = new ArrayList<>();
items.add(Map.of("name", "phone"));
items.add(Map.of("name", "laptop"));
roam.put("items", items);

// Then access by index
roam.getDeep("items.0.name"); // "phone"
roam.getDeep("items.1.name"); // "laptop"
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
// First, put a list into roam
items := []map[string]any{
    {"name": "phone"},
    {"name": "laptop"},
}
roam.Put("items", items)

// Then access by index
roam.GetDeep("items.0.name") // "phone"
roam.GetDeep("items.1.name") // "laptop"
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
# First, put a list into roam
items = [{"name": "phone"}, {"name": "laptop"}]
roam.put("items", items)

# Then access by index
roam.get_deep("items.0.name")  # "phone"
roam.get_deep("items.1.name")  # "laptop"
```

  </CodeGroupItem>
</CodeGroup>

## Reference Syntax

The `@` prefix indicates indirect value retrieval from Roam. Non-`@` prefixed values are returned as-is:

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.put("uid", 12345);

roam.resolve("uid");     // "uid" (raw string value)
roam.resolve("@uid");    // 12345 (fetches the value of uid from roam)
roam.resolve(100);       // 100 (non-string returned directly)

// Chained reference
roam.put("ref", "@uid");
roam.resolve("@ref");    // 12345 (first gets ref="@uid", then gets uid=12345)
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
roam.Put("uid", 12345)

roam.Resolve("uid")      // "uid"
roam.Resolve("@uid")     // 12345
roam.Resolve(100)        // 100
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
roam.put("uid", 12345)

roam.resolve("uid")     # "uid"
roam.resolve("@uid")    # 12345
roam.resolve(100)       # 100
```

  </CodeGroupItem>
</CodeGroup>

::: tip Use Cases for Reference Syntax
In the Server configuration interface, leaf node field values can be set as `@key` to dynamically retrieve values from Roam instead of hardcoding them.
:::

## `_ice` Reserved Key

`"_ice"` is a reserved key in Roam that stores execution metadata (IceMeta). Users cannot overwrite it via `put`/`putDeep`.

IceMeta contains the following fields: `id`, `scene`, `nid`, `ts`, `trace`, `type`, `debug`, `process`.

Each language provides convenience accessors:

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.getIceId();     // Execution ID
roam.getIceScene();  // Scene
roam.getIceTs();     // Timestamp
// Also: getIceConfId(), getIceTrace(), getIceType(), getIceDebug(), getIceProcess()
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
meta := roam.GetMeta()
meta.Id      // Execution ID
meta.Scene   // Scene
meta.Ts      // Timestamp
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
meta = roam.get_meta()
meta.id       # Execution ID
meta.scene    # Scene
meta.nid      # Config ID
meta.ts       # Timestamp
```

  </CodeGroupItem>
</CodeGroup>

## Go Value Fluent API

`Value()`/`ValueDeep()` return a `RoamValue` with chainable typed getters:

```go
roam.Value("score").Int()           // int
roam.Value("score").IntOr(0)        // int, returns default if missing
roam.Value("score").Int64()         // int64
roam.Value("score").Int64Or(0)      // int64, returns default if missing
roam.Value("name").String()         // string
roam.Value("name").StringOr("N/A")  // string, with default
roam.Value("rate").Float64()        // float64
roam.Value("rate").Float64Or(0.0)   // float64, returns default if missing
roam.Value("active").Bool()         // bool
roam.Value("active").BoolOr(false)  // bool, returns default if missing
roam.Value("key").Exists()          // whether the key exists
roam.Value("key").Raw()             // raw any value

// Deep access
roam.ValueDeep("user.profile.level").Int()
roam.ValueDeep("user.profile.level").IntOr(1)

// Bind to pointer
var level int
roam.Value("level").To(&level)
```

## cloneRoam

Shallow-copies the Roam: copies business data and creates a fresh IceMeta process buffer. Primarily used for data isolation during parallel handler execution.

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
IceRoam cloned = roam.cloneRoam();
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
cloned := roam.Clone()
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
cloned = roam.clone()
```

  </CodeGroupItem>
</CodeGroup>

## Complete Method List

### Java (IceRoam)

| Method | Description |
|--------|-------------|
| `put(key, value)` | Write a value. Removes the key when value is null |
| `get(key)` | Read a value, returns Object |
| `putValue(key, value)` | Write a value (generic, no cast needed) |
| `getValue(key)` | Read a value (generic, no cast needed) |
| `putDeep(multiKey, value)` | Write nested structure using `.`-separated key |
| `getDeep(multiKey)` | Read nested value using `.`-separated key |
| `resolve(union)` | Reference syntax: `@` prefix fetches from roam |
| `getIceId()` | Get execution ID |
| `getIceScene()` | Get scene |
| `getIceTs()` | Get timestamp |
| `cloneRoam()` | Shallow copy Roam (used during parallel execution) |

### Go (Roam)

| Method | Description |
|--------|-------------|
| `Put(key, value)` | Write a value |
| `Get(key)` | Read a value, returns any |
| `PutDeep(multiKey, value)` | Nested write |
| `GetDeep(multiKey)` | Nested read |
| `Resolve(union)` | Reference syntax |
| `Data()` | Return data copy (excluding _ice) |
| `String()` | JSON-formatted output |
| `Value(key)` | Returns RoamValue with chainable typed getters |
| `ValueDeep(multiKey)` | Deep access, returns RoamValue |
| `GetMeta()` | Get IceMeta metadata |
| `Clone()` | Shallow copy Roam (used during parallel execution) |

### Python (Roam)

| Method | Description |
|--------|-------------|
| `put(key, value)` | Write a value |
| `get(key, default=None)` | Read a value |
| `put_deep(key, value)` | Nested write |
| `get_deep(key, default=None)` | Nested read |
| `resolve(union)` | Reference syntax |
| `contains(key)` | Check if key exists |
| `remove(key)` | Remove key |
| `keys()` | All keys |
| `to_dict()` | Convert to dict |
| `get_meta()` | Get IceMeta metadata |
| `clone()` | Shallow copy Roam (used during parallel execution) |
