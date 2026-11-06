# EX Monopoly
This game released only in Japan, on 2001-07-13. It is a role-playing game in
which the player character plays Monopoly games all across Monopoly Island in
order to reach Monopoly Castle. However, its mobile features have nothing to do
with its main gameplay; instead, players play sets of three games and compete
for the highest score every month.

## URL list
This game uses the following URLs (see the corresponding `.md` files in this
directory for info on each):
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/A7/AGB-AMOJ/information.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/upload?name=/A7/AGB-AMOJ/0.regist.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/ranking?name=/A7/AGB-AMOJ/10.temporary.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/ranking?name=/A7/AGB-AMOJ/query_T.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/ranking?name=/A7/AGB-AMOJ/query_M.cgb`

## Common structure formats
### `myname`
| Offset(s) | Description             |
|-----------|-------------------------|
| 0x00-0x03 | Player's name.          |
| 0x04-0x23 | Player's email address. |
| 0x24      | `today`.                |
| 0x25-0x27 | Zero (0).               |

### `myscore`
| Offsets | Description                       |
|---------|-----------------------------------|
| 0x0-0x3 | Big-endian total score.           |
| 0x4-0x7 | Big-endian total cash in dollars. |

### `today`
| Bits | Description   |
|------|---------------|
| 0x0F | Month (1-12). |
| 0xF0 | Year, mod 16. |

## Character set
This game's strings are byte-oriented, with the following character set:

| `0x`	 | +0	 | +1	 | +2	 | +3	 | +4	 | +5	 | +6	 | +7	 |
|--------|-------|-------|-------|-------|-------|-------|-------|-------|
| `00`	 | `あ`	 | `い`	 | `う`	 | `え`	 | `お`	 | `か`	 | `き`	 | `く`	 |
| `08`	 | `け`	 | `こ`	 | `さ`	 | `し`	 | `す`	 | `せ`	 | `そ`	 | `た`	 |
| `10`	 | `ち`	 | `つ`	 | `て`	 | `と`	 | `な`	 | `に`	 | `ぬ`	 | `ね`	 |
| `18`	 | `の`	 | `は`	 | `ひ`	 | `ふ`	 | `へ`	 | `ほ`	 | `ま`	 | `み`	 |
| `20`	 | `む`	 | `め`	 | `も`	 | `や`	 | `ゆ`	 | `よ`	 | `ら`	 | `り`	 |
| `28`	 | `る`	 | `れ`	 | `ろ`	 | `わ`	 | `を`	 | `ん`	 | `ゃ`	 | `ゅ`	 |
| `30`	 | `ょ`	 | `。`	 | `、`	 | `が`	 | `ぎ`	 | `ぐ`	 | `げ`	 | `ご`	 |
| `38`	 | `ざ`	 | `じ`	 | `ず`	 | `ぜ`	 | `ぞ`	 | `だ`	 | `ぢ`	 | `づ`	 |
| `40`	 | `で`	 | `ど`	 | `ば`	 | `び`	 | `ぶ`	 | `べ`	 | `ぼ`	 | `ぱ`	 |
| `48`	 | `ぴ`	 | `ぷ`	 | `ぺ`	 | `ぽ`	 | `ア`	 | `イ`	 | `ウ`	 | `エ`	 |
| `50`	 | `オ`	 | `カ`	 | `キ`	 | `ク`	 | `ケ`	 | `コ`	 | `サ`	 | `シ`	 |
| `58`	 | `ス`	 | `セ`	 | `ソ`	 | `タ`	 | `チ`	 | `ツ`	 | `テ`	 | `ト`	 |
| `60`	 | `ナ`	 | `ニ`	 | `ヌ`	 | `ネ`	 | `ノ`	 | `ハ`	 | `ヒ`	 | `フ`	 |
| `68`	 | `ヘ`	 | `ホ`	 | `マ`	 | `ミ`	 | `ム`	 | `メ`	 | `モ`	 | `ヤ`	 |
| `70`	 | `ユ`	 | `ヨ`	 | `ラ`	 | `リ`	 | `ル`	 | `レ`	 | `ロ`	 | `ワ`	 |
| `78`	 | `ヲ`	 | `ン`	 | `ャ`	 | `ュ`	 | `ョ`	 | `ー`	 | `！`	 | `ガ`	 |
| `80`	 | `ギ`	 | `グ`	 | `ゲ`	 | `ゴ`	 | `ザ`	 | `ジ`	 | `ズ`	 | `ゼ`	 |
| `88`	 | `ゾ`	 | `ダ`	 | `ヂ`	 | `ヅ`	 | `デ`	 | `ド`	 | `バ`	 | `ビ`	 |
| `90`	 | `ブ`	 | `ベ`	 | `ボ`	 | `パ`	 | `ピ`	 | `プ`	 | `ペ`	 | `ポ`	 |
| `98`	 | `＄`	 | `０`	 | `１`	 | `２`	 | `３`	 | `４`	 | `５`	 | `６`	 |
| `A0`	 | `７`	 | `８`	 | `９`	 | `　`	 | `ァ`	 | `ィ`	 | `ゥ`	 | `ェ`	 |
| `A8`	 | `ォ`	 | `ッ`	 | `？`	 | `ヴ`	 | `っ`	 | `家`	 | `軒`	 | `抵`	 |
| `B0`	 | `当`	 | `価`	 | `格`	 | `建`	 | `設`	 | `水`	 | `道`	 | `費`	 |
| `B8`	 | `抖`	 | `鉄`	 | `会`	 | `社`	 | `電`	 | `力`	 | `地`	 | `中`	 |
| `C0`	 | `海`	 | `公`	 | `井`	 | `通`	 | `ぁ`	 | `ぃ`	 | `ぅ`	 | `ぇ`	 |
| `C8`	 | `ぉ`	 | `゛`	 | `゜`	 | `枚`	 | `倍`	 | `Ａ`	 | `Ｂ`	 | `Ｃ`	 |
| `D0`	 | `Ｄ`	 | `Ｅ`	 | `Ｆ`	 | `Ｇ`	 | `Ｈ`	 | `Ｉ`	 | `Ｊ`	 | `Ｋ`	 |
| `D8`	 | `Ｌ`	 | `Ｍ`	 | `Ｎ`	 | `Ｏ`	 | `Ｐ`	 | `Ｑ`	 | `Ｒ`	 | `Ｓ`	 |
| `E0`	 | `Ｔ`	 | `Ｕ`	 | `Ｖ`	 | `Ｗ`	 | `Ｘ`	 | `Ｙ`	 | `Ｚ`	 | `％`	 |
| `E8`	 | `：`	 | `⋯`	 | `♪`	 | `♥︎`	 | `～`	 | `男`	 | `女`	 | `位`	 |
| `F0`	 | `才`	 | `入`	 | `口`	 | `交`	 | `渉`	 |  	 |  	 |  	 |

- `F1`-`FD` are skipped when printing text.
- `FE` breaks a line.
- `FF` terminates a string.
