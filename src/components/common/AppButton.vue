<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})
</script>

<template>
  <button
    class="btn"
    :class="`btn-${variant}`"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
}
</style>
