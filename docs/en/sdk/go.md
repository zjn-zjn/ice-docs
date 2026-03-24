---
title: Go SDK
description: Complete integration guide for the Ice Go SDK, including installation, leaf node registration, rule execution, Context integration, and logging configuration.
keywords: Go SDK,Golang rule engine,ice-go,Go rule engine,Go hot reload,Ice Go client
head:
  - - meta
    - property: og:title
      content: Go SDK Guide - Ice Rule Engine Go Client
  - - meta
    - property: og:description
      content: Complete integration guide for the Ice Go SDK, with full feature parity with the Java SDK.
---

# Go SDK

> Ice Go SDK, with full feature parity with the Java SDK. Native support for context.Context, integrating trace and timeout control.

## Installation

Requires Go 1.21+.

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    "log"

    ice "github.com/zjn-zjn/ice/sdks/go"
    icecontext "github.com/zjn-zjn/ice/sdks/go/context"
)

// Define a leaf node
type ScoreFlow struct {
    Score float64 `json:"score" ice:"name:Score Threshold,desc:Threshold for score evaluation"`
    Key   string  `json:"key" ice:"name:Value Key,desc:Key to retrieve value from roam"`
}

func (s *ScoreFlow) DoFlow(ctx context.Context, roam *icecontext.Roam) bool {
    value := roam.Value(s.Key).Float64Or(0)
    return value >= s.Score
}

func init() {
    ice.RegisterLeaf("com.example.ScoreFlow",
        &ice.LeafMeta{Name: "Score Check", Desc: "Check if score meets threshold"},
        func() any { return &ScoreFlow{} })
}

func main() {
    client, err := ice.NewClient(1, "./ice-data")
    if err != nil {
        log.Fatal(err)
    }
    client.Start()
    defer client.Destroy()

    roam := ice.NewRoam()
    roam.SetId(1)
    roam.Put("score", 85.0)
    roams := ice.SyncProcess(context.Background(), roam)

    for _, r := range roams {
        fmt.Println("Result:", r.Data())
    }
}
```

## Leaf Node Development

### Registration

The Go SDK uses explicit registration (not annotation scanning):

```go
ice.RegisterLeaf(className string, meta *LeafMeta, factory func() any)
```

- `className`: Node class name, corresponding to confName in Server configuration
- `meta`: Node metadata (name, description, aliases), can be nil
- `factory`: Factory function to create node instances

### 3 Node Interfaces

All interfaces take `context.Context` as their first parameter:

| Type | Interface Method | Return Value | Description |
|------|-----------------|-------------|-------------|
| **Flow** | `DoFlow(ctx, roam)` | bool | Conditional check |
| **Result** | `DoResult(ctx, roam)` | bool | Business operation |
| **None** | `DoNone(ctx, roam)` | — | Auxiliary operation |

The SDK automatically detects which interface is implemented during registration; no manual type specification needed.

### Field Configuration

Use the `ice` struct tag to add field descriptions:

```go
type MyNode struct {
    Score float64 `json:"score" ice:"name:Score Threshold,desc:Threshold for score evaluation"`
    Key   string  `json:"key" ice:"name:Value Key"`

    // Hidden from configuration interface
    Service *http.Client `json:"-"`          // json:"-" excludes from serialization
    Cache   map[string]any `json:"cache" ice:"-"` // ice:"-" hides from config
}
```

### Aliases (Cross-Language Compatibility)

```go
ice.RegisterLeaf("com.example.ScoreFlow",
    &ice.LeafMeta{
        Alias: []string{"score_flow", "ScoreFlow"},
    },
    func() any { return &ScoreFlow{} })
```

Aliases allow Go nodes to respond to class names configured by Java/Python SDKs.

## Executing Rules

All execution methods take `context.Context` as their first parameter:

```go
ctx := context.Background()

// Execute by iceId
roam := ice.NewRoam()
roam.SetId(1)
roam.Put("uid", 12345)
roams := ice.SyncProcess(ctx, roam)

// Execute by scene
roam2 := ice.NewRoam()
roam2.SetScene("recharge")
roams = ice.SyncProcess(ctx, roam2)

// Async execution
channels := ice.AsyncProcess(ctx, roam)
for _, ch := range channels {
    r := <-ch
    // Process result
}
```

### Convenience Methods

```go
result := ice.ProcessSingleRoam(ctx, roam)
results := ice.ProcessRoam(ctx, roam)
```

### Context Propagation

```go
func handleRequest(w http.ResponseWriter, r *http.Request) {
    ctx := ice.WithTraceId(r.Context(), r.Header.Get("X-Trace-Id"))

    roam := ice.NewRoam()
    roam.SetScene("api")
    roam.Put("userId", getUserId(r))

    // ctx is propagated to all leaf nodes; logs automatically include traceId
    ice.SyncProcess(ctx, roam)
}
```

## Roam Operations

```go
roam := ice.NewRoam()

// Basic operations
roam.Put("name", "Alice")
name := roam.Value("name").String()
age := roam.Value("age").IntOr(0)          // With default value
score := roam.Value("score").Float64Or(0.0)

// Multi-level key
roam.PutDeep("user.profile.level", 5)
level := roam.GetDeep("user.profile.level")

// Reference syntax
roam.Resolve("@user.profile.level")  // 5
```

See [Roam API Reference](/en/reference/roam-api.html) for the complete API.

## Client Configuration

```go
// Minimal setup
client, _ := ice.NewClient(1, "./ice-data")

// Full configuration
client, _ := ice.NewClientWithOptions(
    1,                      // app ID
    "./ice-data",           // storage path
    -1,                     // parallelism (-1 uses default)
    2*time.Second,          // poll interval
    10*time.Second,         // heartbeat interval
    "",                     // lane (empty string = main trunk)
)

// With lane
client, _ := ice.NewWithLane(1, "./ice-data", "feature-xxx")
```

### Lifecycle

```go
client.Start()
client.WaitStarted()
version := client.GetLoadedVersion()
client.Destroy()
```

## Logging Configuration

Ice uses Go's standard `log/slog` as the logging facade. Pass a `*slog.Logger` directly:

```go
import "log/slog"

// Use JSON format output
ice.SetLogger(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

// Or integrate third-party logging (zap, zerolog, etc. all provide slog.Handler adapters)
ice.SetLogger(slog.New(zapSlogHandler))
```

TraceId is automatically extracted from the context and attached as a structured field.

## Next Steps

- [Java SDK](/en/sdk/java.html) | [Python SDK](/en/sdk/python.html) -- Other language SDKs
- [Node Type Reference](/en/reference/node-types.html) -- All relation and leaf node types
- [Client Configuration Reference](/en/reference/client-config.html) -- Complete configuration options
