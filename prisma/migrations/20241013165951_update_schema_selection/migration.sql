/*
  Warnings:

  - You are about to drop the column `tallySchema` on the `Opportunity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "tallySchema",
ADD COLUMN     "schemaId" INTEGER;
