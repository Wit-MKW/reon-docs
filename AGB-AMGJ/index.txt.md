# `index.txt`
This file is very basic; it only directs the game to the other three URLs.

## File format
This is an ASCII text file containing three lines, each a full URL:
1. Upload data (see `upload.md` in this directory).
  - Should be under `http://gameboy.datacenter.ne.jp/cgb/upload`.
  - Should have a cost of 10 yen.
  - Must not be longer than upload URL #1.
2. Ranking data (see `ranking.md` in this directory).
  - Should be under `http://gameboy.datacenter.ne.jp/cgb/ranking`.
  - Should not be authenticated.
3. Rank-check URL (see `check.md` in this directory).
  - Should be under `http://gameboy.datacenter.ne.jp/cgb/upload`.
  - Must not be authenticated.
  - Must not be shorter than upload URL #2.

## Notes
None of these URLs may be in `/cgb/` namespaces other than those specified
(including `/cgb/download` and `/cgb/utility`), but they may be outside of
`/cgb/` altogether, or even on another server.
