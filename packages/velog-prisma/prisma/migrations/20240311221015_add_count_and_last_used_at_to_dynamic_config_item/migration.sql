-- AlterTable
ALTER TABLE "dynamic_config_items" ADD COLUMN     "last_used_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usage_count" INTEGER NOT NULL DEFAULT 0;
