---
home: true
title: Ice - 轻量级可视化Java规则引擎 | 业务编排框架
description: Ice是一个轻量级、高性能的Java规则引擎和业务编排框架，提供可视化配置界面，支持SpringBoot 2.x/3.x。全新的编排思想，极大降低规则维护成本，广泛应用于企业级业务场景。
keywords: 规则引擎,可视化规则引擎,Java规则引擎,业务编排框架,轻量级规则引擎,开源规则引擎,SpringBoot规则引擎,企业级规则引擎,可视化业务编排,Ice规则引擎
heroImage: /images/hero.svg
head:
  - - meta
    - property: og:title
      content: Ice - 轻量级可视化Java规则引擎 | 业务编排框架
  - - meta
    - property: og:description
      content: Ice是一个轻量级、高性能的Java规则引擎和业务编排框架，提供可视化配置界面，支持SpringBoot 2.x/3.x。全新的编排思想，极大降低规则维护成本。
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
      content: Ice - 轻量级可视化Java规则引擎 | 业务编排框架
  - - meta
    - name: twitter:description
      content: Ice是一个轻量级、高性能的Java规则引擎和业务编排框架，提供可视化配置界面
  - - meta
    - name: twitter:image
      content: https://waitmoon.com/images/hero.png
actions:
  - text: 快速上手
    link: /guide/getting-started.html
    type: primary
  - text: 编排逻辑
    link: https://waitmoon.com/ice-logic/zh/
    type: secondary
  - text: 项目简介
    link: /guide/
    type: secondary
features:
  - title: 🎯 创新的可视化规则编排
    details: Ice规则引擎采用全新的树形编排思想，支持可视化配置界面。在保障业务解耦和代码复用的同时，提供更大的规则配置自由度，极大降低企业级规则引擎的维护成本。
  - title: ⚡ 轻量级高性能架构
    details: 作为轻量级Java规则引擎，Ice几乎零性能损耗。纯内存运算，毫秒级响应，完美支持高并发业务场景，让您只需关注业务逻辑本身。
  - title: 🐳 Docker一键部署（2.0新特性）
    details: 零依赖架构，无需MySQL和ZooKeeper。提供官方Docker镜像，一行命令即可启动，5秒完成部署。支持文件系统存储，配置可版本控制。
---

## 什么是 Ice？

Ice 是一个**轻量级可视化Java规则引擎**和**业务编排框架**，专为解决复杂业务规则和灵活编排需求而设计。作为开源规则引擎，Ice 提供了完整的可视化规则配置平台，支持企业级业务场景的规则管理和动态编排。

### 核心特性

- ✅ **可视化规则引擎**：提供直观的Web管理界面，支持可视化配置和实时预览
- ✅ **高性能架构**：基于纯内存计算，毫秒级响应，适用于高并发场景  
- ✅ **灵活的业务编排**：支持多种编排模式（AND/OR/ALL/NONE），满足复杂业务需求
- ✅ **SpringBoot深度集成**：提供Starter快速接入，支持SpringBoot 2.x和3.x
- ✅ **企业级规则引擎**：已在声网、喜马拉雅、新华三等知名企业生产环境验证
- ✅ **零学习成本**：简单易用的API设计，5分钟快速上手
- ✅ **零数据库依赖**（2.0新特性）：使用文件系统存储，无需MySQL
- ✅ **Docker原生支持**（2.0新特性）：一键部署，开箱即用

### 适用场景

Ice规则引擎广泛应用于：
- 🎁 **营销活动规则**：优惠券、满减、拼团等复杂营销规则配置
- 💰 **风控规则系统**：信贷风控、反欺诈、实时决策引擎
- 🔐 **权限控制**：动态权限管理、角色配置、资源访问控制
- 📊 **业务流程编排**：工单流转、审批流程、状态机管理
- 🎯 **个性化推荐**：用户画像、内容分发、智能推荐规则

### 🚀 快速部署（2.0新特性）

**Docker 一键启动：**

```bash
docker run -d --name ice-server -p 8121:8121 -v ./ice-data:/app/ice-data waitmoon/ice-server:2.0.0
```

启动后访问 http://localhost:8121 即可使用！

### 最新版本

> v${version}

```xml
<!-- SpringBoot 3.x 规则引擎 Starter -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>${version}</version>
</dependency>

<!-- SpringBoot 2.x 规则引擎 Starter -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>${version}</version>
</dependency>

<!-- 非SpringBoot 项目使用 Ice 核心包 -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>${version}</version>
</dependency>
```

### 用户列表
> 谁在使用ice?

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
<br><br>

<!-- <CodeGroup>
  <CodeGroupItem title="1" active>

```bash
```

  </CodeGroupItem>

  <CodeGroupItem title="2">

```bash

```
  </CodeGroupItem>
</CodeGroup> -->

<div class="footer" style="font-size:12px">
  <p>
    Apache-2.0 Licensed | Copyright 2022-present WaitMoon | <a href="https://beian.miit.gov.cn">沪ICP备2025108706号</a>
  </p>
</div>

<style>
  .link {
    width: 8.4em;
    text-align: left;
  }
  .link img {
    height:1.5em;
    max-width:180px;
    margin: 14px;
  }
  .page-wwads{
    width:100%!important;
    min-height: 0;
    margin: 0;
  }
  .page-wwads .wwads-img img{
    width:80px!important;
  }
  .page-wwads .wwads-poweredby{
    width: 40px;
    position: absolute;
    right: 25px;
    bottom: 3px;
  }
  .wwads-content .wwads-text, .page-wwads .wwads-text{
    height: 100%;
    padding-top: 5px;
    display: block;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .introContent {
    margin-top: 15px;
    font-size: 14px;
  }

</style>
