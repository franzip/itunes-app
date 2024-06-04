<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="artist"
      @input="searchArtist"
      placeholder="Search by artist"
    />
    <input
      type="text"
      v-model="album"
      @input="searchAlbum"
      placeholder="Filter by album"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from 'lodash-es'

const artist = ref('')
const album = ref('')
const emits = defineEmits(['artist-search', 'album-search'])

const debouncedSearchArtist = debounce((artist) => {
  emits('artist-search', artist)
}, 300)

const searchArtist = () => {
  debouncedSearchArtist(artist.value)
}

const searchAlbum = () => {
  emits('album-search', album.value)
}
</script>

<style scoped>
.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  display: flex;
  gap: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-bar input {
  padding: 10px;
  font-size: 16px;
  width: 200px;
}
</style>
