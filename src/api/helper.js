module.exports = {
    downloadPromise: (magnetURL) => {
        const libr = require('./updateLib.js')
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
                    libr.updateLibrary()
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