# 常见问题

## Ice

- **ice可以直接用来做工作流吗？**

ice本身是无状态的，如果需要做工作流引擎，还需要二次开发封装。
ice是一种抽象编排方式，类似于抽象一个方法，理论上代码能写的，ice都可以做。

## Client

- **client与server网络故障会导致配置无法热更新吗？**

client默认5s向server发送一个心跳，server在20s内没有收到client心跳会关闭连接，当client网络恢复重新与server建立连接成功后，会全量的拉取配置数据更新一次。因此不必担心网络问题导致的配置不更新问题，但仍需要注意断网这段时间内的配置不统一。

### 日志信息

- **启动报错**

```
Caused by: java.lang.RuntimeException: ice connect server error server:127.0.0.1:18121
	at com.ice.core.client.IceNioClient.connect(IceNioClient.java:95)
	at com.ice.client.config.IceNioClientApplication.run(IceNioClientApplication.java:24)
	at org.springframework.boot.SpringApplication.callRunner(SpringApplication.java:782)
	... 5 common frames omitted
Caused by: io.netty.channel.AbstractChannel$AnnotatedConnectException: Connection refused: /127.0.0.1:18121
Caused by: java.net.ConnectException: Connection refused
```

连接server失败，需要检查server的配置是否正确，和server的通信端口是否互通。

- **配置更新报错**

一般为节点初始化失败错误，此类报错不会终止client启动

```
ERROR (IceConfCache.java:62)- class not found conf:{"id":118,"type":6,"confName":"*.*.*Flow"}
```

节点初始化error，在该client中未找到对应的节点类，请检查节点类是否正常或app配置是否正常。

```
ERROR (IceConfCache.java:91)- sonId:73 not exist please check! conf:{"id":70,"sonIds":"73,74","type":1}
```

节点初始化error，未找到对应id的子节点，一般为子节点初始化失败导致。

以上报错的节点如果未在业务中使用，可以忽略，如果使用了请检查。(后续会出垃圾节点回收，可直接回收不再使用的节点)


## Server
- *****server挂了会影响client吗？*****

server仅负责配置的操作、存储与热更新，clinet在运行时不依赖server，server宕机后，会导致新的client无法启动(无法与server连通也就无法初始化配置)以及无法操作配置后台。

- **server支持集群吗？**

目前server仅支持单机部署，即将支持主备做HA。
