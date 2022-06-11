# 升级指南

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