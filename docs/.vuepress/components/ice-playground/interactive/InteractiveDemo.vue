<template>
  <div class="interactive-demo">
    <!-- Controls -->
    <div class="controls-bar">
      <div class="control-group">
        <label>{{ texts.interactive.cost }}</label>
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
      <div class="control-group">
        <label>{{ texts.interactive.date }}</label>
        <input
          type="date"
          :value="requestDate"
          @change="requestDate = ($event.target as HTMLInputElement).value"
          class="date-input"
        />
      </div>
    </div>

    <!-- Presets -->
    <div class="presets-bar">
      <span class="presets-label">{{ texts.interactive.preset }}:</span>
      <button
        v-for="p in presets"
        :key="p.key"
        class="preset-btn"
        :class="{ active: activePreset === p.key }"
        @click="selectPreset(p.key)"
      >{{ p.label }}</button>
    </div>

    <!-- Tree -->
    <div class="demo-main">
      <div ref="treeContainer" class="tree-area"></div>
    </div>

    <!-- Results -->
    <div v-if="execResult" class="results-bar">
      <div class="result-panel">
        <div class="result-label">{{ texts.interactive.result }}</div>
        <span class="result-badge" :class="execResult.finalResult.toLowerCase()">
          {{ execResult.finalResult }}
        </span>
      </div>
      <div class="result-panel">
        <div class="result-label">{{ texts.interactive.roam }}</div>
        <code class="roam-output">{{ JSON.stringify(execResult.roamAfter, null, 2) }}</code>
      </div>
      <div class="result-panel trace-panel">
        <div class="result-label">{{ texts.interactive.trace }}</div>
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

    <!-- Hint -->
    <div class="hint">{{ texts.interactive.click_to_edit }}</div>

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
    height: 520,
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

.controls-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 14px;
  background: var(--ice-panel-bg);
  border-radius: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ice-leaf-text);
  white-space: nowrap;
}

.slider {
  width: 140px;
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
  padding: 5px 8px;
  border: 1px solid var(--ice-border);
  border-radius: 4px;
  font-size: 14px;
  background: var(--ice-tree-bg);
  color: var(--ice-leaf-text);
}

.presets-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.presets-label {
  font-size: 14px;
  color: var(--ice-sub-text);
}

.preset-btn {
  padding: 5px 14px;
  border: 1px solid var(--ice-border);
  border-radius: 16px;
  background: var(--ice-tree-bg);
  color: var(--ice-leaf-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
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

.demo-main {
  margin-bottom: 10px;
}

.tree-area {
  width: 100%;
  min-height: 520px;
  border: 1px solid var(--ice-border);
  border-radius: 8px;
  background: var(--ice-tree-bg);
  overflow: hidden;
}

.results-bar {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  margin-bottom: 6px;
}

.result-panel {
  background: var(--ice-panel-bg);
  border-radius: 8px;
  padding: 8px 12px;
}

.trace-panel {
  grid-column: 1 / -1;
}

.result-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ice-sub-text);
  margin-bottom: 4px;
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
  font-size: 13px;
  color: var(--ice-leaf-text);
  white-space: pre;
  line-height: 1.5;
}

.trace-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  font-family: var(--font-family-code, monospace);
  font-size: 13px;
}

.trace-item {
  padding: 2px 7px;
  border-radius: 3px;
}

.trace-item.true { background: var(--ice-exec-true-fill); color: var(--ice-exec-true-text); }
.trace-item.false { background: var(--ice-exec-false-fill); color: var(--ice-exec-false-text); }
.trace-item.none { background: var(--ice-exec-none-fill); color: var(--ice-exec-none-text); }
.trace-item.rejected { background: var(--ice-exec-false-fill); color: var(--ice-exec-false-text); }
.trace-item.out_of_time { background: var(--ice-exec-skipped-fill); color: var(--ice-exec-skipped-text); }

.hint {
  text-align: center;
  font-size: 13px;
  color: var(--ice-faint-text);
  padding: 4px 0 20px;
}

@media (max-width: 768px) {
  .controls-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .results-bar {
    grid-template-columns: 1fr;
  }
}
</style>
