/*
  Warnings:

  - You are about to drop the column `inviteLink` on the `Family` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Family" DROP COLUMN "inviteLink",
ADD COLUMN     "inviteLinkToken" TEXT;
