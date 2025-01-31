// import
const express = require('express')
const router = express.Router()

const {   
    dateOfRelease,
    generateRandomOffset,
    generateRandomPrice,
    mapGameGenres,
} = require('../utility/video-games/utility.js')

// routes
router.post('/games', async (req, res) => {
    
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
          media: 'VideoGames',
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

// export
module.exports = router