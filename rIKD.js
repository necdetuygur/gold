module.exports = {
    "data": () => { return data },
    "Get": Get
};

const req = require("request");
const MatchAll = require('./rMatchAll.js');

let data = {
    "last": "",
    "Gram": "",
    "Çeyrek": "",
    "Yarım": ""
};

function Get() {
    let url = "http://www.ikd.sadearge.com/Firma/tablo.php"
    req(url, function (e, r, b) {
        if (!e && r.statusCode == 200) {
            let gram = MatchAll(b, /row6_satis(.*?)>(.*?)<\/td>/gmi);
            let ceyrek = MatchAll(b, /row11_satis(.*?)>(.*?)<\/td>/gmi);
            let yarim = MatchAll(b, /row12_satis(.*?)>(.*?)<\/td>/gmi);
            let last = MatchAll(b, /tarih(.*?)>(.*?)<\/span>/gmi);
            if (gram[2] != undefined && ceyrek[2] != undefined && yarim[2] != undefined) {
                data["last"] = last[2].trim()
                    .replace(/Son Güncellenme Tarihi : /ig, "")
                    .replace(/SonDeğişiklik/ig, "")
                    .trim()
                    ;
                data["Gram"] = gram[2].trim();
                data["Çeyrek"] = ceyrek[2].trim();
                data["Yarım"] = yarim[2].trim();
            }
        }
    });
}
