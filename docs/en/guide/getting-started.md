---
title: Getting Started
description: Complete guide to getting started with the Ice rule engine. Covers Server deployment, Client SDK integration, leaf node development, and rule execution.
keywords: rule engine setup,getting started,installation guide,Docker deployment,Client SDK,Java,Go,Python
head:
  - - meta
    - property: og:title
      content: Ice Getting Started - Deploy and Run Your First Rule in 5 Minutes
  - - meta
    - property: og:description
      content: Complete guide to getting started with the Ice rule engine, covering Server deployment, Client SDK integration, and more.
---

# Getting Started

> Deploy, integrate, and execute your first rule with the Ice rule engine in 5 minutes.

## Prerequisites

Ice consists of three components:

- **Ice Server** -- Visual rule configuration management platform with a Web interface
- **Ice Client** -- Rule execution SDK integrated into your business application
- **Shared Storage** -- Server and Client synchronize configurations through a shared file directory (`ice-data/`), with no network communication required

```
Server --> writes config --> ice-data/ <-- reads config <-- Client
```

## Step 1: Deploy the Server

### Docker Deployment (Recommended)

```bash
docker run -d --name ice-server \
  -p 8121:8121 \
  -v ./ice-data:/app/ice-data \
  waitmoon/ice-server:latest
```

After startup, visit **http://localhost:8121** to access the management interface.

Online demo: [eg.waitmoon.com](https://eg.waitmoon.com/app/1/base/%E6%B5%8B%E8%AF%95/1)

### Manual Deployment

Download the package for your platform from [waitmoon.com/downloads](https://waitmoon.com/downloads/4.0.4/):

```bash
tar -xzvf ice-server-linux-amd64.tar.gz && cd ice-server-linux-amd64
sh ice.sh start
```

## Step 2: Integrate the Client SDK

Add the dependency to your business application and start the Client. The Server and Client must share the same `ice-data` directory.

<CodeGroup>
  <CodeGroupItem title="Java" active>

**Add Dependency**

```xml
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>4.0.0</version>
</dependency>
```

**Start the Client**

```java
IceFileClient client = new IceFileClient(
    1,                    // app ID (corresponds to the app created in Server)
    "./ice-data",         // shared storage path
    "com.your.package"    // package path for leaf node scanning
);
client.start();
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

**Add Dependency**

```bash
go get github.com/zjn-zjn/ice/sdks/go
```

**Start the Client**

```go
client, err := ice.NewClient(1, "./ice-data")
if err != nil {
    log.Fatal(err)
}
client.Start()
defer client.Destroy()
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

**Add Dependency**

```bash
pip install ice-rules
```

**Start the Client**

```python
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()
```

  </CodeGroupItem>
</CodeGroup>

::: tip Spring Projects
Spring/SpringBoot projects require an additional bridge class so that leaf nodes can inject Spring Beans. See [Java SDK Guide](/en/sdk/java.html#spring-integration) for details.
:::

## Step 3: Develop Leaf Nodes

Leaf nodes are where business logic is executed. Extend the corresponding base class, and fields in the class will automatically appear in the Server configuration interface:

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class AmountResult extends BaseLeafResult {

    private String key;      // Configurable in Server interface
    private double value;    // Configurable in Server interface

    @Override
    protected boolean doResult(IceRoam roam) {
        Integer uid = roam.getDeep(key);
        if (uid == null || value <= 0) {
            return false;
        }
        return sendService.sendAmount(uid, value);
    }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
type AmountResult struct {
    Key   string  `json:"key"`
    Value float64 `json:"value"`
}

func (a *AmountResult) DoResult(ctx context.Context, roam *icecontext.Roam) bool {
    uid := roam.Value(a.Key).IntOr(0)
    if uid <= 0 || a.Value <= 0 {
        return false
    }
    return sendService.SendAmount(ctx, uid, a.Value)
}

func init() {
    ice.RegisterLeaf("com.example.AmountResult", nil, func() any {
        return &AmountResult{}
    })
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
@ice.leaf("com.example.AmountResult")
class AmountResult:
    key: str = ""
    value: float = 0.0

    def do_result(self, roam):
        uid = roam.get(self.key, 0)
        if uid <= 0 or self.value <= 0:
            return False
        return send_service.send_amount(uid, self.value)
```

  </CodeGroupItem>
</CodeGroup>

## Step 4: Configure and Execute

### Configure Rules in Server

1. Create an App
2. Create a new Rule (Ice) and obtain its iceId
3. Add relation nodes and leaf nodes to compose the rule tree
4. Configure leaf node parameters
5. Click **Publish**

### Execute in Code

<CodeGroup>
  <CodeGroupItem title="Java" active>

```java
IceRoam roam = IceRoam.create();
roam.getIceMeta().setId(1L);
roam.put("uid", 12345);
Ice.syncProcess(roam);
```

  </CodeGroupItem>

  <CodeGroupItem title="Go">

```go
roam := ice.NewRoamWithMeta()
roam.GetMeta().Id = 1
roam.Put("uid", 12345)
ice.SyncProcess(context.Background(), roam)
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
roam = ice.Roam.create(id=1)
roam.put("uid", 12345)
ice.sync_process(roam)
```

  </CodeGroupItem>
</CodeGroup>

## Shared Storage Deployment Options

| Scenario | Solution |
|----------|----------|
| Local development | Server and Client use the same local path |
| Docker | Mount to the same host directory using `-v` |
| Distributed deployment | NFS / AWS EFS / GCP Filestore |

## Common Issues

**Client cannot load configuration?**
Check that `storagePath` points to the same `ice-data` directory as the Server.

**Rule changes not taking effect?**
Make sure you clicked "Publish" in the Server interface. The Client polls for configuration changes every 2 seconds by default.

**Node class not found on startup?**
Verify that the leaf node class is under the scan package path configured in the Client, and that the class name is correct.

For more issues, see [FAQ](/en/guide/faq.html).

## Next Steps

- [Core Concepts](/en/guide/concepts.html) -- Understand the design philosophy of tree-based orchestration
- [Architecture](/en/guide/architecture.html) -- How Server / Client / shared storage work together
- [Java SDK](/en/sdk/java.html) | [Go SDK](/en/sdk/go.html) | [Python SDK](/en/sdk/python.html) -- Complete SDK references
