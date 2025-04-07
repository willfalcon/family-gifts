/*
  Warnings:

  - Made the column `createdAt` on table `Family` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Family` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `List` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `List` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "List" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
