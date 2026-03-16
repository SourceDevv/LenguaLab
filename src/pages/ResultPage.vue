<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import { useCrosswordStore } from '@/stores/useCrosswordStore'

const router = useRouter()
const store = useCrosswordStore()

// Redirect if no game was played
if (store.gameStatus === 'idle') {
  router.replace('/')
}

const maxScore = computed(() => store.clues.length * 10)
const percentage = computed(() =>
  Math.max(0, Math.round((store.score / maxScore.value) * 100))
)

const rankLabel = computed(() => {
  if (percentage.value >= 90) return { label: '🏆 ¡Maestro del Lenguaje!', color: 'var(--color-accent)' }
  if (percentage.value >= 70) return { label: '⭐ ¡Muy Bien!', color: 'var(--color-correct)' }
  if (percentage.value >= 50) return { label: '👍 Buen Esfuerzo', color: '#3b82f6' }
  return { label: '📚 ¡Sigue Practicando!', color: 'var(--color-muted)' }
})

function playAgain() {
  store.resetGame()
  router.push('/')
}
</script>

<template>
  <div class="result-page">
    <div class="result-glow" />

    <div class="result-content anim-fade-in">
      <!-- Trophy area -->
      <div class="trophy-area">
        <div class="trophy-icon">🏅</div>
        <h1 class="result-title">¡Crucigrama Completado!</h1>
        <p class="rank-label" :style="{ color: rankLabel.color }">{{ rankLabel.label }}</p>
      </div>

      <!-- Stats card -->
      <div class="stats-card card">
        <div class="stat-grid">
          <div class="stat-block">
            <span class="stat-big text-accent">{{ store.score }}</span>
            <span class="stat-name">Puntaje Final</span>
          </div>
          <div class="stat-block">
            <span class="stat-big text-correct">{{ store.correctCount }}</span>
            <span class="stat-name">Respuestas Correctas</span>
          </div>
          <div class="stat-block">
            <span class="stat-big text-error">{{ store.incorrectCount }}</span>
            <span class="stat-name">Respuestas Incorrectas</span>
          </div>
          <div class="stat-block">
            <span class="stat-big" :style="{ color: rankLabel.color }">{{ percentage }}%</span>
            <span class="stat-name">Eficiencia</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="result-bar-wrap">
          <div class="result-bar">
            <div
              class="result-bar-fill"
              :style="{ width: `${percentage}%`, background: rankLabel.color }"
            />
          </div>
          <span class="text-muted" style="font-size:0.78rem">{{ percentage }}% del puntaje máximo ({{ maxScore }} pts)</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="result-actions">
        <AppButton variant="primary" @click="playAgain">
          ↩ Jugar de Nuevo
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.result-glow {
  position: absolute;
  inset: -200px;
  background: radial-gradient(circle at 50% 40%, rgba(240,165,0,0.1), transparent 60%);
  pointer-events: none;
}
.result-content {
  position: relative;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.trophy-area { text-align: center; }
.trophy-icon {
  font-size: 5rem;
  margin-bottom: 12px;
  animation: popIn 0.5s 0.2s ease both;
  display: block;
}
.result-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  margin-bottom: 8px;
}
.rank-label {
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
}

.stats-card { padding: 28px; }
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: var(--color-surface2);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}
.stat-big {
  font-size: 2.2rem;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  line-height: 1;
}
.stat-name {
  font-size: 0.72rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
}

.result-bar-wrap { display: flex; flex-direction: column; gap: 8px; }
.result-bar {
  height: 8px;
  background: var(--color-surface2);
  border-radius: 999px;
  overflow: hidden;
}
.result-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 1s ease;
}

.result-actions { display: flex; justify-content: center; }
</style>
