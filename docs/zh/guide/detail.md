# 详细指南

>快来接入使用吧~

## 节点开发

ice中有三种叶子节点类型，对应三种业务抽象

- *Flow 用于能控制业务流转的抽象，如各种判断或过滤条件，有明确的true和false返回
- *Result 用于一些结果的抽象，如发放各种奖励，有较为明确的true和false返回(如在奖励发放中，发了应该返回true，没发应该返回false)
- *None 用于一些无关业务流转的抽象，如查询信息，无返回值

节点开发过程中，选用自己需要的抽象叶子节点继承并实现对应方法即可。
- BaseLeaf* 使用IceContext作为方法入参，需要实现do*方法
- BaseLeafPack* 使用IcePack作为方法入参，需要实现doPack*方法 
- BaseLeafRoam* 使用IceRoam作为方法入参，需要实现doRoam*方法

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

视频地址：https://www.bilibili.com/video/BV1Q34y1R7KF

<iframe src="//player.bilibili.com/player.html?aid=807134055&bvid=BV1Q34y1R7KF&cid=456033283&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### app

app用于区分不同的应用，如app=1的ice-test，在ice-test启动时，会根据配置去ice-server拉取app为1的所有配置并初始化

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
- **debug** 节点的debug仅用于在processInfo中是否展现
- **invers** 反转节点，如节点本该返回false，反转后会返回true，如此ContainsFlow等节点类就不需要再额外开发一个NotContainsFlow 

### 发布、清除、导入、导出

- **发布** 所有的变更只有在发布后才会真实的热更新到client中，未发布的变更节点会有"^"标识
- **清除** 清除所有变更，恢复到上次发布版本
- **导入** 导入配置
- **导出** 导出当前配置(包含未发布的变更)
- **实例选择**
- - **Server** server配置，目前仅Server模式下支持编辑操作
- - **Client:host/app/uniqueId** 对应client中真实的配置展现，仅支持查看操作

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
        this.compiledExpression = AviatorEvaluator.compile(exp);
    }
}
```

## 节点报错处理 

- **统一处理：IceErrorHandle** 

设置IceErrorHandle的handle实例(继承IceErrorHandle并实现handle方法)，```IceErrorHanele.setHandle(IceErrorHandle customHandle)```改变所有的节点统一error处理；默认实现为DefaultIceErrorHandle：直接返回NodeRunStateEnum.SHUT_DOWN，不处理并终止整个流程。

- **叶子节点重写errorHandle方法**

叶子节点重写```NodeRunStateEnum errorHandle(IceContext cxt, Throwable t)```方法，处理当前叶子节点发生的error，如果返回NodeRunStateEnum.SHUT_DOWN将会终止整个流程。叶子节点如果重写了errorHandle方法。就不会再走统一error处理，不过可以通过```super.errorHandle(cxt, t)```再走一遍统一处理。

- **配置处理**

节点提供了iceErrorStateEnum配置，如果该配置非空，它的优先级最高，将首先使用配置作为返回值。配置处理只会影响返回值，依然会执行叶子节点重写的errorHandle方法/统一的handle处理方法。




