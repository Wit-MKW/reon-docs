# Error codes
When an error occurs while using the mobile adapter (either with the adapter
itself or with the server), the library used to do so reports said error to the
main software using an error code. With very few exceptions, the software's
response is to abort the operation in question and present the error code to the
user, often with a message vaguely hinting at what said code means.

Internally, each error code is represented by an 8-bit _main code_ and a 16-bit
_detail code_. With the exception of a few game-specific error codes, these
codes are shown to the user in the format `MM-SSS`, where `MM` is the
hexadecimal representation of the main code and `SSS` is that of the _low 12
bits_ of the detail code.

Each digit of these hexadecimal representations is always 9 or less, so they can
be seen as BCD instead of hexadecimal. Additionally, the high 4 bits of the
detail code are always zero, so hiding them from the user is acceptable.

## List of codes
For most main codes, the detail code is irrelevant, and in fact a non-zero
detail code is indicative of a separate error and may cause a generic error
message to appear rather than the intended one.

| Main | Meaning                                                              |
|------|----------------------------------------------------------------------|
| `00` | An odd return value from the library was misinterpreted as an error. |
| `10` | The mobile adapter was not detected.                                 |
| `11` | Failed to place a phone call (incl. connecting to the ISP).          |
| `12` | The phone line is busy.                                              |
| `13` | Failed to open a required connection.                                |
| `14` | The mobile adapter's EEPROM is corrupted or unreadable.              |
| `16` | The mobile adapter failed to execute a command.                      |
| `17` | The mobile adapter could not parse the parameters to a command.      |
| `20` | A library function was called with illegal arguments.                |
| `21` | A library function was called from an illegal state.                 |
| `22` | Failed to log in with the ISP.                                       |
| `23` | The phone line was hung up.                                          |
| `24` | A DNS or TCP error occurred.                                         |
| `25` | The mobile adapter's EEPROM does not contain registration info.      |
| `26` | The mobile adapter took too long to respond to a command.            |

### Main code `15`
Main code `15` indicates an error in the protocol between the console and the
mobile adapter; the detail code specifies the type of error. In the GBA library,
each is internally represented with a high-numbered main code.

| Main | Detail | Meaning                                                   |
|------|--------|-----------------------------------------------------------|
| `83` | `000`  | A command code sent to the mobile adapter does not exist. |
| `84` | `001`  | A bad error-check code was sent to the mobile adapter.    |
| `87` | `002`  | _Cannot occur legitimately._                              |
| `85` | `003`  | An internal error occurred when processing a command.     |

### Main code `30`
Main code `30` indicates an SMTP error; that is, an error while sending an
email. The detail code is simply the three-digit SMTP response code, or `000`
if the former is invalid/unavailable. The following response codes are
recognised in some fashion:

| Detail | Meaning                               |
|--------|---------------------------------------|
| `000`* | No response code.                     |
| `220`  | Service ready.                        |
| `221`  | Service closing/Goodbye.              |
| `250`  | Mail action completed.                |
| `354`  | Start mail input.                     |
| `421`  | Service not available.                |
| `450`  | Mailbox unavailable (transient).      |
| `451`  | Local error in processing.            |
| `452`  | Insufficient system storage.          |
| `500`  | Command unrecognized.                 |
| `501`  | Syntax error in parameters.           |
| `502`  | Command not implemented.              |
| `503`  | Bad sequence of commands.             |
| `504`  | Command parameter is not implemented. |
| `550`  | Mailbox unavailable (permanent).      |
| `551`  | User not local.                       |
| `552`  | Exceeded storage allocation.          |
| `553`  | Mailbox name not allowed.             |
| `554`  | Transaction has failed.               |

* In earlier versions of the library, an error while disconnecting from the SMTP
  server will produce an error code of `31-000`, not `30-000`.

### Main code `31`
Main code `31` indicates a POP3 error; that is, an error while receiving email;
the detail code specifies the stage at which the error occurred.

| Detail | Meaning                                                            |
|--------|--------------------------------------------------------------------|
| `000`* | Invalid response, or error response to first connection or `STAT`. |
| `002`  | Error response to `USER`: no such user.                            |
| `003`  | Error response to `PASS`: incorrect password.                      |
| `004`  | Error response to any other command: no such message.              |

