---
title: Ice Rule Engine Upgrade Guide - Version Upgrade Instructions
description: Ice rule engine version upgrade guide, including upgrade steps, configuration changes, code modifications and detailed instructions for each version. Help you smoothly upgrade rule engine versions.
keywords: upgrade guide,version upgrade,migration guide,Ice upgrade,rule engine upgrade,version compatibility
head:
  - - meta
    - property: og:title
      content: Ice Rule Engine Upgrade Guide - Version Upgrade Instructions
  - - meta
    - property: og:description
      content: Detailed version upgrade guide and migration instructions for Ice rule engine.
---

# Ice Rule Engine Upgrade Guide

> ⚠️ **Important**: When upgrading Ice rule engine, upgrade Server first, then Client

## v1.5.0 → v2.0.0 Major Architecture Upgrade 🚀

Ice rule engine 2.0.0 is an **architecture revolution**, removing MySQL and ZooKeeper dependencies in favor of file system storage with native Docker deployment support.

### ⚠️ Important Changes

| Change | 1.x Version | 2.0.0 Version |
|--------|-------------|---------------|
| Storage | MySQL Database | File System (JSON) |
| Communication | NIO Long Connection | File Polling |
| High Availability | ZooKeeper | Shared Storage (NFS/Cloud) |
| Deployment | Manual | Docker One-Click |

### Server Upgrade (Ice Server)

**1. Data Migration**

Export configuration data from MySQL to JSON file format (migration tool will be provided in future versions).

**2. Configuration Changes**

```yaml
# Old configuration (1.x)
server:
  port: 8121
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ice
    username: root
    password: password
ice:
  port: 18121  # NIO port
  ha:
    address: localhost:2181  # ZK address

# New configuration (2.0.0)
server:
  port: 8121
ice:
  storage:
    path: ./ice-data  # File storage path
  client-timeout: 60  # Client timeout (seconds)
  version-retention: 1000  # Version file retention count
```

**3. Dependency Changes**

Can remove these dependencies:
- MySQL driver
- MyBatis related dependencies
- ZooKeeper/Curator dependencies
- Netty dependencies

**4. Recommended Docker Deployment**

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.1
```

### Client Upgrade (Ice Client)

**1. Dependency Update**

```xml
<!-- SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>2.0.1</version>
</dependency>

<!-- SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>2.0.1</version>
</dependency>

<!-- Non-SpringBoot -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>2.0.1</version>
</dependency>
```

**2. Configuration Changes**

```yaml
# Old configuration (1.x)
ice:
  app: 1
  server: 127.0.0.1:18121  # NIO server address
  # server: zookeeper:localhost:2181  # ZK HA
  scan: com.ice.test

# New configuration (2.0.0)
ice:
  app: 1
  storage:
    path: ./ice-data  # Storage path shared with Server
  scan: com.ice.test
  poll-interval: 5  # Version polling interval (seconds)
  heartbeat-interval: 10  # Heartbeat interval (seconds)
```

**3. Code Changes (Non-SpringBoot projects)**

```java
// Old code (1.x)
IceNioClient client = new IceNioClient(1, "127.0.0.1:18121", "com.ice.test");
client.start();

// New code (2.0.0)
IceFileClient client = new IceFileClient(1, "./ice-data", "com.ice.test");
client.start();
```

**4. Important: Storage Path Sharing**

Client needs to **share the same storage directory** with Server:
- Local development: Use the same local path
- Docker environment: Share via volume mounts
- Distributed environment: Use NFS or cloud drives

---

## v1.3.0 → v1.5.0 Major Version Upgrade

Ice rule engine 1.5.0 is a major version update bringing a brand new visual interface and SpringBoot 3.x support.

### Server Upgrade (Ice Server)
**New Visual Tree Structure**
- ✨ Added drag-and-drop rule orchestration interface
- 🎨 Optimized rule configuration page interaction
- 📊 Enhanced rule visualization display

### Client Upgrade (Ice Client)

**1. SDK Compatibility**
- ✅ This upgrade is **fully compatible** with the old Client SDK, no upgrade required
- Upgrade recommended for better performance and new features

**2. Dependency Name Changes**

Ice rule engine client dependency names adjusted to support different SpringBoot versions:

```xml
<!-- Old version (no longer recommended) -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-client-spring-boot-starter</artifactId>
  <version>1.3.0</version>
</dependency>

<!-- New version - SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>1.5.0</version>
</dependency>

<!-- New version - SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>1.5.0</version>
</dependency>
```

## v1.2.0→v1.3.0
* Various improvements and fixes

## v1.1.0→v1.2.0

* **Configuration**
* * Server
* * * Configuration page tweaks

* * Client
* * * Add @IceNode, @IceField, @IceIgnore annotations to improve configuration interpretability

## v1.0.4→v1.1.0

* **Configuration**
* * Server
* * * Added ice.ha configuration for server high availability, no configuration needed for standalone server

* * Client
* * * ice.server configuration supports server high availability, e.g. ice.server=zookeeper:localhost:2181. Standalone server configuration remains the same

## v1.0.3→v1.0.4

* **Code**
* * IceNioClient.connect() changed to start(), only non-Spring projects need modification

## v1.0.1→v1.0.2/v1.0.3

* **Configuration**
* * Client
* * * Added ice.scan configuration for scanning leaf nodes (default scans all, which slows application startup), multiple packages separated by ','

* **Code**
* * Ice.processCxt and Ice.processSingleCxt renamed to processCtx and processSingleCtx
* * IceErrorHandle.handleError() and BaseNode.errorHandle() added error parameter Throwable t

## v1.0.1
> Don't use 1.0.0!!! Due to network issues when packaging and pushing to central repository, the 1.0.0 jar package is incomplete!

* **Configuration**
* * Server 
* * * ice.rmi.port removed rmi becomes ice.port, recommended to replace original port number when upgrading to avoid dirty data issues
* * Client 
* * * Removed ice.rmi.mode, ice.rmi.port
* * * ice.rmi.server removed rmi becomes ice.server

* **Code**
* * Ice replaces IceClient, process() becomes asyncProcess()

* **Features**
* * Run without Spring, ```client = new IceNioClient(app, server).connect()``` connect() is a blocking method, can start new thread to run, ```new Thread(client::connect).start()```, end with ```client.destroy()```
