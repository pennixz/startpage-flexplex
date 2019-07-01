function updateLibrary() {
    const PlexAPI = require('plex-api')
    const credentials = require('plex-api-credentials');
    const userAndPass = credentials({
        username: 'espen_hardcore',
        password: 'Lespen92L',

    })
    let plexClient = new PlexAPI({
        hostname: '192.168.0.103',
        authenticator: userAndPass
    })
    plexClient.perform("/library/Movies/refresh").then(function() {
        console.log('library refreshed')
    }, function(err) {
        console.error("Could not connect to server", err);
    })
}

module.exports = {
    downloadPromise: (magnetURL) => {
        const WebTorrent = require('webtorrent')
        let client = new WebTorrent()

        return new Promise((res, rej) => {
            client.add(magnetURL, {
                path: 'F:/PlexMedia/Movies/dlauto/'
            }, torrent => {
                console.log('download started')
                fetch('http://192.168.0.103:8080/toggleDownloading')
                torrent.on('done', () => {
                    console.log('download finished')
                    fetch('http://192.168.0.103:8080/toggleDownloading')
                    updateLibrary()
                    res(torrent)
                })
            })
            client.on('error', function(err) {
                rej(err)
                    // currentlyDownloading = false
                console.error('ERROR: ' + err.message)
            })
        })
    },
    auther: (req, res, next) => {
        if (req.session && req.session.user != undefined) {
            return next()
        } else {
            return res.sendStatus(401)
        }
    }
}