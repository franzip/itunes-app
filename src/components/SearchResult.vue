<template>
  <ClipLoader v-if="loading" />
  <div class="grid" v-if="!loading && filteredResults.length">
    <div class="card" v-for="item in filteredResults" :key="item.collectionId">
      <p>{{ item.collectionName }}</p>
      <img :src="item.artworkUrl100" :alt="item.collectionName" />
    </div>
  </div>
  <div v-else>
    <div>{{ emptyStateMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ClipLoader from './ClipLoader.vue'

import { ResultItem } from '../types'

const props = defineProps<{
  results: ResultItem[]
  albumFilter: string
  artistFilter: string
  loading: boolean
  error: string | null
}>()

const emptyStateMessage = computed(() => {
  const { loading, results, artistFilter, albumFilter, error } = props
  if (loading) {
    return ''
  }

  if (error) {
    return `An error occurred while fetching data: ${error}`
  }

  if (!results.length && artistFilter.length) {
    return `No result found for artist "${artistFilter}"`
  }

  if (results.length && albumFilter.length) {
    return `No result found for album "${albumFilter}"`
  }

  return 'Type artist name in "Search by artist"'
})

const filteredResults = computed(() => {
  if (props.albumFilter) {
    return props.results.filter((item) =>
      item.collectionName
        .toLowerCase()
        .includes(props.albumFilter.toLowerCase())
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
