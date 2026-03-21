---
title: Roam API
description: IceRoam 数据容器的完整 API 参考，包括基础读写、多级 key、引用语法等操作在 Java、Go、Python 三种语言中的用法。
keywords: IceRoam,数据容器,Roam API,多级key,引用语法,getDeep,putDeep
head:
  - - meta
    - property: og:title
      content: Roam API 参考 - Ice 规则引擎数据容器
  - - meta
    - property: og:description
      content: IceRoam 数据容器的完整 API 参考。
---

# Roam API

> Roam 是节点间传递数据的核心容器。线程安全，支持多级 key 和引用语法。

## 实现基础

| 语言 | 底层实现 | 线程安全机制 |
|------|---------|------------|
| Java | `ConcurrentHashMap<String, Object>` | CAS + 分段锁 |
| Go | `sync.RWMutex` + `map[string]any` | 读写锁 |
| Python | `threading.RLock` + `dict` | 可重入锁 |

## 基础读写

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.put("uid", 12345);
roam.get("uid");              // Object: 12345
roam.putValue("score", 85.0);
roam.getValue("score");       // 85.0（免强转）
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
roam.Put("uid", 12345)
roam.Get("uid")               // any: 12345
// 通过 Value 流式 API 进行类型化访问：
roam.Value("uid").Int()       // int: 12345
roam.Value("score").Float64() // float64
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
roam.put("uid", 12345)
roam.get("uid")               # 12345
roam.get("uid", 0)            # 带默认值
```

  </CodeGroupItem>
</CodeGroup>

## 多级 key

使用 `.` 分隔的 key 自动构建嵌套数据结构：

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.putDeep("user.profile.level", 5);
// 内部结构：{"user": {"profile": {"level": 5}}}

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

### 列表遍历

多级 key 中的数字片段可以读取已有 list/array 的元素。注意：`putDeep` 使用数字片段时会创建嵌套 map（以数字字符串为 key），而不会创建 list。

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
// 先将列表放入 roam
List<Map<String, Object>> items = new ArrayList<>();
items.add(Map.of("name", "phone"));
items.add(Map.of("name", "laptop"));
roam.put("items", items);

// 然后按索引访问
roam.getDeep("items.0.name"); // "phone"
roam.getDeep("items.1.name"); // "laptop"
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
// 先将列表放入 roam
items := []map[string]any{
    {"name": "phone"},
    {"name": "laptop"},
}
roam.Put("items", items)

// 然后按索引访问
roam.GetDeep("items.0.name") // "phone"
roam.GetDeep("items.1.name") // "laptop"
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
# 先将列表放入 roam
items = [{"name": "phone"}, {"name": "laptop"}]
roam.put("items", items)

# 然后按索引访问
roam.get_deep("items.0.name")  # "phone"
roam.get_deep("items.1.name")  # "laptop"
```

  </CodeGroupItem>
</CodeGroup>

## 引用语法

`@` 前缀表示从 Roam 中间接取值。非 `@` 前缀返回参数自身：

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.put("uid", 12345);

roam.resolve("uid");     // "uid"（字符串原值）
roam.resolve("@uid");    // 12345（从 roam 获取 uid 的值）
roam.resolve(100);       // 100（非字符串直接返回）

// 链式引用
roam.put("ref", "@uid");
roam.resolve("@ref");    // 12345（先取 ref="@uid"，再取 uid=12345）
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

::: tip 引用语法的用途
在 Server 配置界面中，叶子节点的字段值可以设为 `@key` 形式，实现从 Roam 动态取值，而非硬编码。
:::

## `_ice` 保留 key

`"_ice"` 是 Roam 中的保留 key，用于存储执行元数据（IceMeta）。用户无法通过 `put`/`putDeep` 覆盖它。

IceMeta 包含以下字段：`id`、`scene`、`confId`、`ts`、`trace`、`type`、`debug`、`process`。

