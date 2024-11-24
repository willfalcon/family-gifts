-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_memberId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "memberId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
