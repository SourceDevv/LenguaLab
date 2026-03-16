<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { CrosswordClue } from '@/types/crossword'
import AppButton from '@/components/common/AppButton.vue'

// --- Props ---
interface Props {
  clue: CrosswordClue | null
}

const props = defineProps<Props>()

// --- Emits ---
const emit = defineEmits<{
  answerSubmitted: [answer: string]
  cancelled: []
}>()

// --- State ---
const userAnswer = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const shakeError = ref(false)

// --- Watch for modal opening ---
watch(() => props.clue, async (newClue) => {
  if (newClue) {
    userAnswer.value = ''
    await nextTick()
    inputRef.value?.focus()
  }
})

// --- Handlers ---
function handleSubmit() {
  if (!userAnswer.value.trim()) {
    triggerShake()
    return
  }
  emit('answerSubmitted', userAnswer.value)
  userAnswer.value = ''
}

function handleCancel() {
  userAnswer.value = ''
  emit('cancelled')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') handleSubmit()
  if (e.key === 'Escape') handleCancel()
}

function triggerShake() {
  shakeError.value = true
  setTimeout(() => { shakeError.value = false }, 500)
}

// --- Computed display ---
const directionLabel = (dir: 'across' | 'down') => dir === 'across' ? 'Horizontal' : 'Vertical'
</script>

<template>
  <Transition name="modal">
    <div v-if="clue" class="modal-overlay" @click.self="handleCancel">
      <div class="modal-box anim-pop-in" role="dialog" aria-modal="true">

        <!-- Header -->
        <div class="modal-header">
          <div class="modal-badges">
            <span class="badge badge-accent">{{ directionLabel(clue.direction) }}</span>
            <span class="clue-number-badge">{{ clue.number }}</span>
          </div>
          <button class="modal-close" @click="handleCancel" aria-label="Cerrar">✕</button>
        </div>

        <!-- Clue -->
        <div class="modal-body">
          <p class="modal-clue">{{ clue.clue }}</p>
          <div class="letter-hint">
            <span
              v-for="(_, i) in clue.answer"
              :key="i"
              class="letter-slot"
            />
          </div>
          <p class="hint-length text-muted">{{ clue.answer.length }} letras</p>
        </div>

        <!-- Input -->
        <div class="modal-footer">
          <input
            ref="inputRef"
            v-model="userAnswer"
            class="input"
            :class="{ shake: shakeError }"
            type="text"
            :maxlength="clue.answer.length + 2"
            placeholder="Escribe tu respuesta..."
            autocomplete="off"
            spellcheck="false"
            @keydown="handleKeydown"
          />
          <div class="modal-actions">
            <AppButton variant="secondary" @click="handleCancel">Cancelar</AppButton>
            <AppButton variant="primary" @click="handleSubmit">
              ✓ Confirmar
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-box {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
  border-bottom: 1px solid var(--color-border);
}
.modal-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}
.clue-number-badge {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--color-accent);
  background: rgba(240, 165, 0, 0.1);
  border: 1px solid rgba(240, 165, 0, 0.25);
  border-radius: 999px;
  padding: 3px 10px;
}
.modal-close {
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 1rem;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
}
.modal-close:hover { color: var(--color-text); background: var(--color-surface2); }

.modal-body { padding: 20px; }

.modal-clue {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 18px;
}

.letter-hint {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.letter-slot {
  width: 26px;
  height: 8px;
  background: var(--color-border);
  border-radius: 2px;
}

.hint-length { font-size: 0.78rem; }

.modal-footer { padding: 0 20px 20px; }

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  justify-content: flex-end;
}

/* Shake animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.shake { animation: shake 0.4s ease; border-color: var(--color-incorrect) !important; }

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
