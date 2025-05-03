/*
  Warnings:

  - You are about to drop the column `wishListVisibility` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "wishListVisibility",
ADD COLUMN     "defaultListVisibility" "Visibility" NOT NULL DEFAULT 'private';
