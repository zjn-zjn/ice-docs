---
title: Ice 详细说明 - 完整的功能和配置文档
description: Ice规则引擎的详细功能说明文档，包括节点类型、关系配置、错误处理、存储架构等高级特性的完整介绍。
keywords: 规则引擎文档,功能说明,配置详解,高级特性,节点类型,Ice配置
head:
  - - meta
    - property: og:title
      content: Ice 详细说明 - 完整的功能和配置文档
  - - meta
    - property: og:description
      content: Ice规则引擎的详细功能说明文档，包括节点类型、关系配置、错误处理、存储架构等高级特性。
---

# Ice 规则引擎详细指南

> Ice 规则引擎完整功能说明，助您深度掌握可视化业务编排

## 规则引擎节点开发

Ice 规则引擎采用节点化设计，每个节点代表一个独立的业务逻辑单元。通过组合不同类型的节点，可以实现复杂的业务规则编排。

### 三种叶子节点类型

Ice 规则引擎提供三种叶子节点类型，对应不同的业务场景：

#### 1. Flow 节点 - 流程控制
- **用途**：控制业务流转的规则节点
- **场景**：判断条件、过滤规则、权限校验等
- **返回值**：明确的 true（通过）或 false（不通过）
- **示例**：用户等级判断、金额范围校验、时间条件过滤

#### 2. Result 节点 - 结果处理  
- **用途**：执行具体业务操作的规则节点
- **场景**：发放奖励、扣减库存、发送通知等
- **返回值**：true（执行成功）或 false（执行失败）
- **示例**：优惠券发放、积分赠送、余额充值

#### 3. None 节点 - 辅助操作
- **用途**：不影响业务流转的辅助节点
- **场景**：数据查询、日志记录、信息装配等
- **返回值**：无返回值（none）
- **示例**：用户信息查询、埋点上报、缓存预热

### 节点注解

Ice 2.0 提供了节点注解来丰富节点的元信息：

```java
@IceNode(
    name = "金额发放",
    desc = "向用户发放指定金额",
    order = 10  // 排序优先级，值越小越靠前
)
public class AmountResult extends BaseLeafRoamResult {
    // ...
}
```

#### 字段注解

```java
@Data
public class AmountResult extends BaseLeafRoamResult {

    @IceField(name = "用户Key", desc = "roam中获取用户ID的key")
    private String key;

    @IceField(name = "发放金额", desc = "发放的金额数值", type = "double")
    private double value;

    @IceIgnore  // 忽略此字段，不在配置界面展示
    private String internalField;
}
```

### 节点基类选择

Ice 规则引擎提供三种基类供开发者继承，根据入参类型选择：

- **BaseLeaf\*** - 使用 IceContext 作为方法入参，需要实现 do* 方法
- **BaseLeafPack\*** - 使用 IcePack 作为方法入参，需要实现 doPack* 方法  
- **BaseLeafRoam\*** - 使用 IceRoam 作为方法入参，需要实现 doRoam* 方法

**例：**

```java
/**
 * 发放余额节点
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafRoamResult { //需要发放的uid从roam获取，因此继承BaseLeafRoamResult即可

    @Resource
    private SendService sendService; //如果是spring应用，可以直接使用springbean，非Spring应用请初始化IceBeanUtils的IceBeanFactory用于装配自己需要的实例

    private String key; //可供配置的uidKey

    private double value; //可供配置的发放余额值value

    @Override
    protected boolean doRoamResult(IceRoam roam) { //需要实现doRoamResult(即自己的业务内容)
        Integer uid = roam.getMulti(key); //从roam里拿到需要发放余额的用户uid
        if (uid == null || value <= 0) {
            return false;
        }
        boolean res = sendService.sendAmount(uid, value); //调用第三方接口发放余额(给uid发value值的余额)
        roam.put("SEND_AMOUNT", res); //业务中想把发放结果再放回roam，也许供后续使用
        return res; //返回发放结果
    }
}
```

## 执行Ice

### 组装IcePack

pack为执行ice前需要组装的包裹

- **iceId** 需要触发的规则id，对应配置后台的ID，iceId只能触发一条配置的规则
- **scene** 需要触发的场景，所有订阅该场景的规则都会触发
- **confId** 以任意节点ID为root触发规则
- **requestTime** 请求时间，默认System.currentTimeMillis()
- **roam** 放入执行规则所需的参数等信息
- **traceId** 链路ID，默认自动生成
- **debug** 日志打印，参考DebugEnum 最终执行的debug为 handler.debug|pack.debug

### 调用Ice方法

- **void syncProcess(IcePack pack)** 同步执行
- **List\<Future\<IceContext\>\> asyncProcess(IcePack pack)** 异步执行并返回futures

业务中可能会往roam中又放入了执行结果等信息，在执行结束后可以从roam里获得想要的数据。

## IceRoam

roam提供了节点执行所需的数据源或存放执行结果供后续执行使用，roam为ConcurrentHashMap的扩展。

