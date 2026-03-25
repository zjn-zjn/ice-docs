---
title: Python SDK
description: Ice Python SDK 完整集成指南，包含安装配置、装饰器注册叶子节点、同步/异步执行、AsyncFileClient 等。
keywords: Python SDK,Python规则引擎,ice-rules,Python业务编排,AsyncFileClient
---

# Python SDK

> Ice Python SDK（ice-rules），功能与 Java/Go SDK 对等。支持装饰器注册叶子节点和 asyncio 异步客户端。

## 安装

```bash
pip install ice-rules
```

## 快速开始

```python
import ice

# 装饰器注册叶子节点
@ice.leaf("com.example.ScoreFlow", name="分数判断")
class ScoreFlow:
    score: float = 0.0
    key: str = "score"

    def do_flow(self, roam):
        value = roam.get(self.key, 0.0)
        return value >= self.score

# 启动 Client
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()

# 执行规则
roam = ice.Roam.create(id=1)
roam.put("score", 85.0)
result = ice.sync_process(roam)
```

## 叶子节点开发

### 装饰器注册

```python
@ice.leaf(class_name, name=None, desc=None, order=0, alias=None)
```

- `class_name`：节点类名，与 Server 配置中的 confName 对应
- `name`：节点显示名称
- `desc`：节点描述
- `alias`：别名列表，兼容其他语言 SDK 配置的类名

SDK 根据实现的方法自动检测节点类型：

| 类型 | 方法 | 返回值 | 说明 |
|------|------|--------|------|
| **Flow** | `do_flow(roam)` | bool | 条件判断 |
| **Result** | `do_result(roam)` | bool | 业务操作 |
| **None** | `do_none(roam)` | None | 辅助操作 |

### 字段声明

使用 `Annotated` 类型注解添加字段描述：

```python
from typing import Annotated

@ice.leaf("com.example.AmountResult", name="金额发放")
class AmountResult:
    key: Annotated[str, ice.IceField(name="用户Key", desc="roam中用户ID的key")] = ""
    value: Annotated[float, ice.IceField(name="发放金额")] = 0.0

    # 不在配置界面显示
    _internal: str = ""  # 下划线前缀自动忽略

    def do_result(self, roam):
        uid = roam.get(self.key, 0)
        if uid <= 0 or self.value <= 0:
            return False
        return send_service.send_amount(uid, self.value)
```

也支持 `@ice.IceIgnore` 显式忽略字段。

### 生命周期钩子

```python
@ice.leaf("com.example.MyNode")
class MyNode:
    exp: str = ""

    def after_properties_set(self):
        """配置加载/更新后自动调用"""
        self.compiled = compile_expression(self.exp)
```

## 执行规则

### 同步执行

```python
roam = ice.Roam.create(id=1)
roam.put("uid", 12345)

# 多种调用方式
roam_list = ice.sync_process(roam)
result = ice.process_single_roam(roam)
results = ice.process_roam(roam)
```

### 异步执行

```python
import asyncio

roam = ice.Roam.create(id=1)
roam.put("uid", 12345)
roam_list = await ice.async_process(roam)
```

### 触发方式

```python
roam = ice.Roam.create(id=1)              # 按 iceId
roam = ice.Roam.create(scene="recharge")  # 按场景
roam = ice.Roam.create(nid=123)           # 按节点 ID
```

优先级：`ice_id` > `scene` > `nid`。

## Roam 操作

Roam 基于 `threading.RLock`，线程安全：

```python
roam = ice.Roam()

# 基础操作
roam.put("name", "Alice")
name = roam.get("name")
age = roam.get("age", 0)
score = roam.get("score", 0.0)
flag = roam.get("flag", False)

# 多级 key
roam.put_deep("user.profile.level", 5)
level = roam.get_deep("user.profile.level")

# 引用语法
roam.resolve("@user.profile.level")  # 5
```

## Client 配置

### 同步客户端

```python
client = ice.FileClient(
    app=1,
    storage_path="./ice-data",
    poll_interval=2,          # 版本轮询间隔（秒），默认 2
    heartbeat_interval=10,    # 心跳间隔（秒），默认 10
)
client.start()
client.wait_started()
client.destroy()
```

### 异步客户端

```python
client = ice.AsyncFileClient(
    app=1,
    storage_path="./ice-data",
)
await client.start()
await client.wait_started()
await client.destroy()
```

AsyncFileClient 使用 `asyncio.create_task()` 管理后台任务，文件 I/O 通过 `asyncio.to_thread()` 执行。

## 错误处理

### 全局错误处理

```python
def my_error_handler(node, ctx, error):
    print(f"节点 {node.ice_node_id} 执行出错: {error}")
    return ice.RunState.NONE  # 继续执行

ice.set_global_error_handler(my_error_handler)
```

### 节点级错误处理

```python
@ice.leaf("com.example.SafeNode")
class SafeNode:
    def do_result(self, roam):
        # 业务逻辑
        pass

    def error_handle(self, ctx, error):
        return ice.RunState.NONE  # 忽略错误，继续执行
```

## 下一步

- [Java SDK](/sdk/java.html) · [Go SDK](/sdk/go.html) — 其他语言 SDK
- [节点类型速查](/reference/node-types.html) — 所有关系节点和叶子节点
- [Roam API](/reference/roam-api.html) — 数据容器完整 API
