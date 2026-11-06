# `index.cgb`
This is a very simple line-based text file. Its purpose is to direct the game
to the track-specific ranking and upload files.

## File format
As mentioned above, this file is line-based. It may be in either DOS/Windows or
Unix format.

| Line(s) | Description    |
|---------|----------------|
| 1-4     | Mushroom Cup.  |
| 5-8     | Flower Cup.    |
| 9-12    | Lightning Cup. |
| 13-16   | Star Cup.      |
| 17-20   | Special Cup.   |
| 21      | Mobile GP.     |

## Notes
- As the filenames that are appended to these strings do not begin with slashes,
  each line of `index.cgb` should end with a slash to prevent issues with
  authenticated files.
- The game has code to use lines 22-24 of `index.cgb` for alternate Mobile GP
  files, but this code goes unused and the game always uses line 21.
