/*
  Warnings:

  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('family', 'event', 'individual');

-- DropTable
DROP TABLE "Thread";

-- DropEnum
DROP TYPE "ThreadType";

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastMessage" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'individual',

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);
