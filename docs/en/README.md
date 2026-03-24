---
home: true
title: Ice - Lightweight Visual Rule Engine | Business Orchestration Framework
description: Ice is a lightweight, high-performance visual rule engine and business orchestration framework. Zero external dependencies, multi-language SDKs for Java, Go, and Python, millisecond-level execution, one-click Docker deployment.
keywords: rule engine,visual rule engine,Java rule engine,Go rule engine,business orchestration framework,decision engine,lightweight rule engine,open source rule engine,low code,Ice rule engine,risk control engine
heroImage: /images/hero.svg
head:
  - - meta
    - property: og:title
      content: Ice - Lightweight Visual Rule Engine | Business Orchestration Framework
  - - meta
    - property: og:description
      content: Ice is a lightweight, high-performance visual rule engine and business orchestration framework with zero external dependencies and multi-language SDK support.
  - - meta
    - property: og:image
      content: https://waitmoon.com/images/hero.png
  - - meta
    - property: og:url
      content: https://waitmoon.com/en/
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Ice - Lightweight Visual Rule Engine | Business Orchestration Framework
  - - meta
    - name: twitter:description
      content: Ice is a lightweight, high-performance visual rule engine and business orchestration framework
  - - meta
    - name: twitter:image
      content: https://waitmoon.com/images/hero.png
actions:
  - text: Getting Started
    link: /en/guide/getting-started.html
    type: primary
  - text: Online Demo
    link: /en/playground/
    type: secondary
  - text: Core Concepts
    link: /en/guide/concepts.html
    type: secondary
features:
  - title: Visual Rule Orchestration
    details: Tree-based orchestration with a Web visual configuration interface. Nodes are independent and isolated, achieving true business decoupling and configuration flexibility.
  - title: Lightweight and High Performance
    details: Pure in-memory computation with millisecond-level response and near-zero performance overhead. No database or middleware dependencies required. One-click Docker deployment.
  - title: Multi-Language SDKs
    details: Feature-equivalent Java, Go, and Python SDKs. Hot reload rules that take effect in seconds without application restart.
---

## Get Started in Three Steps

### 1. Deploy Ice Server

<CodeGroup>
  <CodeGroupItem title="Docker" active>

```bash
docker run -d --name ice-server -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

  </CodeGroupItem>

  <CodeGroupItem title="Manual Deployment">

```bash
tar -xzvf ice-server-*.tar.gz && cd ice-server
sh ice.sh start
```

  </CodeGroupItem>
</CodeGroup>

Visit http://localhost:8121 to access the visual configuration interface.

### 2. Integrate Client SDK

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");
client.start();
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
client, _ := ice.NewClient(1, "./ice-data")
client.Start()
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()
```

  </CodeGroupItem>
</CodeGroup>

::: tip Shared Storage
Server and Client synchronize configurations by sharing the same `ice-data` directory, with no network communication required.
:::

### 3. Configure Rules and Execute

Configure a rule tree in the Server interface -> click Apply -> Client automatically hot-loads the rules. Call execution in your code:

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
IceRoam roam = IceRoam.create();
roam.setId(1L);
roam.put("uid", 12345);
Ice.syncProcess(roam);
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
roam := ice.NewRoam()
roam.SetId(1)
roam.Put("uid", 12345)
ice.SyncProcess(context.Background(), roam)
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
roam = ice.Roam.create(id=1)
roam.put("uid", 12345)
ice.sync_process(roam)
```

  </CodeGroupItem>
</CodeGroup>

[View the full Getting Started guide](/en/guide/getting-started.html) | [Java SDK](/en/sdk/java.html) | [Go SDK](/en/sdk/go.html) | [Python SDK](/en/sdk/python.html)

## Use Cases

| Scenario | Description |
|----------|-------------|
| **Marketing Campaigns** | Flexible configuration of complex marketing rules like coupons, discount thresholds, and group deals |
| **Risk Control** | Credit risk assessment, anti-fraud, and real-time risk evaluation engines |
| **Access Control** | Dynamic permission management, role configuration, and resource access control |
| **Process Orchestration** | Ticket routing, approval workflows, and state machine management |

## Why Choose Ice

| Feature | Ice | Traditional Rule Engines (Drools, etc.) |
|---------|-----|----------------------------------------|
| **Learning Curve** | Get started in 5 minutes | Requires learning a DSL |
| **Deployment Complexity** | One-click Docker deployment, zero dependencies | Requires database and middleware |
| **Configuration Method** | Web visual tree-based orchestration | Text or code |
| **Performance** | Pure in-memory, millisecond-level | Compiled execution with overhead |
| **Rule Modification** | Hot reload, takes effect in seconds | Requires restart or redeployment |
| **Change Impact** | Nodes are independent, no ripple effects | Changes cascade across the system |

## Users

<div class="user-logos">
<div class="logo-row">
  <a href="https://www.agora.io" target="_blank" rel="noopener"><img :src="$withBase('/images/user/agora.png')" alt="Agora"></a>
  <a href="https://www.ximalaya.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/xima.png')" alt="Ximalaya"></a>
  <a href="https://www.h3c.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/h3c.png')" alt="H3C"></a>
  <a href="https://www.tuhu.cn" target="_blank" rel="noopener"><img :src="$withBase('/images/user/tuhu.png')" alt="Tuhu"></a>
  <a href="https://www.iflytek.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/iflytek.png')" alt="iFLYTEK"></a>
  <a href="https://www.htwins.com.cn" target="_blank" rel="noopener"><img :src="$withBase('/images/user/huatai.png')" alt="Huatai"></a>
</div>
<div class="logo-row">
  <a href="https://www.lizhi.fm" target="_blank" rel="noopener"><img :src="$withBase('/images/user/lizhi.png')" alt="Lizhi FM"></a>
  <a href="http://www.china-hushan.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/hushan.png')" alt="Hushan"></a>
  <a href="https://www.princesky.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/lampo.png')" alt="Lampo"></a>
  <a href="http://www.xibaoda.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/xibaoda.png')" alt="Xibaoda"></a>
  <a href="https://www.zfire.top" target="_blank" rel="noopener"><img :src="$withBase('/images/user/zfire.png')" alt="ZFire"></a>
</div>
</div>

<div class="site-footer">
  Apache-2.0 Licensed | Copyright 2022-present WaitMoon
</div>

<style>
.user-logos {
  margin: 24px 0;
}
.logo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.logo-row a {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s;
}
.logo-row a:hover {
  background-color: var(--c-bg-light);
}
.logo-row img {
  height: 1.5em;
  max-width: 160px;
  object-fit: contain;
}
.site-footer {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid var(--c-border);
  font-size: 12px;
  color: var(--c-text-lightest);
  text-align: center;
}
</style>
