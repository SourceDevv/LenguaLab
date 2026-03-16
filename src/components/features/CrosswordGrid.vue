<script setup lang="ts">
import { computed } from 'vue'
import CrosswordCell from './CrosswordCell.vue'
import type { CrosswordCell as CellType } from '@/types/crossword'
import { useCrosswordStore } from '@/stores/useCrosswordStore'

const store = useCrosswordStore()

// --- Active cells: all cells that belong to the active clue ---
const activeCells = computed<Set<string>>(() => {
  const set = new Set<string>()
  if (!store.activeClue) return set
  const clue = store.activeClue
  for (let i = 0; i < clue.answer.length; i++) {
    const r = clue.direction === 'across' ? clue.row : clue.row + i
    const c = clue.direction === 'across' ? clue.col + i : clue.col
    set.add(`${r}-${c}`)
  }
  return set
})

function isCellActive(cell: CellType): boolean {
  return activeCells.value.has(`${cell.row}-${cell.col}`)
}

// --- Cell click: find the clue(s) passing through this cell, cycle on re-click ---
function handleCellSelected(row: number, col: number) {
  const clickedCell = store.grid[row]?.[col]
  if (!clickedCell || clickedCell.isBlack) return

  const cluesForCell = store.clues.filter(clue => {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === 'across' ? clue.row : clue.row + i
      const c = clue.direction === 'across' ? clue.col + i : clue.col
      if (r === row && c === col) return true
    }
    return false
  }).filter(clue => !store.answeredClueIds.has(clue.id))

  if (cluesForCell.length === 0) return

  const currentIdx = cluesForCell.findIndex(c => c.id === store.activeClueId)
  const nextClue   = cluesForCell[(currentIdx + 1) % cluesForCell.length]
  store.selectClue(nextClue.id)
}
</script>

<template>
  <div class="grid-wrapper">
    <div
      class="crossword-grid"
      :style="{
        gridTemplateColumns: `repeat(${store.gridCols}, var(--cell-size))`,
        gridTemplateRows:    `repeat(${store.gridRows}, var(--cell-size))`,
      }"
    >
      <template v-for="row in store.grid" :key="row[0].row">
        <CrosswordCell
          v-for="cell in row"
          :key="`${cell.row}-${cell.col}`"
          :cell="cell"
          :is-active="isCellActive(cell)"
          @cell-selected="handleCellSelected"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.grid-wrapper {
  display: flex;
  justify-content: center;
  padding: 8px;
  overflow-x: auto;
}
.crossword-grid {
  display: grid;
  gap: 2px;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px;
  box-shadow: var(--shadow-md);
}
</style>
