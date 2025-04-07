/*
  Warnings:

  - Added the required column `creatorId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "inviterId" TEXT;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
