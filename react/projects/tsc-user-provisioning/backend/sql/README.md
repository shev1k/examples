# TSC SQL Schema

## 10/18/2022 Comments 
There are 3 new SQL files in the /SQL folder.
Run them in your local MySQL instance to create and populate the users table.
Run the files in the following order:

1. create_database.sql
2. create_users_table.sql
3. insert_test_users.sql

The users table will generate a new UUID for each record.
For this test data, the password value is an MD5 hash of the string 'welcome'. 
UPDATE: However--going forward we agreed to use SHA-256 hashing for passwords at rest in the database

Use this data for development and testing of the UI pages including the login sequence.