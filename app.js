#!/usr/bin/env node

const http = require("http");
const request = require('request');
const striptags = require('striptags');
const hostname = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 3000;
var GLOBAL_MSG = ".";
var GLOBAL_DATA = {
    "Değişiklik": {
        "status": {
            "url": "http://www.ikd.sadearge.com/Firma/tablo.php",
            "regex": /tarih(.*?)>(.*?)<\/span>/gmi,
            "regexIndex": 2,
            "clear": /Son Güncellenme Tarihi :/g,
            "value": ""
        }
    },
    "Gram": {
        "status": {
            "url": "https://finanswebde.com/altin/gram-altin",
            "regex": /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi,
            "regexIndex": 2,
            "clear": "",
            "value": ""
        },
        "vote": {
            "url": "https://finanswebde.com/altin/gram-altin",
            "regex": /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi,
            "regexIndex": 6,
            "clear": "",
            "value": ""
        },
        "price": {
            "url": "http://www.ikd.sadearge.com/Firma/tablo.php",
            "regex": /row6_satis(.*?)>(.*?)<\/td>/gmi,
            "regexIndex": 2,
            "clear": "",
            "value": ""
        }
    },
    "Çeyrek": {
        "status": {
            "url": "https://finanswebde.com/altin/ceyrek-altin",
            "regex": /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi,
            "regexIndex": 2,
            "clear": "",
            "value": ""
        },
        "vote": {
            "url": "https://finanswebde.com/altin/ceyrek-altin",
            "regex": /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi,
            "regexIndex": 7,
            "clear": "",
            "value": ""
        },
        "price": {
            "url": "http://www.ikd.sadearge.com/Firma/tablo.php",
            "regex": /row11_satis(.*?)>(.*?)<\/td>/gmi,
            "regexIndex": 2,
            "clear": "",
            "value": ""
        }
    },
    "Yarım": {
        "status": {
            "url": "https://finanswebde.com/altin/yarim-altin",
            "regex": /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi,
            "regexIndex": 2,
            "clear": "",
            "value": ""
        },
        "vote": {
            "url": "https://finanswebde.com/altin/yarim-altin",
            "regex": /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi,
            "regexIndex": 7,
            "clear": "",
            "value": ""
        },
        "price": {
            "url": "http://www.ikd.sadearge.com/Firma/tablo.php",
            "regex": /row12_satis(.*?)>(.*?)<\/td>/gmi,
            "regexIndex": 2,
            "clear": "",
            "value": ""
        }
    }
};

Refresh();

http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"><pre>${GLOBAL_MSG}</pre>`);
    Refresh();
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function Refresh(){
    Get("http://www.ikd.sadearge.com/Firma/tablo.php", Put);
    return;
    var urls = {};
    for(i in GLOBAL_DATA){
        for (j in GLOBAL_DATA[i]){
            urls[GLOBAL_DATA[i][j].url] = 1;
        }
    }
    for(url in urls){
        Get(url, Put);
    }
}

function Put(data, url){
    for(i in GLOBAL_DATA){
        for(j in GLOBAL_DATA[i]){
            if(GLOBAL_DATA[i][j].url == url){
                GLOBAL_DATA[i][j].value = Parse(data, GLOBAL_DATA[i][j]);
                GLOBAL_MSG = HumanReadable(GLOBAL_DATA);
            }
        }
    }
}

function Parse(data, build){
    var ret = '';
    var matches = MatchAll(data, build.regex);
    ret = matches[build.regexIndex + ''] + '';
    ret = ret.trim();
    ret = striptags(ret);
    ret = ret.trim();
    ret = ret.replace(build.clear, '');
    ret = ret.trim();
    return ret;
}

function HumanReadable(data){
    var ret = '';
    for(i in data){
        var price = '';
        if(data[i].hasOwnProperty('price')){
            price = data[i].price.value;
        }
        
        var status = '';
        if(data[i].hasOwnProperty('status')){
            status = data[i].status.value;
        }
        
        var vote = '';
        if(data[i].hasOwnProperty('vote')){
            vote = data[i].vote.value;
        }
        
        ret += `${i}: ${price} ${status} ${vote}\n`;
    }
    ret = ret.replace(/\ \ /g, ' ');
    return ret;
}

function MatchAll(str, regex) {
    let m;
    var ret = {};
    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
            ret[groupIndex] = match;
        });
    }
    return ret;
}

function Get(url, callback){
    request({
        url: url,
        method: "get"
    }, (error, response, body) => {
        callback(body, url);
    });
}
