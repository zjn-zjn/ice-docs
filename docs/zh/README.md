---
home: true
title: 首页
heroImage: /images/hero.svg
actions:
  - text: 快速上手
    link: /zh/guide/getting-started.html
    type: primary
  - text: 项目简介
    link: /zh/guide/
    type: secondary
features:
  - title: 编排思想
    details: 全新的编排思想，在保障解耦和复用的同时，提供了更大的配置自由度。
  - title: 性能卓越
    details: 几乎不消耗任何性能，只需关注业务自身性能。
  - title: 接入简单
    details: 简单的学习成本，几分钟就能上手编排，开发配置与抽象成本低。
footer: Apache-2.0 Licensed | Copyright © 2022-present Waitmoon
---

### 非Spring支持
> 直接依赖ice-core即可

```java
  IceNioClient iceNioClient = new IceNioClient(1, "127.0.0.1:18121"); //传入app和server地址
  new Thread(iceNioClient::connect).start(); //connect()为阻塞方法，可启动新线程运行
  iceNioClient.destroy(); //使用完/应用关停后最好清理一下~ 
```

<!-- <CodeGroup>
  <CodeGroupItem title="1" active>

```bash
```

  </CodeGroupItem>

  <CodeGroupItem title="2">

```bash

```
  </CodeGroupItem>
</CodeGroup> -->
