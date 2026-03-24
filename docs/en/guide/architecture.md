---
title: Architecture
description: Deep dive into the technical architecture of the Ice rule engine, including file system synchronization, version management, incremental updates, heartbeat mechanism, and multi-instance deployment.
keywords: Ice architecture,rule engine architecture,Server Client,shared storage,file system sync,distributed deployment,hot reload
head:
  - - meta
    - property: og:title
      content: Ice Architecture - Server + Client + Shared Storage
  - - meta
    - property: og:description
      content: Deep dive into the technical architecture of the Ice rule engine, including file system synchronization, version management, and deployment options.
---

# Architecture

> Ice adopts a minimalist architecture with zero external dependencies, using the file system for configuration storage and synchronization. No database, no message queue, no service registry required.

## Overall Architecture

```
+----------------------------------------------------------+
|              Shared Storage Directory (ice-data/)         |
|                                                          |
|  apps/     bases/     confs/     versions/    clients/   |
|  App cfg   Rule cfg   Node cfg   Version deltas  Client info  |
+----------------------------------------------------------+
       ^ writes config                      ^ reads config
       |                                    |
+------+------+                   +---------+----+
| Ice Server  |                   |  Ice Client  |
|             |                   |              |
| Web admin   |                   | Polls version|
| Rule editor |                   | Loads deltas |
| Version mgmt|                   | In-memory    |
+-------------+                   +--------------+
```

### Design Highlights

| Feature | Description |
|---------|-------------|
| **No database** | Configuration stored as JSON files, directly version-controllable |
| **No middleware** | No ZooKeeper, Redis, or message queue needed |
| **No persistent connections** | Client polls files for updates; no NIO/Netty required |
| **File system sync** | Server writes files, Client reads files, communicating through a shared directory |
| **Docker friendly** | Deploy with a single command, share storage via volume mount |

## Core Components

### Ice Server

Visual rule configuration management center, written in Go with an embedded React frontend.

Responsibilities:
- Provide a Web-based visual rule configuration interface
- Persist rule configurations as JSON files
- Manage version history with rollback support
- Generate incremental update files for Client consumption
- Monitor Client online status

### Ice Client

Rule execution engine integrated into business applications, available as Java, Go, and Python SDKs.

Responsibilities:
- Load all rules from the file system into memory on startup
- Periodically poll `version.txt` for configuration changes (default: every 2 seconds)
- Hot-reload rules in memory upon detecting a new version
- Provide high-performance rule execution interface (pure in-memory, millisecond-level)
- Periodically report heartbeats (default: every 10 seconds)

### Shared Storage

The synchronization medium between Server and Client.

```
ice-data/
+-- apps/                    # App configuration
|   +-- _id.txt             # App ID generator
|   +-- {app}.json          # App information
+-- clients/                 # Client information
|   +-- {app}/
|       +-- m_{address}.json # Client metadata (leaf node info), written once on register
|       +-- b_{address}.json # Heartbeat file (lastHeartbeat, loadedVersion), updated frequently
|       +-- _latest.json     # Latest registered client info cache
+-- mock/                    # Mock execution directory
|   +-- {app}/{address}/     # Mock execution request/response file directory
+-- {app}/                   # App rules (isolated per app)
    +-- version.txt         # Current version number
    +-- bases/              # Rule (Ice) configuration
    +-- confs/              # Node (Conf) configuration
    +-- updates/            # Pending changes
    +-- versions/           # Applied incremental updates
    +-- history/            # Apply history
```

## Configuration Sync Flow

### Applying

```
User edits rules in Web interface
        |
Clicks "Apply"
        |
Server updates bases/ and confs/ files
        |
Generates incremental update -> versions/{version}_upd.json
        |
Increments version.txt
```

### Hot Reload

```
Client polls version.txt (default: every 2 seconds)
        |
Detects version number change
        |
Reads incremental files from versions/ directory
        |
Hot-reloads rule configuration in memory
```

If incremental files are missing (e.g., due to a large version gap), the Client automatically falls back to a full reload.

### Heartbeat

```
Client periodically writes heartbeat file to clients/{app}/
        |
Server reads heartbeat files to determine Client status
        |
Clients that haven't updated within the timeout are marked offline
```

## Deployment Options

### Single Machine Deployment

Server and Client on the same machine, sharing the same local directory:

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

Configure the Client's `storagePath` to point to the same directory.

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

### Distributed Deployment

Multiple Server and Client instances coordinating through shared storage:

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

Recommended shared storage solutions:

| Solution | Use Case |
|----------|----------|
| NFS | Internal network environments |
| AWS EFS / GCP Filestore | Cloud environments |
| GlusterFS / CephFS | Large-scale distributed environments |

## Fault Tolerance

- **Client runs independently**: The Client depends only on the shared storage directory, not on the Server process. Server downtime does not affect running Clients
- **In-memory cache**: After startup, the Client loads configuration into memory; brief shared storage outages do not impact execution
- **Incremental fallback**: Automatically performs a full reload when incremental files are missing
- **Atomic writes**: Server uses `.tmp` temporary files with atomic rename to prevent configuration corruption from interrupted writes

## Performance Characteristics

| Feature | Description |
|---------|-------------|
| **Pure in-memory execution** | Rule execution is entirely in-memory with millisecond-level response times |
| **Zero network overhead** | Configuration sync is file-system-based; no network communication during execution |
| **Incremental updates** | Only changed configurations are loaded, minimizing I/O overhead |
| **Concurrency safe** | Roam is based on ConcurrentHashMap, natively supporting parallel nodes |

## Next Steps

- [Getting Started](/en/guide/getting-started.html) -- Deploy and run your first rule
- [Core Concepts](/en/guide/concepts.html) -- Understand the design philosophy of tree-based orchestration
- [Server Configuration Reference](/en/reference/server-config.html) -- Complete Server configuration options
- [Client Configuration Reference](/en/reference/client-config.html) -- Complete Client configuration options
