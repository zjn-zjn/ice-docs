---
title: Ice 规则引擎更新日志 - 版本历史记录
description: Ice规则引擎的版本更新历史，包括新功能、性能优化、Bug修复等详细变更记录。了解Ice规则引擎的每个版本改进。
keywords: 更新日志,版本历史,CHANGELOG,Ice版本,规则引擎更新,新功能
head:
  - - meta
    - property: og:title
      content: Ice 规则引擎更新日志 - 版本历史记录
  - - meta
    - property: og:description
      content: Ice规则引擎的完整版本更新历史，了解每个版本的新功能和改进。
---

# Ice 规则引擎更新日志

> 记录 Ice 规则引擎每个版本的功能更新、性能优化和问题修复

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
public class ScoreFlow extends BaseLeafRoamFlow { }
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