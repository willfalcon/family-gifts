-- CreateTable
CREATE TABLE "_FamilyUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FamilyUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FamilyUser_B_index" ON "_FamilyUser"("B");

-- AddForeignKey
ALTER TABLE "_FamilyUser" ADD CONSTRAINT "_FamilyUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyUser" ADD CONSTRAINT "_FamilyUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
