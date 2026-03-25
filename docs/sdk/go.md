---
title: Go SDK
description: Ice Go SDK 完整集成指南，包含安装配置、叶子节点注册、规则执行、Context 集成、日志配置等。
keywords: Go SDK,Golang规则引擎,ice-go,Go规则引擎,Go热更新,Ice Go客户端
---

# Go SDK

> Ice Go SDK，功能与 Java SDK 完全对等。原生支持 context.Context，集成 trace、超时控制。

## 安装

要求 Go 1.21+。

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

## 快速开始

```go
package main

import (
    "context"
    "fmt"
    "log"

    ice "github.com/zjn-zjn/ice/sdks/go"
    icecontext "github.com/zjn-zjn/ice/sdks/go/context"
)

// 定义叶子节点
type ScoreFlow struct {
    Score float64 `json:"score" ice:"name:分数阈值,desc:判断分数的阈值"`
    Key   string  `json:"key" ice:"name:取值键,desc:从roam中取值的键名"`
}

func (s *ScoreFlow) DoFlow(ctx context.Context, roam *icecontext.Roam) bool {
    value := roam.Value(s.Key).Float64Or(0)
    return value >= s.Score
}

func init() {
    ice.RegisterLeaf("com.example.ScoreFlow",
        &ice.LeafMeta{Name: "分数判断", Desc: "判断分数是否达标"},
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
        fmt.Println("结果:", r.Data())
    }
}
```

## 叶子节点开发

### 注册

Go SDK 使用显式注册（非注解扫描）：

```go
ice.RegisterLeaf(className string, meta *LeafMeta, factory func() any)
```

- `className`：节点类名，与 Server 配置中的 confName 对应
- `meta`：节点元数据（名称、描述、别名），可为 nil
- `factory`：创建节点实例的工厂函数

### 3 种节点接口

所有接口的第一个参数都是 `context.Context`：

| 类型 | 接口方法 | 返回值 | 说明 |
|------|----------|--------|------|
| **Flow** | `DoFlow(ctx, roam)` | bool | 条件判断 |
| **Result** | `DoResult(ctx, roam)` | bool | 业务操作 |
| **None** | `DoNone(ctx, roam)` | — | 辅助操作 |

注册时 SDK 自动检测实现了哪个接口，无需手动指定类型。

### 字段配置

使用 `ice` struct tag 添加字段描述：

```go
type MyNode struct {
    Score float64 `json:"score" ice:"name:分数阈值,desc:判断分数的阈值"`
    Key   string  `json:"key" ice:"name:取值键"`

    // 不在配置界面显示
    Service *http.Client `json:"-"`          // json:"-" 不参与序列化
    Cache   map[string]any `json:"cache" ice:"-"` // ice:"-" 隐藏
}
```

### 别名（跨语言兼容）

```go
ice.RegisterLeaf("com.example.ScoreFlow",
    &ice.LeafMeta{
        Alias: []string{"score_flow", "ScoreFlow"},
    },
    func() any { return &ScoreFlow{} })
```

别名允许 Go 节点响应 Java/Python 配置的类名。

## 执行规则

所有执行方法的第一个参数都是 `context.Context`：

```go
ctx := context.Background()

// 按 iceId 执行
roam := ice.NewRoam()
roam.SetId(1)
roam.Put("uid", 12345)
roams := ice.SyncProcess(ctx, roam)

// 按场景执行
roam2 := ice.NewRoam()
roam2.SetScene("recharge")
roams = ice.SyncProcess(ctx, roam2)

// 异步执行
channels := ice.AsyncProcess(ctx, roam)
for _, ch := range channels {
    r := <-ch
    // 处理结果
}
```

### 便捷方法

```go
result := ice.ProcessSingleRoam(ctx, roam)
results := ice.ProcessRoam(ctx, roam)
```

### Context 传递

```go
func handleRequest(w http.ResponseWriter, r *http.Request) {
    ctx := ice.WithTraceId(r.Context(), r.Header.Get("X-Trace-Id"))

    roam := ice.NewRoam()
    roam.SetScene("api")
    roam.Put("userId", getUserId(r))

    // ctx 会传递到所有叶子节点，日志自动带上 traceId
    ice.SyncProcess(ctx, roam)
}
```

## Roam 操作

```go
roam := ice.NewRoam()

// 基础操作
roam.Put("name", "Alice")
name := roam.Value("name").String()
age := roam.Value("age").IntOr(0)          // 带默认值
score := roam.Value("score").Float64Or(0.0)

// 多级 key
roam.PutDeep("user.profile.level", 5)
level := roam.GetDeep("user.profile.level")

// 引用语法
roam.Resolve("@user.profile.level")  // 5
```

完整 API 见 [Roam API 参考](/reference/roam-api.html)。

## Client 配置

```go
// 最简方式
client, _ := ice.NewClient(1, "./ice-data")

// 完整配置
client, _ := ice.NewClientWithOptions(
    1,                      // app ID
    "./ice-data",           // 存储路径
    -1,                     // 并行度（-1 使用默认）
    2*time.Second,          // 轮询间隔
    10*time.Second,         // 心跳间隔
    "",                     // 泳道（空字符串 = 主干）
)

// 带泳道
client, _ := ice.NewWithLane(1, "./ice-data", "feature-xxx")
```

### 生命周期

```go
client.Start()
client.WaitStarted()
version := client.GetLoadedVersion()
client.Destroy()
```

## 日志配置

ice 使用 Go 标准库 `log/slog` 作为日志门面，可直接传入 `*slog.Logger`：

```go
import "log/slog"

// 使用 JSON 格式输出
ice.SetLogger(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

// 或接入第三方日志库（zap、zerolog 等均提供 slog.Handler 适配）
ice.SetLogger(slog.New(zapSlogHandler))
```

TraceId 会自动从 context 中提取并作为结构化字段附加到日志。

## 下一步

- [Java SDK](/sdk/java.html) · [Python SDK](/sdk/python.html) — 其他语言 SDK
- [节点类型速查](/reference/node-types.html) — 所有关系节点和叶子节点
- [Client 配置参考](/reference/client-config.html) — 完整配置项说明
