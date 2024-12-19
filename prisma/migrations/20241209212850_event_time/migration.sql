-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "_ChannelToFamilyMember" ADD CONSTRAINT "_ChannelToFamilyMember_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ChannelToFamilyMember_AB_unique";

-- AlterTable
ALTER TABLE "_EventToFamilyMember" ADD CONSTRAINT "_EventToFamilyMember_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EventToFamilyMember_AB_unique";

-- AlterTable
ALTER TABLE "_FamilyManagerMember" ADD CONSTRAINT "_FamilyManagerMember_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FamilyManagerMember_AB_unique";

-- AlterTable
ALTER TABLE "_FamilyToList" ADD CONSTRAINT "_FamilyToList_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FamilyToList_AB_unique";

-- AlterTable
ALTER TABLE "_ItemBoughtBy" ADD CONSTRAINT "_ItemBoughtBy_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ItemBoughtBy_AB_unique";

-- AlterTable
ALTER TABLE "_ReadyMessages" ADD CONSTRAINT "_ReadyMessages_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ReadyMessages_AB_unique";
