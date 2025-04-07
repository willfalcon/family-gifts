/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Family` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Family" DROP CONSTRAINT "Family_managerId_fkey";

-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
