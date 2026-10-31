#!/usr/bin/env node

class BitArray {
	constructor(from=[]) {
		this.array = from;
		this.shift = 8;
	}
	concat(other) {
		if (other.array.length != 0) {
			let i;
			for (i = 0; i < other.array.length - 1; i++)
				this.push(other.array[i], 8);
			this.push(other.array[i], other.shift);
		}
		return this;
	}
	push(x, b) {
		if (this.shift < 8) {
			if ((this.shift += b) <= 8) {
				this.array[this.array.length - 1] |= x << (8 - this.shift);
				return this;
			}
			this.array[this.array.length - 1] |= x >> (this.shift - 8);
			b = this.shift - 8;
			this.shift = 8;
		}
		while (b > 8)
			this.array.push((x >> (b -= 8)) & 0xFF);
		if (b > 0)
			this.array.push((x << (8 - (this.shift = b))) & 0xFF);
		return this;
	}
	read(o, b) {
		let tmp = this.array[o >> 3] & ~(-256 >> (o % 8));
		if ((o >> 3) == ((o + b) >> 3))
			return tmp >> (8 - (o + b) % 8);
		for (let i = (o >> 3) + 1; i < ((o + b) >> 3); i++)
			tmp = (tmp << 8) | this.array[i];
		const s = (o + b) % 8;
		return (tmp << s) | (this.array[(o + b) >> 3] >> (8 - s));
	}
}

function calc_bits(values) {
	// check for trivial frequencies.
	const num_values = values.filter((a) => a != 0).length;
	if (num_values == 0) {
		return [[0, 0]];
	} else if (num_values == 1) {
		let codes = [];
		for (value of values) {
			if (value != 0) {
				codes.push([0, 1]);
				return codes;
			}
			codes.push([0, 0]);
		}
	}
	// package-merge, with 16 iterations.
	let pkgs = [];
	for (let j = 0; j < values.length; j++)
		if (values[j] != 0) pkgs.push({value: values[j], coins: [j]});
	pkgs.sort((a, b) => a.value - b.value);
	let max_pkgs = (num_values - 1) << 16;
	for (let i = 1; i < 16; i++) {
		let new_pkgs = [];
		for (let j = 0; j < max_pkgs && j < pkgs.length - 1; j += 2)
			new_pkgs.push({
				value: pkgs[j].value + pkgs[j + 1].value,
				coins: [...pkgs[j].coins, ...pkgs[j + 1].coins]
			});
		pkgs = new_pkgs;
		for (let j = 0; j < values.length; j++)
			if (values[j] != 0) pkgs.push({value: values[j], coins: [j]});
		pkgs.sort((a, b) => a.value - b.value);
		max_pkgs /= 2;
	}
	// calculate bit counts.
	let bits = new Array(values.length).fill(0);
	for (let i = 0; i < max_pkgs; i++) {
		for (coin of pkgs[i].coins)
			bits[coin]++;
	}
	// sort characters by bit count.
	let chars_by_bits = [];
	for (let i = 0; i < values.length; i++)
		if (bits[i] != 0) chars_by_bits.push(i);
	let codes = new Array(chars_by_bits[chars_by_bits.length - 1] + 1);
	chars_by_bits.sort((a, b) => bits[a] - bits[b]);
	// calculate code words.
	codes.fill([0, 0]);
	let x = 0; let b = 1;
	for (char of chars_by_bits) {
		if (bits[char] != b) {
			x <<= (bits[char] - b);
			b = bits[char];
		}
		codes[char] = [x, b];
		x++;
	}
	return codes;
}

function make_tree(bits) {
	let chars_by_bits = [];
	for (let i = 0; i < bits.length; i++)
		if (bits[i] != 0) chars_by_bits.push(i);
	chars_by_bits.sort((a, b) => bits[a] - bits[b]);
	let tree = [];
	let x = 0; let b = 1;
	for (char of chars_by_bits) {
		if (bits[char] != b) {
			x <<= (bits[char] - b);
			b = bits[char];
		}
		let branch = tree;
		for (let i = b - 1; i > 0; i--) {
			const bit = (x >> i) & 1;
			if (branch[bit] === undefined)
				branch[bit] = [];
			branch = branch[bit];
		}
		branch[x & 1] = char;
		x++;
	}
	return tree;
}

