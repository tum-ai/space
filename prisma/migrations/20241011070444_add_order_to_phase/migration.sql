/*
  Warnings:

  - Added the required column `order` to the `Phase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Phase" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
UPDATE "Phase" SET "order" = 0 WHERE "order" IS NULL;
