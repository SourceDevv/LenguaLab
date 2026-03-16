<script setup lang="ts">
import { useCrosswordStore } from '@/stores/useCrosswordStore'

const store = useCrosswordStore()
</script>

<template>
  <div class="score-board card">
    <div class="score-row">
      <div class="score-stat">
        <span class="stat-value text-accent">{{ store.score }}</span>
        <span class="stat-label">Puntaje Total</span>
      </div>
      <div class="divider" />
      <div class="score-stat">
        <span class="stat-value text-correct">{{ store.correctCount }}</span>
        <span class="stat-label">Correctas</span>
      </div>
      <div class="divider" />
      <div class="score-stat">
        <span class="stat-value text-error">{{ store.incorrectCount }}</span>
        <span class="stat-label">Incorrectas</span>
      </div>
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${(store.correctCount / store.clues.length) * 100}%` }"
      />
    </div>
    <p class="progress-label text-muted">
      {{ store.correctCount }} / {{ store.clues.length }} palabras completadas
    </p>
  </div>
</template>

<style scoped>
.score-board { padding: 16px 20px; }

.score-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  margin-bottom: 14px;
}

.score-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.divider {
  width: 1px;
  height: 36px;
  background: var(--color-border);
}

.progress-bar {
  height: 6px;
  background: var(--color-surface2);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-correct), #16a34a);
  border-radius: 999px;
  transition: width 0.5s ease;
}

.progress-label {
  font-size: 0.75rem;
  text-align: center;
}
</style>
