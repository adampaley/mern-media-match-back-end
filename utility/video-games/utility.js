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

// export
module.exports = { mapGameGenres, yearOfRelease }