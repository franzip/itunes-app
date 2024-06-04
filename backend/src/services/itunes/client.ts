const BASE_URL = 'https://itunes.apple.com/search'

export type ITunesAPIResult = {
  wrapperType: string
  collectionType: string
  artistId: number
  collectionId: number
  amgArtistId: number
  artistName: string
  collectionName: string
  collectionCensoredName: string
  artistViewUrl: string
  collectionViewUrl: string
  artworkUrl60: string
  artworkUrl100: string
  collectionPrice: number
  collectionExplicitness: string
  contentAdvisoryRating: string
  trackCount: number
  copyright: string
  country: string
  currency: string
  releaseDate: string
  primaryGenreName: string
}

export type ITunesAPIResponse = {
  resultCount: number
  results: ITunesAPIResult[]
}

async function fetchFromAPI(
  term: string,
  filters: object
): Promise<ITunesAPIResponse> {
  const params = new URLSearchParams()
  params.append('term', term)

  for (const [key, value] of Object.entries(filters)) {
    params.append(key, value)
  }

  const response = await fetch(`${BASE_URL}?${params}`)
  return response.json()
}

export async function fetchAlbumsByArtist(
  artist: string
): Promise<ITunesAPIResponse> {
  return fetchFromAPI(artist, { entity: 'album' })
}
