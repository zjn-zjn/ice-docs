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

## v3.0.2 → v4.0.0 Pack 移除 + API 统一 + Mock 执行 🚀

这是一次重大升级，涉及 **5 项破坏性变更**，所有叶子节点代码都需要修改。建议预留充分时间，按照下面的步骤逐项完成迁移。

### 变更概览

| 变更项 | 影响范围 | 操作 |
|--------|---------|------|
| Pack/Context 移除 | 所有使用 Pack 的叶子节点 | 迁移为 Roam |
| 叶子基类简化（9→3） | 所有叶子节点 | 全局替换基类和方法名 |
| Roam API 重命名 | 使用 getMulti/putMulti/getUnion 的代码 | 全局替换方法名 |
| priority 字段移除 | 使用了 priority 的配置 | 删除相关逻辑 |
| `_ice` 保留键 | 业务数据中使用了 `_ice` key | 重命名 |

### 升级步骤

#### ⚠️ 破坏性变更 1：Pack/Context 彻底移除

`IcePack`（Java）、`Pack`（Go/Python）和 `IceContext` 已被移除。所有叶子节点方法现在只接收 `Roam`。如果你此前使用了 `BaseLeafPackFlow` 等 Pack 系列基类，需要将数据访问从 Pack 迁移到 Roam。

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
// ❌ 旧代码（3.x）— Pack 基类
public class ScoreFlow extends BaseLeafPackFlow {
    @Override
    protected boolean doPackFlow(IcePack pack) {
        IceRoam roam = pack.getRoam();
        return (double) roam.get("score") >= threshold;
    }
}

// ❌ 旧代码（3.x）— Roam 基类
public class ScoreFlow extends BaseLeafRoamFlow {
    @Override
    protected boolean doRoamFlow(IceRoam roam) {
        return (double) roam.get("score") >= threshold;
    }
}

