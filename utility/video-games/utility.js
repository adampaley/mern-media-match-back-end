// imports
const genres = [
    { id: 2,  name: "Point-and-click" },
    { id: 4,  name: "Fighting" },
    { id: 5,  name: "Shooter" },
    { id: 7,  name: "Music" },
    { id: 8,  name: "Platform" },
    { id: 9,  name: "Puzzle" },
    { id: 10, name: "Racing" },
    { id: 11, name: "Real Time Strategy (RTS)" },
    { id: 12, name: "Role-playing (RPG)" },
    { id: 13, name: "Simulator" },
    { id: 14, name: "Sport" },
    { id: 15, name: "Strategy" },
    { id: 16, name: "Turn-based strategy (TBS)" },
    { id: 24, name: "Tactical" },
    { id: 25, name: "Hack and slash/Beat 'em up" },
    { id: 26, name: "Quiz/Trivia" },
    { id: 30, name: "Pinball" },
    { id: 31, name: "Adventure" },
    { id: 32, name: "Indie" },
    { id: 33, name: "Arcade" },
    { id: 34, name: "Visual Novel" },
    { id: 35, name: "Card & Board Game" },
    { id: 36, name: "MOBA" }
]

// reduce genres to singlue object
const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name
    return acc
}, {})

// replace key (note, it is a string, not a number) with a name. If unknown ID, alternate return. 
const mapGameGenres = (genreIds) => {
    return genreIds.map((id) => genreMap[id] || `Unknown Genre (${id})`) 
}

// export
module.exports = { mapGameGenres }