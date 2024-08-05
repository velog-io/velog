/*
  Warnings:

  - Added the required column `url` to the `ads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ads" ADD COLUMN     "url" VARCHAR(512) NOT NULL;
