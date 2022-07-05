---
home: true
title: Home
heroImage: /images/hero.svg
actions:
   - text: Get started
     link: /guide/getting-started.html
     type: primary
   - text: Introduction
     link: /guide/
     type: secondary
features:
   - title: Orchestration Ideas
     details: The new orchestration idea provides greater freedom of configuration while ensuring decoupling and reuse, which greatly reduces the cost of rule maintenance.
   - title: High performance
     details: It consumes almost no performance, just focus on the performance of the business itself.
   - title: Access cost
     details: Low cost to learn to understand, develop configuration and abstraction.
footer: Apache-2.0 Licensed | Copyright © 2022-present Waitmoon
---

### Non-Spring Support
> Directly rely on ice-core intelligence

```java
IceNioClient iceNioClient = new IceNioClient(1, "127.0.0.1:18121", "com.ice.test"); //Incoming app, server address and leaf node scan path
iceNioClient.connect(); //Connect to the remote server and initialize the ice configuration
iceNioClient.destroy(); //It is best to clean up after the application is closed~
```

<!-- ### test
<CodeGroup>
   <CodeGroupItem title="1" active>

```bash
````

   </CodeGroupItem>

   <CodeGroupItem title="2">

```bash

````
   </CodeGroupItem>
</CodeGroup> -->