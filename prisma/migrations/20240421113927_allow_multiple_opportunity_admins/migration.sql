/*
  Warnings:

  - You are about to drop the column `adminId` on the `Opportunity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_adminId_fkey";

-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "adminId";

-- CreateTable
CREATE TABLE "_OpportunityToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OpportunityToUser_AB_unique" ON "_OpportunityToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OpportunityToUser_B_index" ON "_OpportunityToUser"("B");

-- AddForeignKey
ALTER TABLE "_OpportunityToUser" ADD CONSTRAINT "_OpportunityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OpportunityToUser" ADD CONSTRAINT "_OpportunityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
