# 架构设计

## 架构

<img src="/images/advanced/architecture.png" width="100%" height="100%">

**IceServer：** 提供页面操作及配置的存储和管理。

**IceClient：** 从server拉取&更新配置信息，缓存在Business内存中，提供执行接口。

## 节点类图

<img src="/images/advanced/class.png" width="100%" height="100%">

**BaseNode：** 所有ice节点的基类，提供通用节点操作，如节点生效时间等。

**BaseRelation：** 所有关系节点基类，拥有List\<BaseNode\> children。

**BaseLeaf：** 所有叶子节点基类，叶子节点为真正执行业务的节点。
