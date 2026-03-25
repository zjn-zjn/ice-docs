---
title: Server 配置
description: Ice Server 的完整配置参数参考，包括端口、存储路径、客户端超时、版本保留、回收策略等。
keywords: Server配置,ice-server,环境变量,命令行参数,Docker配置
---

# Server 配置参考

> Ice Server 支持命令行参数和环境变量两种配置方式，环境变量优先。

## 配置项

| 参数 | 环境变量 | 类型 | 默认值 | 说明 |
|------|----------|------|--------|------|
| `--port` | `ICE_PORT` | int | 8121 | 服务端口 |
| `--storage-path` | `ICE_STORAGE_PATH` | string | ./ice-data | 文件存储路径 |
| `--client-timeout` | `ICE_CLIENT_TIMEOUT` | int | 30 | 客户端失活超时（秒）。超过此时间未上报心跳的 Client 标记为离线 |
| `--version-retention` | `ICE_VERSION_RETENTION` | int | 1000 | 版本文件保留数量。超出后旧版本在回收时被清理 |
| `--recycle-cron` | `ICE_RECYCLE_CRON` | string | 0 3 * * * | 回收定时任务的 cron 表达式 |
| `--recycle-way` | `ICE_RECYCLE_WAY` | string | hard | 回收方式。soft：标记删除；hard：物理删除 |
| `--recycle-protect-days` | `ICE_RECYCLE_PROTECT_DAYS` | int | 1 | 回收保护天数。保护期内的版本不会被回收 |
| `--mode` | `ICE_MODE` | string | open | 运行模式。open：正常模式；controlled：受控模式，禁止通过 UI 新建 Rule 和节点，只允许导入和引用已有节点 |
| `--publish-targets` | `ICE_PUBLISH_TARGETS` | string | | 发布目标列表，格式 `名称1=URL1,名称2=URL2`。配置后导出弹窗出现「发布到...」按钮，可将数据推送到远程 Server |

## 配置示例

### 命令行参数

```bash
./ice-server --port 8121 --storage-path ./ice-data --version-retention 500

# 受控模式 + 发布目标
./ice-server --mode controlled --publish-targets "生产环境=https://prod.example.com,预发环境=https://staging.example.com"
```

### 环境变量（Docker 推荐）

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -e ICE_PORT=8121 \
  -e ICE_STORAGE_PATH=/app/ice-data \
  -e ICE_VERSION_RETENTION=500 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  ice-server:
    image: waitmoon/ice-server:latest
    ports:
      - "8121:8121"
    environment:
      ICE_STORAGE_PATH: /app/ice-data
      ICE_VERSION_RETENTION: 500
      ICE_RECYCLE_CRON: "0 3 * * *"
      ICE_MODE: controlled
      ICE_PUBLISH_TARGETS: "生产环境=https://prod.example.com"
    volumes:
      - ./ice-data:/app/ice-data
```

## Debug 日志级别

Meta 的 debug 字段是位掩码，通过累加控制日志输出：

| 值 | 名称 | 说明 |
|----|------|------|
| 1 | IN_ROAM | 打印执行前的 Roam 内容 |
| 2 | PROCESS | 打印执行过程 |
| 4 | OUT_ROAM | 打印执行后的 Roam 内容 |

例如 `debug = 3` 表示同时打印 IN_ROAM（1）和 PROCESS（2）。
