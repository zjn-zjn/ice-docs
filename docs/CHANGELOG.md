# [1.0.2](https://github.com/zjn-zjn/ice/compare/1.0.0...1.0.2) (2022-07-05)

#### Feature
* **Jackson replaces Fastjson:** Use Jackson to replace Fastjson (close [#8](https://github.com/zjn-zjn/ice/issues/8))
* **Configuration leaf node optimization:** The node implemented by the client is fed back to the server configuration node (close [#9](https://github.com/zjn-zjn/ice/issues/9))
* **Add error input parameters:** IceErrorHandle.handleError() and BaseNode.errorHandle() add input parameter Throwable t to facilitate different processing according to different error types

#### Fixed
* **putMutli thread safety issue:** Fix IceRoam's putMutli thread safety issue that may occur when building multiple layers

# [1.0.1](https://github.com/zjn-zjn/ice/compare/0.0.9...1.0.0) (2022-06-11)

#### Feature
* **Remove rmi:** Replace rmi communication with netty (close [#5](https://github.com/zjn-zjn/ice/issues/5))
**Running out of spring:** You can use IceNioClient in ice-core to run in any java program (close [#6](https://github.com/zjn-zjn/ice/issues/6))
* **Asynchronous result acquisition:** Asynchronously executed process returns futures (close [#7](https://github.com/zjn-zjn/ice/issues/7))

# [0.0.9](https://github.com/zjn-zjn/ice/compare/0.0.8...0.0.9) (2022-04-12)