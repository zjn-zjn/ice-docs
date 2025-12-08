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
public class ScoreFlow extends BaseLeafRoamFlow { }
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
| Go SDK | v1.0.1 |
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
