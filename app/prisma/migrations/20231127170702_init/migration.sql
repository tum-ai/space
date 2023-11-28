/*
  Warnings:

  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contact_id` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `Contact` table. All the data in the column will be lost.
  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department_id` on the `Department` table. All the data in the column will be lost.
  - The primary key for the `DepartmentMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department_id` on the `DepartmentMembership` table. All the data in the column will be lost.
  - You are about to drop the column `department_membership_id` on the `DepartmentMembership` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `DepartmentMembership` table. All the data in the column will be lost.
  - The primary key for the `Opportunity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creator_id` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `opportunity_id` on the `Opportunity` table. All the data in the column will be lost.
  - The primary key for the `OpportunityParticipation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `opportunity_id` on the `OpportunityParticipation` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `OpportunityParticipation` table. All the data in the column will be lost.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profile_id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Profile` table. All the data in the column will be lost.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignee_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `opportunity_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `review_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opportunityId` to the `OpportunityParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `OpportunityParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assigneeId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opportunityId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `VerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentMembership" DROP CONSTRAINT "DepartmentMembership_department_id_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentMembership" DROP CONSTRAINT "DepartmentMembership_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_department_id_fkey";

-- DropForeignKey
ALTER TABLE "OpportunityParticipation" DROP CONSTRAINT "OpportunityParticipation_opportunity_id_fkey";

-- DropForeignKey
ALTER TABLE "OpportunityParticipation" DROP CONSTRAINT "OpportunityParticipation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_assignee_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_opportunity_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profile_id_fkey";

-- DropIndex
DROP INDEX "User_profile_id_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "contact_id",
DROP COLUMN "profile_id",
ADD COLUMN     "contactId" SERIAL NOT NULL,
ADD COLUMN     "profileId" INTEGER NOT NULL,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("contactId");

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "department_id",
ADD COLUMN     "departmentId" SERIAL NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("departmentId");

-- AlterTable
ALTER TABLE "DepartmentMembership" DROP CONSTRAINT "DepartmentMembership_pkey",
DROP COLUMN "department_id",
DROP COLUMN "department_membership_id",
DROP COLUMN "user_id",
ADD COLUMN     "departmentId" INTEGER,
ADD COLUMN     "department_membershipId" SERIAL NOT NULL,
ADD COLUMN     "userId" TEXT,
ADD CONSTRAINT "DepartmentMembership_pkey" PRIMARY KEY ("department_membershipId");

-- AlterTable
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_pkey",
DROP COLUMN "creator_id",
DROP COLUMN "department_id",
DROP COLUMN "opportunity_id",
ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "departmentId" INTEGER NOT NULL,
ADD COLUMN     "opportunityId" SERIAL NOT NULL,
ADD CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("opportunityId");

-- AlterTable
ALTER TABLE "OpportunityParticipation" DROP CONSTRAINT "OpportunityParticipation_pkey",
DROP COLUMN "opportunity_id",
DROP COLUMN "user_id",
ADD COLUMN     "opportunityId" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "OpportunityParticipation_pkey" PRIMARY KEY ("userId", "opportunityId");

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "profile_id",
DROP COLUMN "user_id",
ADD COLUMN     "profileId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileId");

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "assignee_id",
DROP COLUMN "opportunity_id",
DROP COLUMN "review_id",
ADD COLUMN     "assigneeId" INTEGER NOT NULL,
ADD COLUMN     "opportunityId" INTEGER NOT NULL,
ADD COLUMN     "reviewId" SERIAL NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId");

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile_id",
ADD COLUMN     "profileId" INTEGER;

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("profileId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMembership" ADD CONSTRAINT "DepartmentMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMembership" ADD CONSTRAINT "DepartmentMembership_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("departmentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityParticipation" ADD CONSTRAINT "OpportunityParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityParticipation" ADD CONSTRAINT "OpportunityParticipation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("opportunityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("opportunityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;
