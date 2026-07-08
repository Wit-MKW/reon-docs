# `p3-break-seed`

This program can be used to brute-force the value used to seed the PRNG at the
start of a battle in Pokémon Stadium 2 (Pokémon Stadium GS in Japan).

## Script file format

The exact bytes output by the PRNG cannot be directly obtained just by viewing
the battle (or a replay thereof). Therefore, this program uses a _script file_,
which simply defines the properties of those bytes which _can_ be observed
through viewing alone.

The format of this file is binary (rather than text-based), with records usually
spanning two bytes, although one of the more common record types will instead
span three bytes, and a rarer one (used only for the move Metronome) spans five.

### Turn order
_Throughout this section, `p` is used to indicate which player's Pokémon acts
 first; `0` for P1, or `1` for P1's opponent._

At the beginning of a turn, the game must decide which Pokémon will act first.
If one Pokémon switches out while the other attacks, or both Pokémon use moves
with different priority levels, the turn order is fixed &amp; the PRNG is not
involved. If both Pokémon switch out, a random byte is used to determine which
one is shown switching out first; the script record appears as `FD Ep`.

If, however, both Pokémon use moves of the same priority level, then the PRNG is
invoked to decide which one acts first (even if the result has no meaningful
effect). The script record(s) for this appear as follows:
| x             | Slower first  |     Equal speed     | Faster first  |
|---------------|:-------------:|:-------------------:|:-------------:|
| No Quick Claw |      N/A      |    `FF 00 Fs 80`    |    `FF 00`    |
| First has QC  | `FF 00 FE 3C` |       `F0 0p`       | `FF 00 FF 00` |
| Second has QC |      N/A      | `FF 00 FF 3C Fs 80` | `FF 00 FF 3C` |
| Both have QC  |    `F1 0p`    |       `F2 0p`       |    `F3 0p`    |
`s`: `E` if P1's Pokémon acts first, `F` otherwise.

### Pre-move actions
Certain status conditions can prevent a Pokémon ordered to move from doing so:
1. If the Pokémon is confused, it has a chance of taking confusion damage. If it
   does, a record of `FE 80` appears &amp; the turn ends here; otherwise, a
   record of `FF 80` appears &amp; the turn continues to (2).
2. If the Pokémon is infatuated, it has a chance of not attacking. If it does
   not attack, a record of `FF 80` appears &amp; the turn ends here; otherwise,
   a record of `FE 80` appears &amp; the turn continues to (3). _Note that the
   record types (`FE`/`FF`) are swapped!_
3. If the Pokémon is paralysed, it has a chance of full paralysis. If this
   occurs, a record of `FE 3C` appears &amp; the turn ends here; otherwise, a
   record of `FF 3C` appears &amp; the turn continues as normal.

### Critical hit
For all moves that deal damage except for Flail, Future Sight, and Reversal,
the first calculation done as part of the move itself is whether it should
score a critical hit. (For missed moves, this is not observable; then a record
of `FF 00` should appear here.) This involves calculating the critical hit
ratio. For moves performed by Farfetch'd or Chansey, the critical hit ratio is
`11` normally, or `40` if the Pokémon is holding a Stick or Lucky Punch
(respectively). For all others, it is chosen as follows:
- Start with 1, or 3 for the following moves:
  - Karate Chop
  - Razor Wind
  - Razor Leaf
  - Crabhammer
  - Slash
  - Aeroblast
  - Cross Chop
- Add 1 if the user is under the effect of Focus Energy or that of a Dire Hit.
- Add 1 if the user is holding a Razor Claw or Scope Lens.
- Find the resulting number in the list:
  1. `11`
  2. `20`
  3. `40`
  4. `55`
  5. `80`

Then a record of `FE rr` (if the move scored a critical hit) or `FF rr`
(otherwise) should appear, where `rr` is the critical hit ratio.

### Damage variation
Next, if the calculated damage before the random factor (see notes) is 2 or
more, the random factor itself is calculated. (Again, if the move misses, this
is unobservable, and a record of `06 00 FF` should appear.) Here, a record of
`06 xx yy` appears, where `xx` is the minimum value, and `yy` the maximum, for
the random factor (217-255). `xx` values less than `D9` (217) are permissible,
but will have the same effect as specifying `D9`.

### Accuracy
As the final random factor in most moves, if the move's effective accuracy value
is less than 255, a random value is compared against it to decide whether the
move should hit. Here, a record of `FE uu` (if the move hits) or `FF uu` (if the
move misses) should appear, where `uu` is the effective accuracy value.

### Focus Band
When actually dealing damage, if the target of the attack is holding a Focus
Band &amp; has not used Endure this turn, a random value is generated to decide
whether the Focus Band should take effect (even if the used move is False
Swipe). In most cases, this is unobservable &amp; a record of `FF 00` should
appear here. However, if the move causes its target to faint, then the Focus
Band did not activate, and a record of `FF 1E` should appear. Conversely, if
the move should have caused its target to faint but didn't, then the Focus Band
did activate, and a record of `FE 1E` should appear.
