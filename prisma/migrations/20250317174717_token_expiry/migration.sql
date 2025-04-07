/*
  Warnings:

  - Added the required column `tokenExpiry` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "tokenExpiry" TIMESTAMP(3) NOT NULL;
