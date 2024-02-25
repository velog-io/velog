-- CreateTable
CREATE TABLE "dynamic_config_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "value" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "dynamic_config_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dynamic_config_items_value_idx" ON "dynamic_config_items"("value");

-- CreateIndex
CREATE UNIQUE INDEX "dynamic_config_items_value_type_key" ON "dynamic_config_items"("value", "type");
