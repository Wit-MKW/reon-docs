# Mobile Stadium distribution file (Japan)
Once a Mobile Stadium distribution has been selected from `menu.cgb`, its file
is downloaded. This file must be exactly 4094 (0xFFE) bytes in size, and its
file ID must match the one specified in `menu.cgb`; aside from those two checks,
Pokémon Crystal does not read or check any of the file's contents.

## File format
| Offset(s)   | Description                             |
|-------------|-----------------------------------------|
| 0x000       | Number of active replay records.        |
| 0x001       | Number of active rule records.          |
| 0x002-0x003 | Unused.                                 |
| 0x004-0x483 | Replay record #1.                       |
| 0x484-0x903 | Replay record #2.                       |
| 0x904-0xD83 | Replay record #3.                       |
| 0xD84-0xDCB | Rule record #1.                         |
| 0xDCC-0xE13 | Rule record #2.                         |
| 0xE14-0xE5B | Rule record #3.                         |
| 0xE6C-0xEA3 | Rule record #4.                         |
| 0xEA4-0xEEB | Rule record #5.                         |
| 0xEEC-0xFE0 | Message of the day, null-terminated.    |
| 0xFE1       | Delibird's Delivery flags.              |
| 0xFE2-0xFE9 | Unused.                                 |
| 0xFEA-0xFF9 | File ID.                                |
| 0xFFA-0xFFB | ASCII `P3`.                             |
| 0xFFC-0xFFD | Little-endian sum of bytes 0x000-0xFFB. |

### Flags
| Bit  | Description                         |
|------|-------------------------------------|
| 0x01 | Replace original Game Boy with GBA. |
| 0x02 | Replace Nintendo 64 with GameCube.  |

### Notes
- Active records should be placed at the beginning of their respective arrays,
  and inactive records at the end.
- The message of the day is displayed in a window at the bottom of the main
  Mobile Stadium menu, and may contain control words.
- Changes made by the Delibird's Delivery flags cannot be reverted.
