---
title: Ice Architecture Overview - Server/Client Architecture
description: Understand the overall architecture design of Ice rule engine, including Server, Client, shared storage working principles and deployment methods.
keywords: Ice architecture,rule engine architecture,Server Client,shared storage,distributed deployment
head:
  - - meta
    - property: og:title
      content: Ice Architecture Overview - Server/Client Architecture
  - - meta
    - property: og:description
      content: Understand the overall architecture design of Ice rule engine, including Server, Client, shared storage working principles.
---

# Ice Architecture Overview

> Understanding the Server + Client + Shared Storage architecture pattern

## Overall Architecture

Ice adopts a **zero external dependency** minimalist architecture, implementing configuration storage and synchronization through the file system.

```
┌─────────────────────────────────────────────────────────────┐
│                  Shared Storage (ice-data/)                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐    │
│  │  apps/  │  │ bases/  │  │ confs/  │  │  versions/  │    │
│  │  Apps   │  │  Rules  │  │  Nodes  │  │  Increments │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────┘
        ▲ Write config                      ▲ Read config
        │                                   │
┌───────┴───────┐                   ┌───────┴───────┐
│   Ice Server  │                   │   Ice Client  │
│  (Management) │                   │  (Execution)  │
│               │                   │               │
│ • Web UI      │                   │ • Poll version│
│ • Rule config │                   │ • Load updates│
│ • Publishing  │                   │ • Execute rules│
└───────────────┘                   └───────────────┘
```

### Architecture Features

| Feature | Description |
|---------|-------------|
| 🚫 **No Database** | No MySQL required, configs stored as JSON files |
| 🚫 **No Middleware** | No ZooKeeper, Redis, etc. |
| 🚫 **No Long Connections** | No NIO/Netty, Client polls files for updates |
| ✅ **File System Sync** | Server and Client share the same storage directory |
| ✅ **Docker Friendly** | Deploy with a single command |

## Core Components

### Ice Server - Rule Management Platform

**Role**: Visual rule configuration management center

**Core Capabilities**:
- Web-based visual rule configuration interface
- Store all rule configurations as JSON files
- Support rule version management and history rollback
- Generate incremental updates for Client consumption
- Multi-application (App) isolation management

### Ice Client - Rule Execution Engine

**Role**: Rule execution core for business applications

**Core Capabilities**:
- Load rule configurations from file system to memory
- Poll version file to detect configuration changes
- Provide high-performance rule execution interface
- Support multiple node types and orchestration modes
- Pure in-memory computation, millisecond response

### Shared Storage - Configuration Sync Bridge

**Role**: Configuration synchronization medium between Server and Client

**Storage Structure**:

```
ice-data/
├── apps/                    # Application configs
│   ├── _id.txt             # ID generator
│   └── {app}.json          # App information
├── clients/                 # Client information
│   └── {app}/
│       ├── {address}.json  # Heartbeat file
│       └── _latest.json    # Latest client
└── {app}/                   # App rules
    ├── version.txt         # Version number
    ├── bases/              # Base configs
    ├── confs/              # Conf configs
    ├── versions/           # Incremental updates
    └── history/            # Publish history
```

## Configuration Sync Flow

### 1. Server Publishing

```
User modifies rules in Web UI
        ↓
Clicks "Publish" button
        ↓
Server updates bases/ and confs/ files
        ↓
Generates incremental file to versions/
        ↓
Updates version.txt version number
```

### 2. Client Polling

```
Client periodically checks version.txt (default 5 seconds)
        ↓
Detects new version number
        ↓
Reads incremental update files from versions/
        ↓
Hot-reloads rule configuration in memory
```

### 3. Heartbeat Mechanism

```
Client periodically writes heartbeat file to clients/
        ↓
Server reads heartbeat files to detect Client status
        ↓
Clients that haven't updated are marked as offline
```

## Deployment Methods

### Single Machine Deployment

Simplest deployment with Server and Client on the same machine:

```bash
# Start Server
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest

# Client configures same path
ice:
  storage:
    path: ./ice-data
```

### Docker Compose Deployment

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
      - ./ice-data:/app/ice-data  # Shared storage
    depends_on:
      - ice-server
```

### Distributed Deployment

Multiple Server/Client instances sharing storage:

```yaml
services:
  ice-server-1:
    image: waitmoon/ice-server:latest
    volumes:
      - /shared/ice-data:/app/ice-data  # NFS/Cloud

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

**Recommended Shared Storage Solutions**:
- **NFS**: Network File System, suitable for intranet
- **Cloud Drives**: AWS EFS, Azure Files, Google Filestore, etc.
- **Distributed File Systems**: GlusterFS, CephFS, etc.

## Performance Characteristics

| Feature | Description |
|---------|-------------|
| **Zero Network Overhead** | Config sync via file system, no network latency |
| **Pure In-Memory Execution** | Rule execution entirely in memory, millisecond response |
| **Incremental Updates** | Only load changed configurations, reduce resource usage |
| **Lock-Free Design** | Node execution independent, naturally supports high concurrency |

## Next Steps

- 📖 [Getting Started](/en/guide/getting-started.html) - Start integrating Ice
- 🔧 [Detailed Documentation](/en/guide/detail.html) - Deep dive into configuration
- 🏗️ [Deep Architecture](/en/advanced/architecture.html) - Technical implementation

