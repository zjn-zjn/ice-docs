<template>
  <div class="interactive-demo">
    <div class="demo-layout">
      <!-- Left: Tree -->
      <div class="tree-side">
        <div ref="treeContainer" class="tree-area"></div>
        <div class="hint">{{ texts.interactive.click_to_edit }}</div>
      </div>

      <!-- Right: Controls + Results -->
      <div class="panel-side">
        <!-- Presets -->
        <div class="panel-section">
          <div class="panel-title">{{ texts.interactive.preset }}</div>
          <div class="presets-list">
            <button
              v-for="p in presets"
              :key="p.key"
              class="preset-btn"
              :class="{ active: activePreset === p.key }"
              @click="selectPreset(p.key)"
            >{{ p.label }}</button>
          </div>
        </div>

        <!-- Controls -->
        <div class="panel-section">
          <div class="control-group">
            <label>{{ texts.interactive.cost }}</label>
            <div class="slider-row">
              <input
                type="range"
                min="0"
                max="200"
                :value="cost"
                @input="cost = Number(($event.target as HTMLInputElement).value)"
                class="slider"
              />
              <span class="slider-val">{{ cost }}</span>
            </div>
          </div>
          <div class="control-group">
            <label>{{ texts.interactive.date }}</label>
            <input
              type="date"
              :value="requestDate"
              @input="requestDate = ($event.target as HTMLInputElement).value"
              class="date-input"
            />
          </div>
        </div>

        <!-- Results -->
        <div v-if="execResult" class="panel-section">
          <div class="result-row">
            <div class="panel-title">{{ texts.interactive.result }}</div>
            <span class="result-badge" :class="execResult.finalResult.toLowerCase()">
              {{ execResult.finalResult }}
            </span>
          </div>
        </div>

        <div v-if="execResult" class="panel-section">
          <div class="panel-title">{{ texts.interactive.roam }}</div>
          <code class="roam-output">{{ JSON.stringify(execResult.roamAfter, null, 2) }}</code>
        </div>

        <div v-if="execResult" class="panel-section">
          <div class="panel-title">{{ texts.interactive.trace }}</div>
          <div class="trace-list">
            <span
              v-for="(step, i) in execResult.steps.filter(s => !s.skipped)"
              :key="i"
              class="trace-item"
              :class="step.result.toLowerCase()"
            >[{{ step.nodeName }}:{{ step.result.charAt(0) }}]</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Node editor -->
    <NodeEditor
      :visible="editorVisible"
      :node="editingNode"
      :texts="texts"
      :locale="locale"
      @close="editorVisible = false"
      @update="runExecution"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import NodeEditor from './NodeEditor.vue'
import type { IceNode, ExecutionResult } from '../shared/types'
import type { I18nMessages } from '../shared/i18n'
import { renderTree } from '../shared/tree-renderer'
import { executeTree } from '../shared/ice-engine'
import {
  createRechargeAny,
  createRechargeAll,
  createRechargeWithTime,
  createRechargeForward
} from '../shared/presets'

const props = defineProps<{
  texts: I18nMessages
  locale: string
}>()

const treeContainer = ref<HTMLElement | null>(null)
const cost = ref(70)
const requestDate = ref('2026-01-05')
const activePreset = ref('any')
const execResult = ref<ExecutionResult | null>(null)
const editorVisible = ref(false)
const editingNode = ref<IceNode | null>(null)
let currentTree: IceNode | null = null

const presets = computed(() => [
  { key: 'any', label: props.texts.interactive.preset_any },
  { key: 'all', label: props.texts.interactive.preset_all },
  { key: 'time', label: props.texts.interactive.preset_time },
  { key: 'forward', label: props.texts.interactive.preset_forward },
])

function selectPreset(key: string) {
  activePreset.value = key
  switch (key) {
    case 'any': currentTree = createRechargeAny(); break
    case 'all': currentTree = createRechargeAll(); break
    case 'time': currentTree = createRechargeWithTime(); break
    case 'forward': currentTree = createRechargeForward(); break
  }
  runExecution()
}

