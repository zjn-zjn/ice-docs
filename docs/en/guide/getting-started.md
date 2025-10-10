---
title: Ice Getting Started - 5-Minute Quick Integration Guide
description: Complete guide to quickly integrate Ice rule engine. Includes Server deployment, Client integration, database configuration and detailed steps. Supports SpringBoot 2.x/3.x and non-Spring projects.
keywords: rule engine integration,getting started,installation guide,configuration,SpringBoot rule engine,Ice installation
head:
  - - meta
    - property: og:title
      content: Ice Getting Started - 5-Minute Quick Integration Guide
  - - meta
    - property: og:description
      content: Complete guide to quickly integrate Ice rule engine with Server deployment, Client integration, and database configuration.
---

# Ice Rule Engine Getting Started Guide

> Integrate Ice rule engine in 5 minutes and start your visual business orchestration journey!

This guide will help you quickly set up the Ice rule engine environment, including both **Ice Server** (rule management platform) and **Ice Client** (business application integration).

## System Requirements

- **JDK**: 1.8+ (JDK 17+ required for SpringBoot 3.x)
- **MySQL**: 5.7+ or 8.0+
- **SpringBoot**: 2.x or 3.x (optional)

## Step 1: Install Database

Ice rule engine uses MySQL to store rule configurations. First install MySQL, then **create the ice database**:

```sql
CREATE DATABASE IF NOT EXISTS ice Character Set utf8mb4;
```

**Note:** If Ice rule engine tables are not found during startup, manually create the table structure. SQL file location:

[https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql](https://github.com/zjn-zjn/ice/blob/master/ice-server/src/main/resources/sql/ice.sql)

## Step 2: Install Ice Server (Rule Management Platform)

Ice Server is the visual rule configuration and management platform for the rule engine, providing rule orchestration, real-time push, and version management features.

### Download Ice Server Package

Latest version v{{ $version }}

Download: [https://waitmoon.com/downloads/](https://waitmoon.com/downloads/)

Extract the package:

```bash
tar -xzvf ice-server-*.tar.gz
cd ice-server
```

### Configure Ice Server

Edit the `application-prod.yml` configuration file:

```yml
server:
  port: 8121 #Port
spring:
  datasource: #Database configuration
    url: jdbc:mysql://127.0.0.1:3306/ice?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai&useSSL=false
    username: username
    password: password
    initialization-mode: always
ice:
  port: 18121 #port for client
#  ha: #ha config, now default zk
#    address: localhost:2181,localhost:2182,localhost:2183
  pool: #Thread pool configuration (used to update the client)
    core-size: 4
    max-size: 4
    keep-alive-seconds: 60
    queue-capacity: 60000
```

### start/stop/restart server

start up
**sh ice.sh start**

stop
**sh ice.sh stop**

reboot
**sh ice.sh restart**

### Open configuration backend

http://localhost:8121/

### Ice Server Management Console

After successful startup, access the Ice rule engine management console at: http://localhost:8121/

### Online Demo Environment

Ice rule engine online demo environment (only app=1 has deployed client):

👉 [http://eg.waitmoon.com](http://eg.waitmoon.com)

## Step 3: SpringBoot Project Integration

Ice Client is the rule engine execution client that integrates into your business application to execute rules.

Refer to the complete example: [ice-test module](https://github.com/zjn-zjn/ice)

### Add Maven Dependencies

Choose the appropriate Ice Starter for your SpringBoot version:

```xml
<!-- SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>{{ $version }}</version>
</dependency>

<!-- SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>{{ $version }}</version>
</dependency>
```

#### High availability additional dependencies

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.1</version>
</dependency>
```

### Add ice configuration

```yml
ice: #ice client configuration
  app: 1 #corresponds to the background configuration app
#  server: zookeeper:localhost:2181,localhost:2182,localhost:2183 #server high availability configuration
  server: 127.0.0.1:18121 #server address (serverHost:serverPort)
  scan: com.ice.test #used to scan leaf nodes, multiple packages are separated by ',' (scan all by default, scanning all will slow down the application startup speed)
  pool: #Thread pool configuration (for concurrent relation nodes)
    parallelism: -1 #default-1,≤0 means the default configuration
```

## Client access (non-Spring)

### Add pom dependency

```xml
<!-- Non-SpringBoot -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>{{ $version }}</version>
</dependency>
```
#### High availability additional dependencies

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.1</version>
</dependency>
```

### Run Client

```java
IceNioClient iceNioClient = new IceNioClient(1, "127.0.0.1:18121", "com.ice.test"); //Incoming app, server address and leaf node scan path
iceNioClient.start(); //Connect to the remote server and initialize the ice configuration
iceNioClient.destroy(); //It is best to clean up after the application is closed~
```

## Development & Configuration

>Refer to github ice-test module