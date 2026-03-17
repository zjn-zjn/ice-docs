---
title: Ice Go SDK 集成指南 - Golang 规则引擎客户端
description: Ice Go SDK 完整集成指南。详细介绍如何在 Go/Golang 应用中集成 Ice 规则引擎，包括安装配置、叶子节点开发、规则执行、并发处理等核心功能。
keywords: Go SDK,Golang规则引擎,ice-go,Go规则引擎,Golang业务编排,Ice Go客户端,规则引擎集成,Go热更新配置
head:
  - - meta
    - property: og:title
      content: Ice Go SDK 集成指南 - Golang 规则引擎客户端
  - - meta
    - property: og:description
      content: Ice Go SDK 完整集成指南，详细介绍如何在 Go 应用中集成 Ice 规则引擎。
  - - meta
    - property: og:image
      content: https://waitmoon.com/images/hero.png
  - - meta
    - property: og:url
      content: https://waitmoon.com/guide/go-sdk.html
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Ice Go SDK 集成指南 - Golang 规则引擎客户端
  - - meta
    - name: twitter:description
      content: Ice Go SDK 完整集成指南，在 Go 应用中集成可视化规则引擎
  - - meta
    - name: twitter:image
      content: https://waitmoon.com/images/hero.png
---

# Ice Go SDK 集成指南

> Go 语言版本的 Ice 规则引擎 SDK，功能与 Java `ice-core` 完全对等。

## 概述

Ice Go SDK 提供与 Java SDK 相同的核心功能：

- ✅ 规则执行引擎（同步/异步）
- ✅ 5 种串行关系节点 + 5 种并行关系节点
- ✅ 9 种叶子节点接口（自动适配）
- ✅ 文件客户端（配置加载、热更新）
- ✅ 时间控制、调试追踪
- ✅ 并发安全的 Roam 数据容器
- ✅ 全链路 Context 支持（trace、超时控制）

## 安装

### 环境要求

- Go 1.21 或更高版本

### 添加依赖

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

或在 `go.mod` 中添加：

```go
require github.com/zjn-zjn/ice/sdks/go v1.0.6
```

## 快速开始

### 1. 注册叶子节点

```go
package main

import (
    "context"
    
    ice "github.com/zjn-zjn/ice/sdks/go"
    icecontext "github.com/zjn-zjn/ice/sdks/go/context"
)

// 定义叶子节点（使用 ice tag 添加字段描述）
type ScoreFlow struct {
    Score float64 `json:"score" ice:"name:分数阈值,desc:判断分数的阈值"`
    Key   string  `json:"key" ice:"name:取值键,desc:从roam中取值的键名"`
}

// 实现 RoamFlow 接口（注意：第一个参数是 context.Context）
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
    // 注册叶子节点（支持 alias 用于多语言兼容）
    ice.RegisterLeaf("com.example.ScoreFlow",
        &ice.LeafMeta{
            Name:  "分数判断",
            Desc:  "判断分数是否达标",
            Alias: []string{"score_flow"},  // 别名，可响应其他语言配置的类名
        },
        func() any { return &ScoreFlow{} })
}
```

### 2. 启动客户端

```go
func main() {
    // 创建文件客户端
    client, err := ice.NewClient(1, "./ice-data")
    if err != nil {
        log.Fatal(err)
    }

    // 启动（加载配置）
    if err := client.Start(); err != nil {
        log.Fatal(err)
    }
    defer client.Destroy()

    // 执行规则（第一个参数是 context.Context）
    ctx := context.Background()
    pack := ice.NewPack().SetIceId(1)
    pack.Roam.Put("score", 85)
    
    ctxList := ice.SyncProcess(ctx, pack)
    
    // 处理结果
    for _, iceCtx := range ctxList {
        fmt.Println("Result:", iceCtx.Pack.Roam.Data())
    }
}
```

## 叶子节点开发

### 节点类型

Ice Go SDK 支持 9 种叶子节点接口，自动在注册时识别。**所有接口的第一个参数都是 `context.Context`**：

| 类型 | 接口方法 | 返回值 | 说明 |
|------|----------|--------|------|
| **Flow** | `DoRoamFlow(ctx, roam)` | bool | 条件判断 |
| | `DoPackFlow(ctx, pack)` | bool | 访问完整 Pack |
| | `DoFlow(ctx, iceCtx)` | bool | 访问完整 Context |
| **Result** | `DoRoamResult(ctx, roam)` | bool | 业务操作 |
| | `DoPackResult(ctx, pack)` | bool | 访问完整 Pack |
| | `DoResult(ctx, iceCtx)` | bool | 访问完整 Context |
| **None** | `DoRoamNone(ctx, roam)` | void | 数据查询/日志 |
| | `DoPackNone(ctx, pack)` | void | 访问完整 Pack |
| | `DoNone(ctx, iceCtx)` | void | 访问完整 Context |

