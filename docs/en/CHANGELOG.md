---
title: Ice Rule Engine Changelog - Version History
description: Ice rule engine version update history, including new features, performance optimizations, bug fixes and detailed change records.
keywords: changelog,version history,Ice versions,rule engine updates,release notes
head:
  - - meta
    - property: og:title
      content: Ice Rule Engine Changelog - Version History
  - - meta
    - property: og:description
      content: Complete version update history of Ice rule engine.
---

# Ice Rule Engine Changelog

> Recording feature updates, performance optimizations and bug fixes for each version of Ice rule engine

## [4.0.4](https://github.com/zjn-zjn/ice/compare/v4.0.3...v4.0.4) (2026-03)

**Web UI Export Feature Completion**

- Added "Export" button in multi-select mode for batch exporting selected Rules
- Added "Export" option in folder context menu to export all Rules under a folder
- Exported JSON arrays can be directly batch-imported via the import feature

### Version Info

| Component | Version |
|-----------|---------|
| ice-server | 4.0.4 |

---

## [4.0.3](https://github.com/zjn-zjn/ice/compare/v4.0.1...v4.0.3) (2026-03)

**Web UI Fixes & Improvements**

- Fix NONE type child node create button being disabled (JS falsy `0` bug)
- Fix Mock result selector fallback not persisting
- Mock result ts/trace tags now support one-click copy
- Breadcrumb nav Popover properly destroyed on hide

### Version Info

| Component | Version |
|-----------|---------|
| ice-server | 4.0.3 |

---

## [4.0.1](https://github.com/zjn-zjn/ice/compare/v4.0.0...v4.0.1) (2026-03)

**Go SDK RoamValue Type Conversion Enhancement**

- RoamValue type conversion now uses `spf13/cast` for broader type support (json.Number, uint variants, etc.)
- Added error-returning variants: `StringE()`, `IntE()`, `Int64E()`, `Float64E()`, `BoolE()`

### Version Info

| Component | Version |
|-----------|---------|
| Go SDK | v1.2.1 |
| ice-server | 4.0.1 |

---

## [4.0.0](https://github.com/zjn-zjn/ice/compare/v3.0.2...v4.0.0) (2026-03) 🚀

**Ice Rule Engine 4.0.0 — Pack/Context Removal, API Unification, Mock Execution**

4.0.0 is a major API simplification for Ice. The Pack and Context layers have been completely removed — all data flows through a single `Roam`; leaf node base classes are reduced from 9 to 3; multi-level key and reference syntax methods are all renamed; and Mock execution is added for remote rule debugging from the Web UI.

### New Features

#### Pack/Context Fully Removed, Roam Unified Data Layer

Removed `IcePack` (Java) / `Pack` (Go) / `Pack` (Python) and the `IceContext` layer. All leaf node methods now receive only `Roam` as the data container. The previous two-tier Pack+Roam structure has been simplified to a single Roam.

```java
// Old code (3.x)
public class ScoreFlow extends BaseLeafRoamFlow {
    @Override
    protected boolean doRoamFlow(IceRoam roam) {
        return roam.get("score") >= threshold;
    }
}

// New code (4.0.0)
public class ScoreFlow extends BaseLeafFlow {
    @Override
    protected boolean doFlow(IceRoam roam) {
        return roam.get("score") >= threshold;
    }
}
```

#### Leaf Node Base Class Simplification (9 → 3)

Removed Roam/Pack level base class variants, unified to a single base class per leaf node type with simplified method signatures:

**Base class rename:**

| Language | Old Name | New Name |
|----------|----------|----------|
| Java | `BaseLeafRoamFlow` / `BaseLeafPackFlow` | `BaseLeafFlow` |
| Java | `BaseLeafRoamResult` / `BaseLeafPackResult` | `BaseLeafResult` |
| Java | `BaseLeafRoamNone` / `BaseLeafPackNone` | `BaseLeafNone` |

**Method rename:**

| Language | Old Method | New Method |
|----------|-----------|-----------|
| Java | `doRoamFlow` / `doPackFlow` | `doFlow` |
| Java | `doRoamResult` / `doPackResult` | `doResult` |
| Java | `doRoamNone` / `doPackNone` | `doNone` |
| Go | `DoRoamFlow` / `DoPackFlow` | `DoFlow` |
| Go | `DoRoamResult` / `DoPackResult` | `DoResult` |
| Go | `DoRoamNone` / `DoPackNone` | `DoNone` |
| Python | `do_roam_flow` / `do_pack_flow` | `do_flow` |
| Python | `do_roam_result` / `do_pack_result` | `do_result` |
| Python | `do_roam_none` / `do_pack_none` | `do_none` |

