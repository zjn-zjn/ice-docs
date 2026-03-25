---
title: Ice Online Demo - Visual Rule Orchestration Experience
description: Experience the visual rule orchestration features of the Ice rule engine online. No installation required -- create and execute rules directly in your browser.
keywords: online demo,rule engine demo,visual configuration,Ice experience
sidebar: false
editLink: false
lastUpdated: false
contributors: false
---

# Online Demo

## Business Scenario: Company X's 7-Day Top-Up Promotion

Imagine Company X wants to run a 7-day top-up promotion. Here are the complete campaign rules:

> **Campaign Period**: January 1 - January 7
>
> **Campaign Rules**:
> - Top-up **>= 100** → Grant **5 yuan balance** (active Jan 1-7, entire campaign)
> - Top-up **>= 50** → Grant **10 points** (active Jan 5-7, last 3 days only)
> - The two tiers **do not stack**; the higher tier is matched first, and no further tiers are checked

The interactive demo below implements these campaign rules using Ice. You can explore through three tabs:

- **Tutorial**: Step-by-step walkthrough of how Ice orchestrates the above rules into a rule tree
- **Interactive Demo**: Enter different top-up amounts and dates, execute the rule tree, and observe the execution trace and results; switch between presets like "non-stacking" and "stacking"
- **Playground**: Freely add and edit nodes to build your own rule tree and execute it

<IcePlayground locale="en" />

## Core Concepts at a Glance

| Concept | Description |
|---------|-------------|
| **Relation Nodes** | Control child node execution: AND (all must pass), ANY (one must pass), ALL (execute all), etc. |
| **Leaf Nodes** | Execute business logic: Flow (conditional checks), Result (business operations), None (auxiliary operations) |
| **Roam** | Data container; nodes pass data between each other via Roam, execution metadata stored in Meta |
| **Hot Reload** | After modifying rules and clicking Apply, Clients automatically load the new configuration within seconds |

Want to learn more? Read the [Core Concepts](/en/guide/concepts.html) documentation.
