-- CreateTable
CREATE TABLE "_EventManager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventManager_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventManager_B_index" ON "_EventManager"("B");

-- AddForeignKey
ALTER TABLE "_EventManager" ADD CONSTRAINT "_EventManager_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventManager" ADD CONSTRAINT "_EventManager_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
