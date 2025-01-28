// imports
const genres = require('../../public/video-games/genres/genres.js')

// reduce genres to singlue object
const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name
    return acc
}, {})

// replace key (note, it is a string, not a number) with a name. If unknown ID, alternate return. 
const mapGameGenres = (genreIds) => {
    return genreIds.map((id) => genreMap[id] || `Unknown Genre (${id})`) 
}

// convert first-release-date data to show year of release
const yearOfRelease = (unixTimestamp) => {
    if (!unixTimestamp) return null
    const date = new Date(unixTimestamp * 1000)
    return date.getFullYear()
}

// set price randomly between $45 and $75
const generateRandomPrice = () => {
    return Math.round((Math.random()* (75 - 45) + 45)).toFixed(2)
}

// export
module.exports = { mapGameGenres, generateRandomPrice, yearOfRelease }