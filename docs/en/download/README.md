---
title: Download Ice Server
description: Download pre-built Ice Server binaries for Linux, macOS, and Windows.
keywords: download,Ice Server,binary,Linux,macOS,Windows,Docker
head:
  - - meta
    - property: og:title
      content: Download Ice Server
  - - meta
    - property: og:description
      content: Download pre-built Ice Server binaries for multiple platforms.
---

# Download Ice Server

## Current Version: 4.0.8

<div class="download-badges">

[![GitHub Release](https://img.shields.io/github/v/release/zjn-zjn/ice?style=flat-square&label=Release)](https://github.com/zjn-zjn/ice/releases/tag/v4.0.8)
[![Docker Image](https://img.shields.io/docker/v/waitmoon/ice-server?style=flat-square&label=Docker&sort=semver)](https://hub.docker.com/r/waitmoon/ice-server)

</div>

### Pre-built Binaries

| Platform | Architecture | Download |
|----------|-------------|----------|
| **Linux** | x86_64 (amd64) | [ice-server-4.0.8-linux-amd64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-linux-amd64.tar.gz) |
| **Linux** | ARM64 | [ice-server-4.0.8-linux-arm64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-linux-arm64.tar.gz) |
| **macOS** | Intel (amd64) | [ice-server-4.0.8-darwin-amd64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-darwin-amd64.tar.gz) |
| **macOS** | Apple Silicon (ARM64) | [ice-server-4.0.8-darwin-arm64.tar.gz](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-darwin-arm64.tar.gz) |
| **Windows** | x86_64 (amd64) | [ice-server-4.0.8-windows-amd64.zip](https://waitmoon.com/downloads/4.0.8/ice-server-4.0.8-windows-amd64.zip) |

### Docker

```bash
# Latest version
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest

# Specific version
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:4.0.8
```

### Quick Start

```bash
tar -xzvf ice-server-4.0.8-linux-amd64.tar.gz
cd ice-server-4.0.8-linux-amd64
sh ice.sh start
# Visit http://localhost:8121
```

---

## What's New in 4.0.8

### New Features

| Feature | Description | Configuration |
|---------|-------------|---------------|
| **Controlled Mode** | Prevents creating new Rules and nodes via UI, only allows import and referencing existing nodes — ideal for production environments | `--mode controlled` or `ICE_MODE=controlled` |
| **Publish to Remote** | Export modal can push data directly to configured remote Servers via server-side proxy to avoid CORS | `--publish-targets "name=url,..."` or `ICE_PUBLISH_TARGETS` |

### Improvements

| Item | Change |
|------|--------|
| UI Rename | "Publish" button renamed to "Apply" to free up the "publish" concept for remote publishing |
| Controlled Badge | Controlled mode displays a "Controlled Mode" badge in the header with hover tooltip |
| Request Timeout | Frontend HTTP request timeout changed from 10s to 120s |

### Configuration Example

```bash
# Production: controlled mode + can push to test
./ice-server --mode controlled \
  --publish-targets "test=http://test.example.com:8121"

# Test: open mode + can push to production
./ice-server --publish-targets "prod=http://prod.example.com:8121"
```

---

## SDK Versions

This release updates Server only. SDK versions remain unchanged:

| Component | Version | Install |
|-----------|---------|---------|
| Java SDK | 4.0.7 | `com.waitmoon.ice:ice-core:4.0.7` |
| Go SDK | v1.2.3 | `go get github.com/zjn-zjn/ice/sdks/go@v1.2.3` |
| Python SDK | 4.0.7 | `pip install ice-rules==4.0.7` |

---

## Previous Versions

| Version | Date | Highlights | Download |
|---------|------|------------|----------|
| 4.0.7 | 2026-03 | Fix import ID conflict | [Download](https://waitmoon.com/downloads/4.0.7/) |
| 4.0.6 | 2026-03 | Logging system overhaul | [Download](https://waitmoon.com/downloads/4.0.6/) |
| 4.0.5 | 2026-03 | Roam API simplification | [Download](https://waitmoon.com/downloads/4.0.5/) |
| 4.0.0 | 2026-03 | Pack/Context removal, Mock execution | [Download](https://waitmoon.com/downloads/4.0.0/) |
| 3.0.0 | 2026-03 | Server rewritten in Go | [Download](https://waitmoon.com/downloads/3.0.0/) |

See the full [Changelog](/en/CHANGELOG.html) for details.
