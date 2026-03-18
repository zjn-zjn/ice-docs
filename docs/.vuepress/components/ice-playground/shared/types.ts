// Ice node types - mirrors the Java ice-core type system

export type RelationType = 'AND' | 'ANY' | 'ALL' | 'NONE_REL' | 'TRUE_REL'
export type LeafType = 'FLOW' | 'RESULT' | 'NONE_LEAF'
export type NodeType = RelationType | LeafType

export type RunState = 'TRUE' | 'FALSE' | 'NONE' | 'SHUT_DOWN'

export interface TimeRange {
  start: string  // ISO date string e.g. "2024-10-01"
  end: string
}

export interface IceNode {
  id: number
  type: NodeType
  name: string
  inverse?: boolean
  timeRange?: TimeRange
  forward?: IceNode
  children?: IceNode[]
  // Leaf node fields
  confField?: Record<string, any>
  // Evaluate function for leaf nodes (set by presets or playground)
  evaluate?: (roam: Record<string, any>, confField: Record<string, any>) => boolean | void
}

export interface ExecutionStep {
  nodeId: number
  nodeName: string
  nodeType: NodeType
  result: RunState | 'REJECTED' | 'OUT_OF_TIME'
  skipped?: boolean  // true if short-circuited (never executed)
}

export interface ExecutionResult {
  steps: ExecutionStep[]
  finalResult: RunState
  roamAfter: Record<string, any>
}

// For tree rendering
export interface RenderNode {
  id: number
  node: IceNode
  x: number
  y: number
  children: RenderNode[]
  forward?: RenderNode
  parent?: RenderNode
  // Execution state (set after execution)
  execResult?: RunState | 'REJECTED' | 'OUT_OF_TIME'
  execSkipped?: boolean
  execOrder?: number  // order in which this node was executed
}

export function isRelation(type: NodeType): boolean {
  return type === 'AND' || type === 'ANY' || type === 'ALL' || type === 'NONE_REL' || type === 'TRUE_REL'
}

export function isLeaf(type: NodeType): boolean {
  return type === 'FLOW' || type === 'RESULT' || type === 'NONE_LEAF'
}

export function getRelationLabel(type: NodeType): string {
  switch (type) {
    case 'AND': return 'AND'
    case 'ANY': return 'ANY'
    case 'ALL': return 'ALL'
    case 'NONE_REL': return 'NONE'
    case 'TRUE_REL': return 'TRUE'
    default: return ''
  }
}
