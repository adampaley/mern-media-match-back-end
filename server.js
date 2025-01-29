// imports
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')
const { 
    generateRandomPrice,
    mapGameGenres,  
    dateOfRelease 
} = require('./utility/video-games/utility.js')
//const testJwtRouter = require('./controllers/test-jwt.js');
const authRouter = require('./controllers/auth.js');
const userRouter = require('./controllers/users.js');

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
        
        const body = `fields *, cover.image_id, age_ratings.rating, genres.name; limit 500; exclude alternative_names, category, created_at, checksum, dlcs, external_games, franchise, franchises, game_localizations, game_modes, involved_companies, keywords, platforms, player_perspectives, rating, rating_count, release_dates, similar_games, tags, themes, updated_at;`
        
        const apiRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: headers,
            body: body
        })

        if (!apiRes.ok) {
            throw new Error(`API Request failed with status: ${apiRes.status}`)
        }
        const data = await apiRes.json()

        const transformedData = data.map(game => ({
            ...game,
            cover: `images.igdb.com/igdb/image/upload/t_cover_big/${game.cover?.image_id}.jpg`,
            genres: game.genres ?? [],
            media: 'Video Games',
            parentalRating: game.age_ratings ? `PEGI ${game.age_ratings?.rating}` : 'Not Rated',
            price: generateRandomPrice(),
            releaseDate: game.first_release_date ? dateOfRelease(game.first_release_date) : null,
            storyline: game.storyline ? game.storyline : '',
            summary: game.summary ? game.summary : '',
            totalRating: Math.round(game.total_rating)
        }))

        res.status(200).json(transformedData)
      } catch (err) {
        console.log('Error fetching data from API:', err.message)
        res.status(500).json({ message: err.message })
      }
})

app.use('/auth', authRouter);
app.use('/users', userRouter);
// app.use('/test-jwt', testJwtRouter);


app.listen(3000, () => {
  console.log('The express app is ready!')
})