/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `FamilyMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChannelToFamilyMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToFamilyMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FamilyManagerMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemBoughtBy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReadyMessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_giverId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FamilyMember" DROP CONSTRAINT "FamilyMember_familyId_fkey";

-- DropForeignKey
ALTER TABLE "FamilyMember" DROP CONSTRAINT "FamilyMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToFamilyMember" DROP CONSTRAINT "_ChannelToFamilyMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToFamilyMember" DROP CONSTRAINT "_ChannelToFamilyMember_B_fkey";

-- DropForeignKey
ALTER TABLE "_EventToFamilyMember" DROP CONSTRAINT "_EventToFamilyMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToFamilyMember" DROP CONSTRAINT "_EventToFamilyMember_B_fkey";

-- DropForeignKey
ALTER TABLE "_FamilyManagerMember" DROP CONSTRAINT "_FamilyManagerMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_FamilyManagerMember" DROP CONSTRAINT "_FamilyManagerMember_B_fkey";

-- DropForeignKey
ALTER TABLE "_ItemBoughtBy" DROP CONSTRAINT "_ItemBoughtBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemBoughtBy" DROP CONSTRAINT "_ItemBoughtBy_B_fkey";

-- DropForeignKey
ALTER TABLE "_ReadyMessages" DROP CONSTRAINT "_ReadyMessages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReadyMessages" DROP CONSTRAINT "_ReadyMessages_B_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "receiverId",
ADD COLUMN     "recipientId" TEXT;

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "managerId";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "memberId";

-- DropTable
DROP TABLE "FamilyMember";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "_ChannelToFamilyMember";

-- DropTable
DROP TABLE "_EventToFamilyMember";

-- DropTable
DROP TABLE "_FamilyManagerMember";

-- DropTable
DROP TABLE "_ItemBoughtBy";

-- DropTable
DROP TABLE "_ReadyMessages";

-- CreateTable
CREATE TABLE "_FamilyManager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FamilyManager_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ChannelToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChannelToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FamilyManager_B_index" ON "_FamilyManager"("B");

-- CreateIndex
CREATE INDEX "_ChannelToUser_B_index" ON "_ChannelToUser"("B");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyManager" ADD CONSTRAINT "_FamilyManager_A_fkey" FOREIGN KEY ("A") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyManager" ADD CONSTRAINT "_FamilyManager_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
