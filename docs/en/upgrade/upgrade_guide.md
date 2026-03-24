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

## 4.0.6 → 4.0.7

### Server Bug Fix

- Fixed import not updating ID counters, recommend upgrading Server promptly
- No SDK changes, no code modifications needed

---

## 4.0.5 → 4.0.6

### Logging System Changes

**Go SDK (Breaking Change)**:
- `ice.SetLogger()` parameter changed from custom `Logger` interface to `*slog.Logger`
- If you implemented a custom Logger, migrate to implementing `slog.Handler` instead
- Migration: `ice.SetLogger(slog.New(myHandler))`

**Python SDK (Breaking Change)**:
- Removed `ice.Logger` class and `ice.set_logger()` function
- Use standard `logging` module: `logging.getLogger("ice").addHandler(myHandler)`

**Java SDK**:
- No breaking changes, only log message wording updates

---

## v4.0.4 → v4.0.5 Roam API Simplification

### Changes

- **Removed `IceMeta` class**: Metadata stored directly under `_ice` key as plain Map/dict, no more `getIceMeta()` intermediate call
- **Removed `Ice` prefix from Roam meta methods**: All three SDKs updated simultaneously

### Breaking Change: Roam meta method rename

| Language | Search | Replace with |
|----------|--------|-------------|
| Java | `getIceMeta().setId(` | `setId(` |
| Java | `getIceMeta().setScene(` | `setScene(` |
| Java | `getIceMeta().setNid(` | `setNid(` |
| Java | `getIceMeta().getId()` | `getId()` |
| Java | `getIceMeta().getScene()` | `getScene()` |
| Java | `getIceMeta().getProcess()` | `getProcess()` |
| Go | `GetIceId()` | `GetId()` |
| Go | `GetIceScene()` | `GetScene()` |
| Go | `GetIceProcess()` | `GetProcess()` |
| Go | `SetIceId(` | `SetId(` |
| Go | `SetIceScene(` | `SetScene(` |
| Go | `NewRoam("scene")` | `NewRoam()` + `SetScene("scene")` |
| Python | `get_ice_id()` | `get_id()` |
| Python | `get_ice_scene()` | `get_scene()` |
| Python | `set_ice_id(` | `set_id(` |
| Python | `set_ice_scene(` | `set_scene(` |

### Version Upgrade

**Java SDK**

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>4.0.5</version>
</dependency>
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.2.3
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

**Server**

```bash
docker pull waitmoon/ice-server:4.0.5
```

