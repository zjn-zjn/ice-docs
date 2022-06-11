# Architecture

## Architecture diagram

<img src="/images/advanced/architecture.png" width="100%" height="100%">

**IceServer:** Provides storage and management of page operations and configurations.

**IceClient:** Pulls & updates configuration information from the server, caches it in the business memory, and provides an execution interface.

## Node class diagram

<img src="/images/advanced/class.png" width="100%" height="100%">

**BaseNode:** The base class of all ice nodes, providing common node operations, such as node valid time, etc.

**BaseRelation:** The base class of all relation nodes, with List\<BaseNode\> children.

**BaseLeaf:** The base class of all leaf nodes, the leaf nodes are the nodes that actually execute the business.