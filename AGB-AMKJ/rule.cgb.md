# `rule.cgb`
This is a text file which the game downloads in order to determine the rules and
timeframes of the current Mobile GP challenge.

## File format
This file is line-based, and must have DOS-/Windows-style line breaks.

| Line(s) | Description                            |
|---------|----------------------------------------|
| 1       | Ticket filename to join.               |
| 2       | First day to save/view these rules.    |
| 3       | Last day to save these rules.          |
| 4       | First day to save/view the next rules. |
| 5       | Last day to save the next rules.       |
| 6       | First day to join or upload a ghost.   |
| 7       | Last day to join or upload a ghost.    |
| 8       | First day to save/view rankings.       |
| 9       | Last day to save rankings.             |
| 10      | Race rules.                            |
| 11      | Two-digit track number.                |
| 12      | Two-digit number of tries per ticket.  |
| 13      | Two-digit description line count.      |
| 14-21   | Description page 1.                    |
| 22-29   | Description page 2.                    |
| 30-37   | Description page 3.                    |
| 38-45   | Description page 4.                    |

## Race rules
The race rules are eight ASCII hex digits as follows:

| Offset | Description                                           |
|--------|-------------------------------------------------------|
| 0      | Zero disables track coins.                            |
| 1      | Zero disables item boxes.                             |
| 2      | Non-zero enables starting with triple mushrooms.      |
| 3      | Non-zero causes item boxes to produce mushrooms only. |
| 4      | Zero disables computer-controlled opponents.          |
| 5      | Forced character (0=none, 1-8=see below).             |
| 6      | Starting coin count divided by 5.                     |
| 7      | Non-zero sets the race length to 5 laps instead of 3. |

### Character IDs
1. Mario
2. Luigi
3. Peach
4. Toad
5. Yoshi
6. DK
7. Wario
8. Bowser

## Notes
- All dates are in `YYYYMMDD` format.
- Start dates are beginning-of-day, and end dates are end-of-day, in UTC+9.
- Track numbers run `00`-`19`, in Grand Prix order.
- The description is limited to 32 lines (four pages), and each line is limited
  to 22 fullwidth characters.
- The file may end after the last used description line.

### Technical info
- All digits are parsed as hex digits, meaning `A`-`F` may be used as decimal
  digits. This allows for decimal numbers to escape their intended ranges.
- When parsing a digit, any byte other than `1`-`9`, `A`-`F`, or `a`-`f` is
  parsed as zero.
- In the race rules, any character ID above `8` corresponds to Mario.
- The file is not technically parsed linewise at all. Instead:
  - Line 1 may be broken by any combination of `0A` and/or `0D`.
  - Lines 2-13, each being a fixed length, may be broken by any two bytes at
    all.
  - Lines 14-45 may be broken by any two bytes that do not form a valid
    character (including the bytes `8A EB`, which form `危`).
