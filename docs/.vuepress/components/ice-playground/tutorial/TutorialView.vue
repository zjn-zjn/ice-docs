<template>
  <div class="tutorial-view">
    <StepRenderer
      :step="currentStep"
      :stepIndex="currentIndex"
      :totalSteps="steps.length"
      :texts="texts"
      :locale="locale"
    />
    <div class="tutorial-nav">
      <button
        class="nav-btn"
        :disabled="currentIndex === 0"
        @click="prev"
      >
        &larr; {{ texts.tutorial.prev }}
      </button>
      <div class="step-dots">
        <span
          v-for="(_, i) in steps"
          :key="i"
          class="dot"
          :class="{ active: i === currentIndex, done: i < currentIndex }"
          @click="goTo(i)"
        ></span>
      </div>
      <button
        v-if="currentIndex < steps.length - 1"
        class="nav-btn nav-btn-primary"
        @click="next"
      >
        {{ texts.tutorial.next }} &rarr;
      </button>
      <button
        v-else
        class="nav-btn nav-btn-primary"
        @click="goTo(0)"
      >
        {{ texts.tutorial.replay }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StepRenderer from './StepRenderer.vue'
import { createTutorialSteps } from './steps'
import type { I18nMessages } from '../shared/i18n'

const props = defineProps<{
  texts: I18nMessages
  locale: string
}>()

const steps = createTutorialSteps()
const currentIndex = ref(0)

const currentStep = computed(() => steps[currentIndex.value])

function next() {
  if (currentIndex.value < steps.length - 1) {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function goTo(i: number) {
  currentIndex.value = i
}
</script>

<style scoped>
.tutorial-view {
  padding: 16px 0;
}

.tutorial-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--c-border, #eee);
}

.nav-btn {
  padding: 8px 20px;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 6px;
  background: var(--c-bg, #fff);
  color: var(--c-text, #333);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  border-color: var(--c-brand, #e8913a);
  color: var(--c-brand, #e8913a);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn-primary {
  background: var(--c-brand, #e8913a);
  color: #fff;
  border-color: var(--c-brand, #e8913a);
}

.nav-btn-primary:hover:not(:disabled) {
  background: var(--c-brand-light, #f0a050);
  color: #fff;
}

.step-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-border, #ddd);
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: var(--c-brand, #e8913a);
  transform: scale(1.3);
}

.dot.done {
  background: var(--c-brand, #e8913a);
  opacity: 0.5;
}

.dot:hover {
  transform: scale(1.2);
}
</style>
