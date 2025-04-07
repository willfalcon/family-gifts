/*
  Warnings:

  - You are about to drop the column `default` on the `List` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "List" DROP COLUMN "default",
ADD COLUMN     "shareLink" TEXT;
