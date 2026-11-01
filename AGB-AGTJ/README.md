# Zen-Nihon GT Senshuken
_Literally "All-Japan GT Championship". Released in the west as "Top Gear GT
 Championship"._

This game released on 2001-03-21 in Japan, 2001-06-21 in Europe (the same day
the GBA launched and one day prior, respectively), and 2001-07-09 in North
America. It is a car-racing simulator with career, time trial, and quick race
modes. Its mobile features (only in the Japanese version) mainly relate to the
time trial mode, allowing players to upload their ghost data and see how they
match up against others, as well as download ghost data and custom tracks
published by the server operators.

## URL list
This game uses the following complete URLs (see the corresponding `.md` files in
this directory for info on each):
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtconfig.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtgst00.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtgst01.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtgst02.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtgst03.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtgst04.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtgst05.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtgst06.cgb`

Custom tracks are downloaded from the URL
`http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/gtexcrsNNN.cgb`,
where `NNN` is an integer from `000`-`255` (see `gtexcrsNNN.cgb.md` in this
directory for more info):

The following filenames are appended to a prefix specified in `gtconfig.cgb` in
order to form URLs (see the corresponding `.md` files in this directory for more
info on each):
- `gtrkconfig.cgb`
- `gtrk00.cgb`
- `gtrk01.cgb`
- `gtrk02.cgb`
- `gtrk03.cgb`
- `gtrk04.cgb`
- `gtrk05.cgb`
- `gtrk06.cgb`

Finally, ghost files have arbitrary names, which are appended to
`http://gameboy.datacenter.ne.jp/cgb/download?name=/28/AGB-AGTJ/` in order to
form URLs (see `ghost-data.md`) in this directory for more info). Ghost file
names are subject to the following restrictions:
- Length must be 1-31 bytes (inclusive).
- Must contain exactly one or two dots (`.`).
- If the name contains two dots, the text before the first dot must parse to one
  of the integers 0, 50, 100, ..., or 300.

## Emails, attachments
Ghost and track uploads are sent as email attachments to addresses specified in
`gtconfig.cgb` (see `gtconfig.cgb.md` for info). These emails have a subject
line of `GT-CHAMP-ENTRY` or `GT-CHAMP-MAP` (respectively) and the following
headers (after `From`, `To`, and `Subject`):
```
X-Game-code: AGB-AGTJ-00
X-Game-title: GT-CHAMP
MIME-Version: 1.0
Content-type: multipart/mixed; boundary="--AGB-AGTJ"
```
The content is split in two parts. The first has the following headers and
content (including the `Context` typo):
```
Content-Type: text/plain; charset=iso-2022-jp
Context-Transfer-Encoding: 7bit

-----------------------
【全日本ＧＴ選手権】でランキング登録が失敗している可能性があります。
もう一度、エントリーしてください。
-----------------------
```
The second part has the following headers (including the `octec` typo), and
the same content as the corresponding download file, but with a 32-byte header
consisting entirely of the player's NUL-terminated email address.
```
Content-Type: application/octec-stream; name="****"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="****"
```
Both instances of `****` are the same filename:
- `gtent00.cgb`
- `gtent01.cgb`
- `gtent02.cgb`
- `gtent03.cgb`
- `gtent04.cgb`
- `gtent05.cgb`
- `gtent06.cgb`
- `100.gtexcrs`

## Common structure formats
### Timestamp
| Offset(s) | Description         |
|-----------|---------------------|
| 0x0-0x1   | Little-endian year. |
| 0x2       | Month (1-12).       |
| 0x3       | Date (1-31).        |
| 0x4       | Hour (0-23).        |
| 0x5       | Minute (0-59).      |
| 0x6       | Second (0-59).      |
| 0x7       | Zero (0).           |

