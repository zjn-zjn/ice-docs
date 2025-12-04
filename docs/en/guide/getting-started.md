---
title: Ice Getting Started - 5-Minute Quick Integration Guide
description: Complete guide to quickly integrate Ice rule engine. Includes Docker deployment, file system configuration, Client integration and detailed steps. Supports SpringBoot 2.x/3.x and non-Spring projects.
keywords: rule engine integration,getting started,installation guide,configuration,SpringBoot rule engine,Ice installation,Docker deployment
head:
  - - meta
    - property: og:title
      content: Ice Getting Started - 5-Minute Quick Integration Guide
  - - meta
    - property: og:description
      content: Complete guide to quickly integrate Ice rule engine with Docker deployment, file system configuration, and Client integration.
---

# Ice Rule Engine Getting Started Guide

> Integrate Ice rule engine in 5 minutes and start your visual business orchestration journey!

This guide will help you quickly set up the Ice rule engine environment, including both **Ice Server** (rule management platform) and **Ice Client** (business application integration).

## 2.0 Version New Features

Ice 2.0 brings major architecture upgrades:

- ✅ **Zero Database Dependency**: Uses file system storage, no MySQL required
- ✅ **Zero Middleware Dependency**: Removed ZooKeeper high availability dependency
- ✅ **Native Docker Support**: One-click deployment, ready to use
- ✅ **Lighter**: Simplified architecture, easier deployment

## System Requirements

- **JDK**: 1.8+ (JDK 17+ required for SpringBoot 3.x)
- **Docker**: Recommended for deployment (optional)
- **SpringBoot**: 2.x or 3.x (optional)

## Step 1: Install Ice Server (Rule Management Platform)

Ice Server is the visual rule configuration and management platform, providing rule orchestration, real-time push, and version management features.

### Option 1: Docker Deployment (Recommended)

**One-click deployment with Docker:**

```bash
# Pull image
docker pull waitmoon/ice-server:2.0.0

# Run container
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.0
```

**Deploy with Docker Compose:**

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  ice-server:
    image: waitmoon/ice-server:2.0.0
    container_name: ice-server
    ports:
      - "8121:8121"
    volumes:
      # Mount configuration data directory - the only directory that needs persistence
      - ./ice-data:/app/ice-data
    environment:
      - JAVA_OPTS=-Xms512m -Xmx512m
      - ICE_STORAGE_PATH=/app/ice-data
      - SERVER_PORT=8121
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8121/ || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Start the service:

```bash
docker-compose up -d
```

### Option 2: Manual Deployment

**Download Ice Server Package:**

Latest version v2.0.0

