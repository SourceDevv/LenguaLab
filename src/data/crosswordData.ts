import type { QAItem } from '@/types/crossword'

// Full pool of 20 Q&A pairs. Answers are uppercased without accents/ñ for grid matching.
// Clue text keeps natural Spanish (with accents) for display.
export const QA_POOL: QAItem[] = [
  {
    tipo: 'Modismo',
    pista: 'Expresión cuyo significado es figurado y no literal (ej: "costar un ojo de la cara")',
    respuesta: 'MODISMO',
  },
  {
    tipo: 'Dialecto',
    pista: 'Variedad regional del español: el andino, el caribeño, el rioplatense…',
    respuesta: 'DIALECTO',
  },
  {
    tipo: 'Función emotiva',
    pista: 'Función del lenguaje que refleja los sentimientos y emociones del emisor',
    respuesta: 'EMOTIVA',
  },
  {
    tipo: 'Acento',
    pista: 'Rasgo fonético que delata el origen geográfico del hablante',
    respuesta: 'ACENTO',
  },
  {
    tipo: 'Acento',
    pista: '¿Cómo llaman los colombianos a su amigo o compañero?',
    respuesta: 'PARCE',
  },
  {
    tipo: 'General',
    pista: 'Persona de confianza con quien se comparte amistad y afecto',
    respuesta: 'AMIGO',
  },
  {
    tipo: 'Reglas',
    pista: 'Respuesta incorrecta: resta puntos y no rellena el crucigrama',
    respuesta: 'ERROR',
  },
  {
    tipo: 'Modismo',
    pista: 'Estado que describe el modismo "estar en la luna": estar muy ___',
    respuesta: 'DISTRAIDO',
  },
  {
    tipo: 'Modismo',
    pista: 'Objeto celeste en el modismo que describe a alguien desconcentrado',
    respuesta: 'LUNA',
  },
  {
    tipo: 'Modismo',
    pista: 'Extremidad animal que aparece en el modismo "meter la ___" (cometer un error)',
    respuesta: 'PATA',
  },
  {
    tipo: 'Acento',
    pista: 'Signo ortográfico (´) que indica la sílaba tónica de una palabra; también llamado "tilde"',
    respuesta: 'TILDE',
  },
  {
    tipo: 'Dialecto',
    pista: 'Pronombre de segunda persona plural usado en Latinoamérica en lugar de "vosotros"',
    respuesta: 'USTEDES',
  },
  {
    tipo: 'Dialecto',
    pista: 'Interjección típica rioplatense para llamar o interpelar a un amigo',
    respuesta: 'CHE',
  },
  {
    tipo: 'Dialecto',
    pista: 'Modismo colombiano que puede significar "cosa", "asunto" o "problema"',
    respuesta: 'VAINA',
  },
  {
    tipo: 'Modismo',
    pista: 'Modismo español coloquial para decir que algo es excelente o tiene mucha energía',
    respuesta: 'CANA',
  },
  {
    tipo: 'Función referencial',
    pista: 'Función del lenguaje que transmite información objetiva y verificable (ej: "Hoy es lunes")',
    respuesta: 'REFERENCIAL',
  },
  {
    tipo: 'Función apelativa',
    pista: 'Función lingüística que busca influir en el receptor; presente en imperativos como "¡Ven aquí!"',
    respuesta: 'APELATIVA',
  },
  {
    tipo: 'Modismo',
    pista: 'Tipo de significado que caracteriza a los modismos: no es literal sino ___',
    respuesta: 'FIGURADO',
  },
  {
    tipo: 'Función referencial',
    pista: 'Tipo de texto donde domina la función referencial del lenguaje',
    respuesta: 'PERIODICO',
  },
  {
    tipo: 'Dialecto',
    pista: 'Los dialectos son variedades ___ del idioma; cambian según la zona geográfica',
    respuesta: 'REGIONAL',
  },
]

export const POINTS_CORRECT = 10
export const POINTS_INCORRECT = -5
