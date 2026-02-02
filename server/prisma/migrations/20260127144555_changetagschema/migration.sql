/*
  Warnings:

  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tags` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__TagToTerm" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TagToTerm_A_fkey" FOREIGN KEY ("A") REFERENCES "tags" ("description") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagToTerm_B_fkey" FOREIGN KEY ("B") REFERENCES "terms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__TagToTerm" ("A", "B") SELECT "A", "B" FROM "_TagToTerm";
DROP TABLE "_TagToTerm";
ALTER TABLE "new__TagToTerm" RENAME TO "_TagToTerm";
CREATE UNIQUE INDEX "_TagToTerm_AB_unique" ON "_TagToTerm"("A", "B");
CREATE INDEX "_TagToTerm_B_index" ON "_TagToTerm"("B");
CREATE TABLE "new_tags" (
    "description" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_tags" ("description") SELECT "description" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
