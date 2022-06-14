# Architecture

## Architecture diagram

![Architecture](/images/advanced/architecture-dark.png#dark)
![Architecture](/images/advanced/architecture-light.png#light)

**IceServer:** Provides storage and management of page operations and configurations.

**IceCore:** Pulls & updates configuration information from the server, caches it in the business memory, and provides an execution interface.

## Node class diagram

![class](/images/advanced/class-dark.png#dark)
![class](/images/advanced/class-light.png#light)

**BaseNode:** The base class of all ice nodes, providing common node operations, such as node valid time, etc.

**BaseRelation:** The base class of all relation nodes, used for business flow control.

**BaseLeaf:** The base class of all leaf nodes, the leaf nodes are the nodes that actually execute the business.