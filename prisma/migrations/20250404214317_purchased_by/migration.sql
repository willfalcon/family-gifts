-- CreateTable
CREATE TABLE "_ItemPurchasedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItemPurchasedBy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ItemPurchasedBy_B_index" ON "_ItemPurchasedBy"("B");

-- AddForeignKey
ALTER TABLE "_ItemPurchasedBy" ADD CONSTRAINT "_ItemPurchasedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemPurchasedBy" ADD CONSTRAINT "_ItemPurchasedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
