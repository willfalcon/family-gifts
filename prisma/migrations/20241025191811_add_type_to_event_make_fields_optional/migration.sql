-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "type" TEXT,
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "info" DROP NOT NULL;