### Flow 节点示例

```go
// 条件判断节点
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

### Result 节点示例

```go
// 业务操作节点
type PointGrant struct {
    Key    string  `json:"key"`
    Points float64 `json:"points"`
}

func (p *PointGrant) DoRoamResult(ctx context.Context, roam *icecontext.Roam) bool {
    uid := roam.GetInt("uid", 0)
    if uid <= 0 || p.Points <= 0 {
        return false
    }
    // 调用业务接口发放积分（可传递 ctx 用于 trace、超时控制）
    success := pointService.GrantWithContext(ctx, uid, p.Points)
    roam.Put("GRANT_RESULT", success)
    return success
}

func init() {
    ice.RegisterLeaf("com.example.PointGrant", 
        &ice.LeafMeta{Name: "积分发放", Desc: "向用户发放积分"},
        func() any { return &PointGrant{} })
}
```

### None 节点示例

```go
// 数据查询节点
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

## 执行规则

**所有执行方法的第一个参数都是 `context.Context`**，用于传递 trace、超时控制等信息。

### 同步执行

```go
ctx := context.Background()

// 按 IceId 执行
pack := ice.NewPack().SetIceId(1)
pack.Roam.Put("uid", 12345)
ctxList := ice.SyncProcess(ctx, pack)

// 按场景执行
pack := ice.NewPack().SetScene("recharge")
pack.Roam.Put("amount", 100)
ctxList := ice.SyncProcess(ctx, pack)

// 按 ConfId 执行（直接执行某个节点）
pack := ice.NewPack().SetConfId(123)
ctxList := ice.SyncProcess(ctx, pack)
```

### 异步执行

```go
ctx := context.Background()
pack := ice.NewPack().SetIceId(1)
channels := ice.AsyncProcess(ctx, pack)

// 异步等待结果
for _, ch := range channels {
    iceCtx := <-ch
    fmt.Println("Async result:", iceCtx.Pack.Roam.Data())
}
```

### 便捷方法

```go
ctx := context.Background()

// 获取单个 Roam 结果
roam := ice.ProcessSingleRoam(ctx, pack)

// 获取多个 Roam 结果
roams := ice.ProcessRoam(ctx, pack)

// 获取单个 Context
iceCtx := ice.ProcessSingleCtx(ctx, pack)

// 获取多个 Context
ctxList := ice.ProcessCtx(ctx, pack)
```

### Context 传递示例（HTTP 场景）

```go
func handleRequest(w http.ResponseWriter, r *http.Request) {
    // 从 HTTP 请求获取 context，并添加 traceId
    ctx := ice.WithTraceId(r.Context(), r.Header.Get("X-Trace-Id"))
    
    pack := ice.NewPack().SetScene("api")
    pack.Roam.Put("userId", getUserId(r))
    
    // context 会传递到所有叶子节点，日志自动带上 traceId
    ctxList := ice.SyncProcess(ctx, pack)
    
    // ...
}
```

## Roam 数据操作

Roam 是并发安全的数据容器，支持多级 key 访问：

```go
roam := ice.NewRoam()

// 基础操作
roam.Put("name", "Alice")
roam.Put("age", 25)

// 获取值
name := roam.GetString("name")           // "Alice"
age := roam.GetInt("age", 0)             // 25
score := roam.GetFloat64("score", 0.0)   // 默认值

// 多级 key 操作
roam.PutMulti("user.profile.level", 5)
level := roam.GetMulti("user.profile.level")  // 5

// 引用语法（配置中使用）
// "@key" 表示引用另一个 key 的值
value := roam.GetUnion("@user.profile.level")  // 5

// 打印 JSON 格式
fmt.Println(roam.String())  // {"name":"Alice","age":25,...}
```

## 客户端配置

### 基础配置

```go
// 最简方式（推荐）
client, err := ice.NewClient(1, "./ice-data")
```

### 完整配置

```go
import "time"

client, err := ice.NewClientWithOptions(
    1,                      // app ID
    "./ice-data",           // 存储路径
    -1,                     // 并行度（-1 使用默认）
    5*time.Second,          // 轮询间隔
    10*time.Second,         // 心跳间隔
    "",                     // 泳道名称（空字符串表示主干）
)

// 使用泳道隔离（开发环境分支隔离）
client, err := ice.NewClientWithOptions(
    1, "./ice-data", -1,
    5*time.Second, 10*time.Second,
    "feature-xxx",          // 泳道名称
)
```

### 生命周期

```go
// 启动
client.Start()

// 等待启动完成（可选）
client.WaitStarted()

// 检查状态
if client.IsStarted() {
    // ...
}

// 获取已加载版本
version := client.GetLoadedVersion()

// 销毁
client.Destroy()
```

