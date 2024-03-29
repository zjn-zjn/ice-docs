# Project structure

- **ice-common** Some common classes, tool classes, enumerations, etc.
- **ice-core** core package, which provides all the core functions of the client, recommended to see
    - annotation Some annotations
    - base The core base class of the node class
        - BaseNode The base class of all node classes, providing basic processing of some nodes
        - BaseLeaf The base class of all leaf nodes
        - BaseRelation The base class of all relationship nodes
    - The builder method of manually building ice is not recommended (who uses this thing with visualization?), and may be deleted in the future
    - cache client core, all nodes and handler caches are initialized & updated here
        - IceConfCache node cache is initialized & built tree & updated here
        - IceHandlerCache The handler cache that can be triggered is set up here
    - Client communicates with server, pulls server configuration & receives server changes
        - ha High availability related
    - context context environment class
        - The outermost layer of the IceContext context
        - IcePack package, structure passed in when triggering
        - IceParallelContext concurrent context, not used yet (haven't figured it out yet)
        - IceRoam user-defined information & the place where the data generated during execution is stored (in fact, it is a map)
    - handler executable handler
    - leaf leaf node
        - base The basic leaf, context as a direct input parameter
        - pack peels off the context, leaving a leaf of the pack input parameter
        - Roam peel off the pack, leaving a leaf for roaming ginseng
    - relation relation node
        - parallel Concurrent relationship nodes
    - utils tool class
    - Ice execution entry, `If you want to see the source code, start here~`
    - IceDispatcher Dispatcher
- **ice-server** server side, some crud and other operations, a lot of mess, don't look good and don't need to look at it
    - config server configuration class
    - constant server base transformations/operations
    - controller
        - common general controller processing, such as packaging resp, packaging err
        - IceAppController app-related operations
        - IceBaseController list page related operations
        - IceConfController tree configuration related operations
        - IceMockController mock related operations
    - dao database operation
    - enums enumeration
    - exception error handling
    - Nio and client communication related processing
    - service processing of some operations, crud...
- **ice-test** small demo, official website example, you can see it directly when you use it ,some initialization operations of ice-client spring client
- **ice-client-spring-boot-autoconfigure** prepared for stater, don't look at it
- **ice-client-spring-boot-starter** stater, which is convenient for direct introduction and use of spring-boot projects, no need to look at it