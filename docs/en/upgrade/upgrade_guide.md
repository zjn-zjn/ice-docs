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

## v3.0.1 → v3.0.2 Client Optimization 🔧

### Changes

- **Client Address Simplified**: Address format shortened from `IP/app/xxxxxxxxxxx` to `IP_xxxxx`
- **IP Detection Unified**: Java/Python/Go SDK unified to use network interface iteration for non-loopback IPv4
- **Spring Boot Starter Removed**: Removed `ice-spring-boot-starter-2x` and `ice-spring-boot-starter-3x`, all Java projects now use `ice-core` directly

### Upgrade Steps

Server does not need updating, only upgrade Client SDK.

**Java SDK**

Replace `ice-spring-boot-starter-2x` / `ice-spring-boot-starter-3x` with `ice-core`:

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>3.0.2</version>
</dependency>
```

Remove `ice.*` configuration from `application.yml`, initialize Client in code instead:

```java
IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");
client.start();
```

For Spring projects, set up `IceBeanUtils` to enable bean injection in leaf nodes:

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

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.1.1
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

---

## v3.0.0 → v3.0.1 Server Optimization 🔧

### Changes

- **Server Code Restructured**: Reorganized server code into sub-packages for better maintainability
- **Folder Operations**: Added folder operation support
- **Dirty Checking**: Added dirty checking mechanism with unsaved changes prompt
- **UI Optimization**: Multiple interface interaction and display improvements

### Upgrade Steps

**Docker Users (No Changes Needed)**

```bash
docker pull waitmoon/ice-server:3.0.1
```

**Manual Deployment Users**

Download from [https://waitmoon.com/downloads/3.0.1/](https://waitmoon.com/downloads/3.0.1/)

**Java SDK**

```xml
<version>3.0.1</version>
```

---

## v2.1.x → v3.0.0 Server Rewritten in Go 🚀

### Changes

- **Server rewritten from Java to Go**: Single binary deployment, no JDK required
- **Multi-platform pre-built binaries**: Linux/macOS/Windows (amd64/arm64)
- **SDK version bump**: No functional changes, version numbers unified to 3.0.0
- **Full data compatibility**: File storage format unchanged, no migration needed

### Upgrade Steps

**Docker Users (No Changes Needed)**

```bash
docker pull waitmoon/ice-server:3.0.0
```

**Manual Deployment Users**

Download the appropriate platform package from [https://waitmoon.com/downloads/3.0.0/](https://waitmoon.com/downloads/3.0.0/):

```bash
# Linux amd64
tar -xzvf ice-server-3.0.0-linux-amd64.tar.gz
cd ice-server
sh ice.sh start

# macOS arm64 (Apple Silicon)
tar -xzvf ice-server-3.0.0-darwin-arm64.tar.gz
cd ice-server
sh ice.sh start
```

**Java SDK**

```xml
<version>3.0.0</version>
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.1.0
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

---

## v2.1.2 → v2.1.3

### Changes

- **Forward node display enhancement**: Forward nodes now use purple with ◀ arrow prefix, clearly distinguished from editing nodes (orange dashed border)
- **Color scheme optimization**: Unified node status colors — forward purple, editing orange dashed, unregistered gray

### Upgrade Steps

Replace ice-server jar or Docker image. No client SDK changes needed.

```bash
docker pull waitmoon/ice-server:2.1.3
```

Manual package: `https://waitmoon.com/downloads/ice-server-2.1.3.tar.gz`

---

## v2.1.0 → v2.1.2

### Changes

- **Optimize node-meta API response**: Remove redundant `classes` field from `ClientInfo`, reducing network payload and server overhead when switching lanes/addresses

### Upgrade Steps

Replace ice-server jar or Docker image. No client SDK changes needed.

```bash
docker pull waitmoon/ice-server:2.1.2
```

Manual package: `https://waitmoon.com/downloads/ice-server-2.1.2.tar.gz`

---

## v2.0.8 → v2.1.0

### Changes

- **Server UI / editor UX**: more accurate change detection in node editor (A→B→A is treated as no-op), and clearer “unregistered node” styling when switching trunk/lane/client address
- **Node metadata**: new `node-meta` API for lane/client discovery and leaf class metadata (field definitions, etc.)
- **Batch export & base utilities**: batch export and base creation improvements

### Upgrade Steps

Upgrade Server first, then Client SDK (if needed).

```bash
docker pull waitmoon/ice-server:2.1.0
```

Manual package: `https://waitmoon.com/downloads/ice-server-2.1.0.tar.gz`

---

## v2.0.7 → v2.0.8

### Changes

- **Fix lane `_latest.json` deletion**: Cleanup task no longer unconditionally deletes `_latest.json` in lane directories. Only cleans when no client files remain.

### Upgrade Steps

Replace ice-server jar or Docker image. No client SDK changes needed.

```bash
docker pull waitmoon/ice-server:2.0.8
```

---

## v2.0.1 → v2.0.6

### Changes

- **Swimlane (Lane) support**: Clients can register under a named lane for isolated node metadata
- **Server UI**: Lane selector added to the configuration detail page toolbar
- **Search fix**: Fixed leaf node class search not working in the dropdown

### Upgrade Steps

**Java SDK**

Update version:

```xml
<version>2.0.6</version>
```

To use swimlane, add to `application.yml`:

```yaml
ice:
  lane: feature-xxx  # Lane name, omit for main trunk
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.0.6
```

With lane:

```go
client, err := ice.NewClientWithOptions(
    1, "./ice-data", -1,
    5*time.Second, 10*time.Second,
    "feature-xxx",  // lane name, "" for main trunk
)
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

With lane:

```python
client = ice.FileClient(app=1, storage_path="./ice-data", lane="feature-xxx")
```

**Ice Server**

Download latest [ice-server-2.0.6.tar.gz](https://waitmoon.com/downloads/ice-server-2.0.6.tar.gz), replace jar and restart.

---

## v2.0.0 → v2.0.1

### Changes

- **Repository Path**: GitHub repository unified to `github.com/zjn-zjn/ice`
- **Go SDK**: Module path updated to `github.com/zjn-zjn/ice/sdks/go`, version v1.0.3
- **Code Standards**: Java SDK comments unified to English

### Upgrade Steps

**Java SDK**

No code changes required, simply update version:

```xml
<version>2.0.1</version>
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.0.3
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

---

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

## v1.0.1→v1.0.3/v1.0.3

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
