-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" VARCHAR(50) NOT NULL,
    "fk_user_id" UUID NOT NULL,
    "action" JSONB NOT NULL DEFAULT '{}',
    "actor_id" UUID,
    "action_target_id" UUID,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_actor_id_idx" ON "notifications"("actor_id");

-- CreateIndex
CREATE INDEX "notifications_action_target_id_idx" ON "notifications"("action_target_id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_fk_user_id_type_actor_id_action_target_id_key" ON "notifications"("fk_user_id", "type", "actor_id", "action_target_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
