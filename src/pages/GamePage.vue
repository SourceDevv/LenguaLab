<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import CrosswordGrid from '@/components/features/CrosswordGrid.vue'
import ClueList from '@/components/features/ClueList.vue'
import ScoreBoard from '@/components/features/ScoreBoard.vue'
import QuestionModal from '@/components/features/QuestionModal.vue'
import { useCrosswordStore } from '@/stores/useCrosswordStore'

const router = useRouter()
const store = useCrosswordStore()

// Redirect if game not started
if (store.gameStatus === 'idle') {
  router.replace('/')
}

// When game completes, navigate to result
watch(() => store.isComplete, (done) => {
  if (done) {
    setTimeout(() => router.push('/result'), 800)
  }
})

function handleAnswerSubmitted(answer: string) {
  store.submitAnswer(answer)
}

function handleModalCancelled() {
  store.dismissModal()
}
</script>

<template>
  <div class="game-page">
    <AppHeader :score="store.score" />

    <main class="game-layout">
      <!-- Left: clues + score -->
      <aside class="game-sidebar">
        <ScoreBoard />
        <ClueList />
      </aside>

      <!-- Center: grid -->
      <section class="game-center">
        <div class="active-clue-banner" v-if="store.activeClue">
          <span class="banner-num text-accent">{{ store.activeClue.number }}</span>
          <span class="banner-text">{{ store.activeClue.clue }}</span>
        </div>
        <CrosswordGrid />
        <p v-if="!store.activeClue" class="hint-text text-muted">
          Haz clic en una celda o en una pista para comenzar responder
        </p>
      </section>
    </main>

    <!-- Question modal -->
    <QuestionModal
      :clue="store.activeClue"
      @answer-submitted="handleAnswerSubmitted"
      @cancelled="handleModalCancelled"
    />
  </div>
</template>

<style scoped>
.game-page {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.game-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 860px) {
  .game-layout {
    grid-template-columns: 280px 1fr;
    align-items: start;
  }
}

.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  order: 2;
}
@media (min-width: 860px) { .game-sidebar { order: 1; } }

.game-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  order: 1;
}
@media (min-width: 860px) { .game-center { order: 2; } }

.active-clue-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  width: 100%;
  max-width: 560px;
  animation: fadeIn 0.25s ease both;
}
.banner-num {
  font-weight: 800;
  font-size: 1.05rem;
  flex-shrink: 0;
}
.banner-text {
  font-size: 0.9rem;
  color: var(--color-text);
  line-height: 1.5;
}

.hint-text {
  font-size: 0.82rem;
  text-align: center;
  margin-top: 4px;
}
</style>
