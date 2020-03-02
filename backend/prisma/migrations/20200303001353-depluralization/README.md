# Migration `20200303001353-depluralization`

This migration has been generated by Rostislav Klein at 3/3/2020, 12:13:53 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `db`.`ImagePreview` (
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `createdBy` varchar(191) NOT NULL ,
    `id` varchar(191) NOT NULL  ,
    `name` varchar(191)   ,
    `orderItem` varchar(191) NOT NULL ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `url` varchar(191) NOT NULL DEFAULT '' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `db`.`ImagePreview` ADD FOREIGN KEY (`createdBy`) REFERENCES `db`.`User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE

ALTER TABLE `db`.`ImagePreview` ADD FOREIGN KEY (`orderItem`) REFERENCES `db`.`OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE

DROP TABLE `db`.`ImagePreviews`;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200303000057-nullable-order-fields..20200303001353-depluralization
--- datamodel.dml
+++ datamodel.dml
@@ -6,14 +6,14 @@
 // The `url` field must contain the connection string to your DB.
 // Learn more about connection strings for your DB: https://pris.ly/connection-strings
 datasource db {
   provider = "mysql"
-  url = "***"
+  url      = env("MYSQL_URL")
 }
 // Other examples for connection strings are:
-// SQLite: url = "***"
-// MySQL:  url = "***"
+// SQLite: url = "sqlite:./dev.db"
+// MySQL:  url = "mysql://johndoe:johndoe@localhost:3306/mydb"
 // You can also use environment variables to specify the connection string: https://pris.ly/prisma-schema#using-environment-variables
 // By adding the `generator` block, you specify that you want to generate Prisma's DB client.
 // The client is generated by runnning the `prisma generate` command and will be located in `node_modules/@prisma` and can be imported in your code as:
@@ -82,9 +82,9 @@
   updatedAt  DateTime @updatedAt
   createdBy  User
 }
-model ImagePreviews {
+model ImagePreview {
   id        String    @id @default(cuid())
   name      String?
   url       String
   orderItem OrderItem
```

