<script setup lang="ts">
// --- Props ---
interface Props {
  title?: string
  score?: number
}

withDefaults(defineProps<Props>(), {
  title: 'LenguaLab',
  score: 0,
})
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon">✦</span>
        <h1 class="brand-name">{{ title }}</h1>
        <span class="brand-tag">Crucigrama de Español</span>
      </div>
      <div class="score-chip">
        <span class="score-label">Puntaje</span>
        <span class="score-value" :class="{ negative: score < 0 }">{{ score }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(180deg, rgba(19,25,43,0.98) 0%, rgba(19,25,43,0.9) 100%);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-icon {
  font-size: 1.4rem;
  color: var(--color-accent);
  animation: pulse-ring 2s infinite;
}
.brand-name {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--color-accent), #fff 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.brand-tag {
  font-size: 0.72rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 500;
  display: none;
}
@media (min-width: 640px) { .brand-tag { display: block; } }

.score-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 8px 20px;
}
.score-label {
  font-size: 0.78rem;
  color: var(--color-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.score-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-accent);
  transition: color 0.3s;
}
.score-value.negative { color: var(--color-incorrect); }
</style>
