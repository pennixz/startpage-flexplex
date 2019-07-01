const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(express.static(__dirname + "/public/"))
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/login', (req, res) => res.sendFile(path.join(__dirname + "/public/login.html")))

app.use('/', require('./src/api/routes/authRoutes'))
app.use('/', require('./src/api/routes/flexRoutes'))

let server = app.listen(8080, () => {
    let host = server.address().address
    let port = server.address().port
    console.log("Listening on 8080")
})