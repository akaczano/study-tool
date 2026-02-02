/*
  Warnings:

  - You are about to drop the column `decription` on the `tags` table. All the data in the column will be lost.
  - Added the required column `description` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);
INSERT INTO "new_tags" ("id") SELECT "id" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