#### Roam API Rename

Multi-level key and reference syntax methods renamed for clearer semantics:

| Language | Old Name | New Name | Description |
|----------|----------|----------|-------------|
| Java | `getMulti` / `putMulti` | `getDeep` / `putDeep` | Multi-level key read/write |
| Java | `getUnion` | `resolve` | Reference syntax resolution |
| Go | `GetMulti` / `PutMulti` | `GetDeep` / `PutDeep` | Multi-level key read/write |
| Go | `GetUnion` | `Resolve` | Reference syntax resolution |
| Go | `ValueMulti` | `ValueDeep` | Multi-level key fluent API |
| Python | `get_multi` / `put_multi` | `get_deep` / `put_deep` | Multi-level key read/write |
| Python | `get_union` | `resolve` | Reference syntax resolution |

#### Mock Execution

New mock execution feature — send mock requests from the Server Web UI, have a designated Client execute the rules locally, and return the full result.

- **File System Communication**: Consistent with existing config sync, communicates via shared storage directory, no additional network connections needed
- **All SDKs Supported**: Java, Go, Python Client SDKs all have built-in mock polling, no extra configuration needed
- **Web UI**: New Mock button on detail page, supporting form/JSON input modes for Roam parameters
- **Execution Result Visualization**: Returns process execution flow and roam result data, executed nodes highlighted in yellow on tree graph
- **Target Selection**: Supports specifying client address (`address:xxx`), swimlane (`lane:xxx`), or automatic selection (`all`)

#### Roam Key Static Scanning

Multi-language static analysis tools that automatically extract roam key access metadata from leaf node methods, powering the Mock form auto-generation:

- **Java**: ASM bytecode analysis, automatically available after compilation
- **Go**: `go/ast` analysis, via `ice-scan` CLI tool for code generation
- **Python**: `ast` module analysis, scans automatically at runtime

#### IceMeta Execution Metadata

Execution metadata stored under the reserved `_ice` key in Roam (`_ice` must not be used for business data):

| Field | Description |
|-------|-------------|
| `id` | Rule ID |
| `scene` | Scene identifier |
| `nid` | Configuration ID |
| `ts` | Timestamp |
| `trace` | Trace identifier |
| `type` | Request type |
| `debug` | Debug flag |
| `process` | Execution process log |

#### Client File Format Split

Single client JSON file split into two independent files, reducing high-frequency heartbeat I/O contention with metadata:

| File | Content | Write Frequency |
|------|---------|-----------------|
| `m_{addr}.json` | Metadata (registered classes, roam key scan results) | On startup + on change |
| `b_{addr}.json` | Heartbeat (timestamp) | Every 10 seconds |

#### getDeep/putDeep List Index Traversal

e.g. `getDeep("items.0.name")`, supports accessing list elements via numeric index (read-only traversal; putDeep does not create lists).

### Optimization

- **Default poll interval changed**: From 5s to 2s, faster config change response
- **Default heartbeat interval changed**: From 30s to 10s, more responsive client status detection
- **Default client timeout changed**: From 60s to 30s, faster offline detection
- **Import API enhanced**: Supports JSON array batch import for multiple rules

### Breaking Changes

1. **Pack/Context removed**: `IcePack`, `IceContext` and their Go/Python counterparts are removed. If your code uses Pack (e.g. `BaseLeafPackFlow`, `doPackFlow`), migrate all Pack-related code to use Roam
2. **Leaf node base class simplification**: `BaseLeafPack*` and `BaseLeafRoam*` hierarchy fully removed, unified to `BaseLeafFlow` / `BaseLeafResult` / `BaseLeafNone`, method names simplified (e.g. `doRoamFlow` → `doFlow`)
3. **Roam API renamed**: `getMulti`→`getDeep`, `putMulti`→`putDeep`, `getUnion`→`resolve`, requires global replacement
4. **`priority` field removed**: Nodes no longer support `priority` ordering, remove if used
5. **`_ice` is a reserved Roam key**: Must not be used for business data storage

### Version Info

| Component | Version |
|-----------|---------|
| Java SDK | 4.0.0 |
| Go SDK | v1.2.0 |
| Python SDK | 4.0.0 |
| ice-server | 4.0.0 |

---

