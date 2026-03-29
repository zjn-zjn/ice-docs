---
title: Ice 规则引擎更新日志 - 版本历史记录
description: Ice规则引擎的版本更新历史，包括新功能、性能优化、Bug修复等详细变更记录。了解Ice规则引擎的每个版本改进。
keywords: 更新日志,版本历史,CHANGELOG,Ice版本,规则引擎更新,新功能
---

# Ice 规则引擎更新日志

> 记录 Ice 规则引擎每个版本的功能更新、性能优化和问题修复

## [4.0.10](https://github.com/zjn-zjn/ice/compare/v4.0.9...v4.0.10) (2026-03)

**变更对比功能**

- Server：新增变更对比 API（`/conf/changes`），支持获取单节点或全量待发布节点的变更数据（active vs update）
- Server：详情 API（`/conf/detail`）新增 `activeOnly` 参数，支持获取纯已发布版本的树，用于双树对比
- Web UI：节点工具栏新增**对比按钮**，点击可查看单节点属性对比（属性表 + JSON 对比双 Tab）
- Web UI：应用/清除确认弹框展示变更节点列表，每个节点支持点击「查看」查看对比详情
- Web UI：新增全屏**双树对比**视图（已发布树 vs 当前编辑树），变更节点高亮，点击可查看对比详情
- Web UI：修复 NONE 关系节点（type=0）无法添加为子节点/前置节点的问题
- Web UI：修复新增叶子节点编辑时显示 JSON 模式而非表单模式的问题
- Web UI：对比视图过滤默认值（inverse=false、timeType=1 等），避免无意义差异

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| ice-server | 4.0.10 |

---

## [4.0.9](https://github.com/zjn-zjn/ice/compare/v4.0.8...v4.0.9) (2026-03)

**Roam Meta 提取**

- SDK：将 Meta 从 Roam 数据 map 中提取为独立结构体
- SDK：修复 Go 和 Python SDK 中日志 caller depth 不正确的问题

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| ice-server | 4.0.9 |

---

## [4.0.8](https://github.com/zjn-zjn/ice/compare/v4.0.7...v4.0.8) (2026-03)

**受控模式 & 发布到远程**

- Server：新增**受控模式**（`--mode controlled` 或 `ICE_MODE=controlled`），禁止通过 UI 新建 Rule 和节点，仅允许导入和引用已有节点，适用于生产环境防误操作
- Server：新增**发布到远程**功能（`--publish-targets` 或 `ICE_PUBLISH_TARGETS`），导出弹窗可直接将数据推送到配置的远程 Server，通过 Server 代理转发避免跨域
- Web UI：「发布」按钮重命名为「应用」，为「发布到远程」腾出语义空间
- Web UI：受控模式下显示「受控模式」标识，隐藏新建相关按钮，节点表单只显示引用输入
- Web UI：前端请求超时从 10 秒调整为 120 秒

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| ice-server | 4.0.8 |

---

## [4.0.7](https://github.com/zjn-zjn/ice/compare/v4.0.6...v4.0.7) (2026-03)

**Bug 修复**

- Server：修复导入数据时未更新 `_base_id.txt` / `_conf_id.txt` 的问题，可能导致后续新建节点 ID 冲突

---

## [4.0.6](https://github.com/zjn-zjn/ice/compare/v4.0.5...v4.0.6) (2026-03)

**日志系统重构**

- Go SDK：移除自定义 Logger 接口，改用标准 `*slog.Logger`，用户通过 `ice.SetLogger(slog.New(myHandler))` 一行接入
- Python SDK：移除自定义 Logger ABC，改用标准 `logging.getLogger("ice")`，用户通过标准 logging 配置即可接入
- Java SDK：去除日志消息中的 trace 前缀重复拼接，仅保留 MDC
- Server：全面替换 `log.Printf` 为 `log/slog` 结构化日志，默认 JSON 格式输出
- 所有组件：TraceId 改为结构化字段，不再拼入消息字符串；统一日志消息风格

---

## [4.0.5](https://github.com/zjn-zjn/ice/compare/v4.0.4...v4.0.5) (2026-03)

