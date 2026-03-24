---
title: Server Config
description: Complete configuration parameter reference for Ice Server, including port, storage path, client timeout, version retention, and recycling policy.
keywords: Server configuration,ice-server,environment variables,command line arguments,Docker configuration
head:
  - - meta
    - property: og:title
      content: Server Configuration Reference - Ice Rule Engine
  - - meta
    - property: og:description
      content: Complete configuration parameter reference for Ice Server.
---

# Server Configuration Reference

> Ice Server supports both command line arguments and environment variables for configuration. Environment variables take precedence.

## Configuration Options

| Argument | Environment Variable | Type | Default | Description |
|----------|---------------------|------|---------|-------------|
| `--port` | `ICE_PORT` | int | 8121 | Server port |
| `--storage-path` | `ICE_STORAGE_PATH` | string | ./ice-data | File storage path |
| `--client-timeout` | `ICE_CLIENT_TIMEOUT` | int | 30 | Client inactivity timeout (seconds). Clients that haven't reported a heartbeat within this time are marked offline |
| `--version-retention` | `ICE_VERSION_RETENTION` | int | 1000 | Number of version files to retain. Excess versions are cleaned up during recycling |
| `--recycle-cron` | `ICE_RECYCLE_CRON` | string | 0 3 * * * | Cron expression for the recycling scheduled task |
| `--recycle-way` | `ICE_RECYCLE_WAY` | string | hard | Recycling method. soft: mark as deleted; hard: physically delete |
| `--recycle-protect-days` | `ICE_RECYCLE_PROTECT_DAYS` | int | 1 | Recycling protection days. Versions within the protection period will not be recycled |
| `--mode` | `ICE_MODE` | string | open | Running mode. open: normal mode; controlled: controlled mode, prevents creating new Rules and nodes via UI, only allows import and referencing existing nodes |
| `--publish-targets` | `ICE_PUBLISH_TARGETS` | string | | Publish target list, format `name1=url1,name2=url2`. When configured, the export modal shows a "Publish to..." button to push data to remote Servers |

## Configuration Examples

### Command Line Arguments

```bash
./ice-server --port 8121 --storage-path ./ice-data --version-retention 500

# Controlled mode + publish targets
./ice-server --mode controlled --publish-targets "prod=https://prod.example.com,staging=https://staging.example.com"
```

### Environment Variables (Recommended for Docker)

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
      ICE_PUBLISH_TARGETS: "prod=https://prod.example.com"
    volumes:
      - ./ice-data:/app/ice-data
```

## Debug Log Levels

The debug field in _ice is a bitmask. Combine values by adding them to control log output:

| Value | Name | Description |
|-------|------|-------------|
| 1 | IN_ROAM | Print Roam contents before execution |
| 2 | PROCESS | Print execution process |
| 4 | OUT_ROAM | Print Roam contents after execution |

For example, `debug = 3` prints both IN_ROAM (1) and PROCESS (2).
