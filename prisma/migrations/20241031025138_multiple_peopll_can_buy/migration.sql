/*
  Warnings:

  - You are about to drop the column `boughtById` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_boughtById_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "boughtById";

-- CreateTable
CREATE TABLE "_ItemBoughtBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemBoughtBy_AB_unique" ON "_ItemBoughtBy"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemBoughtBy_B_index" ON "_ItemBoughtBy"("B");

-- AddForeignKey
ALTER TABLE "_ItemBoughtBy" ADD CONSTRAINT "_ItemBoughtBy_A_fkey" FOREIGN KEY ("A") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemBoughtBy" ADD CONSTRAINT "_ItemBoughtBy_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
