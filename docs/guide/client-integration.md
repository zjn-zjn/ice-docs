---
title: Ice Client SDK 集成指南
description: 详细介绍如何在业务应用中集成 Ice Client SDK，包括 SpringBoot 项目和非 SpringBoot 项目的接入方式。
keywords: Client SDK,集成指南,SpringBoot集成,ice-core,ice-spring-boot-starter
head:
  - - meta
    - property: og:title
      content: Ice Client SDK 集成指南
  - - meta
    - property: og:description
      content: 详细介绍如何在业务应用中集成 Ice Client SDK。
---

# Ice Client SDK 集成指南

> 详细了解如何在业务应用中集成 Ice Client SDK

## 概述

Ice Client 是规则执行引擎，需要集成到您的业务应用中。当前提供 Java、Go 和 Python 三种 SDK：

| 语言 | 依赖包 | 适用场景 |
|------|--------|----------|
| **Java (SpringBoot)** | `ice-spring-boot-starter-3x` / `ice-spring-boot-starter-2x` | SpringBoot 项目（推荐） |
| **Java (Core)** | `ice-core` | 非 SpringBoot Java 项目 |
| **Go** | `github.com/zjn-zjn/ice/sdks/go` | Go 项目 |
| **Python** | `ice-rules` | Python 项目 |

::: tip 其他语言 SDK
- Go 用户请查看 [Go SDK 集成指南](/guide/go-sdk.html)
- Python 用户请查看 [Python SDK 集成指南](/guide/python-sdk.html)
:::

## SpringBoot 项目集成

### 1. 添加依赖

根据您的 SpringBoot 版本选择对应的 Starter：

<CodeGroup>
  <CodeGroupItem title="SpringBoot 3.x" active>

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>2.1.0</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="SpringBoot 2.x">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>2.1.0</version>
</dependency>
```

  </CodeGroupItem>
</CodeGroup>

### 2. 配置 application.yml

```yaml
ice:
  # 应用 ID（必填）- 与 Server 配置的 App 对应
  app: 1
  
  # 共享存储路径（必填）- 需与 Server 共享同一目录
  storage:
    path: ./ice-data
  
  # 叶子节点扫描包路径
  # 多个包用逗号分隔，不配置则扫描全部（较慢）
  scan: com.your.package
  
  # 版本轮询间隔（秒），默认 5 秒
  poll-interval: 5
  
  # 心跳更新间隔（秒），默认 10 秒
  heartbeat-interval: 10
  
  # 线程池配置（用于并发关系节点）
  pool:
    parallelism: -1  # 默认 -1，≤0 使用 ForkJoinPool 默认配置
  
  # 泳道名称（可选）
  # 不同泳道的客户端节点信息互相隔离，Server 后台可按泳道查看
  # 不配置或留空表示主干
  # lane: feature-xxx
```

### 3. 开发叶子节点

在配置的 `scan` 包路径下创建叶子节点类：

```java
package com.your.package;

import com.ice.core.leaf.roam.BaseLeafRoamResult;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    // 可在 Server 配置的字段
    private String uidKey;
    private double amount;

    @Override
    protected boolean doRoamResult(IceRoam roam) {
        Integer uid = roam.getMulti(uidKey);
        if (uid == null || amount <= 0) {
            return false;
        }
        // 业务逻辑
        return sendService.sendAmount(uid, amount);
    }
}
```

### 4. 执行规则

```java
@Service
public class YourService {

    public void processRule(Long userId) {
        IcePack pack = new IcePack();
        pack.setIceId(1L);  // 规则 ID
        
        IceRoam roam = new IceRoam();
        roam.put("uid", userId);
        pack.setRoam(roam);
        
        // 同步执行
        Ice.syncProcess(pack);
        
        // 获取执行结果
        Object result = roam.get("RESULT_KEY");
    }
}
```

## 非 SpringBoot 项目集成

### 1. 添加依赖

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>2.1.0</version>
</dependency>
```

### 2. 初始化 Client

```java
import com.ice.core.client.IceFileClient;
import java.util.Set;

public class IceClientInit {

    private static IceFileClient iceFileClient;

    public static void init() {
        // 方式一：简单构造
        iceFileClient = new IceFileClient(
            1,                    // app ID
            "./ice-data",         // 共享存储路径
            "com.your.package"    // 叶子节点扫描包
        );

        // 方式二：完整构造
        iceFileClient = new IceFileClient(
            1,                              // app ID
            "./ice-data",                   // 共享存储路径
            -1,                             // 并行度（≤0 使用默认）
            Set.of("com.your.package"),     // 扫描包集合
            5,                              // 轮询间隔（秒）
            10                              // 心跳间隔（秒）
        );

        // 方式三：带泳道（便捷方式）
        iceFileClient = IceFileClient.newWithLane(
            1, "./ice-data", "com.your.package", "feature-xxx"
        );

        // 启动客户端
        iceFileClient.start();
        
        // 等待启动完成
        iceFileClient.waitStarted();
    }

    public static void destroy() {
        if (iceFileClient != null) {
            iceFileClient.destroy();
        }
    }
}
```

### 3. 配置 Bean 工厂（可选）

如果叶子节点需要依赖注入：

```java
import com.ice.core.utils.IceBeanUtils;

public class IceBeanFactoryInit {

    public static void init() {
        IceBeanUtils.setIceBeanFactory(new IceBeanFactory() {
            @Override
            public <T> T getBean(Class<T> clazz) {
                // 从您的 IoC 容器获取 Bean
                return YourContainer.getBean(clazz);
            }
        });
    }
}
```

### 4. 执行规则

```java
public void processRule(Long userId) {
    IcePack pack = new IcePack();
    pack.setIceId(1L);
    
    IceRoam roam = new IceRoam();
    roam.put("uid", userId);
    pack.setRoam(roam);
    
    Ice.syncProcess(pack);
}
```

## 共享存储配置

::: warning 关键配置
**`ice.storage.path`（或构造函数中的 storagePath）必须与 Server 共享同一目录！**
:::

### 本地开发

```yaml
# Server 和 Client 配置相同的本地路径
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

使用共享存储（NFS、云盘等）：

```yaml
services:
  ice-server:
    volumes:
      - /nfs/ice-data:/app/ice-data

  client-1:
    volumes:
      - /nfs/ice-data:/app/ice-data

  client-2:
    volumes:
      - /nfs/ice-data:/app/ice-data
```

## 配置参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `app` | int | - | 应用 ID，必填 |
| `storage.path` | string | - | 共享存储路径，必填 |
| `scan` | string | 全部 | 叶子节点扫描包，多个用逗号分隔 |
| `poll-interval` | int | 5 | 版本轮询间隔（秒） |
| `heartbeat-interval` | int | 10 | 心跳上报间隔（秒） |
| `pool.parallelism` | int | -1 | 线程池并行度，≤0 使用默认 |
| `lane` | string | 空 | 泳道名称，空表示主干 |

## 下一步

- 📖 [叶子节点开发](/guide/detail.html#节点开发) - 了解 Flow/Result/None 节点
- 🏗️ [架构概览](/guide/architecture.html) - 理解 Server/Client 架构
- 🐹 [Go SDK 指南](/guide/go-sdk.html) - Go 语言集成指南
- ❓ [常见问题](/guide/qa.html) - 解决集成问题

