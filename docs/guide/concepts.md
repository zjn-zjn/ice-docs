---
title: 核心概念
description: 深入理解 Ice 规则引擎的核心设计：树形编排解耦、5 种关系节点、3 种叶子节点、Roam 数据模型。通过充值活动示例掌握 Ice 的编排思想。
keywords: 规则引擎概念,树形编排,关系节点,叶子节点,IceRoam,业务解耦,Ice设计思想
---

# 核心概念

> Ice 的核心思想：用树形结构编排业务规则，每个节点只关心自身逻辑，通过数据包裹（Roam）流转信息，实现真正的业务解耦。

## 为什么是树形结构

在实际业务中，规则引擎面临的最大挑战不是"能不能跑起来"，而是"规则变了怎么办"。

传统方案的痛点：
- **流程图式**（Activiti / Flowable）：修改一个节点需要重新连线，牵一发动全身
- **When-Then 式**（Drools）：规则之间隐式依赖，改一条可能影响其他规则
- **硬编码**：灵活但维护成本高，改规则就要改代码上线

Ice 的方案：**将业务规则组织为树形结构，每个节点独立负责单一逻辑**。节点之间不直接引用，而是通过数据包裹（Roam）传递信息。修改任何节点只影响该节点本身，不需要关心上下游。

### 示例：充值活动

X 公司的元旦充值活动：

- 充值 100 元送 5 元余额（1.01 - 1.07）
- 充值 50 元送 10 积分（1.05 - 1.07）
- 不叠加赠送

拆解出的业务模块：

