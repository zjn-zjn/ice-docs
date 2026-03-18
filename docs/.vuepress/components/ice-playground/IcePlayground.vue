<template>
  <ClientOnly>
    <div class="ice-playground">
      <InteractiveDemo
        :texts="texts"
        :locale="locale"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from './shared/i18n'
import InteractiveDemo from './interactive/InteractiveDemo.vue'

const props = defineProps<{
  locale?: string
}>()

const locale = computed(() => props.locale || 'zh')
const texts = computed(() => useI18n(locale.value))
</script>

<style scoped>
.ice-playground {
  max-width: 1600px;
  margin: 0 auto;
  padding: 12px 0;
}
</style>
