'use strict';

const LIB_FS = require( 'fs' );
const LIB_PATH = require( 'path' );

const jsongin = require( '@liquicode/jsongin' )();
const MYSQL = require( 'mysql' );
const Project = require( '@liquicode/jsongin/src/jsongin/Project' );


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
		let MySqlFieldTypes = {
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


		async function SQL_Passthrough( SqlStatement, SqlParameters )
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
				if ( error.message.startsWith( `ER_NO_SUCH_TABLE` ) ) { return Storage.Catalog; }
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
				if ( field.type === MySqlFieldTypes.INT ) 
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
					field.type_name = 'JSON';
					field.short_type = 'o';
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
				if ( !Storage.Catalog.id_field && field.is_auto_increment )
				{
					Storage.Catalog.id_field = field.name;
				}
			}

			return Storage.Catalog;
		}


		//=====================================================================
		async function update_table_schema( Document )
		{
			if ( !Storage.Catalog.initialized ) { await update_catalog(); }

			if ( !Storage.Catalog.table_exists )
			{
				if ( !Storage.Catalog.id_field ) { Storage.Catalog.id_field = '_id'; }
				let sql = `CREATE TABLE ??.?? (?? INT(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (??))`;
				let sql_parameters = [
					Storage.Settings.Database,
					Storage.Settings.Table,
					Storage.Catalog.id_field,
					Storage.Catalog.id_field ];
				await SQL_Passthrough( sql, sql_parameters );
				Storage.Catalog.initialized = false;
				await update_catalog();
			}

			let sql = `ALTER TABLE ??.?? `;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];

			let count = 0;
			if ( !Storage.Catalog.id_field )
			{
				sql += 'ADD COLUMN _id INT(11) NOT NULL AUTO_INCREMENT';
				count++;
				Storage.Catalog.id_field = '_id';
			}

			for ( let key in Document )
			{
				if ( !Storage.Catalog.fields[ key ] )
				{
					let expr = 'ADD COLUMN ?? ';
					switch ( jsongin.ShortType( Document[ key ] ) )
					{
						case 'b':
							expr += 'TINYINT(1)';
							break;
						case 'n':
							expr += 'DOUBLE';
							break;
						case 's':
							expr += 'MEDIUMTEXT';
							break;
						case 'l':
							expr += 'JSON';
							break;
						case 'o':
							expr += 'JSON';
							break;
						case 'a':
							expr += 'JSON';
							break;
						case 'r':
							expr += 'JSON';
							break;
						default:
							continue;
							break; // Unreachable code.
					}
					expr += ' DEFAULT NULL';
					if ( count ) { sql += ', '; }
					sql += expr;
					sql_parameters.push( key );
					count++;
				}
			}
			if ( !count ) { return; }

			let results = await SQL_Passthrough( sql, sql_parameters );

			Storage.Catalog.initialized = false;
			await update_catalog();
			return;
		}


		//=====================================================================
		async function SQL_Query( Criteria, MaxDocs = 0 )
		{
			// Convert criteria to an sql expression.
			let sql_expression_options = {
				StringLiteralQuotes: '"',
				IdentifierQuotes: '`',
				AllowedFields: {},
			};
			for ( let key in Storage.Catalog.fields )
			{
				let field = Storage.Catalog.fields[ key ];
				if ( field.is_auto_increment ) { continue; }
				if ( !'bns'.includes( field.short_type ) ) { continue; }
				sql_expression_options.AllowedFields[ key ] = field;
			}
			let sql_expr = jsonstor.SqlExpression( Criteria, sql_expression_options );

			// Build sql statement.
			let sql = `SELECT * FROM ??.??`;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];
			if ( sql_expr ) { sql += ' WHERE ' + sql_expr; }

			// Get results.
			let results = await SQL_Passthrough( sql, sql_parameters );
			let documents = results.results;

			// Do the actual query filtering here.
			let filtered = [];
			for ( let index = 0; index < documents.length; index++ )
			{
				let document = jsongin.Unhybridize( documents[ index ] );
				if ( jsongin.Query( document, Criteria ) )
				{
					filtered.push( document );
					if ( MaxDocs && ( filtered.length === MaxDocs ) ) { break; }
				}
			}

			// Return the results.
			return filtered;
		}


		//=====================================================================
		async function SQL_Insert( Document )
		{
			if ( !Document ) { return null; }
			await update_catalog();
			if ( Storage.Settings.ModifySchema ) { await update_table_schema( Document ); }


			// Get the _id field.
			if ( !Storage.Catalog.id_field ) { throw new Error( `Cannot insert rows into table [${Storage.Settings.Database}.${Storage.Settings.Table}], an auto-increment, primary key field was not found. ` ); }

			let sql = `INSERT INTO ??.??`;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];

			// Scan for the column list.
			let tokens = [];
			let columns = [];
			let hybrid = jsongin.Hybridize( Document );
			for ( let key in hybrid )
			{
				if ( key.includes( '.' ) ) { continue; }
				tokens.push( '??' );
				columns.push( key );
				sql_parameters.push( key );
			}
			if ( columns.length === 0 ) { return null; }
			sql += ` ( ${tokens.join( ', ' )} )`;

			// Get the values to insert.
			tokens = [];
			for ( let index = 0; index < columns.length; index++ )
			{
				let value = hybrid[ columns[ index ] ];
				tokens.push( '?' );
				sql_parameters.push( value );
			}
			sql += ` VALUES `;
			sql += ` ( ${tokens.join( ', ' )} )`;

			// Get results.
			let results = await SQL_Passthrough( sql, sql_parameters );
			if ( results.results.affectedRows === 0 ) { return null; }

			sql = `SELECT * FROM ??.?? WHERE (?? = ?)`;
			sql_parameters = [
				Storage.Settings.Database,
				Storage.Settings.Table,
				Storage.Catalog.id_field,
				results.results.insertId,
			];

			results = await SQL_Passthrough( sql, sql_parameters );
			let documents = results.results;
			if ( !documents ) { return null; }
			if ( !documents.length ) { return null; }

			let document = jsongin.Unhybridize( documents[ 0 ] );
			return document;
		}


		//=====================================================================
		async function SQL_Update( Document )
		{
			if ( !Document ) { return null; }
			await update_catalog();
			if ( Storage.Settings.ModifySchema ) { await update_table_schema( Document ); }

			// Get the _id field.
			if ( !Storage.Catalog.id_field ) { throw new Error( `Cannot update rows into table [${Storage.Settings.Database}.${Storage.Settings.Table}], an auto-increment, primary key field was not found.` ); }
			if ( !Document[ Storage.Catalog.id_field ] ) { throw new Error( `Cannot update this document, it is missing the id field [${Storage.Catalog.id_field}].` ); }

			let sql = `UPDATE ??.?? SET `;
			let sql_parameters = [ Storage.Settings.Database, Storage.Settings.Table ];

			// Build the sql update statement.
			let tokens = [];
			let columns = [];
			let hybrid = jsongin.Hybridize( Document );
			for ( let key in hybrid )
			{
				if ( key.includes( '.' ) ) { continue; }
				if ( key === Storage.Catalog.id_field ) { continue; }
				tokens.push( '?? = ?' );
				sql_parameters.push( key );
				sql_parameters.push( hybrid[ key ] );
			}
			if ( tokens.length === 0 ) { return null; }
			sql += tokens.join( ', ' );
			sql += ' WHERE (?? = ?)';
			sql_parameters.push( Storage.Catalog.id_field );
			sql_parameters.push( hybrid[ Storage.Catalog.id_field ] );

			// Get results.
			let results = await SQL_Passthrough( sql, sql_parameters );
			if ( results.results.affectedRows === 0 ) { return null; }

			sql = `SELECT * FROM ??.?? WHERE (?? = ?)`;
			sql_parameters = [
				Storage.Settings.Database,
				Storage.Settings.Table,
				Storage.Catalog.id_field,
				hybrid[ Storage.Catalog.id_field ],
			];

			results = await SQL_Passthrough( sql, sql_parameters );
			let documents = results.results;
			if ( !documents ) { return null; }
			if ( !documents.length ) { return null; }

			let document = jsongin.Unhybridize( documents[ 0 ] );
			return document;
		}


		//=====================================================================
		async function SQL_Delete( Document )
		{
			if ( !Document ) { return null; }
			await update_catalog();

			// Get the _id field.
			if ( !Storage.Catalog.id_field ) { throw new Error( `Cannot delete rows from table [${Storage.Settings.Database}.${Storage.Settings.Table}], an auto-increment, primary key field was not found.` ); }
			if ( !Document[ Storage.Catalog.id_field ] ) { throw new Error( `Cannot delete this document, it is missing the id field [${Storage.Catalog.id_field}].` ); }

			let sql = `DELETE FROM ??.?? WHERE (?? = ?) `;
			let sql_parameters = [
				Storage.Settings.Database,
				Storage.Settings.Table,
				Storage.Catalog.id_field,
				Document[ Storage.Catalog.id_field ],
			];

			// Get results.
			let results = await SQL_Passthrough( sql, sql_parameters );
			if ( results.results.affectedRows === 0 ) { return false; }

			return true;
		}


		//=====================================================================
		// DropStorage
		//=====================================================================


		Storage.DropStorage = async function ( Options ) 
		{
			try
			{
				let sql = `DROP TABLE ??.??`;
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
			let documents = await SQL_Query( Criteria, 0 );
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
			let documents = await SQL_Query( Criteria, 1 );
			if ( Options.ReturnDocuments ) 
			{
				if ( !documents.length ) { return null; }
				if ( Projection )
				{
					documents[ 0 ] = jsongin.Project( documents[ 0 ], Projection );
				}
				return documents[ 0 ];
			}
			else 
			{
				return documents.length;
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// FindMany
		//=====================================================================


		Storage.FindMany = async function FindMany( Criteria, Projection, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 0 );
			if ( Options.ReturnDocuments ) 
			{
				if ( Projection )
				{
					for ( let index = 0; index < documents.length; index++ )
					{
						documents[ index ] = jsongin.Project( documents[ index ], Projection );
					}
				}
				return documents;
			}
			else 
			{
				return documents.length;
			}
			return; // Unreachable code.
		};


		//=====================================================================
		// UpdateOne
		//=====================================================================


		Storage.UpdateOne = async function UpdateOne( Criteria, Update, Options = {} ) 
		{
			let documents = await SQL_Query( Criteria, 1 );
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
			let documents = await SQL_Query( Criteria, 0 );
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
			let documents = await SQL_Query( Criteria, 1 );
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
			let documents = await SQL_Query( Criteria, 1 );
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
			let documents = await SQL_Query( Criteria, 0 );
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


