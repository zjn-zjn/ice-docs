# Common problem

## Ice

- **Can ice be used directly for workflow?**

Ice itself is stateless. If you need to be a workflow engine, you need to develop and encapsulate it twice.
Ice is an abstract arrangement, similar to abstracting a method. In theory, whatever code can be written, ice can do.

## Client

- **Will the network failure of the client and server cause the configuration to fail to be updated hotly?**

The client sends a heartbeat to the server by default in 5s. The server will close the connection if it does not receive the client's heartbeat within 20s. When the client network recovers and re-establishes a connection with the server, it will pull the full amount of configuration data and update it once. Therefore, there is no need to worry about the configuration not being updated due to network problems, but it is still necessary to pay attention to the inconsistent configuration during the disconnection period.

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
ERROR (IceConfCache.java:62)- ice error conf:{"id":118,"type":6,"confName":"*.*.*Flow"} please check! e:
java.lang.ClassNotFoundException: *.*.*Flow
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