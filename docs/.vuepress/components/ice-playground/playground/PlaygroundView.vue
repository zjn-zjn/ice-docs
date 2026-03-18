<template>
  <div class="playground-view">
    <!-- Toolbar -->
    <div class="pg-toolbar">
      <div class="toolbar-left">
        <NodePalette :texts="texts" @addNode="addNodeToSelected" />
      </div>
      <div class="toolbar-right">
        <div class="template-group">
          <span class="tpl-label">{{ texts.playground.template }}:</span>
          <button
            v-for="t in templates"
            :key="t.key"
            class="tpl-btn"
            :class="{ active: activeTpl === t.key }"
            @click="loadTemplate(t.key)"
          >{{ t.label }}</button>
        </div>
        <button class="action-btn execute-btn" @click="runExecution">
          {{ texts.playground.execute }}
        </button>
        <button class="action-btn reset-btn" @click="resetTree">
          {{ texts.playground.reset }}
        </button>
      </div>
    </div>

    <div class="pg-main">
      <!-- Tree canvas -->
      <div class="pg-canvas">
        <div ref="treeContainer" class="pg-tree"></div>
        <div v-if="!currentTree" class="pg-empty">
          {{ locale === 'en' ? 'Select a template or add nodes from the palette' : '选择模板或从面板添加节点' }}
        </div>
      </div>

      <!-- Side panel -->
      <div class="pg-side">
        <RoamEditor
          v-model="roamInput"
          :label="texts.playground.roam_input"
          :placeholder='`{ "uid": "user_001", "cost": 70 }`'
        />

        <div v-if="execResult" class="pg-results">
          <div class="pg-result-row">
            <span class="pg-result-label">Result:</span>
            <span class="pg-result-badge" :class="execResult.finalResult.toLowerCase()">
              {{ execResult.finalResult }}
            </span>
          </div>

          <RoamEditor
            :modelValue="JSON.stringify(execResult.roamAfter, null, 2)"
            :label="texts.playground.roam_output"
            :readonly="true"
            @update:modelValue="() => {}"
          />

          <TraceViewer
            :steps="execResult.steps"
            :label="texts.playground.trace"
          />
        </div>
      </div>
    </div>

    <!-- Context menu -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <button @click="contextAddChild" v-if="contextMenu.node && isRelation(contextMenu.node.type)">
        {{ texts.playground.add_child }}
      </button>
      <button @click="contextSetForward" v-if="contextMenu.node && !contextMenu.node.forward">
        {{ texts.playground.set_forward }}
      </button>
      <button @click="contextRemoveForward" v-if="contextMenu.node && contextMenu.node.forward">
        {{ texts.playground.remove_forward }}
      </button>
      <button @click="contextToggleInverse">
        {{ texts.playground.toggle_inverse }}
      </button>
      <button @click="contextEditConf" v-if="contextMenu.node && !isRelation(contextMenu.node.type)">
        {{ texts.playground.edit_conf }}
      </button>
      <button @click="contextDelete" class="ctx-danger">
        {{ texts.playground.delete_node }}
      </button>
    </div>

    <!-- Node editor modal -->
    <NodeEditor
      :visible="editorVisible"
      :node="editingNode"
      :texts="texts"
      @close="editorVisible = false"
      @update="rerender"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import NodePalette from './NodePalette.vue'
import RoamEditor from './RoamEditor.vue'
import TraceViewer from './TraceViewer.vue'
import NodeEditor from '../interactive/NodeEditor.vue'
import type { IceNode, NodeType, ExecutionResult } from '../shared/types'
import { isRelation } from '../shared/types'
import type { I18nMessages } from '../shared/i18n'
import { renderTree } from '../shared/tree-renderer'
import { executeTree } from '../shared/ice-engine'
import {
  createRechargeAny,
  createSimpleIfElse,
  createRechargeWithTime
} from '../shared/presets'

const props = defineProps<{
  texts: I18nMessages
  locale: string
}>()

