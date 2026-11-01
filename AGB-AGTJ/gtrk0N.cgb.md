# `gtrk0N.cgb`
_Where `N` is a digit `0`-`6`, inclusive._

This file may come from an alternate server. It announces the 50 best uploaded
times on track ID `N`, and also contains a timestamp to indicate when the
rankings were last updated.

## File format
| Offset(s)   | Description                             |
|-------------|-----------------------------------------|
| 0x000-0x007 | Local-zone update timestamp.            |
| 0x008-0x03B | Ranking entry #1.                       |
| 0x03C-0x06F | Ranking entry #2.                       |
| 0x070-0x0A3 | Ranking entry #3.                       |
| 0x0A4-0x9FB | _etc._                                  |
| 0x9FC-0xA2F | Ranking entry #50.                      |
| 0xA30-0xA33 | Little-endian sum of bytes 0x000-0xA2F. |
