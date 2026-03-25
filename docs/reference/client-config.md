---
title: Client 配置
description: Ice Client SDK 的完整配置参数参考，包括 Java、Go、Python 三种语言的初始化参数说明。
keywords: Client配置,IceFileClient,Client参数,轮询间隔,心跳间隔,泳道
---

# Client 配置参考

> Ice Client 通过构造函数参数配置。以下参数在 Java、Go、Python SDK 中语义一致。

## 通用参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `app` | int | 是 | — | 应用 ID，对应 Server 中创建的 App |
| `storagePath` | string | 是 | — | 共享存储路径，必须和 Server 指向同一个 `ice-data` 目录 |
| `scan` | string | Java 必填 | — | 叶子节点扫描包路径。Go/Python 使用显式注册，不需要此参数 |
| `parallelism` | int | 否 | -1 | 并行节点的线程池大小。≤0 使用框架默认配置 |
| `pollInterval` | int/Duration | 否 | 2s | 版本文件轮询间隔 |
| `heartbeatInterval` | int/Duration | 否 | 10s | 心跳上报间隔 |
| `lane` | string | 否 | 空 | 泳道名称。空字符串表示主干。用于流量隔离和分支测试 |

## 初始化示例

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
// 最简方式
IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");

// 完整参数
IceFileClient client = new IceFileClient(
    1,                              // app
    "./ice-data",                   // storagePath
    -1,                             // parallelism
    Set.of("com.pkg1", "com.pkg2"), // scan（多个包）
    2,                              // pollInterval（秒）
    10                              // heartbeatInterval（秒）
);

// 带泳道
IceFileClient client = IceFileClient.newWithLane(
    1, "./ice-data", "com.your.package", "feature-xxx"
);

// 生命周期
client.start();
client.waitStarted();
client.destroy();
```

  </CodeGroupItem>
  <CodeGroupItem title="Go">

```go
// 最简方式
client, _ := ice.NewClient(1, "./ice-data")

// 完整参数
client, _ := ice.NewClientWithOptions(
    1,                  // app
    "./ice-data",       // storagePath
    -1,                 // parallelism
    2*time.Second,      // pollInterval
    10*time.Second,     // heartbeatInterval
    "",                 // lane
)

// 带泳道
client, _ := ice.NewWithLane(1, "./ice-data", "feature-xxx")

// 生命周期
client.Start()
client.WaitStarted()
client.GetLoadedVersion()
client.Destroy()
```

  </CodeGroupItem>
  <CodeGroupItem title="Python">

```python
# 同步客户端
client = ice.FileClient(
    app=1,
    storage_path="./ice-data",
    poll_interval=2,
    heartbeat_interval=10,
)
client.start()
client.wait_started()
client.destroy()

# 异步客户端
client = ice.AsyncFileClient(app=1, storage_path="./ice-data")
await client.start()
await client.destroy()
```

  </CodeGroupItem>
</CodeGroup>

## 泳道（Lane）

泳道用于流量隔离，适用于以下场景：
- 开发环境的分支隔离测试
- A/B 测试不同规则版本
- 灰度发布

带泳道的 Client 会优先加载泳道配置，泳道中未配置的节点回退到主干配置。
