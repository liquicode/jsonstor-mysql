# @liquicode/jsonstor-mysql

> Documents are stored in a MySql database.

# Test Results

```
> @liquicode/jsonstor-mysql@0.0.20 test
> mocha -u bdd test/*.js --timeout 0 --slow 10 --colors



  jsonstor-mysql Tests
    A) CRUD Tests
      ✔ should insert 100 documents, one at a time (1367ms)
      ✔ should delete 100 documents, all at once (597ms)
      ✔ should insert 100 documents, all at once (990ms)
      ✔ should read 100 documents, one at a time (502ms)
      ✔ should replace 100 documents, one at a time (1960ms)
      ✔ should read 100 documents, all at once (7ms)
      ✔ should read 5 documents, all at once and sorted (7ms)
      ✔ should update 100 documents, one at a time (1356ms)
      ✔ should update 100 documents, all at once (932ms)
      ✔ should delete 100 documents, one at a time (952ms)
    B) Rainbow Tests
      Nested Fields (explicit)
        ✔ should not perform matching on nested fields using implicit $eq
        ✔ should not perform matching on nested fields using explicit $eq (6ms)
      Nested Fields (dot notation)
        1) should perform matching on nested fields using implicit $eq and dot notation
        2) should perform matching on nested fields using explicit $eq and dot notation
      Operator $eq (===)
        3) should perform strict equality (===) on 'bns'
        4) should perform strict equality (===) on 'o'
        5) should perform strict equality (===) on 'a'
        ✔ should not perform loose equality (==) on 'bns' (30ms)
        6) should not perform loose equality (==) on 'o'
        7) should not perform loose equality (==) on 'a'
        8) should equate null with an undefined field
      Operator $ne (!==)
        9) should perform strict inequality (!==) on 'bns'
        10) should perform strict inequality (!==) on 'o'
        11) should perform strict inequality (!==) on 'a'
        12) should not perform loose inequality (!=) on 'bns'
        13) should not perform loose inequality (!=) on 'o'
        14) should not perform loose inequality (!=) on 'a'
      Operator $gte (>=)
        15) should perform strict comparison (>=) on 'bns'
        ✔ should not perform loose comparison (>=) on 'bns' (20ms)
        16) should equate null with an undefined field
      Operator $gt (>)
        17) should perform strict comparison (>=) on 'bns'
        ✔ should not perform loose comparison (>=) on 'bns' (13ms)
      Operator $lte (<=)
        18) should perform strict comparison (<=) on 'bns'
        ✔ should not perform loose comparison (<=) on 'bns' (14ms)
        19) should equate null with an undefined field
      Operator $lt (<)
        20) should perform strict comparison (<) on 'bns'
        ✔ should not perform loose comparison (<) on 'bns' (16ms)
    C) UserInfo Permissions Tests
      Alice, Bob, and Eve scenario
        ✔ Should add documents and set permissions (173ms)
        ✔ Alice should read all documents and write all documents (269ms)
        ✔ Bob should read some documents and write some documents (229ms)
        ✔ Eve should read some documents and write some documents (219ms)
        ✔ Public objects should be readable by everyone (179ms)
        ✔ Public objects should only be writable by the owner (256ms)
        ✔ Should not allow readers to update documents (224ms)
    D) Engine Contract Tests
      ✔ should refuse a criteria naming an unknown operator (38ms)
      21) should refuse a criteria which is not an object
      ✔ should refuse an update naming an unknown operator
      ✔ should refuse an update which cannot be applied
      22) should not alias a FindOne result to the stored document
      23) should not alias a FindMany result to the stored documents
      24) should sort a missing field and a null below every value
      25) should reverse that order when sorting descending
      26) should limit the result to MaxCount after sorting
    M) MongoDB Tutorial
      Query Documents (https://www.mongodb.com/docs/manual/tutorial/query-documents/)
        Select All Documents in a Collection
          ✔ Match All Documents with an Empty Object {}
        Specify Equality Condition
          ✔ Match Fields with Implicit Equality
        Specify Conditions Using Query Operators
          ✔ Match Fields with an Array of Possible Values
        Specify AND Conditions
          ✔ Match Fields with an Array of Possible Values
        Specify OR Conditions
          ✔ Match Fields against an Array of Possible Values
        Specify AND as well as OR Conditions
          ✔ Match Fields Using AND and OR
      Query on Embedded/Nested Documents (https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/)
        Query on Embedded/Nested Documents
          ✔ Specify Equality Match on a Nested Field
          ✔ Specify Match using Query Operator (7ms)
          ✔ Specify AND Condition
        Match an Embedded/Nested Document
          ✔ Specify Equality Match on an Embedded Document (9ms)
      Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
        Match an Array
          27) Match an Array Exactly
          28) Match Array Elements
        Query an Array for an Element
          29) Match a Single Array Element
          30) Match Array Elements by Comparison
        Specify Multiple Conditions for Array Elements
          31) Query an Array with Compound Filter Conditions on the Array Elements
          32) Query for an Array Element that Meets Multiple Criteria
          ✔ Query for an Element by the Array Index Position
          33) Query an Array by Array Length
      Query an Array of Embedded Documents (https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/)
        Query for a Document Nested in an Array
          ✔ Match a Document Exactly
        Specify a Query Condition on a Field in an Array of Documents
          ✔ Specify a Query Condition on a Field Embedded in an Array of Documents (7ms)
          ✔ Use the Array Index to Query for a Field in the Embedded Document
        Specify Multiple Conditions for Array of Documents
          34) A Single Nested Document Meets Multiple Query Conditions on Nested Fields
          ✔ Combination of Elements Satisfies the Criteria (10ms)
      Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)
        Equality Filter
          35) Match Fields that are Null or Missing
        Type Check
          36) Match Fields that Exist And are Null
        Existence Check
          37) Match Fields that are Missing
    N) MongoDB Reference
      Comparison Query Operators
        Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
          Equals an Array Value
            38) Match an Array Element
            39) Match an Array Element Using Implicit $eq
          Regex Match Behaviour
            ✔ $eq match on a string (8ms)
            ✔ $eq match on a regular expression
            40) Use the $in Operator with a Regular Expression
        Comparison Operator: $gt (https://www.mongodb.com/docs/manual/reference/operator/query/gt/)
          ✔ Match Document Fields
        Comparison Operator: $gte (https://www.mongodb.com/docs/manual/reference/operator/query/gte/)
          ✔ Match Document Fields
        Comparison Operator: $in (https://www.mongodb.com/docs/manual/reference/operator/query/in/)
          ✔ Use the $in Operator to Match Values
          41) Use the $in Operator to Match Values in an Array
          42) Use the $in Operator with a Regular Expression
        Comparison Operator: $lt (https://www.mongodb.com/docs/manual/reference/operator/query/lt/)
          ✔ Match Document Fields (11ms)
        Comparison Operator: $lte (https://www.mongodb.com/docs/manual/reference/operator/query/lte/)
          ✔ Match Document Fields (6ms)
        Comparison Operator: $ne (https://www.mongodb.com/docs/manual/reference/operator/query/ne/)
          ✔ Match Document Fields (6ms)
        Comparison Operator: $nin (https://www.mongodb.com/docs/manual/reference/operator/query/nin/)
          43) Select on Unmatching Documents
          ✔ Select on Elements Not in an Array (6ms)
      Logical Query Operators
        Logical Operator: $and (https://www.mongodb.com/docs/manual/reference/operator/query/and/)
          44) AND Queries With Multiple Expressions Specifying the Same Field
          45) AND Queries With Multiple Expressions Specifying the Same Operator
        Logical Operator: $not (https://www.mongodb.com/docs/manual/reference/operator/query/not/)
          46) Match Document Fields
          47) $not and Regular Expressions
        Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
          48) $nor Query with Two Expressions
          49) $nor and Additional Comparisons
          50) $nor and $exists
        Logical Operator: $or (https://www.mongodb.com/docs/manual/reference/operator/query/or/)
          ✔ Match Document Fields (6ms)
          ✔ $or versus $in (11ms)
          ✔ Nested $or Clauses (6ms)
      Element Query Operators
        Element Query Operator: $exists (https://www.mongodb.com/docs/manual/reference/operator/query/exists/)
          51) Exists and Not Equal To
          52) Null Values
        Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
          53) Querying by Data Type (BSON Code)
          54) Querying by Data Type (BSON Alias)
          55) Querying by Data Type ("number")
          56) Querying by Multiple Data Type (BSON Code)
          57) Querying by Multiple Data Type (BSON Alias)
      Array Query Operators
        Array Query Operator: $all (https://www.mongodb.com/docs/manual/reference/operator/query/all/)
          58) Use $all to Match Values
          59) Use $all with $elemMatch
          ✔ Use $all with Scalar Values
        Array Query Operator: $elemMatch (https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/)
          60) Element Match
          61) Array of Embedded Documents
          62) Single Query Condition
        Array Query Operator: $size (https://www.mongodb.com/docs/manual/reference/operator/query/size/)
          63) Use $size to Match Array Sizes
    Z) Ad-Hoc Tests
      64) should not match explicit nested fields
      ✔ should sort and limit in FindMany2 (131ms)


  56 passing (14s)
  64 failing

  1) jsonstor-mysql Tests
       B) Rainbow Tests
         Nested Fields (dot notation)
           should perform matching on nested fields using implicit $eq and dot notation:

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:127:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  2) jsonstor-mysql Tests
       B) Rainbow Tests
         Nested Fields (dot notation)
           should perform matching on nested fields using explicit $eq and dot notation:

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:132:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  3) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $eq (===)
           should perform strict equality (===) on 'bns':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:153:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  4) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $eq (===)
           should perform strict equality (===) on 'o':

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( result.length === 1 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:183:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  5) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $eq (===)
           should perform strict equality (===) on 'a':
     Error: SqlExpression: Invalid array value.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:110:14)
      at get_operation_expression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:42:11)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:194:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:207:32)
      at process.processImmediate (node:internal/timers:485:21)

  6) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $eq (===)
           should not perform loose equality (==) on 'o':
     Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ')))' at line 1
      at Packet.asError (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packets\packet.js:833:17)
      at Query.execute (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\commands\command.js:29:26)
      at Connection.handlePacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:555:34)
      at PacketParser.onPacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:104:12)
      at PacketParser.executeStart (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packet_parser.js:75:16)
      at Socket.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:112:25)
      at Socket.emit (node:events:519:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23)

  7) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $eq (===)
           should not perform loose equality (==) on 'a':
     Error: SqlExpression: Invalid array value.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:110:14)
      at get_operation_expression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:42:11)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:194:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:286:32)
      at process.processImmediate (node:internal/timers:485:21)

  8) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $eq (===)
           should equate null with an undefined field:

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:321:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  9) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $ne (!==)
           should perform strict inequality (!==) on 'bns':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:354:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  10) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $ne (!==)
           should perform strict inequality (!==) on 'o':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:362:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  11) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $ne (!==)
           should perform strict inequality (!==) on 'a':
     Error: SqlExpression: Invalid array value.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:110:14)
      at get_operation_expression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:42:11)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:205:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:381:32)
      at process.processImmediate (node:internal/timers:485:21)

  12) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $ne (!==)
           should not perform loose inequality (!=) on 'bns':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:401:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  13) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $ne (!==)
           should not perform loose inequality (!=) on 'o':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:409:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  14) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $ne (!==)
           should not perform loose inequality (!=) on 'a':
     Error: SqlExpression: Invalid array value.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:110:14)
      at get_operation_expression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:42:11)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:205:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:428:32)
      at process.processImmediate (node:internal/timers:485:21)

  15) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $gte (>=)
           should perform strict comparison (>=) on 'bns':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:460:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  16) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $gte (>=)
           should equate null with an undefined field:

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:482:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  17) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $gt (>)
           should perform strict comparison (>=) on 'bns':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:501:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  18) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $lte (<=)
           should perform strict comparison (<=) on 'bns':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:530:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  19) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $lte (<=)
           should equate null with an undefined field:

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:548:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  20) jsonstor-mysql Tests
       B) Rainbow Tests
         Operator $lt (<)
           should perform strict comparison (<) on 'bns':

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\B) Rainbow Query Tests.js:567:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  21) jsonstor-mysql Tests
       D) Engine Contract Tests
         should refuse a criteria which is not an object:
     AssertionError [ERR_ASSERTION]: Missing expected rejection.
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\D) Engine Contract Tests.js:70:4)

  22) jsonstor-mysql Tests
       D) Engine Contract Tests
         should not alias a FindOne result to the stored document:
     TypeError: Cannot create property 'value' on number '1'
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\D) Engine Contract Tests.js:103:19)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  23) jsonstor-mysql Tests
       D) Engine Contract Tests
         should not alias a FindMany result to the stored documents:
     AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

undefined !== 1

      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\D) Engine Contract Tests.js:119:11)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  24) jsonstor-mysql Tests
       D) Engine Contract Tests
         should sort a missing field and a null below every value:
     AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

undefined !== 5

      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\D) Engine Contract Tests.js:148:11)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  25) jsonstor-mysql Tests
       D) Engine Contract Tests
         should reverse that order when sorting descending:
     AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

undefined !== 5

      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\D) Engine Contract Tests.js:168:11)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  26) jsonstor-mysql Tests
       D) Engine Contract Tests
         should limit the result to MaxCount after sorting:
     AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

undefined !== 2

      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\D) Engine Contract Tests.js:183:11)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  27) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
           Match an Array
             Match an Array Exactly:
     Error: Operand should contain 1 column(s)
      at Packet.asError (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packets\packet.js:833:17)
      at Query.execute (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\commands\command.js:29:26)
      at Connection.handlePacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:555:34)
      at PacketParser.onPacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:104:12)
      at PacketParser.executeStart (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packet_parser.js:75:16)
      at Socket.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:112:25)
      at Socket.emit (node:events:519:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23)

  28) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
           Match an Array
             Match Array Elements:
     Error: SqlExpression: Invalid operator [$all] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:420:30)
      at process.processImmediate (node:internal/timers:485:21)

  29) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
           Query an Array for an Element
             Match a Single Array Element:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 4 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:447:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  30) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
           Query an Array for an Element
             Match Array Elements by Comparison:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 1 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:463:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  31) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
           Specify Multiple Conditions for Array Elements
             Query an Array with Compound Filter Conditions on the Array Elements:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 4 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:485:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  32) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
           Specify Multiple Conditions for Array Elements
             Query for an Array Element that Meets Multiple Criteria:
     Error: SqlExpression: Invalid operator [$elemMatch] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:493:30)
      at process.processImmediate (node:internal/timers:485:21)

  33) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
           Specify Multiple Conditions for Array Elements
             Query an Array by Array Length:
     Error: SqlExpression: Invalid operator [$size] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:515:30)
      at process.processImmediate (node:internal/timers:485:21)

  34) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query an Array of Embedded Documents (https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/)
           Specify Multiple Conditions for Array of Documents
             A Single Nested Document Meets Multiple Query Conditions on Nested Fields:
     Error: SqlExpression: Invalid operator [$elemMatch] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:650:30)
      at process.processImmediate (node:internal/timers:485:21)

  35) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)
           Equality Filter
             Match Fields that are Null or Missing:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 2 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:739:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  36) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)
           Type Check
             Match Fields that Exist And are Null:
     Error: SqlExpression: Invalid operator [$type] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:754:30)
      at process.processImmediate (node:internal/timers:485:21)

  37) jsonstor-mysql Tests
       M) MongoDB Tutorial
         Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)
           Existence Check
             Match Fields that are Missing:
     Error: SqlExpression: Invalid operator [$exists] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\M) MongoDB Tutorial.js:772:30)
      at process.processImmediate (node:internal/timers:485:21)

  38) jsonstor-mysql Tests
       N) MongoDB Reference
         Comparison Query Operators
           Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
             Equals an Array Value
               Match an Array Element:
     Error: Operand should contain 1 column(s)
      at Packet.asError (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packets\packet.js:833:17)
      at Query.execute (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\commands\command.js:29:26)
      at Connection.handlePacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:555:34)
      at PacketParser.onPacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:104:12)
      at PacketParser.executeStart (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packet_parser.js:75:16)
      at Socket.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:112:25)
      at Socket.emit (node:events:519:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23)

  39) jsonstor-mysql Tests
       N) MongoDB Reference
         Comparison Query Operators
           Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
             Equals an Array Value
               Match an Array Element Using Implicit $eq:
     Error: Operand should contain 1 column(s)
      at Packet.asError (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packets\packet.js:833:17)
      at Query.execute (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\commands\command.js:29:26)
      at Connection.handlePacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:555:34)
      at PacketParser.onPacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:104:12)
      at PacketParser.executeStart (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packet_parser.js:75:16)
      at Socket.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:112:25)
      at Socket.emit (node:events:519:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23)

  40) jsonstor-mysql Tests
       N) MongoDB Reference
         Comparison Query Operators
           Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
             Regex Match Behaviour
               Use the $in Operator with a Regular Expression:
     Error: SqlExpression: The Criteria [{}] is invalid.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:324:19)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:146:31)
      at process.processImmediate (node:internal/timers:485:21)

  41) jsonstor-mysql Tests
       N) MongoDB Reference
         Comparison Query Operators
           Comparison Operator: $in (https://www.mongodb.com/docs/manual/reference/operator/query/in/)
             Use the $in Operator to Match Values in an Array:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 3 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:292:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  42) jsonstor-mysql Tests
       N) MongoDB Reference
         Comparison Query Operators
           Comparison Operator: $in (https://www.mongodb.com/docs/manual/reference/operator/query/in/)
             Use the $in Operator with a Regular Expression:
     Error: SqlExpression: Invalid array value.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:110:14)
      at get_operation_expression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:42:11)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:255:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:302:30)
      at process.processImmediate (node:internal/timers:485:21)

  43) jsonstor-mysql Tests
       N) MongoDB Reference
         Comparison Query Operators
           Comparison Operator: $nin (https://www.mongodb.com/docs/manual/reference/operator/query/nin/)
             Select on Unmatching Documents:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 2 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:473:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  44) jsonstor-mysql Tests
       N) MongoDB Reference
         Logical Query Operators
           Logical Operator: $and (https://www.mongodb.com/docs/manual/reference/operator/query/and/)
             AND Queries With Multiple Expressions Specifying the Same Field:
     Error: SqlExpression: Invalid operator [$exists] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at get_expression_array (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:61:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:136:33)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:550:30)
      at process.processImmediate (node:internal/timers:485:21)

  45) jsonstor-mysql Tests
       N) MongoDB Reference
         Logical Query Operators
           Logical Operator: $and (https://www.mongodb.com/docs/manual/reference/operator/query/and/)
             AND Queries With Multiple Expressions Specifying the Same Operator:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 1 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:600:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  46) jsonstor-mysql Tests
       N) MongoDB Reference
         Logical Query Operators
           Logical Operator: $not (https://www.mongodb.com/docs/manual/reference/operator/query/not/)
             Match Document Fields:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 2 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:620:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  47) jsonstor-mysql Tests
       N) MongoDB Reference
         Logical Query Operators
           Logical Operator: $not (https://www.mongodb.com/docs/manual/reference/operator/query/not/)
             $not and Regular Expressions:
     Error: SqlExpression: The Criteria [{}] is invalid.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:324:19)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:183:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:630:30)
      at process.processImmediate (node:internal/timers:485:21)

  48) jsonstor-mysql Tests
       N) MongoDB Reference
         Logical Query Operators
           Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
             $nor Query with Two Expressions:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 2 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:687:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  49) jsonstor-mysql Tests
       N) MongoDB Reference
         Logical Query Operators
           Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
             $nor and Additional Comparisons:

      AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok( results.length === 2 )

      + expected - actual

      -false
      +true
      
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:707:13)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  50) jsonstor-mysql Tests
       N) MongoDB Reference
         Logical Query Operators
           Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
             $nor and $exists:
     Error: SqlExpression: Invalid operator [$exists] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at get_expression_array (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:61:22)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:168:33)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:716:30)
      at process.processImmediate (node:internal/timers:485:21)

  51) jsonstor-mysql Tests
       N) MongoDB Reference
         Element Query Operators
           Element Query Operator: $exists (https://www.mongodb.com/docs/manual/reference/operator/query/exists/)
             Exists and Not Equal To:
     Error: SqlExpression: Invalid operator [$exists] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:836:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  52) jsonstor-mysql Tests
       N) MongoDB Reference
         Element Query Operators
           Element Query Operator: $exists (https://www.mongodb.com/docs/manual/reference/operator/query/exists/)
             Null Values:
     Error: SqlExpression: Invalid operator [$exists] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:864:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  53) jsonstor-mysql Tests
       N) MongoDB Reference
         Element Query Operators
           Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
             Querying by Data Type (BSON Code):
     Error: SqlExpression: Invalid operator [$type] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:911:30)
      at process.processImmediate (node:internal/timers:485:21)

  54) jsonstor-mysql Tests
       N) MongoDB Reference
         Element Query Operators
           Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
             Querying by Data Type (BSON Alias):
     Error: SqlExpression: Invalid operator [$type] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:938:30)
      at process.processImmediate (node:internal/timers:485:21)

  55) jsonstor-mysql Tests
       N) MongoDB Reference
         Element Query Operators
           Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
             Querying by Data Type ("number"):
     Error: SqlExpression: Invalid operator [$type] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:965:30)
      at process.processImmediate (node:internal/timers:485:21)

  56) jsonstor-mysql Tests
       N) MongoDB Reference
         Element Query Operators
           Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
             Querying by Multiple Data Type (BSON Code):
     Error: SqlExpression: Invalid operator [$type] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:992:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  57) jsonstor-mysql Tests
       N) MongoDB Reference
         Element Query Operators
           Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
             Querying by Multiple Data Type (BSON Alias):
     Error: SqlExpression: Invalid operator [$type] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:1016:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  58) jsonstor-mysql Tests
       N) MongoDB Reference
         Array Query Operators
           Array Query Operator: $all (https://www.mongodb.com/docs/manual/reference/operator/query/all/)
             Use $all to Match Values:
     Error: SqlExpression: Invalid operator [$all] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:1094:30)
      at process.processImmediate (node:internal/timers:485:21)

  59) jsonstor-mysql Tests
       N) MongoDB Reference
         Array Query Operators
           Array Query Operator: $all (https://www.mongodb.com/docs/manual/reference/operator/query/all/)
             Use $all with $elemMatch:
     Error: SqlExpression: Invalid operator [$all] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:1108:30)
      at process.processImmediate (node:internal/timers:485:21)

  60) jsonstor-mysql Tests
       N) MongoDB Reference
         Array Query Operators
           Array Query Operator: $elemMatch (https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/)
             Element Match:
     Error: SqlExpression: Invalid operator [$elemMatch] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:1157:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  61) jsonstor-mysql Tests
       N) MongoDB Reference
         Array Query Operators
           Array Query Operator: $elemMatch (https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/)
             Array of Embedded Documents:
     Error: SqlExpression: Invalid operator [$elemMatch] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:1179:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  62) jsonstor-mysql Tests
       N) MongoDB Reference
         Array Query Operators
           Array Query Operator: $elemMatch (https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/)
             Single Query Condition:
     Error: SqlExpression: Invalid operator [$elemMatch] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:1201:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  63) jsonstor-mysql Tests
       N) MongoDB Reference
         Array Query Operators
           Array Query Operator: $size (https://www.mongodb.com/docs/manual/reference/operator/query/size/)
             Use $size to Match Array Sizes:
     Error: SqlExpression: Invalid operator [$size] found at this level. Expected a logical operator.
      at SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:274:16)
      at Object.SqlExpression (W:\code-projects\orgs\liquicode\jsonx\jsonstor.git\src\jsonstor\SqlExpression.js:295:16)
      at SQL_Query (src\jsonstor-mysql.js:383:28)
      at Object.FindMany (src\jsonstor-mysql.js:682:26)
      at Context.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\jsonstor-docs.git\src\Storage Tests\N) MongoDB Reference.js:1244:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

  64) jsonstor-mysql Tests
       Z) Ad-Hoc Tests
         should not match explicit nested fields:
     Error: Data truncated for column '_id' at row 1
      at Packet.asError (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packets\packet.js:833:17)
      at Query.execute (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\commands\command.js:29:26)
      at Connection.handlePacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:555:34)
      at PacketParser.onPacket (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:104:12)
      at PacketParser.executeStart (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\packet_parser.js:75:16)
      at Socket.<anonymous> (W:\code-projects\orgs\liquicode\jsonx\node_modules\mysql2\lib\base\connection.js:112:25)
      at Socket.emit (node:events:519:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23)



Unknown column 'f' in 'field list'
npm error Lifecycle script `test` failed with error:
npm error code 64
npm error path W:\code-projects\orgs\liquicode\jsonx\jsonstor-mysql.git
npm error workspace @liquicode/jsonstor-mysql@0.0.20
npm error location W:\code-projects\orgs\liquicode\jsonx\jsonstor-mysql.git
npm error command failed
npm error command C:\Windows\system32\cmd.exe /d /s /c mocha -u bdd test/*.js --timeout 0 --slow 10 --colors
```
