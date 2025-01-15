function RandomNumber() {
    return Math.floor(Math.random() * (1000000 - 1) + 1) //pas inclure 1million
}

module.exports = RandomNumber;