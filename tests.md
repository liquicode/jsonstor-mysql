# @liquicode/jsonstor-mysql

> Documents are stored in a MySql database.

# Test Results

| Section                       |             mysql |
|-------------------------------|------------------:|
| A) CRUD Tests                 |      10/0 (5.53s) |
| B) Rainbow Query Tests        |      24/3 (295ms) |
| C) UserInfo Permissions Tests |       7/0 (973ms) |
| D) Engine Contract Tests      |       9/0 (197ms) |
| M) MongoDB Tutorial           |       20/6 (97ms) |
| N) MongoDB Reference          |     28/11 (598ms) |
| Z) Ad-Hoc Tests               |       1/1 (109ms) |
| **total**                     | **99/21** (7.80s) |

***21 failing.***

1. `jsonstor-mysql Tests B) Rainbow Query Tests Operator $eq (===) should perform strict equality (===) on 'o'`
   - The expression evaluated to a falsy value:    assert.ok( result.length === 1 )
2. `jsonstor-mysql Tests B) Rainbow Query Tests Operator $eq (===) should perform strict equality (===) on 'a'`
   - false == true
3. `jsonstor-mysql Tests B) Rainbow Query Tests Operator $ne (!==) should not perform loose inequality (!=) on 'bns'`
   - false == true
4. `jsonstor-mysql Tests M) MongoDB Tutorial Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/) Match an Array Match an Array Exactly`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 1 )
5. `jsonstor-mysql Tests M) MongoDB Tutorial Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/) Query an Array for an Element Match a Single Array Element`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 4 )
6. `jsonstor-mysql Tests M) MongoDB Tutorial Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/) Query an Array for an Element Match Array Elements by Comparison`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 1 )
7. `jsonstor-mysql Tests M) MongoDB Tutorial Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/) Specify Multiple Conditions for Array Elements Query an Array with Compound Filter Conditions on the Array Elements`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 4 )
8. `jsonstor-mysql Tests M) MongoDB Tutorial Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/) Type Check Match Fields that Exist And are Null`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 1 )
9. `jsonstor-mysql Tests M) MongoDB Tutorial Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/) Existence Check Match Fields that are Missing`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 1 )
10. `jsonstor-mysql Tests N) MongoDB Reference Comparison Query Operators Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/) Equals an Array Value Match an Array Element Using Implicit $eq`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 2 )
11. `jsonstor-mysql Tests N) MongoDB Reference Comparison Query Operators Comparison Operator: $in (https://www.mongodb.com/docs/manual/reference/operator/query/in/) Use the $in Operator to Match Values in an Array`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 3 )
12. `jsonstor-mysql Tests N) MongoDB Reference Comparison Query Operators Comparison Operator: $nin (https://www.mongodb.com/docs/manual/reference/operator/query/nin/) Select on Unmatching Documents`
   - The expression evaluated to a falsy value:    assert.ok( results[ 1 ].quantity === undefined )
13. `jsonstor-mysql Tests N) MongoDB Reference Logical Query Operators Logical Operator: $and (https://www.mongodb.com/docs/manual/reference/operator/query/and/) AND Queries With Multiple Expressions Specifying the Same Field`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 3 )
14. `jsonstor-mysql Tests N) MongoDB Reference Logical Query Operators Logical Operator: $not (https://www.mongodb.com/docs/manual/reference/operator/query/not/) Match Document Fields`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 2 )
15. `jsonstor-mysql Tests N) MongoDB Reference Logical Query Operators Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/) $nor Query with Two Expressions`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 2 )
16. `jsonstor-mysql Tests N) MongoDB Reference Logical Query Operators Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/) $nor and $exists`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 1 )
17. `jsonstor-mysql Tests N) MongoDB Reference Element Query Operators Element Query Operator: $exists (https://www.mongodb.com/docs/manual/reference/operator/query/exists/) Null Values`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 7 )
18. `jsonstor-mysql Tests N) MongoDB Reference Element Query Operators Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/) Querying by Data Type (BSON Code)`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 2 /* string */ )
19. `jsonstor-mysql Tests N) MongoDB Reference Element Query Operators Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/) Querying by Data Type (BSON Alias)`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 2 )
20. `jsonstor-mysql Tests N) MongoDB Reference Element Query Operators Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/) Querying by Data Type ("number")`
   - The expression evaluated to a falsy value:    assert.ok( results.length === 3 )
21. `jsonstor-mysql Tests Z) Ad-Hoc Tests should not match explicit nested fields`
   - Data truncated for column '_id' at row 1
