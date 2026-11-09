#!/usr/bin/env node

function ghost_check(data) {
	let sum = 0;
	// Kart ID
	for (let i = 0x0000; i <= 0x000F; i++)
		sum += data[i];

	let a, b;
	// track no., driver ID
	if (((sum ^ data[0x0010]) & 1) != 0) {
		a = data[0x0011] + sum * (sum + 1);
		b = data[0x0011] + data[0x0010] - sum;
	} else {
		a = data[0x0011] + sum * (sum - 1);
		b = data[0x0011] - data[0x0010] - sum;
	}

	// nickname
	for (let i = 0x0012; i <= 0x0016; i++) {
		if (((b ^ data[i]) & 1) != 0) {
			a += data[i];
			b -= data[i];
		} else {
			a -= data[i];
			b += data[i];
		}
	}

	// prefecture, time
	a = (a + data[0x0017] + data[0x001A]) | data[0x001B];
	b = (b + data[0x0017] + data[0x001A]) ^ data[0x001B];

	// save data sector
	for (let i = 0x001C; i <= 0x101B; i++) {
		a ^= data[i];
		b += data[i];
	}
	// full name
	for (let i = 0x101C; i <= 0x102B; i++) {
		a += data[i];
		b ^= data[i];
	}
	// phone no.
	for (let i = 0x102C; i <= 0x1037; i++) {
		a ^= data[i];
		b -= data[i];
	}
	// postal code
	for (let i = 0x1038; i <= 0x103F; i++) {
		a -= data[i];
		b += data[i];
	}
	// home address
	for (let i = 0x1040; i <= 0x10BF; i++) {
		a ^= data[i];
		b ^= data[i];
	}

	// check bytes
	return ((data[0x0018] == a % 256) && (data[0x0019] == b % 256));
}

function main() {
	const {argv} = require("node:process");
	const {openAsBlob} = require("node:fs");
	if (argv.length != 3) {
		console.log("Usage: ghost-check.js <filename>");
		return;
	}
	openAsBlob(argv[2])
		.then((blob) => blob.bytes())
		.then((bytes) => console.log(ghost_check(bytes)));
}

main();
