-- CreateTable
CREATE TABLE "follow_users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fk_user_id" UUID NOT NULL,
    "fk_follow_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "follow_users_fk_user_id_idx" ON "follow_users"("fk_user_id");

-- CreateIndex
CREATE INDEX "follow_users_fk_follow_user_id_idx" ON "follow_users"("fk_follow_user_id");

-- AddForeignKey
ALTER TABLE "follow_users" ADD CONSTRAINT "follow_users_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "follow_users" ADD CONSTRAINT "follow_users_fk_follow_user_id_fkey" FOREIGN KEY ("fk_follow_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
