module.exports = {
    "data": () => { return data; },
    "Get": Get
};

const req = require("request");
const MatchAll = require('./rMatchAll.js');
const striptags = require('striptags');

let data = {
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
    for (let i in data) {
        let url = data[i].url;
        req(url, function (e, r, b) {
            if (!e && r.statusCode == 200) {
                let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
                data[i].status = striptags(status[2]).trim();
                data[i].vote = striptags(status[7]).trim();
            }
        });
    }
}
