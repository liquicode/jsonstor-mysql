# jsonstor-mysql
[`@liquicode/jsonstor-mysql`](https://github.com/liquicode/jsonstor-mysql)


# Project History


v0.2.0 (current)
---------------------------------------------------------------------

- Built on `@liquicode/jsonstor` 0.2.0 and `@liquicode/jsongin` 0.2.0. A criteria the engine
  refuses is refused before the storage acts on it.
- `FindMany2()` takes a `Paging` object, `{ SkipCount, MaxCount }`, as well as a number.
- `StorageInfo()` reports the adapter asked for, the dialect in force and the server version.
- The `PrimaryKey` setting names the identifier field. It is unique, and an update which
  changes it is refused unless `PrimaryKeyMutable` is `true`.
- Tested on MySQL 5.7, 8.0 and 8.4. A connection to a server which needs a different adapter
  name is refused, and the error names the one to use.
- A `VARCHAR` column and every integer column type are recognized, and a value a column cannot
  hold exactly is refused. *Was: a `VARCHAR` column refused every string, and a fraction written
  to an integer column was stored rounded.*
- A `null` criteria matches every row, and `InsertMany` refuses a value which is not an array.
  *Was: a `null` criteria matched nothing.*
- The TLS settings are `Encrypt` and `TrustServerCertificate`.
- One connection is held, instead of one per statement.
- Declares Node.js `>=10.4.0` in `engines`.


v0.1.0 (2026-08-31)
---------------------------------------------------------------------

- Built on `@liquicode/jsonstor` 0.1.0 and `@liquicode/jsongin` 0.1.0.


v0.0.1
---------------------------------------------------------------------

- Initial release.
