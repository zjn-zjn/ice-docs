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
- **Shared Storage**: Server and Client sync configurations through a shared file directory

## Step 1: Deploy Ice Server

### Docker Deployment (Recommended)

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

After startup, visit **http://localhost:8121** to access the management UI.

Online demo: [http://eg.waitmoon.com](http://eg.waitmoon.com)

### Manual Deployment

Download the package for your platform from [https://waitmoon.com/downloads/3.0.1/](https://waitmoon.com/downloads/3.0.1/), extract and run:

```bash
tar -xzvf ice-server-linux-amd64.tar.gz && cd ice-server-linux-amd64
sh ice.sh start
```

## Step 2: Integrate Ice Client SDK

### Java

**Add Dependency**

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>3.0.2</version>
</dependency>
```

**Start Client**

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID (matches the App created in Server)
    "./ice-data",         // shared storage path (must point to the same directory as Server)
    "com.your.package"    // package path where leaf nodes are located
);
client.start();
```

**Spring Project Integration**

For Spring/SpringBoot projects, add a configuration class to enable automatic Spring Bean injection in leaf nodes:

```java
@Configuration
public class IceConfig implements ApplicationContextAware {

    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        AutowireCapableBeanFactory bf = ctx.getAutowireCapableBeanFactory();
        IceBeanUtils.setFactory(new IceBeanUtils.IceBeanFactory() {
            @Override
            public void autowireBean(Object bean) { bf.autowireBean(bean); }
            @Override
            public boolean containsBean(String name) { return ctx.containsBean(name); }
            @Override
            public Object getBean(String name) { return ctx.getBean(name); }
        });
    }

    @Bean(destroyMethod = "destroy")
    public IceFileClient iceFileClient() throws Exception {
        IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");
        client.start();
        return client;
    }
}
```

> For more constructor parameters (parallelism, poll interval, swimlane, etc.) see [Client SDK Guide](/en/guide/client-integration.html)

### Go

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

See [Go SDK Guide](/en/guide/go-sdk.html) for details.

### Python

```bash
pip install ice-rules
```

See [Python SDK Guide](/en/guide/python-sdk.html) for details.

## Step 3: Develop Leaf Nodes (Java Example)

Leaf nodes are where business logic actually executes. Extend the corresponding base class and place them under the scan package:

| Type | Base Class | Return | Purpose |
|------|------------|--------|---------|
| **Flow** | `BaseLeafRoamFlow` | true/false | Condition checks |
| **Result** | `BaseLeafRoamResult` | true/false | Business execution |
| **None** | `BaseLeafRoamNone` | none | Helper operations (logging, queries, etc.) |

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult {

    private String key;      // Configurable in Server UI
    private double value;    // Configurable in Server UI

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

> Fields in the class (like `key`, `value`) automatically appear in the Server configuration UI - operators can modify them without code changes.

## Step 4: Configure and Execute Rules

### Configure in Server

Visit http://localhost:8121:

1. Create an Application (App)
2. Create a new Rule (Ice)
3. Drag leaf nodes into the rule tree and configure parameters
4. Click **Publish**

### Trigger in Code

```java
IcePack pack = new IcePack();
pack.setIceId(1L);

IceRoam roam = new IceRoam();
roam.put("uid", 12345);
pack.setRoam(roam);

Ice.syncProcess(pack);
```

## Shared Storage

Server and Client must access the same `ice-data` directory:

| Scenario | Solution |
|----------|----------|
| Local development | Same local path |
| Docker | Mount the same host directory via `-v` |
| Distributed | NFS / AWS EFS / Azure Files |

## Next Steps

- 📖 [Client SDK Guide](/en/guide/client-integration.html) - Full constructor parameters
- 📖 [Detailed Documentation](/en/guide/detail.html) - Deep dive into node types and configuration
- 🐹 [Go SDK Guide](/en/guide/go-sdk.html) · 🐍 [Python SDK Guide](/en/guide/python-sdk.html)
- 🏗️ [Architecture Design](/en/advanced/architecture.html) · 🎥 [Video Tutorial](https://www.bilibili.com/video/BV1Q34y1R7KF)

## FAQ

**Client not loading configuration?** Check if storagePath points to the same directory as Server.

**Rule changes not taking effect?** Make sure you clicked "Publish" in Server.

👉 [More Questions](/en/guide/qa.html)
