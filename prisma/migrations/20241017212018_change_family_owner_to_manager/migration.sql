/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Family` table. All the data in the column will be lost.
  - Added the required column `managerId` to the `Family` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Family" DROP CONSTRAINT "Family_ownerId_fkey";

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "ownerId",
ADD COLUMN     "managerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