const treeContainer = ref<HTMLElement | null>(null)
const roamInput = ref('{\n  "uid": "user_001",\n  "cost": 70\n}')
const execResult = ref<ExecutionResult | null>(null)
const editorVisible = ref(false)
const editingNode = ref<IceNode | null>(null)
const activeTpl = ref('')
let currentTree: IceNode | null = null
let selectedNode: IceNode | null = null
let nextId = 100

const contextMenu = ref<{
  visible: boolean
  x: number
  y: number
  node: IceNode | null
}>({ visible: false, x: 0, y: 0, node: null })

const templates = computed(() => [
  { key: 'recharge', label: props.texts.playground.tpl_recharge },
  { key: 'simple', label: props.texts.playground.tpl_simple },
  { key: 'nested', label: props.texts.playground.tpl_nested },
  { key: 'blank', label: props.texts.playground.tpl_blank },
])

function loadTemplate(key: string) {
  activeTpl.value = key
  execResult.value = null
  switch (key) {
    case 'recharge':
      currentTree = createRechargeAny()
      roamInput.value = '{\n  "uid": "user_001",\n  "cost": 70\n}'
      break
    case 'simple':
      currentTree = createSimpleIfElse()
      roamInput.value = '{\n  "value": 15\n}'
      break
    case 'nested':
      currentTree = createRechargeWithTime()
      roamInput.value = '{\n  "uid": "user_001",\n  "cost": 120\n}'
      break
    case 'blank':
      currentTree = { id: nextId++, type: 'AND', name: 'AND', children: [] }
      break
  }
  rerender()
}

function resetTree() {
  if (activeTpl.value) {
    loadTemplate(activeTpl.value)
  }
}

function runExecution() {
  if (!currentTree) return
  try {
    const roam = JSON.parse(roamInput.value)
    const result = executeTree(currentTree, roam)
    execResult.value = result
    rerender(result)
  } catch (e) {
    // invalid JSON, ignore
  }
}

function rerender(result?: ExecutionResult) {
  if (!currentTree || !treeContainer.value) return
  const steps = result?.steps || execResult.value?.steps
  renderTree(treeContainer.value, currentTree, steps, {
    width: 600,
    height: 380,
    onNodeClick: (node) => {
      selectedNode = node
      editingNode.value = node
      editorVisible.value = true
    },
    onNodeRightClick: (node, event) => {
      contextMenu.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        node,
      }
    },
  })
}

function addNodeToSelected(type: NodeType) {
  const newNode: IceNode = {
    id: nextId++,
    type,
    name: type.replace('_REL', '').replace('_LEAF', ''),
    children: isRelation(type) ? [] : undefined,
    confField: !isRelation(type) ? {} : undefined,
  }

  if (selectedNode && isRelation(selectedNode.type)) {
    if (!selectedNode.children) selectedNode.children = []
    selectedNode.children.push(newNode)
  } else if (currentTree && isRelation(currentTree.type)) {
    if (!currentTree.children) currentTree.children = []
    currentTree.children.push(newNode)
  } else {
    // Wrap in new root
    currentTree = {
      id: nextId++,
      type: 'AND',
      name: 'AND',
      children: currentTree ? [currentTree, newNode] : [newNode],
    }
  }
  rerender()
}

// Context menu actions
function contextAddChild() {
  contextMenu.value.visible = false
  const node = contextMenu.value.node
  if (!node) return
  const child: IceNode = { id: nextId++, type: 'FLOW', name: 'NewFlow', children: undefined, confField: {} }
  if (!node.children) node.children = []
  node.children.push(child)
  rerender()
}

function contextSetForward() {
  contextMenu.value.visible = false
  const node = contextMenu.value.node
  if (!node) return
  node.forward = { id: nextId++, type: 'FLOW', name: 'ForwardFlow', confField: {} }
  rerender()
}

function contextRemoveForward() {
  contextMenu.value.visible = false
  const node = contextMenu.value.node
  if (node) {
    delete node.forward
    rerender()
  }
}

