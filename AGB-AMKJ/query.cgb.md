# `query.cgb`
This file is queried to obtain the current rankings in several categories, most
of which are related in some way to the player's own ranking (if they have one).

## Query format
| Offsets   | Description                                                 |
|-----------|-------------------------------------------------------------|
| 0x00-0x04 | ASCII: "`myid=`".                                           |
| 0x05-0x24 | ASCII hex: player's Kart ID.                                |
| 0x25-0x2E | ASCII: "`&myrecord=`".                                      |
| 0x2F-0x32 | ASCII hex: player's time in units of 1/100 second plus one. |
| 0x33-0x40 | ASCII: "`&pickuprecord=`".                                  |
| 0x41-0x44 | ASCII hex: player's time in units of 1/100 second.          |
| 0x45-0x4B | ASCII: "`&state=`".                                         |
| 0x4C-0x4D | ASCII hex: player's prefecture ID.                          |
| 0x4E-0x55 | ASCII: "`&driver=`".                                        |
| 0x56-0x57 | ASCII hex: player's driver ID.                              |
| 0x58-0x5D | ASCII: "`&rk_1=`".                                          |
| 0x5E-0x65 | ASCII hex: first overall rank no.                           |
| 0x66-0x6B | ASCII: "`&rk_2=`".                                          |
| 0x6C-0x73 | ASCII hex: second overall rank no.                          |
| 0x74-0x79 | ASCII: "`&rk_3=`".                                          |
| 0x7A-0x81 | ASCII hex: third overall rank no.                           |
| 0x82-0x87 | ASCII: "`&rk_4=`".                                          |
| 0x88-0x8F | ASCII hex: fourth overall rank no.                          |
| 0x90-0x95 | ASCII: "`&rk_5=`".                                          |
| 0x96-0x9D | ASCII hex: fifth overall rank no.                           |
| 0x9E-0xA3 | ASCII: "`&rk_6=`".                                          |
| 0xA4-0xAB | ASCII hex: sixth overall rank no.                           |
| 0xAC-0xB1 | ASCII: "`&rk_7=`".                                          |
| 0xB2-0xB9 | ASCII hex: seventh overall rank no.                         |
| 0xBA-0xBF | ASCII: "`&rk_8=`".                                          |
| 0xC0-0xC7 | ASCII hex: eighth overall rank no.                          |
| 0xC8-0xCD | ASCII: "`&rk_9=`".                                          |
| 0xCE-0xD5 | ASCII hex: ninth overall rank no.                           |
| 0xD6-0xDC | ASCII: "`&rk_10=`".                                         |
| 0xDD-0xE4 | ASCII hex: tenth overall rank no.                           |
| 0xE5-0xEB | ASCII: "`&rk_11=`".                                         |
| 0xEC-0xF3 | ASCII hex: eleventh overall rank no.                        |

## File format
| Size    | Description                     |
|---------|---------------------------------|
| Gx28+16 | Global top 10 (N=G).            |
| 2       | Big-endian rival count (R<=11). |
| Rx28    | Rival ranking entries.          |
| 4-15    | Global player rank.             |
| 2 or 30 | First overall entry.            |
| 2 or 30 | Second overall entry.           |
| 2 or 30 | Third overall entry.            |
| 14-210  | _etc._                          |
| 2 or 30 | Eleventh overall entry.         |
| Px28+16 | Prefecture top 10 (N=P).        |
| 4-15    | Prefecture player rank.         |
| Dx28+16 | Driver top 10 (N=D).            |
| 4-15    | Driver player rank.             |
| 4       | Big-endian global rank count.   |

### Top 10
| Offsets   | Description                             |
|-----------|-----------------------------------------|
| 0x00-0x05 | Timestamp.                              |
| 0x06-0x09 | Big-endian rank count.                  |
| 0x0A-0x0D | Big-endian player count.                |
| 0x0E-0x0F | Big-endian ranking entry count (N<=11). |
| 0x10-...  | `N` ranking entries.                    |

### Ranking entry
| Offset(s) | Description                    |
|-----------|--------------------------------|
| 0x00-0x03 | Big-endian rank no.            |
| 0x04      | Driver ID.                     |
| 0x05-0x09 | Nickname.                      |
| 0x0A-0x0B | Time in units of 1/100 second. |
| 0x0C-0x1B | Kart ID.                       |

### Overall entry
| Size    | Description                  |
|---------|------------------------------|
| 2       | Zero means no ranking entry. |
| 0 or 28 | Optional ranking entry.      |

### Player rank
| Size   | Description                             |
|--------|-----------------------------------------|
| 2      | Zero means no rank no.                  |
| 0 or 4 | Optional big-endian rank no.            |
| 2      | Zero means no extended info.            |
| 0 or 4 | Optional big-endian extended rank no.   |
| 0 or 1 | Optional extended driver ID.            |
| 0 or 2 | Optional big-endian extended race time. |

## Notes
- Only the global timestamp is displayed in-game.
- If `N` of a top 10 list or `R` is greater than eleven, it is treated as if it
  were eleven; that is, the next field is just after the eleventh ranking entry.
- The eleventh ranking entry (if any) of each category is not displayed in-game.
