-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_familyId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "familyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
