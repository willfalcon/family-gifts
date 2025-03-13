-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'heigh');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "price" INTEGER,
ADD COLUMN     "priority" "Priority";
