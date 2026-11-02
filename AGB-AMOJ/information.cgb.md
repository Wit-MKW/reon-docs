# `information.cgb`
This file simply contains the latest notice, which is a text message to be read
by the player.

## File format
This file has a size of 2560 bytes. It is divided into 64 lines, and each line
is divided into 20 tiles, which are two-byte, little-endian values. The least
significant byte of the last tile of each line except the last must be 0xFE; the
least significant byte of the last tile of the last line must be 0xFF.

A line is considered blank if the least significant byte of each tile of that
line (except the last) is 0xA3. No lines after the last non-blank line are
displayed in-game. The file may not consist entirely of blank lines.

The totality of all tiles, up to (but not including) the first whose least
significant byte is 0xFF, are shown to the player in a scrolling window, with
the following exceptions:
- Tiles whose least significant byte is 0xF1-0xFD, are skipped.
- Tiles whose least significant byte is 0xFE are not displayed, but instead
  break a line.

## Notes
Because the tiles are displayed as they are, the most significant bit of each
may be used to modify how it is displayed:

| Bit(s) | Description                  |
|--------|------------------------------|
| 0x01   | Zero (0).                    |
| 0x02   | Use alternate character set. |
| 0x04   | Horizontal flip.             |
| 0x08   | Vertical flip.               |
| 0x70   | Text colour.                 |
| 0x80   | Set (1).                     |

### Alternate character set
The alternate character set is only usable in `information.cgb`. It only
contains characters `00`-`5E`, which are as ASCII `20`-`7E`, respectively,
except that `3C` is `¥` instead of `\`. This means that some characters in the
alternate character set appear identical to others in the main character set,
namely digits (`0`-`9`), uppercase letters (`A`-`Z`), and the following (note
that this list _is_ exhaustive):

| Alt. | Main |
|------|------|
| `00` | `A3` |
| `01` | `7E` |
| `04` | `98` |
| `05` | `E7` |

### Text colours
The following text colours are available:
- 0: white
- 1: grey
- 2: brown
- 3: red
- 4: blue
- 5: orange
- 6: green
- 7: magenta
