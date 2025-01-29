// imports
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')
const {   
    dateOfRelease,
    generateRandomPrice,
    mapGameGenres,
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
const genreNames = ["Arcade"] // seed data

app.post('/', async (req, res) => {
    const BASE_URL = `https://api.igdb.com/v4/games`

      try {
        const headers = {
            'Client-ID': `${process.env.CLIENT_ID}`,
            'Authorization': `Bearer ${process.env.API_KEY}`,            
            'Content-Type': 'text/plain'
        }

        console.log(mapGameGenres(genreNames))

        const body = `fields age_ratings.rating, artworks, cover.image_id, first_release_date, genres.name, screenshots, slug, storyline, summary, total_rating,  url;  limit 500; where genres = (${mapGameGenres(genreNames).join(',')});`
    
        
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
            parentalRating: game.age_ratings ? `PEGI ${game.age_ratings[0].rating}` : 'Not Rated',
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

// controllers
app.use('/auth', authRouter);
app.use('/users', userRouter);
// app.use('/test-jwt', testJwtRouter);

// listeners
app.listen(3000, () => {
  console.log('The express app is ready!')
})