# [1.3.0](https://github.com/zjn-zjn/ice/compare/1.2.0...1.3.0) (2023-06-02)

#### Feature
* some improve and fix

# [1.2.0](https://github.com/zjn-zjn/ice/compare/1.1.0...1.2.0) (2023-04-10)

#### Feature
* **New configuration page:** New configuration page, support configuration description, drag node arrangement, etc. (close [#16](https://github.com/zjn-zjn/ice/issues/16))

# [1.1.0](https://github.com/zjn-zjn/ice/compare/1.0.4...1.1.0) (2022-07-30)

#### Feature
* **ice-server high availability:** Default supports using zk as a high-availability solution for ice-server close [#13](https://github.com/zjn-zjn/ice/issues/13))

# [1.0.4](https://github.com/zjn-zjn/ice/compare/1.0.3...1.0.4) (2022-07-30)

#### Improve
* **Ensure that the application is completed, then ice provides services:** origin used CommandLineRunner to init ice client，But this startup lags behind services such as TomcatServer. It will cause the ice service provided to the outside world to be unavailable in a short period of time. (close [#12](https://github.com/zjn-zjn/ice/issues/12))

# [1.0.3](https://github.com/zjn-zjn/ice/compare/1.0.2...1.0.3) (2022-07-14)

#### Fixed
* **Blocked on start up:** Blocked on start up with node filed autowired of spring beans use @Bean (close [#11](https://github.com/zjn-zjn/ice/issues/11))

# [1.0.2](https://github.com/zjn-zjn/ice/compare/1.0.1...1.0.2) (2022-07-05)

#### Feature
* **Jackson replaces Fastjson:** Use Jackson to replace Fastjson (close [#8](https://github.com/zjn-zjn/ice/issues/8))
* **Configuration leaf node optimization:** The node implemented by the client is fed back to the server configuration node (close [#9](https://github.com/zjn-zjn/ice/issues/9))
* **Add error input parameters:** IceErrorHandle.handleError() and BaseNode.errorHandle() add input parameter Throwable t to facilitate different processing according to different error types

#### Fixed
* **putMutli thread safety issue:** Fix IceRoam's putMutli thread safety issue that may occur when building multiple layers

# [1.0.1](https://github.com/zjn-zjn/ice/compare/0.0.9...1.0.1) (2022-06-11)

#### Feature
* **Remove rmi:** Replace rmi communication with netty (close [#5](https://github.com/zjn-zjn/ice/issues/5))
**Running out of spring:** You can use IceNioClient in ice-core to run in any java program (close [#6](https://github.com/zjn-zjn/ice/issues/6))
* **Asynchronous result acquisition:** Asynchronously executed process returns futures (close [#7](https://github.com/zjn-zjn/ice/issues/7))

# [0.0.9](https://github.com/zjn-zjn/ice/compare/0.0.8...0.0.9) (2022-04-12)