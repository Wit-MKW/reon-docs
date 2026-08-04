# Mobile Stadium distribution file (Japan)
Once a Mobile Stadium distribution has been selected from `menu.cgb`, its file
is downloaded. This file must be exactly 4094 (0xFFE) bytes in size, and its
file ID must match the one specified in `menu.cgb`; aside from those two checks,
Pokémon Crystal does not read or check any of the file's contents.

## File format
| Offset(s)   | Description                                 |
|-------------|---------------------------------------------|
| 0x000       | Number of active replay records.            |
| 0x001       | Number of active rule records.              |
| 0x002-0x003 | Unused.                                     |
| 0x004-0x483 | Replay record #1.                           |
| 0x484-0x903 | Replay record #2.                           |
| 0x904-0xD83 | Replay record #3.                           |
| 0xD84-0xDCB | Rule record #1.                             |
| 0xDCC-0xE13 | Rule record #2.                             |
| 0xE14-0xE5B | Rule record #3.                             |
| 0xE6C-0xEA3 | Rule record #4.                             |
| 0xEA4-0xEEB | Rule record #5.                             |
| 0xEEC-0xFE0 | Message of the day. Null-terminated EUC-JP. |
| 0xFE1       | Delibird's Delivery flags.                  |
| 0xFE2-0xFE9 | Unused.                                     |
| 0xFEA-0xFF9 | File ID.                                    |
| 0xFFA-0xFFB | ASCII `P3`.                                 |
| 0xFFC-0xFFD | Little-endian sum of bytes 0x000-0xFFB.     |

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

## Replay record
| Offset(s)   | Description                                |
|-------------|--------------------------------------------|
| 0x000-0x1D3 | Player record, P1.                         |
| 0x1D4-0x3A7 | Player record, P1's opponent.              |
| 0x3A8-0x3AB | Big-endian random seed.                    |
| 0x3AC-0x412 | Each byte represents a turn of the battle. |
| 0x413       | Number of turns.                           |
| 0x414-0x457 | Battle rules.                              |
| 0x458-0x477 | Battle title. Null-terminated EUC-JP.      |
| 0x478       | Stadium cup.                               |
| 0x479       | Stadium arena.                             |
| 0x47A-0x47B | Big-endian stadium division.               |
| 0x47C-0x47D | ASCII `P3`.                                |
| 0x47E-0x47F | Little-endian sum of bytes 0x000-0x47D.    |

### Notes
- In each turn byte, the four most-significant bits represent an action taken by
  P1, and the four least-significant bits represent an action taken by P1's
  opponent:
  - 0-3 represent the current Pokémon's moves.
  - 4-9 represent a switch to a different Pokémon, in the order in which they
    were entered.
  - F represents no action (continued move, opponent forced to switch, etc.).
  - _TODO: what about Struggle?_
- The battle rules are in the format of a rule record, but without the four-byte
  checksum block at the end.
- Stadium cup:
  - 0: _The normal cup for this arena._
  - 1: _The normal cup for this arena._
  - 2: _The normal cup for this arena._
  - 3: Gym Leader Castle
  - 4: Prime Cup, round 1
  - 5: Prime Cup
  - 6: VS Rival
- Stadium arena:
  - 0: Little Cup
  - 1: Poké Cup
  - 2: Challenge Cup
  - 3: Prime Cup
  - 0x10: Edit Cup
  - 0x20: Free Battle
- Stadium division:
  - 0: _Not applicable._
  - 1: Poké Ball
  - 2: Great Ball
  - 3: Ultra Ball
  - 4: Master Ball
- If the record is inactive, `P3` should be replaced with `XX` and the checksum
  should be inverted bitwise.

## Player record
| Offset(s)   | Description                           |
|-------------|---------------------------------------|
| 0x000-0x005 | Nickname, in Crystal encoding.        |
| 0x006       | Player icon character.                |
| 0x007       | Player icon expression.               |
| 0x008-0x01D | Player name, null-terminated EUC-JP.  |
| 0x01E-0x01F | Big-endian trainer ID.                |
| 0x020-0x05B | Party Pokémon #0.                     |
| 0x05C-0x097 | Party Pokémon #1.                     |
| 0x098-0x0D3 | Party Pokémon #2.                     |
| 0x0D4-0x10F | Party Pokémon #3.                     |
| 0x110-0x14B | Party Pokémon #4.                     |
| 0x14C-0x187 | Party Pokémon #5.                     |
| 0x188-0x1CB | AI record.                            |
| 0x1CC-0x1D1 | Party indices of all entered Pokémon. |
| 0x1D2-0x1D3 | Unused (should be zero).              |

