---
title: Ice FAQ - Frequently Asked Questions
description: Common questions and solutions for Ice rule engine, including performance optimization, troubleshooting, and best practices.
keywords: FAQ,common questions,troubleshooting,best practices,rule engine FAQ,Ice questions
head:
  - - meta
    - property: og:title
      content: Ice FAQ - Frequently Asked Questions
  - - meta
    - property: og:description
      content: Common questions and solutions for Ice rule engine including performance optimization, troubleshooting, and best practices.
---

# Ice Rule Engine FAQ

> Frequently asked questions about Ice rule engine to help you solve problems quickly

## About Ice Rule Engine

### Can Ice Rule Engine be used directly as a workflow engine?

Ice rule engine itself is a stateless lightweight rule engine. If you need workflow engine functionality, it's recommended to build on top of Ice rule engine with secondary development.

**Ice Rule Engine Positioning**:
- Ice is an abstract business orchestration framework, similar to abstracting a method
- In theory, whatever logic code can implement, Ice rule engine can implement
- Suitable for rule configuration, conditional judgment, business orchestration scenarios
- For workflow features like state persistence and process approval, additional development is needed

### Differences between Ice Rule Engine and Traditional Rule Engines?

Compared to traditional rule engines like Drools and Activiti, Ice rule engine offers:
- **More Lightweight**: Zero performance overhead, pure in-memory computation
- **More Flexible**: Tree-based orchestration structure, independent nodes, modifications don't interfere
- **Easier to Use**: Visual configuration, low learning curve
- **Faster**: Millisecond response, suitable for high-concurrency scenarios

## Architecture Questions (Ice 2.0)

### How do Ice Server and Client communicate?

**Ice 2.0 Architecture**:

Ice 2.0 uses a **file system synchronization** architecture. Server and Client **do not communicate directly over the network**:

- Server writes configurations to a shared storage directory (`ice-data/`)
- Client obtains configuration updates by **polling the file system**
- Heartbeat information is also implemented by writing files

```
Server → Write config → Shared Storage (ice-data/) ← Read config ← Client
```

**This means**:
- No network connectivity needed between Server and Client
- They only need access to the same storage directory
- Supports distributed storage solutions like NFS, cloud drives

### Will inaccessible shared storage affect configuration updates?

**Ice Rule Engine Storage Fault Tolerance Mechanism**:

- **Local Cache**: Client loads configuration into memory after startup
- **Polling Mechanism**: Client checks `version.txt` file every 5 seconds by default
- **Incremental Updates**: Only loads changed configurations, reducing IO overhead
- **Full Load Fallback**: If incremental file is missing, automatically performs full load

**Important Notes**:
- During shared storage failure, Client's rule configuration won't be updated
- But already loaded configurations can still execute normally
- Latest configurations will auto-sync after storage recovery

### How to achieve high availability?

Ice 2.0 achieves high availability through **shared storage**:

- Use NFS, Alibaba Cloud NAS, AWS EFS, etc. as shared storage
- Multiple Server instances can write simultaneously (mind concurrent control)
- Multiple Client instances can read simultaneously

```yaml
# docker-compose.yml example
services:
  ice-server-1:
    volumes:
      - /shared/ice-data:/app/ice-data
  ice-server-2:
    volumes:
      - /shared/ice-data:/app/ice-data
  client-1:
    volumes:
      - /shared/ice-data:/app/ice-data
```

## Client Common Questions

### Client not loading configuration?

**Checklist**:

1. **Check storage path**: Confirm `ice.storage.path` shares the same directory with Server
2. **Check App ID**: Confirm `ice.app` is configured correctly
3. **Check directory permissions**: Confirm application has read permission for storage directory
4. **Check version file**: Confirm `{app}/version.txt` file exists in storage directory

### Configuration updates not taking effect?

**Common Causes**:

1. **Not published**: Need to click "Publish" button after modifying config in Server
2. **Polling interval**: Client polls every 5 seconds by default, may have delay
3. **Version file**: Check if `version.txt` has been updated
4. **Check logs**: Look for configuration loading records in Client logs

### Node class not found on startup?

**Error Example**:

```
ERROR (IceConfCache.java:62)- class not found conf:{"id":118,"type":6,"confName":"*.*.*Flow"}
```

**Cause**: Corresponding node class not found in Client

**Solutions**:
1. Check if node class exists in package path configured in `ice.scan`
2. Check if node class full name is correct
3. Confirm node class is properly compiled and packaged

**Child Node Error**:

```
ERROR (IceConfCache.java:91)- sonId:73 not exist please check! conf:{"id":70,"sonIds":"73,74","type":1}
```

Child node with corresponding ID not found, usually caused by child node initialization failure. Check if child node configuration is correct.

> If the erroring node is not used in business, it can be ignored.

## Server Common Questions

### Will Server down affect Client?

**Under Ice 2.0 Architecture**:

- Server is only responsible for configuration **operations and storage**
- Client runs **completely independent of Server**, reads config directly from file system
- After Server goes down:
  - ✅ Already started Clients can run normally
  - ✅ New Clients can also start normally (as long as shared storage has config data)
  - ❌ Cannot modify and publish new configurations in Server UI

> 💡 **Key Point**: Client only depends on shared storage directory, not on Server process

### Does Server support clustering?

Ice 2.0 supports multi-Server instance deployment through **shared storage**:

- Multiple Servers share the same `ice-data` directory
- Recommend using NFS, Alibaba Cloud NAS, AWS EFS, etc.
- Deploy multiple Server instances behind a load balancer

### How to backup configuration data?

Ice 2.0 stores configurations as JSON files, backup is very simple:

```bash
# Backup entire storage directory
cp -r ./ice-data ./ice-data-backup-$(date +%Y%m%d)

# Or use rsync for incremental backup
rsync -avz ./ice-data/ /backup/ice-data/
```

## Performance Questions

### What is Ice Rule Engine's performance?

- **Pure Memory Computation**: Rule execution entirely in memory
- **Millisecond Response**: Single rule execution usually under 1ms
- **Zero Network Overhead**: Config sync based on file system, doesn't affect execution performance
- **Lock-Free Design**: Node execution is independent, naturally supports high concurrency

### How to optimize Client startup speed?

1. **Configure scan path**: Specify leaf node scan packages to avoid full scan

```yaml
ice:
  scan: com.your.package.nodes  # Only scan specified package
```

2. **Reduce node count**: Clean up unused node configurations
3. **Use SSD storage**: Speed up configuration file reading

## More Questions

If the above content doesn't solve your problem, welcome to get help through:

- 💬 [Join Technical Discussion Group](/en/community/community.html)
- 🐛 [GitHub Issues](https://github.com/zjn-zjn/ice/issues)
- 📖 [Detailed Documentation](/en/guide/detail.html)
