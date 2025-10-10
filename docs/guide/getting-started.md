---
title: Ice 快速上手 - 5分钟快速接入指南
description: 快速接入Ice规则引擎的完整指南。包含Server部署、Client接入、数据库配置等详细步骤，支持SpringBoot 2.x/3.x和非Spring项目。
keywords: 规则引擎接入,快速开始,安装教程,配置指南,SpringBoot规则引擎,Ice安装
head:
  - - meta
    - property: og:title
      content: Ice 快速上手 - 5分钟快速接入指南
  - - meta
    - property: og:description
      content: 快速接入Ice规则引擎的完整指南。包含Server部署、Client接入、数据库配置等详细步骤。
---

# Ice 规则引擎快速上手指南

> 5分钟快速接入 Ice 规则引擎，开启可视化业务编排之旅！

本指南将帮助您快速搭建 Ice 规则引擎环境，包括 **Ice Server**（规则管理平台）和 **Ice Client**（业务应用集成）两部分。

## 环境要求

- **JDK**: 1.8+ (SpringBoot 3.x需要JDK 17+)
- **MySQL**: 5.7+ 或 8.0+
- **SpringBoot**: 2.x 或 3.x (可选)

## 第一步：安装数据库

Ice规则引擎使用MySQL存储规则配置。请先安装MySQL，然后**新建ice数据库**：

```sql
CREATE DATABASE IF NOT EXISTS ice Character Set utf8mb4;
```

**备注：** 如果启动时报找不到ice相关的表，则需手动创建ice相关表结构，表结构sql地址：

[https://gitee.com/waitmoon/ice/blob/master/ice-server/src/main/resources/sql/ice.sql](https://gitee.com/waitmoon/ice/blob/master/ice-server/src/main/resources/sql/ice.sql)
或
[https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql](https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql)

另：达梦数据库对应的sql在1.5.0-server-dm分支上

## 第二步：安装 Ice Server 规则管理平台

Ice Server 是可视化规则配置和管理平台，提供规则编排、实时推送、版本管理等功能。

### 下载 Ice Server 安装包

最新版本 v1.5.0（其中-dm是达梦数据库版本）

下载地址：[https://waitmoon.com/downloads/](https://waitmoon.com/downloads/)

解压安装包：

```bash
tar -xzvf ice-server-*.tar.gz
cd ice-server
```

### 配置 Ice Server

编辑 `application-prod.yml` 配置文件：

```yml
server:
  port: 8121 #端口
spring:
  datasource: #数据库配置
    url: jdbc:mysql://127.0.0.1:3306/ice?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai&useSSL=false
    username: username
    password: password
    initialization-mode: always
ice:
  port: 18121 #与客户端通信端口
#  ha: #高可用配置，当前默认支持zookeeper
#    address: localhost:2181,localhost:2182,localhost:2183
  pool: #线程池配置(用于更新client)
    core-size: 4
    max-size: 4
    keep-alive-seconds: 60
    queue-capacity: 60000
```

### 启动/停止/重启server

启动
**sh ice.sh start**

停止
**sh ice.sh stop**

重启
**sh ice.sh restart**

### 打开配置后台

http://localhost:8121/

### Ice Server 管理后台

启动成功后，访问 Ice 规则引擎管理后台：http://localhost:8121/

### 在线体验环境

Ice 规则引擎在线演示环境（仅app=1有真实部署的client）：

👉 [http://eg.waitmoon.com](http://eg.waitmoon.com)

## 第三步：SpringBoot 项目接入 Ice Client

Ice Client 是规则引擎的执行客户端，集成到您的业务应用中执行规则。

参考完整示例：[ice-test 模块](https://github.com/zjn-zjn/ice)

### 添加 Maven 依赖

根据您的 SpringBoot 版本选择对应的 Ice Starter：

```xml
<!-- SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>${version}</version>
</dependency>

<!-- SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>${version}</version>
</dependency>
```

#### 高可用额外依赖

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.1</version>
</dependency>
```

### 增加ice配置

```yml
ice: #ice client配置
  app: 1 #与后台配置app对应
#  server: zookeeper:localhost:2181,localhost:2182,localhost:2183 #server高可用配置
  server: 127.0.0.1:18121 #server 地址(serverHost:serverPort)
  scan: com.ice.test #用于扫描叶子节点，多个包用','分隔(默认扫描全部，扫描全部会拖慢应用启动速度)
  pool: #线程池配置(用于并发关系节点)
    parallelism: -1 #默认-1,≤0表示采用默认配置
```

## 第四步：非 SpringBoot 项目接入

如果您的项目不是 SpringBoot，可以使用 Ice Core 包直接集成规则引擎。

### 添加 Maven 依赖

```xml
<!-- Ice 核心包 - 适用于非SpringBoot项目 -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>${version}</version>
</dependency>
```

### 高可用配置（可选）

如果需要 Ice Server 高可用，需要额外添加 Zookeeper 依赖：

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.1</version>
</dependency>
```

### Java 代码集成

```java
// 创建 Ice 客户端实例
IceNioClient iceNioClient = new IceNioClient(
    1,                      // app ID，与Server配置对应
    "127.0.0.1:18121",     // Ice Server地址
    "com.ice.test"         // 叶子节点扫描包路径
);

// 启动客户端，连接 Ice Server 并初始化规则配置
iceNioClient.start();

// 应用关闭时销毁客户端
iceNioClient.destroy();
```

## 第五步：规则开发与配置

完整的规则开发教程请参考：[ice-test 示例模块](https://github.com/zjn-zjn/ice)

### 规则引擎开发视频教程

Ice 规则引擎详细开发教程：[https://www.bilibili.com/video/BV1Q34y1R7KF](https://www.bilibili.com/video/BV1Q34y1R7KF)

<iframe src="//player.bilibili.com/player.html?aid=807134055&bvid=BV1Q34y1R7KF&cid=456033283&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>