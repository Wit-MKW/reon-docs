# Exciting Bass
_Released in North America as "ESPN Great Outdoor Games: Bass 2002", and in
 Europe as "ESPN Great Outdoor Games: Bass Tournament"._

This game released on 2001-11-29 in North America, 2001-12-20 in Japan, and
2002-02-15 in Europe. As its title suggests, it is a bass fishing simulator in
which the player can participate in tournaments against computer players. Using
the game's mobile features (only in the Japanese version), the player can upload
their best score and see how they match against other players.

## URL list
This game uses only one full URL, namely
`http://gameboy.datacenter.ne.jp/cgb/download?name=/A4/AGB-AMGJ/index.txt` (see
`index.txt.md` in this directory for info); all other URLs are taken directly
from lines of `index.txt`.

## Profile structure
| Offset(s) | Description                       |
|-----------|-----------------------------------|
| 0x00-0x0F | NUL-padded nickname.              |
| 0x10      | Blood type (0=A, 1=O, 2=B, 3=AB). |
| 0x11      | Gender (0=M, 1=F).                |
| 0x12      | Age in years.                     |
| 0x13-0x16 | Score in units of 1/4096 gram.    |

## Character set
This game's strings are encoded in Shift JIS. Only two-byte characters should be
used (the game will not align its columns properly if any of them contain
one-byte characters). Specifically, supported characters are the fullwidth
equivalent of each JIS X 0201 character (except `‾`), along with all hiragana,
`〜`, and `▽`.