### Ranking entry
| Offset(s) | Description                                               |
|-----------|-----------------------------------------------------------|
| 0x00      | Track ID.                                                 |
| 0x01      | Weather (0=sun, 1=rain).                                  |
| 0x02      | Vehicle ID.                                               |
| 0x03      | Transmission mode (0=auto, 1=manual).                     |
| 0x04      | Gear ratio (0=low, 1=medium, 2=high).                     |
| 0x05      | Steering (0=slow, 1=medium, 2=quick).                     |
| 0x06      | Brake (0=soft, 1=medium, 2=hard).                         |
| 0x07      | Tire (0=soft, 1=medium, 2=hard).                          |
| 0x08      | Aerodynamics (0=low, 1=medium, 2=high).                   |
| 0x09      | Custom track no. (0 for standard and user-custom tracks). |
| 0x0A-0x0B | Zero (0).                                                 |
| 0x0C-0x0D | Little-endian handicap weight in kilograms.               |
| 0x0E-0x23 | Player's name.                                            |
| 0x24-0x27 | Little-endian race time in units of 1/100 second.         |
| 0x28-0x2F | GMT upload timestamp.                                     |
| 0x30-0x33 | Little-endian ghost ID (0 for non-uploaded ghosts).       |

## Notes
- Track IDs (not to be confused with track numbers) are as follows:
  - 0: Twin Ring Motegi
  - 1: Fuji Speedway
  - 2: Sportsland Sugo
  - 3: TI Circuit Aida
  - 4: Central Park Mine Circuit
  - 5: Suzuka Circuit
  - 6: _Custom track slot 1._
  - 7: _Custom track slot 2._
  - 8: _Custom track slot 3._
- Only track IDs 0-6 appear in filenames and bitfields.
- Adding 9 to any track ID indicates that a particular run was performed in
  mirror mode. Mirror-mode track IDs do not appear in filenames or bitfields.

### Character set
This game's strings are based on two-byte, little-endian codepoints. Its
character set is as follows:
- `0000`-`005D` are as JIS `20`-`7D`, respectively.
- `0058`-`007F` are as follows:

| `0x` | +0  | +1  | +2  | +3  | +4  | +5  | +6  | +7  |
|------|-----|-----|-----|-----|-----|-----|-----|-----|
| `58` | `x` | `y` | `z` | `{` | \|  | `}` | `~` | `〒` |
| `60` | `✩` | `★` | `○` | `●` | `⌾` | `◇` | `◆` | `□` |
| `68` | `■` | `△` | `▲` | `▽` | `▼` | `♥︎` | `♂` | `♀` |
| `70` | `\` | `≠` | `<` | `>` | `±` | `×` | `÷` | `‖` |
| `78` | `‘` | `’` | `“` | `”` | `⦗` | `⦘` | `《` | `》` |

- `0081`-`00BF` are as JIS `A1-DF`, respectively, although the in-game keyboard
  enters `00F5` and `0100` instead of `0085` and `0090`, respectively.
- `00C0`-`00EF` are as follows:

| `0x` | +0  | +1  | +2  | +3  | +4  | +5  | +6  | +7  |
|------|-----|-----|-----|-----|-----|-----|-----|-----|
| `C0` | `‥` | `…` | `ヰ` | `ヴ` | `ヱ` |     | `ガ` | `ギ` |
| `C8` | `グ` | `ゲ` | `ゴ` | `ザ` | `ジ` | `ズ` | `ゼ` | `ゾ` |
| `D0` | `ダ` | `ヂ` | `ヅ` | `デ` | `ド` | `パ` | `ピ` | `プ` |
| `D8` | `ペ` | `ポ` | `バ` | `ビ` | `ブ` | `ベ` | `ボ` | `♪` |
| `E0` | `∞` | `【` | `】` | `℃` | `¢` | `£` | `§` | `═` |
| `E8` | `〜` | `™` | `©` | `®` | `→` | `←` | `↑` | `↓` |

- `00F1`-`014E` are the hiragana equivalents of `0081`-`00DE`, respectively,
  with the following exceptions:
  - The in-game keyboard enters `0081` and `0084` instead of `00F1` and `00F4`,
    respectively.
  - `00F2` and `00F3` are `『` and `』`, respectively.
  - `0133` and `0135` are undefined.
