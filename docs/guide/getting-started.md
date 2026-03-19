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

## 第一步：部署 Ice Server

### Docker 部署（推荐）

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

启动后访问 **http://localhost:8121** 进入管理界面。

在线体验：[http://eg.waitmoon.com](http://eg.waitmoon.com)

### 手动部署

从 [https://waitmoon.com/downloads/3.0.1/](https://waitmoon.com/downloads/3.0.1/) 下载对应平台包，解压后运行：

```bash
tar -xzvf ice-server-linux-amd64.tar.gz && cd ice-server-linux-amd64
sh ice.sh start
```

## 第二步：集成 Ice Client SDK

### Java

**添加依赖**

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>3.0.2</version>
</dependency>
```

**启动 Client**

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID（对应 Server 中创建的应用）
    "./ice-data",         // 共享存储路径（必须和 Server 指向同一目录）
    "com.your.package"    // 叶子节点所在的包路径
);
client.start();
```

**Spring 项目集成**

如果是 Spring/SpringBoot 项目，加一个配置类即可，作用是让叶子节点能自动注入 Spring Bean：

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

> 更多构造参数（并行度、轮询间隔、泳道等）参考 [Client SDK 集成指南](/guide/client-integration.html)

### Go

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

详细用法见 [Go SDK 指南](/guide/go-sdk.html)

### Python

```bash
pip install ice-rules
```

详细用法见 [Python SDK 指南](/guide/python-sdk.html)

## 第三步：开发叶子节点（Java 示例）

叶子节点是实际执行业务逻辑的地方。继承对应基类，放在扫描包下即可：

| 类型 | 基类 | 返回值 | 用途 |
|------|------|--------|------|
| **Flow** | `BaseLeafRoamFlow` | true/false | 条件判断 |
| **Result** | `BaseLeafRoamResult` | true/false | 业务执行 |
| **None** | `BaseLeafRoamNone` | 无 | 辅助操作（日志、查询等） |

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    private String key;      // 可在 Server 界面配置
    private double value;    // 可在 Server 界面配置

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

> 类中的字段（如 `key`、`value`）会自动出现在 Server 配置界面，运维可以直接修改，无需改代码。

## 第四步：配置并执行规则

### 在 Server 配置

访问 http://localhost:8121：

1. 创建应用（App）
2. 新建规则（Ice）
3. 将叶子节点拖入规则树，配置参数
4. 点击 **发布**

### 在代码中触发

```java
IcePack pack = new IcePack();
pack.setIceId(1L);

IceRoam roam = new IceRoam();
roam.put("uid", 12345);
pack.setRoam(roam);

Ice.syncProcess(pack);
```

## 共享存储说明

Server 和 Client 必须能访问同一个 `ice-data` 目录：

| 场景 | 方案 |
|------|------|
| 本地开发 | 同一个本地路径 |
| Docker | 通过 `-v` 挂载到相同宿主机目录 |
| 分布式 | NFS / 阿里云 NAS / AWS EFS |

## 下一步

- 📖 [Client SDK 集成指南](/guide/client-integration.html) - 完整构造参数说明
- 📖 [详细说明](/guide/detail.html) - 深入了解节点类型和配置
- 🐹 [Go SDK 指南](/guide/go-sdk.html) · 🐍 [Python SDK 指南](/guide/python-sdk.html)
- 🏗️ [架构设计](/advanced/architecture.html) · 🎥 [视频教程](https://www.bilibili.com/video/BV1Q34y1R7KF)

## 常见问题

**Client 无法加载配置？** 检查 storagePath 是否和 Server 指向同一目录。

**规则修改后不生效？** 确保在 Server 点击了「发布」。

👉 [更多问题](/guide/qa.html)
