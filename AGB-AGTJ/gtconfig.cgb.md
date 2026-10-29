# `gtconfig.cgb`
This file specifies the status of each service, the URL to access the ranking
lists (as opposed to ghost lists), and the email addresses to which ghost data
and custom tracks are to be sent (although there is no in-game option to send
the latter).

## File format
| Offset(s) | Description                                                  |
|-----------|--------------------------------------------------------------|
| 0x00      | Basic status flags.                                          |
| 0x01      | Bitfield of unavailable ghost downloads (LSB first).         |
| 0x02      | Custom track no. currently available for download.           |
| 0x03      | Custom track no. for which ghosts can currently be uploaded. |
| 0x04-0x43 | NUL-terminated URL prefix for ranking lists.                 |
| 0x44-0x83 | NUL-terminated email address for ghost uploads.              |
| 0x84-0xC3 | NUL-terminated email address for track uploads.              |
| 0xC4-0xC7 | Little-endian sum of bytes 0x00-0xC3.                        |

### Flags
| Bit  | Description                                       |
|------|---------------------------------------------------|
| 0x01 | Rankings and ghosts are currently unavailable.    |
| 0x02 | Rankings and ghosts are indefinitely unavailable. |
| 0x10 | Custom tracks are currently unavailable.          |
| 0x20 | Custom tracks are indefinitely unavailable.       |

### Notes
- The basic status flags apply equally to uploads and downloads.
- The fields at offsets 0x02 and 0x03 need not match.
- Due to what seems to be a programming error, the field at offset 0x03 has no
  effect; that is, players can upload ghosts for any custom track, including
  their own (unless this is disabled entirely by setting bit 6 of offset 0x01).