## 日志与 Trace 配置

### 使用默认日志（slog）

```go
import "log/slog"

// 设置日志级别
slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelDebug,
})))
```

### TraceId 支持

SDK 内置了 traceId/spanId 支持，会自动从 context 提取并添加到日志：

```go
// 添加 traceId 到 context
ctx := ice.WithTraceId(context.Background(), "trace-123")
ctx = ice.WithSpanId(ctx, "span-456")

// 执行时传入 ctx，所有日志自动带上 traceId
ice.SyncProcess(ctx, pack)
// 日志输出: time=xxx level=INFO msg="handle in" traceId=trace-123 spanId=span-456 ...
```

### 自定义日志

```go
import (
    "context"
    icelog "github.com/zjn-zjn/ice/sdks/go/log"
)

// 实现 Logger 接口（注意：第一个参数是 context.Context）
type MyLogger struct{}

func (l *MyLogger) Debug(ctx context.Context, msg string, args ...any) { /* ... */ }
func (l *MyLogger) Info(ctx context.Context, msg string, args ...any)  { /* ... */ }
func (l *MyLogger) Warn(ctx context.Context, msg string, args ...any)  { /* ... */ }
func (l *MyLogger) Error(ctx context.Context, msg string, args ...any) { /* ... */ }

// 设置自定义日志
ice.SetLogger(&MyLogger{})
```

## 字段描述与忽略

### 字段描述 (ice tag)

使用 `ice` struct tag 为字段添加描述，在 Server UI 中友好展示：

```go
type MyNode struct {
    // iceField - 在 UI 中显示名称和描述
    Score float64 `json:"score" ice:"name:分数阈值,desc:判断分数的阈值"`
    Key   string  `json:"key" ice:"name:取值键,desc:从roam中取值的键名"`
    
    // hideField - 无 ice tag，可配置但隐藏
    Internal string `json:"internal"`
}
```

### 字段忽略

不想被配置的字段可以忽略：

```go
type MyNode struct {
    // 方式1: json:"-" - 不参与 JSON 序列化，自然不可配置
    Service *http.Client `json:"-"`
    
    // 方式2: ice:"-" - 参与 JSON 但不在配置列表中显示
    Cache map[string]any `json:"cache" ice:"-"`
    
    // 方式3: 非导出字段自动忽略
    internal string
}
```

### 别名 (Alias)

支持多语言兼容配置：

```go
ice.RegisterLeaf("com.example.ScoreFlow",
    &ice.LeafMeta{
        Name:  "分数判断",
        Alias: []string{"score_flow", "ScoreFlow"},  // 可响应多种类名
    },
    func() any { return &ScoreFlow{} })
```

## 完整示例

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

// 积分发放节点
type PointResult struct {
    Key   string  `json:"key"`
    Value float64 `json:"value"`
}

func (p *PointResult) DoRoamResult(ctx context.Context, roam *icecontext.Roam) bool {
    uid := roam.GetInt(p.Key, 0)
    if uid <= 0 || p.Value <= 0 {
        return false
    }
    fmt.Printf("发放积分: uid=%d, points=%.2f\n", uid, p.Value)
    roam.Put("SEND_POINT", true)
    return true
}

// 分数判断节点
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
        &ice.LeafMeta{Name: "积分发放", Desc: "发放积分奖励"},
        func() any { return &PointResult{} })
    
    ice.RegisterLeaf("com.example.ScoreFlow",
        &ice.LeafMeta{Name: "分数判断", Desc: "判断分数是否达标"},
        func() any { return &ScoreFlow{} })
}

func main() {
    // 初始化执行器
    ice.InitExecutor(10)

    // 创建并启动客户端
    client, err := ice.NewClientWithOptions(
        1, "./ice-data", -1,
        5*time.Second, 10*time.Second, "",
    )
    if err != nil {
        log.Fatal(err)
    }

    if err := client.Start(); err != nil {
        log.Fatal(err)
    }
    defer client.Destroy()

    // 创建带 traceId 的 context
    ctx := ice.WithTraceId(context.Background(), "trace-001")

    // 执行规则
    pack := ice.NewPack().SetScene("reward")
    pack.Roam.Put("uid", 12345)
    pack.Roam.Put("score", 85.0)

    ctxList := ice.SyncProcess(ctx, pack)

    for _, iceCtx := range ctxList {
        fmt.Println("执行结果:", iceCtx.Pack.Roam.Data())
    }
}
```

## 下一步

- 📖 [节点详细说明](/guide/detail.html) - 了解更多节点类型
- 🏗️ [架构设计](/advanced/architecture.html) - 理解 Ice 架构
- ❓ [常见问题](/guide/qa.html) - 解决集成问题
