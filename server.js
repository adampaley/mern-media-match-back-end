// imports
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')

//const testJwtRouter = require('./controllers/test-jwt.js');
const authRouter = require('./controllers/auth.js');
const userRouter = require('./controllers/users.js');
const apiRouter = require('./controllers/api.js')

// connect to DB
mongoose.connect(process.env.MONGODB_URI)

// check connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// universal middleware
app.use(express.json())
app.use(logger('dev'))
app.use(cors())


// controllers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/api', apiRouter)
// app.use('/test-jwt', testJwtRouter);

// listeners
app.listen(3000, () => {
  console.log('The express app is ready!')
})