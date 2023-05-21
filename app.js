require('module-alias/register')
require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const commonRouter = require('./routers/common')
const usersRouter = require('./routers/users')
const courseProviderRouter = require('./routers/courseProvider')
const coursesRouter = require('./routers/courses')
const courseRouter = require('./routers/course')
require('./config/dbInit')

const corsOption = {
  origin: process.env['ORIGIN'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cookieParser())
app.use(cors(corsOption))
app.use(express.json())
app.use('/static', express.static(__dirname + '/uploads'))

const API_PREFIX = '/api'
app.use(`${API_PREFIX}`, commonRouter)
app.use(`${API_PREFIX}/user`, usersRouter)
app.use(`${API_PREFIX}/courseProvider`, courseProviderRouter)
app.use(`${API_PREFIX}/courses`, coursesRouter)
app.use(`${API_PREFIX}/course`, courseRouter)

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>')
})

const port = process.env['PORT'] || 3002
app.listen(port, () => {
  console.log(`The application listening listening on port ${port}`)
})
