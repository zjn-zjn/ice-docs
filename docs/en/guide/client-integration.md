---
title: Ice Client SDK Integration Guide
description: Detailed guide on how to integrate Ice Client SDK into your business applications, including SpringBoot and non-SpringBoot integration methods.
keywords: Client SDK,integration guide,SpringBoot integration,ice-core,ice-spring-boot-starter
head:
  - - meta
    - property: og:title
      content: Ice Client SDK Integration Guide
  - - meta
    - property: og:description
      content: Detailed guide on how to integrate Ice Client SDK into your business applications.
---

# Ice Client SDK Integration Guide

> Learn how to integrate Ice Client SDK into your business applications

## Overview

Ice Client is the rule execution engine that needs to be integrated into your business applications. Java, Go and Python SDKs are available:

| Language | Package | Use Case |
|----------|---------|----------|
| **Java (SpringBoot)** | `ice-spring-boot-starter-3x` / `ice-spring-boot-starter-2x` | SpringBoot projects (Recommended) |
| **Java (Core)** | `ice-core` | Non-SpringBoot Java projects |
| **Go** | `github.com/zjn-zjn/ice/sdks/go` | Go projects |
| **Python** | `ice-rules` | Python projects |

::: tip Other Language SDKs
- For Go users, please check the [Go SDK Integration Guide](/en/guide/go-sdk.html)
- For Python users, please check the [Python SDK Integration Guide](/en/guide/python-sdk.html)
:::

## SpringBoot Project Integration

### 1. Add Dependency

Choose the appropriate Starter based on your SpringBoot version:

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
</CodeGroup>

### 2. Configure application.yml

```yaml
ice:
  # Application ID (required) - corresponds to App in Server
  app: 1
  
  # Shared storage path (required) - must share same directory with Server
  storage:
    path: ./ice-data
  
  # Leaf node scan packages
  # Multiple packages separated by comma, scans all if not configured (slower)
  scan: com.your.package
  
  # Version polling interval (seconds), default 5
  poll-interval: 5
  
  # Heartbeat update interval (seconds), default 10
  heartbeat-interval: 10
  
  # Thread pool configuration (for concurrent relation nodes)
  pool:
    parallelism: -1  # Default -1, ≤0 uses ForkJoinPool default
```

### 3. Develop Leaf Nodes

Create leaf node classes under the configured `scan` package path:

```java
package com.your.package;

import com.ice.core.leaf.roam.BaseLeafRoamResult;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    // Fields configurable in Server
    private String uidKey;
    private double amount;

    @Override
    protected boolean doRoamResult(IceRoam roam) {
        Integer uid = roam.getMulti(uidKey);
        if (uid == null || amount <= 0) {
            return false;
        }
        // Business logic
        return sendService.sendAmount(uid, amount);
    }
}
```

### 4. Execute Rules

```java
@Service
public class YourService {

    public void processRule(Long userId) {
        IcePack pack = new IcePack();
        pack.setIceId(1L);  // Rule ID
        
        IceRoam roam = new IceRoam();
        roam.put("uid", userId);
        pack.setRoam(roam);
        
        // Synchronous execution
        Ice.syncProcess(pack);
        
        // Get execution result
        Object result = roam.get("RESULT_KEY");
    }
}
```

## Non-SpringBoot Project Integration

### 1. Add Dependency

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>2.0.1</version>
</dependency>
```

### 2. Initialize Client

```java
import com.ice.core.client.IceFileClient;
import java.util.Set;

public class IceClientInit {

    private static IceFileClient iceFileClient;

    public static void init() {
        // Method 1: Simple constructor
        iceFileClient = new IceFileClient(
            1,                    // app ID
            "./ice-data",         // shared storage path
            "com.your.package"    // leaf node scan package
        );

        // Method 2: Full constructor
        iceFileClient = new IceFileClient(
            1,                              // app ID
            "./ice-data",                   // shared storage path
            -1,                             // parallelism (≤0 uses default)
            Set.of("com.your.package"),     // scan packages set
            5,                              // poll interval (seconds)
            10                              // heartbeat interval (seconds)
        );

        // Start client
        iceFileClient.start();
        
        // Wait for startup completion
        iceFileClient.waitStarted();
    }

    public static void destroy() {
        if (iceFileClient != null) {
            iceFileClient.destroy();
        }
    }
}
```

### 3. Configure Bean Factory (Optional)

If leaf nodes require dependency injection:

```java
import com.ice.core.utils.IceBeanUtils;

public class IceBeanFactoryInit {

    public static void init() {
        IceBeanUtils.setIceBeanFactory(new IceBeanFactory() {
            @Override
            public <T> T getBean(Class<T> clazz) {
                // Get bean from your IoC container
                return YourContainer.getBean(clazz);
            }
        });
    }
}
```

### 4. Execute Rules

```java
public void processRule(Long userId) {
    IcePack pack = new IcePack();
    pack.setIceId(1L);
    
    IceRoam roam = new IceRoam();
    roam.put("uid", userId);
    pack.setRoam(roam);
    
    Ice.syncProcess(pack);
}
```

## Shared Storage Configuration

::: warning Critical Configuration
**`ice.storage.path` (or storagePath in constructor) must share the same directory with Server!**
:::

### Local Development

```yaml
# Server and Client configure the same local path
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

Use shared storage (NFS, cloud drives, etc.):

```yaml
services:
  ice-server:
    volumes:
      - /nfs/ice-data:/app/ice-data

  client-1:
    volumes:
      - /nfs/ice-data:/app/ice-data

  client-2:
    volumes:
      - /nfs/ice-data:/app/ice-data
```

## Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `app` | int | - | Application ID, required |
| `storage.path` | string | - | Shared storage path, required |
| `scan` | string | all | Leaf node scan packages, comma-separated |
| `poll-interval` | int | 5 | Version polling interval (seconds) |
| `heartbeat-interval` | int | 10 | Heartbeat report interval (seconds) |
| `pool.parallelism` | int | -1 | Thread pool parallelism, ≤0 uses default |

## Next Steps

- 📖 [Leaf Node Development](/en/guide/detail.html#node-development) - Learn about Flow/Result/None nodes
- 🏗️ [Architecture Overview](/en/guide/architecture.html) - Understand Server/Client architecture
- 🐹 [Go SDK Guide](/en/guide/go-sdk.html) - Go language integration guide
- ❓ [FAQ](/en/guide/qa.html) - Solve integration issues

