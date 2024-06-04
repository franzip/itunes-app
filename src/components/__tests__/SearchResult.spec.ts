import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import SearchResult from '../SearchResult.vue'

describe('SearchResult', () => {
  describe('Empty state', () => {
    test('Shows an error when fetching data fails', () => {
      const wrapper = mount(SearchResult, {
        props: {
          results: [],
          loading: false,
          albumFilter: '',
          artistFilter: '',
          error: 'An error occurred'
        }
      })
      expect(wrapper).toBeTruthy()
      expect(wrapper.text()).toContain('An error occurred')
    })
    test('Prompts user to search for an artist', () => {
      const wrapper = mount(SearchResult, {
        props: {
          results: [],
          loading: false,
          albumFilter: '',
          artistFilter: '',
          error: null
        }
      })
      expect(wrapper).toBeTruthy()
      expect(wrapper.text()).toContain('Type artist name in "Search by artist"')
    })
    test('Shows a message when no results were found for an artist', () => {
      const artistFilter = 'Led Zeppelin'
      const wrapper = mount(SearchResult, {
        props: {
          results: [],
          loading: false,
          albumFilter: '',
          artistFilter,
          error: null
        }
      })
      expect(wrapper).toBeTruthy()
      expect(wrapper.text()).toContain(
        `No result found for artist "${artistFilter}"`
      )
    })

    test('Shows a message when there are results for an artist but no results for albums', () => {
      const artistFilter = 'Led Zeppelin'
      const albumFilter = 'Foobar'
      const wrapper = mount(SearchResult, {
        props: {
          loading: false,
          results: [
            {
              collectionId: '123',
              collectionName: 'Whatever',
              artworkUrl100: 'blabla'
            }
          ],
          albumFilter,
          artistFilter,
          error: null
        }
      })
      expect(wrapper).toBeTruthy()
      expect(wrapper.text()).toContain(
        `No result found for album "${albumFilter}"`
      )
    })
  })
})
