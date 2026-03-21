---
title: 常见问题
description: Ice 规则引擎使用中的常见问题和解决方案，涵盖架构、Client、Server、性能等方面。
keywords: Ice FAQ,常见问题,规则引擎问题,故障排查,性能优化
head:
  - - meta
    - property: og:title
      content: Ice 常见问题 FAQ
  - - meta
    - property: og:description
      content: Ice 规则引擎常见问题和解决方案。
---

# 常见问题

## 架构相关

### Ice 可以用来做工作流引擎吗？

Ice 是无状态的规则引擎，适合规则判断和业务编排。如需工作流的状态持久化、流程审批等功能，建议在 Ice 基础上二次开发。

### Server 和 Client 是如何通信的？

**不通过网络通信**。Server 将配置写入共享存储目录（`ice-data/`），Client 轮询文件系统获取更新。只需要它们能访问同一个目录即可。

### Server 挂了会影响 Client 吗？

不会。Client 只依赖共享存储目录，不依赖 Server 进程。Server 宕机后：
- 已启动的 Client 正常运行
- 新 Client 也可以正常启动（只要存储目录中有配置数据）
- 无法在 Server 界面修改和发布新配置

## Client 常见问题

### Client 无法加载配置

检查清单：
1. `storagePath` 是否和 Server 指向同一个 `ice-data` 目录
2. `app` 参数是否正确（对应 Server 中创建的应用 ID）
3. 应用是否有读取存储目录的权限
4. 存储目录中是否存在 `{app}/version.txt` 文件

### 配置更新不生效

常见原因：
1. 在 Server 修改配置后未点击「发布」
2. Client 默认 2 秒轮询一次，可能有几秒延迟
3. 检查 `version.txt` 是否已更新
4. 查看 Client 日志是否有加载配置的记录

### 启动时报节点类找不到

```
ERROR - class not found conf:{"confName":"com.example.MyFlow"}
```

原因：Client 中未找到对应的叶子节点类。检查：
1. 叶子节点类是否在扫描包路径下
2. 类名（confName）是否正确
3. 叶子节点类是否已编译和打包

未在业务中使用的节点报错可以忽略。

## Server 常见问题

### Server 支持集群吗？

支持。多个 Server 实例共享同一个 `ice-data` 目录即可。推荐使用 NFS、阿里云 NAS、AWS EFS 等共享存储。

### 如何备份配置

配置以 JSON 文件存储，直接复制目录即可：

```bash
cp -r ./ice-data ./ice-data-backup-$(date +%Y%m%d)
```

## 性能相关

### Ice 的性能怎么样？

- 纯内存计算，单次规则执行通常在 1ms 以内
- 配置同步基于文件系统，不影响执行性能
- 节点执行互不干扰，天然支持高并发

### 如何优化启动速度？

1. 精确指定叶子节点扫描包路径，避免全量扫描
2. 清理不再使用的节点配置
3. 使用 SSD 存储

## 更多

- [社区交流](/community/community.html) — 加入技术交流群
- [GitHub Issues](https://github.com/zjn-zjn/ice/issues) — 提交问题和建议
