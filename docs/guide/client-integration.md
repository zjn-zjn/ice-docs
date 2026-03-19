---
title: Ice Client SDK 集成指南
description: 详细介绍如何在业务应用中集成 Ice Client SDK，包括 Java、Go、Python 多语言接入方式。
keywords: Client SDK,集成指南,ice-core,Java集成,Go SDK,Python SDK
head:
  - - meta
    - property: og:title
      content: Ice Client SDK 集成指南
  - - meta
    - property: og:description
      content: 详细介绍如何在业务应用中集成 Ice Client SDK。
---

# Ice Client SDK 集成指南

> Ice Client 的完整集成参考，包含所有构造参数和 Spring 集成方式

::: tip 快速接入
如果你只想尽快跑起来，先看 [快速上手指南](/guide/getting-started.html)，本页是详细参考。
:::

## 依赖

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>3.0.2</version>
</dependency>
```

其他语言：[Go SDK 指南](/guide/go-sdk.html) · [Python SDK 指南](/guide/python-sdk.html)

## 初始化 Client

最简方式，三个必填参数：

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID
    "./ice-data",         // 共享存储路径
    "com.your.package"    // 叶子节点扫描包
);
client.start();
client.waitStarted();
```

如需自定义更多参数：

```java
IceFileClient client = new IceFileClient(
    1,                              // app ID
    "./ice-data",                   // 共享存储路径
    -1,                             // 并行度（≤0 使用默认 ForkJoinPool）
    Set.of("com.your.package"),     // 扫描包集合
    5,                              // 版本轮询间隔（秒）
    10                              // 心跳上报间隔（秒）
);
```

带泳道的便捷构造：

```java
IceFileClient client = IceFileClient.newWithLane(
    1, "./ice-data", "com.your.package", "feature-xxx"
);
```

### 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `app` | int | 是 | - | 应用 ID，对应 Server 中创建的 App |
| `storagePath` | String | 是 | - | 共享存储路径，必须和 Server 同一目录 |
| `scan` | String | 是 | - | 叶子节点扫描包，多个用逗号分隔 |
| `parallelism` | int | 否 | -1 | 线程池并行度，≤0 使用默认 |
| `pollInterval` | int | 否 | 5 | 版本轮询间隔（秒） |
| `heartbeatInterval` | int | 否 | 10 | 心跳上报间隔（秒） |
| `lane` | String | 否 | 空 | 泳道名称，空表示主干 |

## Spring 项目集成（可选）

如果叶子节点中需要通过 `@Autowired` 注入 Spring Bean，需要在启动时将 Spring 容器桥接给 Ice：

```java
@Configuration
public class IceConfig implements ApplicationContextAware {

    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        AutowireCapableBeanFactory bf = ctx.getAutowireCapableBeanFactory();
        IceBeanUtils.setFactory(new IceBeanUtils.IceBeanFactory() {
            @Override
            public void autowireBean(Object bean) { bf.autowireBean(bean); }
            @Override
            public boolean containsBean(String name) { return ctx.containsBean(name); }
            @Override
            public Object getBean(String name) { return ctx.getBean(name); }
        });
    }

    @Bean(destroyMethod = "destroy")
    public IceFileClient iceFileClient() throws Exception {
        IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");
        client.start();
        return client;
    }
}
```

不用 Spring 的项目不需要这一步，直接 `new IceFileClient(...)` 即可。

## 共享存储

Server 和 Client 必须能访问同一个 `ice-data` 目录。

| 场景 | 方案 |
|------|------|
| 本地开发 | Server 和 Client 配置相同的本地路径 |
| Docker 部署 | 通过 `-v` 将宿主机同一目录挂载到各容器 |
| 分布式部署 | NFS / 阿里云 NAS / AWS EFS 等共享存储 |

## 执行规则

```java
IcePack pack = new IcePack();
pack.setIceId(1L);

IceRoam roam = new IceRoam();
roam.put("uid", userId);
pack.setRoam(roam);

Ice.syncProcess(pack);

Object result = roam.get("RESULT_KEY");
```

## 下一步

- 📖 [叶子节点开发](/guide/detail.html#节点开发) - 了解 Flow/Result/None 节点
- 🏗️ [架构概览](/guide/architecture.html) - 理解 Server/Client 架构
- ❓ [常见问题](/guide/qa.html) - 解决集成问题
