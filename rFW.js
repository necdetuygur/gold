module.exports = {
    "data": () => { return finanswebde; },
    "Get": Get
};

const MatchAll = require('./rMatchAll.js');
const req = require("request");
const striptags = require('striptags');

var finanswebde = {
    "Gram": {
        "url": 'https://finanswebde.com/altin/gram-altin',
        "status": "",
        "vote": ""
    },
    "Çeyrek": {
        "url": 'https://finanswebde.com/altin/ceyrek-altin',
        "status": "",
        "vote": ""
    },
    "Yarım": {
        "url": 'https://finanswebde.com/altin/yarim-altin',
        "status": "",
        "vote": ""
    }
};
function Get() {
    for (let i in finanswebde) {
        let url = finanswebde[i].url;
        req(url, function (e, r, b) {
            if (!e && r.statusCode == 200) {
                status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
                finanswebde[i].status = striptags(status[2]).trim();
                finanswebde[i].vote = striptags(status[7]).trim();
            }
        });
    }
}