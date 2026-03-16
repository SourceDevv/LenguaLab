# Vue.js Clean Code Guidelines

> A practical reference for writing maintainable, readable, and scalable Vue 3 code using the Composition API.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Component Design](#component-design)
- [Composition API Patterns](#composition-api-patterns)
- [Composables](#composables)
- [Props & Emits](#props--emits)
- [Reactivity](#reactivity)
- [Template Best Practices](#template-best-practices)
- [State Management](#state-management)
- [Performance](#performance)
- [Naming Conventions](#naming-conventions)
- [TypeScript Integration](#typescript-integration)

---

## Project Structure

Keep your project organized by feature, not by file type.

```
src/
├── assets/
├── components/
│   ├── common/          # Reusable, generic components
│   └── features/        # Feature-specific components
├── composables/         # Shared composition logic
├── layouts/
├── pages/ (or views/)
├── router/
├── stores/              # Pinia stores
├── services/            # API/external service calls
├── types/               # TypeScript interfaces & types
└── utils/               # Pure helper functions
```

> **Rule:** If a component is only used in one place, keep it co-located with its parent. Move it to `common/` only when reused.

---

## Component Design

### Single Responsibility

Each component should do **one thing well**. If you find yourself writing "and" when describing what a component does, split it.

```vue
<!-- ❌ Bad: too many responsibilities -->
<script setup>
const users = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(0)

async function fetchUsers() { /* ... */ }
function filterUsers() { /* ... */ }
function handlePagination() { /* ... */ }
function exportToCsv() { /* ... */ }
</script>
```

```vue
<!-- ✅ Good: delegate responsibilities -->
<script setup>
import { useUserSearch } from '@/composables/useUserSearch'
import { usePagination } from '@/composables/usePagination'

const { users, searchQuery, filterUsers } = useUserSearch()
const { currentPage, totalPages, handlePagination } = usePagination()
</script>
```

### Keep Components Small

A component should ideally fit on one screen (~150–200 lines max). If it grows beyond that, extract logic into composables and sub-components.

### Prefer Flat Component Trees

Avoid deeply nested component hierarchies. Prefer composition over deep nesting.

---

## Composition API Patterns

### Always Use `<script setup>`

`<script setup>` is the recommended syntax. It's more concise and has better TypeScript support.

```vue
<!-- ✅ Preferred -->
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

### Organize Code by Logical Concern

Group related logic together rather than grouping by options (data, methods, computed). This is the key advantage of the Composition API.

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// --- User concern ---
const user = ref(null)
const isLoggedIn = computed(() => !!user.value)
async function fetchUser(id: string) { /* ... */ }

// --- UI concern ---
const isMenuOpen = ref(false)
function toggleMenu() { isMenuOpen.value = !isMenuOpen.value }

// --- Lifecycle ---
onMounted(() => {
  const route = useRoute()
  fetchUser(route.params.id as string)
})
</script>
```

### Use Comments to Separate Sections

Use `// ---` separators to visually distinguish logical blocks inside a large `<script setup>`.

---

## Composables

Composables are the primary way to share and reuse stateful logic.

### Naming

Always prefix composable functions with `use`.

```ts
// ✅
export function useAuth() { /* ... */ }
export function useDarkMode() { /* ... */ }

// ❌
export function authLogic() { /* ... */ }
export function darkMode() { /* ... */ }
```

### Structure

A composable should always return a plain object (not a reactive wrapper). This allows destructuring on the consumer side.

```ts
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const isZero = computed(() => count.value === 0)

  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initialValue }

  return { count, isZero, increment, decrement, reset }
}
```

### Keep Composables Focused

One composable = one concern. Don't mix unrelated logic.

```ts
// ❌ Bad: mixed concerns
export function useUserAndTheme() { /* ... */ }

// ✅ Good: separate composables, combine in component
const { user } = useAuth()
const { theme, toggleTheme } = useTheme()
```

### Avoid Side Effects at the Top Level

Don't run async calls or subscriptions at import time. Wrap them in `onMounted` or expose them as functions.

```ts
// ❌ Bad
const data = await fetch('/api/data') // runs at import!

// ✅ Good
export function useData() {
  const data = ref(null)
  async function load() {
    data.value = await fetch('/api/data').then(r => r.json())
  }
  onMounted(load)
  return { data, load }
}
```

---

## Props & Emits

### Always Type Your Props

Use `defineProps` with TypeScript or a runtime validator for every prop.

```vue
<script setup lang="ts">
// ✅ With TypeScript
interface Props {
  title: string
  count?: number
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  variant: 'primary',
})
</script>
```

### Always Type Your Emits

```vue
<script setup lang="ts">
const emit = defineEmits<{
  submit: [payload: { name: string; email: string }]
  cancel: []
}>()
</script>
```

### Props Are Read-Only

Never mutate a prop directly. Emit an event to request a change from the parent.

```vue
<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// ✅ Use v-model pattern
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
```

### Prefer Specific Props Over Passing Objects

```vue
<!-- ❌ Too vague -->
<UserCard :user="user" />

<!-- ✅ Explicit and predictable -->
<UserCard :name="user.name" :avatar="user.avatar" :role="user.role" />
```

---

## Reactivity

### Use `ref` for Primitives, `reactive` for Objects

```ts
// ✅
const isLoading = ref(false)
const userName = ref('')

const form = reactive({
  email: '',
  password: '',
})
```

### Avoid Destructuring Reactive Objects Directly

Destructuring breaks reactivity. Use `toRefs` instead.

```ts
const state = reactive({ count: 0, name: 'Vue' })

// ❌ Loses reactivity
const { count, name } = state

// ✅ Preserves reactivity
const { count, name } = toRefs(state)
```

### Don't Over-use `watch`

Prefer `computed` when you need a derived value. Use `watch` only for side effects.

```ts
// ❌ Using watch when computed is enough
const fullName = ref('')
watch([firstName, lastName], () => {
  fullName.value = `${firstName.value} ${lastName.value}`
})

// ✅
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### Use `watchEffect` for Simple Reactive Side Effects

```ts
// ✅ Automatically tracks dependencies
watchEffect(() => {
  document.title = `${pageTitle.value} | MyApp`
})
```

---

## Template Best Practices

### Keep Templates Lean

Move complex logic out of the template and into `computed` properties or composables.

```vue
<!-- ❌ Logic in the template -->
<template>
  <p>{{ users.filter(u => u.active).length > 0 ? 'Has users' : 'Empty' }}</p>
</template>

<!-- ✅ Logic in script -->
<script setup lang="ts">
const hasActiveUsers = computed(() =>
  users.value.some(u => u.active)
)
</script>

<template>
  <p>{{ hasActiveUsers ? 'Has users' : 'Empty' }}</p>
</template>
```

### Always Provide a `:key` on `v-for`

Use a stable, unique identifier — never the array index when the list can be reordered or filtered.

```vue
<!-- ❌ -->
<li v-for="(item, index) in items" :key="index">

<!-- ✅ -->
<li v-for="item in items" :key="item.id">
```

### Never Use `v-if` and `v-for` on the Same Element

```vue
<!-- ❌ -->
<li v-for="user in users" v-if="user.active" :key="user.id">

<!-- ✅ Filter in computed or use a wrapping element -->
<template v-for="user in activeUsers" :key="user.id">
  <li>{{ user.name }}</li>
</template>
```

### Use `v-show` vs `v-if` Intentionally

- `v-if`: use when the condition rarely changes (DOM is destroyed/created)
- `v-show`: use for elements that toggle frequently (only CSS visibility changes)

---

## State Management

### Local State First

Don't reach for a store immediately. Start with `ref`/`reactive` in the component. Lift to a composable when shared. Lift to a Pinia store only when needed across many components.

```
Component ref → Shared Composable → Pinia Store
```

### Pinia Store Structure

Keep stores focused on a single domain.

```ts
// stores/useCartStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  function addItem(item: CartItem) {
    items.value.push(item)
  }

  function removeItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, total, addItem, removeItem }
})
```

---

## Performance

### Lazy-Load Routes

```ts
// router/index.ts
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/pages/DashboardPage.vue'), // ✅ lazy loaded
  },
]
```

### Use `defineAsyncComponent` for Heavy Components

```ts
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
)
```

### Avoid Unnecessary Reactivity

Use `shallowRef` or `markRaw` for large, non-reactive objects (e.g. third-party class instances, large datasets).

```ts
import { shallowRef, markRaw } from 'vue'

const mapInstance = shallowRef(null)

onMounted(() => {
  mapInstance.value = markRaw(new MapLibrary('#map'))
})
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserProfileCard.vue` |
| Composables | camelCase with `use` prefix | `useUserSearch.ts` |
| Pinia stores | camelCase with `use` prefix | `useCartStore.ts` |
| Props | camelCase | `modelValue`, `isLoading` |
| Emits | camelCase | `update:modelValue`, `itemSelected` |
| Template refs | camelCase with `Ref` suffix | `const inputRef = ref(null)` |
| CSS classes | kebab-case | `.user-card`, `.nav-item` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |

### Be Explicit, Not Clever

```ts
// ❌ Vague
const data = ref([])
const flag = ref(false)
const fn = () => {}

// ✅ Self-documenting
const productList = ref<Product[]>([])
const isSubmitting = ref(false)
const handleFormSubmit = () => {}
```

---

## TypeScript Integration

### Enable Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

### Define and Reuse Types

Keep shared types in `src/types/`. Co-locate component-specific types with the component.

```ts
// src/types/user.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}
```

### Type Your API Responses

```ts
// services/userService.ts
import type { User } from '@/types/user'

export async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json() as Promise<User>
}
```

---

## Quick Reference Checklist

Before opening a PR, verify:

- [ ] Components have a single, clear responsibility
- [ ] All props and emits are typed
- [ ] No logic in templates — use `computed` instead
- [ ] `v-for` always has a `:key` using a stable unique ID
- [ ] `v-if` and `v-for` are never on the same element
- [ ] Shared logic lives in a composable
- [ ] No direct prop mutations — events are emitted upward
- [ ] Variable and function names are descriptive
- [ ] No `any` types without justification

---

> These guidelines are a living document. Update them as the team discovers better patterns. The goal is always **clarity over cleverness**.