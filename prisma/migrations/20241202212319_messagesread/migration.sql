-- CreateTable
CREATE TABLE "_ReadyMessages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReadyMessages_AB_unique" ON "_ReadyMessages"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadyMessages_B_index" ON "_ReadyMessages"("B");

-- AddForeignKey
ALTER TABLE "_ReadyMessages" ADD CONSTRAINT "_ReadyMessages_A_fkey" FOREIGN KEY ("A") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadyMessages" ADD CONSTRAINT "_ReadyMessages_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
