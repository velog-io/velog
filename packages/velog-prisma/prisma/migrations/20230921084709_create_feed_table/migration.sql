-- CreateTable
CREATE TABLE "feeds" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fk_post_id" UUID NOT NULL,
    "fk_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feeds_created_at" ON "feeds"("created_at");

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_fk_post_id_fkey" FOREIGN KEY ("fk_post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
