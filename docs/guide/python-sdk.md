---
title: Python SDK
description: Ice 规则引擎 Python SDK 完整使用指南
head:
  - - meta
    - name: keywords
      content: ice,python,规则引擎,决策引擎,SDK
---

# Python SDK

Ice 规则引擎的 Python 实现，与 Java 和 Go SDK 功能完全一致。

## 安装

```bash
pip install ice-rules
```

**要求：** Python >= 3.11

## 快速开始

### 1. 定义叶子节点

使用 `@ice.leaf` 装饰器注册叶子节点，支持 `IceField` 字段描述和 `alias` 别名：

```python
import ice
from ice import Roam, IceField, IceIgnore
from typing import Annotated

@ice.leaf(
    "com.example.ScoreFlow",
    name="分数判断",
    desc="检查分数是否达标",
    alias=["score_flow"]  # 别名，用于多语言兼容
)
class ScoreFlow:
    """检查分数是否达标"""
    # 使用 Annotated + IceField 添加字段描述（推荐）
    threshold: Annotated[int, IceField(name="分数阈值", desc="判断的分数值")] = 0
    key: Annotated[str, IceField(name="取值键", desc="从roam取值的键名")] = "score"
    
    def do_roam_flow(self, roam: Roam) -> bool:
        return roam.get_int(self.key, 0) >= self.threshold


@ice.leaf("com.example.AmountResult", name="金额计算", desc="根据分数计算金额")
class AmountResult:
    """计算奖励金额"""
    multiplier: Annotated[float, IceField(name="倍率", desc="计算倍率")] = 1.0
    
    def do_roam_result(self, roam: Roam) -> bool:
        score = roam.get_int("score", 0)
        roam.put("amount", score * self.multiplier)
        return True


@ice.leaf("com.example.LogNone")
class LogNone:
    """日志记录"""
    def do_roam_none(self, roam: Roam) -> None:
        print(f"Processing: {roam}")
```

### 2. 启动客户端（同步方式）

```python
import ice
from ice import Pack

# 导入包含叶子节点定义的模块（确保装饰器被执行）
from my_flows import ScoreFlow, AmountResult

# 创建并启动客户端
client = ice.FileClient(app=1, storage_path="./ice-data")
client.start()

# 等待启动完成
client.wait_started()

# 执行规则
pack = Pack(ice_id=1)
pack.roam.put("score", 85)

results = ice.sync_process(pack)

# 获取结果
for ctx in results:
    print(f"Amount: {ctx.pack.roam.get('amount')}")
    print(f"Process: {ctx.get_process_info()}")

# 关闭客户端
client.destroy()
```

### 3. 异步方式

```python
import asyncio
import ice
from ice import Pack

async def main():
    # 创建异步客户端
    client = ice.AsyncFileClient(app=1, storage_path="./ice-data")
    await client.start()
    
    # 执行规则
    pack = Pack(ice_id=1)
    pack.roam.put("score", 85)
    
    results = await ice.async_process(pack)
    
    for ctx in results:
        print(f"Amount: {ctx.pack.roam.get('amount')}")
    
    await client.destroy()

asyncio.run(main())
```

## 叶子节点接口

Python SDK 支持 9 种叶子节点接口，根据实现的方法自动适配：

### Flow 类型（返回 True/False）

```python
@ice.leaf("com.example.Flow1")
class ContextFlow:
    def do_flow(self, ctx: ice.Context) -> bool:
        return ctx.pack.roam.get_int("score") > 60

@ice.leaf("com.example.Flow2")
class PackFlow:
    def do_pack_flow(self, pack: ice.Pack) -> bool:
        return pack.roam.get_int("score") > 60

@ice.leaf("com.example.Flow3")
class RoamFlow:
    def do_roam_flow(self, roam: ice.Roam) -> bool:
        return roam.get_int("score") > 60
```

### Result 类型（返回 True/False）

```python
@ice.leaf("com.example.Result1")
class ContextResult:
    def do_result(self, ctx: ice.Context) -> bool:
        ctx.pack.roam.put("result", "done")
        return True

@ice.leaf("com.example.Result2")
class PackResult:
    def do_pack_result(self, pack: ice.Pack) -> bool:
        pack.roam.put("result", "done")
        return True

@ice.leaf("com.example.Result3")
class RoamResult:
    def do_roam_result(self, roam: ice.Roam) -> bool:
        roam.put("result", "done")
        return True
```

### None 类型（无返回值）

```python
@ice.leaf("com.example.None1")
class ContextNone:
    def do_none(self, ctx: ice.Context) -> None:
        print(f"Processing {ctx.ice_id}")

@ice.leaf("com.example.None2")
class PackNone:
    def do_pack_none(self, pack: ice.Pack) -> None:
        print(f"TraceId: {pack.trace_id}")

@ice.leaf("com.example.None3")
class RoamNone:
    def do_roam_none(self, roam: ice.Roam) -> None:
        print(f"Score: {roam.get('score')}")
```

## Roam 数据结构