**Roam API 简化**

- 移除 `IceMeta` 类，元数据直接存储在 `_ice` key 下（plain Map/dict）
- 移除所有 Roam meta 访问方法的 `Ice` 前缀：
  - `getIceId()` → `getId()` / `GetId()` / `get_id()`
  - `getIceScene()` → `getScene()` / `GetScene()` / `get_scene()`
  - `getIceProcess()` → `getProcess()` / `GetProcess()` / `get_process()`
  - 其他类似方法同理
- Go SDK `NewRoam()` 简化为无参构造
- 三语言 SDK（Java/Go/Python）同步更新

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| ice-server | 4.0.5 |
| ice-core (Java) | 4.0.5 |
| ice SDK (Go) | v1.2.3 |
| ice-rules (Python) | 4.0.5 |

---

## [4.0.4](https://github.com/zjn-zjn/ice/compare/v4.0.3...v4.0.4) (2026-03)

**Web UI 导出功能补全**

- 多选模式新增「导出」按钮，支持批量导出选中的 Rule
- 文件夹右键菜单新增「导出」选项，支持导出整个文件夹下所有 Rule
- 导出的 JSON 数组可直接通过导入功能批量导入

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| ice-server | 4.0.4 |

---

## [4.0.3](https://github.com/zjn-zjn/ice/compare/v4.0.1...v4.0.3) (2026-03)

**Web UI 修复与改进**

- 修复 NONE 类型子节点创建按钮被禁用的问题（JS falsy `0` bug）
- 修复 Mock 结果 selector fallback 未持久化的问题
- Mock 结果的 ts/trace 标签支持一键选中复制
- 面包屑导航 Popover 关闭时正确销毁 DOM

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| ice-server | 4.0.3 |

---

## [4.0.1](https://github.com/zjn-zjn/ice/compare/v4.0.0...v4.0.1) (2026-03)

**Go SDK RoamValue 类型转换增强**

- RoamValue 类型转换使用 `spf13/cast`，支持更多类型（json.Number、uint 系列等）
- 新增 error 变体方法：`StringE()`、`IntE()`、`Int64E()`、`Float64E()`、`BoolE()`

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| Go SDK | v1.2.1 |
| ice-server | 4.0.1 |

---

## [4.0.0](https://github.com/zjn-zjn/ice/compare/v3.0.2...v4.0.0) (2026-03) 🚀

**Ice 规则引擎 4.0.0 — Pack/Context 移除、API 统一、Mock 执行**

4.0.0 是 Ice 的一次重大 API 简化。彻底移除了 Pack 和 Context 层，所有数据通过唯一的 `Roam` 传递；叶子节点基类从 9 个收敛为 3 个；多级 key 方法和引用语法方法全部重命名；新增 Mock 执行，支持从 Web UI 远程调试规则引擎。

### ✨ 新特性

#### 🏗️ Pack/Context 彻底移除，Roam 统一数据层

移除 `IcePack`（Java）/ `Pack`（Go）/ `Pack`（Python）和 `IceContext` 层，所有叶子节点方法只接收 `Roam` 作为数据容器。此前 Pack 和 Roam 的双层结构被简化为单一 Roam。

```java
// 旧代码（3.x）
public class ScoreFlow extends BaseLeafRoamFlow {
    @Override
    protected boolean doRoamFlow(IceRoam roam) {
        return roam.get("score") >= threshold;
    }
}

// 新代码（4.0.0）
public class ScoreFlow extends BaseLeafFlow {
    @Override
    protected boolean doFlow(IceRoam roam) {
        return roam.get("score") >= threshold;
    }
}
```

#### 🔄 叶子节点基类简化（9 → 3）

移除 Roam/Pack 层级的基类变体，每种叶子节点类型统一为单一基类，方法签名同步简化：

**基类重命名：**

