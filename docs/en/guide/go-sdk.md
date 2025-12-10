---
title: Ice Go SDK Integration Guide - Golang Rule Engine Client
description: Complete Ice Go SDK integration guide. Learn how to integrate Ice rule engine in Go/Golang applications, including installation, leaf node development, rule execution, concurrency handling and more.
keywords: Go SDK,Golang rule engine,ice-go,Go rule engine,Golang business orchestration,Ice Go client,rule engine integration,Go hot reload config
head:
  - - meta
    - property: og:title
      content: Ice Go SDK Integration Guide - Golang Rule Engine Client
  - - meta
    - property: og:description
      content: Complete Ice Go SDK integration guide for Go applications.
  - - meta
    - property: og:image
      content: https://waitmoon.com/images/hero.png
  - - meta
    - property: og:url
      content: https://waitmoon.com/en/guide/go-sdk.html
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Ice Go SDK Integration Guide - Golang Rule Engine Client
  - - meta
    - name: twitter:description
      content: Complete Ice Go SDK integration guide for Go applications
  - - meta
    - name: twitter:image
      content: https://waitmoon.com/images/hero.png
---

# Ice Go SDK Integration Guide

> Go SDK for Ice rule engine, fully compatible with Java `ice-core` functionality.

## Overview

Ice Go SDK provides the same core features as the Java SDK:

- ✅ Rule execution engine (sync/async)
- ✅ 5 serial relation nodes + 5 parallel relation nodes
- ✅ 9 leaf node interfaces (auto-adaptation)
- ✅ File client (config loading, hot reload)
- ✅ Time control, debug tracing
- ✅ Thread-safe Roam data container
- ✅ Full context.Context support (trace, timeout control)

## Installation

### Requirements

- Go 1.21 or later

### Add Dependency

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

Or add to `go.mod`:

```go
require github.com/zjn-zjn/ice/sdks/go v1.0.3
```

## Quick Start

### 1. Register Leaf Nodes

```go
package main

import (
    "context"
    
    ice "github.com/zjn-zjn/ice/sdks/go"
    icecontext "github.com/zjn-zjn/ice/sdks/go/context"
)

// Define leaf node (use ice tag for field descriptions)
type ScoreFlow struct {
    Score float64 `json:"score" ice:"name:Score Threshold,desc:Threshold for score comparison"`
    Key   string  `json:"key" ice:"name:Key,desc:Key to get value from roam"`
}

// Implement RoamFlow interface (Note: first parameter is context.Context)
func (s *ScoreFlow) DoRoamFlow(ctx context.Context, roam *icecontext.Roam) bool {
    value := roam.GetMulti(s.Key)
    if value == nil {
        return false
    }
    switch v := value.(type) {
    case float64:
        return v >= s.Score
    case int:
        return float64(v) >= s.Score
    }
    return false
}

func init() {
    // Register leaf node (supports alias for multi-language compatibility)
    ice.RegisterLeaf("com.example.ScoreFlow",
        &ice.LeafMeta{
            Name:  "Score Check",
            Desc:  "Check if score meets threshold",
            Alias: []string{"score_flow"},  // Alias to respond to other language configs
        },
        func() any { return &ScoreFlow{} })
}
```

### 2. Start Client

```go
func main() {
    // Create file client
    client, err := ice.NewClient(1, "./ice-data")
    if err != nil {
        log.Fatal(err)
    }

    // Start (load config)
    if err := client.Start(); err != nil {
        log.Fatal(err)
    }
    defer client.Destroy()

    // Execute rules (first parameter is context.Context)
    ctx := context.Background()
    pack := ice.NewPack().SetIceId(1)
    pack.Roam.Put("score", 85)
    
    ctxList := ice.SyncProcess(ctx, pack)
    
    // Process results
    for _, iceCtx := range ctxList {
        fmt.Println("Result:", iceCtx.Pack.Roam.Data())
    }
}
```

## Leaf Node Development

### Node Types

Ice Go SDK supports 9 leaf node interfaces, auto-detected during registration. **All interfaces have `context.Context` as the first parameter**:

| Type | Interface Method | Return | Description |
|------|------------------|--------|-------------|
| **Flow** | `DoRoamFlow(ctx, roam)` | bool | Condition check |
| | `DoPackFlow(ctx, pack)` | bool | Access full Pack |
| | `DoFlow(ctx, iceCtx)` | bool | Access full Context |
| **Result** | `DoRoamResult(ctx, roam)` | bool | Business operation |
| | `DoPackResult(ctx, pack)` | bool | Access full Pack |
| | `DoResult(ctx, iceCtx)` | bool | Access full Context |
| **None** | `DoRoamNone(ctx, roam)` | void | Data query/logging |
| | `DoPackNone(ctx, pack)` | void | Access full Pack |
| | `DoNone(ctx, iceCtx)` | void | Access full Context |

### Flow Node Example

