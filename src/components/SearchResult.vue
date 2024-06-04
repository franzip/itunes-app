<template>
  <div class="grid" v-if="filteredResults.length">
    <div class="card" v-for="item in filteredResults" :key="item.collectionId">
      <p>{{ item.collectionName }}</p>
      <img :src="item.artworkUrl100" :alt="item.collectionName" />
    </div>
  </div>
  <div v-else>Type artist name in "Search by artist"</div>
  <div class="error" v-if="error">An error occurred: {{ error }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ResultItem } from '../types'

const props = defineProps<{
  results: ResultItem[]
  filter: string
  error: string | null
}>()

const filteredResults = computed(() => {
  if (props.filter) {
    return props.results.filter((item) =>
      item.collectionName.toLowerCase().includes(props.filter.toLowerCase())
    )
  }
  return props.results
})
</script>

<style scoped>
.grid {
  margin-top: 4em;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(1, 1fr);
}

.card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
