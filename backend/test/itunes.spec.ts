import { getAlbumsForArtist, groupResultsByArtist } from '../src/services/itunes'
import * as ITunesClientAPI from '../src/services/itunes/client'
import type { ITunesAPIResponse, ITunesAPIResult } from '../src/services/itunes/client'
import jsonMock from './example.json'

jest.mock('../src/services/itunes/client')

describe('ITunes service', () => {
  beforeEach(() => jest.resetAllMocks())
  test('groupResultsByArtist - groups results correctly', () => {
    const result = groupResultsByArtist(jsonMock.results as ITunesAPIResult[])
    expect(result.artistCount).toEqual({
      '112018': 8,
      '6906197': 15,
      '216123617': 1,
      '218352633': 3,
      '218606538': 1,
      '314333781': 1,
      '608074618': 1,
      '883718129': 1,
      '1509245707': 1
    })
    for (const artistId in result.results) {
      expect(Object.values(result.results[artistId]).length == result.artistCount[artistId])
    }
  })

  test('getAlbumsForArtist - returns an empty list if there is no match', async() => {
    jest.spyOn(ITunesClientAPI, 'fetchAlbumsByArtist').mockResolvedValueOnce({resultCount: 0, results: []} as ITunesAPIResponse)
    const result = await getAlbumsForArtist('foo+bar+bar')
    expect(result).toEqual([])
  })

  test('getAlbumsForArtist - returns a list of albums for the artist with the most matches',  async () => {
    const artistIdWithMostMatches = 6906197
    jest.spyOn(ITunesClientAPI, 'fetchAlbumsByArtist').mockResolvedValueOnce(jsonMock as ITunesAPIResponse)
    const result = await getAlbumsForArtist('foo+fighters')
    expect(result.every(entry => entry.artistId === artistIdWithMostMatches))
    expect(result.length).toEqual(15)
  })
})
