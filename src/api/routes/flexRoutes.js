module.exports = function() {
    let express = require('express')
    let router = express.Router()
    const PirateBay = require('thepiratebay')
    const helper = require('../helper.js')
    let path = require('path')
    let currentlyDownloading = false;

    router.get('/flex', helper.auther, (req, res) => {
        res.sendFile(path.join(__dirname + '../../../../public/flex.html'));
    })

    router.get('/flex/downloading', helper.auther, (req, res) => {
        res.send(currentlyDownloading)
    })

    router.all('/flex/toggleDownloading', helper.auther, (req, res) => {
        currentlyDownloading ? currentlyDownloading = false : currentlyDownloading = true
        res.writeHead(302, {
            'Location': '/flex'
        })
        res.end()
    })

    router.get('/flex/dlFile', helper.auther, (req, res) => {
        let newPromise = helper.downloadPromise(req.query.file)
        res.writeHead(302, {
            'Location': '/flex/'
        })
        res.end()
    })

    router.get('/flex/topPornTorrents', helper.auther, (req, res) => {
        PirateBay.topTorrents(500).then((data) => {
                res.send(data)
            })
            .catch((err) => {
                console.log('ERROR: ' + err)
            })
    })

    router.get('/flex/topVideoTorrents', helper.auther, (req, res) => {
        PirateBay.topTorrents(200).then((data) => {
                res.send(data)
            })
            .catch((err) => {
                console.log('ERROR: ' + err)
            })
    })

    router.get('/flex/search', helper.auther, (req, res) => {
        console.log('Search made for: ' + req.query.movie)
        PirateBay.search(req.query.movie, {
                category: 'video',
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

    return router;
}();