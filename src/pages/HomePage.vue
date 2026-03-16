<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import { useCrosswordStore } from '@/stores/useCrosswordStore'

const router = useRouter()
const store = useCrosswordStore()

const rules = [
  { icon: '✅', text: 'Cada respuesta correcta suma 10 puntos y rellena el crucigrama.' },
  { icon: '❌', text: 'Cada respuesta incorrecta resta 5 puntos y NO rellena el crucigrama.' },
  { icon: '📋', text: 'Haz clic en una celda o en una pista para responder.' },
  { icon: '🏆', text: 'Completa todas las palabras para ganar.' },
]

const vocabulary = [
  { term: 'Modismos', def: 'Expresiones con significado figurado' },
  { term: 'Dialectos', def: 'Variantes del español por región' },
  { term: 'Acentos', def: 'Forma de pronunciar según el lugar' },
  { term: 'Funciones', def: 'Referencial · Emotiva · Apelativa' },
]

function startGame() {
  store.startGame()
  router.push('/game')
}
</script>

<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero anim-fade-in">
      <div class="hero-glow" />
      <div class="hero-content">
        <span class="hero-eyebrow badge badge-accent">Crucigrama Interactivo</span>
        <h1 class="hero-title">Lengua<span class="accent-word">Lab</span></h1>
        <p class="hero-subtitle">
          Pon a prueba tu conocimiento del español: modismos, dialectos,
          acentos y funciones del lenguaje.
        </p>
        <AppButton variant="primary" @click="startGame">
          ▶ Comenzar Partida
        </AppButton>
      </div>
    </section>

    <div class="home-body">
      <!-- Vocabulary teaser -->
      <section class="vocab-grid anim-fade-in">
        <div
          v-for="item in vocabulary"
          :key="item.term"
          class="vocab-card card"
        >
          <h3 class="vocab-term">{{ item.term }}</h3>
          <p class="vocab-def text-muted">{{ item.def }}</p>
        </div>
      </section>

      <!-- Rules -->
      <section class="rules-section card anim-fade-in">
        <h2 class="rules-title">Reglas del juego</h2>
        <ul class="rules-list">
          <li v-for="rule in rules" :key="rule.text" class="rule-item">
            <span class="rule-icon">{{ rule.icon }}</span>
            <span>{{ rule.text }}</span>
          </li>
        </ul>
        <AppButton variant="primary" @click="startGame">
          ▶ Comenzar Partida
        </AppButton>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,165,0,0.08), transparent),
    var(--color-bg);
}

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 80px 24px 60px;
}
.hero-glow {
  position: absolute;
  inset: -100px;
  background: radial-gradient(circle at 50% 40%, rgba(240,165,0,0.12), transparent 60%);
  pointer-events: none;
}
.hero-content { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
.hero-eyebrow { margin-bottom: 18px; }

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1;
  color: var(--color-text);
  margin-bottom: 20px;
}
.accent-word {
  background: linear-gradient(135deg, var(--color-accent), #ffd470);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--color-muted);
  max-width: 500px;
  margin: 0 auto 32px;
  line-height: 1.7;
}

/* Body */
.home-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Vocab grid */
.vocab-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (min-width: 600px) { .vocab-grid { grid-template-columns: repeat(4, 1fr); } }

.vocab-card {
  text-align: center;
  padding: 20px 12px;
  transition: border-color var(--transition), transform var(--transition);
}
.vocab-card:hover { border-color: var(--color-accent); transform: translateY(-3px); }
.vocab-term {
  font-size: 0.95rem;
  color: var(--color-accent);
  margin-bottom: 6px;
}
.vocab-def { font-size: 0.8rem; line-height: 1.5; }

/* Rules */
.rules-section { display: flex; flex-direction: column; gap: 20px; }
.rules-title { font-size: 1.4rem; color: var(--color-text); }
.rules-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.5;
}
.rule-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
</style>
