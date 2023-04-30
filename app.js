require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const usersRouter = require('./routers/uesrs')
const courseProviderRouter = require('./routers/courseProvider')
const { testDBConnection } = require('./config/db')
testDBConnection()

const corsOption = {
  origin: '*',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cookieParser())
app.use(cors(corsOption))
app.use(express.json())

const API_PREFIX = '/api'
app.use(`${API_PREFIX}/users`, usersRouter)
app.use(`${API_PREFIX}/courseProvider`, courseProviderRouter)

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>')
})

const port = process.env['PORT'] || 3002
app.listen(port, () => {
  console.log(`The application listening listening on port ${port}`)
})