function bmvj_compress(src, ba=null, prev=[]) {
	if (ba === null)
		ba = new BitArray();
	// calculate RLE symbols.
	let sym_counts = new Array(262).fill(0);
	let offs_counts = new Array(10).fill(0);
	let syms = [];
	for (let i = 0; i < src.length; ) {
		let best_j; let best_k = 2;
		for (let j = 1; best_k < 8 && j <= 512 && j <= (i + prev.length); j++) {
			let k;
			for (k = 0; k < 8; k++) {
				const p = ((i + k - j) >= 0) ? src[i + k - j]
					: prev[prev.length + (i + k - j)];
				if (src[i + k] != p) break;
			}
			if (k > best_k) {
				best_j = j;
				best_k = k;
			}
		}
		let sym;
		if (best_k < 3) {
			sym = [src[i]];
			i++;
		} else {
			offs_counts[32 - Math.clz32(best_j - 1)]++;
			sym = [best_k + 253, best_j - 1];
			i += best_k;
		}
		syms.push(sym);
		sym_counts[sym[0]]++;
	}
	ba.push(syms.length, 16);
	sym_codes = calc_bits(sym_counts);
	offs_codes = calc_bits(offs_counts);
	// calculate code-length counts.
	code_lens = [];
	len_counts = new Array(19).fill(0);
	for (let i = 0; i < sym_codes.length; ) {
		let k;
		for (k = 0; (i + k) < sym_codes.length; k++)
			if (sym_codes[i + k][1] != 0) break;
		if (k < 3) {
			const l = (k == 0) ? 2 + sym_codes[i][1] : 0;
			code_lens.push([l]);
			len_counts[l]++;
			i++;
		} else if (k < 20) {
			if (k == 19) k--;
			code_lens.push([1, k - 3]);
			len_counts[1]++;
			i += k;
		} else {
			code_lens.push([2, k - 20]);
			len_counts[2]++;
			i += k;
		}
	}
	len_codes = calc_bits(len_counts);
	// write Huffman trees.
	ba.push(len_codes.length, 5);
	for (let i = 0; i < len_codes.length; ) {
		const code = len_codes[i];
		if (code[1] < 7)
			ba.push(code[1], 3);
		else
			ba.push((1 << (code[1] - 3)) - 2, code[1] - 3);
		i++;
		if (i == 3) {
			let k;
			for (k = 0; k < 3 && (i + k) < len_codes.length; k++)
				if (len_codes[i + k][1] != 0) break;
			ba.push(k, 2);
			i += k;
		}
	}
	if (sym_codes[sym_codes.length - 1] === [0, 1]) {
		// if all RLE symbols are the same, they can be zero bits in length.
		// (the same was meant to be true of the other two trees, but a
		//  programming error renders the function unusable for those.)
		sym_codes[sym_codes.length - 1][1] = 0;
		ba.push(sym_codes.length - 1, 18);
	} else {
		ba.push(sym_codes.length, 9);
		for (len of code_lens) {
			ba.push(...len_codes[len[0]]);
			if (len[0] == 1)
				ba.push(len[1], 4);
			else if (len[0] == 2)
				ba.push(len[1], 9);
		}
	}
	ba.push(offs_codes.length, 4);
	for (let i = 0; i < offs_codes.length; i++) {
		const code = offs_codes[i];
		if (code[1] < 7)
			ba.push(code[1], 3);
		else
			ba.push((1 << (code[1] - 3)) - 2, code[1] - 3);
	}
	// write data.
	for (sym of syms) {
		ba.push(...sym_codes[sym[0]]);
		if (sym[0] >= 256) {
			const bits = 31 - Math.clz32(sym[1]);
			ba.push(...offs_codes[bits + 1]);
			if (bits > 0)
				ba.push(sym[1] & ~(1 << bits), bits);
		}
	}
	return ba;
}

