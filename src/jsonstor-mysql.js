'use strict';

const LIB_FS = require( 'fs' );
const LIB_PATH = require( 'path' );
const LIB_CRYPTO = require( 'crypto' );

const jsongin = require( '@liquicode/jsongin' );
// const MYSQL = require( 'mysql' );
const MYSQL = require( 'mysql2' );


module.exports = {

	AdapterName: 'jsonstor-mysql',
	AdapterDescription: 'Documents are stored in a MySql database.',

	GetAdapter: function ( jsonstor, Settings )
	{


		//=====================================================================
		if ( jsongin.ShortType( Settings ) !== 'o' ) { throw new Error( `This adapter requires a Settings parameter.` ); }
		if ( jsongin.ShortType( Settings.Server ) !== 's' ) { Settings.Server = 'localhost'; }
		if ( jsongin.ShortType( Settings.Port ) !== 'n' ) { Settings.Port = 3306; }
		if ( jsongin.ShortType( Settings.Database ) !== 's' ) { throw new Error( `This adapter requires a Settings.Database string parameter.` ); }
		if ( jsongin.ShortType( Settings.Table ) !== 's' ) { throw new Error( `This adapter requires a Settings.Table string parameter.` ); }
		if ( jsongin.ShortType( Settings.IdField ) !== 's' ) { Settings.IdField = ''; }
		if ( jsongin.ShortType( Settings.UserName ) !== 's' ) { throw new Error( `This adapter requires a Settings.UserName string parameter.` ); }
		if ( jsongin.ShortType( Settings.Password ) !== 's' ) { throw new Error( `This adapter requires a Settings.Password string parameter.` ); }
		if ( jsongin.ShortType( Settings.ModifySchema ) !== 'b' ) { Settings.ModifySchema = false; }
		// The storage model. See jsonx/.plans/sql-adapter-architecture.md - real columns are an
		// index which pre-filters, and the payload column carries the document. With no payload
		// column the table *is* the document, and a field with no column is refused by name.
		if ( jsongin.ShortType( Settings.PayloadColumn ) !== 's' ) { Settings.PayloadColumn = ''; }
		if ( jsongin.ShortType( Settings.PayloadSync ) !== 'b' ) { Settings.PayloadSync = false; }
		if ( jsongin.ShortType( Settings.Columns ) !== 'a' ) { Settings.Columns = []; }


		//=====================================================================
		let Storage = jsonstor.StorageInterface();
		Storage.Settings = jsongin.Clone( Settings );
		Storage.Catalog = {
			initialized: false,
			fields: null,
			id_field: null,
		};


		//=====================================================================
		let MySqlFieldFlags = {
			NOT_NULL_FLAG: 1, // Field can't be NULL. More...
			PRI_KEY_FLAG: 2, // Field is part of a primary key. More...
			UNIQUE_KEY_FLAG: 4, // Field is part of a unique key. More...
			MULTIPLE_KEY_FLAG: 8, // Field is part of a key. More...
			BLOB_FLAG: 16, // Field is a blob. More...
			UNSIGNED_FLAG: 32, // Field is unsigned. More...
			ZEROFILL_FLAG: 64, // Field is zerofill. More...
			BINARY_FLAG: 128, // Field is binary
			ENUM_FLAG: 256, // field is an enum More...
			AUTO_INCREMENT_FLAG: 512, // field is a autoincrement field More...
			TIMESTAMP_FLAG: 1024, // Field is a timestamp. More...
			SET_FLAG: 2048, // field is a set More...
			NO_DEFAULT_VALUE_FLAG: 4096, // Field doesn't have default value. More...
			ON_UPDATE_NOW_FLAG: 8192, // Field is set to NOW on UPDATE. More...
			// NUM_FLAG: 32768, // Field is num (for clients) More...
			PART_KEY_FLAG: 16384, // Intern; Part of some key. More...
			GROUP_FLAG: 32768, // Intern: Group field. More...
			UNIQUE_FLAG: 65536, // Intern: Used by sql_yacc. More...
			BINCMP_FLAG: 131072, // Intern: Used by sql_yacc. More...
		};


		//=====================================================================
		// The primary key this adapter creates when it creates a table. A VARCHAR rather than an
		// auto-increment integer, because the caller's _id is taken as given here the way it is
		// in every other adapter, and jsongin's _id is a uuid string.
		const DEFAULT_ID_FIELD = '_id';
		const DEFAULT_ID_TYPE = 'VARCHAR(64) NOT NULL';

		// ***Insertion order is part of the storage contract*** - A) CRUD Tests asserts that a
		// collection reads back in the order it was written, and jsonstor-folder was fixed for
		// exactly this. An auto-increment key used to provide it for free; a VARCHAR _id does
		// not, so the order is kept in a column of its own.
		const DEFAULT_SEQ_FIELD = '_seq';

		// ***Not MySQL's native JSON type.*** JSON normalizes an object on the way in - it sorts
		// the keys - so { b, n, s, l, o, a } comes back { a, b, l, n, o, s } and a strict equality
		// against a whole object fails. Measured against MySQL 8.0.41. LONGTEXT returns the bytes
		// which were written, which is what a payload holding the document has to do.
		const PAYLOAD_TYPE = 'LONGTEXT DEFAULT NULL';

		// ***What MySQL does differently, declared in one place.***
		//
		// SqlExpression defaults every one of these to the answer which is safe on every
		// engine, so this list is exactly what MySQL asks for beyond that. An option added
		// there later for another dialect arrives here as a default and can only cost this
		// adapter a rendering it never had - it can never narrow a clause. See
		// jsonx/.plans/sql-adapter-architecture.md, The Dialect Interface.
		const SQL_DIALECT = {
			// MySQL quotes an identifier with a backtick, which leaves the double quote free
			// to open a string literal.
			IdentifierQuotes: '`',
			StringLiteralQuotes: '"',
			// A backslash is an escape character to MySQL, so a literal one has to be doubled.
			StringLiteralEscape: 'backslash',
			// And it is MySQL's default LIKE escape, so the pattern needs no ESCAPE clause.
			LikeEscapeCharacter: '\\',
			LikeEscapeClause: false,
			// Measured against MySQL 8.0.41: NULL IS NOT TRUE is 1, 0 IS NOT TRUE is 1,
			// 1 IS NOT TRUE is 0 - which is the question negate() is asking.
			NegateWithIsNotTrue: true,
			RendersModulo: true,
			RendersBitwise: true,
		};


		//=====================================================================
		let MySqlFieldTypes = {
			TINY: 1,
			INT: 3,
			DOUBLE: 5,
			JSON: 245,
			MEDIUMTEXT: 252,
			STRING: 254,
		};


		//=====================================================================
		function has_flag( Flags, Flag )
		{
			return ( ( Flags & Flag ) === Flag );
		}


		//=====================================================================
		function is_ip_address( Url )
		{
			if ( jsongin.ShortType( Url ) !== 's' ) { throw new Error( `Server name or IP Address must be a string.` ); }
			let parts = Url.split( '.' );
			if ( parts.length !== 4 ) { return false; }
			for ( let index = 0; index < parts.length; index++ )
			{
				if ( jsongin.AsNumber( parts[ index ] === null ) ) { return false; }
			}
			return true;
		}


		//=====================================================================
		// WithConnection
		//=====================================================================

		async function WithConnection( Handler /* ( Connection ) */ )
		{
			return new Promise(
				async ( resolve, reject ) =>
				{
					let connection = null;
					try
					{
						// Connect to the server.
						let options = {
							host: Storage.Settings.Server,
							port: Storage.Settings.Port,
							database: Storage.Settings.Database,
							user: Storage.Settings.UserName,
							password: Storage.Settings.Password,
						};
						connection = MYSQL.createConnection( options );
						if ( !connection ) { throw new Error( `Unable to establish a connection to the mysql database server.` ); }

						// Do the stuff.
						let result = await Handler( connection );

						// Close the connection.
						connection.end(
							function ( error )
							{
								if ( error ) { throw error; }
								resolve( result );
								return;
							} );
					}
					catch ( error )
					{
						if ( connection )
						{
							connection.destroy();
						}
						reject( error );
						return;
					}
					return;
				} );
			return; // Inaccessible code.
		}


		// ***The dialect is checked against the server once, on the first statement.***
		//
		// The connection is lazy and `GetStorage` is synchronous, so a mismatched server cannot
		// be caught at construction and surfaces on the first operation instead. ***The outcome
		// is remembered, so every later call fails the same way***: a storage pointed at a
		// server its dialect cannot serve is wrong for its whole life, not only once.
		//
		// ***A server which did not answer is not remembered***, because that is a transient
		// failure rather than an answer, and caching it would poison the storage.
		let dialect_check = null;
		async function ensure_dialect_checked()
		{
			if ( dialect_check !== null )
			{
				if ( dialect_check.Error ) { throw dialect_check.Error; }
				return;
			}
			// Set before asking, so that StorageInfo's own statement does not re-enter this.
			dialect_check = {};
			try { await Storage.StorageInfo(); }
			catch ( error )
			{
				if ( error && error.DialectBoundary ) { dialect_check.Error = error; }
				else { dialect_check = null; }
				throw error;
			}
			return;
		}


		async function SQL_Passthrough( SqlStatement, SqlParameters )
		{
			await ensure_dialect_checked();
			return new Promise(
				async ( resolve, reject ) =>
				{
					let connection = null;
					try
					{
						// Connect to the server.
						let options = {
							host: Storage.Settings.Server,
							port: Storage.Settings.Port,
							database: Storage.Settings.Database,
							user: Storage.Settings.UserName,
							password: Storage.Settings.Password,
						};
						connection = MYSQL.createConnection( options );
						if ( !connection ) { throw new Error( `Unable to establish a connection to the mysql database server.` ); }

						// Perform the sql query.
						connection.query( SqlStatement, SqlParameters,
							function callback( QueryError, Results, Fields )
							{
								if ( QueryError ) 
								{
									connection.destroy();
									reject( QueryError );
									return;
								}
								// Close the connection.
								connection.end(
									function ( EndError )
									{
										if ( EndError ) 
										{
											connection.destroy();
											reject( EndError );
											return;
										}
										resolve( { results: Results, fields: Fields } );
										return;
									} );
							} );
					}
					catch ( error )
					{
						if ( connection )
						{
							connection.destroy();
						}
						reject( error );
						return;
					}
					return;
				} );
			return; // Inaccessible code.
		}


		//=====================================================================
		async function update_catalog()
		{
			if ( Storage.Catalog.initialized ) { return Storage.Catalog; }
			Storage.Catalog.initialized = true;
			Storage.Catalog.table_exists = false;
			Storage.Catalog.fields = {};
			Storage.Catalog.id_field = Storage.Settings.IdField;

			let sql = `SELECT * FROM ??.?? WHERE (1 = 0);`;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];
			let results = null;
			try
			{
				results = await SQL_Passthrough( sql, sql_parameters );
				Storage.Catalog.table_exists = true;
			}
			catch ( error )
			{
				if ( error.message.startsWith( `ER_NO_SUCH_TABLE` ) ) { return Storage.Catalog; } // mysql1
				if ( error.code === 'ER_NO_SUCH_TABLE' ) { return Storage.Catalog; } // mysql2
				throw error;
			}

			// if ( !Storage.Catalog.id_field && results.fields._id )
			// {
			// 	Storage.Catalog.id_field = '_id';
			// }

			for ( let index = 0; index < results.fields.length; index++ )
			{
				// Get the field definition.
				let field = results.fields[ index ];
				field.allow_null = !has_flag( field.flags, MySqlFieldFlags.NOT_NULL_FLAG );
				field.is_primary_key = has_flag( field.flags, MySqlFieldFlags.PRI_KEY_FLAG );
				field.is_auto_increment = has_flag( field.flags, MySqlFieldFlags.AUTO_INCREMENT_FLAG );
				if ( field.type === MySqlFieldTypes.TINY ) 
				{
					// A boolean lands in a TINYINT(1), whether a caller declared the column or the
					// table was already that way when it was found. Typing it as anything else
					// costs the round trip: the driver hands back 1 and 0, and a criteria asking
					// for a strict true then matches nothing.
					field.type_name = 'TINYINT';
					field.short_type = 'b';
				}
				else if ( field.type === MySqlFieldTypes.INT ) 
				{
					field.type_name = 'INT';
					field.short_type = 'n';
				}
				else if ( field.type === MySqlFieldTypes.DOUBLE ) 
				{
					field.type_name = 'DOUBLE';
					field.short_type = 'n';
				}
				else if ( field.type === MySqlFieldTypes.JSON )
				{
					// 'j' is deliberately outside the 'bns' set SQL_Query pre-filters on. A JSON
					// column holds a structure, and a structure is jsongin's question, not SQL's.
					field.type_name = 'JSON';
					field.short_type = 'j';
				}
				else if ( field.type === MySqlFieldTypes.MEDIUMTEXT )
				{
					field.type_name = 'MEDIUMTEXT';
					field.short_type = 's';
				}
				else if ( field.type === MySqlFieldTypes.STRING ) 
				{
					field.type_name = 'STRING';
					field.short_type = 's';
				}
				else 
				{
					field.type_name = '?';
					field.short_type = '?';
				}
				// Set the field definition.
				Storage.Catalog.fields[ field.name ] = field;
			}

			// ***The order matters, because this adapter now creates two keys.*** A table it
			// created has a VARCHAR _id holding the caller's identifier and an auto-increment
			// _seq holding insertion order, and taking the first auto-increment column would
			// pick the wrong one. A configured IdField wins, then _id by name, and only then
			// a foreign table's auto-increment key.
			if ( !Storage.Catalog.id_field && Storage.Catalog.fields[ DEFAULT_ID_FIELD ] )
			{
				Storage.Catalog.id_field = DEFAULT_ID_FIELD;
			}
			if ( !Storage.Catalog.id_field )
			{
				for ( let key in Storage.Catalog.fields )
				{
					if ( key === DEFAULT_SEQ_FIELD ) { continue; }
					if ( !Storage.Catalog.fields[ key ].is_auto_increment ) { continue; }
					Storage.Catalog.id_field = key;
					break;
				}
			}

			// Insertion order. Only present in a table this adapter created.
			Storage.Catalog.seq_field =
				Storage.Catalog.fields[ DEFAULT_SEQ_FIELD ] ? DEFAULT_SEQ_FIELD : null;

			// The payload column, if this storage was configured with one and the table has it.
			Storage.Catalog.payload_field = null;
			if ( Storage.Settings.PayloadColumn )
			{
				Storage.Catalog.payload_field =
					Storage.Catalog.fields[ Storage.Settings.PayloadColumn ] || null;
			}

			return Storage.Catalog;
		}


		//=====================================================================
		// ensure_schema
		//
		// ***jsonstor never infers a column from a document.*** Columns come from the Columns
		// declaration when this adapter creates the table, or from the table as it was found.
		// Nothing else. See jsonx/.plans/sql-adapter-architecture.md, rule R2.
		//
		// What this replaced took a column's SQL type from the *first document* which held that
		// field, so the schema was an accident of insertion order and every later document with
		// a different type for that field was coerced into it without complaint. A string
		// zipCode made the column MEDIUMTEXT and the numbers which followed came back as
		// strings, which no test could see and nothing recorded.
		//=====================================================================
		async function ensure_schema()
		{
			if ( !Storage.Catalog.initialized ) { await update_catalog(); }
			if ( !Storage.Settings.ModifySchema ) { return; }

			let changed = false;

			if ( !Storage.Catalog.table_exists )
			{
				let id_column = declared_id_column();
				// The auto-increment column has to be a key of its own for MySQL to accept it,
				// and a UNIQUE key is enough.
				let sql = `CREATE TABLE ??.?? (?? ${id_column.Type}, ?? BIGINT NOT NULL AUTO_INCREMENT, PRIMARY KEY (??), UNIQUE KEY (??));`;
				let sql_parameters = [
					Storage.Settings.Database,
					Storage.Settings.Table,
					id_column.Name,
					DEFAULT_SEQ_FIELD,
					id_column.Name,
					DEFAULT_SEQ_FIELD ];
				await SQL_Passthrough( sql, sql_parameters );
				Storage.Catalog.initialized = false;
				await update_catalog();
				changed = true;
			}

			// Every declared column which is not there yet, then the payload column. Declared
			// columns carry their SQL type verbatim: this is a SQL adapter, and a caller who
			// names a table also names its types.
			let additions = [];
			let addition_parameters = [];
			for ( let index = 0; index < Storage.Settings.Columns.length; index++ )
			{
				let column = Storage.Settings.Columns[ index ];
				if ( jsongin.ShortType( column ) !== 'o' ) { continue; }
				if ( jsongin.ShortType( column.Name ) !== 's' ) { continue; }
				if ( !column.Name ) { continue; }
				if ( column.Key ) { continue; }
				if ( Storage.Catalog.fields[ column.Name ] ) { continue; }
				let type = ( jsongin.ShortType( column.Type ) === 's' ) ? column.Type : 'MEDIUMTEXT DEFAULT NULL';
				additions.push( `ADD COLUMN ?? ${type}` );
				addition_parameters.push( column.Name );
			}
			if ( Storage.Settings.PayloadColumn && !Storage.Catalog.fields[ Storage.Settings.PayloadColumn ] )
			{
				additions.push( `ADD COLUMN ?? ${PAYLOAD_TYPE}` );
				addition_parameters.push( Storage.Settings.PayloadColumn );
			}

			if ( additions.length )
			{
				let sql = `ALTER TABLE ??.?? ` + additions.join( ', ' );
				let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ]
					.concat( addition_parameters );
				await SQL_Passthrough( sql, sql_parameters );
				changed = true;
			}

			if ( changed )
			{
				Storage.Catalog.initialized = false;
				await update_catalog();
			}
			return;
		}


		//=====================================================================
		// The primary key column this adapter creates.
		//
		// ***A VARCHAR key rather than an auto-increment one.*** Every other adapter in this
		// family takes the caller's _id as given, and an INT AUTO_INCREMENT key answers a
		// caller-supplied UUID with "Data truncated for column '_id'". A foreign table's
		// auto-increment key is still discovered and still used; this is only what gets created.
		function declared_id_column()
		{
			for ( let index = 0; index < Storage.Settings.Columns.length; index++ )
			{
				let column = Storage.Settings.Columns[ index ];
				if ( jsongin.ShortType( column ) !== 'o' ) { continue; }
				if ( !column.Key ) { continue; }
				if ( jsongin.ShortType( column.Name ) !== 's' ) { continue; }
				if ( !column.Name ) { continue; }
				let type = ( jsongin.ShortType( column.Type ) === 's' ) ? column.Type : DEFAULT_ID_TYPE;
				return { Name: column.Name, Type: type };
			}
			let name = Storage.Settings.IdField || DEFAULT_ID_FIELD;
			return { Name: name, Type: DEFAULT_ID_TYPE };
		}


		//=====================================================================
		// Whether a column can hold this value without changing it.
		//
		// ***The question is the round trip, not whether the server will accept it.*** MySQL
		// takes a number into a MEDIUMTEXT column happily and hands back a string, and there is
		// nothing in the row afterwards which says a number was meant.
		function value_fits_column( Field, Value )
		{
			let st = jsongin.ShortType( Value );
			if ( !'bns'.includes( st ) ) { return false; }
			return ( Field.short_type === st );
		}


		//=====================================================================
		function parse_payload( Value )
		{
			// The driver parses a JSON column and hands back a string for a TEXT one.
			if ( ( Value === null ) || ( typeof Value === 'undefined' ) ) { return {}; }
			if ( typeof Value === 'string' )
			{
				if ( !Value ) { return {}; }
				return JSON.parse( Value );
			}
			return Value;
		}


		//=====================================================================
		function serialize_payload( Value )
		{
			return JSON.stringify( Value );
		}


		//=====================================================================
		// document_to_row
		//
		// Splits a document into the columns which pre-filter and the payload which stores it,
		// according to the three configurations in the architecture document.
		function document_to_row( Document )
		{
			let payload_name = Storage.Settings.PayloadColumn;
			let has_payload = ( Storage.Catalog.payload_field !== null );
			let row = {};

			if ( has_payload && Storage.Settings.PayloadSync )
			{
				// F3. The payload is the whole document and the columns are projections of it,
				// each holding the value when it fits and NULL when it does not. Reads never
				// take a value from a column, so a NULL here costs a pre-filter and not an
				// answer - SqlExpression broadens a projected column for exactly that reason.
				for ( let key in Storage.Catalog.fields )
				{
					if ( key === payload_name ) { continue; }
					let field = Storage.Catalog.fields[ key ];
					if ( field.is_auto_increment ) { continue; }
					if ( key === Storage.Catalog.id_field ) { continue; }
					let value = Document[ key ];
					row[ key ] = value_fits_column( field, value ) ? value : null;
				}
				row[ payload_name ] = serialize_payload( Document );
				return row;
			}

			let remainder = {};
			for ( let key in Document )
			{
				if ( key.includes( '.' ) ) { continue; }
				if ( key === payload_name )
				{
					throw new Error( `Cannot store a field named [${key}], it is this storage's payload column.` );
				}
				let value = Document[ key ];
				let field = Storage.Catalog.fields[ key ];
				if ( !field )
				{
					// F1. A field with no column is refused rather than dropped. What this
					// replaced skipped the key and reported success, so the field was gone and
					// nothing said so.
					if ( !has_payload )
					{
						throw new Error( `Cannot store the field [${key}], the table [${Storage.Settings.Table}] has no such column and this storage has no payload column.` );
					}
					remainder[ key ] = value;
					continue;
				}
				if ( field.is_auto_increment ) { continue; }
				if ( key === Storage.Catalog.id_field ) { continue; }
				if ( jsongin.ShortType( value ) === 'l' ) { row[ key ] = null; continue; }
				if ( !value_fits_column( field, value ) )
				{
					// F2. The column is the only home this field has, so a value it cannot hold
					// is refused rather than coerced into a lie.
					throw new Error( `Cannot store the field [${key}], its value does not fit the column's type [${field.type_name}]. Configure a PayloadColumn to store values of any type.` );
				}
				row[ key ] = value;
			}
			if ( has_payload ) { row[ payload_name ] = serialize_payload( remainder ); }
			return row;
		}


		//=====================================================================
		function row_to_document( Row )
		{
			if ( !Row ) { return null; }
			let payload_name = Storage.Settings.PayloadColumn;
			let has_payload = ( Storage.Catalog.payload_field !== null );

			// F3. Under PayloadSync the payload is the document and the columns are projections
			// of it, so a value is never taken from a column. That is the whole reason this
			// configuration keeps absent apart from null and a number apart from its string:
			// the payload is real JSON and a column is not.
			if ( has_payload && Storage.Settings.PayloadSync )
			{
				return parse_payload( Row[ payload_name ] );
			}

			// The columns are the document here, so the round trip is only as good as they are.
			// The driver reports a TINYINT as a number, so a boolean column comes back as 1 or 0
			// and stops being strictly equal to true or false. The catalog knows which columns
			// were written as booleans, so that much is closed here, in the one place a row
			// becomes a document.
			let document = {};
			for ( let key in Row )
			{
				if ( has_payload && ( key === payload_name ) ) { continue; }
				if ( key === Storage.Catalog.seq_field ) { continue; }
				let value = Row[ key ];
				let field = Storage.Catalog.fields[ key ];
				if ( field && ( field.short_type === 'b' ) && ( value !== null ) )
				{
					value = ( value ? true : false );
				}
				document[ key ] = value;
			}
			document = jsongin.Unhybridize( document );
			if ( has_payload )
			{
				let remainder = parse_payload( Row[ payload_name ] );
				for ( let key in remainder ) { document[ key ] = remainder[ key ]; }
			}
			return document;
		}


		//=====================================================================
		// ***Options is threaded in rather than held in a closure.*** It carries the statistics
		// collector for this one call, and a variable on the Storage would blend two overlapping
		// calls into one meaningless pair of numbers.
		async function SQL_Query( Criteria, MaxDocs = 0, Options = null )
		{
			// A malformed criteria is refused, not answered - the same rule the built in
			// adapters apply. Without it a criteria of the wrong type reached SqlExpression
			// and came back as an empty clause, which reads as "match everything".
			let st_criteria = jsongin.ShortType( Criteria );
			if ( !'olu'.includes( st_criteria ) ) { throw new Error( `Criteria must be an object, null, or undefined.` ); }

			// Convert criteria to an sql expression.
			let sql_expression_options = Object.assign( {}, SQL_DIALECT );
			sql_expression_options.AllowedFields = {};
			let payload_sync = ( Storage.Catalog.payload_field !== null ) && Storage.Settings.PayloadSync;
			for ( let key in Storage.Catalog.fields )
			{
				let field = Storage.Catalog.fields[ key ];
				if ( field.is_auto_increment ) { continue; }
				if ( key === Storage.Settings.PayloadColumn ) { continue; }
				if ( key === Storage.Catalog.seq_field ) { continue; }
				if ( !'bns'.includes( field.short_type ) ) { continue; }
				// ***The key column is left out under PayloadSync.*** It holds String( _id ), so
				// an ordering criteria on a numeric _id would compare "10" against "5" as text
				// and lose rows. The by-id paths build their own WHERE and still use the index.
				if ( payload_sync && ( key === Storage.Catalog.id_field ) ) { continue; }
				let entry = jsongin.Clone( field );
				// F4. A projected column mirrors the payload and holds NULL where the value did
				// not fit, so every predicate on it is broadened with IS NULL.
				entry.is_projection = payload_sync;
				sql_expression_options.AllowedFields[ key ] = entry;
			}
			// ***The clause narrows the search; the residual decides the answer.***
			// Today the residual is the whole criteria, so the filtering below is
			// unchanged - but reading it from the translation rather than closing over
			// Criteria is what lets a translator earn a narrower one without this
			// adapter changing again.
			let translation = jsonstor.SqlExpression.Translate( {
				Criteria: Criteria,
				Options: sql_expression_options,
			} );
			let sql_expr = translation.Pushdown;

			// Build sql statement.
			let sql = `SELECT * FROM ??.??`;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];
			if ( sql_expr ) { sql += ' WHERE ' + sql_expr; }
			// ***A listing is not sorted unless it says so.*** readdirSync taught this to
			// jsonstor-folder; a SELECT with no ORDER BY is the same promise, which is to say
			// none. Only a table this adapter created has the column to order by.
			if ( Storage.Catalog.seq_field )
			{
				sql += ' ORDER BY ??';
				sql_parameters.push( Storage.Catalog.seq_field );
			}

			// Get results.
			let results = await SQL_Passthrough( sql, sql_parameters );
			let documents = results.results;

			// Do the actual query filtering here.
			let filtered = [];
			for ( let index = 0; index < documents.length; index++ )
			{
				let document = row_to_document( documents[ index ] );
				if ( jsongin.Query( document, translation.Residual ) )
				{
					filtered.push( document );
					if ( MaxDocs && ( filtered.length === MaxDocs ) ) { break; }
				}
			}

			// ***What the two stages actually did.*** A no-op unless the caller asked for it.
			// PushdownRows is what the server sent; ResidualRows is what this call produced,
			// which a MaxDocs limit stops early - FindOne reports 1 however many matched.
			jsonstor.ReportStatistics( Options, {
				Translator: Storage.SqlTranslation.TranslatorName,
				Pushdown: sql_expr || null,
				PushdownRows: documents.length,
				Residual: translation.Residual,
				ResidualRows: filtered.length,
			} );

			// Return the results.
			return filtered;
		}


		//=====================================================================
		// The value which goes in the key column.
		//
		// The payload carries the true _id with its true type; this is only what the index
		// holds. A VARCHAR key takes String() because that is what MySQL would do anyway, and
		// doing it here keeps the by-id statements comparing like with like.
		function id_to_key( Value )
		{
			if ( ( Value === null ) || ( typeof Value === 'undefined' ) ) { return null; }
			let field = Storage.Catalog.fields[ Storage.Catalog.id_field ];
			if ( field && 'n'.includes( field.short_type ) ) { return Value; }
			return '' + Value;
		}


		//=====================================================================
		function new_id()
		{
			// jsongin's _id is a uuid string, and the built in adapters mint one with uuid.v4()
			// when a document arrives without it. randomUUID is the same value from the runtime,
			// which keeps this adapter's dependencies to its driver.
			return LIB_CRYPTO.randomUUID();
		}


		//=====================================================================
		async function SQL_Insert( Document )
		{
			if ( !Document ) { return null; }
			await update_catalog();
			await ensure_schema();

			if ( !Storage.Catalog.id_field ) { throw new Error( `Cannot insert rows into table [${Storage.Settings.Database}.${Storage.Settings.Table}], a primary key field was not found. ` ); }
			let id_field = Storage.Catalog.id_field;
			let id_column = Storage.Catalog.fields[ id_field ];
			let auto_increment = !!( id_column && id_column.is_auto_increment );

			// ***The caller's _id is taken as given.*** Only an auto-increment key gets to
			// choose one, and then it is the server which chooses it.
			let document = Document;
			if ( !auto_increment && ( jsongin.ShortType( document[ id_field ] ) === 'u' ) )
			{
				document = jsongin.Clone( Document );
				document[ id_field ] = new_id();
			}

			let row = document_to_row( document );
			if ( !auto_increment ) { row[ id_field ] = id_to_key( document[ id_field ] ); }

			let columns = Object.keys( row );
			if ( columns.length === 0 ) { return null; }

			let sql = `INSERT INTO ??.??`;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];
			let tokens = [];
			for ( let index = 0; index < columns.length; index++ )
			{
				tokens.push( '??' );
				sql_parameters.push( columns[ index ] );
			}
			sql += ` ( ${tokens.join( ', ' )} )`;
			tokens = [];
			for ( let index = 0; index < columns.length; index++ )
			{
				tokens.push( '?' );
				sql_parameters.push( row[ columns[ index ] ] );
			}
			sql += ` VALUES  ( ${tokens.join( ', ' )} )`;

			let results = await SQL_Passthrough( sql, sql_parameters );
			if ( results.results.affectedRows === 0 ) { return null; }

			let key = auto_increment ? results.results.insertId : row[ id_field ];
			sql = `SELECT * FROM ??.?? WHERE (?? = ?)`;
			sql_parameters = [
				Storage.Settings.Database,
				Storage.Settings.Table,
				id_field,
				key,
			];

			results = await SQL_Passthrough( sql, sql_parameters );
			let documents = results.results;
			if ( !documents ) { return null; }
			if ( !documents.length ) { return null; }

			return row_to_document( documents[ 0 ] );
		}


		//=====================================================================
		async function SQL_Update( Document )
		{
			if ( !Document ) { return null; }
			await update_catalog();
			await ensure_schema();

			if ( !Storage.Catalog.id_field ) { throw new Error( `Cannot update rows in table [${Storage.Settings.Database}.${Storage.Settings.Table}], a primary key field was not found.` ); }
			let id_field = Storage.Catalog.id_field;
			if ( jsongin.ShortType( Document[ id_field ] ) === 'u' ) { throw new Error( `Cannot update this document, it is missing the id field [${id_field}].` ); }

			let row = document_to_row( Document );
			delete row[ id_field ];
			let columns = Object.keys( row );
			if ( columns.length === 0 ) { return null; }

			let sql = `UPDATE ??.?? SET `;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];
			let tokens = [];
			for ( let index = 0; index < columns.length; index++ )
			{
				tokens.push( '?? = ?' );
				sql_parameters.push( columns[ index ] );
				sql_parameters.push( row[ columns[ index ] ] );
			}
			sql += tokens.join( ', ' );
			sql += ' WHERE (?? = ?)';
			let key = id_to_key( Document[ id_field ] );
			sql_parameters.push( id_field );
			sql_parameters.push( key );

			let results = await SQL_Passthrough( sql, sql_parameters );
			if ( results.results.affectedRows === 0 ) { return null; }

			sql = `SELECT * FROM ??.?? WHERE (?? = ?)`;
			sql_parameters = [
				Storage.Settings.Database,
				Storage.Settings.Table,
				id_field,
				key,
			];

			results = await SQL_Passthrough( sql, sql_parameters );
			let documents = results.results;
			if ( !documents ) { return null; }
			if ( !documents.length ) { return null; }

			return row_to_document( documents[ 0 ] );
		}



		//=====================================================================
		async function SQL_Delete( Document )
		{
			if ( !Document ) { return null; }
			await update_catalog();

			// Get the _id field.
			if ( !Storage.Catalog.id_field ) { throw new Error( `Cannot delete rows from table [${Storage.Settings.Database}.${Storage.Settings.Table}], a primary key field was not found.` ); }
			if ( jsongin.ShortType( Document[ Storage.Catalog.id_field ] ) === 'u' ) { throw new Error( `Cannot delete this document, it is missing the id field [${Storage.Catalog.id_field}].` ); }

			let sql = `DELETE FROM ??.?? WHERE (?? = ?) `;
			let sql_parameters = [
				Storage.Settings.Database,
				Storage.Settings.Table,
				Storage.Catalog.id_field,
				id_to_key( Document[ Storage.Catalog.id_field ] ),
			];

			// Get results.
			let results = await SQL_Passthrough( sql, sql_parameters );
			if ( results.results.affectedRows === 0 ) { return false; }

			return true;
		}


		//=====================================================================
		// SqlTranslation
		//
		// ***What a clause-translating adapter advertises beyond the Storage interface.***
		// This is how a shared suite, or any other caller, can ask what this adapter would
		// render and then ask the server what that rendering admits. Both halves were private
		// closures, and a suite which reconstructed them would have been measuring its own
		// copy of the dialect rather than the one this adapter actually uses.
		//
		// ***Its presence is the capability declaration.*** An adapter which does not push a
		// clause down does not define it, and a suite which needs one skips that engine
		// rather than consulting a second list somewhere which could disagree.
		//
		// Dialect answers a copy, so a caller cannot alter what this adapter renders with.
		//=====================================================================

		Storage.SqlTranslation = {
			TranslatorName: 'SqlExpression',

			// ***How this engine spells SQL, which is not the same question as how it behaves.***
			// The dialect options below say what SqlExpression renders; this says whose SQL the
			// result is, so a caller holding a statement of its own - a probe, a DDL sample -
			// can pick the spelling this server will accept. Nothing in jsonstor branches on it.
			DialectName: 'mysql',

			// The options this adapter renders with. A copy, so a caller cannot alter them.
			Dialect: function () { return Object.assign( {}, SQL_DIALECT ); },

			// ***A logical type to this engine's spelling for it.*** A shared suite declares the
			// columns it wants in jsongin's own short types and cannot know what to call them
			// here - and a column's declared type is the promise this adapter keeps by writing
			// NULL where a value does not match it, so the suite must not guess.
			ColumnTypes: {
				b: 'TINYINT(1)',
				n: 'DOUBLE',
				s: 'MEDIUMTEXT',
				i: 'INT',
			},

			// ***Normalized on purpose.*** SQL_Passthrough is not advertised directly because
			// the two SQL adapters do not agree about it: mysql answers { results, fields } and
			// sqlite answers { results, info }, and sqlite needs a separate DDL path because
			// better-sqlite3's prepare() is not one. A surface whose contract differs between
			// its implementations is worse than none, so callers get rows, or a promise that
			// the statement ran.
			Query: async function ( Sql, Parameters ) { return ( await SQL_Passthrough( Sql, Parameters || [] ) ).results; },
			Execute: async function ( Sql ) { await SQL_Passthrough( Sql, [] ); return true; },
		};

		//=====================================================================
		// DropStorage
		//=====================================================================


		// ***What this storage is actually talking to.*** The names come from the storage and the
		// version from the server, asked every time rather than cached, because a server can be
		// replaced under a long-lived storage.
		Storage.StorageInfo = async function ( Options )
		{
			let answer = await SQL_Passthrough( 'SELECT VERSION() AS server_version', [] );
			let row = answer.results[ 0 ] || {};
			return jsonstor.BuildStorageInfo( Storage, {
				Product: 'MySQL',
				Version: row.server_version || '',
				Endpoint: `${Storage.Settings.Server}:${Storage.Settings.Port}`,
			} );
		};


		Storage.DropStorage = async function ( Options )
		{
			try
			{
				let sql = `DROP TABLE IF EXISTS ??.??;`;
				let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];
				await SQL_Passthrough( sql, sql_parameters );
				Storage.Catalog.initialized = false;
				await update_catalog();
			}
			catch ( error )
			{
				if ( error.message.startsWith( `ER_BAD_TABLE_ERROR` ) )
				{
					return true;
				}
				else
				{
					throw error;
				}
			}
			return true;
		};


		//=====================================================================
		// FlushStorage
		//=====================================================================


		Storage.FlushStorage = async function ( Options ) 
		{
			return true;
		};


		//=====================================================================
		// Count
		//=====================================================================


		Storage.Count = async function ( Criteria, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 0, Options );
			return documents.length;
		};


		//=====================================================================
		// InsertOne
		//=====================================================================


		Storage.InsertOne = async function ( Document, Options = {} ) 
		{
			let document = await SQL_Insert( Document );
			if ( Options.ReturnDocuments )
			{
				return document;
			}
			else
			{
				if ( document ) { return 1; }
				else { return 0; }
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// InsertMany
		//=====================================================================


		Storage.InsertMany = async function ( Documents, Options = {} ) 
		{
			let documents = [];
			for ( let index = 0; index < Documents.length; index++ )
			{
				documents.push( await SQL_Insert( Documents[ index ] ) );
			}
			if ( Options.ReturnDocuments )
			{
				return documents;
			}
			else
			{
				return documents.length;
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// FindOne
		//=====================================================================


		Storage.FindOne = async function FindOne( Criteria, Projection, Options = {} ) 
		{
			// A read returns documents. ReturnDocuments gates what a *write* hands back, which
			// is how the built in adapters read: their FindOne, FindMany and FindMany2 never
			// consult it. Gating here handed a count to every caller which omitted Options.
			let documents = await SQL_Query( Criteria, 1, Options );
			if ( !documents.length ) { return null; }
			if ( Projection )
			{
				documents[ 0 ] = jsongin.Project( documents[ 0 ], Projection );
			}
			return documents[ 0 ];
		};


		//=====================================================================
		// FindMany
		//=====================================================================


		Storage.FindMany = async function FindMany( Criteria, Projection, Options = {} ) 
		{
			// A read returns documents. See the note on FindOne.
			let documents = await SQL_Query( Criteria, 0, Options );
			if ( Projection )
			{
				for ( let index = 0; index < documents.length; index++ )
				{
					documents[ index ] = jsongin.Project( documents[ index ], Projection );
				}
			}
			return documents;
		};


		//=====================================================================
		// FindMany2
		//=====================================================================


		Storage.FindMany2 = async function FindMany2( Criteria, Projection, Sort, MaxCount, Options = {} ) 
		{
			// A read returns documents. See the note on FindOne.
			let documents = await SQL_Query( Criteria, 0, Options );
			if ( Projection )
			{
				for ( let index = 0; index < documents.length; index++ )
				{
					documents[ index ] = jsongin.Project( documents[ index ], Projection );
				}
			}
			if ( Sort ) { documents = jsongin.Sort( documents, Sort ); }
			if ( MaxCount && ( MaxCount > 0 ) && ( documents.length > MaxCount ) ) { documents = documents.splice( 0, MaxCount ); }
			return documents;
		};


		//=====================================================================
		// UpdateOne
		//=====================================================================


		Storage.UpdateOne = async function UpdateOne( Criteria, Update, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 1, Options );
			let document = null;
			if ( documents && documents.length )
			{
				document = documents[ 0 ];
			}
			if ( document )
			{
				document = jsongin.Update( document, Update );
				document = await SQL_Update( document );
			}
			if ( Options.ReturnDocuments ) 
			{
				return document;
			}
			else 
			{
				if ( document ) { return 1; }
				else { return 0; }
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// UpdateMany
		//=====================================================================


		Storage.UpdateMany = async function UpdateMany( Criteria, Update, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 0, Options );
			for ( let index = 0; index < documents.length; index++ )
			{
				documents[ index ] = jsongin.Update( documents[ index ], Update );
				documents[ index ] = await SQL_Update( documents[ index ] );
			}
			if ( Options.ReturnDocuments ) 
			{
				return documents;
			}
			else 
			{
				return documents.length;
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// ReplaceOne
		//=====================================================================


		Storage.ReplaceOne = async function ReplaceOne( Criteria, Document, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 1, Options );
			let document = null;
			if ( documents && documents.length )
			{
				document = documents[ 0 ];
			}
			if ( document )
			{
				if ( Document )
				{
					for ( let key in Document )
					{
						document[ key ] = Document[ key ];
					}
				}
				document = await SQL_Update( document );
			}
			if ( Options.ReturnDocuments ) 
			{
				return document;
			}
			else 
			{
				if ( document ) { return 1; }
				else { return 0; }
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// DeleteOne
		//=====================================================================


		Storage.DeleteOne = async function DeleteOne( Criteria, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 1, Options );
			let document = null;
			if ( documents && documents.length )
			{
				let result = await SQL_Delete( documents[ 0 ] );
				if ( result )
				{
					document = documents[ 0 ];
				}
			}
			if ( Options.ReturnDocuments ) 
			{
				return document;
			}
			else 
			{
				if ( document ) { return 1; }
				else { return 0; }
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// DeleteMany
		//=====================================================================


		Storage.DeleteMany = async function DeleteMany( Criteria, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 0, Options );
			for ( let index = 0; index < documents.length; index++ )
			{
				await SQL_Delete( documents[ index ] );
			}
			if ( Options.ReturnDocuments ) 
			{
				return documents;
			}
			else 
			{
				return documents.length;
			}
			return; // Unreachable code.
		};


		//=====================================================================
		return Storage;
	},

};


//---------------------------------------------------------------------
// ***This package is one prime and four aliases.***
//
// MySQL 5.7.44, 8.0.46 and 8.4.11 were measured against this adapter on 2026-09-01 and
// answered ***identically*** - 303 passing on each, and a predicate inventory which matches
// line for line, the same clauses rendered and the same ones deferred. ***So there is one
// dialect profile here and no version needs a second one.***
//
// ***A prime is a floor and takes the name of the lowest version it covers***, which is why
// the profile is `-v5.7` rather than `-v8.0`: it is valid from 5.7 upward, and 5.7 is simply
// the oldest server this was proven against. The newer names are aliases onto it.
//
// See jsonx/.plans/versioned-adapters.md.

const MYSQL_V57 = {
	AdapterName: 'jsonstor-mysql-v5.7',
	AdapterDescription: module.exports.AdapterDescription,
	GetAdapter: module.exports.GetAdapter,
	// ***The floor this profile starts at***, which is what makes it a floor rather than a
	// label: it covers every server from here up to the next prime, and a server below it is
	// refused rather than rendered SQL it will not accept.
	Version: [ 5, 7 ],
	// ***The newest server it has actually been run against.*** Not the same question as the
	// floor, and both are needed: a server past this one is very likely fine and is certainly
	// untested, so it earns a warning where a crossed floor earns an error.
	//
	// ***Every part of it, because the comparison zero-pads and a short answer claims less
	// than was run.*** The server measured here reports 8.4.11, and declaring [ 8, 4 ] made
	// this prime warn that its own test server was untested - a false warning nothing
	// surfaced, found on 2026-09-01 while measuring Oracle. Oracle needs no such care for its
	// 21.3.0.0.0, since the parts after the second are zeros either way.
	MeasuredTo: [ 8, 4, 11 ],
};

module.exports.Adapters = [ MYSQL_V57 ];

// ***The bare name is listed here rather than left on the plugin object.*** Naming it stops
// the plugin registering itself under it, so `GetStorage( 'jsonstor-mysql' )` reports the prime
// it resolved to instead of reporting itself as its own dialect.
module.exports.Aliases = {
	'jsonstor-mysql': 'jsonstor-mysql-v5.7',
	'jsonstor-mysql-v5': 'jsonstor-mysql-v5.7',
	'jsonstor-mysql-v8': 'jsonstor-mysql-v5.7',
	'jsonstor-mysql-v8.0': 'jsonstor-mysql-v5.7',
	'jsonstor-mysql-v8.4': 'jsonstor-mysql-v5.7',
};