* In earlier versions of the library, only the first byte of each POP3 response
  is checked; any character other than `+` is treated as an error response,
  except for `RETR` and `HEAD`, where only `-` is treated as an error response
  and any other character is treated as an OK response.

### Main code `32`
Main code `32` indicates an HTTP error; that is, an error while uploading or
downloading content. The detail code is simply the three-digit HTTP response
code, or `000` if the former is invalid/unavailable. The following response
codes are recognised in some fashion:

| Detail | Meaning                        |
|--------|--------------------------------|
| `000`  | No response code.              |
| `200`* | OK.                            |
| `300`* | Multiple choices.              |
| `301`  | Moved permanently.             |
| `302`  | Found.                         |
| `400`  | Bad request.                   |
| `401`  | Unauthorized.                  |
| `403`  | Forbidden.                     |
| `404`  | Not found.                     |
| `405`  | Method not allowed.            |
| `406`  | Not acceptable.                |
| `407`  | Proxy authentication required. |
| `408`  | Request timeout.               |
| `500`  | Internal server error.         |
| `501`  | Not implemented.               |
| `502`  | Bad gateway.                   |
| `503`  | Service unavailable.           |
| `504`  | Gateway timeout.               |

* `200` is the expected response code in most cases, and if it is received
  unexpectedly, the error code will be `32-000`; in other words, error `32-200`
  cannot occur legitimately.
* `300` is recognised only by Mobile Trainer, and quite possibly as a mistake;
  it does not appear in the Mobile Trainer manual, and error `32-300` is
  displayed as `32-XXX` in certain games (see below).

### Main code `33`
Main code `33` indicates a mobile-center error; that is, a `Gb-Status` HTTP
response header. The detail code is simply the three-digit header value. The
following values are recognised in some fashion:

| Detail | Meaning                                                          |
|--------|------------------------------------------------------------------|
| `000`* | Invalid value.                                                   |
| `101`* | Outstanding subscription fee.                                    |
| `102`* | Outstanding content charge.                                      |
| `103`  | Excessive content charges this month (over ¥10K).                |
| `104`  | Content discontinued.                                            |
| `105`  | Content not available yet.                                       |
| `106`  | Content under maintenance.                                       |
| `201`  | Account not registered yet.                                      |
| `202`  | Communication error. Not listed in Mobile Trainer manual.        |
| `203`  | Content temporarily unavailable.                                 |
| `204`  | Communication error. Not listed in Mobile Trainer manual.        |
| `205`  | Server communication error.                                      |
| `206`  | Content temporarily unavailable.                                 |
| `299`  | Content unavailable due to request.                              |
| `301`  | Server communication error.                                      |
| `401`  | Server communication error.                                      |
| `402`  | Server communication error.                                      |
| `403`  | Server communication error.                                      |
| `404`  | Server communication error.                                      |
| `405`  | Server communication error. Not listed in Mobile Trainer manual. |
| `406`  | Server communication error. Not listed in Mobile Trainer manual. |

* If the value is invalid or `000`, no error occurs; in other words, error
  `33-000` cannot occur legitimately.
* Only if the value is `101`, the response content is allowed to be received,
  and an error only occurs afterwards. Perhaps the content may have contained
  a message for the game to display, but in practice games display a static
  message like for any other error, and the response content goes unused.
* Every game uses the same message for errors `33-102` and `33-299`, but the
  Mobile Trainer manual has this entirely unique description for the former.

## Obscured error codes
In two games (Monster Guardians and EX Monopoly), the error code is a part of
the error message itself; therefore, unrecognised error codes are partially or
entirely obscured:
- Main codes `30` through `33`, inclusive, with unrecognised detail codes
  (including `32-200`, `32-300` and `33-000`; see above) are displayed as if
  the latter were `XXX`.
- All other unrecognised codes (including main code `00`) are displayed as
  `XX-XXX`.

Yu-Gi-Oh Duel Monsters 5 Expert 1 contains unfinished, unused mobile
functionality, including complete error handling that obscures unrecognised
codes in a similar way, but with key differences:
- Main codes `30` through `33`, inclusive, are displayed as before.
- Main code `15` with an unrecognised detail code, as well as all unrecognised
  main codes (again including `00`), have no message at all, and therefore no
  error code is displayed.
- All other recognised main codes are always displayed with a detail code of
  `000`.

