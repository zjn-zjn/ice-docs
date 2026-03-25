---
title: FAQ
description: Frequently asked questions and solutions for the Ice rule engine, covering architecture, Client, Server, and performance topics.
keywords: Ice FAQ,frequently asked questions,rule engine troubleshooting,debugging,performance optimization
---

# Frequently Asked Questions

## Architecture

### Can Ice be used as a workflow engine?

Ice is a stateless rule engine designed for rule evaluation and business orchestration. If you need workflow features like state persistence and approval flows, consider building on top of Ice with custom extensions.

### How do Server and Client communicate?

**They do not communicate over the network.** The Server writes configuration to a shared storage directory (`ice-data/`), and the Client polls the file system for updates. They simply need access to the same directory.

### Does a Server outage affect the Client?

No. The Client depends only on the shared storage directory, not on the Server process. When the Server goes down:
- Running Clients continue to operate normally
- New Clients can also start successfully (as long as configuration data exists in the storage directory)
- You will be unable to modify or apply new configurations through the Server interface

## Client Issues

### Client cannot load configuration

Checklist:
1. Does `storagePath` point to the same `ice-data` directory as the Server?
2. Is the `app` parameter correct (matching the App ID created in Server)?
3. Does the application have read permissions for the storage directory?
4. Does the `{app}/version.txt` file exist in the storage directory?

### Configuration updates not taking effect

Common causes:
1. Configuration was modified in Server but "Apply" was not clicked
2. The Client polls every 2 seconds by default, so there may be a few seconds of delay
3. Check whether `version.txt` has been updated
4. Check Client logs for configuration loading records

### Node class not found on startup

```
ERROR - class not found conf:{"confName":"com.example.MyFlow"}
```

Cause: The corresponding leaf node class was not found in the Client. Check:
1. Is the leaf node class under the scan package path?
2. Is the class name (confName) correct?
3. Has the leaf node class been compiled and packaged?

Errors for nodes not used in your business can be safely ignored.

## Server Issues

### Does Server support clustering?

Yes. Multiple Server instances can share the same `ice-data` directory. Recommended shared storage options include NFS, AWS EFS, and similar solutions.

### How to back up configuration

Configuration is stored as JSON files. Simply copy the directory:

```bash
cp -r ./ice-data ./ice-data-backup-$(date +%Y%m%d)
```

## Performance

### How does Ice perform?

- Pure in-memory computation; a single rule execution typically takes less than 1ms
- Configuration sync is file-system-based and does not affect execution performance
- Node execution is independent, naturally supporting high concurrency

### How to optimize startup speed?

1. Specify leaf node scan package paths precisely to avoid full-package scanning
2. Clean up unused node configurations
3. Use SSD storage

## More

- [Community](/en/community/community.html) -- Join the community
- [GitHub Issues](https://github.com/zjn-zjn/ice/issues) -- Submit issues and suggestions
