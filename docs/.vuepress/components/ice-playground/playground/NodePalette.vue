<template>
  <div class="node-palette">
    <div class="palette-header">{{ texts.playground.palette }}</div>
    <div class="palette-section">
      <div class="section-label">Relation</div>
      <div class="palette-items">
        <button
          v-for="t in relationNodes"
          :key="t.type"
          class="palette-item relation-item"
          @click="$emit('addNode', t.type)"
        >
          <span class="item-circle" :style="{ background: t.color }">{{ t.short }}</span>
          <span class="item-label">{{ texts.nodes[t.type] || t.type }}</span>
        </button>
      </div>
    </div>
    <div class="palette-section">
      <div class="section-label">Leaf</div>
      <div class="palette-items">
        <button
          v-for="t in leafNodes"
          :key="t.type"
          class="palette-item leaf-item"
          @click="$emit('addNode', t.type)"
        >
          <span class="item-rect" :style="{ borderColor: t.color }">{{ t.short }}</span>
          <span class="item-label">{{ texts.nodes[t.type] || t.type }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodeType } from '../shared/types'
import type { I18nMessages } from '../shared/i18n'

defineProps<{
  texts: I18nMessages
}>()

defineEmits<{
  (e: 'addNode', type: NodeType): void
}>()

const relationNodes = [
  { type: 'AND' as NodeType, short: 'AND', color: '#e8913a' },
  { type: 'ANY' as NodeType, short: 'ANY', color: '#e8913a' },
  { type: 'ALL' as NodeType, short: 'ALL', color: '#e8913a' },
  { type: 'NONE_REL' as NodeType, short: 'NONE', color: '#999' },
  { type: 'TRUE_REL' as NodeType, short: 'TRUE', color: '#52a85a' },
]

const leafNodes = [
  { type: 'FLOW' as NodeType, short: 'F', color: '#4a90d9' },
  { type: 'RESULT' as NodeType, short: 'R', color: '#52a85a' },
  { type: 'NONE_LEAF' as NodeType, short: 'N', color: '#999' },
]
</script>

<style scoped>
.node-palette {
  padding: 8px 0;
}

.palette-header {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text, #333);
  margin-bottom: 10px;
}

.palette-section {
  margin-bottom: 12px;
}

.section-label {
  font-size: 11px;
  color: var(--c-text-lightest, #aaa);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.palette-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 6px;
  background: var(--c-bg, #fff);
  cursor: pointer;
  transition: all 0.15s;
  font-size: 12px;
}

.palette-item:hover {
  border-color: var(--c-brand, #e8913a);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.item-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: bold;
}

.item-rect {
  width: 26px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text, #333);
  font-size: 9px;
  font-weight: bold;
  background: transparent;
}

.item-label {
  color: var(--c-text, #333);
}
</style>
