import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CrosswordCell, CrosswordClue, GameStatus } from '@/types/crossword'
import { QA_POOL, POINTS_CORRECT, POINTS_INCORRECT } from '@/data/crosswordData'
import { generateCrossword } from '@/utils/crosswordGenerator'

// --- Normalize answers: uppercase, no accents/ñ ---
function normalizeText(s: string): string {
  return s
    .toUpperCase()
    .replace(/[ÁÀÂÄ]/g, 'A')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[ÓÒÔÖ]/g, 'O')
    .replace(/[ÚÙÛÜÜ]/g, 'U')
    .replace(/Ñ/g, 'N')
    .trim()
}

export const useCrosswordStore = defineStore('crossword', () => {
  // --- Game state ---
  const gameStatus    = ref<GameStatus>('idle')
  const score         = ref(0)
  const correctCount  = ref(0)
  const incorrectCount = ref(0)
  const activeClueId  = ref<number | null>(null)
  const answeredClueIds = ref<Set<number>>(new Set())

  // --- Dynamic layout ---
  const activeClues = ref<CrosswordClue[]>([])
  const gridRows    = ref(0)
  const gridCols    = ref(0)
  const grid        = ref<CrosswordCell[][]>([])

  // --- Computed ---
  const clues = computed(() => activeClues.value)

  const activeClue = computed<CrosswordClue | null>(() =>
    activeClueId.value !== null
      ? activeClues.value.find(c => c.id === activeClueId.value) ?? null
      : null
  )

  const isComplete = computed(() =>
    activeClues.value.length > 0 &&
    activeClues.value.every(c => answeredClueIds.value.has(c.id))
  )

  // --- Build grid from clues ---
  function buildGrid(clueList: CrosswordClue[], rows: number, cols: number): CrosswordCell[][] {
    const g: CrosswordCell[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        letter: '',
        userLetter: '',
        isBlack: true,
        clueNumbers: [],
        directions: [] as ('across' | 'down')[],
        isCorrect: null,
      }))
    )

    for (const clue of clueList) {
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i
        const c = clue.direction === 'across' ? clue.col + i : clue.col
        const cell = g[r][c]
        cell.letter = clue.answer[i]
        cell.isBlack = false
        if (!cell.clueNumbers.includes(clue.number)) cell.clueNumbers.push(clue.number)
        if (!cell.directions.includes(clue.direction))  cell.directions.push(clue.direction)
      }
    }
    return g
  }

  // --- Actions ---
  function startGame() {
    // Reset state
    score.value          = 0
    correctCount.value   = 0
    incorrectCount.value = 0
    activeClueId.value   = null
    answeredClueIds.value = new Set()

    // Generate crossword layout, retry up to 60 times for variety
    let result = null
    let attempts = 0
    while (!result && attempts < 60) {
      result = generateCrossword(QA_POOL, 5, 7)
      attempts++
    }
    // Fallback: allow 4-word crossword if needed
    if (!result) {
      result = generateCrossword(QA_POOL, 4, 6)
    }

    if (!result) {
      console.error('Failed to generate crossword after 40 attempts')
      return
    }

    activeClues.value = result.clues
    gridRows.value    = result.gridRows
    gridCols.value    = result.gridCols
    grid.value        = buildGrid(result.clues, result.gridRows, result.gridCols)
    gameStatus.value  = 'playing'
  }

  function selectClue(clueId: number) {
    if (answeredClueIds.value.has(clueId)) return
    activeClueId.value = clueId
  }

  function submitAnswer(rawAnswer: string) {
    if (!activeClue.value) return

    const clue        = activeClue.value
    const userAnswer  = normalizeText(rawAnswer)
    const isCorrect   = userAnswer === normalizeText(clue.answer)

    if (isCorrect) {
      score.value += POINTS_CORRECT
      correctCount.value++
      // Fill cells
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i
        const c = clue.direction === 'across' ? clue.col + i : clue.col
        grid.value[r][c].userLetter = clue.answer[i]
        grid.value[r][c].isCorrect  = true
      }
      answeredClueIds.value.add(clue.id)
    } else {
      score.value += POINTS_INCORRECT
      incorrectCount.value++
    }

    activeClueId.value = null

    if (isComplete.value) {
      gameStatus.value = 'finished'
    }
  }

  function dismissModal() {
    activeClueId.value = null
  }

  function resetGame() {
    gameStatus.value     = 'idle'
    score.value          = 0
    correctCount.value   = 0
    incorrectCount.value = 0
    activeClueId.value   = null
    answeredClueIds.value = new Set()
    activeClues.value    = []
    grid.value           = []
    gridRows.value       = 0
    gridCols.value       = 0
  }

  return {
    gameStatus,
    score,
    correctCount,
    incorrectCount,
    activeClueId,
    activeClue,
    answeredClueIds,
    grid,
    gridRows,
    gridCols,
    clues,
    isComplete,
    startGame,
    selectClue,
    submitAnswer,
    dismissModal,
    resetGame,
  }
})
