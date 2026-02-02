/*
  Warnings:

  - Added the required column `groupId` to the `charts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "chart-groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_charts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "data" TEXT,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "charts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "chart-groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_charts" ("data", "description", "id", "language") SELECT "data", "description", "id", "language" FROM "charts";
DROP TABLE "charts";
ALTER TABLE "new_charts" RENAME TO "charts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