Or download from [https://waitmoon.com/downloads/4.0.5/](https://waitmoon.com/downloads/4.0.5/).

---

## v3.0.2 → v4.0.0 Pack Removal + API Unification + Mock Execution 🚀

This is a major upgrade involving **5 breaking changes** — all leaf node code requires modification. Plan sufficient time and follow the steps below to migrate systematically.

### Change Overview

| Change | Scope | Action |
|--------|-------|--------|
| Pack/Context removed | All leaf nodes using Pack | Migrate to Roam |
| Leaf base classes simplified (9→3) | All leaf nodes | Global replace base classes and methods |
| Roam API renamed | Code using getMulti/putMulti/getUnion | Global replace method names |
| priority field removed | Configs using priority | Remove related logic |
| `_ice` reserved key | Business data using `_ice` key | Rename the key |

### Upgrade Steps

#### Breaking Change 1: Pack/Context Fully Removed

`IcePack` (Java), `Pack` (Go/Python) and `IceContext` have been removed. All leaf node methods now receive only `Roam`. If you previously used `BaseLeafPackFlow` or other Pack-based base classes, migrate all Pack data access to Roam.

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
// ❌ Old code (3.x) — Pack base class
public class ScoreFlow extends BaseLeafPackFlow {
    @Override
    protected boolean doPackFlow(IcePack pack) {
        IceRoam roam = pack.getRoam();
        return (double) roam.get("score") >= threshold;
    }
}

// ❌ Old code (3.x) — Roam base class
public class ScoreFlow extends BaseLeafRoamFlow {
    @Override
    protected boolean doRoamFlow(IceRoam roam) {
        return (double) roam.get("score") >= threshold;
    }
}

// ✅ New code (4.0.0)
public class ScoreFlow extends BaseLeafFlow {
    @Override
    protected boolean doFlow(IceRoam roam) {
        return (double) roam.get("score") >= threshold;
    }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
// ❌ Old code (3.x)
func (s *ScoreFlow) DoRoamFlow(ctx context.Context, roam *icecontext.Roam) bool {
    value := roam.Value(s.Key).Float64Or(0)
    return value >= s.Score
}

// ✅ New code (4.0.0)
func (s *ScoreFlow) DoFlow(ctx context.Context, roam *icecontext.Roam) bool {
    value := roam.Value(s.Key).Float64Or(0)
    return value >= s.Score
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
# ❌ Old code (3.x)
def do_roam_flow(self, roam):
    value = roam.get(self.key, 0.0)
    return value >= self.score

# ✅ New code (4.0.0)
def do_flow(self, roam):
    value = roam.get(self.key, 0.0)
    return value >= self.score
```

  </CodeGroupItem>
</CodeGroup>

#### Breaking Change 2: Leaf Node Base Class and Method Global Replace

All leaf node base classes and method names must be replaced. Use your IDE's global find-and-replace:

**Base class replacement:**

| Language | Search | Replace with |
|----------|--------|-------------|
| Java | `BaseLeafRoamFlow` | `BaseLeafFlow` |
| Java | `BaseLeafPackFlow` | `BaseLeafFlow` |
| Java | `BaseLeafRoamResult` | `BaseLeafResult` |
| Java | `BaseLeafPackResult` | `BaseLeafResult` |
| Java | `BaseLeafRoamNone` | `BaseLeafNone` |
| Java | `BaseLeafPackNone` | `BaseLeafNone` |

**Method replacement:**

| Language | Search | Replace with |
|----------|--------|-------------|
| Java | `doRoamFlow` | `doFlow` |
| Java | `doPackFlow` | `doFlow` |
| Java | `doRoamResult` | `doResult` |
| Java | `doPackResult` | `doResult` |
| Java | `doRoamNone` | `doNone` |
| Java | `doPackNone` | `doNone` |
| Go | `DoRoamFlow` | `DoFlow` |
| Go | `DoPackFlow` | `DoFlow` |
| Go | `DoRoamResult` | `DoResult` |
| Go | `DoPackResult` | `DoResult` |
| Go | `DoRoamNone` | `DoNone` |
| Go | `DoPackNone` | `DoNone` |
| Python | `do_roam_flow` | `do_flow` |
| Python | `do_pack_flow` | `do_flow` |
| Python | `do_roam_result` | `do_result` |
| Python | `do_pack_result` | `do_result` |
| Python | `do_roam_none` | `do_none` |
| Python | `do_pack_none` | `do_none` |

#### Breaking Change 3: Roam API Method Global Replace

| Language | Search | Replace with |
|----------|--------|-------------|
| Java | `getMulti(` | `getDeep(` |
| Java | `putMulti(` | `putDeep(` |
| Java | `getUnion(` | `resolve(` |
| Go | `GetMulti(` | `GetDeep(` |
| Go | `PutMulti(` | `PutDeep(` |
| Go | `GetUnion(` | `Resolve(` |
| Go | `ValueMulti(` | `ValueDeep(` |
| Python | `get_multi(` | `get_deep(` |
| Python | `put_multi(` | `put_deep(` |
| Python | `get_union(` | `resolve(` |

#### Breaking Change 4: `priority` Field Removed

If your code or configuration data uses the `priority` field, remove the related logic. Node execution order is determined by the tree structure.

#### Breaking Change 5: `_ice` is a Reserved Roam Key

The `_ice` key stores execution metadata (IceMeta) and must not be used for business data. If your Roam uses `_ice` as a business key, rename it.

#### Default Value Changes

The following defaults have changed. If your environment relies on old defaults, you may need to set them explicitly after upgrading:

| Configuration | Old Default | New Default |
|---------------|------------|------------|
| Poll interval (poll-interval) | 5s | 2s |
| Heartbeat interval (heartbeat-interval) | 30s | 10s |
| Client timeout (client-timeout) | 60s | 30s |

#### New Features (No Migration Needed)

- **Mock Execution**: New Mock button in Web UI for remote debugging. Client SDKs have built-in polling, no extra configuration needed
- **Roam Key Scanning**: Automatically extracts roam key metadata from leaf nodes for Mock form field generation
- **IceMeta**: Execution metadata stored under the reserved `_ice` key
- **Client File Split**: `m_{addr}.json` (metadata) + `b_{addr}.json` (heartbeat)
- **List Index Traversal**: `getDeep("items.0.name")` supports list element access

### Version Upgrade

**Java SDK**

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>4.0.0</version>
</dependency>
```

**Go SDK**

```bash
go get github.com/zjn-zjn/ice/sdks/go@v1.2.1
```

**Python SDK**

```bash
pip install --upgrade ice-rules
```

**Server**

```bash
docker pull waitmoon/ice-server:4.0.5
```

Or download the platform-specific package from [https://waitmoon.com/downloads/4.0.5/](https://waitmoon.com/downloads/4.0.5/).

---

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
