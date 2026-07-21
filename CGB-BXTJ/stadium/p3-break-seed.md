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
 first; `E` for P1, or `F` for P1's opponent._

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
| No Quick Claw |      N/A      |    `FF 00 Fp 80`    |    `FF 00`    |
| First has QC  | `FF 00 FE 3C` |       `F0 0p`       | `FF 00 FF 00` |
| Second has QC |      N/A      | `FF 00 FF 3C Fp 80` | `FF 00 FF 3C` |
| Both have QC  |    `F1 0p`    |       `F2 0p`       |    `F3 0p`    |

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
- Add 1 if the user is under the effect of Focus Energy or a Dire Hit.
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
move misses) should appear, where `uu` is the effective accuracy value. For
moves that miss anyway (Ghost vs. Normal, attacks during Dig/Fly, etc.), this is
unobservable &amp; a record of `FF 00` should appear here, _but not if the
effective accuracy value is 255 or higher_.

For a select few moves, the accuracy check is performed before the critical hit
check (but regardless of the result of the former, the latter &amp; the damage
variation check are still performed). These are:
- Doubleslap
- Comet Punch
- Bind
- Fury Attack
- Wrap
- Thrash
- Twineedle
- Pin Missile
- Petal Dance
- Fire Spin
- Clamp
- Spike Cannon
- Barrage
- Fury Swipes
- Triple Kick
- Bone Rush
- Outrage
- Present
- Whirlpool
- Beat Up
(Note that this includes every single-turn attack that strikes multiple times.)

For even fewer moves, the accuracy check is performed _in between_ the critical
hit &amp; damage variation checks. These are:
- Thunder
- Rage
- Rollout
- Fury Cutter

### Special effects
If the move has a chance of performing a special effect (stat changes, status
effects, etc.) after dealing damage, then after the accuracy check (but even if
it fails), a random value is compared against the effect probability to
determine whether the effect occurs. If the move misses, this value is
unobservable &amp; a record of `FF 00` should appear. Otherwise, a record of
`FE qq` (if the effect occurs) or `FF qq` (otherwise) should appear, where `qq`
is the effect probability. There is one main exception, as well as many moves
with special effects (guaranteed or no) which themselves have random elements:

#### Defense-decreasing moves
Due to a bug, the game actually generates a second random value to compare
against the effect probability, overriding the first, but only if the move
hits; this renders the first value completely unobservable in either case.

#### Tri Attack
Here, the effect chance is _only_ calculated if the move hits, and is followed
by another random value to decide which status effect to inflict, _even if the
effect chance fails_ (in which case a record of `9D 00` should appear). If a
status effect is inflicted, a record of:
- `9D 10` should appear for paralysis.
- `9D 20` should appear for a freeze.
- `9D 30` should appear for a burn.

#### ...more to follow...
TODO

### Focus Band
When actually dealing damage, if the target of the attack is holding a Focus
Band &amp; has not used Endure this turn, a random value is generated to decide
whether the Focus Band should take effect (even if the used move is False
Swipe). In most cases, this is unobservable &amp; a record of `FF 00` should
appear here. However, if the move causes its target to faint, then the Focus
Band did not activate, and a record of `FF 1E` should appear. Conversely, if
the move should have caused its target to faint but didn't, then the Focus Band
did activate, and a record of `FE 1E` should appear.

## Notes

### Damage calculation
_This calculation associates strictly left-to-right, and all intermediate values
 are truncated down to the nearest integer._
```
((2*LVL/5+2)*POW*ATK/DEF/50*ITM*CRT+2)*TRK*WTH*STB*EFF*MOD*RNG/255*DBL
```
Where:
- LVL is the attacking Pokémon's level.
- POW is the move's effective power.
- ATK is the attacking Pokémon's attack stat.
- DEF is the opposing Pokémon's defense stat.
- ITM is 1.1 if the attacking Pokémon is holding an item to enhance moves of the
  relevant type, or 1.0 otherwise.
- CRT is 2 for a critical hit, or 1 otherwise.
- TRK is 3 for the third strike of Triple Kick, 2 for the second, or 1
  otherwise.
- WTH is 1.5 if the current weather enhances the move, 0.5 if it weakens it, or
  1.0 otherwise.
- STB is 1.5 if the attacking Pokémon is of the move's type, or 1.0 otherwise.
- EFF is the type effectiveness: 0.00, 0.25, 0.50, 1.00, 2.00, or 4.00.
- MOD is normally 1, but:
  - For Rollout, MOD might start at 2 if preceded by Defense Curl.
  - For Rollout &amp; Fury Cutter, MOD doubles with each consecutive use of the
    same move.
  - For Rage, MOD is simply equal to the Rage counter.
- RNG is a random number in the range 217-255 (inclusive).
- DBL is normally 1, but:
  - For Pursuit, DBL is 2 if the opposing Pokémon switches out in the same turn
    (in which case the pre-switch Pokémon takes the damage).
  - For Stomp, DBL is 2 if the opposing Pokémon is minimised.
  - For Gust &amp; Twister, DBL is 2 if the opposing Pokémon is in the air.
  - For Earthquake &amp; Magnitude, DBL is 2 if the opposing Pokémon is
    underground.
