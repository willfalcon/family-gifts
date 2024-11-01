-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "boughtById" TEXT;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
