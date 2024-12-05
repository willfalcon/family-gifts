-- CreateEnum
CREATE TYPE "ThreadType" AS ENUM ('family', 'event', 'individual');

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastMessage" TEXT NOT NULL,
    "type" "ThreadType" NOT NULL DEFAULT 'individual',

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);
