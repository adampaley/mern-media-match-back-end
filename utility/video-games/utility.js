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

// export
module.exports = { dateOfRelease, generateRandomPrice }