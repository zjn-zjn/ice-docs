---
title: Ice 规则引擎升级指南 - 版本升级说明
description: Ice规则引擎版本升级指南，包含每个版本的升级步骤、配置变更、代码修改等详细说明。帮助您顺利升级规则引擎版本。
keywords: 升级指南,版本升级,迁移指南,Ice升级,规则引擎升级,版本兼容
head:
  - - meta
    - property: og:title
      content: Ice 规则引擎升级指南 - 版本升级说明
  - - meta
    - property: og:description
      content: Ice规则引擎详细的版本升级指南和迁移说明。
---

# Ice 规则引擎升级指南

> ⚠️ **重要提示**：升级 Ice 规则引擎时，请先升级 Server，再升级 Client

## v1.3.0 → v1.5.0 重大版本升级

Ice 规则引擎 1.5.0 是一个重大版本更新，带来了全新的可视化界面和 SpringBoot 3.x 支持。

### 服务端升级（Ice Server）
**全新的可视化树图结构**
- ✨ 新增拖拽式规则编排界面
- 🎨 优化规则配置页面交互
- 📊 增强规则可视化展示

### 客户端升级（Ice Client）

**1. SDK 兼容性**
- ✅ 本次升级**完全兼容**老的 Client SDK，可不升级
- 建议升级以获得更好的性能和新特性支持

**2. 依赖名称变更**

Ice 规则引擎客户端依赖名称调整，以支持不同的 SpringBoot 版本：

```xml
<!-- 旧版本（不再推荐） -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-client-spring-boot-starter</artifactId>
  <version>1.3.0</version>
</dependency>

<!-- 新版本 - SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>1.5.0</version>
</dependency>

<!-- 新版本 - SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>1.5.0</version>
</dependency>
```

## v1.2.0-v1.3.0
* 一些改进与修复，年代久远不太记得了...

## v1.1.0-v1.2.0

* **配置**
* * 服务端
* * * 配置页面调整

* * 客户端
* * * 增加@IceNode、@IceField、@IceIgnore注解用于提高配置的可解释性

## v1.0.4-v1.1.0

* **配置**
* * 服务端
* * * 新增ice.ha配置，用于支持server高可用，单机server无需配置

* * 客户端
* * * ice.server配置支持server高可用，如ice.server=zookeeper:localhost:2181，单机server与以往配置一致

## v1.0.3-v1.0.4

* **代码**
* * IceNioClient.connect()变成start()，仅非Spring项目使用需修改

## v1.0.1-v1.0.2/v1.0.3

* **配置**
* * 客户端
* * * 新增ice.scan配置，用于扫描叶子节点(默认扫描全部，扫描全部会拖慢应用启动速度)，多个包用','分隔

* **代码**
* * Ice.processCxt和Ice.processSingleCxt更名为processCtx和processSingleCtx
* * IceErrorHandle.handleError()和BaseNode.errorHandle()增加错误入参Throwable t


## v1.0.1
> 不要使用1.0.0！！！因为打包推送中央仓库时的网络问题，导致1.0.0 jar包不完整！

* **配置**
* * 服务端 
* * * ice.rmi.port去除rmi变成ice.port，升级时推荐替换掉原有端口号，避免脏数据问题
* * 客户端 
* * * 去除ice.rmi.mode，ice.rmi.port
* * * ice.rmi.server去除rmi变成ice.server

* **代码**
* * Ice替代IceClient，process()变成asyncProcess()

* **功能**
* * 脱离spring运行，```client = new IceNioClient(app, server).connect()```connect()为阻塞方法，可开启新线程运行，```new Thread(client::connect).start()```，运行结束```client.destroy()```销毁即可