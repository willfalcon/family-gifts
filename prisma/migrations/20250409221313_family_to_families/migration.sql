/*
  Warnings:

  - The values [family] on the enum `Visibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Visibility_new" AS ENUM ('public', 'families', 'events', 'lists', 'private');
ALTER TABLE "User" ALTER COLUMN "activityVisibility" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "profileVisibility" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "wishListVisibility" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "profileVisibility" TYPE "Visibility_new"[] USING ("profileVisibility"::text::"Visibility_new"[]);
ALTER TABLE "User" ALTER COLUMN "wishListVisibility" TYPE "Visibility_new"[] USING ("wishListVisibility"::text::"Visibility_new"[]);
ALTER TABLE "User" ALTER COLUMN "activityVisibility" TYPE "Visibility_new"[] USING ("activityVisibility"::text::"Visibility_new"[]);
ALTER TYPE "Visibility" RENAME TO "Visibility_old";
ALTER TYPE "Visibility_new" RENAME TO "Visibility";
DROP TYPE "Visibility_old";
ALTER TABLE "User" ALTER COLUMN "activityVisibility" SET DEFAULT ARRAY['families', 'events', 'lists']::"Visibility"[];
ALTER TABLE "User" ALTER COLUMN "profileVisibility" SET DEFAULT ARRAY['families', 'events', 'lists']::"Visibility"[];
ALTER TABLE "User" ALTER COLUMN "wishListVisibility" SET DEFAULT ARRAY['families', 'events', 'lists']::"Visibility"[];
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "activityVisibility" SET DEFAULT ARRAY['families', 'events', 'lists']::"Visibility"[],
ALTER COLUMN "profileVisibility" SET DEFAULT ARRAY['families', 'events', 'lists']::"Visibility"[],
ALTER COLUMN "wishListVisibility" SET DEFAULT ARRAY['families', 'events', 'lists']::"Visibility"[];
