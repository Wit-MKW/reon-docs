# `gtrkconfig.cgb`
This file may come from an alternate server. It simply specifies which tracks
have ranking downloads available.

## File format
| Offset(s) | Description                                            |
|-----------|--------------------------------------------------------|
| 0x0       | Bitfield of unavailable ranking downloads (LSB first). |
| 0x1       | Bitfield of unavailable ghost uploads (LSB first).     |
| 0x2-0x3   | Unused.                                                |
| 0x4-0x7   | Little-endian sum of bytes 0x0-0x3.                    |

### Notes
- Due to what seems to be a programming error, the field at offset 0x1 has no
  effect; that is, players can upload ghosts for any track, including custom
  tracks.
