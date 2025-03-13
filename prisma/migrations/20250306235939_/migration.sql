/*
  Warnings:

  - The `notes` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "notes",
ADD COLUMN     "notes" JSONB;

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "description" JSONB;
