<template>
  <div class="trace-viewer" v-if="steps.length > 0">
    <div class="trace-header">{{ label }}</div>
    <div class="trace-steps">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="trace-step"
        :class="[step.result.toLowerCase(), { skipped: step.skipped }]"
      >
        <span class="trace-order">{{ step.skipped ? '-' : i + 1 }}</span>
        <span class="trace-name">{{ step.nodeName }}</span>
        <span class="trace-type">[{{ step.nodeType.replace('_REL', '').replace('_LEAF', '') }}]</span>
        <span class="trace-result">{{ step.result }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExecutionStep } from '../shared/types'

defineProps<{
  steps: ExecutionStep[]
  label: string
}>()
</script>

<style scoped>
.trace-viewer {
  margin-top: 8px;
}

.trace-header {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-lighter, #666);
  margin-bottom: 6px;
}

.trace-steps {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 200px;
  overflow-y: auto;
  font-family: var(--font-family-code, monospace);
  font-size: 12px;
}

.trace-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--c-bg-lighter, #f9f9f9);
}

.trace-step.skipped {
  opacity: 0.4;
}

.trace-order {
  font-weight: bold;
  min-width: 20px;
  color: var(--c-text-lightest, #aaa);
}

.trace-name {
  font-weight: 600;
  color: var(--c-text, #333);
}

.trace-type {
  color: var(--c-text-lightest, #aaa);
  font-size: 11px;
}

.trace-result {
  margin-left: auto;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 3px;
}

.trace-step.true .trace-result { color: #52a85a; background: rgba(82, 168, 90, 0.1); }
.trace-step.false .trace-result { color: #dc3c3c; background: rgba(220, 60, 60, 0.1); }
.trace-step.none .trace-result { color: #999; }
.trace-step.rejected .trace-result { color: #dc3c3c; }
.trace-step.out_of_time .trace-result { color: #aaa; }
</style>