## Game-specific codes
In three games (Pokémon Crystal, Mobile Trainer, and JGTO Kounin Golf Master
Mobile), when a non-library error occurs in a mobile adapter-related operation,
the software will produce an error code in place of one of the library error
codes discussed above. These errors are displayed using the same screen layout
as library error codes, but invariably in a different format.

### Pokémon Crystal
Pokémon Crystal-specific errors have main codes of `D0` through `DA` inclusive,
and are displayed as `101-001` through `101-011` inclusive, respectively.

Six of these are related to the game's peer-to-peer functionality:

| Main | Detail | Meaning                                                 |
|------|--------|---------------------------------------------------------|
| `D0` | `001`  | Incorrect checksum in received packet.                  |
| `D1` | `002`  | Incorrect sync byte in received packet.                 |
| `D2` | `003`  | Invalid room selection(s).                              |
| `D5` | `006`  | Mismatched adapter types (metered/unmetered) in battle. |
| `D6` | `007`  | Over 3 minutes of inactivity in battle.                 |
| `D7` | `008`  | Over 10 minutes of inactivity in trade.                 |

The remaining five are mostly related to data received from the server:

| Main | Detail | Meaning                                                |
|------|--------|--------------------------------------------------------|
| `D3` | `004`  | Invalid data.                                          |
| `D4` | `005`  | Invalid Battle Tower room no.                          |
| `D8` | `009`  | No Stadium distribution found, or its URL is too long. |
| `D9` | `010`* | _Cannot occur legitimately._                           |
| `DA` | `011`  | URL too long.                                          |

* When producing a message for an unrecognised error code, the game internally
  switches to producing a message for error `101-010`, while still displaying
  the original code.

### Mobile Trainer
Mobile Trainer has two distinct sets of game-specific error codes.

#### Main code `9A` (`F0`)
These errors internally have a main code of `F0`, but they are displayed as if
the main code were instead `9A`. They all occur before the mobile adapter is
initialised.

| Detail | Meaning                                               |
|--------|-------------------------------------------------------|
| `000`* | _Cannot occur legitimately._                          |
| `010`  | Invalid inputs to password-change form.               |
| `100`  | The mobile adapter's EEPROM is corrupted.             |
| `110`  | The game's mobile adapter configuration is corrupted. |
| `111`  | The game's save data is corrupted.                    |

* No code exists to produce error `9A-000`, but it has a specifically-coded
  message (and an entry in the Mobile Adapter manual) suggesting it might have
  been intended to occur if the power-on check for the mobile adapter were to
  fail.

#### Main code `40`
These errors' detail codes are displayed as four digits, as they can be any
16-bit BCD value. They occur when the account information pages (loaded from
the option menu) contain the following `<meta>` tags within the `<head>` tag,
where `SSSS` is the detail code:
```html
<meta r_code="ng">
<meta d_code="SSSS">
```
The following values are recognised in some fashion:

| Detail | Meaning                                   |
|--------|-------------------------------------------|
| `0010` | Account registration not sent.            |
| `0020` | No such account.                          |
| `0021` | No such account.                          |
| `0030` | Account suspended.                        |
| `0031` | Account cancelled.                        |
| `0032` | Account cancelled.                        |
| `0040` | Incorrect password.                       |
| `0041` | Invalid password.                         |
| `0042` | Invalid password.                         |
| `0043` | Invalid password.                         |
| `0044` | Invalid password.                         |
| `0050` | Account unavailable.                      |
| `1001` | New password is wrong length.             |
| `1002` | New password is wrong length.             |
| `1003` | New password contains invalid characters. |
| `1004` | New password is too simple.               |
| `1005` | New password is unchanged.                |
| `8000` | Server is under maintenance.              |
| `9000` | Server communication error.               |

### JGTO Kounin Golf Master Mobile
Golf Master-specific errors internally have a main code of `FF`, but they are
displayed as if the main code were instead `GM`.

| Detail | Meaning                              |
|--------|--------------------------------------|
| `001`  | The mobile adapter was not detected. |
| `101`  | Invalid email address.               |
| `102`  | Invalid URL.                         |
| `201`  | Internal program time-out.           |
| `202`  | Operation cancelled by user.         |
| `301`  | Invalid ranking data.                |
| `302`  | Download error.                      |
| `401`  | Irregularity detected.               |
| `402`  | Upload error.                        |
| `999`  | Invalid personal info.               |
