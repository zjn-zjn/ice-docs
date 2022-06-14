# 快速上手

>快来接入使用吧~

## 安装依赖

安装mysql，**新建ice数据库**用于存储配置

`CREATE DATABASE IF NOT EXISTS ice Character Set utf8mb4;`

**备注：** 如果启动时报找不到ice相关的表，则需手动创建ice相关表结构，表结构sql地址：

[https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql](https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql)

## 安装server

### 下载安装包

[http://waitmoon.com/downloads/](http://waitmoon.com/downloads/)

解压tar包 

tar -xzvf ice-server-*.tar.gz

### 编辑配置文件

application-prod.yml

```
server:
  port: 8121 #端口
spring:
  datasource: #数据库配置
    url: jdbc:mysql://127.0.0.1:3306/ice?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai&useSSL=false
    username: username
    password: password
    initialization-mode: always
ice:
  port: 18121 #与客户端通信端口
  pool: #线程池配置(用于更新client)
    core-size: 4
    max-size: 4
    keep-alive-seconds: 60
    queue-capacity: 60000
```

### 启动/停止/重启server

启动
**sh ice.sh start**

停止
**sh ice.sh stop**

重启
**sh ice.sh restart**

### 打开配置后台

http://localhost:8121/

### 示例后台参考

部署用于测试&体验地址(仅app=1有真实部署的client)

[http://waitmoon.com](http://waitmoon.com)

## Client接入

参考github ice-test模块

### 增加pom依赖

```
  <dependency>
    <groupId>com.waitmoon.ice</groupId>
    <artifactId>ice-client-spring-boot-starter</artifactId>
    <version>1.0.1</version>
  </dependency>
```

### 增加ice配置

```
ice: #ice client配置
  app: 1 #与后台配置app对应
  server: 127.0.0.1:18121 #server 地址(serverHost:serverPort)
  pool: #线程池配置(用于并发关系节点)
    parallelism: -1 #默认-1,≤0表示采用默认配置
```

## 开发&配置

>参考github ice-test模块

视频地址：https://www.bilibili.com/video/BV1Q34y1R7KF

<iframe src="//player.bilibili.com/player.html?aid=807134055&bvid=BV1Q34y1R7KF&cid=456033283&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>