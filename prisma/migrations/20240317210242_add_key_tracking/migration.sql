/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewId,assigneeId,questionnaireId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review_reviewId_assigneeId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profilePicture";

-- CreateTable
CREATE TABLE "Key" (
    "id" SERIAL NOT NULL,
    "log" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewId_assigneeId_questionnaireId_key" ON "Review"("reviewId", "assigneeId", "questionnaireId");

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
