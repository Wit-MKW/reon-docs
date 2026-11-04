# Upload data
This obfuscated file is uploaded with the player's score and profile to be
submitted to the rankings.

## File format
_Note that the file is obfuscated by inverting certain bits; see the
 [XOR table](#xor-table) below._

| Offset(s) | Description                                                  |
|-----------|--------------------------------------------------------------|
| 0x00      | 0xED minus the sum of bytes 0x05, 0x09, 0x0D, ..., and 0x45. |
| 0x01      | 0x45 minus the sum of bytes 0x07, 0x0B, 0x0F, ..., and 0x47. |
| 0x02      | 0x76 minus the sum of bytes 0x06, 0x0A, 0x0E, ..., and 0x46. |
| 0x03      | 0x83 minus the sum of bytes 0x04, 0x08, 0x0C, ..., and 0x48. |
| 0x04-0x31 | Player's email address, NUL-padded.                          |
| 0x32-0x48 | Player's profile.                                            |

### XOR table
| `0x` | +0   | +1   | +2   | +3   | +4   | +5   | +6   | +7   |
|------|------|------|------|------|------|------|------|------|
| `00` | `28` | `19` | `8A` | `5A` | `6B` | `DD` | `E3` | `59` |
| `08` | `F1` | `38` | `33` | `8C` | `9D` | `42` | `85` | `5B` |
| `10` | `BA` | `38` | `92` | `69` | `13` | `8A` | `9B` | `01` |
| `18` | `93` | `BC` | `C9` | `3A` | `5A` | `2B` | `92` | `38` |
| `20` | `66` | `69` | `58` | `CD` | `C1` | `1C` | `9A` | `55` |
| `28` | `8F` | `77` | `71` | `E3` | `16` | `69` | `E1` | `3E` |
| `30` | `FF` | `AF` | `11` | `23` | `31` | `E2` | `D1` | `5D` |
| `38` | `5A` | `EE` | `29` | `88` | `18` | `91` | `4F` | `5A` |
| `40` | `60` | `FE` | `E5` | `CD` | `10` | `FA` | `07` | `9A` |
| `48` | `9D` |      |      |      |      |      |      |      |