// ✅ 新代码（4.0.0）
public class ScoreFlow extends BaseLeafFlow {
    @Override
    protected boolean doFlow(IceRoam roam) {
        return (double) roam.get("score") >= threshold;
    }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
// ❌ 旧代码（3.x）
func (s *ScoreFlow) DoRoamFlow(ctx context.Context, roam *icecontext.Roam) bool {
    value := roam.Value(s.Key).Float64Or(0)
    return value >= s.Score
}

// ✅ 新代码（4.0.0）
func (s *ScoreFlow) DoFlow(ctx context.Context, roam *icecontext.Roam) bool {
    value := roam.Value(s.Key).Float64Or(0)
    return value >= s.Score
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
# ❌ 旧代码（3.x）
def do_roam_flow(self, roam):
    value = roam.get(self.key, 0.0)
    return value >= self.score

# ✅ 新代码（4.0.0）
def do_flow(self, roam):
    value = roam.get(self.key, 0.0)
    return value >= self.score
```

  </CodeGroupItem>
</CodeGroup>

#### ⚠️ 破坏性变更 2：叶子节点基类和方法全局替换

所有叶子节点的基类和方法名都需要替换。以下是完整的替换列表，建议使用 IDE 的全局替换功能：

**基类替换：**

| 语言 | 搜索 | 替换为 |
|------|------|--------|
| Java | `BaseLeafRoamFlow` | `BaseLeafFlow` |
| Java | `BaseLeafPackFlow` | `BaseLeafFlow` |
| Java | `BaseLeafRoamResult` | `BaseLeafResult` |
| Java | `BaseLeafPackResult` | `BaseLeafResult` |
| Java | `BaseLeafRoamNone` | `BaseLeafNone` |
| Java | `BaseLeafPackNone` | `BaseLeafNone` |

**方法替换：**

| 语言 | 搜索 | 替换为 |
|------|------|--------|
| Java | `doRoamFlow` | `doFlow` |
| Java | `doPackFlow` | `doFlow` |
| Java | `doRoamResult` | `doResult` |
| Java | `doPackResult` | `doResult` |
| Java | `doRoamNone` | `doNone` |
| Java | `doPackNone` | `doNone` |
| Go | `DoRoamFlow` | `DoFlow` |
| Go | `DoPackFlow` | `DoFlow` |
| Go | `DoRoamResult` | `DoResult` |
| Go | `DoPackResult` | `DoResult` |
| Go | `DoRoamNone` | `DoNone` |
| Go | `DoPackNone` | `DoNone` |
| Python | `do_roam_flow` | `do_flow` |
| Python | `do_pack_flow` | `do_flow` |
| Python | `do_roam_result` | `do_result` |
| Python | `do_pack_result` | `do_result` |
| Python | `do_roam_none` | `do_none` |
| Python | `do_pack_none` | `do_none` |

#### ⚠️ 破坏性变更 3：Roam API 方法全局替换

| 语言 | 搜索 | 替换为 |
|------|------|--------|
| Java | `getMulti(` | `getDeep(` |
| Java | `putMulti(` | `putDeep(` |
| Java | `getUnion(` | `resolve(` |
| Go | `GetMulti(` | `GetDeep(` |
| Go | `PutMulti(` | `PutDeep(` |
| Go | `GetUnion(` | `Resolve(` |
| Go | `ValueMulti(` | `ValueDeep(` |
| Python | `get_multi(` | `get_deep(` |
| Python | `put_multi(` | `put_deep(` |
| Python | `get_union(` | `resolve(` |

#### ⚠️ 破坏性变更 4：priority 字段已移除

如果你的代码或配置数据中使用了 `priority` 字段，请移除相关逻辑。节点执行顺序由树结构决定。

#### ⚠️ 破坏性变更 5：`_ice` 为 Roam 保留键

`_ice` 键用于存储执行元数据（IceMeta），不可用于业务数据。如果你的 Roam 中使用了 `_ice` 作为业务 key，请重命名为其他名称。

#### 默认值变更

以下默认值已调整，如果你的环境依赖旧默认值，升级后可能需要手动设置：

| 配置项 | 旧默认值 | 新默认值 |
|--------|---------|---------|
| 轮询间隔（poll-interval） | 5s | 2s |
| 心跳间隔（heartbeat-interval） | 30s | 10s |
| 客户端超时（client-timeout） | 60s | 30s |

#### 新特性（无需迁移）

- **Mock 执行**：Web UI 新增 Mock 按钮，支持远程调试。Client SDK 内置轮询，无需额外配置
- **Roam Key 扫描**：自动提取叶子节点的 roam key 元数据，为 Mock 表单生成字段
- **IceMeta**：执行元数据存储在 `_ice` 保留键下
- **客户端文件拆分**：`m_{addr}.json`（元数据）+ `b_{addr}.json`（心跳）
- **列表下标遍历**：`getDeep("items.0.name")` 支持列表元素访问

### 版本升级

**Java SDK**

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>4.0.0</version>
</dependency>
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.2.0
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

**Server**

```bash
docker pull waitmoon/ice-server:4.0.0
```

或从 [https://waitmoon.com/downloads/4.0.0/](https://waitmoon.com/downloads/4.0.0/) 下载对应平台包。

---

## v3.0.1 → v3.0.2 Client 优化 🔧

### 变更内容

- **Client Address 精简**：地址格式从 `IP/app/xxxxxxxxxxx` 缩短为 `IP_xxxxx`，更简洁易读
- **IP 获取统一**：Java/Python/Go SDK 统一使用网卡遍历获取非回环 IPv4
- **移除 Spring Boot Starter**：移除 `ice-spring-boot-starter-2x` 和 `ice-spring-boot-starter-3x`，所有 Java 项目统一使用 `ice-core`

### 升级步骤

Server 无需更新，仅需升级 Client SDK。

**Java SDK**

将依赖从 `ice-spring-boot-starter-2x` / `ice-spring-boot-starter-3x` 替换为 `ice-core`：

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>3.0.2</version>
</dependency>
```

删除 `application.yml` 中的 `ice.*` 配置，改为代码方式初始化 Client：

```java
IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");
client.start();
```

如果是 Spring 项目，需要设置 `IceBeanUtils` 以支持叶子节点注入 Spring Bean：

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

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.1.1
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

---

## v3.0.0 → v3.0.1 Server 优化 🔧

### 变更内容

- **Server 代码重构**：重构 Server 端代码结构，提升可维护性
- **文件夹操作**：支持文件夹操作能力
- **脏检查**：新增脏检查机制
- **UI 优化**：多项界面交互优化

### 升级步骤

**Docker 用户（无需任何改动）**

```bash
docker pull waitmoon/ice-server:3.0.1
```

**手动部署用户**

从 [https://waitmoon.com/downloads/3.0.1/](https://waitmoon.com/downloads/3.0.1/) 下载对应平台包

**Java SDK**

```xml
<version>3.0.1</version>
```

---

## v2.1.x → v3.0.0 Server Go 重写 🚀

### 变更内容

- **Server 从 Java 重写为 Go**：单二进制部署，无需 JDK
- **多平台预编译包**：Linux/macOS/Windows (amd64/arm64)
- **SDK 版本号升级**：功能不变，仅版本号统一升级至 3.0.0
- **数据完全兼容**：文件存储格式不变，无需迁移

### 升级步骤

**Docker 用户（无需任何改动）**

```bash
docker pull waitmoon/ice-server:3.0.0
```

**手动部署用户**

从 [https://waitmoon.com/downloads/3.0.0/](https://waitmoon.com/downloads/3.0.0/) 下载对应平台包：

```bash
# Linux amd64
tar -xzvf ice-server-3.0.0-linux-amd64.tar.gz
cd ice-server
sh ice.sh start

# macOS arm64 (Apple Silicon)
tar -xzvf ice-server-3.0.0-darwin-arm64.tar.gz
cd ice-server
sh ice.sh start
```

**Java SDK**

```xml
<version>3.0.0</version>
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.1.0
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

---

## v2.1.2 → v2.1.3

### 变更内容

- **前置节点展示优化**：前置节点使用紫色 + ◀ 箭头前缀，与编辑中节点（橙色虚线边框）明确区分
- **配色方案统一**：前置节点紫色、编辑中节点橙色虚线、未注册节点灰色

### 升级步骤

替换 ice-server jar 或 Docker 镜像即可，客户端 SDK 无需变更。

```bash
docker pull waitmoon/ice-server:2.1.3
```

手动部署可下载：`https://waitmoon.com/downloads/ice-server-2.1.3.tar.gz`

---

## v2.1.0 → v2.1.2

### 变更内容

- **优化 node-meta 接口响应数据**：移除 `ClientInfo` 中冗余的 `classes` 字段，减少切换泳道/地址时的网络传输和服务端开销

### 升级步骤

替换 ice-server jar 或 Docker 镜像即可，客户端 SDK 无需变更。

```bash
docker pull waitmoon/ice-server:2.1.2
```

手动部署可下载：`https://waitmoon.com/downloads/ice-server-2.1.2.tar.gz`

---

## v2.0.8 → v2.1.0

### 变更内容

- **Server UI / 编辑体验增强**：节点编辑页变更检测更准确（A→B→A 不再误判为有变更），并支持按主干/泳道/客户端地址展示“未注册节点”提示样式
- **节点元信息增强**：新增 `node-meta` 接口，提供泳道/客户端发现与叶子节点类元数据（字段定义等）
- **批量导出与基础能力补全**：支持批量导出与 Base 创建等能力

### 升级步骤

优先升级 Server，再升级 Client SDK（如有需要）。

```bash
docker pull waitmoon/ice-server:2.1.0
```

手动部署可下载：`https://waitmoon.com/downloads/ice-server-2.1.0.tar.gz`

---

## v2.0.7 → v2.0.8

### 变更内容

- **修复泳道 `_latest.json` 被误删**：清理任务不再无条件删除泳道下的 `_latest.json`，只在泳道无客户端文件时才清理

### 升级步骤

替换 ice-server jar 或 Docker 镜像即可，客户端 SDK 无需变更。

```bash
docker pull waitmoon/ice-server:2.0.8
```

---

## v2.0.1 → v2.0.6

### 变更内容

- **新增泳道（Swimlane）支持**：客户端可按泳道注册，不同泳道的节点信息互相隔离
- **Server UI**：配置页面顶部新增泳道选择器
- **节点搜索修复**：修复前端叶子节点选择下拉框搜索不生效的问题

### 升级步骤

**Java SDK**

更新版本号：

```xml
<version>2.0.6</version>
```

如需使用泳道功能，在 `application.yml` 中添加：

```yaml
ice:
  lane: feature-xxx  # 泳道名称，不配置则为主干
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.0.6
```

泳道配置：

```go
client, err := ice.NewClientWithOptions(
    1, "./ice-data", -1,
    5*time.Second, 10*time.Second,
    "feature-xxx",  // 泳道名称，空字符串表示主干
)
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

泳道配置：

```python
client = ice.FileClient(app=1, storage_path="./ice-data", lane="feature-xxx")
```

**Ice Server**

下载最新版本 [ice-server-2.0.6.tar.gz](https://waitmoon.com/downloads/ice-server-2.0.6.tar.gz)，替换 jar 后重启即可。

---

## v2.0.0 → v2.0.1

### 变更内容

- **仓库路径变更**：GitHub 仓库路径统一为 `github.com/zjn-zjn/ice`
- **Go SDK**：模块路径更新为 `github.com/zjn-zjn/ice/sdks/go`，版本号 v1.0.3
- **代码规范**：Java SDK 注释统一为英文

### 升级步骤

**Java SDK**

无代码变更，直接更新版本号即可：

```xml
<version>2.0.1</version>
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.0.3
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

---

## v1.5.0 → v2.0.0 重大架构升级 🚀

Ice 规则引擎 2.0.0 是一次**架构革新**，移除了 MySQL 和 ZooKeeper 依赖，改用文件系统存储，并原生支持 Docker 部署。

### ⚠️ 重要变更

| 变更项 | 1.x 版本 | 2.0.0 版本 |
|--------|----------|------------|
| 存储方式 | MySQL 数据库 | 文件系统（JSON） |
| 通信方式 | NIO 长连接 | 文件轮询 |
| 高可用 | ZooKeeper | 共享存储（NFS/云盘） |
| 部署方式 | 手动部署 | Docker 一键部署 |

### 服务端升级（Ice Server）

**1. 数据迁移**

从 MySQL 导出配置数据到 JSON 文件格式（后续版本将提供迁移工具）。

**2. 配置变更**

```yaml
# 旧配置（1.x）
server:
  port: 8121
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ice
    username: root
    password: password
ice:
  port: 18121  # NIO端口
  ha:
    address: localhost:2181  # ZK地址

# 新配置（2.0.0）
server:
  port: 8121
ice:
  storage:
    path: ./ice-data  # 文件存储路径
  client-timeout: 60  # 客户端超时(秒)
  version-retention: 1000  # 版本文件保留数量
```

**3. 依赖变更**

可移除以下依赖：
- MySQL 驱动
- MyBatis 相关依赖
- ZooKeeper/Curator 依赖
- Netty 依赖

**4. 推荐使用 Docker 部署**

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.1
```

### 客户端升级（Ice Client）

**1. 依赖更新**

```xml
<!-- SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>2.0.1</version>
</dependency>

<!-- SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>2.0.1</version>
</dependency>

<!-- 非SpringBoot -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>2.0.1</version>
</dependency>
```

**2. 配置变更**

```yaml
# 旧配置（1.x）
ice:
  app: 1
  server: 127.0.0.1:18121  # NIO服务器地址
  # server: zookeeper:localhost:2181  # ZK高可用
  scan: com.ice.test

# 新配置（2.0.0）
ice:
  app: 1
  storage:
    path: ./ice-data  # 与Server共享的存储路径
  scan: com.ice.test
  poll-interval: 5  # 版本轮询间隔(秒)
  heartbeat-interval: 10  # 心跳间隔(秒)
```

**3. 代码变更（非SpringBoot项目）**

```java
// 旧代码（1.x）
IceNioClient client = new IceNioClient(1, "127.0.0.1:18121", "com.ice.test");
client.start();

// 新代码（2.0.0）
IceFileClient client = new IceFileClient(1, "./ice-data", "com.ice.test");
client.start();
```

**4. 重要：存储路径共享**

Client 需要与 Server **共享同一个存储目录**：
- 本地开发：使用相同的本地路径
- Docker 环境：通过卷挂载共享
- 分布式环境：使用 NFS 或云盘

---

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

## v1.0.1-v1.0.3/v1.0.3

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