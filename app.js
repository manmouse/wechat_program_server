var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('/srv/secrets/wechat.maotech.top/Apache/3_wechat.maotech.top.key', 'utf8');
var certificate = fs.readFileSync('/srv/secrets/wechat.maotech.top/Apache/2_wechat.maotech.top.crt', 'utf8');
var chain = fs.readFileSync('/srv/secrets/wechat.maotech.top/Apache/1_root_bundle.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate, ca: chain };

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 8889;
var SSLPORT = 8890;

var getSessionKeyFromWechatServer = function (code) {
    var self = this;
    var getSessionHost = "https://api.weixin.qq.com/sns/jscode2session?";
    var appInfo = require("/srv/app_info/wechat_program_1.json");

    return new Promise(function (resolve, reject) {
        var forScan_req = getSessionHost + "appid=" + appInfo.AppID + "&secret=" + appInfo.AppSecret + "&js_code=" + code + "&grant_type=authorization_code";

        https.get(forScan_req, (res) => {
            var buf = '';
            res.on('data', (d) => {
                buf += d;
            });

            res.on('end', () => {
                console.log(buf);
            });
        }).on('error', (e) => {
            console.error(TAG, e);
            reject(-2);
        });
    });
};

httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

// Welcome
app.get('/', function (req, res) {
    if (req.protocol === 'https') {
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});

app.get('/getSession', function (req, res) {
    if (req.protocol === 'https') {
        console.log(req.query.code);
        getSessionKeyFromWechatServer(req.query.code);
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});


