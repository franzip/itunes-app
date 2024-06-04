<template>
  <div>
    <SearchBar @artist-search="fetchResults" @album-search="filterResults" />
    <SearchResult
      :results="results"
      :albumFilter="albumFilter"
      :artistFilter="artistFilter"
      :error="error"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import SearchBar from './components/SearchBar.vue'
import SearchResult from './components/SearchResult.vue'
import type { ResultItem } from './types'

const results = ref<ResultItem[]>([])
const error = ref<string | null>(null)
const albumFilter = ref<string>('')
const artistFilter = ref<string>('')

const fetchResults = async (artist: string) => {
  if (artist.length < 2) {
    results.value = []
    artistFilter.value = artist
    return
  }

  try {
    const response = await axios.get(`/api/search?artist=${artist}`)
    results.value = response.data
    artistFilter.value = artist
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching results', err)
      error.value = err.message
    }
  }
}

const filterResults = (album: string) => {
  albumFilter.value = album
}
</script>