| 语言 | 旧名称 | 新名称 |
|------|--------|--------|
| Java | `BaseLeafRoamFlow` / `BaseLeafPackFlow` | `BaseLeafFlow` |
| Java | `BaseLeafRoamResult` / `BaseLeafPackResult` | `BaseLeafResult` |
| Java | `BaseLeafRoamNone` / `BaseLeafPackNone` | `BaseLeafNone` |

**方法重命名：**

| 语言 | 旧方法 | 新方法 |
|------|--------|--------|
| Java | `doRoamFlow` / `doPackFlow` | `doFlow` |
| Java | `doRoamResult` / `doPackResult` | `doResult` |
| Java | `doRoamNone` / `doPackNone` | `doNone` |
| Go | `DoRoamFlow` / `DoPackFlow` | `DoFlow` |
| Go | `DoRoamResult` / `DoPackResult` | `DoResult` |
| Go | `DoRoamNone` / `DoPackNone` | `DoNone` |
| Python | `do_roam_flow` / `do_pack_flow` | `do_flow` |
| Python | `do_roam_result` / `do_pack_result` | `do_result` |
| Python | `do_roam_none` / `do_pack_none` | `do_none` |

#### 📝 Roam API 重命名

多级 key 和引用语法方法重命名，语义更清晰：

| 语言 | 旧名称 | 新名称 | 说明 |
|------|--------|--------|------|
| Java | `getMulti` / `putMulti` | `getDeep` / `putDeep` | 多级 key 读写 |
| Java | `getUnion` | `resolve` | 引用语法解析 |
| Go | `GetMulti` / `PutMulti` | `GetDeep` / `PutDeep` | 多级 key 读写 |
| Go | `GetUnion` | `Resolve` | 引用语法解析 |
| Go | `ValueMulti` | `ValueDeep` | 多级 key fluent API |
| Python | `get_multi` / `put_multi` | `get_deep` / `put_deep` | 多级 key 读写 |
| Python | `get_union` | `resolve` | 引用语法解析 |

#### 🎯 Mock 执行

新增 Mock 执行功能，支持从 Server Web UI 发起 mock 请求，由指定 Client 实际执行规则并返回完整结果。

- **文件系统通信**：与现有 config 同步机制一致，通过共享存储目录通信，无需额外网络连接
- **三端支持**：Java、Go、Python Client SDK 均内置 mock 轮询，无需额外配置
- **Web UI**：detail 页面新增 Mock 按钮，支持表单/JSON 两种模式输入 Roam 参数
- **执行结果可视化**：返回 process 执行流程、roam 结果数据，执行过的节点在树图中用黄色标记
- **目标选择**：支持指定 client 地址（`address:xxx`）、泳道（`lane:xxx`）或自动选择（`all`）

#### 🔍 Roam Key 静态扫描

多语言静态分析工具，自动提取叶子节点方法中的 roam key 访问元数据，为 Mock 表单自动生成字段：

- **Java**：ASM 字节码分析，编译后自动可用
- **Go**：`go/ast` 分析，通过 `ice-scan` CLI 工具生成代码
- **Python**：`ast` 模块分析，运行时自动扫描

#### 📊 IceMeta 执行元数据

执行元数据存储在 Roam 的 `_ice` 保留键下（`_ice` 不可用于业务数据），包含：

| 字段 | 说明 |
|------|------|
| `id` | 规则 ID |
| `scene` | 场景标识 |
| `nid` | 配置 ID |
| `ts` | 时间戳 |
| `trace` | 追踪标识 |
| `type` | 请求类型 |
| `debug` | 调试标记 |
| `process` | 执行流程记录 |

#### 📂 客户端文件格式拆分

单个客户端 JSON 文件拆分为两个独立文件，减少高频心跳对元数据文件的 I/O 竞争：

| 文件 | 内容 | 写入频率 |
|------|------|---------|
| `m_{addr}.json` | 元数据（注册类信息、roam key 扫描结果） | 启动时 + 变更时 |
| `b_{addr}.json` | 心跳（时间戳） | 每 10 秒 |

#### 🔢 getDeep/putDeep 支持列表下标遍历

如 `getDeep("items.0.name")`，支持通过数字下标访问列表元素（只读遍历，putDeep 不会创建列表）。

