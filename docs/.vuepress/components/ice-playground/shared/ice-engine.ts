/**
 * Frontend ice execution engine - mirrors Java ice-core semantics exactly.
 *
 * Three-valued logic: TRUE, FALSE, NONE
 * - NONE is "transparent" to AND/ANY (invisible)
 * - AND short-circuits on FALSE
 * - ANY short-circuits on TRUE
 * - ALL runs all, TRUE priority over FALSE
 * - NONE_REL runs all, always returns NONE
 * - TRUE_REL runs all, always returns TRUE
 * - Forward: FALSE = reject, NONE = pass-through
 * - Inverse: swaps TRUE <-> FALSE, NONE unaffected
 */

import type { IceNode, RunState, ExecutionStep, ExecutionResult, NodeType } from './types'
import { isRelation } from './types'

function isTimeDisabled(node: IceNode, requestTime: string, roam: Record<string, any>): boolean {
  if (!node.timeRange) return false
  // roam.requestTime may be overridden by TimeChangeNone plugin
  const effectiveTime = roam.requestTime || requestTime
  const req = new Date(effectiveTime).getTime()
  const start = new Date(node.timeRange.start).getTime()
  const end = new Date(node.timeRange.end + 'T23:59:59').getTime()
  return req < start || req > end
}

function applyInverse(state: RunState, inverse?: boolean): RunState {
  if (!inverse) return state
  if (state === 'TRUE') return 'FALSE'
  if (state === 'FALSE') return 'TRUE'
  return state  // NONE, SHUT_DOWN unaffected
}

function executeRelation(
  node: IceNode,
  roam: Record<string, any>,
  requestTime: string,
  steps: ExecutionStep[]
): RunState {
  const children = node.children || []
  if (children.length === 0) {
    return node.type === 'TRUE_REL' ? 'TRUE' : 'NONE'
  }

  switch (node.type) {
    case 'AND': {
      let hasTrue = false
      for (const child of children) {
        const childResult = executeNode(child, roam, requestTime, steps)
        if (childResult === 'FALSE') {
          // Mark remaining children as skipped
          markSkipped(children, children.indexOf(child) + 1, steps)
          return 'FALSE'
        }
        if (childResult === 'TRUE') hasTrue = true
        // NONE: invisible, continue
      }
      return hasTrue ? 'TRUE' : 'NONE'
    }

    case 'ANY': {
      let hasFalse = false
      for (const child of children) {
        const childResult = executeNode(child, roam, requestTime, steps)
        if (childResult === 'TRUE') {
          markSkipped(children, children.indexOf(child) + 1, steps)
          return 'TRUE'
        }
        if (childResult === 'FALSE') hasFalse = true
      }
      return hasFalse ? 'FALSE' : 'NONE'
    }

    case 'ALL': {
      let hasTrue = false
      let hasFalse = false
      for (const child of children) {
        const childResult = executeNode(child, roam, requestTime, steps)
        if (childResult === 'TRUE') hasTrue = true
        if (childResult === 'FALSE') hasFalse = true
      }
      // TRUE takes priority over FALSE in ALL
      return hasTrue ? 'TRUE' : (hasFalse ? 'FALSE' : 'NONE')
    }

    case 'NONE_REL': {
      for (const child of children) {
        executeNode(child, roam, requestTime, steps)
      }
      return 'NONE'
    }

    case 'TRUE_REL': {
      for (const child of children) {
        executeNode(child, roam, requestTime, steps)
      }
      return 'TRUE'
    }

    default:
      return 'NONE'
  }
}

function executeLeaf(
  node: IceNode,
  roam: Record<string, any>
): RunState {
  if (!node.evaluate) return 'NONE'
  const confField = node.confField || {}

  if (node.type === 'NONE_LEAF') {
    node.evaluate(roam, confField)
    return 'NONE'
  }

  // FLOW or RESULT: evaluate returns boolean
  const result = node.evaluate(roam, confField)
  return result ? 'TRUE' : 'FALSE'
}

function markSkipped(children: IceNode[], fromIndex: number, steps: ExecutionStep[]) {
  for (let i = fromIndex; i < children.length; i++) {
    markNodeSkipped(children[i], steps)
  }
}

function markNodeSkipped(node: IceNode, steps: ExecutionStep[]) {
  steps.push({
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    result: 'NONE',
    skipped: true
  })
  if (node.children) {
    for (const child of node.children) {
      markNodeSkipped(child, steps)
    }
  }
  if (node.forward) {
    markNodeSkipped(node.forward, steps)
  }
}

export function executeNode(
  node: IceNode,
  roam: Record<string, any>,
  requestTime: string,
  steps: ExecutionStep[]
): RunState {
  // Step 1: Time window check
  if (isTimeDisabled(node, requestTime, roam)) {
    steps.push({
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      result: 'OUT_OF_TIME'
    })
    return 'NONE'
  }

  let res: RunState

  // Step 2: Forward check
  if (node.forward) {
    const forwardRes = executeNode(node.forward, roam, requestTime, steps)
    if (forwardRes === 'FALSE') {
      // Mark children as skipped since the node was rejected
      if (node.children) {
        for (const child of node.children) {
          markNodeSkipped(child, steps)
        }
      }
      steps.push({
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        result: 'REJECTED'
      })
      return 'FALSE'
    }

    // Forward passed - execute main node
    const nodeRes = isRelation(node.type)
      ? executeRelation(node, roam, requestTime, steps)
      : executeLeaf(node, roam)

    // Combine forward + node (AND-like)
    if (forwardRes === 'NONE') {
      res = nodeRes
    } else {
      // forwardRes === 'TRUE'
      res = nodeRes === 'NONE' ? 'TRUE' : nodeRes
    }

    res = applyInverse(res, node.inverse)
    steps.push({
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      result: res
    })
    return res
  }

  // Step 3: Normal execution
  res = isRelation(node.type)
    ? executeRelation(node, roam, requestTime, steps)
    : executeLeaf(node, roam)

  // Step 4: Apply inverse
  res = applyInverse(res, node.inverse)

  steps.push({
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    result: res
  })

  return res
}

export function executeTree(root: IceNode, initialRoam: Record<string, any>, requestTime?: string): ExecutionResult {
  const roam = JSON.parse(JSON.stringify(initialRoam))  // deep copy
  const steps: ExecutionStep[] = []
  const time = requestTime || new Date().toISOString().split('T')[0]

  const finalResult = executeNode(root, roam, time, steps)

  return { steps, finalResult, roamAfter: roam }
}