各语言提供便捷访问方法：

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
roam.getIceId();     // 执行 ID
roam.getIceScene();  // 场景
roam.getIceTs();     // 时间戳
// 其他：getIceConfId(), getIceTrace(), getIceType(), getIceDebug(), getIceProcess()
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
meta := roam.GetMeta()
meta.Id      // 执行 ID
meta.Scene   // 场景
meta.Ts      // 时间戳
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
meta = roam.get_meta()
meta.id       # 执行 ID
meta.scene    # 场景
meta.conf_id  # 配置 ID（注意 Python 使用 snake_case）
meta.ts       # 时间戳
```

  </CodeGroupItem>
</CodeGroup>

## Go Value 流式 API

`Value()`/`ValueDeep()` 返回 `RoamValue`，提供链式类型转换方法：

```go
roam.Value("score").Int()           // int
roam.Value("score").IntOr(0)        // int，不存在时返回默认值
roam.Value("score").Int64()         // int64
roam.Value("score").Int64Or(0)      // int64，不存在时返回默认值
roam.Value("name").String()         // string
roam.Value("name").StringOr("N/A")  // string，带默认值
roam.Value("rate").Float64()        // float64
roam.Value("rate").Float64Or(0.0)   // float64，不存在时返回默认值
roam.Value("active").Bool()         // bool
roam.Value("active").BoolOr(false)  // bool，不存在时返回默认值
roam.Value("key").Exists()          // 是否存在
roam.Value("key").Raw()             // 原始 any 值

// 深层访问
roam.ValueDeep("user.profile.level").Int()
roam.ValueDeep("user.profile.level").IntOr(1)

// 绑定到指针
var level int
roam.Value("level").To(&level)
```

## cloneRoam

浅拷贝 Roam：复制业务数据并创建新的 IceMeta process 缓冲区。主要用于并行 handler 执行时的数据隔离。

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

## 完整方法列表

### Java (IceRoam)

| 方法 | 说明 |
|------|------|
| `put(key, value)` | 写入值。value 为 null 时移除 key |
| `get(key)` | 读取值，返回 Object |
| `putValue(key, value)` | 写入值（泛型免强转） |
| `getValue(key)` | 读取值（泛型免强转） |
| `putDeep(multiKey, value)` | 按 `.` 分隔写入嵌套结构 |
| `getDeep(multiKey)` | 按 `.` 分隔读取嵌套值 |
| `resolve(union)` | 引用语法：`@` 前缀从 roam 取值 |
| `getIceId()` | 获取执行 ID |
| `getIceScene()` | 获取场景 |
| `getIceTs()` | 获取时间戳 |
| `cloneRoam()` | 浅拷贝 Roam（并行执行时使用） |

### Go (Roam)

| 方法 | 说明 |
|------|------|
| `Put(key, value)` | 写入值 |
| `Get(key)` | 读取值，返回 any |
| `PutDeep(multiKey, value)` | 嵌套写入 |
| `GetDeep(multiKey)` | 嵌套读取 |
| `Resolve(union)` | 引用语法 |
| `Data()` | 返回数据副本（排除 _ice） |
| `String()` | JSON 格式输出 |
| `Value(key)` | 返回 RoamValue，支持链式类型转换 |
| `ValueDeep(multiKey)` | 深层访问，返回 RoamValue |
| `GetMeta()` | 获取 IceMeta 元数据 |
| `Clone()` | 浅拷贝 Roam（并行执行时使用） |

### Python (Roam)

| 方法 | 说明 |
|------|------|
| `put(key, value)` | 写入值 |
| `get(key, default=None)` | 读取值 |
| `put_deep(key, value)` | 嵌套写入 |
| `get_deep(key, default=None)` | 嵌套读取 |
| `resolve(union)` | 引用语法 |
| `contains(key)` | 是否包含 key |
| `remove(key)` | 移除 key |
| `keys()` | 所有 key |
| `to_dict()` | 转为 dict |
| `get_meta()` | 获取 IceMeta 元数据 |
| `clone()` | 浅拷贝 Roam（并行执行时使用） |
