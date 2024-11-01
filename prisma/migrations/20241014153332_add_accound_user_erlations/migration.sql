-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "_FamilyMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FamilyMembers_AB_unique" ON "_FamilyMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_FamilyMembers_B_index" ON "_FamilyMembers"("B");

-- AddForeignKey
ALTER TABLE "_FamilyMembers" ADD CONSTRAINT "_FamilyMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyMembers" ADD CONSTRAINT "_FamilyMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
