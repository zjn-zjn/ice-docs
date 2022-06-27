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

- void syncProcess(IcePack pack) 同步执行
- List\<Future\<IceContext\>\> asyncProcess(IcePack pack) 异步执行并返回futures

业务中可能会往roam中又放入了执行结果等信息，在执行结束后可以从roam里获得想要的数据。

## IceRoam

roam提供了节点执行所需的数据源或存放执行结果供后续执行使用，roam为ConcurrentHashMap的扩展。

- put/get 重写了ConcurrentHashMap的put/get，忽略了ConcurrentHashMap的key/value空指针异常
- putValue/getValue 忽略了类型匹配校验，节约了强转操作，使用时注意类型是否匹配
- putMulti/getMulti 使用"."分隔并构建拥有层级关系型的数据结构
- getUnion 如果参数是以"@"开头的字符串会去roam里拿数据并返回，否则返回参数自身

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


















