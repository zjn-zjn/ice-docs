---
title: Ice Project Structure - Source Code Analysis
description: Ice rule engine project structure and source code analysis, including core modules, component functions, code organization and detailed explanations to help developers understand Ice source code.
keywords: project structure,source code analysis,module description,code organization,Ice source code,rule engine code
head:
  - - meta
    - property: og:title
      content: Ice Project Structure - Source Code Analysis
  - - meta
    - property: og:description
      content: Ice rule engine project structure and source code analysis with core modules, component functions, and code organization.
---

# Ice Rule Engine Project Structure

> Source code analysis of Ice rule engine - understanding core modules and code organization

## Ice Rule Engine Module Overview

Ice 2.0 adopts a Monorepo architecture, managing multi-language SDKs uniformly with clear module responsibilities, making it easy to understand and extend.

```
ice/                              # GitHub: github.com/zjn-zjn/ice
├── sdks/                         # Multi-language SDKs
│   ├── java/                     # Java SDK
│   │   ├── ice-common/           # Common module
│   │   │   ├── constant/         # Constant definitions
│   │   │   ├── dto/              # Data transfer objects
│   │   │   ├── enums/            # Enum definitions
│   │   │   └── model/            # Model classes
│   │   ├── ice-core/             # Rule engine core ⭐
│   │   │   ├── annotation/       # Annotation definitions
│   │   │   ├── base/             # Node base classes
│   │   │   ├── cache/            # Config cache
│   │   │   ├── client/           # File client
│   │   │   └── context/          # Execution context
│   │   └── ice-spring-boot/      # SpringBoot integration
│   │       ├── ice-spring-boot-starter-2x/
│   │       └── ice-spring-boot-starter-3x/
│   ├── go/                       # Go SDK (v1.0.2)
│   │   ├── cache/                # Config cache
│   │   ├── client/               # File client
│   │   ├── context/              # Execution context
│   │   ├── node/                 # Node implementation
│   │   └── relation/             # Relation nodes
│   └── python/                   # Python SDK
│       └── src/ice/
│           ├── cache/            # Config cache
│           ├── client/           # File client
│           ├── context/          # Execution context
│           ├── node/             # Node implementation
│           └── relation/         # Relation nodes
├── server/                       # Config management server
│   └── ice-server/
│       ├── controller/           # Interface layer
│       ├── service/              # Business layer
│       └── storage/              # Storage layer
└── tests/                        # Test examples
    ├── java/                     # Java tests
    ├── go/                       # Go tests
    └── python/                   # Python tests
```

## Core Module Descriptions

### ice-common - Common Module

Common component library for Ice rule engine:

- **constant/** - Constant definitions
  - `Constant` - General constants
  - `IceStorageConstants` - File storage constants (2.0 new)
- **dto/** - Data transfer objects
  - `IceBaseDto` / `IceConfDto` - Rule config DTOs
  - `IceTransferDto` - Config transfer DTO
  - `IceClientInfo` - Client information (2.0 new)
  - `IceAppDto` / `IcePushHistoryDto` - App and publish history
- **enums/** - Enum definitions
- **model/** - Model classes

### ice-core - Rule Engine Core ⭐

Core implementation of Ice rule engine, **highly recommended to read**:

#### 1. annotation Package - Annotation Definitions

- `@IceNode` - Node annotation, defines node name, description, order
- `@IceField` - Field annotation, defines field name, description, type
- `@IceIgnore` - Ignore annotation, marks fields not shown in config UI

#### 2. base Package - Node Base Classes ⭐⭐⭐

Core base classes of Ice rule engine node system:

- **BaseNode** - Base class for all rule nodes
  - Node lifecycle management
  - Time control (effective time)
  - Error handling
- **BaseLeaf** - Base class for all leaf nodes
  - `BaseLeafFlow` - Flow node base class
  - `BaseLeafResult` - Result node base class
  - `BaseLeafNone` - None node base class
- **BaseRelation** - Base class for all relation nodes
  - AND / ANY / ALL / NONE / TRUE

#### 3. cache Package - Rule Engine Cache ⭐⭐⭐

- **IceConfCache** - Rule node cache
  - Node initialization and instantiation
  - Rule tree construction
  - Config hot update
- **IceHandlerCache** - Handler cache
  - Index by iceId
  - Index by scene

#### 4. client Package - Client Implementation (2.0 Refactored)

- **IceFileClient** - File system based client ⭐
  - Load config from file system
  - Version polling for updates
  - Heartbeat reporting
  - Incremental/full config loading
- **IceLeafScanner** - Leaf node scanner
- **IceUpdate** - Config update handler

#### 5. context Package - Execution Context

- **IceContext** - Rule execution context
- **IcePack** - Execution pack, passed when triggering
- **IceRoam** - Data storage (ConcurrentHashMap extension)

#### 6. Execution Entry

- **Ice** - Entry class `Start reading source code from here~`
  - `syncProcess()` - Synchronous execution
  - `asyncProcess()` - Asynchronous execution
- **IceDispatcher** - Rule dispatcher

### ice-server - Config Management Server

Configuration management platform for Ice rule engine:

#### Core Directories

- **controller/** - Interface layer
  - `IceAppController` - App management
  - `IceBaseController` - Rule list
  - `IceConfController` - Node configuration
- **service/** - Business layer
  - `IceAppService` - App service
  - `IceBaseService` - Rule service
  - `IceConfService` - Config service
  - `IceServerService` - Server core logic
- **storage/** - Storage layer (2.0 new) ⭐
  - `IceFileStorageService` - File storage service
  - `IceClientManager` - Client manager
  - `IceIdGenerator` - ID generator

#### 2.0 Architecture Changes

- ✅ Added `storage/` package - File storage implementation
- ❌ Removed `dao/` package - MyBatis no longer needed
- ❌ Removed `nio/` package - NIO communication no longer needed

### ice-spring-boot - SpringBoot Integration

#### ice-spring-boot-starter-2x

Starter for SpringBoot 2.x:

- `IceClientProperties` - Configuration properties
- `IceFileClientInit` - Client initialization (2.0 new)

#### ice-spring-boot-starter-3x

Starter for SpringBoot 3.x, same structure as 2x.

### ice-test - Test Examples

Provides complete usage examples, including:

- Leaf node examples (Flow/Result/None)
- Configuration file examples
- Rule execution examples

## Source Code Reading Suggestions

### Beginner Path

1. **ice-test** - Run examples first, understand basic usage
2. **Ice.java** - Start from execution entry
3. **IceDispatcher** - Understand rule dispatching logic
4. **BaseNode/BaseRelation/BaseLeaf** - Understand node system

### Advanced Path

1. **IceConfCache** - Config cache and rule tree construction
2. **IceFileClient** - Client implementation (2.0)
3. **IceFileStorageService** - File storage implementation (2.0)

### Recommended Core Classes ⭐

| Class | Description | Rating |
|-------|-------------|--------|
| `Ice` | Execution entry | ⭐⭐⭐ |
| `BaseNode` | Node base class | ⭐⭐⭐ |
| `IceConfCache` | Config cache | ⭐⭐⭐ |
| `IceFileClient` | File client | ⭐⭐ |
| `IceFileStorageService` | File storage | ⭐⭐ |