### 🔧 优化

- **轮询间隔默认值调整**：从 5s 改为 2s，配置变更响应更快
- **心跳间隔默认值调整**：从 30s 改为 10s，客户端状态感知更及时
- **客户端超时默认值调整**：从 60s 改为 30s，离线检测更快
- **导入接口增强**：支持 JSON 数组批量导入多条规则

### ⚠️ 破坏性变更

1. **Pack/Context 移除**：`IcePack`、`IceContext` 及其 Go/Python 对应类已移除。如果你的代码中使用了 Pack（如 `BaseLeafPackFlow`、`doPackFlow`），需要将所有 Pack 相关代码迁移为使用 Roam
2. **叶子节点基类简化**：`BaseLeafPack*` 和 `BaseLeafRoam*` 层级全部移除，统一为 `BaseLeafFlow` / `BaseLeafResult` / `BaseLeafNone`，方法名同步简化（如 `doRoamFlow` → `doFlow`）
3. **Roam API 重命名**：`getMulti`→`getDeep`、`putMulti`→`putDeep`、`getUnion`→`resolve`，需全局替换
4. **`priority` 字段移除**：节点不再支持 `priority` 排序，如有使用请移除
5. **`_ice` 为 Roam 保留键**：不可用于业务数据存储

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| Java SDK | 4.0.0 |
| Go SDK | v1.2.0 |
| Python SDK | 4.0.0 |
| ice-server | 4.0.0 |

---

## [3.0.2](https://github.com/zjn-zjn/ice/compare/v3.0.1...v3.0.2) (2026-03)

**Ice 规则引擎 3.0.2 - Client Address 优化**

### 🔧 优化

- **Client Address 精简**：地址格式从 `IP/app/xxxxxxxxxxx` 缩短为 `IP_xxxxx`
- **IP 获取统一**：Java/Python/Go SDK 统一使用网卡遍历获取非回环 IPv4

### 📦 Starter 移除

- **移除 `ice-spring-boot-starter-2x` 和 `ice-spring-boot-starter-3x`**：所有 Java 项目统一使用 `ice-core`
- **Spring 集成**：Spring/SpringBoot 项目通过 `IceBeanUtils.setFactory()` 实现 Bean 注入

---

## [3.0.1](https://github.com/zjn-zjn/ice/compare/v3.0.0...v3.0.1) (2026-03)

**Ice 规则引擎 3.0.1 - Server 优化**

### 🔧 优化

- **Server 代码重构**：重构 Server 端代码结构，提升可维护性
- **文件夹操作**：支持文件夹操作能力
- **脏检查**：新增脏检查机制，编辑未保存时给出提示
- **UI 优化**：多项界面交互与展示优化

---

## [3.0.0](https://github.com/zjn-zjn/ice/compare/v2.1.3...v3.0.0) (2026-03) 🚀

**Ice 规则引擎 3.0.0 - Server Go 重写**

### 🎯 核心变更

Server 从 Java (Spring Boot) 完全重写为 Go，单二进制部署，无需 JDK 环境。

#### 🔧 Server 重写
- ✅ **Go 重写**：Server 使用 Go 重写，性能更优、部署更简单
- ✅ **单二进制**：前端通过 Go embed 嵌入，无需额外 Web 服务器
- ✅ **多平台预编译**：提供 Linux/macOS/Windows (amd64/arm64) 预编译二进制
- ✅ **Docker 镜像不变**：`waitmoon/ice-server:3.0.0`，使用方式完全兼容

#### 📦 SDK 版本号统一升级
- Java SDK：3.0.0（功能不变，仅版本号升级）
- Go SDK：v1.1.0
- Python SDK：3.0.0

### ⚠️ 升级注意

- **SDK 无代码变更**：仅版本号升级，直接替换即可
- **Server 部署变更**：手动部署从 jar 改为 Go 二进制，下载多平台包
- **Docker 用户**：无需任何变更，镜像名和用法完全一致
- **数据完全兼容**：文件存储格式不变，无需数据迁移

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| Java SDK | 3.0.0 |
| Go SDK | v1.1.0 |
| Python SDK | 3.0.0 |
| ice-server | 3.0.0 |

