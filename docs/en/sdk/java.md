---
title: Java SDK
description: Complete integration guide for the Ice Java SDK, including dependency configuration, Client initialization, leaf node development, Spring integration, rule execution, and error handling.
keywords: Java SDK,ice-core,Java rule engine,Spring integration,leaf node development,IceFileClient
head:
  - - meta
    - property: og:title
      content: Java SDK Guide - Ice Rule Engine Java Client
  - - meta
    - property: og:description
      content: Complete integration guide for the Ice Java SDK, including dependency configuration, leaf node development, Spring integration, and more.
---

# Java SDK

> Ice Java SDK (ice-core) provides the rule execution engine and file client for integration into Java/Spring applications.

## Dependency

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>4.0.7</version>
</dependency>
```

Requires Java 8+.

## Initializing the Client

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID
    "./ice-data",         // shared storage path (must be the same directory as Server)
    "com.your.package"    // leaf node scan package
);
client.start();
```

Full parameter version:

```java
IceFileClient client = new IceFileClient(
    1,                              // app ID
    "./ice-data",                   // shared storage path
    -1,                             // parallelism (<=0 uses default ForkJoinPool)
    Set.of("com.your.package"),     // scan package set
    2,                              // version poll interval (seconds)
    10                              // heartbeat interval (seconds)
);
```

With lane:

```java
IceFileClient client = IceFileClient.newWithLane(
    1, "./ice-data", "com.your.package", "feature-xxx"
);
```

See [Client Configuration Reference](/en/reference/client-config.html) for full parameter documentation.

## Spring Integration

Spring/SpringBoot projects need to bridge the Spring container to Ice so that leaf nodes can use `@Resource` / `@Autowired` to inject Beans:

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

Non-Spring projects do not need this step.

## Leaf Node Development

### Three Node Types

| Type | Base Class | Return Value | Purpose |
|------|-----------|-------------|---------|
| **Flow** | `BaseLeafFlow` | true / false | Conditional checks |
| **Result** | `BaseLeafResult` | true / false | Business execution |
| **None** | `BaseLeafNone` | none | Auxiliary operations |

### Flow Node Example

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

### Result Node Example

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

### None Node Example

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

### Node Annotations

```java
@IceNode(
    name = "Amount Dispenser",
    desc = "Dispense a specified amount to the user",
    order = 10,
    alias = {"amount_result"}  // Alias for compatibility with rules configured by other language SDKs
)
public class AmountResult extends BaseLeafResult {

    @IceField(name = "User Key", desc = "Key to retrieve user ID from roam")
    private String key;

    @IceField(name = "Dispense Amount", desc = "The amount to dispense")
    private double value;

    @IceIgnore  // Hidden from the configuration interface
    private String internalField;
}
```

## Executing Rules

### Assembling a Roam

```java
IceRoam roam = IceRoam.create();
roam.setId(1L);          // Trigger by iceId
// roam.setScene("recharge"); // Or trigger by scene
// roam.setNid(123L);         // Or trigger by node ID

roam.put("uid", 12345);
roam.put("cost", 100);
```

Trigger priority: `iceId` > `scene` > `nid`.

### Synchronous Execution

```java
Ice.syncProcess(roam);
// Retrieve results from roam after execution
Object result = roam.get("SEND_AMOUNT");
```

### Asynchronous Execution

```java
List<Future<IceRoam>> futures = Ice.asyncProcess(roam);
for (Future<IceRoam> future : futures) {
    IceRoam result = future.get();
    // Process result
}
```

### Convenience Methods

```java
IceRoam result = Ice.processSingle(roam);       // Single result
List<IceRoam> roams = Ice.process(roam);         // Multiple results
```

## Error Handling

Three approaches, in descending order of priority:

### 1. Configure Error State

Set the node's `iceErrorStateEnum` in the Server configuration interface to specify the return state on error. This has the highest priority.

### 2. Override errorHandle in Leaf Nodes

```java
@Override
public NodeRunStateEnum errorHandle(IceRoam roam, Throwable t) {
    log.error("Node execution failed", t);
    return NodeRunStateEnum.NONE; // Return NONE to continue execution
    // return NodeRunStateEnum.SHUT_DOWN; // Terminate the entire flow
}
```

### 3. Global Error Handler

```java
IceErrorHandle.setHandle((node, ctx, t) -> {
    log.error("Global error handler node:{}", node.getIceNodeId(), t);
    return NodeRunStateEnum.SHUT_DOWN;
});
```

## Integration with Expression Engines

Ice can integrate with expression engines like Aviator to simplify condition configuration:

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

Configure `exp` as an Aviator expression (e.g., `cost >= 100`) to dynamically modify evaluation conditions in the Server interface.

## Next Steps

- [Go SDK](/en/sdk/go.html) | [Python SDK](/en/sdk/python.html) -- Other language SDKs
- [Node Type Reference](/en/reference/node-types.html) -- All relation and leaf node types
- [Roam API](/en/reference/roam-api.html) -- Complete data container API
- [Core Concepts](/en/guide/concepts.html) -- Understand tree-based orchestration design philosophy