function bmvj_decompress(data) {
	const offs = data[0] + 9;
	const flag = data[offs - 7];
	const uncomp_size = data[offs - 4] | data[offs - 3] << 8;
	let ret = [];
	if (flag == 0) {
		for (let i = 0; i < uncomp_size; i += 768)
			ret = ret.concat(data.slice(offs + i, offs + i + 512));
	} else if (flag == 5) {
		const comp_size = data[offs - 6] | data[offs - 5] << 8;
		const ba = new BitArray(data.slice(offs, offs + comp_size));
		let co = 0;
		while (ret.length < uncomp_size) {
			const sym_count = ba.read(co, 16);
			co += 16;
			const num_lens = ba.read(co, 5);
			co += 5;
			let len_tree;
			if (num_lens == 0) {
				len_tree = ba.read(((co >> 3) + 2) * 8, (co + 5) % 8); // sic
				co += 5;
			} else {
				let len_bits = [];
				for (let i = 0; i < num_lens; ) {
					let bits = ba.read(co, 3);
					co += 3;
					if (bits == 7) {
						while (ba.read(co++, 1) != 0)
							bits++;
					}
					len_bits.push(bits);
					i++;
					if (i == 3) {
						i += ba.read(co, 2);
						co += 2;
						while (len_bits.length < i)
							len_bits.push(0);
					}
				}
				len_tree = make_tree(len_bits);
			}
			const num_syms = ba.read(co, 9);
			co += 9;
			let sym_tree;
			if (num_syms == 0) {
				sym_tree = ba.read(co, 9);
				co += 9;
			} else {
				let sym_bits = [];
				for (let i = 0; i < num_syms; ) {
					let bits = ba.read(co, 16);
					let branch = len_tree;
					for (let j = 15; j >= 0; j--) {
						if (typeof(branch) === "number") break;
						branch = branch[(bits >> j) & 1];
						co++;
					}
					if (branch < 3) {
						let skip = 1;
						if (branch == 1) {
							skip = ba.read(co, 4) + 3;
							co += 4;
						} else if (branch == 2) {
							skip = ba.read(co, 9) + 20;
							co += 9;
						}
						i += skip;
						while (sym_bits.length < i)
							sym_bits.push(0);
					} else {
						i++;
						sym_bits.push(branch - 2);
					}
				}
				sym_tree = make_tree(sym_bits);
			}
			const num_offs = ba.read(co, 4);
			co += 4;
			let offs_tree;
			if (num_offs == 0) {
				offs_tree = ba.read(((co >> 3) + 2) * 8, (co + 4) % 8); // sic
				co += 4;
			} else {
				let offs_bits = [];
				for (let i = 0; i < num_offs; i++) {
					let bits = ba.read(co, 3);
					co += 3;
					if (bits == 7) {
						while (ba.read(co++, 1) != 0)
							bits++;
					}
					offs_bits.push(bits);
				}
				offs_tree = make_tree(offs_bits);
			}
			for (let i = 0; i < sym_count && ret.length < uncomp_size; i++) {
				let bits = ba.read(co, 16);
				let branch = sym_tree;
				for (let j = 15; j >= 0; j--) {
					if (typeof(branch) === "number") break;
					branch = branch[(bits >> j) & 1];
					co++;
				}
				if (branch < 256) {
					ret.push(branch);
				} else {
					const rep_len = branch - 253;
					let bits = ba.read(co, 16);
					let offs_branch = offs_tree;
					for (let j = 15; j >= 0; j--) {
						if (typeof(offs_branch) === "number") break;
						offs_branch = offs_branch[(bits >> j) & 1];
						co++;
					}
					offs_branch--;
					let rep_offs;
					if (offs_branch > 0) {
						rep_offs = (1 << (offs_branch))
							| ba.read(co, offs_branch);
						co += offs_branch;
					} else {
						rep_offs = offs_branch + 1;
					}
					for (let j = 0; j < rep_len; j++)
						ret.push(ret[ret.length - rep_offs - 1]);
				}
			}
		}
	}
	return new Uint8Array(ret.slice(0, uncomp_size));
}

async function main() {
	const {argv} = require("node:process");
	const {openAsBlob, writeFile} = require("node:fs");
	if (argv.length != 4 && argv.length != 5) {
		console.log(
			"Usage: bmvj-compress.js <input> <output> [<block size>|decomp]");
		console.log("<block size> defaults to 65535.");
		return;
	}
	const blob = await openAsBlob(argv[2]);
	let data;
	if (argv[4] === "decomp") {
		data = bmvj_decompress(await blob.bytes());
	} else {
		const size = (argv.length == 5) ? parseInt(argv[4]) : 65535;
		let ba = null;
		let prev = [];
		for (let i = 0; i < blob.size; i += size) {
			const block = await blob.slice(i, i + size).bytes();
			ba = bmvj_compress(block, ba, prev);
			if (size >= 512)
				prev = block.slice(-512);
			else
				prev = prev.slice(size - 512).concat(block);
		}
		data = new Uint8Array([
			0, (blob.size + 8191) >> 13, 5,
			ba.array.length % 256, ba.array.length >> 8,
			blob.size % 256, blob.size >> 8, 0, 0, ...ba.array
		]);
	}
	writeFile(argv[3], data, (err) => {if (err) console.log(err);});
}

main();
