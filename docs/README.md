---
home: true
title: Ice - 轻量级可视化规则引擎 | 业务编排框架
description: Ice 是一个轻量级、高性能的可视化规则引擎和业务编排框架。提供 Web 可视化配置界面，采用创新的树形编排思想，极大降低规则维护成本。
keywords: 规则引擎,可视化规则引擎,业务编排框架,决策引擎,轻量级规则引擎,开源规则引擎,低代码规则配置,Ice规则引擎
heroImage: /images/hero.svg
head:
  - - meta
    - property: og:title
      content: Ice - 轻量级可视化规则引擎 | 业务编排框架
  - - meta
    - property: og:description
      content: Ice 是一个轻量级、高性能的可视化规则引擎和业务编排框架，提供 Web 可视化配置界面。
  - - meta
    - property: og:image
      content: https://waitmoon.com/images/hero.png
  - - meta
    - property: og:url
      content: https://waitmoon.com/
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Ice - 轻量级可视化规则引擎 | 业务编排框架
  - - meta
    - name: twitter:description
      content: Ice 是一个轻量级、高性能的可视化规则引擎和业务编排框架
  - - meta
    - name: twitter:image
      content: https://waitmoon.com/images/hero.png
actions:
  - text: 快速上手
    link: /guide/getting-started.html
    type: primary
  - text: 在线体验
    link: http://eg.waitmoon.com
    type: secondary
  - text: 项目简介
    link: /guide/
    type: secondary
features:
  - title: 🎯 可视化规则编排
    details: 采用创新的树形编排思想，提供 Web 可视化配置界面。在保障业务解耦和代码复用的同时，提供最大的规则配置自由度。
  - title: ⚡ 轻量高性能
    details: 纯内存运算，毫秒级响应，几乎零性能损耗。完美支持高并发业务场景，让您只需关注业务逻辑本身。
  - title: 🐳 零依赖架构
    details: 无需 MySQL、ZooKeeper 等外部依赖。Docker 一键部署，5 秒完成。配置以 JSON 文件存储，支持版本控制。
---

## Ice 是什么？

Ice 是一个**轻量级可视化规则引擎**和**业务编排框架**，专为解决复杂业务规则和灵活编排需求而设计。

<div class="architecture-section">

### 📐 架构概览

Ice 采用 **Server + Client + 共享存储** 的架构模式：

```
┌─────────────────────────────────────────────────────────────┐
│                      共享存储 (ice-data/)                    │
│         JSON 文件存储，可使用 NFS/云盘实现分布式共享           │
└─────────────────────────────────────────────────────────────┘
           ▲ 写入配置                        ▲ 读取配置
           │                                 │
┌──────────┴──────────┐          ┌──────────┴──────────┐
│     Ice Server      │          │     Ice Client      │
│   (规则管理平台)     │          │   (规则执行引擎)     │
│                     │          │                     │
│ • Web 可视化配置     │          │ • 集成到业务应用     │
│ • 规则版本管理       │          │ • 轮询加载配置       │
│ • 发布热更新         │          │ • 内存执行规则       │
└─────────────────────┘          └─────────────────────┘
```

- **Ice Server**：可视化规则配置管理平台，负责规则编排、版本管理
- **Ice Client**：规则执行 SDK，集成到您的业务应用中执行规则
- **共享存储**：Server 和 Client 通过共享文件目录实现配置同步

</div>

## 🚀 三步快速开始

### Step 1：部署 Ice Server

<CodeGroup>
  <CodeGroupItem title="Docker 部署" active>

```bash
docker run -d --name ice-server -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

  </CodeGroupItem>

  <CodeGroupItem title="手动部署">

```bash
# 从官网下载：https://waitmoon.com/downloads/
# 解压并启动
tar -xzvf ice-server-*.tar.gz && cd ice-server
sh ice.sh start
```

  </CodeGroupItem>
</CodeGroup>

访问 http://localhost:8121 进入可视化配置界面。

### Step 2：集成 Ice Client SDK

在您的业务应用中添加依赖（当前提供 Java SDK，更多语言即将支持）：

<CodeGroup>
  <CodeGroupItem title="SpringBoot 3.x" active>

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>${version}</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="SpringBoot 2.x">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>${version}</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="非 SpringBoot">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>${version}</version>
</dependency>
```

  </CodeGroupItem>
</CodeGroup>

配置共享存储路径（与 Server 相同）：

```yaml
ice:
  app: 1
  storage:
    path: ./ice-data
```

> 💡 **关键点**：Client 需要与 Server 共享同一个存储目录（`ice-data`）

### Step 3：配置规则并执行

1. 在 Server 可视化界面配置业务规则
2. 发布规则，Client 自动热加载
3. 在业务代码中调用规则执行

```java
// 执行规则
IcePack pack = new IcePack();
pack.setIceId(1L);  // 规则 ID
pack.setRoam(new IceRoam().put("uid", 12345));
Ice.syncProcess(pack);
```

👉 [查看完整快速上手指南](/guide/getting-started.html)

## 适用场景

<div class="use-cases">

| 场景 | 说明 |
|------|------|
| 🎁 **营销活动** | 优惠券、满减、拼团等复杂营销规则的灵活配置 |
| 💰 **风控决策** | 信贷风控、反欺诈、实时风险评估引擎 |
| 🔐 **权限控制** | 动态权限管理、角色配置、资源访问控制 |
| 📊 **流程编排** | 工单流转、审批流程、状态机管理 |

</div>

## 为什么选择 Ice？

<div class="comparison">

| 特性 | Ice | 传统规则引擎 |
|------|-----|-------------|
| **学习成本** | 5 分钟上手 | 需要学习 DSL |
| **部署复杂度** | Docker 一键部署 | 依赖数据库/中间件 |
| **配置方式** | Web 可视化 | 文本/代码 |
| **性能** | 纯内存，毫秒级 | 编译执行，有开销 |
| **修改规则** | 热更新，秒级生效 | 需重启或重新部署 |

</div>

## 最新版本

> v${version}

<CodeGroup>
  <CodeGroupItem title="Maven" active>

```xml
<!-- ice-core 核心包 -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>${version}</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="SpringBoot 3.x">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>${version}</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="SpringBoot 2.x">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>${version}</version>
</dependency>
```

  </CodeGroupItem>
</CodeGroup>

## 用户列表

> 谁在使用 Ice？

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
  .architecture-section {
    background: var(--c-bg-lighter);
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
  }
  .architecture-section pre {
    background: var(--c-bg);
  }
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