## [3.0.2](https://github.com/zjn-zjn/ice/compare/v3.0.1...v3.0.2) (2026-03)

**Ice Rule Engine 3.0.2 - Client Address Optimization & Starter Removal**

### 🔧 Optimization

- **Client Address Simplified**: Address format shortened from `IP/app/xxxxxxxxxxx` to `IP_xxxxx`
- **IP Detection Unified**: Java/Python/Go SDK unified to use network interface iteration for non-loopback IPv4

### 📦 Starter Removed

- **Removed `ice-spring-boot-starter-2x` and `ice-spring-boot-starter-3x`**: Use `ice-core` directly for all Java projects
- **Spring Integration**: For Spring/SpringBoot projects, use `IceBeanUtils.setFactory()` to enable bean injection

---

## [3.0.1](https://github.com/zjn-zjn/ice/compare/v3.0.0...v3.0.1) (2026-03)

**Ice Rule Engine 3.0.1 - Server Optimization**

### 🔧 Optimization

- **Server Code Restructured**: Reorganized server code into sub-packages for better maintainability
- **Folder Operations**: Added folder operation support
- **Dirty Checking**: Added dirty checking mechanism with unsaved changes prompt
- **UI Optimization**: Multiple interface interaction and display improvements

---

## [3.0.0](https://github.com/zjn-zjn/ice/compare/v2.1.3...v3.0.0) (2026-03) 🚀

**Ice Rule Engine 3.0.0 - Server Rewritten in Go**

### 🎯 Core Changes

Server completely rewritten from Java (Spring Boot) to Go. Single binary deployment, no JDK required.

#### 🔧 Server Rewrite
- ✅ **Go Rewrite**: Server rewritten in Go for better performance and simpler deployment
- ✅ **Single Binary**: Frontend embedded via Go embed, no additional web server needed
- ✅ **Multi-platform Binaries**: Pre-built binaries for Linux/macOS/Windows (amd64/arm64)
- ✅ **Docker Image Unchanged**: `waitmoon/ice-server:3.0.0`, fully compatible

#### 📦 SDK Version Bump
- Java SDK: 3.0.0 (no functional changes, version bump only)
- Go SDK: v1.1.0
- Python SDK: 3.0.0

### ⚠️ Upgrade Notes

- **No SDK Code Changes**: Version bump only, drop-in replacement
- **Server Deployment Change**: Manual deployment now uses Go binary instead of jar, with multi-platform downloads
- **Docker Users**: No changes needed, same image name and usage
- **Full Data Compatibility**: File storage format unchanged, no data migration needed

### 📋 Version Info

| Component | Version |
|-----------|---------|
| Java SDK | 3.0.0 |
| Go SDK | v1.1.0 |
| Python SDK | 3.0.0 |
| ice-server | 3.0.0 |

---

## [2.1.3](https://github.com/zjn-zjn/ice/compare/v2.1.2...v2.1.3) (2026-03)

**Ice Rule Engine 2.1.3 - Forward Node Display Enhancement**

### 🎨 Enhancement

