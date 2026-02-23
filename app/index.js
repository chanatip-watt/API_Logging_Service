const express = require('express')
const cors = require('cors')
const Log = require('./routes/log')
const user = require('./routes/user')


const app = express()
app.set('etag', false)
app.use(cors())
app.use(express.json())

app.use('/log', Log)
app.use('/user', user)

module.exports = app
