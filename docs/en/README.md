---
home: true
title: 开源框架学习与分享
heroImage: /images/hero.svg
actions:
   - text: Get Started
     link: /en/guide/getting-started.html
     type: primary
   - text: Orchestration Logic
     link: https://waitmoon.com/ice-logic/en/
     type: secondary
   - text: Introduction
     link: /en/guide/
     type: secondary
features:
   - title: Orchestration Ideas
     details: The new orchestration idea provides greater freedom of configuration while ensuring decoupling and reuse, which greatly reduces the cost of rule maintenance.
   - title: High performance
     details: It consumes almost no performance, just focus on the performance of the business itself.
   - title: Access cost
     details: Low cost to learn to understand, develop configuration and abstraction.
---

### Latest version
> v${version}

```xml
<!-- SpringBoot 3.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-3x</artifactId>
  <version>${version}</version>
</dependency>

<!-- SpringBoot 2.x -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-spring-boot-starter-2x</artifactId>
  <version>${version}</version>
</dependency>

<!-- Non-SpringBoot -->
<dependency>
  <groupId>com.waitmoon.ice</groupId>
  <artifactId>ice-core</artifactId>
  <version>${version}</version>
</dependency>
```


### User list
> Who is using ice?

<div class="row">
<span class="link">
    <a href="https://www.agora.io" target="_blank">
        <img :src="$withBase('/images/user/agora.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.ximalaya.com" target="_blank">
        <img :src="$withBase('/images/user/xima.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.h3c.com" target="_blank">
        <img :src="$withBase('/images/user/h3c.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.tuhu.cn" target="_blank">
        <img :src="$withBase('/images/user/tuhu.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.htwins.com.cn" target="_blank">
        <img :src="$withBase('/images/user/huatai.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.lizhi.fm" target="_blank">
        <img :src="$withBase('/images/user/lizhi.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="http://www.china-hushan.com" target="_blank">
        <img :src="$withBase('/images/user/hushan.png')" class="no-zoom">
    </a>
</span>
</div>
<div class="row">
<span class="link">
    <a href="https://www.iflytek.com/" target="_blank">
        <img :src="$withBase('/images/user/iflytek.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.princesky.com/" target="_blank">
        <img :src="$withBase('/images/user/lampo.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="http://www.xibaoda.com/" target="_blank">
        <img :src="$withBase('/images/user/xibaoda.png')" class="no-zoom">
    </a>
</span>
<span class="link">
    <a href="https://www.zfire.top/" target="_blank">
        <img :src="$withBase('/images/user/zfire.png')" class="no-zoom">
    </a>
</span>
</div>
<br><br>

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

<div class="footer" style="font-size:12px">
  <p>
    Apache-2.0 Licensed | Copyright 2022-present WaitMoon | <a href="https://beian.miit.gov.cn">沪ICP备2025108706号</a>
  </p>
</div>

<style>
  .link {
    width: 8.4em;
    text-align: left;
  }
  .link img {
    height:1.5em;
    max-width:180px;
    margin: 14px;
  }
  .page-wwads{
    width:100%!important;
    min-height: 0;
    margin: 0;
  }
  .page-wwads .wwads-img img{
    width:80px!important;
  }
  .page-wwads .wwads-poweredby{
    width: 40px;
    position: absolute;
    right: 25px;
    bottom: 3px;
  }
  .wwads-content .wwads-text, .page-wwads .wwads-text{
    height: 100%;
    padding-top: 5px;
    display: block;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .introContent {
    margin-top: 15px;
    font-size: 14px;
  }

</style>
