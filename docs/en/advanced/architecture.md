---
title: Ice Architecture - Technical Design and Implementation
description: In-depth analysis of Ice rule engine architecture, core components, and implementation principles for better understanding and usage of the Ice framework.
keywords: architecture design,technical principles,core components,source code,rule engine architecture,Ice architecture
head:
  - - meta
    - property: og:title
      content: Ice Architecture - Technical Design and Implementation
  - - meta
    - property: og:description
      content: In-depth analysis of Ice rule engine architecture, core components, and implementation principles.
---

# Ice Rule Engine Architecture Design

> In-depth understanding of Ice rule engine's technical architecture and core components

## Ice Rule Engine Overall Architecture

Ice 2.0 adopts a minimalist architecture design with **zero external dependencies**, using file system for configuration storage and synchronization.

![Ice Rule Engine Architecture](/images/advanced/architecture-dark.png#dark)
![Ice Rule Engine Architecture](/images/advanced/architecture-light.png#light)

### Architecture Features

- 🚫 **No Database Dependency**: No MySQL required, configurations stored as JSON files
- 🚫 **No Middleware Dependency**: No ZooKeeper, Redis, etc.
- 🚫 **No Long Connection**: No NIO/Netty, Client polls files for updates
- ✅ **File System Sync**: Server and Client share the same storage directory
- ✅ **Docker Friendly**: Deploy with a single command

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│                 Shared Storage Directory                 │
│                      (ice-data/)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  apps/  │  │ bases/  │  │ confs/  │  │versions/│    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
└─────────────────────────────────────────────────────────┘
        ▲ Write                             ▲ Read
        │                                   │
┌───────┴───────┐                   ┌───────┴───────┐
│   Ice Server  │                   │   Ice Client  │
│ (Config Mgmt) │                   │ (Rule Exec)   │
│               │                   │               │
│ • Web UI      │                   │ • Poll version│
│ • Rule Config │                   │ • Load updates│
│ • Version Pub │                   │ • Execute rules│
└───────────────┘                   └───────────────┘
```

### Configuration Sync Flow

1. **Server Publishes Configuration**
   - Updates config files in `bases/` and `confs/` directories
   - Generates incremental update files to `versions/`
   - Updates `version.txt` version number

2. **Client Polls for Updates**
   - Periodically checks `version.txt` (default 5 seconds)
   - Reads incremental update files when new version found
   - Hot updates rule configurations in memory

3. **Heartbeat Reporting**
   - Client periodically writes heartbeat files to `clients/`
   - Server can detect Client online status

## Core Components

### Ice Server - Rule Management Platform

**Positioning**: Visual configuration management center for Ice rule engine

**Core Capabilities**:
- Provides web visual rule configuration interface
- Stores all rule configurations as JSON files
- Supports rule version management and history rollback
- Generates incremental updates for Client consumption
- Multi-application (App) isolation management

### Ice Client - Rule Execution Engine

**Positioning**: Business execution core of Ice rule engine

**Core Capabilities**:
- Loads rule configurations from file system to memory
- Polls version file to detect configuration changes
- Provides high-performance rule execution interface
- Supports multiple node types and orchestration modes
- Pure in-memory computation with millisecond response

## Storage Structure

```
ice-data/
├── apps/                    # Application configs
│   ├── _id.txt             # ID generator
│   └── {app}.json          # Application info
├── clients/                 # Client information
│   └── {app}/
│       ├── {address}.json  # Heartbeat file
│       └── _latest.json    # Latest client
└── {app}/                   # Application rules
    ├── version.txt         # Version number
    ├── bases/              # Base configs
    ├── confs/              # Conf configs
    ├── versions/           # Incremental updates
    └── history/            # Publish history
```

## Node Class Diagram

**BaseNode:** The base class of all Ice nodes, providing common node operations like node valid time.

**BaseRelation:** The base class of all relation nodes, used for business flow control, including:
- **AND**: Returns true only if all child nodes return true
- **ANY**: Returns true if any child node returns true
- **ALL**: Executes all child nodes
- **NONE**: Executes all child nodes, always returns none
- **TRUE**: Executes all child nodes, always returns true

**BaseLeaf:** The base class of all leaf nodes, the nodes that actually execute business logic, including:
- **Flow**: Process control nodes, returns true/false
- **Result**: Result processing nodes, executes business operations
- **None**: Auxiliary nodes, doesn't affect flow

## Deployment Architecture

### Single Machine Deployment

The simplest deployment with Server and Client on the same machine:

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.0
```

### Distributed Deployment

Multiple Server/Client instances sharing storage:

```yaml
# Use NFS or cloud storage as shared storage
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

## Performance Characteristics

- **Zero Network Overhead**: Config sync based on file system, no network latency
- **Pure Memory Execution**: Rule execution entirely in memory, millisecond response
- **Incremental Updates**: Only loads changed configurations, reduces resource consumption
- **Lock-Free Design**: Node execution is independent, naturally supports high concurrency
