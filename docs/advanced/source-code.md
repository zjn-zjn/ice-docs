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

Ice 规则引擎采用模块化设计，各模块职责清晰，便于理解和扩展。

### 核心模块说明

#### ice-common - 公共模块
Ice 规则引擎的公共组件库，包含：
- 通用工具类（工具方法、类型转换）
- 枚举定义（节点类型、关系类型、状态枚举）
- 常量定义（配置常量、默认值）
- 异常类定义

#### ice-core - 规则引擎核心模块 ⭐
Ice 规则引擎的核心实现，**强烈推荐阅读**，包含规则引擎的所有核心功能：

##### 1. annotation 包 - 注解定义
- 节点扫描注解
- 配置注解
- 自动装配注解

##### 2. base 包 - 节点基类 ⭐⭐⭐
Ice 规则引擎节点体系的核心基类：
- **BaseNode**：所有规则节点的基类，提供节点生命周期管理、时间控制等通用功能
- **BaseLeaf**：所有叶子节点的基类，实现具体业务逻辑的节点
- **BaseRelation**：所有关系节点的基类，控制业务流程编排（AND/OR/ALL等）

##### 3. builder 包 - 手动构建器
提供手动构建规则的编程方式（不推荐，建议使用可视化配置平台）

##### 4. cache 包 - 规则引擎缓存核心 ⭐⭐⭐
Ice 规则引擎的缓存管理中心：
- **IceConfCache**：规则节点缓存，负责节点初始化、规则树构建、配置更新
- **IceHandlerCache**：可触发的 Handler 缓存，组织和管理规则入口

##### 5. client 包 - 服务通信模块
Ice Client 与 Server 的通信实现：
- 规则配置拉取
- 实时配置变更监听
- ha 子包：高可用相关实现（Zookeeper集成）

##### 6. context 包 - 规则执行上下文
Ice 规则引擎的执行环境：
- **IceContext**：规则执行上下文的最外层，贯穿整个规则执行生命周期
    - IcePack 包裹，触发时传入的结构
    - IceParallelContext 并发的上下文，暂未使用(还没想好)
    - IceRoam 用户自定义信息&执行过程中产生的数据存放的地方(其实就是个map)
  - handler 可执行的handler
  - leaf 叶子节点
    - base 基础叶子，context作为直接入参
    - pack 剥开context，留个pack入参的叶子
    - roam 剥开pack，留个roam入参的叶子
  - relation 关系节点
    - parallel 并发的关系节点
  - utils 工具类
  - Ice 执行入口，`要看源码的从这里开始~`
  - IceDispatcher 分发器
- **ice-server** server端，一些crud等操作，乱七八糟的很多，不好看也不用看
  - config server配置类
  - constant server 基础转换/操作
  - controller 
    - common 通用controller处理，如包装resp，封装err
    - IceAppController app相关操作
    - IceBaseController 列表页相关操作
    - IceConfController 树配置相关操作
    - IceMockController mock相关操作
  - dao 数据库操作
  - enums 枚举
  - exception 错误处理
  - nio 和client通信相关处理
  - service 一些操作的处理，crud...
- **ice-test** 小demo，官网例子，直接上手使用族可看
- **ice-client** spring client的一些初始化操作
- **ice-client-spring-boot-autoconfigure** 为了stater准备的，不用看
- **ice-client-spring-boot-starter** stater，方便spring-boot项目直接引入使用的，不用看