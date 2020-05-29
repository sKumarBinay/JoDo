const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
// const favicon = require('serve-favicon')

const app = express() // create express app

// app.use(favicon(path.join(__dirname + '/favicon.ico')))

app.use(cors())
app.use(bodyParser.urlencoded( {extended: true }))
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database-config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to database')
}).catch(() => {
    console.log('Could not connect to database. Exiting now...', err)
    process.exit()
})


app.use('/client', express.static(__dirname + '/client/'))
app.use('/sw', express.static(__dirname + '/service-worker.js'))
app.use('/favicon', express.static(__dirname + '/favicon.ico'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/welcome.html'));
})

app.get('/jodo', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
})


// // sign up page
// app.get('/recipe', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/src/view/view-recipe.html'));
// })


require('./app/routes/playroom.routes.js')(app)

app.listen(process.env.PORT || 7000, () => {
    console.log('Server listening on 7000')
})