```go
// Condition check node
type AgeCheck struct {
    MinAge int `json:"minAge"`
    MaxAge int `json:"maxAge"`
}

func (a *AgeCheck) DoRoamFlow(ctx context.Context, roam *icecontext.Roam) bool {
    age := roam.GetInt("age", 0)
    return age >= a.MinAge && age <= a.MaxAge
}

func init() {
    ice.RegisterLeaf("com.example.AgeCheck", nil, func() any {
        return &AgeCheck{}
    })
}
```

### Result Node Example

```go
// Business operation node
type PointGrant struct {
    Key    string  `json:"key"`
    Points float64 `json:"points"`
}

func (p *PointGrant) DoRoamResult(ctx context.Context, roam *icecontext.Roam) bool {
    uid := roam.GetInt("uid", 0)
    if uid <= 0 || p.Points <= 0 {
        return false
    }
    // Call business API (can pass ctx for trace, timeout control)
    success := pointService.GrantWithContext(ctx, uid, p.Points)
    roam.Put("GRANT_RESULT", success)
    return success
}

func init() {
    ice.RegisterLeaf("com.example.PointGrant", 
        &ice.LeafMeta{Name: "Point Grant", Desc: "Grant points to user"},
        func() any { return &PointGrant{} })
}
```

### None Node Example

```go
// Data query node
type UserInfoLoader struct {
    UidKey string `json:"uidKey"`
}

func (u *UserInfoLoader) DoRoamNone(ctx context.Context, roam *icecontext.Roam) {
    uid := roam.GetInt(u.UidKey, 0)
    if uid > 0 {
        userInfo := userService.GetUserInfoWithContext(ctx, uid)
        roam.Put("userInfo", userInfo)
    }
}

func init() {
    ice.RegisterLeaf("com.example.UserInfoLoader", nil, func() any {
        return &UserInfoLoader{}
    })
}
```

## Rule Execution

**All execution methods have `context.Context` as the first parameter** for trace, timeout control, etc.

### Sync Execution

```go
ctx := context.Background()

// Execute by IceId
pack := ice.NewPack().SetIceId(1)
pack.Roam.Put("uid", 12345)
ctxList := ice.SyncProcess(ctx, pack)

// Execute by Scene
pack := ice.NewPack().SetScene("recharge")
pack.Roam.Put("amount", 100)
ctxList := ice.SyncProcess(ctx, pack)

// Execute by ConfId (execute specific node directly)
pack := ice.NewPack().SetConfId(123)
ctxList := ice.SyncProcess(ctx, pack)
```

### Async Execution

```go
ctx := context.Background()
pack := ice.NewPack().SetIceId(1)
channels := ice.AsyncProcess(ctx, pack)

// Wait for async results
for _, ch := range channels {
    iceCtx := <-ch
    fmt.Println("Async result:", iceCtx.Pack.Roam.Data())
}
```

### Convenience Methods

```go
ctx := context.Background()

// Get single Roam result
roam := ice.ProcessSingleRoam(ctx, pack)

// Get multiple Roam results
roams := ice.ProcessRoam(ctx, pack)

// Get single Context
iceCtx := ice.ProcessSingleCtx(ctx, pack)

// Get multiple Contexts
ctxList := ice.ProcessCtx(ctx, pack)
```

### Context Passing Example (HTTP Scenario)

```go
func handleRequest(w http.ResponseWriter, r *http.Request) {
    // Get context from HTTP request and add traceId
    ctx := ice.WithTraceId(r.Context(), r.Header.Get("X-Trace-Id"))
    
    pack := ice.NewPack().SetScene("api")
    pack.Roam.Put("userId", getUserId(r))
    
    // Context propagates to all leaf nodes, logs auto-include traceId
    ctxList := ice.SyncProcess(ctx, pack)
    
    // ...
}
```

## Roam Data Operations

Roam is a thread-safe data container with multi-level key access:

```go
roam := ice.NewRoam()

// Basic operations
roam.Put("name", "Alice")
roam.Put("age", 25)

// Get values
name := roam.GetString("name")           // "Alice"
age := roam.GetInt("age", 0)             // 25
score := roam.GetFloat64("score", 0.0)   // default value

// Multi-level key operations
roam.PutMulti("user.profile.level", 5)
level := roam.GetMulti("user.profile.level")  // 5

// Reference syntax (used in config)
// "@key" references another key's value
value := roam.GetUnion("@user.profile.level")  // 5

// Print JSON format
fmt.Println(roam.String())  // {"name":"Alice","age":25,...}
```

## Client Configuration

### Basic Configuration

```go
// Simplest way (recommended)
client, err := ice.NewClient(1, "./ice-data")
```

### Full Configuration

```go
import "time"

client, err := ice.NewClientWithOptions(
    1,                      // app ID
    "./ice-data",           // storage path
    -1,                     // parallelism (-1 for default)
    5*time.Second,          // poll interval
    10*time.Second,         // heartbeat interval
)
```

### Lifecycle

```go
// Start
client.Start()

// Wait for start completion (optional)
client.WaitStarted()

// Check status
if client.IsStarted() {
    // ...
}

// Get loaded version
version := client.GetLoadedVersion()

// Destroy
client.Destroy()
```

## Logging & Trace Configuration

