#!/usr/bin/env node

const http = require("http");
const request = require('request');
const striptags = require('striptags');
const hostname = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 3000;
var GetCounter = 0;
var RefreshTime = 1e5;
var RefreshTimer = null;
var GLOBAL_MSG = ".";
var fwRegex = /(.*?)<div class="col-md-6"><span class="detail-change(.*?)">(.*?)<!--(.*?)<\/span><div class="progress progress-bar-sm"><div class="progress-bar(.*?)" role="progressbar" style="(.*?)" aria-valuenow="(.*?)" aria-valuemin="0" aria-valuemax="100"><\/div><\/div><span class="detail-title-sm"><span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi;
var DB = {
	"http://www.ikd.sadearge.com/Firma/tablo.php": [
		{
			"name": "Değişiklik",
			"regex": /tarih(.*?)>(.*?)<\/span>/gmi,
			"regexIndex": 2,
			"clear": /Son Güncellenme Tarihi :/g,
			"value": ""
		},
		{
			"name": "Gram",
			"regex": /row6_satis(.*?)>(.*?)<\/td>/gmi,
			"regexIndex": 2,
			"clear": "",
			"value": ""
		},
		{
			"name": "Çeyrek",
			"regex": /row11_satis(.*?)>(.*?)<\/td>/gmi,
			"regexIndex": 2,
			"clear": "",
			"value": ""
		},
		{
			"name": "Yarım",
			"regex": /row12_satis(.*?)>(.*?)<\/td>/gmi,
			"regexIndex": 2,
			"clear": "",
			"value": ""
		}
	],
	"https://finanswebde.com/altin/gram-altin": [
		{
			"name": "Gram Durum",
			"regex": fwRegex,
			"regexIndex": 3,
			"clear": "",
			"value": ""
		},
		{
			"name": "Gram Oy",
			"regex": fwRegex,
			"regexIndex": 8,
			"clear": "",
			"value": ""
		}
	],
	"https://finanswebde.com/altin/ceyrek-altin": [
		{
			"name": "Çeyrek Durum",
			"regex": fwRegex,
			"regexIndex": 3,
			"clear": "",
			"value": ""
		},
		{
			"name": "Çeyrek Oy",
			"regex": fwRegex,
			"regexIndex": 8,
			"clear": "",
			"value": ""
		}
	],
	"https://finanswebde.com/altin/yarim-altin": [
		{
			"name": "Yarım Durum",
			"regex": fwRegex,
			"regexIndex": 3,
			"clear": "",
			"value": ""
		},
		{
			"name": "Yarım Oy",
			"regex": fwRegex,
			"regexIndex": 8,
			"clear": "",
			"value": ""
		}
	]
}

Refresh();
HttpServerStart();

function Refresh() {
	for (url in DB) {
		Get(url, Put);
	}
	clearTimeout(RefreshTimer);
	RefreshTimer = setTimeout(Refresh, RefreshTime);
}

function Put(data, url) {
	for (i in DB[url]) {
		DB[url][i].value = Parse(data, DB[url][i]);
	}
	GLOBAL_MSG = HumanReadable(DB);
}

function Parse(data, build) {
	var ret = '';
	ret = MatchValue(data, build.regex, build.regexIndex).toString();
	ret = ret.trim();
	ret = striptags(ret);
	ret = ret.trim();
	ret = ret.replace(build.clear, '');
	ret = ret.trim();
	return ret;
}

function HumanReadable(data) {
	var ret = '';
	for (i in data) {
		for (j in data[i]) {
			ret += `${data[i][j].name}: ${data[i][j].value}\n`;
		}
	}
	ret = ret.replace(/\ \ /g, ' ');
	return ret;
}

function MatchValue(str, regex, index) {
	var temp = MatchAll(str, regex);
	if (temp.hasOwnProperty(index)) {
		return temp[index];
	}
	return '';
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

function Get(url, callback) {
	console.log(++GetCounter);
	request({
		url: url,
		method: "get"
	}, (error, response, body) => {
		callback(body, url);
	});
}

function HttpServerStart() {
	http.createServer((req, res) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.end(`<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"><pre>${GLOBAL_MSG}</pre>`);
	}).listen(port, hostname, () => {
		console.log(`Server running at http://${hostname}:${port}/`);
	});
}
