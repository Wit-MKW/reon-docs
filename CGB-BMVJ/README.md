# Net de Get: Minigame @100
_Also known simply as "Net de Get" or "Minigame @100"; "Minigame" may also be
 plural, as in "Minigames @100". See [Notes § Title](#title) for complications
 regarding the title._

This game released only in Japan, on 2001-07-12. It is little more than a
minigame collection (hence the title). Its main selling feature was its ability
to download additional minigames over the Internet, saving them to its built-in
1 MiB flash ROM.

## URL list
This game has four types of downloaded files. Only the last can be reasonably
classified as "DLC", while the rest amount to menus. See the corresponding `.md`
files in this directory for info on each.
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/A4/CGB-BMVJ/h0***.cgb`
  - Immediately upon connecting to the server, the game downloads `h0000.cgb`.
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/A4/CGB-BMVJ/h8***.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/A4/CGB-BMVJ/RomList.cgb`
- _Compressed minigame data._
  - Each minigame's filename is specified by `RomList.cgb`, and is appended to
    `http://gameboy.datacenter.ne.jp/cgb/download?name=/A4/CGB-BMVJ/` to form a
    URL.

## Notes
This game's strings are byte-oriented, and its character set is as follows:
- `00` terminates a string.
- `01` breaks a line.
- `02 xy` sets the text colour to `xy` (default `0`).
- `03 xy` inserts parameter string `xy`.
  - Parameter strings are context-dependent.
- `04` clears the text field.
- `0F` waits for an A press before continuing.
  - `0F` should always be followed by `00` or `04`.
- `10`-`2F` are as ASCII `20`-`3F`, respectively.
- `30`-`3F` are as follows:
| `0x` | +0  | +1  | +2  | +3  |
|------|-----|-----|-----|-----|
| `30` | `[` | `¥` | `]` | `×` |
| `34` | `÷` | `{` | `|` | `}` |
| `38` | `~` | `@` | `｢` | `｣` |
| `3C` | `—` | `~` | `､` | `｡` |
- Latin letters are as in ASCII (`41`-`5A` and `61`-`7A`).
- `5B`-`5F` and `7B`-`7F` are as follows:
| `0x` | +B  | +C  | +D  | +E  | +F  |
|------|-----|-----|-----|-----|-----|
| `50` | `✜` | `‥` | `^` | `_` | `’` |
| `70` | `Ⓐ` | `Ⓑ` | ` ` | ` ` | ` ` |
- `80`-`FF` are as follows.
  - `FE` and `FF` precede the character they modify (e.g. `FE 98` is `で`).
| `0x` | +0  | +1  | +2  | +3  | +4  | +5  | +6  | +7  |
|------|-----|-----|-----|-----|-----|-----|-----|-----|
| `80` | `ぁ` | `あ` | `ぃ` | `い` | `ぅ` | `う` | `ぇ` | `え` |
| `88` | `ぉ` | `お` | `か` | `き` | `く` | `け` | `こ` | `さ` |
| `90` | `し` | `す` | `せ` | `そ` | `た` | `ち` | `っ` | `つ` |
| `98` | `て` | `と` | `な` | `に` | `ぬ` | `ね` | `の` | `は` |
| `A0` | `ひ` | `ふ` | `へ` | `ほ` | `ま` | `み` | `む` | `め` |
| `A8` | `も` | `ゃ` | `や` | `ゅ` | `ゆ` | `ょ` | `よ` | `ら` |
| `B0` | `り` | `る` | `れ` | `ろ` | `ゎ` | `わ` | `を` | `ん` |
| `B8` | `→` | `←` | `↑` | `↓` | `•` | ` ` | ` ` | ` ` |
| `C0` | `ァ` | `ア` | `ィ` | `イ` | `ゥ` | `ウ` | `ェ` | `エ` |
| `C8` | `ォ` | `オ` | `カ` | `キ` | `ク` | `ケ` | `コ` | `サ` |
| `D0` | `シ` | `ス` | `セ` | `ン` | `タ` | `チ` | `ッ` | `ツ` |
| `D8` | `テ` | `ト` | `ナ` | `ニ` | `ヌ` | `ネ` | `ノ` | `ハ` |
| `E0` | `ヒ` | `フ` | `ヘ` | `ホ` | `マ` | `ミ` | `ム` | `メ` |
| `E8` | `モ` | `ャ` | `ヤ` | `ュ` | `ユ` | `ョ` | `ヨ` | `ラ` |
| `F0` | `リ` | `ル` | `レ` | `ロ` | `ヮ` | `ワ` | `ヲ` | `ン` |
| `F8` | `☎` | `♪` | `☺` | `☺` | `★` | `❤` | `゛` | `゜` |

### Title
This game has a rather bizarre title. In the logo, "Net de Get" (which roughly
translates as "Get by the Net") appears as a sort of starburst next to "Minigame
@100"; the manual refers to the game as "Net de Get Minigame @100"; and upon
starting a new save file, the player is introduced to simply "Minigame @100".

The "Minigame @100" part is somewhat difficult to parse in its own right: it is
unclear whether "Minigame" is meant to be plural (due to the Japanese language
lacking noun number in most cases), and the meaning of the `@` sign is
ambiguous, possibly referring to the price of each DLC minigame, or the intended
_number_ of DLC minigames (or, for that matter, the intended number of DLC and
built-in minigames _combined_; in either case, the goal was never reached).
