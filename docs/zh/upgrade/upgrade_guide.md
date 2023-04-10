# 升级指南
> 先升server，再升client


## v1.1.0-v1.2.0

* **配置**
* * 服务端
* * * 配置页面调整

* * 客户端
* * * 增加@IceNode、@IceField、@IceIgnore注解用于提高配置的可解释性

## v1.0.4-v1.1.0

* **配置**
* * 服务端
* * * 新增ice.ha配置，用于支持server高可用，单机server无需配置

* * 客户端
* * * ice.server配置支持server高可用，如ice.server=zookeeper:localhost:2181，单机server与以往配置一致

## v1.0.3-v1.0.4

* **代码**
* * IceNioClient.connect()变成start()，仅非Spring项目使用需修改

## v1.0.1-v1.0.2/v1.0.3

* **配置**
* * 客户端
* * * 新增ice.scan配置，用于扫描叶子节点(默认扫描全部，扫描全部会拖慢应用启动速度)，多个包用','分隔

* **代码**
* * Ice.processCxt和Ice.processSingleCxt更名为processCtx和processSingleCtx
* * IceErrorHandle.handleError()和BaseNode.errorHandle()增加错误入参Throwable t


## v1.0.1
> 不要使用1.0.0！！！因为打包推送中央仓库时的网络问题，导致1.0.0 jar包不完整！

* **配置**
* * 服务端 
* * * ice.rmi.port去除rmi变成ice.port，升级时推荐替换掉原有端口号，避免脏数据问题
* * 客户端 
* * * 去除ice.rmi.mode，ice.rmi.port
* * * ice.rmi.server去除rmi变成ice.server

* **代码**
* * Ice替代IceClient，process()变成asyncProcess()

* **功能**
* * 脱离spring运行，```client = new IceNioClient(app, server).connect()```connect()为阻塞方法，可开启新线程运行，```new Thread(client::connect).start()```，运行结束```client.destroy()```销毁即可