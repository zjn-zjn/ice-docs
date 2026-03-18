<template>
  <div class="roam-editor">
    <div class="roam-header">{{ label }}</div>
    <textarea
      class="roam-textarea"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      spellcheck="false"
      :placeholder="placeholder"
      :readonly="readonly"
    ></textarea>
    <div v-if="error" class="roam-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  placeholder?: string
  readonly?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const error = computed(() => {
  try {
    if (props.modelValue.trim()) JSON.parse(props.modelValue)
    return ''
  } catch (e: any) {
    return e.message
  }
})
</script>

<style scoped>
.roam-editor {
  display: flex;
  flex-direction: column;
}

.roam-header {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-lighter, #666);
  margin-bottom: 4px;
}

.roam-textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px 10px;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 6px;
  font-family: var(--font-family-code, monospace);
  font-size: 12px;
  background: var(--c-bg, #fff);
  color: var(--c-text, #333);
  resize: vertical;
  line-height: 1.5;
}

.roam-textarea:focus {
  outline: none;
  border-color: var(--c-brand, #e8913a);
}

.roam-error {
  font-size: 11px;
  color: #dc3c3c;
  margin-top: 4px;
}
</style>
