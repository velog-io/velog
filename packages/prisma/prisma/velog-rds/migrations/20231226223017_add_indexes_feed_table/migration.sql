/*
  Warnings:

  - A unique constraint covering the columns `[fk_post_id,fk_user_id]` on the table `feeds` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "feeds" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "feeds_fk_post_id_fk_user_id_key" ON "feeds"("fk_post_id", "fk_user_id");
