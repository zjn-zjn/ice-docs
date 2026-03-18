/**
 * D3-based tree renderer for ice rule trees.
 * Renders the characteristic left-to-right tree layout (root on left, leaves on right).
 *
 * Features:
 * - Relation nodes as circles, leaf nodes as rounded rectangles
 * - Forward node arrows (dashed orange)
 * - Execution animation with state overlays
 * - Dark/light theme support
 */

import * as d3 from 'd3'
import type { IceNode, ExecutionStep, RunState } from './types'
import { isRelation, getRelationLabel } from './types'
import { NODE, getNodeColors, getExecColors, getResultBadge, LINK_COLORS } from './node-styles'

export interface TreeRendererOptions {
  width?: number
  height?: number
  animated?: boolean
  onNodeClick?: (node: IceNode) => void
  onNodeRightClick?: (node: IceNode, event: MouseEvent) => void
}

interface LayoutNode {
  id: number
  node: IceNode
  x: number
  y: number
  children: LayoutNode[]
  forwardNode?: LayoutNode
  depth: number
}

function computeLayout(root: IceNode, width: number, height: number): LayoutNode[] {
  // Convert to d3 hierarchy for layout computation
  interface HierNode { id: number; node: IceNode; children?: HierNode[] }

  function toHier(n: IceNode): HierNode {
    const h: HierNode = { id: n.id, node: n }
    const kids: HierNode[] = []
    if (n.forward) kids.push(toHier(n.forward))
    if (n.children) {
      for (const c of n.children) kids.push(toHier(c))
    }
    if (kids.length > 0) h.children = kids
    return h
  }

  const hierRoot = d3.hierarchy(toHier(root))
  const treeLayout = d3.tree<HierNode>()
    .size([height - 100, width - 180])
    .separation((a, b) => a.parent === b.parent ? 1 : 1.2)

  treeLayout(hierRoot)

  // Map back to LayoutNodes (d3.tree uses x for vertical, y for horizontal)
  const allNodes: LayoutNode[] = []
  hierRoot.each(d => {
    allNodes.push({
      id: d.data.id,
      node: d.data.node,
      x: (d.y ?? 0) + 60,    // horizontal position (depth) - offset from left
      y: (d.x ?? 0) + 50,    // vertical position (breadth)
      children: [],
      depth: d.depth,
    })
  })

  // Reconstruct forward references
  for (const ln of allNodes) {
    if (ln.node.forward) {
      ln.forwardNode = allNodes.find(n => n.id === ln.node.forward!.id)
    }
    if (ln.node.children) {
      ln.children = ln.node.children.map(c => allNodes.find(n => n.id === c.id)!).filter(Boolean)
    }
  }

  return allNodes
}

