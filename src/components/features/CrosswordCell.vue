<script setup lang="ts">
import type { CrosswordCell } from '@/types/crossword'

// --- Props ---
interface Props {
  cell: CrosswordCell
  isActive: boolean
}

const props = defineProps<Props>()

// --- Emits ---
const emit = defineEmits<{
  cellSelected: [row: number, col: number]
}>()

// --- Handlers ---
function handleClick() {
  if (!props.cell.isBlack) {
    emit('cellSelected', props.cell.row, props.cell.col)
  }
}
</script>

<template>
  <div
    class="cell"
    :class="{
      'cell-black': cell.isBlack,
      'cell-active': isActive && !cell.isBlack,
      'cell-correct': cell.isCorrect === true,
      'cell-answered': cell.userLetter !== '',
    }"
    @click="handleClick"
  >
    <!-- Clue number -->
    <span v-if="cell.clueNumbers.length && !cell.isBlack && cell.clueNumbers[0] !== 0" class="cell-num">
      {{ cell.clueNumbers[0] }}
    </span>
    <!-- User letter -->
    <span v-if="cell.userLetter" class="cell-letter" :class="{ 'letter-correct': cell.isCorrect }">
      {{ cell.userLetter }}
    </span>
  </div>
</template>

<style scoped>
.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
  border-radius: 3px;
  user-select: none;
}
.cell:hover:not(.cell-black):not(.cell-answered) {
  background: var(--color-active-bg);
  border-color: var(--color-active);
}

.cell-black {
  background: var(--color-bg);
  border-color: var(--color-bg);
  cursor: default;
}

.cell-active {
  background: var(--color-active-bg);
  border-color: var(--color-active);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  animation: pulse-ring 1.8s infinite;
}

.cell-correct {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.4);
}

.cell-answered {
  cursor: default;
}

.cell-num {
  position: absolute;
  top: 2px;
  left: 3px;
  font-size: clamp(7px, 1vw, 10px);
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.cell-letter {
  font-size: clamp(11px, 2.2vw, 22px);
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: 0;
  animation: popIn 0.3s ease both;
}
.letter-correct { color: var(--color-correct); }
</style>