- **put/get** 重写了ConcurrentHashMap的put/get，忽略了ConcurrentHashMap的key/value空指针异常
- **putValue/getValue** 忽略了类型匹配校验，节约了强转操作，使用时注意类型是否匹配
- **putMulti/getMulti** 使用"."分隔并构建拥有层级关系型的数据结构
- **getUnion** 如果参数是以"@"开头的字符串会去roam里拿数据并返回，否则返回参数自身

```java
roam.putValue("a", 1); //{"a":1}
roam.getValue("a"); //1
roam.putMulti("b.c", 2); //{"a":1,"b":{"c":2}}
roam.putMulti("b.d", 3); //{"a":1,"b":{"c":2,"d":3}}
roam.getMutli("b"); //{"c":2,"d":3}
roam.getMutli("b.c"); //2
roam.getUnion("a"); //"a"
roam.getUnion("@a"); //1
roam.getUnion(1); //1
roam.put("e", "@a");
roam.getUnion("@e");//1
roam.put("e", "a");
roam.getUnion("@e");//"a"
```

## 后台配置

视频地址：[https://www.bilibili.com/video/BV1Q34y1R7KF](https://www.bilibili.com/video/BV1Q34y1R7KF)

<iframe src="//player.bilibili.com/player.html?aid=807134055&bvid=BV1Q34y1R7KF&cid=456033283&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### app

app用于区分不同的应用，如app=1的ice-test，在ice-test启动时，会根据配置从文件系统拉取app为1的所有配置并初始化

### 新增ice

- **ID** iceId 可以通过iceId触发
- **名称** 描述
- **场景** 订阅的场景，可用","分隔订阅多个场景，当任一场景发生时触发
- **配置ID** ice树的root节点Id
- **Debug** 日志打印，参考DebugEnum，将需要打印的内容对应的值进行累加，如想要打印IN_PACK(执行ice前的Pack-1)和PROCESS(执行过程-2)
- **操作**
- - **编辑** 编辑ice
- - **查看详情**  查看详细节点配置
- - **备份** 备份配置
- - **备份历史** 可以从历史备份中恢复
- - **导出** 导出当前配置(包含未发布的变更)

### 配置节点

单击节点，弹出相关操作

- **查看/编辑节点**
- **添加子节点** 仅限关系关系节点
- **添加前置节点** 添加前置执行节点
- **转换节点** 可将当前节点转换成任意节点
- **上下移节点** 移动节点
- **删除本节点** 节点的删除为软删除，只是断开连接，并未物理删除，可通过添加节点ID的方式添加回来

**其他配置：** 
- **confName** 叶子节点的类名，第一次添加的叶子节点需要手动输入全类名，并会有校验该类是否在client中真实存在，添加叶子节点时需要有一个运行中的client用于校验
- **节点ID** 通过节点ID的方式添加子节点即为对象级别复用性的体现，ID相同的节点在内存中只会有一份，更改其中之一其余的都会一起变化
- **记录** 节点的debug仅用于在processInfo中是否展现
- **反转** 反转节点，如节点本该返回false，反转后会返回true，如此ContainsFlow等节点类就不需要再额外开发一个NotContainsFlow 

### 发布、清除、导入、导出

- **发布** 所有的变更只有在发布后才会真实的热更新到client中，未发布的变更节点会有"^"标识
- **清除** 清除所有变更，恢复到上次发布版本
- **导入** 导入配置
- **导出** 导出当前配置(包含未发布的变更)
- **实例选择**
- - **Server** server配置，目前仅Server模式下支持编辑操作
- - **Client:host/app/uniqueId** 对应client中真实的配置展现，仅支持查看操作

## 存储架构（2.0新特性）

Ice 2.0 采用文件系统存储，完全移除了对MySQL的依赖。

### 目录结构

```
ice-data/
├── apps/                    # 应用配置
│   ├── _id.txt             # 应用ID生成器
│   └── {app}.json          # 应用配置文件
├── clients/                 # 客户端信息
│   └── {app}/              # 按应用分组
│       ├── {address}.json  # 客户端心跳文件
│       └── _latest.json    # 最新客户端信息（O(1)读取）
└── {app}/                   # 应用规则配置
    ├── version.txt         # 当前版本号
    ├── _base_id.txt        # Base ID生成器
    ├── _conf_id.txt        # Conf ID生成器
    ├── _push_id.txt        # Push ID生成器
    ├── bases/              # Base规则配置
    │   └── {baseId}.json
    ├── confs/              # Conf节点配置
    │   └── {confId}.json
    ├── updates/            # 待发布的变更
    │   └── {iceId}/
    │       └── {confId}.json
    ├── versions/           # 版本增量更新
    │   └── {version}_upd.json
    └── history/            # 发布历史
        └── {pushId}.json
```

### 版本同步机制

1. **Server 发布配置**：
   - 更新 `bases/` 和 `confs/` 目录下的配置文件
   - 生成增量更新文件写入 `versions/{version}_upd.json`
   - 更新 `version.txt` 版本号

2. **Client 轮询更新**：
   - 定期检查 `version.txt` 版本号
   - 发现新版本后读取增量更新文件
   - 如增量文件缺失则进行全量加载

3. **心跳机制**：
   - Client 定期写入心跳文件到 `clients/{app}/`
   - Server 通过心跳文件判断 Client 是否在线
   - 超时未更新的 Client 被标记为离线

### 配置文件格式

所有配置以 JSON 格式存储，便于版本控制和人工审查。

**Base 配置示例：**

```json
{
  "id": 1,
  "app": 1,
  "name": "用户等级活动",
  "scenes": "user_login,user_upgrade",
  "confId": 1,
  "status": 1,
  "debug": 0,
  "createAt": 1701234567890,
  "updateAt": 1701234567890
}
```

**Conf 配置示例：**

```json
{
  "id": 1,
  "app": 1,
  "confId": 1,
  "type": 5,
  "confName": "com.ice.test.flow.LevelFlow",
  "confField": "{\"level\": 5}",
  "sonIds": "2,3",
  "status": 1,
  "createAt": 1701234567890,
  "updateAt": 1701234567890
}
```

## 多实例部署

### 共享存储方案

多个 Server/Client 实例需要共享同一个存储目录：

```yaml
# docker-compose.yml 示例
services:
  ice-server-1:
    image: waitmoon/ice-server:2.0.0
    ports:
      - "8121:8121"
    volumes:
      - /shared/ice-data:/app/ice-data  # 共享存储

  ice-server-2:
    image: waitmoon/ice-server:2.0.0
    ports:
      - "8122:8121"
    volumes:
      - /shared/ice-data:/app/ice-data  # 同一共享存储
```

### 推荐共享存储方案

- **NFS**：网络文件系统，适合内网环境
- **云盘**：阿里云NAS、AWS EFS等云存储服务
- **分布式文件系统**：GlusterFS、CephFS等

## 与表达式引擎结合

ice可以融合如Aviator等各种表达式引擎，简化节点配置。

**例：**
以Aviator为例，如果想要做一个基于Aviator的Flow节点：

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AviatorFlow extends BaseLeafRoamFlow {

    private String exp;//可供配置与热更新的Aviator表达式

    private Expression compiledExpression;

    @Override
    protected boolean doRoamFlow(IceRoam roam) {
        return (boolean) compiledExpression.execute(roam);
    }

    public void setExp(String exp) { //为了更好的性能，设置/更新表达式时重新编译
        this.exp = exp;
        this.compiledExpression = AviatorEvaluator.compile(exp, true);
    }
}
```

## 节点报错处理 

- **统一处理：IceErrorHandle** 

设置IceErrorHandle的handle实例(继承IceErrorHandle并实现handle方法)，```IceErrorHandle.setHandle(IceErrorHandle customHandle)```改变所有的节点统一error处理；默认实现为DefaultIceErrorHandle：直接返回NodeRunStateEnum.SHUT_DOWN，不处理并终止整个流程。

- **叶子节点重写errorHandle方法**

叶子节点重写```NodeRunStateEnum errorHandle(IceContext cxt, Throwable t)```方法，处理当前叶子节点发生的error，如果返回NodeRunStateEnum.SHUT_DOWN将会终止整个流程。叶子节点如果重写了errorHandle方法。就不会再走统一error处理，不过可以通过```super.errorHandle(cxt, t)```再走一遍统一处理。

- **配置处理**

节点提供了iceErrorStateEnum配置，如果该配置非空，它的优先级最高，将首先使用配置作为返回值。配置处理只会影响返回值，依然会执行叶子节点重写的errorHandle方法/统一的handle处理方法。

## Server 配置详解

Ice Server 的完整配置项：

```yml
server:
  port: 8121

ice:
  storage:
    # 文件存储路径
    path: ./ice-data
  
  # 客户端失活超时时间(秒)
  # 超过此时间未更新心跳的客户端将被标记为离线
  client-timeout: 60
  
  # 版本文件保留数量
  # 超过此数量的旧版本增量文件将被清理
  version-retention: 1000
```

## Client 配置详解

Ice Client 的完整配置项：

```yml
ice:
  # 应用ID（必填）
  app: 1
  
  storage:
    # 文件存储路径（必填，需与Server共享）
    path: ./ice-data
  
  # 叶子节点扫描包路径
  # 多个包用逗号分隔，不配置则扫描全部（较慢）
  scan: com.ice.test
  
  # 版本轮询间隔(秒)，默认5秒
  poll-interval: 5
  
  # 心跳更新间隔(秒)，默认10秒
  heartbeat-interval: 10
  
  pool:
    # 线程池并行度，默认-1使用ForkJoinPool默认配置
    parallelism: -1
```
