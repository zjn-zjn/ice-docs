---
title: Client Config
description: Complete configuration parameter reference for Ice Client SDK, including initialization parameters for Java, Go, and Python.
keywords: Client configuration,IceFileClient,Client parameters,poll interval,heartbeat interval,lane
head:
  - - meta
    - property: og:title
      content: Client Configuration Reference - Ice Rule Engine
  - - meta
    - property: og:description
      content: Complete configuration parameter reference for Ice Client SDK.
---

# Client Configuration Reference

> Ice Client is configured through constructor parameters. The following parameters have consistent semantics across the Java, Go, and Python SDKs.

## Common Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `app` | int | Yes | -- | App ID, corresponding to the App created in Server |
| `storagePath` | string | Yes | -- | Shared storage path, must point to the same `ice-data` directory as Server |
| `scan` | string | Java only | -- | Leaf node scan package path. Go/Python use explicit registration and do not need this parameter |
| `parallelism` | int | No | -1 | Thread pool size for parallel nodes. <=0 uses framework default |
| `pollInterval` | int/Duration | No | 2s | Version file poll interval |
| `heartbeatInterval` | int/Duration | No | 10s | Heartbeat reporting interval |
| `lane` | string | No | empty | Lane name. Empty string means main trunk. Used for traffic isolation and branch testing |

## Initialization Examples

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
// Minimal setup
IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");

// Full parameters
IceFileClient client = new IceFileClient(
    1,                              // app
    "./ice-data",                   // storagePath
    -1,                             // parallelism
    Set.of("com.pkg1", "com.pkg2"), // scan (multiple packages)
    2,                              // pollInterval (seconds)
    10                              // heartbeatInterval (seconds)
);

// With lane
IceFileClient client = IceFileClient.newWithLane(
    1, "./ice-data", "com.your.package", "feature-xxx"
);

// Lifecycle
client.start();
client.waitStarted();
client.destroy();
```

  </CodeGroupItem>
  <CodeGroupItem title="Go">

```go
// Minimal setup
client, _ := ice.NewClient(1, "./ice-data")

// Full parameters
client, _ := ice.NewClientWithOptions(
    1,                  // app
    "./ice-data",       // storagePath
    -1,                 // parallelism
    2*time.Second,      // pollInterval
    10*time.Second,     // heartbeatInterval
    "",                 // lane
)

// With lane
client, _ := ice.NewWithLane(1, "./ice-data", "feature-xxx")

// Lifecycle
client.Start()
client.WaitStarted()
client.GetLoadedVersion()
client.Destroy()
```

  </CodeGroupItem>
  <CodeGroupItem title="Python">

```python
# Synchronous client
client = ice.FileClient(
    app=1,
    storage_path="./ice-data",
    poll_interval=2,
    heartbeat_interval=10,
)
client.start()
client.wait_started()
client.destroy()

# Asynchronous client
client = ice.AsyncFileClient(app=1, storage_path="./ice-data")
await client.start()
await client.destroy()
```

  </CodeGroupItem>
</CodeGroup>

## Lane

Lanes are used for traffic isolation and are suitable for the following scenarios:
- Branch isolation testing in development environments
- A/B testing with different rule versions
- Canary releases

A Client with a lane configured will prioritize loading lane-specific configurations; nodes not configured in the lane fall back to the main trunk configuration.
