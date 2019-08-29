#!/usr/bin/env node

const Print = require('./rPrint.js');
const IKD = require('./rIKD.js');
const FW = require('./rFW.js');
const Http = require('./rHttp.js');
let msg = "";

Http.PageCalled(Loop);
Http.Start();

function Loop() {
	FW.Get();
	IKD.Get();
	let ikd = IKD.data();
	let fw = FW.data();
	if (
		fw['Gram'].status != ""
		&& fw['Çeyrek'].status != ""
		&& fw['Yarım'].status != ""
	) {
		msg = "";
		msg += ` Tarih: ${ikd.last}\n`;
		msg += `  Gram: ${ikd['Gram']}TL ${fw['Gram'].status} ${fw['Gram'].vote} Oy\n`;
		msg += `Çeyrek: ${ikd['Çeyrek']}TL ${fw['Çeyrek'].status} ${fw['Çeyrek'].vote} Oy\n`;
		msg += ` Yarım: ${ikd['Yarım']}TL ${fw['Yarım'].status} ${fw['Yarım'].vote} Oy\n`;
		Http.SetMsg(msg);
		Print(msg, 1e3);
	} else {
		setTimeout(Loop, 1e3);
	}
}

setTimeout(Loop, 1e3);
