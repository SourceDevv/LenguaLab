<script setup lang="ts">
import { computed } from 'vue'
import type { CrosswordClue } from '@/types/crossword'
import { useCrosswordStore } from '@/stores/useCrosswordStore'

const store = useCrosswordStore()

// --- Computed ---
const acrossClues = computed<CrosswordClue[]>(() =>
  store.clues.filter(c => c.direction === 'across').sort((a, b) => a.number - b.number)
)
const downClues = computed<CrosswordClue[]>(() =>
  store.clues.filter(c => c.direction === 'down').sort((a, b) => a.number - b.number)
)

function isAnswered(clue: CrosswordClue): boolean {
  return store.answeredClueIds.has(clue.id)
}
function isActive(clue: CrosswordClue): boolean {
  return store.activeClueId === clue.id
}
function handleClueClick(clue: CrosswordClue) {
  if (!isAnswered(clue)) store.selectClue(clue.id)
}
</script>

<template>
  <div class="clue-list card">
    <h3 class="clue-list-title">📋 Pistas</h3>

    <section class="clue-section">
      <h4 class="section-heading">Horizontales</h4>
      <ul class="clue-items">
        <li
          v-for="clue in acrossClues"
          :key="clue.id"
          class="clue-item"
          :class="{
            'clue-active': isActive(clue),
            'clue-answered': isAnswered(clue),
          }"
          @click="handleClueClick(clue)"
        >
          <span class="clue-number">{{ clue.number }}</span>
          <span class="clue-text">{{ clue.clue }}</span>
          <span v-if="isAnswered(clue)" class="clue-check">✓</span>
        </li>
      </ul>
    </section>

    <section class="clue-section">
      <h4 class="section-heading">Verticales</h4>
      <ul class="clue-items">
        <li
          v-for="clue in downClues"
          :key="clue.id"
          class="clue-item"
          :class="{
            'clue-active': isActive(clue),
            'clue-answered': isAnswered(clue),
          }"
          @click="handleClueClick(clue)"
        >
          <span class="clue-number">{{ clue.number }}</span>
          <span class="clue-text">{{ clue.clue }}</span>
          <span v-if="isAnswered(clue)" class="clue-check">✓</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.clue-list { padding: 20px; }

.clue-list-title {
  font-size: 1.1rem;
  color: var(--color-accent);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.clue-section { margin-bottom: 20px; }
.clue-section:last-child { margin-bottom: 0; }

.section-heading {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
}

.clue-items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.clue-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s, border-left-color 0.15s;
  border-left: 3px solid transparent;
  font-size: 0.87rem;
  line-height: 1.5;
}
.clue-item:hover:not(.clue-answered) {
  background: var(--color-surface2);
  border-left-color: var(--color-accent);
}

.clue-active {
  background: var(--color-active-bg) !important;
  border-left-color: var(--color-active) !important;
}

.clue-answered {
  opacity: 0.5;
  cursor: default;
}

.clue-number {
  font-weight: 700;
  color: var(--color-accent);
  min-width: 20px;
  font-size: 0.82rem;
}
.clue-text { flex: 1; color: var(--color-text); }
.clue-check {
  color: var(--color-correct);
  font-weight: 700;
  flex-shrink: 0;
}
</style>
