import request from 'supertest'
import * as ITunesClientAPI from '../src/services/itunes/client'
import app from '../src/app'
import jsonMock from './example.json'

describe('App', () => {
  test('exposes a health endpoint', async () => {
    const result = await request(app).get('/health')
    expect(result.statusCode).toBe(200)
  })

  test('returns a list of albums for an artist', async () => {
    jest
      .spyOn(ITunesClientAPI, 'fetchAlbumsByArtist')
      .mockResolvedValueOnce(jsonMock as ITunesClientAPI.ITunesAPIResponse)
    const result = await request(app).get('/api/search?artist=led+zeppelin')
    expect(result.statusCode).toBe(200)
    expect(result.body.length).toBeGreaterThan(0)
  })
})
