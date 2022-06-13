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
     details: The brand-new orchestration idea provides greater freedom of configuration while ensuring decoupling and reuse.
   - title: High performance
     details: It consumes almost no performance, just focus on the performance of the business itself.
   - title: Access cost
     details: Low cost to learn to understand, develop configuration and abstraction.
footer: Apache-2.0 Licensed | Copyright © 2022-present Waitmoon
---

### Non-Spring Support
> Directly rely on ice-core intelligence

````java
  IceNioClient iceNioClient = new IceNioClient(1, "127.0.0.1:18121"); // application and server addresses
  New thread (iceNioClient::connect).start(); //connect() is a block method, which can run with new thread
  iceNioClient.destroy(); //It's best to clean up after application shutdown~
````

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