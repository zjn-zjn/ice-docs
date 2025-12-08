---
title: Ice Getting Started - 5-Minute Quick Integration Guide
description: Complete guide to quickly integrate Ice rule engine. Includes Server deployment, Client SDK integration. Supports Docker one-click deployment.
keywords: rule engine integration,getting started,installation guide,configuration,Docker deployment,Client SDK
head:
  - - meta
    - property: og:title
      content: Ice Getting Started - 5-Minute Quick Integration Guide
  - - meta
    - property: og:description
      content: Complete guide to quickly integrate Ice rule engine with Server deployment and Client SDK integration.
---

# Ice Getting Started Guide

> Integrate Ice rule engine in 5 minutes and start your visual business orchestration journey!

## Prerequisites

Ice uses a **Server + Client + Shared Storage** architecture:

- **Ice Server**: Visual rule configuration management platform
- **Ice Client**: Rule execution SDK integrated into your business applications
- **Shared Storage**: Server and Client sync configurations through shared file directory

## Requirements

- **Docker**: Recommended for Server deployment
- **JDK**: 1.8+ (JDK 17+ for SpringBoot 3.x)

## Step 1: Deploy Ice Server

### Option 1: Docker Deployment (Recommended)

```bash
# Pull and run
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

Or use Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'
services:
  ice-server:
    image: waitmoon/ice-server:latest
    container_name: ice-server
    ports:
      - "8121:8121"
    volumes:
      - ./ice-data:/app/ice-data
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### Option 2: Manual Deployment

Download latest version: [https://waitmoon.com/downloads/](https://waitmoon.com/downloads/)

```bash
# Extract and start
tar -xzvf ice-server-*.tar.gz
cd ice-server
sh ice.sh start
```

### Access Management UI

After startup, visit: **http://localhost:8121**

Online demo: [http://eg.waitmoon.com](http://eg.waitmoon.com)

## Step 2: Integrate Ice Client SDK

### Add Dependency

<CodeGroup>
  <CodeGroupItem title="SpringBoot 3.x" active>

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>2.0.1</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="SpringBoot 2.x">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>2.0.1</version>
</dependency>
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```bash
pip install ice-rules
```

  </CodeGroupItem>

  <CodeGroupItem title="Non-SpringBoot">

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>2.0.1</version>
</dependency>
```

  </CodeGroupItem>
</CodeGroup>

### Configure Client

```yaml
# application.yml
ice:
  app: 1                        # App ID, corresponds to Server config
  storage:
    path: ./ice-data            # Shared storage path (same as Server)
  scan: com.your.package        # Leaf node scan package
```

::: warning Critical Configuration
**`ice.storage.path` must share the same directory with Server**

- Local development: Use the same local path
- Docker environment: Share through volume mounts
- Distributed environment: Use NFS or cloud drives
:::

### Non-SpringBoot Projects

```java
import com.ice.core.client.IceFileClient;

// Create client
IceFileClient client = new IceFileClient(
    1,                    // app ID
    "./ice-data",         // shared storage path
    "com.your.package"    // leaf node scan package
);

// Start
client.start();
client.waitStarted();

// Destroy when done
client.destroy();
```

## Step 3: Develop Leaf Nodes

Ice provides three types of leaf nodes:

| Type | Base Class | Return | Purpose |
|------|------------|--------|---------|
| **Flow** | `BaseLeafRoamFlow` | true/false | Condition checks, filtering |
| **Result** | `BaseLeafRoamResult` | true/false | Business operations, rewards |
| **None** | `BaseLeafRoamNone` | none | Data queries, logging |

### Example: Amount Reward Node

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    private String key;      // Configurable: user ID key
    private double value;    // Configurable: amount to send

    @Override
    protected boolean doRoamResult(IceRoam roam) {
        Integer uid = roam.getMulti(key);
        if (uid == null || value <= 0) {
            return false;
        }
        // Call business service to send amount
        return sendService.sendAmount(uid, value);
    }
}
```

## Step 4: Configure and Execute Rules

### 1. Configure Rules in Server

Visit http://localhost:8121 to access the management UI:

1. Create an Application (App)
2. Create a new Rule (Ice)
3. Configure the node tree
4. **Publish** to make configuration effective

### 2. Execute in Business Code

```java
// Create execution pack
IcePack pack = new IcePack();
pack.setIceId(1L);  // Rule ID

// Set business parameters
IceRoam roam = new IceRoam();
roam.put("uid", 12345);
roam.put("amount", 100.0);
pack.setRoam(roam);

// Execute rule
Ice.syncProcess(pack);

// Get execution result
Object result = roam.get("SEND_AMOUNT");
```

## Storage Sharing Solutions

### Local Development

```yaml
# Server and Client use same path
ice:
  storage:
    path: ./ice-data
```

### Docker Environment

```yaml
# docker-compose.yml
services:
  ice-server:
    volumes:
      - ./ice-data:/app/ice-data

  your-app:
    volumes:
      - ./ice-data:/app/ice-data  # Same mount
```

### Distributed Environment

Use NFS or cloud drives (AWS EFS, Azure Files, etc.) as shared storage.

## Next Steps

- 📖 [Detailed Documentation](/en/guide/detail.html) - Deep dive into node types and configuration
- 🐹 [Go SDK Guide](/en/guide/go-sdk.html) - Go language integration guide
- 🐍 [Python SDK Guide](/en/guide/python-sdk.html) - Python language integration guide
- 🏗️ [Architecture Design](/en/advanced/architecture.html) - Understand Ice architecture
- 🎥 [Video Tutorial](https://www.bilibili.com/video/BV1Q34y1R7KF) - Configuration and development demo

## FAQ

### Client not loading configuration?

Check if `ice.storage.path` points to the same directory as Server.

### Rule changes not taking effect?

Make sure you clicked "Publish" in Server. Configuration syncs to Client only after publishing.

### More Questions

👉 [FAQ](/en/guide/qa.html)
