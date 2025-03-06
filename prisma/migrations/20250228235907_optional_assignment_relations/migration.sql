-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_giverId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_receiverId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "giverId" DROP NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
