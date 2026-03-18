<template>
  <div v-if="visible" class="node-editor-overlay" @click.self="close">
    <div class="node-editor">
      <div class="editor-header">
        <h4>
          <span class="editor-type-badge" :style="{ background: typeBadgeColor }">{{ typeBadgeLabel }}</span>
          {{ node?.name || '' }}
        </h4>
        <button class="close-btn" @click="close">&times;</button>
      </div>
      <div class="editor-body" v-if="node">
        <!-- Relation node: change type -->
        <div v-if="isRelationNode" class="field-group">
          <label>{{ texts.playground.change_type }}</label>
          <div class="type-buttons">
            <button
              v-for="t in relationTypes"
              :key="t"
              class="type-btn"
              :class="{ active: node.type === t }"
              @click="changeType(t)"
            >{{ t.replace('_REL', '') }}</button>
          </div>
        </div>

        <!-- Leaf node: confField editor (no type change) -->
        <div v-if="!isRelationNode && node.confField" class="field-group">
          <label>{{ texts.playground.edit_conf }}</label>
          <div v-for="(val, key) in node.confField" :key="key" class="conf-row">
            <span class="conf-key">{{ key }}</span>
            <input
              :type="isDateField(key as string) ? 'date' : 'text'"
              :class="isDateField(key as string) ? 'time-input' : 'conf-input'"
              :value="val"
              @change="updateConf(key as string, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <!-- Time range -->
        <div class="field-group">
          <label>{{ texts.playground.effective_time }}</label>
          <div v-if="node.timeRange" class="time-row">
            <input
              type="date"
              class="time-input"
              :value="node.timeRange.start"
              @change="updateTimeStart(($event.target as HTMLInputElement).value)"
            />
            <span class="time-sep">~</span>
            <input
              type="date"
              class="time-input"
              :value="node.timeRange.end"
              @change="updateTimeEnd(($event.target as HTMLInputElement).value)"
            />
            <button
              class="time-clear"
              @click="clearTime"
              :title="locale === 'en' ? 'Clear time range' : '清除时间范围'"
            >&times;</button>
          </div>
          <button v-else class="add-time-btn" @click="addTimeRange">
            + {{ locale === 'en' ? 'Add time range' : '添加时间范围' }}
          </button>
        </div>

        <!-- Inverse toggle -->
        <div class="field-group">
          <label>
            <input type="checkbox" :checked="node.inverse" @change="toggleInverse" />
            {{ texts.playground.toggle_inverse }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IceNode, NodeType, RelationType } from '../shared/types'
import { isRelation } from '../shared/types'
import type { I18nMessages } from '../shared/i18n'

const props = defineProps<{
  visible: boolean
  node: IceNode | null
  texts: I18nMessages
  locale?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update'): void
}>()

const relationTypes: RelationType[] = ['AND', 'ANY', 'ALL', 'NONE_REL', 'TRUE_REL']

const isRelationNode = computed(() => props.node && isRelation(props.node.type))

const typeBadgeLabel = computed(() => {
  if (!props.node) return ''
  if (isRelationNode.value) return props.node.type.replace('_REL', '')
  return props.node.type === 'FLOW' ? 'Flow' : props.node.type === 'RESULT' ? 'Result' : 'None'
})

const typeBadgeColor = computed(() => {
  if (!props.node) return 'var(--ice-none-badge)'
  const t = props.node.type
  if (isRelationNode.value) return 'var(--ice-relation-fill)'
  if (t === 'FLOW') return 'var(--ice-flow-badge)'
  if (t === 'RESULT') return 'var(--ice-result-badge)'
  return 'var(--ice-none-badge)'
})

function isDateField(key: string): boolean {
  return key === 'newTime'
}

function close() {
  emit('close')
}

function changeType(newType: NodeType) {
  if (props.node) {
    props.node.type = newType
    props.node.name = newType.replace('_REL', '').replace('_LEAF', '')
    emit('update')
  }
}

function updateConf(key: string, rawValue: string) {
  if (props.node?.confField) {
    const num = Number(rawValue)
    props.node.confField[key] = isNaN(num) ? rawValue : num
    emit('update')
  }
}

function updateTimeStart(val: string) {
  if (!props.node) return
  if (!val && !props.node.timeRange?.end) {
    delete props.node.timeRange
  } else {
    if (!props.node.timeRange) {
      props.node.timeRange = { start: val, end: val }
    } else {
      props.node.timeRange.start = val
    }
  }
  emit('update')
}

function updateTimeEnd(val: string) {
  if (!props.node) return
  if (!val && !props.node.timeRange?.start) {
    delete props.node.timeRange
  } else {
    if (!props.node.timeRange) {
      props.node.timeRange = { start: val, end: val }
    } else {
      props.node.timeRange.end = val
    }
  }
  emit('update')
}

function addTimeRange() {
  if (props.node) {
    props.node.timeRange = { start: '2026-01-01', end: '2026-01-07' }
    emit('update')
  }
}

function clearTime() {
  if (props.node) {
    delete props.node.timeRange
    emit('update')
  }
}

function toggleInverse() {
  if (props.node) {
    props.node.inverse = !props.node.inverse
    emit('update')
  }
}
</script>

<style scoped>
.node-editor-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.node-editor {
  background: var(--ice-panel-bg);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 340px;
  max-width: 440px;
  overflow: hidden;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ice-border);
}

.editor-header h4 {
  margin: 0;
  font-size: 16px;
  color: var(--ice-leaf-text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-type-badge {
  font-size: 11px;
  font-weight: bold;
  color: var(--ice-badge-text);
  padding: 2px 8px;
  border-radius: 4px;
}

.close-btn {
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--ice-sub-text);
  padding: 0 4px;
}

.editor-body {
  padding: 16px;
}

.field-group {
  margin-bottom: 14px;
}

.field-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ice-leaf-text);
  margin-bottom: 6px;
}

.type-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.type-btn {
  padding: 4px 12px;
  border: 1px solid var(--ice-border);
  border-radius: 4px;
  background: var(--ice-tree-bg);
  color: var(--ice-leaf-text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.type-btn.active {
  background: var(--ice-relation-fill);
  color: var(--ice-badge-text);
  border-color: var(--ice-relation-fill);
}

.type-btn:hover:not(.active) {
  border-color: var(--ice-relation-fill);
}

.conf-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.conf-key {
  font-family: var(--font-family-code, monospace);
  font-size: 13px;
  color: var(--ice-relation-fill);
  min-width: 80px;
}

.conf-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--ice-border);
  border-radius: 4px;
  font-size: 13px;
  font-family: var(--font-family-code, monospace);
  background: var(--ice-tree-bg);
  color: var(--ice-leaf-text);
}

.conf-input:focus {
  outline: none;
  border-color: var(--ice-relation-fill);
}

.time-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.time-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--ice-border);
  border-radius: 4px;
  font-size: 13px;
  background: var(--ice-tree-bg);
  color: var(--ice-leaf-text);
}

.time-input:focus {
  outline: none;
  border-color: var(--ice-relation-fill);
}

.time-sep {
  color: var(--ice-sub-text);
  font-size: 14px;
}

.time-clear {
  border: none;
  background: none;
  color: var(--ice-sub-text);
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.time-clear:hover {
  color: var(--ice-error-color);
}

.add-time-btn {
  border: 1px dashed var(--ice-border);
  background: var(--ice-tree-bg);
  color: var(--ice-sub-text);
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.add-time-btn:hover {
  border-color: var(--ice-relation-fill);
  color: var(--ice-relation-fill);
}
</style>