`Roam` 是线程安全的字典，用于存储业务数据：

```python
from ice import Roam

roam = Roam()

# 基本操作
roam.put("key", "value")
roam.put_multi({"a": 1, "b": 2})
value = roam.get("key")
value = roam.get("key", "default")

# 多级 key 访问
roam.put("user", {"name": "test", "profile": {"age": 25}})
name = roam.get_multi("user.name")  # "test"
age = roam.get_multi("user.profile.age")  # 25

# 引用其他 key
roam.put("score", 100)
roam.put("ref", "@score")
value = roam.get_union(roam.get("ref"))  # 100

# 类型安全获取
roam.get_str("key", "")
roam.get_int("key", 0)
roam.get_float("key", 0.0)
roam.get_bool("key", False)
roam.get_list("key")
roam.get_dict("key")
```

## 客户端配置

### 基础配置

```python
# 最简方式
client = ice.FileClient(app=1, storage_path="./ice-data")
```

### 完整配置

```python
client = ice.FileClient(
    app=1,                      # 应用 ID
    storage_path="./ice-data",  # 存储路径（与 ice-server 共享）
    parallelism=-1,             # 并行度（-1 使用 CPU 核数）
    poll_interval=5.0,          # 轮询间隔（秒）
    heartbeat_interval=30.0,    # 心跳间隔（秒）
)
```

### 生命周期

```python
# 启动
client.start()

# 等待启动完成（可选）
client.wait_started(timeout=30.0)

# 检查版本
print(f"Loaded version: {client.loaded_version}")

# 关闭
client.destroy()
```

## 自定义日志

```python
from ice.log import Logger, set_logger
from typing import Any


class MyLogger(Logger):
    def debug(self, msg: str, **kwargs: Any) -> None:
        print(f"[DEBUG] {msg} {kwargs}")
    
    def info(self, msg: str, **kwargs: Any) -> None:
        print(f"[INFO] {msg} {kwargs}")
    
    def warn(self, msg: str, **kwargs: Any) -> None:
        print(f"[WARN] {msg} {kwargs}")
    
    def error(self, msg: str, **kwargs: Any) -> None:
        print(f"[ERROR] {msg} {kwargs}")


# 设置自定义日志
set_logger(MyLogger())
```

## 字段描述与忽略

### 字段描述 (IceField)

使用 `typing.Annotated` 和 `IceField` 为字段添加描述：

```python
from typing import Annotated
from ice import IceField

@ice.leaf("com.example.MyNode")
class MyNode:
    # iceField - 在 UI 中显示名称和描述
    score: Annotated[float, IceField(name="分数阈值", desc="判断分数的阈值")] = 0.0
    key: Annotated[str, IceField(name="取值键", desc="从roam取值的键名")] = ""
    
    # hideField - 无 IceField，可配置但隐藏
    internal: str = ""
```

### 字段忽略 (IceIgnore)

不想被配置的字段可以忽略：

```python
from typing import Annotated
from ice import IceIgnore

@ice.leaf("com.example.MyNode")
class MyNode:
    # 方式1: _ 前缀 - 私有字段自动忽略
    _cache: dict = None
    
    # 方式2: IceIgnore - 显式忽略
    service: Annotated[Any, IceIgnore()] = None
```

### 别名 (Alias)

支持多语言兼容配置：

```python
@ice.leaf(
    "com.example.ScoreFlow",
    alias=["score_flow", "ScoreFlow"]  # 可响应多种类名
)
class ScoreFlow:
    ...
```

## 兼容性

- 可与 Java/Go SDK 共享 `ice-data` 目录
- JSON 序列化格式一致
- 节点类型和关系语义一致

## 完整示例

```python
import ice
from ice import Roam, Pack

# 定义叶子节点
@ice.leaf("com.example.ScoreCheck")
class ScoreCheck:
    threshold: int = 60
    
    def do_roam_flow(self, roam: Roam) -> bool:
        return roam.get_int("score", 0) >= self.threshold


@ice.leaf("com.example.CalculateReward")
class CalculateReward:
    rate: float = 0.1
    
    def do_roam_result(self, roam: Roam) -> bool:
        score = roam.get_int("score", 0)
        roam.put("reward", score * self.rate)
        return True


def main():
    # 启动客户端
    client = ice.FileClient(app=1, storage_path="./ice-data")
    client.start()
    client.wait_started()
    
    try:
        # 执行规则
        pack = Pack(ice_id=1)
        pack.roam.put("score", 85)
        pack.roam.put("userId", "user123")
        
        results = ice.sync_process(pack)
        
        for ctx in results:
            reward = ctx.pack.roam.get("reward")
            if reward:
                print(f"User reward: {reward}")
            else:
                print("Score too low, no reward")
            
            # 打印执行过程
            print(f"Process: {ctx.get_process_info()}")
    finally:
        client.destroy()


if __name__ == "__main__":
    main()
```

## 版本要求

- Python >= 3.11
- 无外部依赖（纯标准库）

## License

Apache-2.0

