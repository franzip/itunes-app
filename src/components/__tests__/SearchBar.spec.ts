import { mount } from '@vue/test-utils'
import { describe, expect, vi, test } from 'vitest'
import SearchBar from '../SearchBar.vue'

describe('SearchBar', () => {
  test('debounces emit event when searching for an artist', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SearchBar)
    expect(wrapper).toBeTruthy()

    const artist = 'Led Zeppelin'

    const [inputArtist] = wrapper.findAll('input[type="text"]')
    inputArtist.setValue(artist)
    expect(wrapper.emitted()['artist-search']).toBeUndefined()
    vi.advanceTimersByTime(301)
    expect(wrapper.emitted()['artist-search']).toEqual([[artist]])
  })
  test('emit event when searching for an album', async () => {
    const wrapper = mount(SearchBar)
    expect(wrapper).toBeTruthy()

    const album = 'bla bla'

    const [_, inputAlbum] = wrapper.findAll('input[type="text"]')
    inputAlbum.setValue(album)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted()['album-search']).toEqual([[album]])
  })
})
function afterEach(arg0: () => void) {
  throw new Error('Function not implemented.')
}
