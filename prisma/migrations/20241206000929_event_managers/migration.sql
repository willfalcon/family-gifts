-- CreateTable
CREATE TABLE "_EventToFamilyMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventToFamilyMember_AB_unique" ON "_EventToFamilyMember"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToFamilyMember_B_index" ON "_EventToFamilyMember"("B");

-- AddForeignKey
ALTER TABLE "_EventToFamilyMember" ADD CONSTRAINT "_EventToFamilyMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToFamilyMember" ADD CONSTRAINT "_EventToFamilyMember_B_fkey" FOREIGN KEY ("B") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
