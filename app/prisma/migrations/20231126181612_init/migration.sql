/*
  Warnings:

  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `permission` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_assignee_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profile_id_fkey";

-- DropIndex
DROP INDEX "User_profile_id_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "assignee_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "last_name",
DROP COLUMN "password",
DROP COLUMN "permission",
DROP COLUMN "profile_id";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
