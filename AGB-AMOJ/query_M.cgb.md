# `query_M.cgb`
This file announces the top 10 rankings of a given month (the game itself only
ever requests the current and previous month's rankings). It also contains the
player's own ranking in the same month.

## Query format
| Offsets   | Description          |
|-----------|----------------------|
| 0x00-0x06 | ASCII: "`myname=`".  |
| 0x07-0x56 | ASCII hex: `myname`. |
| 0x57-0x5D | ASCII: "`&today=`".  |
| 0x5E-0x5F | ASCII hex: `today`.  |

## File format
| Size | Description                   |
|------|-------------------------------|
| 2    | Big-endian ranking count (N). |
| 56xN | (N) ranking entries.          |
| 2    | Zero if no player ranking.    |
| 56   | Player's ranking entry.       |

## Ranking entry
| Offsets   | Description             |
|-----------|-------------------------|
| 0x00-0x03 | Big-endian rank number. |
| 0x04-0x37 | As `0.regist.cgb`.      |

## Notes
If there is no player ranking, space does not need to be reserved for it; in
other words, the file may be cut off at that point.