---

## [2.1.3](https://github.com/zjn-zjn/ice/compare/v2.1.2...v2.1.3) (2026-03)

**Ice 规则引擎 2.1.3 - 前置节点展示优化**

### 🎨 优化

- **前置节点视觉增强**：前置节点使用紫色（#722ed1）+ ◀ 箭头前缀标识，与编辑中节点（橙色虚线边框）明确区分
- **配色方案优化**：统一节点状态配色——前置节点紫色、编辑中节点橙色虚线、未注册节点灰色，语义更清晰

---

## [2.1.2](https://github.com/zjn-zjn/ice/compare/v2.1.0...v2.1.2) (2026-03)

**Ice 规则引擎 2.1.2 - node-meta 接口优化**

### 🔧 优化

- **减少冗余数据**：移除 `ClientInfo` 中的 `classes` 字段，切换泳道/地址时不再返回每个客户端的全量注册类名

---

## [2.1.0](https://github.com/zjn-zjn/ice/compare/v2.0.8...v2.1.0) (2026-03)

**Ice 规则引擎 2.1.0 - 编辑体验与节点元信息增强**

### ✨ 新特性

- **节点元信息**：新增 `node-meta` 接口，支持按主干/泳道/客户端地址获取叶子类元数据与注册信息
- **配置编辑体验**：节点编辑页变更检测更准确（A→B→A 不再误判），并支持“未注册节点”特殊展示
- **批量能力**：支持批量导出与 Base 创建等能力补全

### 🐞 修复

- 修复泳道 `_latest.json` 被误删的问题

---

## [2.0.6](https://github.com/zjn-zjn/ice/compare/2.0.1...2.0.6) (2026-03) 🏊

**Ice 规则引擎 2.0.6 - 泳道（Swimlane）支持**

### ✨ 新特性

#### 🏊 泳道隔离

支持客户端按泳道注册，不同泳道的节点信息互相隔离，解决多开发分支间节点信息互相覆盖的问题。

**客户端配置：**
```yaml
ice:
  app: 1
  storage:
    path: ./ice-data
  lane: feature-xxx  # 泳道名称，不配置则为主干
```

**目录结构：**
```
clients/{app}/              ← 主干客户端（不变）
clients/{app}/lane/{name}/  ← 泳道客户端（新增）
```

**Server 后台：** 配置页面顶部新增泳道选择器，可选择查看主干或指定泳道的叶子节点列表。选择泳道时，节点列表为主干 + 该泳道合并后的结果（同名类泳道覆盖主干）。

**三端支持：** Java、Go、Python SDK 同步支持泳道参数。

### 🔧 优化

* 🔍 **节点搜索修复** - 修复前端叶子节点选择下拉框搜索不生效的问题
* 🧹 **泳道自动清理** - 泳道下所有客户端失活后自动删除泳道目录

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| Java SDK | 2.0.6 |
| Go SDK | v1.0.6 |
| Python SDK | 2.0.6 |
| ice-server | 2.0.6 |

---

## [2.0.1](https://github.com/zjn-zjn/ice/compare/2.0.0...2.0.1) (2025-12) ✨

**Ice 规则引擎 2.0.1 - 多语言 SDK 正式发布**

### 🌐 多语言 SDK

本版本正式发布 Go 和 Python SDK，与 Java SDK 功能完全对等：

```bash
# Go
go get github.com/zjn-zjn/ice/sdks/go

# Python
pip install ice-rules
```

### ✨ 新特性

#### 📝 字段描述增强

三种语言统一支持字段描述，在 Server UI 中友好展示：

| 语言 | 方式 | 示例 |
|------|------|------|
| **Java** | `@IceField` 注解 | `@IceField(name="分数", desc="阈值") double score;` |
| **Go** | `ice` struct tag | `Score float64 \`ice:"name:分数,desc:阈值"\`` |
| **Python** | `Annotated` + `IceField` | `score: Annotated[float, IceField(name="分数")]` |

