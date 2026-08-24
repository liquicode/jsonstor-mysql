'use strict';

const LIB_PATH = require( 'path' );

const jsonstor = require( '@liquicode/jsonstor' )();
jsonstor.LoadPlugin( require( '../src/jsonstor-mysql.js' ) );

const run_inventory = require( '@liquicode/jsonstor-docs' );

const Storage = jsonstor.GetStorage( 'jsonstor-mysql', {
	// Connection settings, overridable from the environment so a machine whose server
	// differs does not need this file edited. The defaults describe a stock MySQL server
	// listening on the standard port with a database named testdb.
	Server: process.env.JSONSTOR_MYSQL_HOST || 'localhost',
	Port: Number( process.env.JSONSTOR_MYSQL_PORT || 3306 ),
	Database: process.env.JSONSTOR_MYSQL_DATABASE || 'testdb',
	Table: 'test-table',
	UserName: process.env.JSONSTOR_MYSQL_USER || 'root',
	Password: process.env.JSONSTOR_MYSQL_PASSWORD || 'root',
	ModifySchema: true,
} );


describe( 'jsonstor-mysql Tests', () =>
{
	run_inventory( Storage );
} );

