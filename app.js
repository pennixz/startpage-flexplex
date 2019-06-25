const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const PirateBay = require('thepiratebay')
const WebTorrent = require('webtorrent')
const mv = require('mv')
const PlexAPI = require('plex-api')
const credentials = require('plex-api-credentials');
const fs = require('fs')

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

let client = new WebTorrent()

let currentlyDownloading = false;

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

let auther = (req, res, next) => {
    if (req.session && req.session.user == 'admin') {
        return next()
    } else {
        return res.sendStatus(401)
    }
}

app.get('/', (req, res) => res.sendFile(__dirname + "login.html"));
app.get('/login', (req, res) => res.sendFile(__dirname + "/public/" + "login.html"));
app.get('/flex', auther, (req, res) => {
    res.sendFile(__dirname + '/flex.html');
})

app.post('/login/auth', (req, res) => {
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, (err, client) => {
        if (err) throw err;
        let db = client.db('local');
        let data = {
            username: req.body.uname,
            password: req.body.pwd
        }
        db.collection('users').findOne(data, (err, result) => {
            if (err) throw err;

            if (result) {
                req.session.user = data.username;
                req.session.user == 'admin' ? req.session.admin = true : req.session.admin = false;
                res.writeHead(302, {
                    'Location': '/flex'
                })
                res.end()
            } else {
                res.writeHead(302, {
                    'Location': '/login'
                })
                res.end()
            }
            client.close()
        })
    })
})

app.get('/flex/updateLibrary', auther, (req, res) => {
    updateLibrary()
    res.writeHead(302, {
        'Location': '/flex'
    })
    res.end()
})

app.get('/logout', auther, (req, res) => {
    req.session.destroy()
    res.writeHead(302, {
        'Location': '/login'
    })
    res.end()
})
app.get('/flex/downloading', auther, (req, res) => {
    res.send(currentlyDownloading)
})

function updateLibrary() {
    const userAndPass = credentials({
        username: 'espen_hardcore',
        password: '***',

    })
    let plexClient = new PlexAPI({
        hostname: '192.168.0.108',
        authenticator: userAndPass
    })
    plexClient.perform("/library/Movies/refresh").then(function() {
        console.log('library refreshed')
    }, function(err) {
        console.error("Could not connect to server", err);
    })
}


const downloadPromise = (magnetURL) => {
    return new Promise((res, rej) => {
        client.add(magnetURL, {
            path: 'F:/PlexMedia/Movies/dlauto/'
        }, torrent => {
            console.log('download started')
            currentlyDownloading = true
            torrent.on('done', () => {
                console.log('download finished')
                currentlyDownloading = false
                updateLibrary()
                res(torrent)
            })
        })
        client.on('error', function(err) {
            rej(err)
            currentlyDownloading = false
            console.error('ERROR: ' + err.message)
        })
    })
}

function moveFile(src, end) {
    var source = fs.createReadStream(src);
    var dest = fs.createWriteStream(end);

    source.pipe(dest);
    source.on('end', function() {
        console.log('copied')
    });
    source.on('error', function(err) {
        console.log(err)
    });
}

app.get('/flex/special/move', auther, (req, res) => {
    moveFile()
    res.writeHead(302, {
        'Location': '/flex'
    })
    res.end()
})

app.post('/flex/dlFile', auther, (req, res) => {
    let newPromise = downloadPromise(req.body.key)
    res.writeHead(302, {
        'Location': '/flex/'
    })
    res.end()
})


app.get('/flex/getMovies', auther, (req, res) => {
    PirateBay.search('', {
        category: 'video',
        filter: {
            verified: true
        },
        page: 0,
        sortBy: 'desc',
        orderBy: 'seeds',
        subcategory: 208
    }).then(data => {
        let temp = []
        for (let i = 0; i < data.length; i++) {
            temp.push(data[i].id, data[i].name, data[i].seeders, data[i].uploader)
        }
        res.send(temp)
    }).catch(err => console.log(err))
})
app.get('/flex/topPornTorrents', auther, (req, res) => {
    PirateBay.topTorrents(500).then((data) => {
            res.send(data)
        })
        .catch((err) => {
            console.log('ERROR: ' + err)
        })
})

app.get('/flex/topVideoTorrents', auther, (req, res) => {
    PirateBay.topTorrents(200).then((data) => {
            res.send(data)
        })
        .catch((err) => {
            console.log('ERROR: ' + err)
        })
})

app.post('/flex/search', auther, (req, res) => {
    PirateBay.search(req.body.query, {
            filter: {
                verified: true
            }
        })
        .then((results) => {
            res.send(results)
        })
        .catch((err) => {
            console.log(err)
        })
})

let server = app.listen(8080, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Listening on 8080")
})