/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DepartmentMembership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Opportunity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OpportunityParticipation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

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
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_assignee_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_opportunity_id_fkey";

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "DepartmentMembership";

-- DropTable
DROP TABLE "Opportunity";

-- DropTable
DROP TABLE "OpportunityParticipation";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "Review";

-- DropEnum
DROP TYPE "ContactType";

-- DropEnum
DROP TYPE "DepartmentPosition";

-- DropEnum
DROP TYPE "DepartmentType";

-- DropEnum
DROP TYPE "OpportunityPermission";

-- DropEnum
DROP TYPE "UserPermission";
