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

Ice rule engine adopts modular design with clear module responsibilities, making it easy to understand and extend.

### Core Module Descriptions

#### ice-common - Common Module
Common component library for Ice rule engine, includes:
- Utility classes (utility methods, type conversion)
- Enum definitions (node types, relation types, status enums)
- Constant definitions (configuration constants, default values)
- Exception class definitions

#### ice-core - Rule Engine Core Module ⭐
Core implementation of Ice rule engine, **highly recommended to read**, contains all core rule engine functionalities:

##### 1. annotation Package - Annotation Definitions
- Node scanning annotations for rule engine
- Configuration annotations
- Auto-wiring annotations

##### 2. base Package - Node Base Classes ⭐⭐⭐
Core base classes of Ice rule engine node system:
- **BaseNode**: Base class for all rule nodes, provides node lifecycle management, time control and other common features
- **BaseLeaf**: Base class for all leaf nodes, implementing specific business logic in rule engine
- **BaseRelation**: Base class for all relation nodes, controls business process orchestration (AND/OR/ALL, etc.)

##### 3. builder Package - Manual Builder
Provides programmatic way to manually build rules (not recommended, use visual configuration platform instead)

##### 4. cache Package - Rule Engine Cache Core ⭐⭐⭐
Cache management center of Ice rule engine:
- **IceConfCache**: Rule node cache, responsible for node initialization, rule tree construction, configuration updates
- **IceHandlerCache**: Triggerable handler cache, organizes and manages rule entries

##### 5. client Package - Service Communication Module
Communication implementation between Ice Client and Server in the rule engine:
- Rule configuration pulling
- Real-time configuration change monitoring
- ha subpackage: High availability implementation (Zookeeper integration)

##### 6. context Package - Rule Execution Context
Execution environment of Ice rule engine:
- **IceContext**: Outermost layer of rule execution context, running through entire rule execution lifecycle
        - IcePack package, structure passed in when triggering
        - IceParallelContext concurrent context, not used yet (haven't figured it out yet)
        - IceRoam user-defined information & the place where the data generated during execution is stored (in fact, it is a map)
    - handler executable handler
    - leaf leaf node
        - base The basic leaf, context as a direct input parameter
        - pack peels off the context, leaving a leaf of the pack input parameter
        - Roam peel off the pack, leaving a leaf for roaming ginseng
    - relation relation node
        - parallel Concurrent relationship nodes
    - utils tool class
    - Ice execution entry, `If you want to see the source code, start here~`
    - IceDispatcher Dispatcher
- **ice-server** server side, some crud and other operations, a lot of mess, don't look good and don't need to look at it
    - config server configuration class
    - constant server base transformations/operations
    - controller
        - common general controller processing, such as packaging resp, packaging err
        - IceAppController app-related operations
        - IceBaseController list page related operations
        - IceConfController tree configuration related operations
        - IceMockController mock related operations
    - dao database operation
    - enums enumeration
    - exception error handling
    - Nio and client communication related processing
    - service processing of some operations, crud...
- **ice-test** small demo, official website example, you can see it directly when you use it ,some initialization operations of ice-client spring client
- **ice-client-spring-boot-autoconfigure** prepared for stater, don't look at it
- **ice-client-spring-boot-starter** stater, which is convenient for direct introduction and use of spring-boot projects, no need to look at it