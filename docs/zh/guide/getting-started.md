# 快速上手

>快来接入使用吧~

## 安装依赖

安装mysql，**新建ice数据库**用于存储配置

```sql
CREATE DATABASE IF NOT EXISTS ice Character Set utf8mb4;
```

**备注：** 如果启动时报找不到ice相关的表，则需手动创建ice相关表结构，表结构sql地址：

[https://gitee.com/waitmoon/ice/blob/master/ice-server/src/main/resources/sql/ice.sql](https://gitee.com/waitmoon/ice/blob/master/ice-server/src/main/resources/sql/ice.sql)
或
[https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql](https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql)

## 安装server

### 下载安装包(最新v1.1.0)

[http://124.221.148.247/downloads/](http://124.221.148.247/downloads/)

解压tar包 

tar -xzvf ice-server-*.tar.gz

### 编辑配置文件

application-prod.yml

```yml
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
#  ha: #高可用配置，当前默认支持zookeeper
#    address: localhost:2181,localhost:2182,localhost:2183
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

[http://124.221.148.247:8121](http://124.221.148.247:8121)

## Client接入(Spring)

参考github ice-test模块

### 增加pom依赖

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-client-spring-boot-starter</artifactId>
  <version>1.1.0</version>
</dependency>
```

#### 高可用额外依赖

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.1</version>
</dependency>
```

### 增加ice配置

```yml
ice: #ice client配置
  app: 1 #与后台配置app对应
#  server: zookeeper:localhost:2181,localhost:2182,localhost:2183 #server高可用配置
  server: 127.0.0.1:18121 #server 地址(serverHost:serverPort)
  scan: com.ice.test #用于扫描叶子节点，多个包用','分隔(默认扫描全部，扫描全部会拖慢应用启动速度)
  pool: #线程池配置(用于并发关系节点)
    parallelism: -1 #默认-1,≤0表示采用默认配置
```

## Client接入(非Spring)

### 增加pom依赖

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>1.1.0</version>
</dependency>
```

#### 高可用额外依赖

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.1</version>
</dependency>
```

### 运行Client

```java
IceNioClient iceNioClient = new IceNioClient(1, "127.0.0.1:18121", "com.ice.test"); //传入app、server地址和叶子节点扫描路径
iceNioClient.start(); //连接远程server，初始化ice配置
iceNioClient.destroy(); //应用关停后最好清理一下~ 
```

## 开发&配置

>参考github ice-test模块

视频地址：[https://www.bilibili.com/video/BV1Q34y1R7KF](https://www.bilibili.com/video/BV1Q34y1R7KF)

<iframe src="//player.bilibili.com/player.html?aid=807134055&bvid=BV1Q34y1R7KF&cid=456033283&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>