function contextToggleInverse() {
  contextMenu.value.visible = false
  const node = contextMenu.value.node
  if (node) {
    node.inverse = !node.inverse
    rerender()
  }
}

function contextEditConf() {
  contextMenu.value.visible = false
  const node = contextMenu.value.node
  if (node) {
    editingNode.value = node
    editorVisible.value = true
  }
}

function contextDelete() {
  contextMenu.value.visible = false
  const node = contextMenu.value.node
  if (!node || !currentTree) return
  if (node === currentTree) {
    currentTree = null
    if (treeContainer.value) treeContainer.value.innerHTML = ''
    return
  }
  removeFromTree(currentTree, node.id)
  rerender()
}

function removeFromTree(parent: IceNode, targetId: number) {
  if (parent.children) {
    parent.children = parent.children.filter(c => c.id !== targetId)
    for (const c of parent.children) removeFromTree(c, targetId)
  }
  if (parent.forward?.id === targetId) {
    delete parent.forward
  } else if (parent.forward) {
    removeFromTree(parent.forward, targetId)
  }
}

function closeContextMenu() {
  contextMenu.value.visible = false
}

onMounted(() => {
  document.addEventListener('click', closeContextMenu)
  loadTemplate('recharge')
})

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})
</script>

<style scoped>
.playground-view {
  padding: 8px 0;
}

.pg-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.toolbar-left {
  flex-shrink: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.template-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tpl-label {
  font-size: 12px;
  color: var(--c-text-lighter, #666);
}

.tpl-btn {
  padding: 3px 10px;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 4px;
  background: var(--c-bg, #fff);
  color: var(--c-text, #333);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.tpl-btn.active {
  background: var(--c-brand, #e8913a);
  color: #fff;
  border-color: var(--c-brand, #e8913a);
}

.tpl-btn:hover:not(.active) {
  border-color: var(--c-brand, #e8913a);
}

.action-btn {
  padding: 5px 16px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.execute-btn {
  background: var(--c-brand, #e8913a);
  color: #fff;
  border-color: var(--c-brand, #e8913a);
}

.execute-btn:hover {
  background: var(--c-brand-light, #f0a050);
}

.reset-btn {
  background: var(--c-bg, #fff);
  color: var(--c-text, #333);
  border-color: var(--c-border, #ddd);
}

.reset-btn:hover {
  border-color: var(--c-brand, #e8913a);
  color: var(--c-brand, #e8913a);
}

.pg-main {
  display: flex;
  gap: 16px;
}

.pg-canvas {
  flex: 1;
  min-width: 0;
  position: relative;
}

.pg-tree {
  width: 100%;
  min-height: 380px;
  border: 1px solid var(--c-border, #eee);
  border-radius: 8px;
  background: var(--c-bg, #fff);
  overflow: hidden;
}

.pg-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--c-text-lightest, #bbb);
  font-size: 14px;
}

.pg-side {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pg-result-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pg-result-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-lighter, #666);
}

.pg-result-badge {
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 13px;
}

.pg-result-badge.true { background: rgba(82, 168, 90, 0.15); color: #52a85a; }
.pg-result-badge.false { background: rgba(220, 60, 60, 0.15); color: #dc3c3c; }
.pg-result-badge.none { background: rgba(153, 153, 153, 0.15); color: #999; }

/* Context menu */
.context-menu {
  position: fixed;
  z-index: 1001;
  background: var(--c-bg, #fff);
  border: 1px solid var(--c-border, #ddd);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 160px;
}

.context-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 14px;
  border: none;
  background: none;
  font-size: 13px;
  cursor: pointer;
  color: var(--c-text, #333);
  transition: background 0.1s;
}

.context-menu button:hover {
  background: var(--c-bg-lighter, #f5f5f5);
}

.ctx-danger {
  color: #dc3c3c !important;
}

@media (max-width: 768px) {
  .pg-main {
    flex-direction: column;
  }
  .pg-side {
    width: 100%;
  }
  .pg-toolbar {
    flex-direction: column;
  }
}
</style>
