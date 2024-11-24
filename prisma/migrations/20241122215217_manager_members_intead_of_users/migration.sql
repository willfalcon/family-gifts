-- CreateTable
CREATE TABLE "_FamilyManagerMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FamilyManagerMember_AB_unique" ON "_FamilyManagerMember"("A", "B");

-- CreateIndex
CREATE INDEX "_FamilyManagerMember_B_index" ON "_FamilyManagerMember"("B");

-- AddForeignKey
ALTER TABLE "_FamilyManagerMember" ADD CONSTRAINT "_FamilyManagerMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyManagerMember" ADD CONSTRAINT "_FamilyManagerMember_B_fkey" FOREIGN KEY ("B") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
