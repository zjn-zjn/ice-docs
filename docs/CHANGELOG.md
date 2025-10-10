---
title: Ice 规则引擎更新日志 - 版本历史记录
description: Ice规则引擎的版本更新历史，包括新功能、性能优化、Bug修复等详细变更记录。了解Ice规则引擎的每个版本改进。
keywords: 更新日志,版本历史,CHANGELOG,Ice版本,规则引擎更新,新功能
head:
  - - meta
    - property: og:title
      content: Ice 规则引擎更新日志 - 版本历史记录
  - - meta
    - property: og:description
      content: Ice规则引擎的完整版本更新历史，了解每个版本的新功能和改进。
---

# Ice 规则引擎更新日志

> 记录 Ice 规则引擎每个版本的功能更新、性能优化和问题修复

## [1.5.0](https://github.com/zjn-zjn/ice/compare/1.3.1...1.5.0) (2025-02-20) 🎉

Ice 规则引擎重大版本更新

#### 新功能
* ✨ 全新的可视化树图结构，规则编排更直观
* 🚀 支持 SpringBoot 3.x 和 JDK 17+，拥抱新技术
* 📦 优化项目结构，提升规则引擎性能和可维护性

# [1.3.1](https://github.com/zjn-zjn/ice/compare/1.3.0...1.3.1) (2023-06-02)

#### 功能
* 增加节点回收功能
* #17 兼容spring-boot-devtools

# [1.3.0](https://github.com/zjn-zjn/ice/compare/1.2.0...1.3.0) (2023-06-02)

#### 功能
* 一些改进和修复，年代久远不太记得了...

# [1.2.0](https://github.com/zjn-zjn/ice/compare/1.1.0...1.2.0) (2023-04-10)

#### 功能
* **新的配置页面:**  新的配置页面，支持配置描述，拖动节点编排等(close [#16](https://github.com/zjn-zjn/ice/issues/16))

# [1.1.0](https://github.com/zjn-zjn/ice/compare/1.0.4...1.1.0) (2022-07-30)

#### 功能
* **ice-server 高可用:**  默认支持使用zk做ice-server的高可用方案(close [#13](https://github.com/zjn-zjn/ice/issues/13))


# [1.0.4](https://github.com/zjn-zjn/ice/compare/1.0.3...1.0.4) (2022-07-30)

#### 优化
* **确保Ice启动后才对外提供服务:** 老版本使用CommandLineRunner的方式启动ice，这种启动方式是滞后于Tomcat等服务的。会导致短时间内对外提供的ice服务不可用 (close [#12](https://github.com/zjn-zjn/ice/issues/12))

# [1.0.3](https://github.com/zjn-zjn/ice/compare/1.0.2...1.0.3) (2022-07-14)

#### 修复
* **启动阻塞问题:** 节点类中如果使用了@Bean注解生成的spring bean，在autowiredBean时会阻塞ice启动 (close [#11](https://github.com/zjn-zjn/ice/issues/11))

# [1.0.2](https://github.com/zjn-zjn/ice/compare/1.0.1...1.0.2) (2022-07-05)

#### 功能
* **Jackson替换Fastjson:** 使用Jackson替换Fastjson (close [#8](https://github.com/zjn-zjn/ice/issues/8))
* **配置叶子节点优化:** 通过客户端实现的节点反馈给服务端配置节点 (close [#9](https://github.com/zjn-zjn/ice/issues/9))
* **增加错误入参:** IceErrorHandle.handleError()和BaseNode.errorHandle()增加入参Throwable t，方便根据不同错误类型做不同处理

#### 修复
* **putMutli线程安全问题:** 修复IceRoam的putMutli在构建多层级时可能出现的线程安全问题

# [1.0.1](https://github.com/zjn-zjn/ice/compare/0.0.9...1.0.1) (2022-06-11)

#### 功能
* **去除rmi:** 使用netty替换rmi通信 (close [#5](https://github.com/zjn-zjn/ice/issues/5))
* **脱离spring运行:** 可以使用ice-core中的IceNioClient运行在任何java程序中 (close [#6](https://github.com/zjn-zjn/ice/issues/6))
* **异步结果获取:** 异步执行的process返回futures (close [#7](https://github.com/zjn-zjn/ice/issues/7))

# [0.0.9](https://github.com/zjn-zjn/ice/compare/0.0.8...0.0.9) (2022-04-12)