- **Forward node visual improvement**: Forward nodes now use purple (#722ed1) with ◀ arrow prefix, clearly distinguished from editing nodes (orange dashed border)
- **Color scheme optimization**: Unified node status colors — forward nodes purple, editing nodes orange dashed, unregistered nodes gray

---

## [2.1.2](https://github.com/zjn-zjn/ice/compare/v2.1.0...v2.1.2) (2026-03)

**Ice Rule Engine 2.1.2 - node-meta API optimization**

### 🔧 Optimization

- **Reduce redundant data**: Remove `classes` field from `ClientInfo`, no longer returns full registered class names for each client when switching lanes/addresses

---

## [2.1.0](https://github.com/zjn-zjn/ice/compare/v2.0.8...v2.1.0) (2026-03)

**Ice Rule Engine 2.1.0 - Editor UX and Node Metadata Enhancements**

### ✨ New Features

- **Node metadata**: new `node-meta` API for trunk/lane/client discovery and leaf class metadata
- **Editing experience**: more accurate change detection (A→B→A treated as no-op) and clearer unregistered-node styling
- **Batch utilities**: batch export and base creation improvements

### 🐞 Fixes

- Fix lane `_latest.json` accidental deletion

---

## [2.0.6](https://github.com/zjn-zjn/ice/compare/2.0.1...2.0.6) (2026-03) 🏊

**Ice Rule Engine 2.0.6 - Swimlane Support**

### ✨ New Features

#### 🏊 Swimlane Isolation

Clients can now register under a swimlane. Different swimlanes have isolated node info, preventing node metadata conflicts across development branches.

**Client configuration:**
```yaml
ice:
  app: 1
  storage:
    path: ./ice-data
  lane: feature-xxx  # Swimlane name, omit for main trunk
```

**Directory structure:**
```
clients/{app}/              ← Main trunk clients (unchanged)
clients/{app}/lane/{name}/  ← Swimlane clients (new)
```

**Server UI:** A swimlane selector in the detail page toolbar lets you view leaf nodes from the main trunk or a specific swimlane (merged, swimlane overrides main trunk).

**All SDKs:** Java, Go, and Python SDKs all support the swimlane parameter.

### 🔧 Improvements

* 🔍 **Node search fix** - Fixed leaf node search not working in the dropdown
* 🧹 **Auto-cleanup** - Empty swimlane directories are automatically removed when all clients expire

### 📋 Version Info

| Component | Version |
|-----------|---------|
| Java SDK | 2.0.6 |
| Go SDK | v1.0.6 |
| Python SDK | 2.0.6 |
| ice-server | 2.0.6 |

---

## [2.0.1](https://github.com/zjn-zjn/ice/compare/2.0.0...2.0.1) (2025-12) ✨

**Ice Rule Engine 2.0.1 - Multi-language SDK Official Release**

### 🌐 Multi-language SDK

This version officially releases Go and Python SDKs with full feature parity to Java SDK:

```bash
# Go
go get github.com/zjn-zjn/ice/sdks/go

# Python
pip install ice-rules
```

### ✨ New Features

#### 📝 Field Description Enhancement

All three languages support field descriptions for friendly UI display:

| Language | Method | Example |
|----------|--------|---------|
| **Java** | `@IceField` annotation | `@IceField(name="Score", desc="Threshold") double score;` |
| **Go** | `ice` struct tag | `Score float64 \`ice:"name:Score,desc:Threshold"\`` |
| **Python** | `Annotated` + `IceField` | `score: Annotated[float, IceField(name="Score")]` |

#### 🏷️ Leaf Node Alias

Support multi-language compatible configuration with class name mapping:

```java
// Java
@IceNode(alias = {"score_flow"})
public class ScoreFlow extends BaseLeafFlow { }
```

```go
// Go
ice.RegisterLeaf("com.example.ScoreFlow",
    &ice.LeafMeta{Alias: []string{"score_flow"}},
    func() any { return &ScoreFlow{} })
```

```python
# Python
@ice.leaf("com.example.ScoreFlow", alias=["score_flow"])
class ScoreFlow: ...
```

#### 🚫 Field Ignore

Fields that should not be configurable can be ignored:

| Language | Method |
|----------|--------|
| **Java** | `@IceIgnore` |
| **Go** | `json:"-"` or `ice:"-"` |
| **Python** | `_` prefix or `Annotated[..., IceIgnore()]` |

### 🔧 Optimizations

* 📦 **Monorepo Project Structure**: Unified management of Java/Go/Python SDKs
* ⚡ **Hot-reload Optimization**: More stable incremental updates
* 🐛 **Bug Fixes**: Fixed multiple edge cases

### 📋 Version Info

| Component | Version |
|-----------|---------|
| Java SDK | 2.0.1 |
| Go SDK | v1.0.3 |
| Python SDK | 2.0.1 |
| ice-server | 2.0.1 |

---

## [2.0.0](https://github.com/zjn-zjn/ice/compare/1.5.0...2.0.0) (2025-12) 🚀

**Ice Rule Engine 2.0 Major Architecture Upgrade - Zero Dependencies, Containerized, Lighter**

### 🎯 Core Changes

Version 2.0.0 brings a revolutionary architecture overhaul to Ice, removing dependencies on MySQL database and NIO communication in favor of a fully file-system-based storage solution with native Docker containerization support.

#### 💾 Storage Architecture Revolution
* ✨ **File System Storage**: Removed MySQL dependency, using local file system to store all configuration data
* 📁 **JSON File Format**: All configurations stored as JSON files for easy version control and manual review
* 🔄 **Incremental Version Updates**: Support for incremental configuration updates, clients poll version files for latest configurations
* 🗂️ **Clear Directory Structure**:
  - `apps/` - Application configurations
  - `{app}/bases/` - Base rule configurations
  - `{app}/confs/` - Conf node configurations
  - `{app}/versions/` - Version incremental update files
  - `clients/` - Client registration information

#### 🔗 Communication Architecture Simplification
* 🚫 **Removed NIO Communication**: No longer requires Server-Client NIO long connections
* 🚫 **Removed ZooKeeper HA**: No longer depends on ZooKeeper for high availability
* 📡 **File Polling Sync**: Clients poll file system for configuration updates
* 💓 **Heartbeat Mechanism**: Clients periodically write heartbeat files, Server can detect client status

#### 🐳 Native Docker Support
* 📦 **Official Docker Image**: `waitmoon/ice-server:2.0.0`
* 🏗️ **Multi-Architecture Support**: Supports linux/amd64 and linux/arm64
* 📝 **Docker Compose**: Provides ready-to-use docker-compose.yml
* 🔧 **Environment Variable Configuration**: Supports flexible configuration via environment variables
* ♻️ **CI/CD Integration**: GitHub Actions auto-build and publish images

### 📋 Detailed Changes

#### Configuration Changes
* Removed `spring.datasource` database configuration
* Removed `ice.port` NIO port configuration
* Removed `ice.ha` high availability configuration
* Added `ice.storage.path` file storage path configuration
* Added `ice.client-timeout` client timeout configuration
* Added `ice.version-retention` version file retention count configuration
* Client added `ice.poll-interval` polling interval configuration
* Client added `ice.heartbeat-interval` heartbeat interval configuration

### ⚠️ Upgrade Notes

1. **Data Migration**: Upgrading from 1.x requires manually exporting MySQL configuration data to JSON files
2. **Configuration Update**: Need to update application.yml, remove database config, add file storage config
3. **Dependency Changes**: Can remove MySQL driver and MyBatis related dependencies
4. **Deployment Method**: Docker deployment recommended for simplified operations

### 🚀 Quick Start

**Docker One-Click Deployment:**
```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:2.0.0
```

**Using Docker Compose:**
```bash
docker-compose up -d
```

---

## [1.5.0](https://github.com/zjn-zjn/ice/compare/1.3.1...1.5.0) (2025-02-20) 🎉

Major Ice rule engine version update

#### Features
* ✨ Brand new visual tree structure for more intuitive rule orchestration
* 🚀 Support for SpringBoot 3.x and JDK 17+
* 📦 Starter split into 2x/3x versions for different SpringBoot versions

# [1.3.1](https://github.com/zjn-zjn/ice/compare/1.3.0...1.3.1) (2023-06-02)

#### Features
* Add node recycling functionality
* #17 Compatible with spring-boot-devtools

# [1.3.0](https://github.com/zjn-zjn/ice/compare/1.2.0...1.3.0) (2023-06-02)

#### Features
* Various improvements and fixes

# [1.2.0](https://github.com/zjn-zjn/ice/compare/1.1.0...1.2.0) (2023-04-10)

#### Features
* **New configuration interface:**  New configuration page supporting configuration descriptions, drag-and-drop node orchestration, etc. (close [#16](https://github.com/zjn-zjn/ice/issues/16))

# [1.1.0](https://github.com/zjn-zjn/ice/compare/1.0.4...1.1.0) (2022-07-30)

#### Features
* **ice-server high availability:**  Default support for using ZooKeeper for ice-server high availability (close [#13](https://github.com/zjn-zjn/ice/issues/13))

# [1.0.4](https://github.com/zjn-zjn/ice/compare/1.0.3...1.0.4) (2022-07-30)

#### Features
* **Client offline optimization:**  Optimize client offline processing logic (close [#12](https://github.com/zjn-zjn/ice/issues/12))

# [1.0.3](https://github.com/zjn-zjn/ice/compare/1.0.2...1.0.3) (2022-07-26)

#### Features
* **none node support:**  Add none-type nodes (close [#11](https://github.com/zjn-zjn/ice/issues/11))
* **forward nodes:**  Support forward nodes (close [#9](https://github.com/zjn-zjn/ice/issues/9))

# [1.0.2](https://github.com/zjn-zjn/ice/compare/1.0.1...1.0.2) (2022-02-13)

#### Features
* **Node inversion:**  Nodes support inversion (close [#6](https://github.com/zjn-zjn/ice/issues/6))

# 1.0.1 (2022-01-29)

#### Features
* **ice-server:**  NIO communication between ice-server and ice-client for better performance (close [#3](https://github.com/zjn-zjn/ice/issues/3))
