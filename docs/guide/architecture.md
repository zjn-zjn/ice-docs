---
title: 架构设计
description: 深入理解 Ice 规则引擎的技术架构，包括文件系统同步、版本管理、增量更新、心跳机制和多实例部署方案。
keywords: Ice架构,规则引擎架构,Server Client,共享存储,文件系统同步,分布式部署,热更新
head:
  - - meta
    - property: og:title
      content: Ice 架构设计 - Server + Client + 共享存储
  - - meta
    - property: og:description
      content: 深入理解 Ice 规则引擎的技术架构，包括文件系统同步、版本管理和部署方案。
---

# 架构设计

> Ice 采用零外部依赖的极简架构，通过文件系统实现配置存储和同步。不需要数据库、不需要消息队列、不需要注册中心。

## 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                 共享存储目录 (ice-data/)                   │
│                                                         │
│  apps/     bases/     confs/     versions/    clients/  │
│  应用配置    规则配置    节点配置    版本增量      客户端信息  │
└─────────────────────────────────────────────────────────┘
       ▲ 写入配置                         ▲ 读取配置
       │                                 │
┌──────┴──────┐                   ┌──────┴──────┐
│  Ice Server │                   │ Ice Client  │
│             │                   │             │
│ Web 管理界面 │                   │ 轮询版本文件 │
│ 规则编排配置 │                   │ 加载增量更新 │
│ 版本发布管理 │                   │ 内存执行规则 │
└─────────────┘                   └─────────────┘
```

### 设计特点

| 特点 | 说明 |
|------|------|
| **无数据库** | 配置以 JSON 文件存储，可直接版本控制 |
| **无中间件** | 不需要 ZooKeeper、Redis、消息队列 |
| **无长连接** | Client 通过轮询文件获取更新，不需要 NIO/Netty |
| **文件系统同步** | Server 写文件，Client 读文件，通过共享目录通信 |
| **Docker 友好** | 一行命令部署，通过 volume 挂载共享存储 |

## 核心组件

### Ice Server

可视化规则配置管理中心，Go 语言编写，内嵌 React 前端。

职责：
- 提供 Web 可视化规则配置界面
- 将规则配置以 JSON 文件持久化
- 管理版本历史，支持回溯和回滚
- 生成增量更新文件供 Client 消费
- 监控 Client 在线状态

### Ice Client

集成到业务应用中的规则执行引擎，提供 Java、Go、Python 三种 SDK。

职责：
- 启动时从文件系统全量加载规则到内存
- 定时轮询 `version.txt` 检测配置变更（默认 2 秒）
- 发现新版本后读取增量更新，热更新内存中的规则
- 提供高性能的规则执行接口（纯内存，毫秒级）
- 定时上报心跳（默认 10 秒）

### 共享存储

Server 和 Client 的配置同步媒介。

```
ice-data/
├── apps/                    # 应用配置
│   ├── _id.txt             # 应用 ID 生成器
│   └── {app}.json          # 应用信息
├── clients/                 # 客户端信息
│   └── {app}/
│       ├── m_{address}.json # 客户端元数据（叶子节点信息），注册时写入一次
│       ├── b_{address}.json # 心跳文件（lastHeartbeat、loadedVersion），频繁更新
│       └── _latest.json     # 最新注册的客户端信息缓存
├── mock/                    # Mock 执行目录
│   └── {app}/{address}/     # Mock 执行的请求/响应文件目录
└── {app}/                   # 应用规则（按 app 隔离）
    ├── version.txt         # 当前版本号
    ├── bases/              # 规则（Ice）配置
    ├── confs/              # 节点（Conf）配置
    ├── updates/            # 待发布的变更
    ├── versions/           # 已发布的增量更新
    └── history/            # 发布历史
```

## 配置同步流程

### 发布

```
用户在 Web 界面编辑规则
        ↓
点击「发布」
        ↓
Server 更新 bases/ 和 confs/ 文件
        ↓
生成增量更新 → versions/{version}_upd.json
        ↓
递增 version.txt
```

### 热更新

```
Client 轮询 version.txt（默认每 2 秒）
        ↓
发现版本号变化
        ↓
读取 versions/ 目录下的增量文件
        ↓
热更新内存中的规则配置
```

如果增量文件缺失（如版本跨度过大），Client 自动回退到全量加载。

### 心跳

```
Client 定期写入心跳文件到 clients/{app}/
        ↓
Server 读取心跳文件判断 Client 状态
        ↓
超时未更新的 Client 标记为离线
```

## 部署方式

### 单机部署

Server 和 Client 在同一台机器，共享同一本地目录：

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

Client 配置 `storagePath` 指向同一目录即可。

### Docker Compose

```yaml
version: '3.8'
services:
  ice-server:
    image: waitmoon/ice-server:latest
    ports:
      - "8121:8121"
    volumes:
      - ./ice-data:/app/ice-data

  your-app:
    build: .
    volumes:
      - ./ice-data:/app/ice-data
    depends_on:
      - ice-server
```

### 分布式部署

多个 Server 和 Client 实例通过共享存储协同：

```yaml
services:
  ice-server-1:
    image: waitmoon/ice-server:latest
    volumes:
      - /shared/ice-data:/app/ice-data

  ice-server-2:
    image: waitmoon/ice-server:latest
    volumes:
      - /shared/ice-data:/app/ice-data

  client-1:
    volumes:
      - /shared/ice-data:/app/ice-data

  client-2:
    volumes:
      - /shared/ice-data:/app/ice-data
```

推荐共享存储方案：

| 方案 | 适用场景 |
|------|---------|
| NFS | 内网环境 |
| 阿里云 NAS / AWS EFS | 云环境 |
| GlusterFS / CephFS | 大规模分布式环境 |

## 容错机制

- **Client 独立运行**：Client 只依赖共享存储目录，不依赖 Server 进程。Server 宕机不影响已启动的 Client 正常执行规则
- **内存缓存**：Client 启动后将配置加载到内存，共享存储短暂故障不影响执行
- **增量回退**：增量文件缺失时自动进行全量加载
- **原子写入**：Server 使用 `.tmp` 临时文件 + 原子重命名，避免写入中断导致配置损坏

## 性能特点

| 特性 | 说明 |
|------|------|
| **纯内存执行** | 规则执行完全在内存中进行，毫秒级响应 |
| **零网络开销** | 配置同步基于文件系统，执行时无任何网络通信 |
| **增量更新** | 只加载变更的配置，IO 开销极低 |
| **并发安全** | Roam 基于 ConcurrentHashMap，天然支持并行节点 |

## 下一步

- [快速开始](/guide/getting-started.html) — 部署并运行第一个规则
- [核心概念](/guide/concepts.html) — 理解树形编排的设计思想
- [Server 配置参考](/reference/server-config.html) — 完整的 Server 配置项
- [Client 配置参考](/reference/client-config.html) — 完整的 Client 配置项
