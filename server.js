// imports
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')

// connect to DB
mongoose.connect(process.env.MONGODB_URI)

// check connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// universal middleware
app.use(express.json())
app.use(logger('dev'))
app.use(cors())

// routes
app.post('/', async (req, res) => {
    const BASE_URL = `https://api.igdb.com/v4/games`

      try {
        const headers = {
            'Client-ID': `${process.env.CLIENT_ID}`,
            'Authorization': `Bearer ${process.env.API_KEY}`,            
            'Content-Type': 'text/plain'
        }
        
        const body = 'fields *; limit 500; exclude alternative_names, category, checksum, external_games, game_localizations, game_modes, involved_companies, keywords, platforms, player_perspectives, release_dates, similar_games, tags, themes, updated_at;'
        
        const apiRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: headers,
            body: body
        })

        if (!apiRes.ok) {
            throw new Error(`API Request failed with status: ${apiRes.status}`)
        }
        const data = await apiRes.json()
        res.status(200).json(data)
      } catch (err) {
        console.log('Error fetching data from API:', err.message)
        res.status(500).json({ message: err.message })
      }
})


app.listen(3000, () => {
  console.log('The express app is ready!')
})