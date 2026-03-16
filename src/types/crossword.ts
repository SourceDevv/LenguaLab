// --- Crossword clue definition ---
export interface CrosswordClue {
  id: number
  number: number
  direction: 'across' | 'down'
  clue: string
  answer: string
  row: number
  col: number
}

// --- Individual grid cell ---
export interface CrosswordCell {
  row: number
  col: number
  letter: string        // correct answer letter
  userLetter: string    // what the user has entered
  isBlack: boolean      // black/blocked cell
  clueNumbers: number[] // clue numbers that pass through this cell
  directions: ('across' | 'down')[]
  isCorrect: boolean | null // null = unanswered
}

// --- Game status ---
export type GameStatus = 'idle' | 'playing' | 'finished'

// --- Q&A pool item ---
export interface QAItem {
  tipo: string
  pista: string
  respuesta: string
}
