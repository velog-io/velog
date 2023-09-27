/*
  Warnings:

  - You are about to drop the column `reason` on the `feeds` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `feeds` table. All the data in the column will be lost.
  - You are about to drop the column `fk_follow_user_id` on the `follow_users` table. All the data in the column will be lost.
  - You are about to drop the column `fk_user_id` on the `follow_users` table. All the data in the column will be lost.
  - Made the column `fk_post_id` on table `feeds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fk_user_id` on table `feeds` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fk_follower_user_id` to the `follow_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_following_user_id` to the `follow_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "follow_users" DROP CONSTRAINT "follow_users_fk_follow_user_id_fkey";

-- DropForeignKey
ALTER TABLE "follow_users" DROP CONSTRAINT "follow_users_fk_user_id_fkey";

-- DropIndex
DROP INDEX "follow_users_fk_follow_user_id_idx";

-- DropIndex
DROP INDEX "follow_users_fk_user_id_idx";

-- AlterTable
ALTER TABLE "feeds" DROP COLUMN "reason",
DROP COLUMN "score",
ALTER COLUMN "fk_post_id" SET NOT NULL,
ALTER COLUMN "fk_user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "follow_users" DROP COLUMN "fk_follow_user_id",
DROP COLUMN "fk_user_id",
ADD COLUMN     "fk_follower_user_id" UUID NOT NULL,
ADD COLUMN     "fk_following_user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "follow_users_fk_following_user_id_idx" ON "follow_users"("fk_following_user_id");

-- CreateIndex
CREATE INDEX "follow_users_fk_follower_user_id_idx" ON "follow_users"("fk_follower_user_id");

-- AddForeignKey
ALTER TABLE "follow_users" ADD CONSTRAINT "follow_users_fk_following_user_id_fkey" FOREIGN KEY ("fk_following_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "follow_users" ADD CONSTRAINT "follow_users_fk_follower_user_id_fkey" FOREIGN KEY ("fk_follower_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
