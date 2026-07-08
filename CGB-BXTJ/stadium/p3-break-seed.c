#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#if ULONG_WIDTH == 32
#define FMT_U32 "lu"
#elif UINT_WIDTH == 32
#define FMT_U32 "u"
#else
#error "Neither unsigned long nor unsigned is 32-bits!"
#endif

#define PRNG_NUM_BYTES 10

static const uint32_t prng_to_lcg[255] = {
	0x00000000, 0x01010102, 0x02020204, 0x03030304, 0x04040408, 0x05050508, 0x06060608, 0x07070708,
	0x08080810, 0x09090910, 0x0A0A0A10, 0x0B0B0B10, 0x0C0C0C10, 0x0D0D0D10, 0x0E0E0E10, 0x0F0F0F10,
	0x10101020, 0x11111120, 0x12121220, 0x13131320, 0x14141420, 0x15151520, 0x16161620, 0x17171720,
	0x18181820, 0x19191920, 0x1A1A1A20, 0x1B1B1B20, 0x1C1C1C20, 0x1D1D1D20, 0x1E1E1E20, 0x1F1F1F20,
	0x20202040, 0x21212140, 0x22222240, 0x23232340, 0x24242440, 0x25252540, 0x26262640, 0x27272740,
	0x28282840, 0x29292940, 0x2A2A2A40, 0x2B2B2B40, 0x2C2C2C40, 0x2D2D2D40, 0x2E2E2E40, 0x2F2F2F40,
	0x30303040, 0x31313140, 0x32323240, 0x33333340, 0x34343440, 0x35353540, 0x36363640, 0x37373740,
	0x38383840, 0x39393940, 0x3A3A3A40, 0x3B3B3B40, 0x3C3C3C40, 0x3D3D3D40, 0x3E3E3E40, 0x3F3F3F40,
	0x40404080, 0x41414180, 0x42424280, 0x43434380, 0x44444480, 0x45454580, 0x46464680, 0x47474780,
	0x48484880, 0x49494980, 0x4A4A4A80, 0x4B4B4B80, 0x4C4C4C80, 0x4D4D4D80, 0x4E4E4E80, 0x4F4F4F80,
	0x50505080, 0x51515180, 0x52525280, 0x53535380, 0x54545480, 0x55555580, 0x56565680, 0x57575780,
	0x58585880, 0x59595980, 0x5A5A5A80, 0x5B5B5B80, 0x5C5C5C80, 0x5D5D5D80, 0x5E5E5E80, 0x5F5F5F80,
	0x60606080, 0x61616180, 0x62626280, 0x63636380, 0x64646480, 0x65656580, 0x66666680, 0x67676780,
	0x68686880, 0x69696980, 0x6A6A6A80, 0x6B6B6B80, 0x6C6C6C80, 0x6D6D6D80, 0x6E6E6E80, 0x6F6F6F80,
	0x70707080, 0x71717180, 0x72727280, 0x73737380, 0x74747480, 0x75757580, 0x76767680, 0x77777780,
	0x78787880, 0x79797980, 0x7A7A7A80, 0x7B7B7B80, 0x7C7C7C80, 0x7D7D7D80, 0x7E7E7E80, 0x7F7F7F80,
	0x80808081, 0x81818181, 0x82828281, 0x83838381, 0x84848481, 0x85858581, 0x86868681, 0x87878781,
	0x88888881, 0x89898981, 0x8A8A8A81, 0x8B8B8B81, 0x8C8C8C81, 0x8D8D8D81, 0x8E8E8E81, 0x8F8F8F81,
	0x90909081, 0x91919181, 0x92929281, 0x93939381, 0x94949481, 0x95959581, 0x96969681, 0x97979781,
	0x98989881, 0x99999981, 0x9A9A9A81, 0x9B9B9B81, 0x9C9C9C81, 0x9D9D9D81, 0x9E9E9E81, 0x9F9F9F81,
	0xA0A0A081, 0xA1A1A181, 0xA2A2A281, 0xA3A3A381, 0xA4A4A481, 0xA5A5A581, 0xA6A6A681, 0xA7A7A781,
	0xA8A8A881, 0xA9A9A981, 0xAAAAAA81, 0xABABAB81, 0xACACAC81, 0xADADAD81, 0xAEAEAE81, 0xAFAFAF81,
	0xB0B0B081, 0xB1B1B181, 0xB2B2B281, 0xB3B3B381, 0xB4B4B481, 0xB5B5B581, 0xB6B6B681, 0xB7B7B781,
	0xB8B8B881, 0xB9B9B981, 0xBABABA81, 0xBBBBBB81, 0xBCBCBC81, 0xBDBDBD81, 0xBEBEBE81, 0xBFBFBF81,
	0xC0C0C0C1, 0xC1C1C1C1, 0xC2C2C2C1, 0xC3C3C3C1, 0xC4C4C4C1, 0xC5C5C5C1, 0xC6C6C6C1, 0xC7C7C7C1,
	0xC8C8C8C1, 0xC9C9C9C1, 0xCACACAC1, 0xCBCBCBC1, 0xCCCCCCC1, 0xCDCDCDC1, 0xCECECEC1, 0xCFCFCFC1,
	0xD0D0D0C1, 0xD1D1D1C1, 0xD2D2D2C1, 0xD3D3D3C1, 0xD4D4D4C1, 0xD5D5D5C1, 0xD6D6D6C1, 0xD7D7D7C1,
	0xD8D8D8C1, 0xD9D9D9C1, 0xDADADAC1, 0xDBDBDBC1, 0xDCDCDCC1, 0xDDDDDDC1, 0xDEDEDEC1, 0xDFDFDFC1,
	0xE0E0E0E1, 0xE1E1E1E1, 0xE2E2E2E1, 0xE3E3E3E1, 0xE4E4E4E1, 0xE5E5E5E1, 0xE6E6E6E1, 0xE7E7E7E1,
	0xE8E8E8E1, 0xE9E9E9E1, 0xEAEAEAE1, 0xEBEBEBE1, 0xECECECE1, 0xEDEDEDE1, 0xEEEEEEE1, 0xEFEFEFE1,
	0xF0F0F0F1, 0xF1F1F1F1, 0xF2F2F2F1, 0xF3F3F3F1, 0xF4F4F4F1, 0xF5F5F5F1, 0xF6F6F6F1, 0xF7F7F7F1,
	0xF8F8F8F9, 0xF9F9F9F9, 0xFAFAFAF9, 0xFBFBFBF9, 0xFCFCFCFD, 0xFDFDFDFD, 0xFEFEFEFF
};