#### 🏷️ 叶子节点别名 (Alias)

支持多语言兼容配置，不同语言的类名可相互映射：

```java
// Java
@IceNode(alias = {"score_flow"})
public class ScoreFlow extends BaseLeafFlow { }
```

```go
// Go
ice.RegisterLeaf("com.example.ScoreFlow",
    &ice.LeafMeta{Alias: []string{"score_flow"}},
    func() any { return &ScoreFlow{} })
```

```python
# Python
@ice.leaf("com.example.ScoreFlow", alias=["score_flow"])
class ScoreFlow: ...
```

#### 🚫 字段忽略

不想被配置的字段可以忽略：

| 语言 | 方式 |
|------|------|
| **Java** | `@IceIgnore` |
| **Go** | `json:"-"` 或 `ice:"-"` |
| **Python** | `_` 前缀 或 `Annotated[..., IceIgnore()]` |

### 🔧 优化

* 📦 **Monorepo 项目结构**：统一管理 Java/Go/Python SDK
* ⚡ **配置热更新优化**：增量更新更稳定
* 🐛 **Bug 修复**：修复多个边界情况

### 📋 版本信息

| 组件 | 版本 |
|------|------|
| Java SDK | 2.0.1 |
| Go SDK | v1.0.3 |
| Python SDK | 2.0.1 |
| ice-server | 2.0.1 |

---

## [2.0.0](https://github.com/zjn-zjn/ice/compare/1.5.0...2.0.0) (2025-12) 🚀

**Ice 规则引擎 2.0 重大架构升级 - 零依赖、容器化、更轻量**

### 🎯 核心变更

2.0.0 版本对 Ice 进行了彻底的架构革新，移除了对 MySQL 数据库和 NIO 通信的依赖，改为完全基于文件系统的存储方案，并原生支持 Docker 容器化部署。

#### 💾 存储架构革新
* ✨ **文件系统存储**：移除 MySQL 依赖，使用本地文件系统存储所有配置数据
* 📁 **JSON 文件格式**：所有配置以 JSON 文件形式存储，便于版本控制和人工审查
* 🔄 **增量版本更新**：支持增量配置更新，客户端通过轮询版本文件获取最新配置
* 🗂️ **清晰的目录结构**：
  - `apps/` - 应用配置
  - `{app}/bases/` - Base 规则配置
  - `{app}/confs/` - Conf 节点配置
  - `{app}/versions/` - 版本增量更新文件
  - `clients/` - 客户端注册信息

#### 🔗 通信架构简化
* 🚫 **移除 NIO 通信**：不再需要 Server-Client 的 NIO 长连接
* 🚫 **移除 ZooKeeper HA**：不再依赖 ZooKeeper 进行高可用
* 📡 **文件轮询同步**：客户端通过轮询文件系统获取配置更新
* 💓 **心跳机制**：客户端定期写入心跳文件，Server 端可感知客户端状态

#### 🐳 Docker 原生支持
* 📦 **官方 Docker 镜像**：`waitmoon/ice-server:2.0.0`
* 🏗️ **多架构支持**：支持 linux/amd64 和 linux/arm64
* 📝 **Docker Compose**：提供开箱即用的 docker-compose.yml
* 🔧 **环境变量配置**：支持通过环境变量灵活配置
* ♻️ **CI/CD 集成**：GitHub Actions 自动构建发布镜像

### 📋 详细变更

#### 配置变更
* 移除 `spring.datasource` 数据库配置
* 移除 `ice.port` NIO 端口配置
* 移除 `ice.ha` 高可用配置
* 新增 `ice.storage.path` 文件存储路径配置
* 新增 `ice.client-timeout` 客户端超时配置
* 新增 `ice.version-retention` 版本文件保留数量配置
* 客户端新增 `ice.poll-interval` 轮询间隔配置
* 客户端新增 `ice.heartbeat-interval` 心跳间隔配置

### ⚠️ 升级注意事项

