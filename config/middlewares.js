const express = require('express')
const cors = require('cors')

module.exports = app => {
    app.use(express.json()) //bodyparser
    app.use(cors())
}