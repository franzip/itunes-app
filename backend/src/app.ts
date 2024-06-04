import express, { Application, Request, Response } from 'express'
import { query, validationResult } from 'express-validator'

import { getAlbumsForArtist } from './services/itunes'

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!')
})

app.get('/health', (req: Request, res: Response) => {
  res
    .status(200)
    .send({ uptime: process.uptime(), message: 'Ok', date: new Date() })
})

app.get(
  '/api/search',
  query('artist').notEmpty().escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req)
    const { query } = req

    if (result.isEmpty() && typeof query.artist === 'string') {
      const data = await getAlbumsForArtist(query.artist)
      return res.status(200).send(data)
    }

    res.status(400).send({ errors: result.array(), code: 400 })
  }
)

export default app