static const uint8_t present_power[4] = {0x66, 0xB3, 0xCC, 0xFF};
static const uint8_t magnitude_power[7] = {0x0D, 0x26, 0x59, 0xA6, 0xD9, 0xF2, 0xFF};

static const char metronome_forbidden[17] = {
	0x76, 0xA5, 0xA6, 0x66, 0x44, 0xF3, 0xB6, 0xC5,
	0xCB, 0xC2, 0xD6, 0xA8, 0xFC, 0xFD, 0xFE, 0xFF, 0
};

static const uint16_t not_very_effective[19] = {
	0b0110011000001000,
	0b0000100100010000,
	0b0011101100000000,
	0b0100010000100000,
	0b1001000100000000,
	0b1110001110000000,
	0b0000000100000001,
	0b0000000111010000,
	0b0000100011000010,
	0b0000000001100010,
	0b0110010110100010,
	0b0001000000110010,
	0b0000000100001001,
	0b0000000111000100,
	0b0000000100000000,
	0b1000000100000001,
	0b0000101100000000,

	/* Normal & Fighting duplicates that can hit Ghost types. */
	0b0000100100000000,
	0b0110010000001000
};

static const uint8_t type_id_to_num[32] = {
	16,  0,  1,  2,  3,  4, 99,  5,  6,  7,
	99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
	 8,  9, 10, 11, 12, 13, 14, 15, 99, 99,
	99, 99
};

static uint32_t prng_last;
static int prng_offset;
static uint8_t prng_bytes[PRNG_NUM_BYTES];

static void prng_reset(uint32_t last) {
	prng_last = last;
	prng_offset = -PRNG_NUM_BYTES;
}

static uint8_t prng_byte(void) {
	uint8_t ret;

	if (prng_offset < 0) {
		prng_last = prng_last * 0x19660Dul + 0x3C6EF35Ful;
		ret = prng_last >> 24;
		return ret - (ret == 0xFFu || prng_last < prng_to_lcg[ret]);
	} else {
		if (prng_offset == PRNG_NUM_BYTES)
			prng_offset = 0;
		ret = prng_bytes[prng_offset] * 5u + 1u;
		return (prng_bytes[prng_offset++] = ret);
	}
}

