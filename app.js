var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/srv/secrets/wechat.maotech.top/Apache/3_wechat.maotech.top.key', 'utf8');
var certificate = fs.readFileSync('/srv/secrets/wechat.maotech.top/Apache/2_wechat.maotech.top.crt', 'utf8');
var chain = fs.readFileSync('/srv/secrets/wechat.maotech.top/Apache/1_root_bundle.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate, ca: chain};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 8889;
var SSLPORT = 8890;

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

// Welcome
app.get('/', function(req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});

app.get('/getSession', function(req, res) {
    if(req.protocol === 'https') {
	console.log(req.query.code);
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});
