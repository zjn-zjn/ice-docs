---
title: 快速开始
description: 快速接入 Ice 规则引擎的完整指南。包含 Server 部署、Client SDK 集成、叶子节点开发和规则执行的全流程。
keywords: 规则引擎接入,快速开始,安装教程,Docker部署,Client SDK,Java,Go,Python
head:
  - - meta
    - property: og:title
      content: Ice 快速开始 - 5 分钟部署并运行第一个规则
  - - meta
    - property: og:description
      content: 快速接入 Ice 规则引擎的完整指南，包含 Server 部署、Client SDK 集成等全流程。
---

# 快速开始

> 5 分钟完成 Ice 规则引擎的部署、集成和第一次规则执行。

## 前置了解

Ice 由三部分组成：

- **Ice Server** — 可视化规则配置管理平台，提供 Web 界面
- **Ice Client** — 规则执行 SDK，集成到你的业务应用中
- **共享存储** — Server 和 Client 通过共享文件目录（`ice-data/`）实现配置同步，无需网络通信

```
Server → 写入配置 → ice-data/ ← 读取配置 ← Client
```

## 第一步：部署 Server

### Docker 部署（推荐）

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

启动后访问 **http://localhost:8121** 进入管理界面。

在线体验：[eg.waitmoon.com](https://eg.waitmoon.com/app/1/base/%E6%B5%8B%E8%AF%95/1)

### 手动部署

从 [waitmoon.com/downloads](https://waitmoon.com/downloads/4.0.0/) 下载对应平台包：

```bash
tar -xzvf ice-server-linux-amd64.tar.gz && cd ice-server-linux-amd64
sh ice.sh start
```

## 第二步：集成 Client SDK

在业务应用中添加依赖并启动 Client。Server 和 Client 必须共享同一个 `ice-data` 目录。

<CodeGroup>
  <CodeGroupItem title="Java" active>

**添加依赖**

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>4.0.0</version>
</dependency>
```

**启动 Client**

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID（对应 Server 中创建的应用）
    "./ice-data",         // 共享存储路径
    "com.your.package"    // 叶子节点所在的包路径
);
client.start();
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

**添加依赖**

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

**启动 Client**

```go
client, err := ice.NewClient(1, "./ice-data")
if err != nil {
    log.Fatal(err)
}
client.Start()
defer client.Destroy()
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

**添加依赖**

```bash
pip install ice-rules
```

**启动 Client**

```python
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()
```

  </CodeGroupItem>
</CodeGroup>

::: tip Spring 项目
Spring/SpringBoot 项目需要额外配置一个桥接类，让叶子节点能注入 Spring Bean。详见 [Java SDK 指南](/sdk/java.html#spring-集成)。
:::

## 第三步：开发叶子节点

叶子节点是执行业务逻辑的地方。继承对应基类，类中的字段会自动出现在 Server 配置界面：

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafResult {

    private String key;      // 可在 Server 界面配置
    private double value;    // 可在 Server 界面配置

    @Override
    protected boolean doResult(IceRoam roam) {
        Integer uid = roam.getDeep(key);
        if (uid == null || value <= 0) {
            return false;
        }
        return sendService.sendAmount(uid, value);
    }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
type AmountResult struct {
    Key   string  `json:"key"`
    Value float64 `json:"value"`
}

func (a *AmountResult) DoResult(ctx context.Context, roam *icecontext.Roam) bool {
    uid := roam.Value(a.Key).IntOr(0)
    if uid <= 0 || a.Value <= 0 {
        return false
    }
    return sendService.SendAmount(ctx, uid, a.Value)
}

func init() {
    ice.RegisterLeaf("com.example.AmountResult", nil, func() any {
        return &AmountResult{}
    })
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
@ice.leaf("com.example.AmountResult")
class AmountResult:
    key: str = ""
    value: float = 0.0

    def do_result(self, roam):
        uid = roam.get(self.key, 0)
        if uid <= 0 or self.value <= 0:
            return False
        return send_service.send_amount(uid, self.value)
```

  </CodeGroupItem>
</CodeGroup>

## 第四步：配置并执行

### 在 Server 中配置规则

1. 创建应用（App）
2. 新建规则（Ice），获得 iceId
3. 添加关系节点和叶子节点，组成规则树
4. 配置叶子节点参数
5. 点击**发布**

### 在代码中执行

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
IceRoam roam = IceRoam.create();
roam.getIceMeta().setId(1L);
roam.put("uid", 12345);
Ice.syncProcess(roam);
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
roam := ice.NewRoamWithMeta()
roam.GetMeta().Id = 1
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

## 共享存储部署方案

| 场景 | 方案 |
|------|------|
| 本地开发 | Server 和 Client 使用同一个本地路径 |
| Docker | 通过 `-v` 挂载到相同宿主机目录 |
| 分布式部署 | NFS / 阿里云 NAS / AWS EFS |

## 常见问题

**Client 无法加载配置？**
检查 `storagePath` 是否和 Server 指向同一个 `ice-data` 目录。

**规则修改后不生效？**
确保在 Server 界面点击了「发布」。Client 默认每 2 秒轮询一次配置变更。

**启动时报节点类找不到？**
检查叶子节点类是否在 Client 配置的扫描包路径下，且类名是否正确。

更多问题参见 [FAQ](/guide/faq.html)。

## 下一步

- [核心概念](/guide/concepts.html) — 理解树形编排的设计思想
- [架构设计](/guide/architecture.html) — Server / Client / 共享存储的工作原理
- [Java SDK](/sdk/java.html) · [Go SDK](/sdk/go.html) · [Python SDK](/sdk/python.html) — 完整 SDK 参考
