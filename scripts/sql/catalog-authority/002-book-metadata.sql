PRAGMA user_version = 2;

CREATE TABLE source_book_metadata (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "isbn" TEXT NOT NULL,
  "publisherName" TEXT NOT NULL,
  "itemCaption" TEXT NOT NULL,
  "salesDate" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "imprint" TEXT NOT NULL,
  "pageCount" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "fetchedAt" TEXT NOT NULL
) STRICT;
