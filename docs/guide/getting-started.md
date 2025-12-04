---
title: Ice 快速上手 - 5分钟快速接入指南
description: 快速接入Ice规则引擎的完整指南。包含Docker部署、文件系统配置、Client接入等详细步骤，支持SpringBoot 2.x/3.x和非Spring项目。
keywords: 规则引擎接入,快速开始,安装教程,配置指南,SpringBoot规则引擎,Ice安装,Docker部署
head:
  - - meta
    - property: og:title
      content: Ice 快速上手 - 5分钟快速接入指南
  - - meta
    - property: og:description
      content: 快速接入Ice规则引擎的完整指南。包含Docker部署、文件系统配置、Client接入等详细步骤。
---

# Ice 规则引擎快速上手指南

> 5分钟快速接入 Ice 规则引擎，开启可视化业务编排之旅！

本指南将帮助您快速搭建 Ice 规则引擎环境，包括 **Ice Server**（规则管理平台）和 **Ice Client**（业务应用集成）两部分。

## 2.0 版本新特性

Ice 2.0 进行了重大架构升级：

- ✅ **零数据库依赖**：使用文件系统存储，无需 MySQL
- ✅ **零中间件依赖**：移除 ZooKeeper 高可用依赖
- ✅ **Docker 原生支持**：一键部署，开箱即用
- ✅ **更轻量**：架构简化，部署更简单

## 环境要求

- **JDK**: 1.8+ (SpringBoot 3.x 需要 JDK 17+)
- **Docker**: 推荐使用 Docker 部署（可选）
- **SpringBoot**: 2.x 或 3.x（可选）

## 第一步：安装 Ice Server 规则管理平台

Ice Server 是可视化规则配置和管理平台，提供规则编排、实时推送、版本管理等功能。

### 方式一：Docker 部署（推荐）

**使用 Docker 一键部署：**

```bash
# 拉取镜像
docker pull waitmoon/ice-server:2.0.0

# 运行容器
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.0
```

**使用 Docker Compose 部署：**

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  ice-server:
    image: waitmoon/ice-server:2.0.0
    container_name: ice-server
    ports:
      - "8121:8121"
    volumes:
      # 挂载配置数据目录 - 这是唯一需要持久化的目录
      - ./ice-data:/app/ice-data
    environment:
      - JAVA_OPTS=-Xms512m -Xmx512m
      - ICE_STORAGE_PATH=/app/ice-data
      - SERVER_PORT=8121
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8121/ || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

启动服务：

```bash
docker-compose up -d
```

### 方式二：手动部署

**下载 Ice Server 安装包：**

最新版本 v2.0.0

