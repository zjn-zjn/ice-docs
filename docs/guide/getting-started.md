# Get started

>Try to access and use it~

## Install dependencies

Install mysql, **new ice database** to store configuration

`CREATE DATABASE IF NOT EXISTS ice Character Set utf8mb4;`

**Remarks:** If the ice-related table cannot be found during startup, you need to manually create the ice-related table structure. The sql address of the table structure:

https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql

## Install server

### Download the installation package
http://waitmoon.com/downloads/

Unzip the tar package

tar -xzvf ice-server-*.tar.gz

### Edit configuration file

````
server:
   port: 8121 #Port
spring:
   datasource: #Database configuration
     url: jdbc:mysql://127.0.0.1:3306/ice?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai&useSSL=false
     username: username
     password: password
     initialization-mode: always
ice:
   rmi: #rmiconfig
     port: 8212 #rmi port
   pool: #Thread pool configuration (used to update the client)
     core-size: 4
     max-size: 4
     keep-alive-seconds: 60
     queue-capacity: 60000
````

### start/stop/restart server

start up
**sh ice.sh start**

stop
**sh ice.sh stop**

reboot
**sh ice.sh restart**

### Open configuration backend

http://localhost:8121/

### Example backend reference

Deploy for testing & experience address (only app=1 has real deployed client)

http://waitmoon.com

## Client access

Refer to github ice-test module

### Add pom dependency

````
  <dependency>
    <groupId>com.waitmoon.ice</groupId>
    <artifactId>ice-client-spring-boot-starter</artifactId>
    <version>0.0.9</version>
  </dependency>
````

### Add ice configuration

````
ice: #ice client configuration
   app: 1 #corresponds to the background configuration app
   rmi: #rmiconfig
     mode: ONE_WAY #The default is ONE_WAY. Under the condition that the client and server network communicate with each other, TWO_WAY can be selected. TWO_WAY is better than ONE_WAY
     port: 8210 #The default is 0 (the communication port is randomly selected), the port can be specified under the condition of TWO_WAY and a firewall, and no configuration is required under ONE_WAY
     server: 127.0.0.1:8212 #server rmi address (serverHost:serverRmiPort)
   pool: #Thread pool configuration (for concurrent nodes)
     parallelism: -1 #default-1,≤0 means the default configuration
````

**Note: Startup failed**

If it is confirmed that the network with the server is unblocked, you need to consider the configuration of the server's rmi about -Djava.rmi.server.hostname=xxx.xxx.xxx.xxx (added in the server startup script ice.sh)

## Development & Configuration

>Refer to github ice-test module