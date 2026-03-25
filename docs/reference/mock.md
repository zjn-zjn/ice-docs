---
title: Mock 执行
description: Ice Mock 执行的完整参考，包括架构原理、Server API、Client SDK 自动轮询、Roam Key 扫描等。
keywords: Mock执行,ice-mock,调试,远程执行,Roam扫描,表单生成
---

# Mock 执行

> Mock 执行允许通过 Web UI 向 Client SDK 发起远程规则调试，Server 作为代理，通过文件实现 RPC 通信。

## 架构

```
Web UI ──POST──▶ Server ──写请求文件──▶ mock/{app}/{address}/{mockId}.json
                                        │
                 Client SDK 轮询 ◀───────┘
                                        │
Web UI ◀─────── Server ◀──读响应文件─── mock/{app}/{address}/{mockId}_result.json
```

1. Web UI 发送 `POST /ice-server/mock/execute`
2. Server 将请求写入 `mock/{app}/{address}/{mockId}.json`
3. Client SDK 轮询 mock 目录，读取请求文件，本地执行规则，将结果写入 `{mockId}_result.json`
4. Server 轮询响应文件（60 秒超时，1 秒间隔），返回结果给 Web UI

## Server API

### POST /ice-server/mock/execute

执行一次 Mock 请求。

**请求体：**

```json
{
  "app": 1,
  "iceId": 100,
  "confId": null,
  "ts": 1710000000000,
  "roam": { "uid": 12345, "score": 85.0 },
  "target": "all"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `app` | int | 是 | 应用 ID |
| `iceId` | int | 否 | 规则 ID（iceId 或 confId 二选一） |
| `confId` | int | 否 | 配置 ID（iceId 或 confId 二选一） |
| `ts` | int64 | 否 | 时间戳 |
| `roam` | object | 否 | 输入数据 |
| `target` | string | 否 | 执行目标，为空时默认 `"all"`（任意可用 Client） |

**target 取值：**

| 值 | 说明 |
|----|------|
| `all` | 任意可用 Client |
| `lane:xxx` | 指定泳道的 Client |
| `address:xxx` | 指定地址的 Client |

**响应体：**

```json
{
  "mockId": "abc123",
  "success": true,
  "roam": { "uid": 12345, "score": 85.0, "result": "pass" },
  "process": "...",
  "error": null,
  "executeAt": 1710000001000
}
```

### GET /ice-server/mock/schema

获取 Mock 输入的表单 Schema，用于 Web UI 自动生成表单字段。

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `app` | int | 是 | 应用 ID |
| `iceId` | int | 否 | 规则 ID（iceId 或 confId 至少一个必填） |
| `confId` | int | 否 | 配置 ID（iceId 或 confId 至少一个必填） |
| `lane` | string | 否 | 泳道 |
| `address` | string | 否 | Client 地址 |

**响应体：**

```json
{
  "fields": [
    {
      "key": "uid",
      "valueType": "Long",
      "nodeId": 42,
      "nodeName": "checkUser"
    }
  ],
  "fallback": false
}
```

`fallback: true` 表示目标 Client 离线，已回退到其他在线 Client 获取 Schema。

## Client SDK

所有三种 SDK（Java / Go / Python）的 FileClient 均内置了 Mock 轮询。**无需额外配置**——当 mock 目录存在时，Client 自动处理 Mock 请求。

## Roam Key 扫描

每种 SDK 内置静态代码分析器，扫描叶子节点方法（`doFlow` / `doResult` / `doNone`）中的 Roam key 访问，提取元数据。该元数据为 Schema 接口的自动表单字段生成提供支持。

<CodeGroup>
  <CodeGroupItem title="Java" active>

ASM 字节码分析。编译后自动可用，无需额外步骤。

  </CodeGroupItem>

  <CodeGroupItem title="Go">

基于 `go/ast` 的分析，通过 `ice-scan` CLI 工具生成代码：

```bash
ice-scan -dir ./handler -out ./ice_scan_gen.go
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

基于 `ast` 模块的分析。运行时自动扫描，无需额外步骤。

  </CodeGroupItem>
</CodeGroup>
