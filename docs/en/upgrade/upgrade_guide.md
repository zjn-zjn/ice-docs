# Upgrade guide
> Upgrade the server first, then upgrade the client

## v1.3.0-v1.5.0

* **Configuration**
* * Server
* * * New tree structure implementation

* * Client
* * * This upgrade is compatible with the old Client SDK, no changes required
* * * Dependency name changed from ice-client-spring-boot-starter to ice-spring-boot-starter-2x/3x to support different SpringBoot versions

## v1.2.0-v1.3.0
* some improve and fix

## v1.1.0-v1.2.0

* **Configuration**
* * Server
* * * Configuration page tweaks

* * Client
* * * Add @IceNode, @IceField, @IceIgnore annotations to improve the interpretability of configuration

## v1.0.4-v1.1.0

* **Configuration**
* * Server
* * * Added ice.ha configuration to support server high availability, no configuration required for stand-alone server

* * Client
* * * ice.server configuration supports server high availability, such as ice.server=zookeeper:localhost:2181, the single-server server is the same as the previous configuration

## v1.0.3-v1.0.4

* **Code**
* * IceNioClient.connect() rename start(), only non-Spring projects need to be modified

## v1.0.1-v1.0.2/v1.0.3

* **Configuration**
* * Client
* * * Added ice.scan configuration for scanning leaf nodes (scan all by default, scanning all will slow down the application startup speed), multiple packages are separated by ','

* **Code**
* * Ice.processCxt and Ice.processSingleCxt renamed to processCtx and processSingleCtx
* * IceErrorHandle.handleError() and BaseNode.errorHandle() add error input parameter Throwable t

## v1.0.1
> Don't use 1.0.0! ! ! The 1.0.0 jar package is incomplete due to network problems when packaging and pushing the central warehouse!

* **Configuration**
* * Server 
* * * ice.rmi.port removes rmi and becomes ice.port. It is recommended to replace the original port number when upgrading to avoid dirty data problems
* * Client
* * * remove ice.rmi.mode, ice.rmi.port
* * * ice.rmi.server removes rmi and becomes ice.server

* **Code**
* * Ice replaces IceClient, process() becomes asyncProcess()

* **Function**
* * Running out of spring, ```client = new IceNioClient(app, server).connect()```connect() is a blocking method, which can start a new thread to run, ```new Thread(client::connect). start()```, the run ends ```client.destroy()``` can be destroyed