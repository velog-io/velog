-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "posts_score" ON "posts"("score" DESC);
