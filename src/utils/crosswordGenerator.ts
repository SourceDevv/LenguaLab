/**
 * Crossword Layout Generator
 *
 * Algorithm:
 * 1. Shuffle the Q&A pool and sort longest-first.
 * 2. Place the first word horizontally at the origin.
 * 3. For each remaining candidate, try every shared-letter intersection
 *    against every already-placed word (perpendicular direction).
 * 4. A placement is valid when:
 *    a. Every shared cell has the same letter.
 *    b. No same-direction overlap.
 *    c. No same-direction word extends directly into this word's endpoints.
 * 5. Repeat until 5-7 words are placed or the pool is exhausted.
 * 6. Normalize coordinates and assign clue numbers top-left → bottom-right.
 */

import type { CrosswordClue, QAItem } from '@/types/crossword'

// --- Internal types ---
interface PlacedWord {
  qaItem: QAItem
  answer: string
  row: number
  col: number
  direction: 'across' | 'down'
}

type CellInfo = { letter: string; dir: 'across' | 'down' }
type CellMap = Map<string, CellInfo>

// --- Helpers ---
function cellKey(row: number, col: number): string {
  return `${row},${col}`
}

function getWordCells(word: PlacedWord): { row: number; col: number; letter: string }[] {
  return word.answer.split('').map((letter, i) => ({
    row: word.direction === 'across' ? word.row : word.row + i,
    col: word.direction === 'across' ? word.col + i : word.col,
    letter,
  }))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Returns true if the word can be placed without conflicts. */
function canPlace(word: PlacedWord, cellMap: CellMap): boolean {
  const cells = getWordCells(word)

  // Rule 1 – each cell must be empty OR a valid perpendicular intersection
  for (const { row, col, letter } of cells) {
    const existing = cellMap.get(cellKey(row, col))
    if (existing) {
      if (existing.letter !== letter) return false     // letter mismatch
      if (existing.dir === word.direction) return false // same-direction overlap
    }
  }

  // Rule 2 – no same-direction word extending into the endpoints
  const len = word.answer.length
  if (word.direction === 'across') {
    const before = cellMap.get(cellKey(word.row, word.col - 1))
    const after  = cellMap.get(cellKey(word.row, word.col + len))
    if (before?.dir === 'across') return false
    if (after?.dir  === 'across') return false
  } else {
    const before = cellMap.get(cellKey(word.row - 1, word.col))
    const after  = cellMap.get(cellKey(word.row + len, word.col))
    if (before?.dir === 'down') return false
    if (after?.dir  === 'down') return false
  }

  return true
}

// --- Public API ---
export interface GeneratedCrossword {
  clues: CrosswordClue[]
  gridRows: number
  gridCols: number
}

export function generateCrossword(
  pool: QAItem[],
  minWords = 5,
  maxWords = 7,
): GeneratedCrossword | null {
  // 1. Randomly pick a subset (pick maxWords*2 candidates), then sort by length.
  //    This guarantees a different word set each call while still prioritising
  //    longer words (which have more intersection opportunities) within the subset.
  const CANDIDATE_COUNT = Math.min(maxWords * 2, pool.length)
  const candidates = shuffle(pool).slice(0, CANDIDATE_COUNT)
  const sorted = candidates.sort((a, b) => b.respuesta.length - a.respuesta.length)

  const cellMap: CellMap = new Map()
  const placed: PlacedWord[] = []

  // --- Place the first word horizontally at origin ---
  const first = sorted[0]
  const firstWord: PlacedWord = {
    qaItem: first,
    answer: first.respuesta,
    row: 0,
    col: 0,
    direction: 'across',
  }
  placed.push(firstWord)
  for (const { row, col, letter } of getWordCells(firstWord)) {
    cellMap.set(cellKey(row, col), { letter, dir: 'across' })
  }

  // --- Try to place the remaining words ---
  outer: for (let pi = 1; pi < sorted.length && placed.length < maxWords; pi++) {
    const candidate = sorted[pi]
    const answer    = candidate.respuesta

    // Try each already-placed word (shuffled for variety)
    for (const pw of shuffle(placed)) {
      const oppDir: 'across' | 'down' = pw.direction === 'across' ? 'down' : 'across'

      // Collect all (pw-letter-index, candidate-letter-index) pairs that share a letter
      const pairs: [number, number][] = []
      for (let pi2 = 0; pi2 < pw.answer.length; pi2++) {
        for (let ci = 0; ci < answer.length; ci++) {
          if (pw.answer[pi2] === answer[ci]) pairs.push([pi2, ci])
        }
      }

      for (const [pi2, ci] of shuffle(pairs)) {
        let newRow: number, newCol: number
        if (oppDir === 'down') {
          // pw is Across → its letter is at (pw.row, pw.col + pi2)
          // new Down word's letter[ci] must sit at that same cell
          newRow = pw.row - ci
          newCol = pw.col + pi2
        } else {
          // pw is Down → its letter is at (pw.row + pi2, pw.col)
          // new Across word's letter[ci] must sit at that same cell
          newRow = pw.row + pi2
          newCol = pw.col - ci
        }

        const candidate2: PlacedWord = {
          qaItem: candidate,
          answer,
          row: newRow,
          col: newCol,
          direction: oppDir,
        }

        if (canPlace(candidate2, cellMap)) {
          placed.push(candidate2)
          for (const { row, col, letter } of getWordCells(candidate2)) {
            if (!cellMap.has(cellKey(row, col))) {
              cellMap.set(cellKey(row, col), { letter, dir: oppDir })
            }
          }
          continue outer  // word placed, move to next candidate
        }
      }
    }
  }

  if (placed.length < minWords) return null

  // --- Normalize to positive coordinates with 1-cell padding ---
  let minRow = Infinity, minCol = Infinity, maxRow = -Infinity, maxCol = -Infinity
  for (const key of cellMap.keys()) {
    const [r, c] = key.split(',').map(Number)
    minRow = Math.min(minRow, r); minCol = Math.min(minCol, c)
    maxRow = Math.max(maxRow, r); maxCol = Math.max(maxCol, c)
  }

  const offsetRow = 1 - minRow
  const offsetCol = 1 - minCol
  const gridRows  = maxRow - minRow + 3
  const gridCols  = maxCol - minCol + 3

  // --- Assign clue numbers (top-left → bottom-right scan) ---
  const starterKeys = new Set(
    placed.map(pw => `${pw.row + offsetRow},${pw.col + offsetCol}`)
  )
  const numberMap = new Map<string, number>()
  let num = 1
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      if (starterKeys.has(`${r},${c}`)) numberMap.set(`${r},${c}`, num++)
    }
  }

  // --- Build CrosswordClue array ---
  const clues: CrosswordClue[] = placed.map((pw, idx) => {
    const startRow = pw.row + offsetRow
    const startCol = pw.col + offsetCol
    return {
      id:        idx + 1,
      number:    numberMap.get(`${startRow},${startCol}`) ?? idx + 1,
      direction: pw.direction,
      clue:      pw.qaItem.pista,
      answer:    pw.answer,
      row:       startRow,
      col:       startCol,
    }
  })

  return { clues, gridRows, gridCols }
}
