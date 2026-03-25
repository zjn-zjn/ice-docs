---
title: Mock Execution
description: Complete reference for Ice Mock execution, including architecture, Server API, Client SDK auto-polling, and Roam key scanning.
keywords: Mock execution,ice-mock,debugging,remote execution,Roam scanning,form generation
---

# Mock Execution

> Mock execution allows remote rule debugging from the Web UI to Client SDKs, with Server acting as a proxy using file-based RPC.

## Architecture

```
Web UI ──POST──▶ Server ──write request──▶ mock/{app}/{address}/{mockId}.json
                                           │
                 Client SDK polls ◀────────┘
                                           │
Web UI ◀─────── Server ◀──read response── mock/{app}/{address}/{mockId}_result.json
```

1. Web UI sends `POST /ice-server/mock/execute`
2. Server writes the request to `mock/{app}/{address}/{mockId}.json`
3. Client SDK polls the mock directory, picks up the request, executes the rule locally, and writes the result to `{mockId}_result.json`
4. Server polls for the response file (60s timeout, 1s interval) and returns the result to the Web UI

## Server API

### POST /ice-server/mock/execute

Execute a mock request.

**Request body:**

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `app` | int | Yes | Application ID |
| `iceId` | int | No | Rule ID (one of iceId or confId is required) |
| `confId` | int | No | Configuration ID (one of iceId or confId is required) |
| `ts` | int64 | No | Timestamp |
| `roam` | object | No | Input data |
| `target` | string | No | Execution target; defaults to `"all"` (any available client) when empty or omitted |

**target values:**

| Value | Description |
|-------|-------------|
| `all` | Any available client |
| `lane:xxx` | Client in a specific lane |
| `address:xxx` | Client at a specific address |

**Response body:**

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

Get the form schema for mock input. Used by the Web UI to auto-generate form fields.

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `app` | int | Yes | Application ID |
| `iceId` | int | No | Rule ID (at least one of iceId or confId is required) |
| `confId` | int | No | Configuration ID (at least one of iceId or confId is required) |
| `lane` | string | No | Lane |
| `address` | string | No | Client address |

**Response body:**

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

`fallback: true` means the target client was offline and the schema was obtained from a fallback client.

## Client SDK

All three SDKs (Java / Go / Python) have built-in mock polling in their FileClient. **No extra configuration needed** -- when the mock directory exists, the client automatically processes mock requests.

## Roam Key Scanning

Each SDK includes a static code analyzer that scans leaf node methods (`doFlow` / `doResult` / `doNone`) to extract roam key access metadata. This metadata powers the schema endpoint's automatic form field generation.

<CodeGroup>
  <CodeGroupItem title="Java" active>

ASM bytecode analysis. Automatically available after compilation, no extra steps needed.

  </CodeGroupItem>

  <CodeGroupItem title="Go">

`go/ast` based analysis, using the `ice-scan` CLI tool for code generation:

```bash
ice-scan -dir ./handler -out ./ice_scan_gen.go
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

`ast` module based analysis. Scans automatically at runtime, no extra steps needed.

  </CodeGroupItem>
</CodeGroup>