function runExecution() {
  if (!currentTree || !treeContainer.value) return
  const roam: Record<string, any> = {
    uid: 'user_001',
    cost: cost.value,
    requestTime: requestDate.value,
  }
  const result = executeTree(currentTree, roam, requestDate.value)
  execResult.value = result

  const containerWidth = treeContainer.value.clientWidth || 900
  renderTree(treeContainer.value, currentTree, result.steps, {
    width: containerWidth,
    height: 600,
    onNodeClick: (node) => {
      editingNode.value = node
      editorVisible.value = true
    },
  })
}

onMounted(() => {
  selectPreset('any')
})

watch([cost, requestDate], () => {
  runExecution()
})
</script>

<style scoped>
.interactive-demo {
  padding: 8px 0;
}

.demo-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.tree-side {
  flex: 1;
  min-width: 0;
}

.tree-area {
  width: 100%;
  min-height: 600px;
  border: 1px solid var(--ice-border);
  border-radius: 8px;
  background: var(--ice-tree-bg);
  overflow: hidden;
}

.hint {
  text-align: center;
  font-size: 13px;
  color: var(--ice-faint-text);
  padding: 4px;
}

.panel-side {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-section {
  background: var(--ice-panel-bg);
  border-radius: 8px;
  padding: 12px 14px;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ice-sub-text);
  margin-bottom: 8px;
}

.presets-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preset-btn {
  padding: 6px 14px;
  border: 1px solid var(--ice-border);
  border-radius: 6px;
  background: var(--ice-tree-bg);
  color: var(--ice-leaf-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.preset-btn.active {
  background: var(--ice-relation-fill);
  color: var(--ice-badge-text);
  border-color: var(--ice-relation-fill);
}

.preset-btn:hover:not(.active) {
  border-color: var(--ice-relation-fill);
  color: var(--ice-relation-fill);
}

.control-group {
  margin-bottom: 10px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ice-leaf-text);
  margin-bottom: 4px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slider {
  flex: 1;
  accent-color: var(--ice-relation-fill);
}

.slider-val {
  font-family: var(--font-family-code, monospace);
  font-size: 15px;
  font-weight: bold;
  color: var(--ice-relation-fill);
  min-width: 32px;
  text-align: center;
}

.date-input {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid var(--ice-border);
  border-radius: 4px;
  font-size: 13px;
  background: var(--ice-tree-bg);
  color: var(--ice-leaf-text);
  box-sizing: border-box;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-row .panel-title {
  margin-bottom: 0;
}

.result-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}

.result-badge.true { background: var(--ice-exec-true-fill); color: var(--ice-exec-true-text); }
.result-badge.false { background: var(--ice-exec-false-fill); color: var(--ice-exec-false-text); }
.result-badge.none { background: var(--ice-exec-none-fill); color: var(--ice-exec-none-text); }

.roam-output {
  display: block;
  font-size: 12px;
  color: var(--ice-leaf-text);
  white-space: pre;
  line-height: 1.5;
}

.trace-list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  font-family: var(--font-family-code, monospace);
  font-size: 12px;
}

.trace-item {
  padding: 2px 6px;
  border-radius: 3px;
}

.trace-item.true { background: var(--ice-exec-true-fill); color: var(--ice-exec-true-text); }
.trace-item.false { background: var(--ice-exec-false-fill); color: var(--ice-exec-false-text); }
.trace-item.none { background: var(--ice-exec-none-fill); color: var(--ice-exec-none-text); }
.trace-item.rejected { background: var(--ice-exec-false-fill); color: var(--ice-exec-false-text); }
.trace-item.out_of_time { background: var(--ice-exec-skipped-fill); color: var(--ice-exec-skipped-text); }

@media (max-width: 900px) {
  .demo-layout {
    flex-direction: column;
  }
  .panel-side {
    width: 100%;
  }
}
</style>
