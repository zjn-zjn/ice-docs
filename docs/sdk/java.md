---
title: Java SDK
description: Ice Java SDK 完整集成指南，包含依赖配置、Client 初始化、叶子节点开发、Spring 集成、规则执行和错误处理。
keywords: Java SDK,ice-core,Java规则引擎,Spring集成,叶子节点开发,IceFileClient
head:
  - - meta
    - property: og:title
      content: Java SDK 指南 - Ice 规则引擎 Java 客户端
  - - meta
    - property: og:description
      content: Ice Java SDK 完整集成指南，包含依赖配置、叶子节点开发、Spring 集成等。
---

# Java SDK

> Ice Java SDK（ice-core），提供规则执行引擎和文件客户端，集成到 Java/Spring 应用中。

## 依赖

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>4.0.6</version>
</dependency>
```

要求 Java 8+。

## 初始化 Client

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID
    "./ice-data",         // 共享存储路径（必须和 Server 同一目录）
    "com.your.package"    // 叶子节点扫描包
);
client.start();
```

完整参数版本：

```java
IceFileClient client = new IceFileClient(
    1,                              // app ID
    "./ice-data",                   // 共享存储路径
    -1,                             // 并行度（≤0 使用默认 ForkJoinPool）
    Set.of("com.your.package"),     // 扫描包集合
    2,                              // 版本轮询间隔（秒）
    10                              // 心跳上报间隔（秒）
);
```

带泳道：

```java
IceFileClient client = IceFileClient.newWithLane(
    1, "./ice-data", "com.your.package", "feature-xxx"
);
```

完整参数说明见 [Client 配置参考](/reference/client-config.html)。

## Spring 集成

Spring/SpringBoot 项目需要将 Spring 容器桥接给 Ice，使叶子节点能使用 `@Resource` / `@Autowired` 注入 Bean：

```java
@Configuration
public class IceConfig implements ApplicationContextAware {

    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        AutowireCapableBeanFactory bf = ctx.getAutowireCapableBeanFactory();
        IceBeanUtils.setFactory(new IceBeanUtils.IceBeanFactory() {
            @Override
            public void autowireBean(Object bean) { bf.autowireBean(bean); }
            @Override
            public boolean containsBean(String name) { return ctx.containsBean(name); }
            @Override
            public Object getBean(String name) { return ctx.getBean(name); }
        });
    }

    @Bean(destroyMethod = "destroy")
    public IceFileClient iceFileClient() throws Exception {
        IceFileClient client = new IceFileClient(1, "./ice-data", "com.your.package");
        client.start();
        return client;
    }
}
```

非 Spring 项目不需要这一步。

## 叶子节点开发

### 三种节点类型

| 类型 | 基类 | 返回值 | 用途 |
|------|------|--------|------|
| **Flow** | `BaseLeafFlow` | true / false | 条件判断 |
| **Result** | `BaseLeafResult` | true / false | 业务执行 |
| **None** | `BaseLeafNone` | 无 | 辅助操作 |

### Flow 节点示例

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class ScoreFlow extends BaseLeafFlow {

    private String key;
    private double score;

    @Override
    protected boolean doFlow(IceRoam roam) {
        Double value = roam.getDeep(key);
        return value != null && value >= score;
    }
}
```

### Result 节点示例

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafResult {

    @Resource
    private SendService sendService;

    private String key;
    private double value;

    @Override
    protected boolean doResult(IceRoam roam) {
        Integer uid = roam.getDeep(key);
        if (uid == null || value <= 0) {
            return false;
        }
        boolean res = sendService.sendAmount(uid, value);
        roam.put("SEND_AMOUNT", res);
        return res;
    }
}
```

### None 节点示例

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class TimeChangeNone extends BaseLeafNone {

    private long changeTime;

    @Override
    protected void doNone(IceRoam roam) {
        roam.put("requestTime", changeTime);
    }
}
```

### 节点注解

```java
@IceNode(
    name = "金额发放",
    desc = "向用户发放指定金额",
    order = 10,
    alias = {"amount_result"}  // 别名，兼容其他语言 SDK 配置的规则
)
public class AmountResult extends BaseLeafResult {

    @IceField(name = "用户Key", desc = "roam 中获取用户 ID 的 key")
    private String key;

    @IceField(name = "发放金额", desc = "发放的金额数值")
    private double value;

    @IceIgnore  // 不在配置界面展示
    private String internalField;
}
```

## 执行规则

### 组装 Roam

```java
IceRoam roam = IceRoam.create();
roam.setId(1L);          // 按 iceId 触发
// roam.setScene("recharge"); // 或按场景触发
// roam.setNid(123L);         // 或按节点 ID 触发

roam.put("uid", 12345);
roam.put("cost", 100);
```

触发优先级：`iceId` > `scene` > `nid`。

### 同步执行

```java
Ice.syncProcess(roam);
// 执行完毕后从 roam 获取结果
Object result = roam.get("SEND_AMOUNT");
```

### 异步执行

```java
List<Future<IceRoam>> futures = Ice.asyncProcess(roam);
for (Future<IceRoam> future : futures) {
    IceRoam result = future.get();
    // 处理结果
}
```

### 便捷方法

```java
IceRoam result = Ice.processSingle(roam);       // 单结果
List<IceRoam> roams = Ice.process(roam);         // 多结果
```

## 错误处理

三种方式，优先级从高到低：

### 1. 配置错误状态

在 Server 配置界面设置节点的 `iceErrorStateEnum`，指定报错时的返回状态。优先级最高。

### 2. 叶子节点重写 errorHandle

```java
@Override
public NodeRunStateEnum errorHandle(IceRoam roam, Throwable t) {
    log.error("节点执行失败", t);
    return NodeRunStateEnum.NONE; // 返回 NONE 继续执行
    // return NodeRunStateEnum.SHUT_DOWN; // 终止整个流程
}
```

### 3. 全局错误处理

```java
IceErrorHandle.setHandle((node, ctx, t) -> {
    log.error("全局错误处理 node:{}", node.getIceNodeId(), t);
    return NodeRunStateEnum.SHUT_DOWN;
});
```

## 与表达式引擎结合

Ice 可以融合 Aviator 等表达式引擎，简化条件配置：

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AviatorFlow extends BaseLeafFlow {

    private String exp;
    private Expression compiledExpression;

    @Override
    protected boolean doFlow(IceRoam roam) {
        return (boolean) compiledExpression.execute(roam);
    }

    public void setExp(String exp) {
        this.exp = exp;
        this.compiledExpression = AviatorEvaluator.compile(exp, true);
    }
}
```

配置 `exp` 为 Aviator 表达式（如 `cost >= 100`），即可在 Server 界面动态修改判断条件。

## 下一步

- [Go SDK](/sdk/go.html) · [Python SDK](/sdk/python.html) — 其他语言 SDK
- [节点类型速查](/reference/node-types.html) — 所有关系节点和叶子节点
- [Roam API](/reference/roam-api.html) — 数据容器完整 API
- [核心概念](/guide/concepts.html) — 理解树形编排设计思想
