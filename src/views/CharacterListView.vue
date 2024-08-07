<template>
  <h1 class="text-2xl text-red-500">Characters:</h1>
  <div v-if="characters">
    <router-link
      v-for="char in characters"
      :key="char.id"
      class="text-xl flex"
      :to="{ name: 'character', params: { id: char.id } }"
    >
      {{ char.name }}
    </router-link>
  </div>

  <p>Total: {{ total }}</p>
  <p>Pages: {{ pages }}</p>
</template>

<script setup lang="ts">
import { fetchPeople } from '@/api/apiFetchPeople'
import type { EntityAPIResult, APIResult } from '@/api/types'
import { computed, onMounted, ref } from 'vue'

const result = ref<APIResult | null>(null)
const characters = ref<EntityAPIResult[]>([])
const total = ref(0)

const pages = computed(() => Math.ceil(total.value / 10))

onMounted(async () => {
  result.value = await fetchPeople({})
  characters.value = result.value!.results
  total.value = result.value!.count
})
</script>

<style scoped></style>
