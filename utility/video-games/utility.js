// import
const genres = require('../../public/video-games/genres/genres.js')

// convert first-release-date data to show year of release
const dateOfRelease = (unixTimestamp) => {
    if (!unixTimestamp) return null
    const date = new Date(unixTimestamp * 1000)
    return date
}

// set price randomly between $45 and $75
const generateRandomPrice = () => {
    return Math.round((Math.random()* (75 - 45) + 45)).toFixed(2)
}

// reduce genres to single object
const genreMap = genres.reduce((acc, genre) => {
    acc[genre.name] = genre.id
    return acc
}, {})

// replace key with id
const mapGameGenres = (genreNames) => {
    return genreNames.map((name) => genreMap[name]) 
}

// export
module.exports = { dateOfRelease, generateRandomPrice, mapGameGenres}