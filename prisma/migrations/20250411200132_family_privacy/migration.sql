-- CreateEnum
CREATE TYPE "FamilyVisibility" AS ENUM ('private', 'link', 'public');

-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "allowInvites" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requireApproval" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "visibility" "FamilyVisibility" NOT NULL DEFAULT 'private';
