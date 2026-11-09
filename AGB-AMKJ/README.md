# Mario Kart Advance
_Released in the west as "Mario Kart: Super Circuit"._

This game released on 2001-07-21 in Japan, 2001-08-26 in North America,
2001-09-13 in Australia, and 2001-09-14 in Europe. It is a go-kart racing game
with Mario characters as the drivers. Its mobile features (only in the Japanese
version) mainly relate to its time trial mode, allowing players to upload their
ghost data and download that of other players, as well as participate in "Mobile
GP" challenges set by the server operators from time to time.

## URL list
This game uses only two complete URLs (see the corresponding `.md` files for
info on each):
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/01/AGB-AMKJ/index.cgb`
- `http://gameboy.datacenter.ne.jp/cgb/download?name=/01/AGB-AMKJ/rule.cgb`

Most URLs are formed by concatenating the base URL
`http://gameboy.datacenter.ne.jp/cgb/ranking?name=/01/AGB-AMKJ/`, a line from
`index.cgb` corresponding to the relevant track or Mobile GP (see `index.cgb.md`
for info), and one of the following filenames (see the corresponding `.md` files
for info on each):
- `total.cgb`
- `query.cgb`
- `0.dlghost.cgb`
- `0.dlghost2.cgb`
- `0.dlghost3.cgb`
- `0.dlghostdr.cgb`
- `0.dlghostst.cgb`

Of the above, only `total.cgb` and `query.cgb` are used for Mobile GP.

The upload URL for a given track or Mobile GP is formed by concatenating the
base URL `http://gameboy.datacenter.ne.jp/cgb/upload?name=/01/AGB-AMKJ`, the
line from `index.cgb` corresponding to said track or Mobile GP (see
`index.cgb.md` for info), and the filename `0.entry.cgb`. See `0.entry.cgb.md`
for info.

Finally, Mobile GP "ticket" files may have any filename, which is appended to
`http://gameboy.datacenter.ne.jp/cgb/download?name=/01/AGB-AMKJ/`, although the
filename must be 20 bytes or shorter, and should begin with an ASCII number and
period (that is, require authentication) so that the service charge (if any)
appears correctly in-game. They have no content.

## Timestamp
| Offset(s) | Description      |
|-----------|------------------|
| 0x0-0x1   | Big-endian year. |
| 0x2       | Month (1-12).    |
| 0x3       | Day (1-31).      |
| 0x4       | Hour (0-23).     |
| 0x5       | Minute (0-59).   |

## Common enums
### Driver ID
0. Mario
1. Luigi
2. Peach
3. Toad
4. Yoshi
5. DK
6. Wario
7. Bowser

## Notes
### Kart IDs
When first connecting to the server, the game generates a "Kart ID" based on
the player's identity and the current date/time. The Kart ID is a 16-byte value
that is often transmitted over the network, either raw or as ASCII hex. Note
also that a Kart ID of all zeroes will never be generated and cannot be used to
download a ghost.

### Character set
This game uses single-byte codepoints in order to display characters, and uses
these same codepoints in most of the strings it transmits and receives over the
network. However, the strings for the messages in the mobile menu are stored,
and Mobile GP descriptions received, in Shift JIS with only two-byte characters.
- `00` is internally `危` (which translates as "danger"), but really any
  unrecognised Shift JIS byte-pair (including those in which the first byte is
  a character unto itself) will become `00`; strings in the ROM (where `00`
  terminates a string) use `00 00`, whereas Mobile GP descriptions (where `00`
  breaks a line) should use `0D 0A` (that is, a DOS-/Windows-style line ending).
- `01`-`5D` are the fullwidth forms of JIS `21`-`7D`, respectively.
- `58`-`AF` are as follows:

| `0x`	 | +0	 | +1	 | +2	 | +3	 | +4	 | +5	 | +6	 | +7	 |
|--------|-------|-------|-------|-------|-------|-------|-------|-------|
| `58`	 | `ｘ`	 | `ｙ`	 | `ｚ`	 | `｛`	 | `｜`	 | `｝`	 | `～`	 | `　`	 |
| `60`	 | `ぁ`	 | `あ`	 | `ぃ`	 | `い`	 | `ぅ`	 | `う`	 | `ぇ`	 | `え`	 |
| `68`	 | `ぉ`	 | `お`	 | `か`	 | `が`	 | `き`	 | `ぎ`	 | `く`	 | `ぐ`	 |
| `70`	 | `け`	 | `げ`	 | `こ`	 | `ご`	 | `さ`	 | `ざ`	 | `し`	 | `じ`	 |
| `78`	 | `す`	 | `ず`	 | `せ`	 | `ぜ`	 | `そ`	 | `ぞ`	 | `た`	 | `だ`	 |
| `80`	 | `ち`	 | `ぢ`	 | `っ`	 | `つ`	 | `づ`	 | `て`	 | `で`	 | `と`	 |
| `88`	 | `ど`	 | `な`	 | `に`	 | `ぬ`	 | `ね`	 | `の`	 | `は`	 | `ば`	 |
| `90`	 | `ぱ`	 | `ひ`	 | `び`	 | `ぴ`	 | `ふ`	 | `ぶ`	 | `ぷ`	 | `へ`	 |
| `98`	 | `べ`	 | `ぺ`	 | `ほ`	 | `ぼ`	 | `ぽ`	 | `ま`	 | `み`	 | `む`	 |
| `A0`	 | `め`	 | `も`	 | `ゃ`	 | `や`	 | `ゅ`	 | `ゆ`	 | `ょ`	 | `よ`	 |
| `A8`	 | `ら`	 | `り`	 | `る`	 | `れ`	 | `ろ`	 | `わ`	 | `を`	 | `ん`	 |

- `B0`-`FF` are the fullwidth katakana equivalents of `60`-`AF`, respectively.
