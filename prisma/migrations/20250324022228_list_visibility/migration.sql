/*
  Warnings:

  - You are about to drop the `_FamilyToList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FamilyToList" DROP CONSTRAINT "_FamilyToList_A_fkey";

-- DropForeignKey
ALTER TABLE "_FamilyToList" DROP CONSTRAINT "_FamilyToList_B_fkey";

-- DropTable
DROP TABLE "_FamilyToList";

-- CreateTable
CREATE TABLE "_ListVisibleToFamilies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ListVisibleToFamilies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ListVisibleToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ListVisibleToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ListVisibleToEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ListVisibleToEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ListVisibleToFamilies_B_index" ON "_ListVisibleToFamilies"("B");

-- CreateIndex
CREATE INDEX "_ListVisibleToUsers_B_index" ON "_ListVisibleToUsers"("B");

-- CreateIndex
CREATE INDEX "_ListVisibleToEvents_B_index" ON "_ListVisibleToEvents"("B");

-- AddForeignKey
ALTER TABLE "_ListVisibleToFamilies" ADD CONSTRAINT "_ListVisibleToFamilies_A_fkey" FOREIGN KEY ("A") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListVisibleToFamilies" ADD CONSTRAINT "_ListVisibleToFamilies_B_fkey" FOREIGN KEY ("B") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListVisibleToUsers" ADD CONSTRAINT "_ListVisibleToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListVisibleToUsers" ADD CONSTRAINT "_ListVisibleToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListVisibleToEvents" ADD CONSTRAINT "_ListVisibleToEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListVisibleToEvents" ADD CONSTRAINT "_ListVisibleToEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
