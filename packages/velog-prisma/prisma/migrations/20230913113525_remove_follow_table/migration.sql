/*
  Warnings:

  - You are about to drop the `follow_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "follow_users" DROP CONSTRAINT "follow_users_fk_follow_user_id_fkey";

-- DropForeignKey
ALTER TABLE "follow_users" DROP CONSTRAINT "follow_users_fk_uesr_id_fkey";

-- DropTable
DROP TABLE "follow_users";