export function renderTree(
  container: HTMLElement,
  root: IceNode,
  execSteps?: ExecutionStep[],
  options: TreeRendererOptions = {}
) {
  const { onNodeClick, onNodeRightClick } = options

  // Clear previous
  d3.select(container).selectAll('*').remove()

  const rect = container.getBoundingClientRect()
  const width = options.width || rect.width || 800
  const height = options.height || Math.max(rect.height || 400, 350)

  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'ice-tree-svg')

  // Arrow marker for forward links (defined before usage)
  svg.append('defs').append('marker')
    .attr('id', 'arrow-forward')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8).attr('refY', 5)
    .attr('markerWidth', 14).attr('markerHeight', 14)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 1 1 L 9 5 L 1 9')
    .attr('transform', 'rotate(-20, 5, 5)')
    .attr('fill', 'none')
    .attr('stroke', LINK_COLORS.forward)
    .attr('stroke-width', 1.6)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')

  const g = svg.append('g')

  const allNodes = computeLayout(root, width, height)

  // Build execution result map
  const execMap = new Map<number, { result: string; skipped?: boolean; order: number }>()
  if (execSteps) {
    execSteps.forEach((step, i) => {
      execMap.set(step.nodeId, { result: step.result, skipped: step.skipped, order: i })
    })
  }

  // Draw links (parent -> child)
  for (const ln of allNodes) {
    for (const child of ln.children) {
      const execInfo = execMap.get(child.id)
      let strokeColor = LINK_COLORS.normal
      let isSkippedLink = false
      if (execSteps) {
        if (execInfo?.skipped) {
          strokeColor = LINK_COLORS.skipped
          isSkippedLink = true
        } else if (execInfo) {
          strokeColor = execInfo.result === 'TRUE' ? LINK_COLORS.executed
            : execInfo.result === 'FALSE' || execInfo.result === 'REJECTED' ? LINK_COLORS.failed
            : LINK_COLORS.normal
        }
      }

      g.append('path')
        .attr('d', linkPath(ln, child))
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', NODE.LINK_STROKE_WIDTH)
        .attr('stroke-dasharray', isSkippedLink ? '6,4' : 'none')
    }

    // Forward link (dashed) — curves above to avoid crossing nodes
    if (ln.forwardNode) {
      const fwd = ln.forwardNode
      g.append('path')
        .attr('d', forwardLinkPath(fwd, ln))
        .attr('fill', 'none')
        .attr('stroke', LINK_COLORS.forward)
        .attr('stroke-width', NODE.FORWARD_STROKE_WIDTH)
        .attr('marker-end', 'url(#arrow-forward)')
    }
  }

  // Draw nodes
  for (const ln of allNodes) {
    const nodeG = g.append('g')
      .attr('transform', `translate(${ln.x}, ${ln.y})`)
      .attr('class', 'ice-node')
      .style('cursor', onNodeClick ? 'pointer' : 'default')

    const colors = getNodeColors(ln.node.type)
    const execInfo = execMap.get(ln.id)
    const execColors = execSteps ? getExecColors(
      execInfo?.result as any,
      execInfo?.skipped
    ) : null

    if (isRelation(ln.node.type)) {
      // Relation node: circle
      const r = NODE.RELATION_RADIUS
      nodeG.append('circle')
        .attr('r', r)
        .attr('fill', execColors?.fill || colors.fill)
        .attr('stroke', execColors?.stroke || colors.stroke)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', execInfo?.skipped ? '4,3' : 'none')

      // Text color: use execColors.text when execution state overrides the fill
      const relationTextColor = execColors?.text || colors.text
      nodeG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', relationTextColor)
        .attr('font-size', NODE.FONT_SIZE)
        .attr('font-weight', 'bold')
        .text(getRelationLabel(ln.node.type))

      // Time range label below
      if (ln.node.timeRange) {
        nodeG.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', r + 16)
          .attr('fill', 'var(--ice-sub-text)')
          .attr('font-size', 12)
          .text(`${ln.node.timeRange.start.slice(5)}~${ln.node.timeRange.end.slice(5)}`)
      }
    } else {
      // Leaf node: rounded rectangle
      const w = NODE.LEAF_WIDTH
      const h = NODE.LEAF_HEIGHT
      nodeG.append('rect')
        .attr('x', -w / 2).attr('y', -h / 2)
        .attr('width', w).attr('height', h)
        .attr('rx', NODE.LEAF_RX)
        .attr('fill', execColors?.fill || colors.fill)
        .attr('stroke', execColors?.stroke || colors.stroke)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', execInfo?.skipped ? '4,3' : 'none')

      // Node name — use exec text for TRUE/FALSE/REJECTED, keep node's own color for NONE/skipped
      const leafTextColor = (execInfo?.skipped ? execColors?.text
        : execInfo?.result === 'NONE' ? colors.text
        : execColors?.text) || colors.text
      nodeG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', ln.node.confField ? '-0.2em' : '0.35em')
        .attr('fill', leafTextColor)
        .attr('font-size', NODE.FONT_SIZE)
        .attr('font-weight', 'bold')
        .text(ln.node.name)

      // confField summary (one-line)
      if (ln.node.confField) {
        const summary = confFieldSummary(ln.node)
        nodeG.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '1.1em')
          .attr('fill', execInfo?.skipped ? 'var(--ice-exec-skipped-text)' : (execInfo?.result === 'NONE' ? 'var(--ice-sub-text)' : (execColors ? execColors.text : 'var(--ice-sub-text)')))
          .attr('font-size', NODE.LABEL_FONT_SIZE)
          .text(summary)
      }

      // Inverse badge
      if (ln.node.inverse) {
        nodeG.append('text')
          .attr('x', -w / 2 + 10).attr('y', -h / 2 + 5)
          .attr('fill', 'var(--ice-relation-fill)')
          .attr('font-size', 12)
          .attr('font-weight', 'bold')
          .text('INV')
      }

      // Time range
      if (ln.node.timeRange) {
        nodeG.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', h / 2 + 14)
          .attr('fill', 'var(--ice-sub-text)')
          .attr('font-size', 12)
          .text(`${ln.node.timeRange.start.slice(5)}~${ln.node.timeRange.end.slice(5)}`)
      }
    }

    // Execution result badge (bottom-right)
    if (execInfo && !execInfo.skipped && execInfo.result !== 'NONE') {
      const badge = getResultBadge(execInfo.result as any)
      const badgeColor = execColors?.badge || 'var(--ice-none-badge)'
      const bx = isRelation(ln.node.type) ? NODE.RELATION_RADIUS - 2 : NODE.LEAF_WIDTH / 2 - 2
      const by = isRelation(ln.node.type) ? NODE.RELATION_RADIUS - 2 : NODE.LEAF_HEIGHT / 2 - 2

      nodeG.append('circle')
        .attr('cx', bx).attr('cy', by)
        .attr('r', 12)
        .attr('fill', badgeColor)
      nodeG.append('text')
        .attr('x', bx).attr('y', by)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'var(--ice-badge-text)')
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .text(badge)
    }


    // Click handler
    if (onNodeClick) {
      nodeG.on('click', () => onNodeClick(ln.node))
    }
    if (onNodeRightClick) {
      nodeG.on('contextmenu', (event: MouseEvent) => {
        event.preventDefault()
        onNodeRightClick(ln.node, event)
      })
    }
  }
}