int main(int argc, char *argv[]) {
	uint32_t seed;
	char try_all;
	FILE *fp;
	long size, offset;
	uint8_t *data;
	char ok;
	uint8_t arg, temp, move_type;

	if (argc == 2) {
		seed = 0ul;
		try_all = 1;
	} else if (argc != 3 || sscanf(argv[2], "%" FMT_U32, &seed) != 1) {
		fprintf(stderr, "Usage: %s <script-file> [test-seed]\n",
			(argc && **argv) ? *argv : "p3-break-seed");
		return 1;
	} else {
		try_all = 0;
	}

	if ((fp = fopen(argv[1], "rb")) == NULL) {
		fputs("Couldn't open input file!\n", stderr);
		return 1;
	}

	if (fseek(fp, 0l, SEEK_END)) {
		fclose(fp);
		fputs("Couldn't get input file size!\n", stderr);
		return 1;
	}

	if ((size = ftell(fp)) == -1l) {
		fclose(fp);
		fputs("Couldn't get input file size!\n", stderr);
		return 1;
	}

	if ((data = malloc(size)) == NULL) {
		fclose(fp);
		fputs("Couldn't allocate buffer!\n", stderr);
		return 1;
	}

	if (fseek(fp, 0l, SEEK_SET) || fread(data, 1ull, size, fp) != size) {
		fclose(fp);
		fputs("Couldn't read input file!\n", stderr);
		return 1;
	}

	fclose(fp);

	do /* while (try_all && seed) */ {
		prng_reset(seed << 16 | seed >> 16);
		for (offset = 0; offset < size; offset += 2) {
			arg = data[offset + 1];
			switch (data[offset]) {
			case 0x06:
				do temp = prng_byte(); while (temp < 217);
				ok = (temp >= arg && temp <= data[++offset + 1]);
				break;
			case 0x0F:
				do {
					temp = prng_byte() & 7;
					if (temp == 1)
						temp = prng_byte() & 7;
				} while (!temp || temp > 3);
				ok = (temp == (arg & 3) || ((arg & 0x80) && temp > (arg & 3)));
				break;
			case 0x18:
				do {
					temp = prng_byte() & 3;
				} while ((arg << temp) & 0x80);
				ok = (temp == (arg & 3) || ((arg & 8) && temp > (arg & 3)));
				break;
			case 0x1C:
				ok = 0;
				do {
					do temp = prng_byte() & 7; while (temp >= 6);
					if (temp == (arg & 7)) {
						ok = 1;
						break;
					}
				} while ((arg << (temp - (temp > (arg & 7)))) & 0x80);
				break;
			case 0x1D:
				temp = prng_byte() & 3;
				if (temp > 1)
					temp = prng_byte() & 3;
				ok = (temp == (arg & 3) || ((arg & 0x80) && temp > (arg & 3)));
				break;
			case 0x2D:
				do {
					temp = prng_byte();
				} while (!temp || strchr(metronome_forbidden, temp) != NULL
					|| temp == data[offset+2] || temp == data[offset+3]
					|| temp == data[offset+4]);
				ok = (temp == arg);
				offset += 3;
				break;
			case 0x30:
				do temp = prng_byte() & 7; while (!temp);
				ok = (temp == (arg & 7) || ((arg & 0x80) && temp > (arg & 7)));
				break;
			case 0x36:
				do {
					temp = prng_byte();
				} while (!temp || temp > (arg & 0x7F) * 3/2);
				ok = (temp == data[offset+2] || ((arg & 0x80) && temp > data[offset+2]));
				++offset;
				break;
			case 0x3B:
				move_type = arg >> 4;
				arg &= 0xF;
				if (move_type == 11) {
					if ((not_very_effective[17] << arg) & 0x8000)
						move_type = 17;
					else if ((not_very_effective[18] << arg) & 0x8000)
						move_type = 18;
				} else if (move_type == 3) {
					if ((not_very_effective[16] << arg) & 0x8000)
						move_type = 16;
				} else if (move_type == 6 && arg == 6) {
					arg = 16;
				}
				do {
					temp = prng_byte() & 0x1F;
				} while (type_id_to_num[temp] == 99 || (!temp ? move_type != 6 :
					!((not_very_effective[move_type] << type_id_to_num[temp]) & 0x8000)));
				ok = (type_id_to_num[temp] == arg);
				break;
			case 0x4C:
				do temp = prng_byte(); while (!temp);
				ok = (temp <= arg);
				break;
			case 0x51:
				do temp = prng_byte(); while (!temp);
				ok = (temp > arg);
				break;
			case 0x58:
				temp = prng_byte();
				ok = (temp <= present_power[(arg & 3) + (arg >> 4)] &&
					(!arg || temp > present_power[arg - 1]));
				break;
			case 0x5D:
				temp = prng_byte();
				ok = (arg < sizeof(magnitude_power) && temp <= magnitude_power[arg] &&
					(!arg || temp > magnitude_power[arg - 1]));
				break;
			case 0x9D:
				do temp = prng_byte() & 0x30; while (!temp);
				ok = (!arg || temp == arg);
				break;
			case 0xF0:
				prng_byte();
				ok = (prng_byte() < 0x3C || (prng_byte() >> 7) == arg);
				break;
			case 0xF1:
				if ((prng_byte() & 1) == arg) {
					ok = (prng_byte() >= 0x3C && prng_byte() < 0x3C);
				} else {
					ok = (prng_byte() < 0x3C);
				}
				break;
			case 0xF2:
				if ((prng_byte() & 1) == arg) {
					ok = (prng_byte() >= 0x3C &&
						(prng_byte() < 0x3C || (prng_byte() >> 7) == arg));
				} else {
					ok = (prng_byte() < 0x3C ||
						(prng_byte() >= 0x3C && (prng_byte() >> 7) == arg));
				}
				break;
			case 0xF3:
				if ((prng_byte() & 1) == arg) {
					ok = (prng_byte() >= 0x3C);
					prng_byte();
				} else {
					ok = (prng_byte() < 0x3C || prng_byte() >= 0x3C);
				}
				break;
			case 0xFD:
				ok = !((prng_byte() ^ arg) & (0xFF >> (arg >> 5)));
				break;
			case 0xFE:
				ok = (prng_byte() < arg);
				break;
			case 0xFF:
				ok = (prng_byte() >= arg);
				break;
			default:
				ok = 0;
			}
			if (!ok) break;
		}
		if (ok) printf("%10" FMT_U32 "\n", seed);
		++seed;
	} while (try_all && seed);
}
