---
title: Ice FAQ - Frequently Asked Questions
description: Common questions and solutions for Ice rule engine, including performance optimization, troubleshooting, and best practices.
keywords: FAQ,common questions,troubleshooting,best practices,rule engine FAQ,Ice questions
head:
  - - meta
    - property: og:title
      content: Ice FAQ - Frequently Asked Questions
  - - meta
    - property: og:description
      content: Common questions and solutions for Ice rule engine including performance optimization, troubleshooting, and best practices.
---

# Ice Rule Engine FAQ

> Frequently asked questions about Ice rule engine to help you solve problems quickly

## About Ice Rule Engine

### Can Ice Rule Engine be used directly as a workflow engine?

Ice rule engine itself is a stateless lightweight rule engine. If you need workflow engine functionality, it's recommended to build on top of Ice rule engine with secondary development.

**Ice Rule Engine Positioning**:
- Ice is an abstract business orchestration framework, similar to abstracting a method
- In theory, whatever logic code can implement, Ice rule engine can implement
- Suitable for rule configuration, conditional judgment, business orchestration scenarios
- For workflow features like state persistence and process approval, additional development is needed

### Differences between Ice Rule Engine and Traditional Rule Engines?

Compared to traditional rule engines like Drools and Activiti, Ice rule engine offers:
- **More Lightweight**: Zero performance overhead, pure in-memory computation
- **More Flexible**: Tree-based orchestration structure, independent nodes, modifications don't interfere
- **Easier to Use**: Visual configuration, low learning curve
- **Faster**: Millisecond response, suitable for high-concurrency scenarios

## Rule Engine Client Issues

### Will network failure between Client and Server affect rule configuration updates?

**Ice Rule Engine Network Fault Tolerance Mechanism**:

- **Heartbeat Mechanism**: Client sends heartbeat to Server every 5 seconds by default
- **Timeout Mechanism**: Server closes connection if no Client heartbeat received within 20 seconds
- **Auto Recovery**: Client automatically reconnects to Server after network recovery
- **Configuration Sync**: After successful reconnection, full rule configuration is pulled and updated

**Important Notes**:
- During network failure, Client's rule configuration won't be updated
- It's recommended to deploy Ice Server in a stable network environment
- Configure Zookeeper for Ice Server high availability

### Log information

- **Startup error**

````
Caused by: java.lang.RuntimeException: ice connect server error server:127.0.0.1:18121
    at com.ice.core.client.IceNioClient.connect(IceNioClient.java:95)
    at com.ice.client.config.IceNioClientApplication.run(IceNioClientApplication.java:24)
    at org.springframework.boot.SpringApplication.callRunner(SpringApplication.java:782)
    ... 5 common frames omitted
Caused by: io.netty.channel.AbstractChannel$AnnotatedConnectException: Connection refused: /127.0.0.1:18121
Caused by: java.net.ConnectException: Connection refused
````

If the connection to the server fails, you need to check whether the configuration of the server is correct and whether the communication port of the server is connected.

- **Configuration update error**

Generally, it is a node initialization failure error. Such an error will not stop the client from starting.

````
ERROR (IceConfCache.java:62)- class not found conf:{"id":118,"type":6,"confName":"*.*.*Flow"}
````

Node initialization error, the corresponding node class is not found in the client, please check whether the node class is normal or the app configuration is normal.

````
ERROR (IceConfCache.java:91)- sonId:73 not exist please check! conf:{"id":70,"sonIds":"73,74","type":1}
````

Node initialization error, the child node corresponding to the id is not found, generally caused by the failure of child node initialization.

If the node with the above error is not used in the business, it can be ignored. If it is used, please check it. (Subsequent garbage nodes will be recycled, and nodes that are no longer used can be directly recycled)


## Server
- **Will the server hang up affect the client?**

The server is only responsible for the operation, storage and hot update of the configuration. The clinet does not depend on the server during operation. After the server is down, the new client will not be able to start (the configuration cannot be initialized because it cannot be connected to the server) and the configuration background cannot be operated.