### Notes
- When saving a battle replay, Pokémon Stadium 2 uses an icon character of 0x40
  with an expression of:
  - 0 if the player used a Crystal cartridge which was played as Kris.
  - 1 otherwise.
- Unused party indices should be set to zero.

## Party Pokémon
| Offset(s) | Description                                       |
|-----------|---------------------------------------------------|
| 0x00      | Species ID (national/"old" Pokédex number).       |
| 0x01      | Held-item ID.                                     |
| 0x02-0x05 | Move IDs.                                         |
| 0x06-0x07 | Big-endian original trainer ID.                   |
| 0x08-0x0B | Big-endian experience.                            |
| 0x0C-0x0D | Big-endian HP experience.                         |
| 0x0E-0x0F | Big-endian Attack experience.                     |
| 0x10-0x11 | Big-endian Defense experience.                    |
| 0x12-0x13 | Big-endian Speed experience.                      |
| 0x14-0x15 | Big-endian Special experience.                    |
| 0x16-0x17 | Big-endian determinant value.                     |
| 0x18-0x1B | Current PP of all moves, in order.                |
| 0x1C      | Friendship.                                       |
| 0x1D      | Level.                                            |
| 0x1E-0x1F | Big-endian rental flag.                           |
| 0x20      | Pokérus flag.                                     |
| 0x21-0x22 | When and where the Pokémon was met.               |
| 0x23      | Unused, should be zero.                           |
| 0x24-0x2F | Nickname, in Crystal encoding.                    |
| 0x30-0x3B | Original trainer's nickname, in Crystal encoding. |

### Notes
_TODO_

## AI record
_TODO_

## Rule record
| Offset(s) | Description                                         |
|-----------|-----------------------------------------------------|
| 0x00-0x13 | Ruleset title. Null-terminated EUC-JP.              |
| 0x14-0x33 | Big-endian bitfield of allowed Pokémon (1=allowed). |
| 0x34-0x35 | Big-endian stadium cup.                             |
| 0x36      | Minimum Pokémon level.                              |
| 0x37      | Maximum Pokémon level.                              |
| 0x38-0x39 | Big-endian maximum sum of entered Pokémon levels.   |
| 0x3A-0x3B | Big-endian party selection background ID.           |
| 0x3C-0x3D | Big-endian rental Pokémon set ID.                   |
| 0x3E-0x3F | Big-endian party selection prompt-text ID.          |
| 0x40      | Flags.                                              |
| 0x41-0x43 | Unused.                                             |
| 0x44-0x45 | ASCII `P3`.                                         |
| 0x46-0x47 | Little-endian sum of bytes 0x00-0x45.               |

### Flags
| Bit  | Description                                                     |
|------|-----------------------------------------------------------------|
| 0x04 | Allow Pokémon to hold items.                                    |
| 0x08 | Allow the moves Dragon Rage and SonicBoom to deal damage.       |
| 0x20 | Allow multiple Pokémon to hold the same item.                   |
| 0x80 | Allow any size party, and require that all party Pokémon enter. |

### Notes
- Stadium cup:
  - 0: Little Cup
  - 1: Challenge Cup, Poké Ball
  - 2: Challenge Cup, Great Ball
  - 3: Challenge Cup, Ultra Ball
  - 4: Challenge Cup, Master Ball
  - 5: Anything Goes
  - 6: Gym Leader Castle
  - 7: Poké Cup, Poké Ball
  - 8: Poké Cup, Great Ball
  - 9: Poké Cup, Ultra Ball
  - 10: Poké Cup, Master Ball
  - 11: VS Rival
  - 12: Prime Cup, round 1
  - 13: Prime Cup, round 2
  - 14: Edit Cup
- Rental Pokémon set:
  - 0: Little Cup
  - 1: Prime Cup, round 1
  - 2: Prime Cup, round 2
  - 3: Poké Cup, round 1
  - 4: Poké Cup, round 2
  - 0xFFFF: _No rental Pokémon._
- If the record is inactive, `P3` should be replaced with `XX` and the checksum
  should be inverted bitwise.
