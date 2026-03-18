/**
 * Tutorial step definitions for the guided animation.
 * Each step has a tree state, description, and optional execution config.
 */

import type { IceNode } from '../shared/types'
import { createRechargeAny, createRechargeAll, createRechargeForward } from '../shared/presets'

export interface TutorialStep {
  key: string
  treeFactory?: () => IceNode
  execConfig?: {
    roam: Record<string, any>
    requestTime: string
    animate?: boolean
  }
  /** Highlight specific node IDs */
  highlightIds?: number[]
  /** Show a "before/after" comparison */
  comparison?: {
    beforeFactory: () => IceNode
    afterFactory: () => IceNode
  }
}

/**
 * 7 tutorial steps using the recharge activity scenario.
 *
 * Step 1: Business scenario — show Pack data
 * Step 2: Business nodes — show leaf nodes
 * Step 3: Traditional approach — simple flowchart (text only)
 * Step 4: ice tree orchestration — show ANY tree
 * Step 5: Execution flow — animate with cost=70
 * Step 6: Power of change — ANY→ALL comparison
 * Step 7: Forward simplification — forward version
 */
export function createTutorialSteps(): TutorialStep[] {
  return [
    // Step 1: Business Scenario
    {
      key: 'step1',
    },

    // Step 2: Business Nodes
    {
      key: 'step2',
    },

    // Step 3: Traditional Approach
    {
      key: 'step3',
    },

    // Step 4: ice Tree Orchestration — show the ANY tree
    {
      key: 'step4',
      treeFactory: createRechargeAny,
    },

    // Step 5: Execution Flow — animate with cost=70
    {
      key: 'step5',
      treeFactory: createRechargeAny,
      execConfig: {
        roam: { uid: 'user_001', cost: 70 },
        requestTime: '2024-10-05',
        animate: true,
      },
    },

    // Step 6: Power of Change — ANY→ALL
    {
      key: 'step6',
      comparison: {
        beforeFactory: createRechargeAny,
        afterFactory: createRechargeAll,
      },
      execConfig: {
        roam: { uid: 'user_001', cost: 70 },
        requestTime: '2024-10-05',
      },
    },

    // Step 7: Forward Simplification
    {
      key: 'step7',
      treeFactory: createRechargeForward,
      execConfig: {
        roam: { uid: 'user_001', cost: 70 },
        requestTime: '2024-10-05',
        animate: true,
      },
    },
  ]
}
