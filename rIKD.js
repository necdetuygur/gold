module.exports = {
    "data": () => { return ikd },
    "Get": Get
};

const http = require("http");
const MatchAll = require('./rMatchAll.js');

var ikd = {
    "last": "",
    "Gram": "",
    "Çeyrek": "",
    "Yarım": ""
}
function Get() {
    var options = {
        host: 'www.ikd.sadearge.com',
        port: 80,
        path: '/Firma/tablo.php',
        method: 'GET'
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            gram = MatchAll(data, /row6_satis(.*?)>(.*?)<\/td>/gmi);
            ceyrek = MatchAll(data, /row11_satis(.*?)>(.*?)<\/td>/gmi);
            yarim = MatchAll(data, /row12_satis(.*?)>(.*?)<\/td>/gmi);
            sonDegisiklik = MatchAll(data, /tarih(.*?)>(.*?)<\/span>/gmi);
            if (ceyrek[2] != undefined && yarim[2] != undefined) {
                ikd["Gram"] = gram[2].trim();
                ikd["Çeyrek"] = ceyrek[2].trim();
                ikd["Yarım"] = yarim[2].trim();
                ikd["last"] = sonDegisiklik[2].trim()
                    .replace(/Son Güncellenme Tarihi : /ig, "")
                    .replace(/SonDeğişiklik/ig, "")
                    .trim()
                ;
            }
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.write('data\n');
    req.end();

    return ikd;
}