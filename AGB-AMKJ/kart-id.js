#!/usr/bin/env node

function kart_id_encode(data) {
	const ord = (s) => s.charCodeAt();

	let {month, day, hour, minute} = data;
	if (data.date !== undefined) {
		month = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		].indexOf(data.date.slice(8, 11)) + 1;
		day = parseInt(data.date.slice(5, 7));
		hour = parseInt(data.date.slice(17, 19));
		minute = parseInt(data.date.slice(20, 22));
	}
	const email = data.email.slice(0, 8);
	const email_svr = data.email_svr ?? data.email.slice(11, 13);

	const pack = Uint16Array.from([
		month << 12 | day << 7 | hour << 2 | minute >> 4,
		minute << 12 | ord(email[0]) << 5 | ord(email[1]) >> 2,
		ord(email[1]) << 14 | ord(email[2]) << 7 | ord(email[3]),
		ord(email[4]) << 9 | ord(email[5]) << 2 | ord(email[6]) >> 5,
		ord(email[6]) << 11 | ord(email[7]) << 4 | ord(email_svr[0]) >> 3,
		ord(email_svr[0]) << 13 | ord(email_svr[1]) << 6 | nick[0] >> 2,
		nick[0] << 14 | nick[1] << 6 | nick[2] >> 2,
		nick[2] << 14 | nick[3] << 6 | nick[4] >> 2
	]);

	let myid = "";
	for (let i = 0; i < 16; i++) {
		let shuffle = 0;
		for (let j = 0; j < 8; j++)
			shuffle |= ((pack[j] >> (15 - i)) & 1) << j;
		myid += "M12345678LPTYDWB"[shuffle >> 4];
		myid += "M12345678LPTYDWB"[shuffle % 16];
		if (i == 3 || i == 11)
			myid += " ";
		else if (i == 7)
			myid += "-";
	}
	return myid;
}

function kart_id_decode(myid, email_grp=null, before=null, nick_end=null) {
	const chr = String.fromCharCode;

	myid = myid.toUpperCase().replace(/[^\dA-FLMPTWY]/g, "").slice(0, 32);
	if (myid.match(/[LMPTWY]/))
		myid = (myid.replace(/B/g, "F")
			.replace(/W/g, "E").replace(/Y/g, "C").replace(/T/g, "B")
			.replace(/P/g, "A").replace(/L/g, "9").replace(/M/g, "0"));

	let shuffle = new Uint8Array(16);
	for (let i = 0; i < 16; i++)
		shuffle[i] = parseInt(myid.slice(i * 2, (i + 1) * 2), 16);

	let pack = new Uint16Array(8);
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 16; j++)
			pack[i] |= ((shuffle[j] >> i) & 1) << (15 - j);
	}

	let data = {
		month: pack[0] >> 12,
		day: (pack[0] >> 7) & 0x1F,
		hour: (pack[0] >> 2) & 0x1F,
		minute: (pack[0] << 4 | pack[1] >> 12) & 0x3F,
	};

	data.email = chr((pack[1] >> 5) & 0x7F);
	data.email += chr((pack[1] << 2 | pack[2] >> 14) & 0x7F);
	data.email += chr((pack[2] >> 7) & 0x7F);
	data.email += chr(pack[2] & 0x7F);
	data.email += chr(pack[3] >> 9);
	data.email += chr((pack[3] >> 2) & 0x7F);
	data.email += chr((pack[3] << 5 | pack[4] >> 11) & 0x7F);
	data.email += chr((pack[4] >> 4) & 0x7F);

	data.email_svr = chr((pack[4] << 3 | pack[5] >> 13) & 0x7F);
	if (((pack[5] >> 6) & 0x7F) != 0)
		data.email_svr += chr((pack[5] >> 6) & 0x7F);

	data.nick = Uint8Array.from([
		pack[5] << 2 | pack[6] >> 14,
		pack[6] >> 6,
		pack[6] << 2 | pack[7] >> 14,
		pack[7] >> 6,
		pack[7] << 2
	]);

	if (email_grp !== null) {
		data.email_grp = email_grp;
		data.email += "@" + email_grp + data.email_svr + ".dion.ne.jp";
	}

	if (nick_end !== null) {
		data.nick_end = nick_end;
		data.nick[4] |= nick_end;
	}

	if (before !== null) {
		let date = new Date(Date.UTC(
			before.getFullYear(), data.month - 1, data.day,
			data.hour, data.minute
		));
		if (date.getTime() >= before.getTime())
			date.setFullYear(date.getFullYear() - 1);
		data.year = date.getFullYear();
		data.date = date.toUTCString();
	}

	return data;
}

function main() {
	const {argv} = require("node:process");
	if (argv.length != 3) {
		console.log("Usage: kart-id.js <kart id>");
		return;
	}
	console.log(kart_id_decode(argv[2], "gb", new Date()));
}

main();