下载地址：[https://waitmoon.com/downloads/](https://waitmoon.com/downloads/)

解压安装包：

```bash
tar -xzvf ice-server-*.tar.gz
cd ice-server
```

**配置 Ice Server：**

编辑 `application-prod.yml` 配置文件：

```yml
server:
  port: 8121

ice:
  # 文件系统存储路径
  storage:
    path: ./ice-data
  # 客户端失活超时时间(秒)
  client-timeout: 60
  # 版本文件保留数量
  version-retention: 1000
```

**启动/停止/重启 Server：**

```bash
# 启动
sh ice.sh start

# 停止
sh ice.sh stop

# 重启
sh ice.sh restart
```

### 打开配置后台

启动成功后，访问 Ice 规则引擎管理后台：

👉 **http://localhost:8121/**

### 在线体验环境

Ice 规则引擎在线演示环境（仅 app=1 有真实部署的 client）：

👉 [http://eg.waitmoon.com](http://eg.waitmoon.com)

## 第二步：SpringBoot 项目接入 Ice Client

Ice Client 是规则引擎的执行客户端，集成到您的业务应用中执行规则。

参考完整示例：[ice-test 模块](https://github.com/zjn-zjn/ice)

### 添加 Maven 依赖

根据您的 SpringBoot 版本选择对应的 Ice Starter：

```xml
<!-- SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>2.0.0</version>
</dependency>

<!-- SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>2.0.0</version>
</dependency>
```

### 增加 Ice 配置

```yml
ice:
  # 应用ID，与后台配置app对应
  app: 1
  # 文件存储路径（与Server端共享同一目录）
  storage:
    path: ./ice-data
  # 用于扫描叶子节点，多个包用','分隔
  # 默认扫描全部（扫描全部会拖慢应用启动速度）
  scan: com.ice.test
  # 版本轮询间隔(秒)，默认5秒
  poll-interval: 5
  # 心跳更新间隔(秒)，默认10秒
  heartbeat-interval: 10
  # 线程池配置(用于并发关系节点)
  pool:
    parallelism: -1  # 默认-1,≤0表示采用默认配置
```

### 配置共享说明

**重要**：Ice Client 需要与 Ice Server **共享同一个存储目录**（`ice.storage.path`）。

#### 本地开发环境

在本地开发时，Client 和 Server 使用相同的本地路径即可：

```yml
# Server 和 Client 都配置相同路径
ice:
  storage:
    path: ./ice-data
```

#### Docker 环境

在 Docker 环境中，通过卷挂载实现共享：

```yaml
# docker-compose.yml
services:
  ice-server:
    volumes:
      - ./ice-data:/app/ice-data

  your-app:
    volumes:
      - ./ice-data:/app/ice-data  # 相同的挂载目录
```

#### 分布式环境

在分布式环境中，可以使用共享存储（如 NFS、云盘等）：

```yaml
services:
  ice-server:
    volumes:
      - /shared/ice-data:/app/ice-data

  client-1:
    volumes:
      - /shared/ice-data:/app/ice-data

  client-2:
    volumes:
      - /shared/ice-data:/app/ice-data
```

## 第三步：非 SpringBoot 项目接入

如果您的项目不是 SpringBoot，可以使用 Ice Core 包直接集成规则引擎。

### 添加 Maven 依赖

```xml
<!-- Ice 核心包 - 适用于非SpringBoot项目 -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>2.0.0</version>
</dependency>
```

### Java 代码集成

```java
import com.ice.core.client.IceFileClient;

// 创建 Ice 文件客户端实例
IceFileClient iceFileClient = new IceFileClient(
    1,                    // app ID，与Server配置对应
    "./ice-data",         // 存储路径（与Server共享）
    "com.ice.test"        // 叶子节点扫描包路径
);

// 启动客户端，从文件系统加载配置
iceFileClient.start();

// 等待启动完成
iceFileClient.waitStarted();

// ... 业务逻辑 ...

// 应用关闭时销毁客户端
iceFileClient.destroy();
```

#### 完整构造参数

```java
/**
 * @param app                    应用ID
 * @param storagePath            文件存储路径
 * @param parallelism            并行度（≤0使用默认ForkJoinPool）
 * @param scanPackages           扫描包路径集合
 * @param pollIntervalSeconds    版本轮询间隔（秒）
 * @param heartbeatIntervalSeconds 心跳间隔（秒）
 */
IceFileClient iceFileClient = new IceFileClient(
    1,                          // app ID
    "./ice-data",               // 存储路径
    -1,                         // 并行度
    Set.of("com.ice.test"),     // 扫描包
    5,                          // 轮询间隔
    10                          // 心跳间隔
);
```

## 第四步：规则开发与配置

### 创建叶子节点

Ice 提供三种叶子节点类型：

- **Flow 节点**：流程控制，返回 true/false
- **Result 节点**：结果处理，执行具体业务
- **None 节点**：辅助操作，无返回值

示例代码：

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    @Resource
    private SendService sendService;

    private String key;      // 可配置的uid key
    private double value;    // 可配置的发放金额

    @Override
    protected boolean doRoamResult(IceRoam roam) {
        Integer uid = roam.getMulti(key);
        if (uid == null || value <= 0) {
            return false;
        }
        return sendService.sendAmount(uid, value);
    }
}
```

### 执行规则

```java
// 创建执行包
IcePack pack = new IcePack();
pack.setIceId(1L);  // 规则ID

// 设置业务参数
IceRoam roam = new IceRoam();
roam.put("uid", 12345);
roam.put("amount", 100.0);
pack.setRoam(roam);

// 同步执行
Ice.syncProcess(pack);

// 或异步执行
List<Future<IceContext>> futures = Ice.asyncProcess(pack);
```

### 规则引擎开发视频教程

Ice 规则引擎详细开发教程：[https://www.bilibili.com/video/BV1Q34y1R7KF](https://www.bilibili.com/video/BV1Q34y1R7KF)

## 文件存储目录结构

Ice 2.0 使用以下目录结构存储配置：

```
ice-data/
├── apps/                    # 应用配置
│   ├── _id.txt             # 应用ID生成器
│   └── 1.json              # 应用1的配置
├── clients/                 # 客户端信息
│   └── 1/                  # 应用1的客户端
│       ├── 192.168.1.1_8080_12345.json  # 客户端心跳文件
│       └── _latest.json    # 最新客户端信息
├── 1/                       # 应用1的规则配置
│   ├── version.txt         # 当前版本号
│   ├── _base_id.txt        # Base ID生成器
│   ├── _conf_id.txt        # Conf ID生成器
│   ├── _push_id.txt        # Push ID生成器
│   ├── bases/              # Base规则配置
│   │   └── 1.json
│   ├── confs/              # Conf节点配置
│   │   ├── 1.json
│   │   └── 2.json
│   ├── versions/           # 版本增量更新
│   │   ├── 1_upd.json
│   │   └── 2_upd.json
│   └── history/            # 发布历史
│       └── 1.json
└── ...
```

## 常见问题

### Q: 如何从 1.x 版本迁移到 2.0？

A: 需要将 MySQL 中的数据导出为 JSON 文件格式。具体迁移工具将在后续版本提供。

### Q: 多个 Server 实例如何部署？

A: 多个 Server 实例需要共享同一个存储目录（如 NFS 或云盘）。

### Q: Client 如何获取配置更新？

A: Client 通过轮询 `version.txt` 文件检测版本变化，发现新版本后加载增量更新文件。

### Q: 如何监控客户端状态？

A: Server 通过读取 `clients/` 目录下的心跳文件来感知客户端状态，超时未更新的客户端会被标记为离线。
