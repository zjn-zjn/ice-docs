---
title: Ice Client SDK Integration Guide
description: Detailed guide on how to integrate Ice Client SDK into your business applications, including Java, Go, and Python multi-language integration.
keywords: Client SDK,integration guide,ice-core,Java integration,Go SDK,Python SDK
head:
  - - meta
    - property: og:title
      content: Ice Client SDK Integration Guide
  - - meta
    - property: og:description
      content: Detailed guide on how to integrate Ice Client SDK into your business applications.
---

# Ice Client SDK Integration Guide

> Complete integration reference for Ice Client, including all constructor parameters and Spring integration

::: tip Quick Start
If you just want to get running quickly, start with the [Getting Started Guide](/en/guide/getting-started.html). This page is a detailed reference.
:::

## Dependency

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>3.0.2</version>
</dependency>
```

Other languages: [Go SDK Guide](/en/guide/go-sdk.html) · [Python SDK Guide](/en/guide/python-sdk.html)

## Initialize Client

Simplest approach with three required parameters:

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID
    "./ice-data",         // shared storage path
    "com.your.package"    // leaf node scan package
);
client.start();
client.waitStarted();
```

For more customization:

```java
IceFileClient client = new IceFileClient(
    1,                              // app ID
    "./ice-data",                   // shared storage path
    -1,                             // parallelism (≤0 uses default ForkJoinPool)
    Set.of("com.your.package"),     // scan packages set
    5,                              // version poll interval (seconds)
    10                              // heartbeat interval (seconds)
);
```

Convenience constructor with swimlane:

```java
IceFileClient client = IceFileClient.newWithLane(
    1, "./ice-data", "com.your.package", "feature-xxx"
);
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `app` | int | Yes | - | Application ID, matches the App created in Server |
| `storagePath` | String | Yes | - | Shared storage path, must be same directory as Server |
| `scan` | String | Yes | - | Leaf node scan packages, comma-separated |
| `parallelism` | int | No | -1 | Thread pool parallelism, ≤0 uses default |
| `pollInterval` | int | No | 5 | Version polling interval (seconds) |
| `heartbeatInterval` | int | No | 10 | Heartbeat report interval (seconds) |
| `lane` | String | No | empty | Swimlane name, empty means main trunk |

## Spring Project Integration (Optional)

If leaf nodes need `@Autowired` Spring Bean injection, bridge the Spring container to Ice at startup:

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

Non-Spring projects can skip this - just use `new IceFileClient(...)` directly.

## Shared Storage

Server and Client must access the same `ice-data` directory.

| Scenario | Solution |
|----------|----------|
| Local development | Same local path for Server and Client |
| Docker | Mount the same host directory via `-v` to each container |
| Distributed | NFS / AWS EFS / Azure Files |

## Execute Rules

```java
IcePack pack = new IcePack();
pack.setIceId(1L);

IceRoam roam = new IceRoam();
roam.put("uid", userId);
pack.setRoam(roam);

Ice.syncProcess(pack);

Object result = roam.get("RESULT_KEY");
```

## Next Steps

- 📖 [Leaf Node Development](/en/guide/detail.html#node-development) - Learn about Flow/Result/None nodes
- 🏗️ [Architecture Overview](/en/guide/architecture.html) - Understand Server/Client architecture
- ❓ [FAQ](/en/guide/qa.html) - Solve integration issues
