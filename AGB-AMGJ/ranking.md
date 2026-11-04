# Ranking data
This file announces the top 10 rankings, as well as up to 101 "overall" rankings
(it is unclear what the latter entailed).

## File format
| Size | Description                        |
|------|------------------------------------|
| 2    | Big-endian year.                   |
| 1    | Month (1-12).                      |
| 1    | Day (1-31).                        |
| 1    | Hour (0-23).                       |
| 1    | Minute (0-59).                     |
| 2    | Big-endian top 10 count (T<=10).   |
| 27xT | Top 10 ranking entries.            |
| 2    | Big-endian overall count (N<=128). |
| 27xN | Overall ranking entries.           |

## Ranking entry
| Offsets   | Description             |
|-----------|-------------------------|
| 0x00-0x03 | Big-endian rank number. |
| 0x04-0x1A | Profile.                |

## Notes
While the game will load up to 128 overall ranking entries, only the first 101
will appear on-screen (although nos. 102-115 and 125-128 may appear in the
internal tile map).
