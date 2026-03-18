/**
 * Node visual styles - colors, shapes, dimensions.
 * Colors use CSS custom properties for dark/light theme support.
 * The CSS variables are defined in docs/.vuepress/styles/index.scss
 */

import type { NodeType, RunState } from './types'

// Node dimensions
export const NODE = {
  RELATION_RADIUS: 32,
  LEAF_WIDTH: 170,
  LEAF_HEIGHT: 55,
  LEAF_RX: 9,
  FONT_SIZE: 14,
  LABEL_FONT_SIZE: 12,
  LINK_STROKE_WIDTH: 2,
  FORWARD_STROKE_WIDTH: 2,
} as const

// Colors by node type — use CSS variables for theme support
export const COLORS = {
  AND:       { fill: 'var(--ice-relation-fill)', stroke: 'var(--ice-relation-stroke)', text: 'var(--ice-badge-text)' },
  ANY:       { fill: 'var(--ice-relation-fill)', stroke: 'var(--ice-relation-stroke)', text: 'var(--ice-badge-text)' },
  ALL:       { fill: 'var(--ice-relation-fill)', stroke: 'var(--ice-relation-stroke)', text: 'var(--ice-badge-text)' },
  NONE_REL:  { fill: 'var(--ice-none-stroke)',    stroke: 'var(--ice-none-badge)',       text: 'var(--ice-badge-text)' },
  TRUE_REL:  { fill: 'var(--ice-true-fill)',     stroke: 'var(--ice-true-stroke)',      text: 'var(--ice-badge-text)' },
  FLOW:      { fill: 'var(--ice-leaf-fill)',     stroke: 'var(--ice-flow-stroke)',      text: 'var(--ice-leaf-text)' },
  RESULT:    { fill: 'var(--ice-leaf-fill)',     stroke: 'var(--ice-result-stroke)',    text: 'var(--ice-leaf-text)' },
  NONE_LEAF: { fill: 'var(--ice-none-fill)',     stroke: 'var(--ice-none-stroke)',      text: 'var(--ice-none-text)' },
} as const

export function getNodeColors(type: NodeType) {
  return COLORS[type] || COLORS.NONE_LEAF
}

// Execution state overlay colors (text is for relation node labels that sit on top of fill)
export const EXEC_COLORS = {
  TRUE:        { fill: 'var(--ice-exec-true-fill)',    stroke: 'var(--ice-exec-true-stroke)',    badge: 'var(--ice-exec-true-stroke)',    text: 'var(--ice-exec-true-text)' },
  FALSE:       { fill: 'var(--ice-exec-false-fill)',   stroke: 'var(--ice-exec-false-stroke)',   badge: 'var(--ice-exec-false-stroke)',   text: 'var(--ice-exec-false-text)' },
  NONE:        { fill: 'var(--ice-exec-none-fill)',    stroke: 'var(--ice-none-stroke)',         badge: 'var(--ice-none-stroke)',         text: 'var(--ice-exec-none-text)' },
  REJECTED:    { fill: 'var(--ice-exec-false-fill)',   stroke: 'var(--ice-exec-false-stroke)',   badge: 'var(--ice-exec-false-stroke)',   text: 'var(--ice-exec-false-text)' },
  OUT_OF_TIME: { fill: 'var(--ice-exec-skipped-fill)', stroke: 'var(--ice-exec-skipped-stroke)', badge: 'var(--ice-exec-skipped-stroke)', text: 'var(--ice-exec-skipped-text)' },
  SKIPPED:     { fill: 'var(--ice-exec-skipped-fill)', stroke: 'var(--ice-exec-skipped-stroke)', badge: 'var(--ice-exec-skipped-stroke)', text: 'var(--ice-exec-skipped-text)' },
} as const

export function getExecColors(result: RunState | 'REJECTED' | 'OUT_OF_TIME' | undefined, skipped?: boolean) {
  if (skipped) return EXEC_COLORS.SKIPPED
  if (!result) return null
  return EXEC_COLORS[result] || null
}

// Execution result badge character
export function getResultBadge(result: RunState | 'REJECTED' | 'OUT_OF_TIME' | undefined): string {
  switch (result) {
    case 'TRUE': return '\u2713'        // ✓
    case 'FALSE': return '\u2717'       // ✗
    case 'NONE': return '-'
    case 'REJECTED': return 'R'
    case 'OUT_OF_TIME': return 'T'
    default: return ''
  }
}

// Link styles
export const LINK_COLORS = {
  normal: 'var(--ice-link-color)',
  forward: 'var(--ice-relation-fill)',
  executed: 'var(--ice-exec-true-stroke)',
  failed: 'var(--ice-exec-false-stroke)',
  skipped: 'var(--ice-link-skipped)',
} as const