![](/images/introduction/2-dark.png#dark)
![](/images/introduction/2-light.png#light)

用户充值后，产生一个数据容器 Roam，包含 uid、cost 等业务数据和执行元数据。各模块从 Roam 中读取数据、处理逻辑、写回结果。

### 流程图式的问题

![](/images/introduction/4-dark.png#dark)
![](/images/introduction/4-light.png#light)

看起来简洁，但一旦业务变动——去掉不叠加限制、加库存控制、调整时间——就需要重新调整连线和判断顺序，改动一处需要瞻前顾后。

### Ice 的树形编排

![](/images/introduction/7-dark.png#dark)
![](/images/introduction/7-light.png#light)

使用树形结构组织规则。执行从 root 开始，按子节点顺序遍历。关系节点控制流转逻辑，叶子节点执行具体业务。

当规则变动时：
- **改金额阈值**：直接修改对应叶子节点的配置
- **去掉不叠加**：将 root 的 ANY 改为 ALL（叠加送的逻辑只在这个节点上）
- **加库存控制**：无需改动——发放失败返回 false，流程自动继续向下执行

**这就是树形编排的核心优势：每个节点只负责自身逻辑，变更不扩散。**

## 关系节点

关系节点（Relation）用于控制子节点的执行流转，共 5 种，每种都有串行和并行两个版本。

### 串行关系节点

| 类型 | 执行方式 | 返回逻辑 | 类比 |
|------|---------|---------|------|
| **AND** | 顺序执行，遇 false 停止 | 全 true 返回 true，有 false 返回 false | Java `&&` |
| **ANY** | 顺序执行，遇 true 停止 | 有 true 返回 true，全 false 返回 false | Java `\|\|` |
| **ALL** | 全部执行，不短路 | 有 true 且无 false 返回 true，有 false 返回 false |  |
| **NONE** | 全部执行 | 始终返回 none | |
| **TRUE** | 全部执行 | 始终返回 true（无子节点也返回 true） | |

::: tip 关键区别
AND/ANY 是**短路执行**，确定结果后立即停止。ALL/NONE/TRUE 会**执行所有子节点**。选择哪种关系节点取决于你是否需要所有子节点都被执行。
:::

### 并行关系节点

每种串行关系节点都有对应的并行版本（ParallelAnd、ParallelAny 等），将子节点提交到线程池/协程池并发执行。

- ParallelAnd / ParallelAny：支持**提前终止**，一旦确定结果立即返回
- ParallelAll / ParallelNone / ParallelTrue：等待所有子节点执行完成

适用于子节点之间没有数据依赖、且涉及 I/O 操作的场景。

## 叶子节点

叶子节点（Leaf）是真正执行业务逻辑的地方，分三种类型：

| 类型 | 返回值 | 用途 | 示例 |
|------|-------|------|------|
| **Flow** | true / false | 条件判断，控制流程走向 | 金额校验、等级判断、时间过滤 |
| **Result** | true / false | 执行业务操作，返回执行结果 | 发放优惠券、扣减库存、发送通知 |
| **None** | 无（none） | 辅助操作，不影响流程 | 查询用户信息、记录日志、数据装配 |

### 开发叶子节点

继承对应基类，实现业务方法即可。字段自动映射为 Server 配置项：

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafResult {

    private String key;      // 配置项：用户 ID 的 key
    private double value;    // 配置项：发放金额

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

每种类型对应一个基类，入参为 `IceRoam`：

| 基类 | 方法 | 返回值 |
|------|------|--------|
| `BaseLeafFlow` | `doFlow(IceRoam roam)` | boolean |
| `BaseLeafResult` | `doResult(IceRoam roam)` | boolean |
| `BaseLeafNone` | `doNone(IceRoam roam)` | void |

## 数据模型

### Roam（数据容器）

Roam 是规则执行的唯一数据载体，既承载业务数据，也通过独立的 `Meta` 结构体/对象存储执行元数据。

**Meta 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | long | 触发的规则 ID |
| `scene` | String | 触发的场景名，所有订阅该场景的规则都会执行 |
| `nid` | long | 以指定节点为 root 执行 |
| `ts` | long | 请求时间戳（影响节点时间窗口判断） |
| `trace` | String | 链路追踪 ID，自动生成 |
| `type` | int | 请求类型 |
| `debug` | byte | 调试日志级别（位掩码） |
| `process` | StringBuilder | 执行流程记录 |

触发优先级：`id` > `scene` > `nid`。

Roam 同时是节点间传递数据的核心容器，基于 ConcurrentHashMap（线程安全），支持多级 key 和引用语法：

```java
// 基础读写
roam.put("uid", 12345);
roam.getValue("uid");           // 12345

// 多级 key（自动构建嵌套结构）
roam.putDeep("user.level", 5); // {"user": {"level": 5}}
roam.getDeep("user.level");    // 5

// 引用语法（"@" 前缀从 roam 中取值）
roam.resolve("@uid");          // 12345（从 roam 获取 uid 的值）
roam.resolve("hello");         // "hello"（非 @ 前缀返回原值）
```

## 前置节点

前置节点（Forward）是一种简化配置的机制。当一个关系节点和一个条件节点总是成对出现时（AND 绑定），可以将条件节点设为目标节点的前置节点：

![](/images/introduction/10-dark.png#dark)
![](/images/introduction/10-light.png#light)

语义等价于 AND 连接，但减少了树的层级，配置更清晰。前置节点返回 false 时，主节点不会执行。

## 节点通用能力

每个节点（无论关系节点还是叶子节点）都具备以下配置：

| 配置 | 说明 |
|------|------|
| **时间窗口** | 设置节点的生效时间范围，不在时间窗口内的节点视为不存在 |
| **反转** | 将节点的 true 结果反转为 false，反之亦然（NONE 不受影响） |
| **错误处理** | 节点报错时的行为：终止流程（默认）或返回指定状态继续执行 |
| **节点复用** | 同一个节点 ID 可以出现在多棵树中，修改一处全部生效 |

### 时间窗口与测试

时间窗口配置让节点在指定时间段外自动失效。配合 None 类型的时间修改节点，可以轻松测试未来才生效的规则：

![](/images/introduction/8-dark.png#dark)
![](/images/introduction/8-light.png#light)

插入一个 TimeChangeNone 节点修改包裹中的 requestTime，后续节点就会按照修改后的时间执行——无需等到活动真正开始。

## 下一步

- [快速开始](/guide/getting-started.html) — 5 分钟部署并运行第一个规则
- [架构设计](/guide/architecture.html) — 理解 Server + Client + 共享存储的工作原理
- [Java SDK](/sdk/java.html) · [Go SDK](/sdk/go.html) · [Python SDK](/sdk/python.html) — 各语言集成指南
- [节点类型速查](/reference/node-types.html) — 所有关系节点和叶子节点的行为一览

### 视频教程

完整视频教程：[Bilibili](https://www.bilibili.com/video/BV1hg411A7jx)
