# Ghost data
_Which may have any filename, subject to some restrictions._

This file allows the player to race against a pre-played time trial run by
recording the settings used for that run, as well as the inputs entered during
it, frame for frame.

## File format
| Offset(s)     | Description                               |
|---------------|-------------------------------------------|
| 0x0000-0x0033 | Ranking entry.                            |
| 0x0034-0x0035 | Little-endian length specifier.           |
| 0x0036-0x00CD | Inputs entered during countdown.          |
| 0x00CE-0x102F | Input block #1.                           |
| 0x1030-0x202B | Input block #2.                           |
| 0x202C-0x2F8B | Input block #3.                           |
| 0x2F8C-0x2F8F | Zero (0).                                 |
| 0x2F90-0x2F93 | Little-endian sum of bytes 0x0000-0x2F8F. |

### Input frame
| Bit  | Description  |
|------|--------------|
| 0x01 | Accelerator. |
| 0x02 | Brakes.      |
| 0x04 | Steer left.  |
| 0x08 | Steer right. |
| 0x10 | Shift up.    |
| 0x20 | Shift down.  |
| 0x40 | Zero (0).    |
| 0x80 | Zero (0).    |

## Notes
- The length specifier indicates the number of input frames after the countdown
  (that is, the number of inputs in blocks #1-3, or the total number of inputs
  minus 152).
- The division of the input frames into "blocks" here is due to the format of
  ghost data in the flash save; because it spans three sectors, the "blocks" are
  separated by the checksums of the first two sectors.
- When downloading ghost data, the checksum is not verified; when playing back
  ghost data, inputs after the end of the race are not read. These facts
  together mean that the downloaded file can be cut off after the last used
  input.
