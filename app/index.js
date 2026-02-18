const express = require('express')
const cors = require('cors')
const Log = require('./routes/log')
const Login = require('./routes/user')


const app = express()

app.use(cors())
app.use(express.json())

app.use('/log', Log)
app.use('/login', Login)

module.exports = app
