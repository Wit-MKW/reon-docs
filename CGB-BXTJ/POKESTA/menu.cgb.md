# `menu.cgb`
This file specifies the weekly schedule of Mobile Stadium distributions. It also
contains an identifier for each distribution file, to prevent the player from
accidentally downloading the same file twice in a row.

## File format
The format of `menu.cgb` is simply a one-byte entry count followed by
variable-length entries, each in the following format (with all days &amp;
times in UTC):
- 2 bytes: day specifications
 - If these bytes are both in the range 0-6 (inclusive), they are taken as a
   range of days (where 0 represents Monday and 6 represents Sunday); this
   distribution runs every week from the starting day/time through the ending
   day/time.
 - If these bytes are both 0xFF, this distribution runs every day, from the
   starting time through the ending time.
- 2 bytes: starting time specification (hour, minute)
- 2 bytes: ending time specification (hour, minute)
 - Similar to the day specifications, if the hour specifications are both 0xFF,
   the distribution runs every hour, from the starting minute through the ending
   minute; if the minute specifications are both 0xFF, the distribution runs for
   the entirety of the specified hour(s).
- 16 bytes: file ID
 - This appears at offsets 0xFEA-0xFF9 of the distribution file.
- 2 bytes: ASCII `P3` to enable checksum comparison
 - This appears at offsets 0xFFA-0xFFB of the distribution file. There,
   disabling checksum comparison causes Pokémon Stadium 2 to ignore the file
   entirely.
- 2 bytes: little-endian checksum
 - This is a simple sum of each byte at offsets 0x000-0xFFB of the distribution
   file.
 - This appears at offsets 0xFFC-0xFFD of the distribution file.
- 2 bytes: little-endian URL length (N)
 - This must be 165 or less.
- N bytes: URL to distribution file
 - This must be a full URL. It should not be null-terminated.

## Distribution selection
When scanning `menu.cgb`, Pokémon Crystal selects the first entry whose
distribution is currently running (according to the `Date` header in the HTTP
response) and where either:
- the file ID does not match that of the last-downloaded distribution, or
- checksum comparison is enabled and the checksum does not match that of the
  last-downloaded distribution.
 - Pokémon Crystal calculates the latter checksum itself, rather than using the
   value at 0xFFC-0xFFD.

If the selected file ID matches that of the last-downloaded distribution, the
player receives a warning to that effect; otherwise, they are prompted to
download new data.
