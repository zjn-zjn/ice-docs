---
title: Ice Architecture - Technical Design and Implementation
description: In-depth analysis of Ice rule engine architecture, core components, and implementation principles for better understanding and usage of the Ice framework.
keywords: architecture design,technical principles,core components,source code,rule engine architecture,Ice architecture
head:
  - - meta
    - property: og:title
      content: Ice Architecture - Technical Design and Implementation
  - - meta
    - property: og:description
      content: In-depth analysis of Ice rule engine architecture, core components, and implementation principles.
---

# Ice Rule Engine Architecture Design

> In-depth understanding of Ice rule engine's technical architecture and core components

## Ice Rule Engine Overall Architecture

Ice rule engine adopts Client-Server architecture design, achieving separation of rule configuration and business execution, supporting hot rule updates and dynamic orchestration.

![Ice Rule Engine Architecture](/images/advanced/architecture-dark.png#dark)
![Ice Rule Engine Architecture](/images/advanced/architecture-light.png#light)

### Core Components

#### IceServer - Rule Management Platform
- **Positioning**: Visual configuration management center for Ice rule engine
- **Core Capabilities**:
  - Provides web visual rule configuration interface
  - Stores and manages all rule configuration data
  - Supports rule version management and history rollback
  - Real-time push of rule configuration changes to Client
  - Multi-application (App) isolation management

#### IceCore - Rule Execution Engine
- **Positioning**: Business execution core of Ice rule engine
- **Core Capabilities**:
  - Pulls and caches rule configurations from Server to memory
  - Monitors rule configuration changes and updates in real-time
  - Provides high-performance rule execution interface
  - Supports multiple node types and orchestration modes
  - Pure in-memory computation with millisecond response

## Node class diagram

![class](/images/advanced/class-dark.png#dark)
![class](/images/advanced/class-light.png#light)

**BaseNode:** The base class of all ice nodes, providing common node operations, such as node valid time, etc.

**BaseRelation:** The base class of all relation nodes, used for business flow control.

**BaseLeaf:** The base class of all leaf nodes, the leaf nodes are the nodes that actually execute the business.