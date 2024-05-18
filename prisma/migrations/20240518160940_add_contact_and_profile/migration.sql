/*
  Warnings:

  - The values [FACEBOOK] on the enum `ContactType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactType_new" AS ENUM ('EMAIL', 'SLACK', 'GITHUB', 'INSTAGRAM', 'PHONE', 'LINKEDIN');
ALTER TABLE "Contact" ALTER COLUMN "type" TYPE "ContactType_new" USING ("type"::text::"ContactType_new");
ALTER TYPE "ContactType" RENAME TO "ContactType_old";
ALTER TYPE "ContactType_new" RENAME TO "ContactType";
DROP TYPE "ContactType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Contact_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
