/**
 * Preset tree structures for the recharge activity example.
 * Mirrors the documentation's X Company 7-day recharge promotion.
 *
 * Activity rules:
 * - Recharge >= 100 → grant 5 yuan balance (10.1-10.7)
 * - Recharge >= 50  → grant 10 points    (10.5-10.7)
 * - Non-stacking (ANY) or stacking (ALL)
 */

import type { IceNode } from './types'

let _nextId = 1
function id() { return _nextId++ }

// Common evaluate functions
const scoreFlowEval = (roam: Record<string, any>, conf: Record<string, any>) => {
  const val = roam[conf.key]
  return val != null && val >= conf.score
}

const amountResultEval = (roam: Record<string, any>, conf: Record<string, any>) => {
  roam[conf.targetKey || 'reward_amount'] = conf.value
  return true
}

const pointResultEval = (roam: Record<string, any>, conf: Record<string, any>) => {
  roam[conf.targetKey || 'reward_points'] = conf.value
  return true
}

const timeChangeNoneEval = (roam: Record<string, any>, conf: Record<string, any>) => {
  if (conf.newTime) {
    roam.requestTime = conf.newTime
  }
}

/**
 * Preset 1: Non-stacking (ANY root)
 *
 *   ANY (10.1-10.7)
 *   ├── AND
 *   │   ├── ScoreFlow-100 (cost >= 100)
 *   │   └── AmountResult (reward 5 yuan)
 *   └── AND (>= 10.5)
 *       ├── ScoreFlow-50 (cost >= 50)
 *       └── PointResult (reward 10 points)
 */
export function createRechargeAny(): IceNode {
  return {
    id: id(), type: 'ANY', name: 'ANY',
    timeRange: { start: '2026-01-01', end: '2026-01-07' },
    children: [
      {
        id: id(), type: 'AND', name: 'AND',
        children: [
          {
            id: id(), type: 'FLOW', name: 'ScoreFlow-100',
            confField: { key: 'cost', score: 100 },
            evaluate: scoreFlowEval,
          },
          {
            id: id(), type: 'RESULT', name: 'AmountResult',
            confField: { targetKey: 'reward_amount', value: 5 },
            evaluate: amountResultEval,
          },
        ]
      },
      {
        id: id(), type: 'AND', name: 'AND',
        timeRange: { start: '2026-01-05', end: '2026-01-07' },
        children: [
          {
            id: id(), type: 'FLOW', name: 'ScoreFlow-50',
            confField: { key: 'cost', score: 50 },
            evaluate: scoreFlowEval,
          },
          {
            id: id(), type: 'RESULT', name: 'PointResult',
            confField: { targetKey: 'reward_points', value: 10 },
            evaluate: pointResultEval,
          },
        ]
      }
    ]
  }
}

/**
 * Preset 2: Stacking (ALL root) - same tree but root is ALL
 */
export function createRechargeAll(): IceNode {
  const tree = createRechargeAny()
  tree.type = 'ALL'
  tree.name = 'ALL'
  return tree
}

/**
 * Preset 3: With TimeChangeNone plugin
 *
 *   ALL
 *   ├── TimeChangeNone (changes requestTime for testing)
 *   └── ANY (10.1-10.7)
 *       ├── AND
 *       │   ├── ScoreFlow-100
 *       │   └── AmountResult
 *       └── AND (>= 10.5)
 *           ├── ScoreFlow-50
 *           └── PointResult
 */
export function createRechargeWithTime(): IceNode {
  const outerAll: IceNode = {
    id: id(), type: 'ALL', name: 'ALL',
    children: [
      {
        id: id(), type: 'NONE_LEAF', name: 'TimeChangeNone',
        confField: { newTime: '2026-01-05' },
        evaluate: timeChangeNoneEval,
      },
      {
        id: id(), type: 'ANY', name: 'ANY',
        timeRange: { start: '2026-01-01', end: '2026-01-07' },
        children: [
          {
            id: id(), type: 'AND', name: 'AND',
            children: [
              {
                id: id(), type: 'FLOW', name: 'ScoreFlow-100',
                confField: { key: 'cost', score: 100 },
                evaluate: scoreFlowEval,
              },
              {
                id: id(), type: 'RESULT', name: 'AmountResult',
                confField: { targetKey: 'reward_amount', value: 5 },
                evaluate: amountResultEval,
              },
            ]
          },
          {
            id: id(), type: 'AND', name: 'AND',
            timeRange: { start: '2026-01-05', end: '2026-01-07' },
            children: [
              {
                id: id(), type: 'FLOW', name: 'ScoreFlow-50',
                confField: { key: 'cost', score: 50 },
                evaluate: scoreFlowEval,
              },
              {
                id: id(), type: 'RESULT', name: 'PointResult',
                confField: { targetKey: 'reward_points', value: 10 },
                evaluate: pointResultEval,
              },
            ]
          }
        ]
      }
    ]
  }
  return outerAll
}

/**
 * Preset 4: Forward version
 * ScoreFlow as forward (precondition) of Result nodes
 *
 *   ANY (10.1-10.7)
 *   ├── AmountResult [forward: ScoreFlow-100]
 *   └── PointResult  [forward: ScoreFlow-50] (>= 10.5)
 */
export function createRechargeForward(): IceNode {
  return {
    id: id(), type: 'ANY', name: 'ANY',
    timeRange: { start: '2026-01-01', end: '2026-01-07' },
    children: [
      {
        id: id(), type: 'RESULT', name: 'AmountResult',
        confField: { targetKey: 'reward_amount', value: 5 },
        evaluate: amountResultEval,
        forward: {
          id: id(), type: 'FLOW', name: 'ScoreFlow-100',
          confField: { key: 'cost', score: 100 },
          evaluate: scoreFlowEval,
        }
      },
      {
        id: id(), type: 'RESULT', name: 'PointResult',
        confField: { targetKey: 'reward_points', value: 10 },
        evaluate: pointResultEval,
        timeRange: { start: '2026-01-05', end: '2026-01-07' },
        forward: {
          id: id(), type: 'FLOW', name: 'ScoreFlow-50',
          confField: { key: 'cost', score: 50 },
          evaluate: scoreFlowEval,
        }
      },
    ]
  }
}

/**
 * Preset: Simple if-else (for playground template)
 *
 *   AND
 *   ├── ConditionFlow (checks value > 10)
 *   └── ActionResult (sets result = "pass")
 */
export function createSimpleIfElse(): IceNode {
  return {
    id: id(), type: 'AND', name: 'AND',
    children: [
      {
        id: id(), type: 'FLOW', name: 'ConditionFlow',
        confField: { key: 'value', score: 10 },
        evaluate: scoreFlowEval,
      },
      {
        id: id(), type: 'RESULT', name: 'ActionResult',
        confField: { targetKey: 'result', value: 'pass' },
        evaluate: (roam, conf) => { roam[conf.targetKey] = conf.value; return true },
      },
    ]
  }
}

/** Default roam for recharge presets */
export function defaultRechargeRoam() {
  return { uid: 'user_001', cost: 70 }
}