Download: [https://waitmoon.com/downloads/](https://waitmoon.com/downloads/)

Extract the package:

```bash
tar -xzvf ice-server-*.tar.gz
cd ice-server
```

**Configure Ice Server:**

Edit the `application-prod.yml` configuration file:

```yml
server:
  port: 8121

ice:
  # File system storage path
  storage:
    path: ./ice-data
  # Client inactive timeout (seconds)
  client-timeout: 60
  # Version file retention count
  version-retention: 1000
```

**Start/Stop/Restart Server:**

```bash
# Start
sh ice.sh start

# Stop
sh ice.sh stop

# Restart
sh ice.sh restart
```

### Open Configuration Backend

After successful startup, access the Ice rule engine management console:

👉 **http://localhost:8121/**

### Online Demo Environment

Ice rule engine online demo environment (only app=1 has deployed client):

👉 [http://eg.waitmoon.com](http://eg.waitmoon.com)

## Step 2: SpringBoot Project Integration

Ice Client is the rule engine execution client that integrates into your business application to execute rules.

Refer to the complete example: [ice-test module](https://github.com/zjn-zjn/ice)

### Add Maven Dependencies

Choose the appropriate Ice Starter for your SpringBoot version:

```xml
<!-- SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>2.0.0</version>
</dependency>

<!-- SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>2.0.0</version>
</dependency>
```

### Add Ice Configuration

```yml
ice:
  # Application ID, corresponds to backend configuration app
  app: 1
  # File storage path (shared with Server)
  storage:
    path: ./ice-data
  # Scan packages for leaf nodes, multiple packages separated by ','
  # Default scans all (scanning all will slow down application startup)
  scan: com.ice.test
  # Version polling interval (seconds), default 5 seconds
  poll-interval: 5
  # Heartbeat update interval (seconds), default 10 seconds
  heartbeat-interval: 10
  # Thread pool configuration (for concurrent relation nodes)
  pool:
    parallelism: -1  # Default -1, ≤0 uses default configuration
```

### Configuration Sharing Notes

**Important**: Ice Client needs to **share the same storage directory** (`ice.storage.path`) with Ice Server.

#### Local Development Environment

For local development, Client and Server use the same local path:

```yml
# Both Server and Client configure the same path
ice:
  storage:
    path: ./ice-data
```

#### Docker Environment

In Docker environment, achieve sharing through volume mounts:

```yaml
# docker-compose.yml
services:
  ice-server:
    volumes:
      - ./ice-data:/app/ice-data

  your-app:
    volumes:
      - ./ice-data:/app/ice-data  # Same mount directory
```

#### Distributed Environment

In distributed environments, use shared storage (such as NFS, cloud drives, etc.):

```yaml
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

## Step 3: Non-SpringBoot Project Integration

If your project is not SpringBoot, you can use the Ice Core package for direct integration.

### Add Maven Dependencies

```xml
<!-- Ice Core Package - for non-SpringBoot projects -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>2.0.0</version>
</dependency>
```

### Java Code Integration

```java
import com.ice.core.client.IceFileClient;

// Create Ice file client instance
IceFileClient iceFileClient = new IceFileClient(
    1,                    // app ID, corresponds to Server configuration
    "./ice-data",         // Storage path (shared with Server)
    "com.ice.test"        // Leaf node scan package path
);

// Start client, load configurations from file system
iceFileClient.start();

// Wait for startup to complete
iceFileClient.waitStarted();

// ... Business logic ...

// Destroy client when application closes
iceFileClient.destroy();
```

#### Full Constructor Parameters

```java
/**
 * @param app                    Application ID
 * @param storagePath            File storage path
 * @param parallelism            Parallelism (≤0 uses default ForkJoinPool)
 * @param scanPackages           Scan package path set
 * @param pollIntervalSeconds    Version polling interval (seconds)
 * @param heartbeatIntervalSeconds Heartbeat interval (seconds)
 */
IceFileClient iceFileClient = new IceFileClient(
    1,                          // app ID
    "./ice-data",               // Storage path
    -1,                         // Parallelism
    Set.of("com.ice.test"),     // Scan packages
    5,                          // Poll interval
    10                          // Heartbeat interval
);
```

## Step 4: Rule Development and Configuration

### Create Leaf Nodes

Ice provides three types of leaf nodes:

- **Flow Node**: Process control, returns true/false
- **Result Node**: Result processing, executes specific business logic
- **None Node**: Auxiliary operation, no return value

Example code:

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    @Resource
    private SendService sendService;

    private String key;      // Configurable uid key
    private double value;    // Configurable amount to send

    @Override
    protected boolean doRoamResult(IceRoam roam) {
        Integer uid = roam.getMulti(key);
        if (uid == null || value <= 0) {
            return false;
        }
        return sendService.sendAmount(uid, value);
    }
}
```

### Execute Rules

```java
// Create execution pack
IcePack pack = new IcePack();
pack.setIceId(1L);  // Rule ID

// Set business parameters
IceRoam roam = new IceRoam();
roam.put("uid", 12345);
roam.put("amount", 100.0);
pack.setRoam(roam);

// Synchronous execution
Ice.syncProcess(pack);

// Or asynchronous execution
List<Future<IceContext>> futures = Ice.asyncProcess(pack);
```

## File Storage Directory Structure

Ice 2.0 uses the following directory structure to store configurations:

```
ice-data/
├── apps/                    # Application configurations
│   ├── _id.txt             # Application ID generator
│   └── 1.json              # App 1 configuration
├── clients/                 # Client information
│   └── 1/                  # App 1 clients
│       ├── 192.168.1.1_8080_12345.json  # Client heartbeat file
│       └── _latest.json    # Latest client information
├── 1/                       # App 1 rule configurations
│   ├── version.txt         # Current version number
│   ├── _base_id.txt        # Base ID generator
│   ├── _conf_id.txt        # Conf ID generator
│   ├── _push_id.txt        # Push ID generator
│   ├── bases/              # Base rule configurations
│   │   └── 1.json
│   ├── confs/              # Conf node configurations
│   │   ├── 1.json
│   │   └── 2.json
│   ├── versions/           # Version incremental updates
│   │   ├── 1_upd.json
│   │   └── 2_upd.json
│   └── history/            # Publish history
│       └── 1.json
└── ...
```

## FAQ

### Q: How to migrate from version 1.x to 2.0?

A: You need to export data from MySQL to JSON file format. A specific migration tool will be provided in future versions.

### Q: How to deploy multiple Server instances?

A: Multiple Server instances need to share the same storage directory (such as NFS or cloud drive).

### Q: How does the Client get configuration updates?

A: The Client polls the `version.txt` file to detect version changes and loads incremental update files when a new version is found.

### Q: How to monitor client status?

A: The Server reads heartbeat files in the `clients/` directory to detect client status. Clients that haven't updated beyond the timeout will be marked as offline.
