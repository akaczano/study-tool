-- CreateTable
CREATE TABLE "terms" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "requiredCase" TEXT,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "decription" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "charts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "data" TEXT
);

-- CreateTable
CREATE TABLE "_TagToTerm" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TagToTerm_A_fkey" FOREIGN KEY ("A") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagToTerm_B_fkey" FOREIGN KEY ("B") REFERENCES "terms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTerm_AB_unique" ON "_TagToTerm"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTerm_B_index" ON "_TagToTerm"("B");
