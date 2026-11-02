#!/usr/bin/env node

const MAP = [
	"N4MU67DJGZ8CY1SXLAH39TQW2KP5EF0R",
	"MGWPX490YQ6JF3D8Z2UL1NSKEHC5TA7R",
	"YKFMU6R75ETQWJH4L29ND83G0X1PACSZ",
	"84URY9A607SEHW32CDTXLJ5PGZ1FNQMK",
	"3L84D5GQ6YRM9W2TZCXHP1JKEFU07ANS",
	"E80Y7JQRXN1GCHLSWMD2AK5PFT943U6Z",
	"T26JN3QWSG4C8D57KHZUXE0L19AFPRYM",
	"FGEP4WLJ68S2N5XRDZ0H1AYC3QU7MT9K",
	"07RFJ83XELW4HPS6NKC5QT29ADMZG1UY",
	"9QEKD0LT2UYHPJ8SRN56GCZ1MFW74A3X",
	"J9Q6FKEWC7GYM8L3T2D0SX1ANZR4HUP5",
	"JYFWXE6931MAU70RLS5PC8DZNGT2KQ4H",
	"3T1J2HDR0GCY8SZPW79XNQ5KFALUE4M6",
	"ATQN5FSXZJWP23UD8E6GMYRCLHK41907",
	"EH03MYPR6JDQFA419LK85CXNU72WTSZG",
	"1SGN4XTRDA7CHEY6Q0K985WULM2JFZ3P"
];

function monopoly_code(myname, myscore) {
	let name = new Uint8Array(4);
	for (let i = 0; i < 4; i++)
		name[i] = parseInt(myname.slice(i * 2, (i + 1) * 2), 16);

	let money = new Uint8Array(4);
	for (let i = 4; i < 8; i++)
		money[i - 4] = parseInt(myscore.slice(i * 2, (i + 1) * 2), 16);

	const points = parseInt(myscore.slice(6, 8), 16);

	let chk = points;
	for (let i = 0; i < 4; i++)
		chk += name[i] + money[i];

	let ret = "";
	for (let i = 0; i < 8; i++)
		ret += MAP[i].charAt(parseInt(""
			+ ((name[3] >> i) & 1)
			+ ((name[2] >> i) & 1)
			+ ((name[1] >> i) & 1)
			+ ((name[0] >> i) & 1)
			+ ((points  >> i) & 1), 2
		));
	for (let i = 0; i < 8; i++)
		ret += MAP[i + 8].charAt(parseInt(""
			+ ((money[0] >> i) & 1)
			+ ((money[1] >> i) & 1)
			+ ((money[2] >> i) & 1)
			+ ((money[3] >> i) & 1)
			+ ((chk      >> i) & 1), 2
		));
	return ret;
}

function monopoly_decode(code) {
	let bits = [];
	for (let i = 0; i < 16; i++)
		bits.push((MAP[i].indexOf(code.charAt(i)) + 32).toString(2));

	let name = new Uint8Array(4);
	let money = new Uint8Array(4);
	let points = 0;
	let chk = 0;

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 4; j++)
			name[j] |= bits[i].charAt(4 - j) << i;
		points |= bits[i].charAt(5) << i;
	}
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 4; j++)
			money[j] |= bits[i + 8].charAt(j + 1) << i;
		chk |= bits[i + 8].charAt(5) << i;
	}

	chk -= points;
	for (let i = 0; i < 4; i++)
		chk -= (name[i] + money[i]);

	let ret = {
		valid: (chk % 256 == 0),
		myname: "",
		myscore:
			"000000" + (points >> 4).toString(16) + (points % 16).toString(16)
	};
	for (let i = 0; i < 4; i++) {
		ret.myname +=
			(name[i] >> 4).toString(16) + (name[i] % 16).toString(16);
		ret.myscore +=
			(money[i] >> 4).toString(16) + (money[i] % 16).toString(16);
	}
	return ret;
}

function main() {
	const {argv} = require("node:process");
	if (argv.length == 3) {
		console.log(monopoly_decode(argv[2].toUpperCase()));
	} else if (argv.length == 4) {
		console.log(monopoly_code(argv[2], argv[3]));
	} else {
		console.log("Usage: monopoly-code.js <myname> <myscore>");
		console.log("  ...to encode");
		console.log("-OR-");
		console.log("Usage: monopoly-code.js <code>");
		console.log("  ...to decode");
	}
}

main();
