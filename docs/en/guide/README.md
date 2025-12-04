---
title: Ice Introduction - Innovative Rule Engine Orchestration
description: Deep dive into the design philosophy and architecture of Ice rule engine. Achieve business decoupling through tree structure, providing maximum orchestration freedom for simple and flexible rule configuration.
keywords: rule engine principles,business orchestration,design philosophy,Ice introduction,decision engine,visual rule engine
head:
  - - meta
    - property: og:title
      content: Ice Introduction - Innovative Rule Engine Orchestration
  - - meta
    - property: og:description
      content: Deep dive into the design philosophy and architecture of Ice rule engine. Achieve business decoupling through tree structure.
---

# Ice Rule Engine - Introduction

## Why Choose Ice Rule Engine?

In actual business development, do you encounter these pain points:

- 🤔 **Code filled with if-else**: Complex business logic, deeply nested conditional judgments, difficult to maintain
- 🔄 **Frequently changing rules**: Marketing rules and risk control strategies need constant adjustment, requiring code changes and redeployment
- 🎯 **Difficult rule engine selection**: Drools too heavy, custom rule engine costs high, hard coding not flexible enough
- 🧩 **Business decoupling challenges**: Despite extensive abstraction, new business scenarios still cannot be reused, poor extensibility

**Ice Rule Engine** is born to solve these problems! As a **lightweight visual rule engine** and **business orchestration framework**, Ice adopts innovative tree-based orchestration design and provides a visual rule configuration platform, making rule management simple and efficient.

## Ice vs Traditional Rule Engines

Compared to traditional rule engines like Drools and Activiti, Ice offers these advantages:

### 1. More Flexible Orchestration
- **Traditional Rule Engines**: Drools uses When-Then pattern, Activiti uses flowchart pattern, rule modification requires careful consideration
- **Ice Rule Engine**: Tree-based orchestration structure, independent nodes, rule modifications don't affect each other, true decoupling

### 2. Zero Performance Overhead
- **Traditional Rule Engines**: Drools needs to compile rules, Activiti needs process engine, higher performance overhead
- **Ice Rule Engine**: Pure in-memory computation, millisecond response, near-zero performance overhead

### 3. Visual Configuration
- **Traditional Rule Engines**: Complex rule configuration, high learning curve, requires specialized maintenance
- **Ice Rule Engine**: Provides visual web management platform, business users can configure rules, reduces maintenance costs

## Ice Rule Engine Design Philosophy

Next, through a simple recharge activity example, we'll explain the core design philosophy of Ice rule engine in depth, helping you understand the essential differences between Ice and other rule engines.


## Design ideas

In order to facilitate understanding, the design idea will be accompanied by a simple recharge example.

### Example

Company X will carry out a seven-day recharge activity. The contents of the activity are as follows:

**Event time:**(10.1-10.7)

**Activities:**

Recharge 100  dollar, get 5  dollar balance (10.1-10.7)

Recharge 50  dollar and get 10 points (10.5-10.7)

**Event Remarks:** Not superimposed to send (recharge 100  dollar can only get 5  dollar balance, will not be superimposed to give 10 points)

Simply dismantling, to complete this activity, we need to develop the following modules:

![](/images/introduction/2-dark.png#dark)
![](/images/introduction/2-light.png#light)

As shown in the figure, when the user recharges successfully, a parameter package Pack (like Activiti/Drools Fact) corresponding to the recharge scenario will be generated. The package will contain the recharge user's uid, recharge amount cost, recharge time requestTime and other information. We can get the value in the package through the defined key (similar to map.get(key)).

There is nothing wrong with how the module is designed. The key point is how to arrange the following to achieve freedom of configuration. Next, through the existing nodes above, we will explain the advantages and disadvantages of different rule engines in the core arrangement, and compare how ice does it.

### Flowchart implementation

Like Activiti, Flowable implementation:

![](/images/introduction/3-dark.png#dark)
![](/images/introduction/3-light.png#light)

Flowchart implementation should be the most common arrangement method we think of~ It looks very concise and easy to understand. Through special design, such as removing some unnecessary lines, the UI can be made more concise. But because of the time attribute, time is actually a rule condition, and after adding it becomes:

![](/images/introduction/4-dark.png#dark)
![](/images/introduction/4-light.png#light)

looks ok too

### Execution tree implementation

Like Drools implementation (When X Then Y):

![](/images/introduction/5-dark.png#dark)
![](/images/introduction/5-light.png#light)

This looks fine too, try it with the timeline:

![](/images/introduction/6-dark.png#dark)
![](/images/introduction/6-light.png#light)

It's still relatively concise, at least compared to the flowchart format, and I would be more willing to modify this.

### Changes

The advantage of the above two solutions is that some scattered configurations can be well managed in combination with the business, and minor modifications to the configuration can be done at your fingertips, but the real business scenarios may still have to hammer you. With flexibility changes, everything is different.

#### ideal

*It won't change, don't worry, that's it, go on*

#### Reality

①Recharge 100  dollar and change it to 80, 10 points to 20 points, and the time to change to 10.8 and end it (*smile*, after all, I spent so much effort on the rules engine, and finally realized the value!)

②Users are not very motivated to participate, so let’s get rid of the non-overlay and send them all.

③You can't send too much with a balance of 5  dollar. Let's set up a stock of 100. By the way, if the inventory is insufficient, you still have to send 10 points to charge 100  dollar (*dead...*It would be better to hardcode it if you knew it earlier)

The above changes do not seem unrealistic. After all, the real online changes are much more outrageous than this. The main disadvantage of the flow chart and execution tree implementations is that they can affect the whole body. It is easy to make mistakes if it is not considered in place, and this is just a simple example. The actual content of activities is much more complicated than this, and there are also many timelines. Considering this, plus the cost of using the learning framework, Often the gain outweighs the gain, and in the end it turns out that it's better to hardcode it.

what to do?

### How is ice made?

#### Introduce relation nodes

In order to control the flow of business, the relation node

**AND**

Among all child nodes, one returns false, and the node will also be false, all true is true, and the execution is terminated at the place where false is executed, similar to Java's &&

**ANY**

Among all child nodes, if one returns true, the node will also be true, all false are false, and the execution will be terminated when the execution reaches true, similar to Java's ||

**ALL**

All child nodes will be executed. If any one returns true, the node is also true. If there is no true, if a node is false, it will return false. If there is no true and no false, it will return none. All child nodes are executed and terminated.

**NONE**

All child nodes will execute, no matter what the child node returns, it will return none

**TRUE**

All child nodes will be executed, no matter what the child node returns, it will return true, and no child node will return true (other nodes without children return none)

#### Introduce leaf nodes

The leaf node is the real processing node

**Flow**

Some condition and rule nodes, such as ScoreFlow in the example

**Result**

Nodes with some result properties, such as AmountResult, PointResult in the example

**None**

Some actions that do not interfere with the process, such as assembly work, etc., such as TimeChangeNone will be introduced below

With the above nodes, how do we assemble it?

![](/images/introduction/7-dark.png#dark)
![](/images/introduction/7-light.png#light)

As shown in the figure, using the tree structure (the traditional tree is mirrored and rotated), the execution order is similar to in-order traversal. It is executed from the root, which is a relationship node, and the child nodes are executed from top to bottom. If the user's recharge amount is 70 Element, the execution process:

```[ScoreFlow-100:false]→[AND:false]→[ScoreFlow-50:true]→[PointResult:true]→[AND:true]→[ANY:true]```

At this time, it can be seen that the time that needs to be stripped out before can be integrated into each node, and the time configuration is returned to the node. If the execution time is not reached, such as the node that issued the points will take effect after 10.5 days, then before 10.5 , it can be understood that this node does not exist.

#### Change Resolution

For ① directly modify the node configuration

For ②, you can directly change the ANY of the root node to ALL (the logic of superimposed and non-superimposed transmission is on this node, and the logic belonging to this node should be solved by this node)

For ③ due to insufficient inventory, it is equivalent to not issuing to the user, then AmountResult returns false, and the process will continue to be executed downwards without any changes.

One more thorny question, when the timeline is complex, what to do with test work and test concurrency?

An event that started in 10.1 must be developed and launched before 10.1. For example, how can I test an event that started in 10.1 in 9.15? In ice, it just needs to be modified slightly:

![](/images/introduction/8-dark.png#dark)
![](/images/introduction/8-light.png#light)

As shown in the figure, a node TimeChangeNone (changing the requestTime in the package) is introduced, which is responsible for changing the time. The execution of the subsequent nodes depends on the time in the package. TimeChangeNone is similar to a plug-in for changing time. If the test is parallel, then You can add a time change plug-in to the business that each person is responsible for for multiple tests.

#### Features

Why dismantle it like this? Why does this solve these changes and problems?

In fact, the tree structure is used for decoupling. When the flow chart and execution tree are implemented, when changing the logic, it is inevitable to look forward and backward, but ice does not need it. The business logic of ice is all on this node, and each node can represent a single Logic, for example, if I change the logic of stacking to stacking, it is only limited to the logic of that ANY node. Just change it to the logic I want. As for the child nodes, don't pay special attention. It depends on the flow of packages, and the subsequent process executed by each node does not need to be specified by itself.

Because the execution process after executing it is no longer under its control, it can be reused:

![](/images/introduction/9-dark.png#dark)
![](/images/introduction/9-light.png#light)

As shown in the figure, TimeChangeNone is used in the participation activity. If there is still an H5 page that needs to be presented, and different presentations are also related to time, what should I do? Just use the same instance in the render activity, change one, and the other will be updated, avoiding the problem of changing the time everywhere.

Similarly, if there is a problem on the line, such as the sendAmount interface hangs, because the error will not return false to continue execution, but provide optional strategies, such as the Pack and the node to which it is executed, and wait until the interface is repaired. , and then continue to throw it into ice and run it again (since the placement time is the time when the problem occurs, there is no need to worry about the problem that the repair after the event ends will not take effect). Similarly, if it is a non-critical business such as the avatar service, it still hangs. I hope to run, but there is no avatar, so you can choose to skip the error and continue to execute. The rules for placing orders here are not described in detail. The same principle can also be used for mocks. Just add the data that needs to be mocked in the Pack, and you can run it.

#### Introduce forward node

![](/images/introduction/10-dark.png#dark)
![](/images/introduction/10-light.png#light)

In the above logic, we can see that some AND nodes are closely bound. In order to simplify the view and configuration, the concept of forward node is added. This node will be executed if and only when the execution result of the current node is not false. , the semantics are consistent with the two nodes connected by AND.