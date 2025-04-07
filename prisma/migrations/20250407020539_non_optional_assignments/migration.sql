/*
  Warnings:

  - Made the column `giverId` on table `Assignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recipientId` on table `Assignment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_giverId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_recipientId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "giverId" SET NOT NULL,
ALTER COLUMN "recipientId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
