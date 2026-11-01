# `gtgst0N.cgb`
_Where `N` is a digit `0`-`6`, inclusive._

This file lists up to 30 ghosts available for download related to track ID `N`.
It also contains a timestamp to indicate when the ghost listings were last
updated.

## File format
| Offset(s)   | Description                             |
|-------------|-----------------------------------------|
| 0x000-0x007 | Local-zone update timestamp.            |
| 0x008-0x05B | Ghost entry #1.                         |
| 0x05C-0x0AF | Ghost entry #2.                         |
| 0x0B0-0x103 | Ghost entry #3.                         |
| 0x104-0x98B | _etc._                                  |
| 0x98C-0x9DF | Ghost entry #30.                        |
| 0x9E0-0x9E3 | Little-endian sum of bytes 0x000-0x9DF. |

## Ghost entry
| Offset(s) | Description              |
|-----------|--------------------------|
| 0x00-0x33 | Ranking entry.           |
| 0x34-0x53 | NUL-terminated filename. |
