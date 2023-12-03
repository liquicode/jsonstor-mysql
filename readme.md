# jsonstor-mysql
[`@liquiode/jsonstor-mysql`](https://github.com/liquicode/jsonstor-mysql)

### A jsonstor adapter which stores documents in a MySql database.


Overview
---------------------------------------------------------------------

This project is a plugin for the `jsonstor` project.
See: [`@liquiode/jsonstor`](https://github.com/liquicode/jsonstor) for more information.

`jsonstor` defines a single interface for database interaction and implements adapters for specific database products and libraries.
This document-centric interface is inspired by the MongoDB-style interface and is also found in many other projects.
All database interaction is done through this interface and is the same across all database adapters.

This project, `jsonstr-mysql`, implements the translations necessary to interact with a MySql database
  using a document-centric api.


Getting Started
---------------------------------------------------------------------

***Install jsonstor-mysql with NPM***
```bash
npm install --save @liquicode/jsonstor-mysql
```

***Using jsonstor-mysql***
```js
// First create an instance of the jsonstor engine.
const jsonstor = require('@liquicode/jsonstor')(); // jsonstor exports a function.

// Register the jsonstor-mysql plugin.
const jsonstor_mysql = require('@liquicode/jsonstor-mysql');
jsonstor.LoadPlugin( jsonstor_mysql );

// Create a storage interface using jsonstor-mysql.
let storage = jsonstor.GetStorage( 'jsonstor-mysql', {
	Server: 'localhost',  // The name of the server.
	Port: 3306,           // The service port.
	Database: 'World',    // The name of the database.
	Table: 'Cities',      // The name of the table.
	ModifySchema: false,  // Allow adapter to modify the database structure.
} );

// Find all cities in California with a population of 100K or greater.
let documents = storage.FindMany( { state: 'CA', population: { $gte: 100000 } } );
```


Settings
---------------------------------------------------------------------

| **Setting**  | **Req'd** |  **Default**  | **Description**                                                |
|--------------|:---------:|:-------------:|----------------------------------------------------------------|
| Server       |     No    | `"localhost"` | The name or address of the MySql server.                       |
| Port         |     No    |     `3306`    | The port number of the MySql servr.                            |
| Database     |    Yes    |       -       | The name of the database to use.                               |
| Table        |    Yes    |       -       | The name of the database table to use.                         |
| ModifySchema |     No    |    `false`    | Allow the adapter to modify the underlying database structure. |


Dependencies
---------------------------------------------------------------------

This project uses and depends upon the following other projects:

- [mysql](https://github.com/mysqljs/mysql)


Notes
---------------------------------------------------------------------

Due to the nature of how data is stored in a relational database,
  expect these differences from working with a document database:
- There is no way to store an `undefined` value in a database.
  Queries that try to match a field against `undefined` will always fail.
- Any fields missing during an insert will get populated by their default value.
  There is no way to test if these fields were missing.
- Objects are stored as JSON within the database and there is no gaurantee
  that the object will be restored with its fields in the same order.
  This will cause any strict equality comparison to fail.


