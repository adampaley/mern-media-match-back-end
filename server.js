// imports
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')
const {   
    dateOfRelease,
    generateRandomOffset,
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
app.post('/', async (req, res) => {
    
      try {
        const BASE_URL = `https://api.igdb.com/v4/games`
        
        const headers = {
            'Client-ID': `${process.env.CLIENT_ID}`,
            'Authorization': `Bearer ${process.env.API_KEY}`,            
            'Content-Type': 'text/plain'
        }
        
        let genreNames = ''
        
        if (req.query) {
            genreNames = req.query.genres
        }
        
        const body = `fields age_ratings.rating, artworks, cover.image_id, first_release_date, genres.name, name, screenshots, slug, storyline, summary, total_rating,  url;  limit 2; offset ${generateRandomOffset()};`
        
        let newBody = body

        if (genreNames && genreNames.length > 0) {
           newBody += ` where genres = (${mapGameGenres(genreNames.split(',')).join(',')});`
        }
        
        const apiRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: headers,
            body: newBody
        })

        if (!apiRes.ok) {
            throw new Error(`API Request failed with status: ${apiRes.status}`)
        }
        const data = await apiRes.json()

        const transformedData = data.map(game => ({
            ...game,
            cover: `http://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover?.image_id}.jpg`,
            genres: game.genres ?? [],
            title: game.name ?? "Untitled",
            media: 'Video_Games',
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