---
home: true
title: Ice - 轻量级可视化规则引擎 | 业务编排框架
description: Ice 是一款轻量级、高性能的可视化规则引擎和业务编排框架。零外部依赖，支持 Java、Go、Python 多语言 SDK，毫秒级执行，Docker 一键部署。
keywords: 规则引擎,可视化规则引擎,Java规则引擎,Go规则引擎,业务编排框架,决策引擎,轻量级规则引擎,开源规则引擎,低代码,Ice规则引擎,风控引擎
heroImage: /images/hero.svg
head:
  - - meta
    - property: og:title
      content: Ice - 轻量级可视化规则引擎 | 业务编排框架
  - - meta
    - property: og:description
      content: Ice 是一款轻量级、高性能的可视化规则引擎和业务编排框架，零外部依赖，支持多语言 SDK。
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
      content: Ice 是一款轻量级、高性能的可视化规则引擎和业务编排框架
  - - meta
    - name: twitter:image
      content: https://waitmoon.com/images/hero.png
actions:
  - text: 快速开始
    link: /guide/getting-started.html
    type: primary
  - text: 在线演示
    link: /playground/
    type: secondary
  - text: 核心概念
    link: /guide/concepts.html
    type: secondary
features:
  - title: 可视化规则编排
    details: 采用树形编排思想，提供 Web 可视化配置界面。节点独立、互不影响，真正实现业务解耦和配置自由。
  - title: 轻量高性能
    details: 纯内存运算，毫秒级响应，几乎零性能损耗。无需数据库、中间件等外部依赖，Docker 一键部署。
  - title: 多语言 SDK
    details: 提供功能对等的 Java、Go、Python SDK。规则热更新、秒级生效，无需重启应用。
---

## 三步快速开始

### 1. 部署 Ice Server

<CodeGroup>
  <CodeGroupItem title="Docker" active>

```bash
docker run -d --name ice-server -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

  </CodeGroupItem>

  <CodeGroupItem title="手动部署">

```bash
tar -xzvf ice-server-*.tar.gz && cd ice-server
sh ice.sh start
```

  </CodeGroupItem>
</CodeGroup>

访问 http://localhost:8121 进入可视化配置界面。

### 2. 集成 Client SDK

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

::: tip 共享存储
Server 和 Client 通过共享同一个 `ice-data` 目录实现配置同步，无需网络通信。
:::

### 3. 配置规则并执行

在 Server 界面配置规则树 → 点击应用 → Client 自动热加载，在代码中调用执行：

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

[查看完整快速开始指南](/guide/getting-started.html) · [Java SDK](/sdk/java.html) · [Go SDK](/sdk/go.html) · [Python SDK](/sdk/python.html)

## 适用场景

| 场景 | 说明 |
|------|------|
| **营销活动** | 优惠券、满减、拼团等复杂营销规则的灵活配置 |
| **风控决策** | 信贷风控、反欺诈、实时风险评估引擎 |
| **权限控制** | 动态权限管理、角色配置、资源访问控制 |
| **流程编排** | 工单流转、审批流程、状态机管理 |

## 为什么选择 Ice

| 特性 | Ice | 传统规则引擎（Drools 等） |
|------|-----|--------------------------|
| **学习成本** | 5 分钟上手 | 需要学习 DSL |
| **部署复杂度** | Docker 一键部署，零依赖 | 依赖数据库和中间件 |
| **配置方式** | Web 可视化树形编排 | 文本或代码 |
| **性能** | 纯内存，毫秒级 | 编译执行，有开销 |
| **修改规则** | 热更新，秒级生效 | 需重启或重新部署 |
| **变更影响** | 节点独立，互不影响 | 牵一发而动全身 |

## 用户列表

<div class="user-logos">
<div class="logo-row">
  <a href="https://www.agora.io" target="_blank" rel="noopener"><img :src="$withBase('/images/user/agora.png')" alt="Agora"></a>
  <a href="https://www.ximalaya.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/xima.png')" alt="喜马拉雅"></a>
  <a href="https://www.h3c.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/h3c.png')" alt="H3C"></a>
  <a href="https://www.tuhu.cn" target="_blank" rel="noopener"><img :src="$withBase('/images/user/tuhu.png')" alt="途虎养车"></a>
  <a href="https://www.iflytek.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/iflytek.png')" alt="科大讯飞"></a>
  <a href="https://www.htwins.com.cn" target="_blank" rel="noopener"><img :src="$withBase('/images/user/huatai.png')" alt="华泰"></a>
</div>
<div class="logo-row">
  <a href="https://www.lizhi.fm" target="_blank" rel="noopener"><img :src="$withBase('/images/user/lizhi.png')" alt="荔枝FM"></a>
  <a href="http://www.china-hushan.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/hushan.png')" alt="沪山"></a>
  <a href="https://www.princesky.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/lampo.png')" alt="蓝珀"></a>
  <a href="http://www.xibaoda.com" target="_blank" rel="noopener"><img :src="$withBase('/images/user/xibaoda.png')" alt="喜宝达"></a>
  <a href="https://www.zfire.top" target="_blank" rel="noopener"><img :src="$withBase('/images/user/zfire.png')" alt="ZFire"></a>
</div>
</div>

<div class="site-footer">
  Apache-2.0 Licensed | Copyright 2022-present WaitMoon | <a href="https://beian.miit.gov.cn">沪ICP备2025108706号</a>
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
