module.exports = function() {
    const express = require('express')
    const router = express()
    let path = require('path')
    let MongoClient = require('mongodb').MongoClient;
    let url = "mongodb://localhost:27017/";

    const helper = require('../helper.js')

    router.get('/logout', helper.auther, (req, res) => {
        req.session.destroy()
        res.writeHead(302, {
            'Location': '/login'
        })
        res.end()
    })

    router.post('/login/auth', (req, res) => {
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
    return router;
}();