import NodeCache from 'node-cache'

import type { ITunesAPIResult } from './client'
import { fetchAlbumsByArtist } from './client'

const cache = new NodeCache({ stdTTL: 600 })

// use album name ("collectionName") as ID to avoid duplicated albums
type AlbumNameToResult = Record<string, ITunesAPIResult>
type ArtistIdToAlbums = Record<string, AlbumNameToResult>

// use artist ID to group and count results
type ArtistIdResultCount = Record<string, number>

type GroupedResults = {
  artistCount: ArtistIdResultCount
  results: ArtistIdToAlbums
}

// 1 - Groups results by artist
// 2 - Removes duplicate albums
// 3 - Get result count per artist
// Runs in O(N)
export function groupResultsByArtist(
  results: ITunesAPIResult[]
): GroupedResults {
  return results.reduce(
    (acc: GroupedResults, current: ITunesAPIResult) => {
      const { results } = acc
      const collectionName = current.collectionName.replace(
        / *\([^)]*\) */g,
        ''
      )
      if (current.artistId in results) {
        // nothing to do - there is already an album with this name (avoid duplicates)
        if (collectionName in results[current.artistId]) {
          return acc
        }
        acc['artistCount'][current.artistId] += 1
        acc['results'][current.artistId][collectionName] = current
        return acc
      }

      // first time we see this artist
      acc['artistCount'][current.artistId] = 1
      acc['results'][current.artistId] = { [current.collectionName]: current }
      return acc
    },
    { artistCount: {}, results: {} } as GroupedResults
  )
}

function getBestMatchFromResult(
  artistCount: ArtistIdResultCount
): string | null {
  let max = 0
  let result = null
  for (const artistId in artistCount) {
    if (artistCount[artistId] > max) {
      max = artistCount[artistId]
      result = artistId
    }
  }
  return result
}

export async function getAlbumsForArtist(
  artist: string
): Promise<ITunesAPIResult[]> {
  const sanitizedArtistQuery = artist
    .split(' ')
    .map((token) => token.toLowerCase())
    .join('+')

  const cached = cache.get<ITunesAPIResult[]>(sanitizedArtistQuery)

  if (cached) {
    return cached
  }

  const data = await fetchAlbumsByArtist(sanitizedArtistQuery)
  const { results, artistCount } = groupResultsByArtist(data.results)
  const bestMatch = getBestMatchFromResult(artistCount)

  if (!bestMatch) {
    return []
  }

  const result = Object.values(results[bestMatch])

  cache.set<ITunesAPIResult[]>(sanitizedArtistQuery, result)
  return result
}
