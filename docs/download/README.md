---
title: 下载 Ice Server
description: 下载 Ice Server 预编译二进制包，支持 Linux、macOS、Windows 多平台。
keywords: 下载,Ice Server,二进制,Linux,macOS,Windows,Docker
head:
  - - meta
    - property: og:title
      content: 下载 Ice Server
  - - meta
    - property: og:description
      content: 下载 Ice Server 预编译二进制包，支持多平台。
---

# 下载 Ice Server

## 当前版本：4.0.8

<div class="download-badges">

[![GitHub Release](https://img.shields.io/github/v/release/zjn-zjn/ice?style=flat-square&label=Release)](https://github.com/zjn-zjn/ice/releases/tag/v4.0.8)
[![Docker Image](https://img.shields.io/docker/v/waitmoon/ice-server?style=flat-square&label=Docker&sort=semver)](https://hub.docker.com/r/waitmoon/ice-server)

</div>

### 预编译二进制

| 平台 | 架构 | 下载 |
|------|------|------|
| **Linux** | x86_64 (amd64) | [ice-server-4.0.8-linux-amd64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-linux-amd64.tar.gz) |
| **Linux** | ARM64 | [ice-server-4.0.8-linux-arm64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-linux-arm64.tar.gz) |
| **macOS** | Intel (amd64) | [ice-server-4.0.8-darwin-amd64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-darwin-amd64.tar.gz) |
| **macOS** | Apple Silicon (ARM64) | [ice-server-4.0.8-darwin-arm64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-darwin-arm64.tar.gz) |
| **Windows** | x86_64 (amd64) | [ice-server-4.0.8-windows-amd64.zip](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-windows-amd64.zip) |

### Docker

```bash
# 最新版
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest

# 指定版本
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:4.0.8
```

### 快速启动

```bash
tar -xzvf ice-server-4.0.8-linux-amd64.tar.gz
cd ice-server-4.0.8-linux-amd64
sh ice.sh start
# 访问 http://localhost:8121
```

---

## 4.0.8 更新内容

### 新特性

| 特性 | 说明 | 配置 |
|------|------|------|
| **受控模式** | 禁止通过 UI 新建 Rule 和节点，仅允许导入和引用已有节点，适用于生产环境防误操作 | `--mode controlled` 或 `ICE_MODE=controlled` |
| **发布到远程** | 导出弹窗可直接将数据推送到配置的远程 Server，通过 Server 代理转发避免跨域 | `--publish-targets "名称=URL,..."` 或 `ICE_PUBLISH_TARGETS` |

### 改进

| 项目 | 变更 |
|------|------|
| UI 文案 | 「发布」按钮重命名为「应用」，为「发布到远程」腾出语义空间 |
| 受控标识 | 受控模式下页面顶部显示「受控模式」标签，hover 提示具体限制 |
| 请求超时 | 前端 HTTP 请求超时从 10 秒调整为 120 秒 |

### 配置示例

```bash
# 生产环境：受控模式 + 可推送到测试环境
./ice-server --mode controlled \
  --publish-targets "测试环境=http://test.example.com:8121"

# 测试环境：开放模式 + 可推送到生产环境
./ice-server --publish-targets "生产环境=http://prod.example.com:8121"
```

---

## SDK 版本

本次仅更新 Server，SDK 版本不变：

| 组件 | 版本 | 安装 |
|------|------|------|
| Java SDK | 4.0.7 | `com.waitmoon.ice:ice-core:4.0.7` |
| Go SDK | v1.2.3 | `go get github.com/zjn-zjn/ice/sdks/go@v1.2.3` |
| Python SDK | 4.0.7 | `pip install ice-rules==4.0.7` |

---

## 历史版本

| 版本 | 日期 | 说明 | 下载 |
|------|------|------|------|
| 4.0.7 | 2026-03 | 修复导入 ID 冲突 | [下载](https://waitmoon.com/downloads/4.0.7/) |
| 4.0.6 | 2026-03 | 日志系统重构 | [下载](https://waitmoon.com/downloads/4.0.6/) |
| 4.0.5 | 2026-03 | Roam API 简化 | [下载](https://waitmoon.com/downloads/4.0.5/) |
| 4.0.0 | 2026-03 | Pack/Context 移除、Mock 执行 | [下载](https://waitmoon.com/downloads/4.0.0/) |
| 3.0.0 | 2026-03 | Server Go 重写 | [下载](https://waitmoon.com/downloads/3.0.0/) |

完整更新日志请查看 [CHANGELOG](/CHANGELOG.html)。
