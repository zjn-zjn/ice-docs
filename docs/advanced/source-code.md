---
title: Ice 项目结构 - 源码解析和模块说明
description: Ice规则引擎的项目结构和源码解析，包括核心模块、组件功能、代码组织等详细说明，助力开发者深入理解Ice源码。
keywords: 项目结构,源码解析,模块说明,代码组织,Ice源码,规则引擎源码
head:
  - - meta
    - property: og:title
      content: Ice 项目结构 - 源码解析和模块说明
  - - meta
    - property: og:description
      content: Ice规则引擎的项目结构和源码解析，包括核心模块、组件功能、代码组织等详细说明。
---

# Ice 规则引擎项目结构

> Ice 规则引擎源码解析，深入了解核心模块和代码组织

## Ice 规则引擎模块概览

Ice 2.0 采用 Monorepo 架构，统一管理多语言 SDK，各模块职责清晰，便于理解和扩展。

```
ice/                              # GitHub: github.com/zjn-zjn/ice
├── sdks/                         # 多语言 SDK
│   ├── java/                     # Java SDK
│   │   ├── ice-common/           # 公共模块
│   │   ├── ice-core/             # 规则引擎核心 ⭐
│   │   └── ice-spring-boot/      # SpringBoot 集成
│   │       ├── ice-spring-boot-starter-2x/
│   │       └── ice-spring-boot-starter-3x/
│   ├── go/                       # Go SDK (v1.0.1)
│   │   ├── cache/                # 配置缓存
│   │   ├── client/               # 文件客户端
│   │   ├── context/              # 执行上下文
│   │   ├── node/                 # 节点实现
│   │   └── relation/             # 关系节点
│   └── python/                   # Python SDK
│       └── src/ice/              # 核心实现
├── server/                       # 配置管理服务端
│   └── ice-server/
└── tests/                        # 测试示例
    ├── java/                     # Java 测试
    ├── go/                       # Go 测试
    └── python/                   # Python 测试
```

## 核心模块说明

### ice-common - 公共模块

Ice 规则引擎的公共组件库：

- **constant/** - 常量定义
  - `Constant` - 通用常量
  - `IceStorageConstants` - 文件存储相关常量（2.0新增）
- **dto/** - 数据传输对象
  - `IceBaseDto` / `IceConfDto` - 规则配置 DTO
  - `IceTransferDto` - 配置传输 DTO
  - `IceClientInfo` - 客户端信息（2.0新增）
  - `IceAppDto` / `IcePushHistoryDto` - 应用和发布历史
- **enums/** - 枚举定义
- **model/** - 模型类

### ice-core - 规则引擎核心 ⭐

Ice 规则引擎的核心实现，**强烈推荐阅读**：

#### 1. annotation 包 - 注解定义

- `@IceNode` - 节点注解，定义节点名称、描述、排序
- `@IceField` - 字段注解，定义字段名称、描述、类型
- `@IceIgnore` - 忽略注解，标记不在配置界面展示的字段

#### 2. base 包 - 节点基类 ⭐⭐⭐

Ice 规则引擎节点体系的核心基类：

- **BaseNode** - 所有规则节点的基类
  - 节点生命周期管理
  - 时间控制（生效时间）
  - 错误处理
- **BaseLeaf** - 所有叶子节点的基类
  - `BaseLeafFlow` - Flow 节点基类
  - `BaseLeafResult` - Result 节点基类
  - `BaseLeafNone` - None 节点基类
- **BaseRelation** - 所有关系节点的基类
  - AND / ANY / ALL / NONE / TRUE

#### 3. cache 包 - 规则引擎缓存 ⭐⭐⭐

- **IceConfCache** - 规则节点缓存
  - 节点初始化和实例化
  - 规则树构建
  - 配置热更新
- **IceHandlerCache** - Handler 缓存
  - 按 iceId 索引
  - 按 scene 索引

#### 4. client 包 - 客户端实现（2.0重构）

- **IceFileClient** - 基于文件系统的客户端 ⭐
  - 从文件系统加载配置
  - 版本轮询检测更新
  - 心跳上报
  - 增量/全量配置加载
- **IceLeafScanner** - 叶子节点扫描器
- **IceUpdate** - 配置更新处理

#### 5. context 包 - 执行上下文

- **IceContext** - 规则执行上下文
- **IcePack** - 执行包裹，触发时传入
- **IceRoam** - 数据存储（ConcurrentHashMap 扩展）

#### 6. 执行入口

- **Ice** - 执行入口类 `从这里开始看源码~`
  - `syncProcess()` - 同步执行
  - `asyncProcess()` - 异步执行
- **IceDispatcher** - 规则分发器

### ice-server - 配置管理服务端

Ice 规则引擎的配置管理平台：

#### 核心目录

- **controller/** - 接口层
  - `IceAppController` - 应用管理
  - `IceBaseController` - 规则列表
  - `IceConfController` - 节点配置
- **service/** - 业务层
  - `IceAppService` - 应用服务
  - `IceBaseService` - 规则服务
  - `IceConfService` - 配置服务
  - `IceServerService` - 服务端核心逻辑
- **storage/** - 存储层（2.0新增）⭐
  - `IceFileStorageService` - 文件存储服务
  - `IceClientManager` - 客户端管理
  - `IceIdGenerator` - ID 生成器

#### 2.0 架构变化

- ✅ 新增 `storage/` 包 - 文件存储实现
- ❌ 移除 `dao/` 包 - 不再需要 MyBatis
- ❌ 移除 `nio/` 包 - 不再需要 NIO 通信

### ice-spring-boot - SpringBoot 集成

#### ice-spring-boot-starter-2x

适用于 SpringBoot 2.x 的 Starter：

- `IceClientProperties` - 配置属性类
- `IceFileClientInit` - 客户端初始化（2.0新增）

#### ice-spring-boot-starter-3x

适用于 SpringBoot 3.x 的 Starter，结构与 2x 相同。

### ice-test - 测试示例

提供完整的使用示例，包含：

- 叶子节点示例（Flow/Result/None）
- 配置文件示例
- 规则执行示例

## 源码阅读建议

### 入门路线

1. **ice-test** - 先跑通示例，了解基本用法
2. **Ice.java** - 从执行入口开始
3. **IceDispatcher** - 了解规则分发逻辑
4. **BaseNode/BaseRelation/BaseLeaf** - 理解节点体系

### 进阶路线

1. **IceConfCache** - 配置缓存和规则树构建
2. **IceFileClient** - 客户端实现（2.0）
3. **IceFileStorageService** - 文件存储实现（2.0）

### 核心类推荐 ⭐

| 类名 | 说明 | 推荐度 |
|-----|------|--------|
| `Ice` | 执行入口 | ⭐⭐⭐ |
| `BaseNode` | 节点基类 | ⭐⭐⭐ |
| `IceConfCache` | 配置缓存 | ⭐⭐⭐ |
| `IceFileClient` | 文件客户端 | ⭐⭐ |
| `IceFileStorageService` | 文件存储 | ⭐⭐ |
