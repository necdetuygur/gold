#!/usr/bin/env node

const Print = require('./rPrint.js');
const IKD = require('./rIKD.js');
const FW = require('./rFW.js');

function Loop() {
	FW.Get();
	IKD.Get();
	var ikd = IKD.data();
	var fw = FW.data();
	if (
		fw.Gram.status != ""
		&& fw.Çeyrek.status != ""
		&& fw.Yarım.status != ""
	) {
		var data = fw;
		data.Gram.price = ikd.Gram;
		data.Çeyrek.price = ikd.Çeyrek;
		data.Yarım.price = ikd.Yarım;
		delete data.Gram.url;
		delete data.Çeyrek.url;
		delete data.Yarım.url;
		var msg = ` Tarih: ${ikd.last}\n`;
		msg += `  Gram: ${data.Gram.price}TL ${data.Gram.status} ${data.Gram.vote} Oy\n`;
		msg += `Çeyrek: ${data.Çeyrek.price}TL ${data.Çeyrek.status} ${data.Çeyrek.vote} Oy\n`;
		msg += ` Yarım: ${data.Yarım.price}TL ${data.Yarım.status} ${data.Yarım.vote} Oy\n`;
		Print(msg, 1000);
	} else {
		setTimeout(Loop, 1e3);
	}
}
setTimeout(Loop, 1e3);
