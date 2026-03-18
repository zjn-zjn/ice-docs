<template>
  <div class="step-renderer">
    <div class="step-header">
      <span class="step-number">{{ stepIndex + 1 }} / {{ totalSteps }}</span>
      <h3 class="step-title">{{ title }}</h3>
    </div>
    <p class="step-desc">{{ desc }}</p>

    <!-- Step 1: Business scenario - Pack visualization -->
    <div v-if="step.key === 'step1'" class="step-content step-pack">
      <div class="pack-flow">
        <div class="pack-icon">&#x1F464;</div>
        <div class="pack-arrow">&rarr;</div>
        <div class="pack-card">
          <div class="pack-title">Pack</div>
          <div class="pack-field"><span class="pk">uid</span>: "user_001"</div>
          <div class="pack-field"><span class="pk">cost</span>: 70</div>
          <div class="pack-field"><span class="pk">requestTime</span>: "2024-10-05"</div>
        </div>
      </div>
    </div>

    <!-- Step 2: Business nodes -->
    <div v-else-if="step.key === 'step2'" class="step-content step-nodes">
      <div class="node-cards">
        <div class="node-card flow-card">
          <span class="node-badge flow-badge">Flow</span>
          <span class="node-name">ScoreFlow-100</span>
          <span class="node-conf">cost &ge; 100</span>
        </div>
        <div class="node-card result-card">
          <span class="node-badge result-badge">Result</span>
          <span class="node-name">AmountResult</span>
          <span class="node-conf">reward_amount = 5</span>
        </div>
        <div class="node-card flow-card">
          <span class="node-badge flow-badge">Flow</span>
          <span class="node-name">ScoreFlow-50</span>
          <span class="node-conf">cost &ge; 50</span>
        </div>
        <div class="node-card result-card">
          <span class="node-badge result-badge">Result</span>
          <span class="node-name">PointResult</span>
          <span class="node-conf">reward_points = 10</span>
        </div>
      </div>
    </div>

    <!-- Step 3: Traditional approach -->
    <div v-else-if="step.key === 'step3'" class="step-content step-traditional">
      <div class="flowchart">
        <div class="fc-node fc-start">Start</div>
        <div class="fc-arrow">&darr;</div>
        <div class="fc-node fc-diamond">cost &ge; 100?</div>
        <div class="fc-branches">
          <div class="fc-branch">
            <span class="fc-label fc-yes">Yes</span>
            <div class="fc-arrow">&darr;</div>
            <div class="fc-node fc-action">Grant 5 yuan</div>
          </div>
          <div class="fc-branch">
            <span class="fc-label fc-no">No</span>
            <div class="fc-arrow">&darr;</div>
            <div class="fc-node fc-diamond">cost &ge; 50?</div>
            <div class="fc-arrow">&darr;</div>
            <div class="fc-node fc-action">Grant 10 points</div>
          </div>
        </div>
        <div class="fc-problem">
          <span class="fc-warn">&#9888;</span>
          {{ locale === 'en' ? 'Adding "stacking" requires rewriting the entire flow' : '"叠加送"需要重写整个流程' }}
        </div>
      </div>
    </div>

    <!-- Step 4/5/7: Tree visualization -->
    <div v-else-if="step.treeFactory" class="step-content step-tree">
      <div ref="treeContainer" class="tree-container"></div>
    </div>

    <!-- Step 6: Comparison (ANY vs ALL) -->
    <div v-else-if="step.comparison" class="step-content step-comparison">
      <div class="comparison-panels">
        <div class="comp-panel">
          <div class="comp-label">ANY ({{ locale === 'en' ? 'Exclusive' : '不叠加' }})</div>
          <div ref="compBefore" class="tree-container tree-half"></div>
        </div>
        <div class="comp-divider">
          <span class="comp-arrow">&rArr;</span>
        </div>
        <div class="comp-panel">
          <div class="comp-label">ALL ({{ locale === 'en' ? 'Stacking' : '叠加' }})</div>
          <div ref="compAfter" class="tree-container tree-half"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import type { TutorialStep } from './steps'
import type { I18nMessages } from '../shared/i18n'
import { renderTree, animateExecution } from '../shared/tree-renderer'
import { executeTree } from '../shared/ice-engine'

const props = defineProps<{
  step: TutorialStep
  stepIndex: number
  totalSteps: number
  texts: I18nMessages
  locale: string
}>()

const treeContainer = ref<HTMLElement | null>(null)
const compBefore = ref<HTMLElement | null>(null)
const compAfter = ref<HTMLElement | null>(null)

const title = computed(() => {
  const key = `${props.step.key}_title` as keyof typeof props.texts.tutorial
  return props.texts.tutorial[key] || ''
})

const desc = computed(() => {
  const key = `${props.step.key}_desc` as keyof typeof props.texts.tutorial
  return props.texts.tutorial[key] || ''
})

