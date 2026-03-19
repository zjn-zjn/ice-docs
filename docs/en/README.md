---
home: true
title: Ice - Lightweight Visual Rule Engine | Business Orchestration Framework
description: Ice is a lightweight, high-performance visual rule engine and business orchestration framework designed for decoupling. Features web-based visual configuration and supports Java, Go, and Python SDKs for low-code rule management.
keywords: rule engine,visual rule engine,business rule engine,java rule engine,go rule engine,python rule engine,decision engine,lightweight rule engine,open source rule engine,low-code,Ice rule engine,risk control engine
heroImage: /images/hero.svg
head:
  - - meta
    - property: og:title
      content: Ice - Lightweight Visual Rule Engine | Business Orchestration Framework
  - - meta
    - property: og:description
      content: Ice is a lightweight, high-performance visual rule engine and business orchestration framework with web-based visual configuration.
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
   - text: Get Started
     link: /en/guide/getting-started.html
     type: primary
   - text: Live Demo
     link: /en/playground/
     type: secondary
   - text: Introduction
     link: /en/guide/
     type: secondary
features:
   - title: 🎯 Visual Rule Orchestration
     details: Innovative tree-based orchestration with web visual configuration interface. Ensures business decoupling and code reuse while providing maximum flexibility for rule configuration.
   - title: ⚡ Lightweight & High Performance
     details: Pure in-memory computation with millisecond response time. Near-zero performance overhead, perfectly supporting high-concurrency business scenarios.
   - title: 🐳 Zero-Dependency Architecture
     details: No MySQL, ZooKeeper, or other external dependencies required. Docker one-click deployment in 5 seconds. JSON file storage with version control support.
---

## 🚀 Get Started in 3 Steps

### Step 1: Deploy Ice Server

<CodeGroup>
  <CodeGroupItem title="🐳 Docker  " active>

```bash
docker run -d --name ice-server -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

  </CodeGroupItem>

  <CodeGroupItem title="  📦 Manual">

```bash
# Download from: https://waitmoon.com/downloads/
# Extract and start
tar -xzvf ice-server-*.tar.gz && cd ice-server
sh ice.sh start
```

  </CodeGroupItem>
</CodeGroup>

Visit http://localhost:8121 to access the visual configuration interface.

### Step 2: Integrate Ice Client SDK

Add dependency and start Client (must share the same `ice-data` directory with Server):

**Java**
```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>${version}</version>
</dependency>
```

**Go**
```bash
go get github.com/zjn-zjn/ice/sdks/go
```

**Python**
```bash
pip install ice-rules
```

Start Client:

**Java**
```java
IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");
client.start();
```

**Go**
```go
client, _ := ice.NewClient(1, "./ice-data")
client.Start()
```

**Python**
```python
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()
```

### Step 3: Configure Rules and Execute

1. Configure business rules in Server's visual interface
2. Publish rules, Client auto hot-reloads
3. Call rule execution in your business code

**Java**
```java
IcePack pack = new IcePack();
pack.setIceId(1L);
pack.setRoam(new IceRoam().put("uid", 12345));
Ice.syncProcess(pack);
```

**Go**
```go
pack := ice.NewPack().SetIceId(1)
pack.Roam.Put("uid", 12345)
ice.SyncProcess(context.Background(), pack)
```

**Python**
```python
pack = ice.Pack(ice_id=1)
pack.roam.put("uid", 12345)
ice.sync_process(pack)
```

👉 [Getting Started Guide](/en/guide/getting-started.html) | [Go SDK Guide](/en/guide/go-sdk.html) | [Python SDK Guide](/en/guide/python-sdk.html)

## Use Cases

<div class="use-cases">

| Scenario | Description |
|----------|-------------|
| 🎁 **Marketing Campaigns** | Flexible configuration for coupons, discounts, group buying rules |
| 💰 **Risk Control** | Credit risk assessment, anti-fraud, real-time decision engine |
| 🔐 **Access Control** | Dynamic permission management, role configuration |
| 📊 **Process Orchestration** | Ticket routing, approval workflows, state machine management |

</div>

## Why Choose Ice?

<div class="comparison">

| Feature | Ice | Traditional Rule Engines |
|---------|-----|--------------------------|
| **Learning Curve** | 5 minutes to start | Need to learn DSL |
| **Deployment** | Docker one-click | Database/middleware required |
| **Configuration** | Web visual UI | Text/code |
| **Performance** | In-memory, milliseconds | Compilation overhead |
| **Rule Changes** | Hot-reload, seconds | Restart/redeploy needed |

</div>

## Who's Using Ice?

<div class="row">
<span class="link">
    <a href="https://www.agora.io" target="_blank">
        <img :src="$withBase('/images/user/agora.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.ximalaya.com" target="_blank">
        <img :src="$withBase('/images/user/xima.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.h3c.com" target="_blank">
        <img :src="$withBase('/images/user/h3c.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.tuhu.cn" target="_blank">
        <img :src="$withBase('/images/user/tuhu.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.htwins.com.cn" target="_blank">
        <img :src="$withBase('/images/user/huatai.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.lizhi.fm" target="_blank">
        <img :src="$withBase('/images/user/lizhi.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="http://www.china-hushan.com" target="_blank">
        <img :src="$withBase('/images/user/hushan.png')" class="no-zoom">
    </a>
</span>
</div>
<div class="row">
<span class="link">
    <a href="https://www.iflytek.com/" target="_blank">
        <img :src="$withBase('/images/user/iflytek.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.princesky.com/" target="_blank">
        <img :src="$withBase('/images/user/lampo.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="http://www.xibaoda.com/" target="_blank">
        <img :src="$withBase('/images/user/xibaoda.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.zfire.top/" target="_blank">
        <img :src="$withBase('/images/user/zfire.png')" class="no-zoom">
    </a>
</span>
</div>

<br>

<div class="footer" style="font-size:12px">
  <p>
    Apache-2.0 Licensed | Copyright 2022-present WaitMoon | <a href="https://beian.miit.gov.cn">沪ICP备2025108706号</a>
  </p>
</div>

<style>
  .use-cases table {
    width: 100%;
  }
  .comparison table {
    width: 100%;
  }
  .link {
    width: 8.4em;
    text-align: left;
  }
  .link img {
    height:1.5em;
    max-width:180px;
    margin: 14px;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
