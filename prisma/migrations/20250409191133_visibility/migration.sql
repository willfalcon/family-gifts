-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'family', 'events', 'lists', 'private');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activityVisibility" "Visibility"[] DEFAULT ARRAY['family', 'events', 'lists']::"Visibility"[],
ADD COLUMN     "profileVisibility" "Visibility"[] DEFAULT ARRAY['family', 'events', 'lists']::"Visibility"[],
ADD COLUMN     "wishListVisibility" "Visibility"[] DEFAULT ARRAY['family', 'events', 'lists']::"Visibility"[];