/** Get the horizontal half-width of a node shape */
function nodeHalfW(node: LayoutNode): number {
  return isRelation(node.node.type) ? NODE.RELATION_RADIUS : NODE.LEAF_WIDTH / 2
}

/**
 * Build a cubic bezier from the right edge of source to the left edge of target.
 * This avoids lines overlapping node shapes.
 */
function linkPath(source: LayoutNode, target: LayoutNode): string {
  const sx = source.x + nodeHalfW(source)   // right edge of source
  const sy = source.y
  const tx = target.x - nodeHalfW(target)   // left edge of target
  const ty = target.y
  const midX = (sx + tx) / 2
  return `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`
}

/**
 * Build a path for forward links: from forward node's left edge to parent node's right edge.
 */
function forwardLinkPath(source: LayoutNode, target: LayoutNode): string {
  const sx = source.x - nodeHalfW(source)   // left edge of forward node
  const sy = source.y
  const tx = target.x + nodeHalfW(target)   // right edge of parent node
  const ty = target.y
  // S-curve: source control point goes up, target control point goes down
  // This keeps the arrowhead arriving horizontally into the target, not obscured
  const dx = Math.abs(sx - tx)
  const bend = Math.max(35, dx * 0.3)
  return `M ${sx} ${sy} C ${sx - bend} ${sy - bend}, ${tx + bend} ${ty + bend}, ${tx} ${ty}`
}

function confFieldSummary(node: IceNode): string {
  const cf = node.confField
  if (!cf) return ''
  if (cf.key && cf.score != null) return `${cf.key} >= ${cf.score}`
  if (cf.targetKey && cf.value != null) return `${cf.targetKey} = ${cf.value}`
  if (cf.newTime) return `time → ${cf.newTime}`
  const entries = Object.entries(cf)
  if (entries.length === 0) return ''
  return entries.map(([k, v]) => `${k}:${v}`).join(', ').slice(0, 30)
}

/**
 * Animate execution steps on an already-rendered tree.
 * Highlights nodes one by one with a delay.
 */
export async function animateExecution(
  container: HTMLElement,
  root: IceNode,
  steps: ExecutionStep[],
  options: TreeRendererOptions & { stepDelay?: number } = {}
): Promise<void> {
  const delay = options.stepDelay || 400

  // First render without execution state
  renderTree(container, root, undefined, options)
  await sleep(delay)

  // Then progressively reveal execution
  for (let i = 0; i < steps.length; i++) {
    const partialSteps = steps.slice(0, i + 1)
    // Add skipped markers for remaining
    const fullSteps = [...partialSteps]
    for (const step of steps.slice(i + 1)) {
      if (step.skipped) fullSteps.push(step)
    }
    renderTree(container, root, fullSteps, options)
    await sleep(delay)
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