### Using Default Logger (slog)

```go
import "log/slog"

// Set log level
slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelDebug,
})))
```

### TraceId Support

SDK has built-in traceId/spanId support, auto-extracted from context and added to logs:

```go
// Add traceId to context
ctx := ice.WithTraceId(context.Background(), "trace-123")
ctx = ice.WithSpanId(ctx, "span-456")

// Pass ctx when executing, all logs auto-include traceId
ice.SyncProcess(ctx, pack)
// Log output: time=xxx level=INFO msg="handle in" traceId=trace-123 spanId=span-456 ...
```

### Custom Logger

```go
import (
    "context"
    icelog "github.com/zjn-zjn/ice/sdks/go/log"
)

// Implement Logger interface (Note: first parameter is context.Context)
type MyLogger struct{}

func (l *MyLogger) Debug(ctx context.Context, msg string, args ...any) { /* ... */ }
func (l *MyLogger) Info(ctx context.Context, msg string, args ...any)  { /* ... */ }
func (l *MyLogger) Warn(ctx context.Context, msg string, args ...any)  { /* ... */ }
func (l *MyLogger) Error(ctx context.Context, msg string, args ...any) { /* ... */ }

// Set custom logger
ice.SetLogger(&MyLogger{})
```

## Field Description & Ignore

### Field Description (ice tag)

Use `ice` struct tag to add descriptions for friendly UI display:

```go
type MyNode struct {
    // iceField - Show name and description in UI
    Score float64 `json:"score" ice:"name:Score Threshold,desc:Threshold for comparison"`
    Key   string  `json:"key" ice:"name:Key,desc:Key to get value from roam"`
    
    // hideField - No ice tag, configurable but hidden
    Internal string `json:"internal"`
}
```

### Field Ignore

Fields that should not be configurable can be ignored:

```go
type MyNode struct {
    // Method 1: json:"-" - Not serialized, naturally not configurable
    Service *http.Client `json:"-"`
    
    // Method 2: ice:"-" - Serialized but not in config list
    Cache map[string]any `json:"cache" ice:"-"`
    
    // Method 3: Unexported fields are automatically ignored
    internal string
}
```

### Alias

Support multi-language compatible configuration:

```go
ice.RegisterLeaf("com.example.ScoreFlow",
    &ice.LeafMeta{
        Name:  "Score Check",
        Alias: []string{"score_flow", "ScoreFlow"},
    },
    func() any { return &ScoreFlow{} })
```

## Complete Example

```go
package main

import (
    "context"
    "fmt"
    "log"
    "time"

    ice "github.com/zjn-zjn/ice/sdks/go"
    icecontext "github.com/zjn-zjn/ice/sdks/go/context"
)

// Point grant node
type PointResult struct {
    Key   string  `json:"key"`
    Value float64 `json:"value"`
}

func (p *PointResult) DoRoamResult(ctx context.Context, roam *icecontext.Roam) bool {
    uid := roam.GetInt(p.Key, 0)
    if uid <= 0 || p.Value <= 0 {
        return false
    }
    fmt.Printf("Grant points: uid=%d, points=%.2f\n", uid, p.Value)
    roam.Put("SEND_POINT", true)
    return true
}

// Score check node
type ScoreFlow struct {
    Threshold float64 `json:"threshold"`
    Key       string  `json:"key"`
}

func (s *ScoreFlow) DoRoamFlow(ctx context.Context, roam *icecontext.Roam) bool {
    score := roam.GetFloat64(s.Key, 0)
    return score >= s.Threshold
}

func init() {
    ice.RegisterLeaf("com.example.PointResult", 
        &ice.LeafMeta{Name: "Point Grant", Desc: "Grant points reward"},
        func() any { return &PointResult{} })
    
    ice.RegisterLeaf("com.example.ScoreFlow",
        &ice.LeafMeta{Name: "Score Check", Desc: "Check if score meets threshold"},
        func() any { return &ScoreFlow{} })
}

func main() {
    // Initialize executor
    ice.InitExecutor(10)

    // Create and start client
    client, err := ice.NewClientWithOptions(
        1, "./ice-data", -1,
        5*time.Second, 10*time.Second,
    )
    if err != nil {
        log.Fatal(err)
    }

    if err := client.Start(); err != nil {
        log.Fatal(err)
    }
    defer client.Destroy()

    // Create context with traceId
    ctx := ice.WithTraceId(context.Background(), "trace-001")

    // Execute rules
    pack := ice.NewPack().SetScene("reward")
    pack.Roam.Put("uid", 12345)
    pack.Roam.Put("score", 85.0)

    ctxList := ice.SyncProcess(ctx, pack)

    for _, iceCtx := range ctxList {
        fmt.Println("Result:", iceCtx.Pack.Roam.Data())
    }
}
```

## Next Steps

- 📖 [Node Details](/en/guide/detail.html) - Learn more about node types
- 🏗️ [Architecture](/en/advanced/architecture.html) - Understand Ice architecture
- ❓ [FAQ](/en/guide/qa.html) - Resolve integration issues
