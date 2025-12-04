---
title: Ice 架构设计 - 技术架构和实现原理
description: 深入剖析Ice规则引擎的技术架构、核心组件和实现原理，帮助开发者更好地理解和使用Ice框架。
keywords: 架构设计,技术原理,核心组件,源码解析,规则引擎架构,Ice架构
head:
  - - meta
    - property: og:title
      content: Ice 架构设计 - 技术架构和实现原理
  - - meta
    - property: og:description
      content: 深入剖析Ice规则引擎的技术架构、核心组件和实现原理，帮助开发者更好地理解Ice框架。
---

# Ice 规则引擎架构设计

> 深入理解 Ice 规则引擎的技术架构和核心组件

## Ice 规则引擎整体架构

Ice 2.0 采用极简架构设计，**零外部依赖**，通过文件系统实现配置存储和同步。

### 架构特点

- 🚫 **无数据库依赖**：不需要 MySQL，配置以 JSON 文件存储
- 🚫 **无中间件依赖**：不需要 ZooKeeper、Redis 等
- 🚫 **无长连接通信**：不需要 NIO/Netty，Client 通过轮询文件获取更新
- ✅ **文件系统同步**：Server 和 Client 共享同一存储目录
- ✅ **Docker 友好**：一行命令即可部署

### 工作原理

```
┌─────────────────────────────────────────────────────────┐
│                    共享存储目录                           │
│                   (ice-data/)                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  apps/  │  │ bases/  │  │ confs/  │  │versions/│    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
└─────────────────────────────────────────────────────────┘
        ▲ 写入                              ▲ 读取
        │                                   │
┌───────┴───────┐                   ┌───────┴───────┐
│   Ice Server  │                   │   Ice Client  │
│  (配置管理)    │                   │  (规则执行)    │
│               │                   │               │
│ • Web 管理界面 │                   │ • 轮询版本文件 │
│ • 规则编排配置 │                   │ • 加载增量更新 │
│ • 版本发布管理 │                   │ • 内存执行规则 │
└───────────────┘                   └───────────────┘
```

### 配置同步流程

1. **Server 发布配置**
   - 更新 `bases/` 和 `confs/` 目录下的配置文件
   - 生成增量更新文件到 `versions/`
   - 更新 `version.txt` 版本号

2. **Client 轮询更新**
   - 定期检查 `version.txt`（默认5秒）
   - 发现新版本后读取增量更新文件
   - 热更新内存中的规则配置

3. **心跳上报**
   - Client 定期写入心跳文件到 `clients/`
   - Server 可感知 Client 在线状态

## 核心组件

### Ice Server - 规则管理平台

**功能定位**：Ice 规则引擎的可视化配置管理中心

**核心能力**：
- 提供 Web 可视化规则配置界面
- 以 JSON 文件存储所有规则配置
- 支持规则版本管理和历史回溯
- 生成增量更新供 Client 消费
- 多应用（App）隔离管理

### Ice Client - 规则执行引擎

**功能定位**：Ice 规则引擎的业务执行核心

**核心能力**：
- 从文件系统加载规则配置到内存
- 轮询版本文件检测配置变更
- 提供高性能的规则执行接口
- 支持多种节点类型和编排模式
- 纯内存运算，毫秒级响应

## 存储结构

```
ice-data/
├── apps/                    # 应用配置
│   ├── _id.txt             # ID生成器
│   └── {app}.json          # 应用信息
├── clients/                 # 客户端信息
│   └── {app}/
│       ├── {address}.json  # 心跳文件
│       └── _latest.json    # 最新客户端
└── {app}/                   # 应用规则
    ├── version.txt         # 版本号
    ├── bases/              # Base配置
    ├── confs/              # Conf配置
    ├── versions/           # 增量更新
    └── history/            # 发布历史
```

## 节点类图

**BaseNode：** 所有 Ice 节点的基类，提供通用节点操作，如节点生效时间等。

**BaseRelation：** 所有关系节点基类，用于控制业务流转，包括：
- **AND**：所有子节点为 true 才返回 true
- **ANY**：任一子节点为 true 就返回 true
- **ALL**：执行所有子节点
- **NONE**：执行所有子节点，始终返回 none
- **TRUE**：执行所有子节点，始终返回 true

**BaseLeaf：** 所有叶子节点基类，真正执行业务的节点，包括：
- **Flow**：流程控制节点，返回 true/false
- **Result**：结果处理节点，执行业务操作
- **None**：辅助节点，不影响流程

## 部署架构

### 单机部署

最简单的部署方式，Server 和 Client 在同一台机器：

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.0
```

### 分布式部署

多个 Server/Client 实例共享存储：

```yaml
# 使用 NFS 或云盘作为共享存储
services:
  ice-server:
    volumes:
      - /shared/ice-data:/app/ice-data
  
  client-1:
    volumes:
      - /shared/ice-data:/app/ice-data
  
  client-2:
    volumes:
      - /shared/ice-data:/app/ice-data
```

## 性能特点

- **零网络开销**：配置同步基于文件系统，无网络通信延迟
- **纯内存执行**：规则执行完全在内存中进行，毫秒级响应
- **增量更新**：只加载变更的配置，减少资源消耗
- **无锁设计**：节点执行互不干扰，天然支持高并发
