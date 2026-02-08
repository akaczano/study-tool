-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_chart-groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'GREEK'
);
INSERT INTO "new_chart-groups" ("description", "id") SELECT "description", "id" FROM "chart-groups";
DROP TABLE "chart-groups";
ALTER TABLE "new_chart-groups" RENAME TO "chart-groups";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
