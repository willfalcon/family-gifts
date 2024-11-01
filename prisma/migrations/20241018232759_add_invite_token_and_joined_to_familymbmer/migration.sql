-- AlterTable
ALTER TABLE "FamilyMember" ADD COLUMN     "inviteToken" TEXT,
ADD COLUMN     "joined" BOOLEAN NOT NULL DEFAULT false;
