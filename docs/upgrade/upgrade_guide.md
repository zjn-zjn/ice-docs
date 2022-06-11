# Upgrade guide

##v1.0.1
> Don't use 1.0.0! ! ! The 1.0.0 jar package is incomplete due to network problems when packaging and pushing the central warehouse!

* **Configuration**
* * Server 
* * * ice.rmi.port removes rmi and becomes ice.port. It is recommended to replace the original port number when upgrading to avoid dirty data problems
** Client
* * * remove ice.rmi.mode, ice.rmi.port
* * * ice.rmi.server removes rmi and becomes ice.server

* **Code**
* * Ice replaces IceClient, process() becomes asyncProcess()

* **Function**
* * Running out of spring, ```client = new IceNioClient(app, server).connect()```connect() is a blocking method, which can start a new thread to run, ```new Thread(client::connect). start()```, the run ends ```client.destroy()``` can be destroyed