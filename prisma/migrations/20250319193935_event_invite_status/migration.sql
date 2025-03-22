-- CreateEnum
CREATE TYPE "EventResponse" AS ENUM ('declined', 'maybe', 'accepted');

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "eventResponse" "EventResponse",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
