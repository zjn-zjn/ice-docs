---
title: 下载 Ice Server
description: 下载 Ice Server 预编译二进制包，支持 Linux、macOS、Windows 多平台。
keywords: 下载,Ice Server,二进制,Linux,macOS,Windows,Docker
---

# 下载 Ice Server

## 当前版本：4.0.12

<div class="download-badges">

[![GitHub Release](https://img.shields.io/github/v/release/zjn-zjn/ice?style=flat-square&label=Release)](https://github.com/zjn-zjn/ice/releases/tag/v4.0.12)
[![Docker Image](https://img.shields.io/docker/v/waitmoon/ice-server?style=flat-square&label=Docker&sort=semver)](https://hub.docker.com/r/waitmoon/ice-server)

</div>

### 预编译二进制

| 平台 | 架构 | 下载 |
|------|------|------|
| **Linux** | x86_64 (amd64) | [ice-server-4.0.12-linux-amd64.tar.gz](https://waitmoon.com/downloads/4.0.12/ice-server-4.0.12-linux-amd64.tar.gz) |
| **Linux** | ARM64 | [ice-server-4.0.12-linux-arm64.tar.gz](https://waitmoon.com/downloads/4.0.12/ice-server-4.0.12-linux-arm64.tar.gz) |
| **macOS** | Intel (amd64) | [ice-server-4.0.12-darwin-amd64.tar.gz](https://waitmoon.com/downloads/4.0.12/ice-server-4.0.12-darwin-amd64.tar.gz) |
| **macOS** | Apple Silicon (ARM64) | [ice-server-4.0.12-darwin-arm64.tar.gz](https://waitmoon.com/downloads/4.0.12/ice-server-4.0.12-darwin-arm64.tar.gz) |
| **Windows** | x86_64 (amd64) | [ice-server-4.0.12-windows-amd64.zip](https://waitmoon.com/downloads/4.0.12/ice-server-4.0.12-windows-amd64.zip) |

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
  waitmoon/ice-server:4.0.12
```

### 快速启动

```bash
tar -xzvf ice-server-4.0.12-linux-amd64.tar.gz
cd ice-server-4.0.12-linux-amd64
sh ice.sh start
# 访问 http://localhost:8121
```

---

## 4.0.12 更新内容

**版本递增修复 & 新建节点属性回显修复**

- Server：修复 `ImportData` 仅导入 Confs（无 Bases）时未触发版本号递增的问题，导致这些变更不会通过版本订阅机制推送给客户端
- Server：新增子节点 / 前置节点 API（`/conf/edit` editType=1/4）单节点创建时也返回完整节点数据（含 `nodeInfo`）
- Web UI：修复新增子节点后，双击该节点编辑属性时表单为空、必须刷新页面才能正常显示的问题

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
| 4.0.11 | 2026-03 | 暗色模式修复 & 变更列表优化 | [下载](https://waitmoon.com/downloads/4.0.11/) |
| 4.0.10 | 2026-03 | 变更对比功能 | [下载](https://waitmoon.com/downloads/4.0.10/) |
| 4.0.8 | 2026-03 | 受控模式 & 发布到远程 | [下载](https://waitmoon.com/downloads/4.0.8/) |
| 4.0.7 | 2026-03 | 修复导入 ID 冲突 | [下载](https://waitmoon.com/downloads/4.0.7/) |
| 4.0.6 | 2026-03 | 日志系统重构 | [下载](https://waitmoon.com/downloads/4.0.6/) |
| 4.0.5 | 2026-03 | Roam API 简化 | [下载](https://waitmoon.com/downloads/4.0.5/) |
| 4.0.0 | 2026-03 | Pack/Context 移除、Mock 执行 | [下载](https://waitmoon.com/downloads/4.0.0/) |
| 3.0.0 | 2026-03 | Server Go 重写 | [下载](https://waitmoon.com/downloads/3.0.0/) |

完整更新日志请查看 [CHANGELOG](/CHANGELOG.html)。
