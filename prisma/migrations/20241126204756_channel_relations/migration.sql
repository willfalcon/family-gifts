-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "familyId" TEXT;

-- CreateTable
CREATE TABLE "_ChannelToFamilyMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToFamilyMember_AB_unique" ON "_ChannelToFamilyMember"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToFamilyMember_B_index" ON "_ChannelToFamilyMember"("B");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToFamilyMember" ADD CONSTRAINT "_ChannelToFamilyMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToFamilyMember" ADD CONSTRAINT "_ChannelToFamilyMember_B_fkey" FOREIGN KEY ("B") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
