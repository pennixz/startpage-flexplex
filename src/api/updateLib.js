module.exports = {
    updateLibrary: () => {
        const PlexAPI = require('plex-api')
        const credentials = require('plex-api-credentials');
        const userAndPass = credentials({
            username: 'espen_hardcore',
            password: 'Robin1004',

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
}