function renderCurrentStep() {
  const { step } = props

  // Single tree steps (4, 5, 7)
  if (step.treeFactory && treeContainer.value) {
    const tree = step.treeFactory()
    if (step.execConfig?.animate) {
      const result = executeTree(tree, step.execConfig.roam, step.execConfig.requestTime)
      animateExecution(treeContainer.value, tree, result.steps, {
        width: 700,
        height: 320,
        stepDelay: 500,
      })
    } else if (step.execConfig) {
      const result = executeTree(tree, step.execConfig.roam, step.execConfig.requestTime)
      renderTree(treeContainer.value, tree, result.steps, { width: 700, height: 320 })
    } else {
      renderTree(treeContainer.value, tree, undefined, { width: 700, height: 320 })
    }
  }

  // Comparison step (6)
  if (step.comparison) {
    if (compBefore.value) {
      const beforeTree = step.comparison.beforeFactory()
      if (step.execConfig) {
        const res = executeTree(beforeTree, step.execConfig.roam, step.execConfig.requestTime)
        renderTree(compBefore.value, beforeTree, res.steps, { width: 380, height: 300 })
      } else {
        renderTree(compBefore.value, beforeTree, undefined, { width: 380, height: 300 })
      }
    }
    if (compAfter.value) {
      const afterTree = step.comparison.afterFactory()
      if (step.execConfig) {
        const res = executeTree(afterTree, step.execConfig.roam, step.execConfig.requestTime)
        renderTree(compAfter.value, afterTree, res.steps, { width: 380, height: 300 })
      } else {
        renderTree(compAfter.value, afterTree, undefined, { width: 380, height: 300 })
      }
    }
  }
}

onMounted(() => {
  nextTick(renderCurrentStep)
})

watch(() => props.stepIndex, () => {
  nextTick(renderCurrentStep)
})
</script>

<style scoped>
.step-renderer {
  min-height: 380px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.step-number {
  background: var(--c-brand, #e8913a);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 12px;
}

.step-title {
  margin: 0;
  font-size: 18px;
  color: var(--c-text, #2c3e50);
}

.step-desc {
  color: var(--c-text-lighter, #666);
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.6;
}

/* Step 1: Pack */
.pack-flow {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.pack-icon {
  font-size: 48px;
}

.pack-arrow {
  font-size: 28px;
  color: var(--c-brand, #e8913a);
  animation: pulse-arrow 1.5s ease-in-out infinite;
}

@keyframes pulse-arrow {
  0%, 100% { opacity: 0.4; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(6px); }
}

.pack-card {
  background: var(--c-bg-lighter, #f9f9f9);
  border: 2px solid var(--c-brand, #e8913a);
  border-radius: 10px;
  padding: 16px 24px;
  min-width: 240px;
}

.pack-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  color: var(--c-brand, #e8913a);
}

.pack-field {
  font-family: var(--font-family-code, monospace);
  font-size: 13px;
  color: var(--c-text, #333);
  line-height: 1.8;
}

.pk {
  color: var(--c-brand, #e8913a);
  font-weight: bold;
}

/* Step 2: Node cards */
.node-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 520px;
  margin: 0 auto;
}

.node-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px;
  border-radius: 10px;
  border: 2px solid;
}

.flow-card { border-color: #4a90d9; background: rgba(74, 144, 217, 0.06); }
.result-card { border-color: #52a85a; background: rgba(82, 168, 90, 0.06); }

.node-badge {
  font-size: 10px;
  font-weight: bold;
  padding: 1px 8px;
  border-radius: 8px;
  color: #fff;
}
.flow-badge { background: #4a90d9; }
.result-badge { background: #52a85a; }

.node-name {
  font-weight: bold;
  font-size: 14px;
  color: var(--c-text, #333);
}

.node-conf {
  font-family: var(--font-family-code, monospace);
  font-size: 12px;
  color: var(--c-text-lighter, #888);
}

/* Step 3: Flowchart */
.flowchart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
}

.fc-node {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.fc-start { background: var(--c-bg-lighter, #eee); color: var(--c-text, #333); border-radius: 20px; }
.fc-diamond {
  background: #fef3c7;
  border: 2px solid #f59e0b;
  color: #92400e;
  transform: rotate(0deg);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  padding: 20px 30px;
  font-size: 12px;
}
.fc-action { background: #dbeafe; border: 2px solid #4a90d9; color: #1e40af; }

.fc-arrow { color: var(--c-text-lighter, #999); font-size: 18px; }

.fc-branches {
  display: flex;
  gap: 40px;
  margin-top: 4px;
}

.fc-branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.fc-label { font-size: 12px; font-weight: bold; }
.fc-yes { color: #52a85a; }
.fc-no { color: #dc3c3c; }

.fc-problem {
  margin-top: 16px;
  padding: 8px 16px;
  background: rgba(220, 60, 60, 0.08);
  border: 1px solid rgba(220, 60, 60, 0.3);
  border-radius: 8px;
  color: #dc3c3c;
  font-size: 13px;
}

.fc-warn {
  margin-right: 6px;
}

/* Tree container */
.tree-container {
  width: 100%;
  min-height: 320px;
  border: 1px solid var(--c-border, #eee);
  border-radius: 8px;
  background: var(--c-bg, #fff);
  overflow: hidden;
}

.tree-half {
  min-height: 300px;
}

/* Step 6: Comparison */
.comparison-panels {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.comp-panel {
  flex: 1;
  min-width: 0;
}

.comp-label {
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  padding: 6px;
  color: var(--c-brand, #e8913a);
}

.comp-divider {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.comp-arrow {
  font-size: 24px;
  color: var(--c-brand, #e8913a);
}

@media (max-width: 768px) {
  .comparison-panels {
    flex-direction: column;
  }
  .comp-divider {
    justify-content: center;
    transform: rotate(90deg);
  }
  .node-cards {
    grid-template-columns: 1fr;
  }
  .fc-branches {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
