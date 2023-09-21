/*
  Warnings:

  - You are about to drop the `feeds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_fk_post_id_fkey";

-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_fk_user_id_fkey";

-- DropTable
DROP TABLE "feeds";
