# [1.0.2](https://github.com/zjn-zjn/ice/compare/1.0.0...1.0.2) (2022-07-05)

### 功能

* **Jackson替换Fastjson:** 使用Jackson替换Fastjson (close [#8](https://github.com/zjn-zjn/ice/issues/8))
* **配置叶子节点优化** 通过客户端实现的节点反馈给服务端配置节点 (close [#9](https://github.com/zjn-zjn/ice/issues/9))

### 修复

* **putMutli在构建多层级时可能出现的线程安全问题** IceRoam的putMutli在构建多层级时可能出现的线程安全问题
* **错误处理增加错误入参** 错误处理增加错误入参


# [1.0.1](https://github.com/zjn-zjn/ice/compare/0.0.9...1.0.0) (2022-06-11)

### 功能

* **去除rmi:** 使用netty替换rmi通信 (close [#5](https://github.com/zjn-zjn/ice/issues/5))
* **脱离spring运行** 可以使用ice-core中的IceNioClient运行在任何java程序中 (close [#6](https://github.com/zjn-zjn/ice/issues/6))
* **异步结果获取** 异步执行的process返回futures (close [#7](https://github.com/zjn-zjn/ice/issues/7))


# [0.0.9](https://github.com/zjn-zjn/ice/compare/0.0.8...0.0.9) (2022-04-12)