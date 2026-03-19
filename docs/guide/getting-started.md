---
title: Ice 快速上手 - 5分钟快速接入指南
description: 快速接入 Ice 规则引擎的完整指南。包含 Server 部署、Client SDK 集成等详细步骤，支持 Docker 一键部署。
keywords: 规则引擎接入,快速开始,安装教程,配置指南,Docker部署,Client SDK
head:
  - - meta
    - property: og:title
      content: Ice 快速上手 - 5分钟快速接入指南
  - - meta
    - property: og:description
      content: 快速接入 Ice 规则引擎的完整指南，包含 Server 部署、Client SDK 集成等详细步骤。
---

# Ice 快速上手指南

> 5 分钟快速接入 Ice 规则引擎，开启可视化业务编排之旅！

## 前置了解

Ice 采用 **Server + Client + 共享存储** 架构：

- **Ice Server**：可视化规则配置管理平台
- **Ice Client**：规则执行 SDK，集成到您的业务应用
- **共享存储**：Server 和 Client 通过共享文件目录实现配置同步

## 环境要求

- **Docker**：推荐使用 Docker 部署 Server
- **JDK**：1.8+（SpringBoot 3.x 需要 JDK 17+）

## 第一步：部署 Ice Server

### 方式一：Docker 部署（推荐）

```bash
# 拉取并运行
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

或使用 Docker Compose：

```yaml
# docker-compose.yml
version: '3.8'
services:
  ice-server:
    image: waitmoon/ice-server:latest
    container_name: ice-server
    ports:
      - "8121:8121"
    volumes:
      - ./ice-data:/app/ice-data
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### 方式二：手动部署

下载对应平台的最新版本：[https://waitmoon.com/downloads/3.0.0/](https://waitmoon.com/downloads/3.0.0/)

| 平台 | 下载包 |
|------|--------|
| Linux x86_64 | `ice-server-3.0.0-linux-amd64.tar.gz` |
| Linux ARM64 | `ice-server-3.0.0-linux-arm64.tar.gz` |
| macOS x86_64 | `ice-server-3.0.0-darwin-amd64.tar.gz` |
| macOS ARM64 (Apple Silicon) | `ice-server-3.0.0-darwin-arm64.tar.gz` |
| Windows x86_64 | `ice-server-3.0.0-windows-amd64.zip` |

```bash
# 解压并启动（Linux/macOS）
tar -xzvf ice-server-3.0.0-linux-amd64.tar.gz
cd ice-server
sh ice.sh start
```

### 访问管理界面

启动成功后访问：**http://localhost:8121**

在线体验环境：[http://eg.waitmoon.com](http://eg.waitmoon.com)

## 第二步：集成 Ice Client SDK

### 添加依赖

<CodeGroup>
  <CodeGroupItem title="SpringBoot 3.x" active>

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>3.0.0</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="SpringBoot 2.x">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>3.0.0</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```bash
pip install ice-rules
```

  </CodeGroupItem>

  <CodeGroupItem title="非 SpringBoot">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>3.0.0</version>
</dependency>
```

  </CodeGroupItem>
</CodeGroup>

### 配置 Client

```yaml
# application.yml
ice:
  app: 1                        # 应用 ID，与 Server 配置对应
  storage:
    path: ./ice-data            # 共享存储路径（与 Server 相同）
  scan: com.your.package        # 叶子节点扫描包路径
```

::: warning 关键配置
**`ice.storage.path` 必须与 Server 共享同一目录**

- 本地开发：使用相同的本地路径
- Docker 环境：通过卷挂载实现共享
- 分布式环境：使用 NFS 或云盘
:::

### 非 SpringBoot 项目

```java
import com.ice.core.client.IceFileClient;

// 创建客户端
IceFileClient client = new IceFileClient(
    1,                    // app ID
    "./ice-data",         // 共享存储路径
    "com.your.package"    // 叶子节点扫描包
);

// 启动
client.start();
client.waitStarted();

// 使用完毕后销毁
client.destroy();
```

## 第三步：开发叶子节点

Ice 提供三种叶子节点类型：

| 类型 | 基类 | 返回值 | 用途 |
|------|------|--------|------|
| **Flow** | `BaseLeafRoamFlow` | true/false | 条件判断、规则过滤 |
| **Result** | `BaseLeafRoamResult` | true/false | 业务操作、发放奖励 |
| **None** | `BaseLeafRoamNone` | 无 | 数据查询、日志记录 |

### 示例：金额发放节点

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    private String key;      // 可配置：用户 ID 的 key
    private double value;    // 可配置：发放金额

    @Override
    protected boolean doRoamResult(IceRoam roam) {
        Integer uid = roam.getMulti(key);
        if (uid == null || value <= 0) {
            return false;
        }
        // 调用业务接口发放金额
        return sendService.sendAmount(uid, value);
    }
}
```

## 第四步：配置并执行规则

### 1. 在 Server 配置规则

访问 http://localhost:8121 进入管理界面：

1. 创建应用（App）
2. 新建规则（Ice）
3. 配置节点树
4. **发布** 使配置生效

### 2. 在业务代码中执行

```java
// 创建执行包
IcePack pack = new IcePack();
pack.setIceId(1L);  // 规则 ID

// 设置业务参数
IceRoam roam = new IceRoam();
roam.put("uid", 12345);
roam.put("amount", 100.0);
pack.setRoam(roam);

// 执行规则
Ice.syncProcess(pack);

// 获取执行结果
Object result = roam.get("SEND_AMOUNT");
```

## 配置共享方案

### 本地开发

```yaml
# Server 和 Client 配置相同路径
ice:
  storage:
    path: ./ice-data
```

### Docker 环境

```yaml
# docker-compose.yml
services:
  ice-server:
    volumes:
      - ./ice-data:/app/ice-data

  your-app:
    volumes:
      - ./ice-data:/app/ice-data  # 相同挂载
```

### 分布式环境

使用 NFS 或云盘（阿里云 NAS、AWS EFS 等）作为共享存储。

## 下一步

- 📖 [详细说明](/guide/detail.html) - 深入了解节点类型和配置
- 🐹 [Go SDK 指南](/guide/go-sdk.html) - Go 语言集成指南
- 🐍 [Python SDK 指南](/guide/python-sdk.html) - Python 语言集成指南
- 🏗️ [架构设计](/advanced/architecture.html) - 理解 Ice 技术架构
- 🎥 [视频教程](https://www.bilibili.com/video/BV1Q34y1R7KF) - 配置开发实战

## 常见问题

### Client 无法加载配置？

检查 `ice.storage.path` 是否与 Server 指向同一目录。

### 规则修改后不生效？

确保在 Server 点击了「发布」按钮，配置才会同步到 Client。

### 更多问题

👉 [常见问题 FAQ](/guide/qa.html)
