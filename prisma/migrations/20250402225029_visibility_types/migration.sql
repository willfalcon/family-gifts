-- CreateEnum
CREATE TYPE "VisiblityType" AS ENUM ('private', 'link', 'public', 'specific');

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "visibilityType" "VisiblityType" NOT NULL DEFAULT 'private';
