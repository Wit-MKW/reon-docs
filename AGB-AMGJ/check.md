# Rank check
The game queries this file when uploading, in order to verify that the player
has not previously uploaded a better score. Most of its fields are unknown due
to going unused by the game code.

## Query format
| Offsets   | Description                                               |
|-----------|-----------------------------------------------------------|
| 0x00-0x05 | ASCII: "`ident=`".                                        |
| 0x06-0x61 | ASCII hex: player's email address (NUL-padded).           |
| 0x62-0x68 | ASCII: "`&score=`".                                       |
| 0x69-0x70 | ASCII hex: score to be uploaded, in units of 1/4096 gram. |

## File format
| Offsets | Description                                       |
|---------|---------------------------------------------------|
| 0x0-0x3 | Unused.                                           |
| 0x4-0x5 | If zero (0), data is always uploaded.             |
| 0x6-0x9 | Unused.                                           |
| 0xA-0xD | Big-endian player score, in units of 1/4096 gram. |
| 0xE-0xF | If zero (0), data is always uploaded.             |