1. **数据迁移**：从 1.x 升级需要手动将 MySQL 中的配置数据导出为 JSON 文件
2. **配置更新**：需要更新 application.yml 配置文件，移除数据库配置，添加文件存储配置
3. **依赖变更**：可移除 MySQL 驱动和 MyBatis 相关依赖
4. **部署方式**：推荐使用 Docker 部署，简化运维

### 🚀 快速开始

**Docker 一键部署：**
```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.0
```

**使用 Docker Compose：**
```bash
docker-compose up -d
```

---

## [1.5.0](https://github.com/zjn-zjn/ice/compare/1.3.1...1.5.0) (2025-02-20) 🎉

Ice 规则引擎重大版本更新

#### 新功能
* ✨ 全新的可视化树图结构，规则编排更直观
* 🚀 支持 SpringBoot 3.x 和 JDK 17+
* 📦 Starter 拆分为 2x/3x 版本，分别适配不同 SpringBoot 版本

# [1.3.1](https://github.com/zjn-zjn/ice/compare/1.3.0...1.3.1) (2023-06-02)

#### 功能
* 增加节点回收功能
* #17 兼容spring-boot-devtools

# [1.3.0](https://github.com/zjn-zjn/ice/compare/1.2.0...1.3.0) (2023-06-02)

#### 功能
* 一些改进和修复，年代久远不太记得了...

# [1.2.0](https://github.com/zjn-zjn/ice/compare/1.1.0...1.2.0) (2023-04-10)

#### 功能
* **新的配置页面:**  新的配置页面，支持配置描述，拖动节点编排等(close [#16](https://github.com/zjn-zjn/ice/issues/16))

# [1.1.0](https://github.com/zjn-zjn/ice/compare/1.0.4...1.1.0) (2022-07-30)

#### 功能
* **ice-server 高可用:**  默认支持使用zk做ice-server的高可用方案(close [#13](https://github.com/zjn-zjn/ice/issues/13))


# [1.0.4](https://github.com/zjn-zjn/ice/compare/1.0.3...1.0.4) (2022-07-30)

#### 优化
* **确保Ice启动后才对外提供服务:** 老版本使用CommandLineRunner的方式启动ice，这种启动方式是滞后于Tomcat等服务的。会导致短时间内对外提供的ice服务不可用 (close [#12](https://github.com/zjn-zjn/ice/issues/12))

# [1.0.3](https://github.com/zjn-zjn/ice/compare/1.0.2...1.0.3) (2022-07-14)

#### 修复
* **启动阻塞问题:** 节点类中如果使用了@Bean注解生成的spring bean，在autowiredBean时会阻塞ice启动 (close [#11](https://github.com/zjn-zjn/ice/issues/11))

# [1.0.2](https://github.com/zjn-zjn/ice/compare/1.0.1...1.0.2) (2022-07-05)

#### 功能
* **Jackson替换Fastjson:** 使用Jackson替换Fastjson (close [#8](https://github.com/zjn-zjn/ice/issues/8))
* **配置叶子节点优化:** 通过客户端实现的节点反馈给服务端配置节点 (close [#9](https://github.com/zjn-zjn/ice/issues/9))
* **增加错误入参:** IceErrorHandle.handleError()和BaseNode.errorHandle()增加入参Throwable t，方便根据不同错误类型做不同处理

#### 修复
* **putMutli线程安全问题:** 修复IceRoam的putMutli在构建多层级时可能出现的线程安全问题

# [1.0.1](https://github.com/zjn-zjn/ice/compare/0.0.9...1.0.1) (2022-06-11)

#### 功能
* **去除rmi:** 使用netty替换rmi通信 (close [#5](https://github.com/zjn-zjn/ice/issues/5))
* **脱离spring运行:** 可以使用ice-core中的IceNioClient运行在任何java程序中 (close [#6](https://github.com/zjn-zjn/ice/issues/6))
* **异步结果获取:** 异步执行的process返回futures (close [#7](https://github.com/zjn-zjn/ice/issues/7))

# [0.0.9](https://github.com/zjn-zjn/ice/compare/0.0.8...0.0.9) (2022-04-12)