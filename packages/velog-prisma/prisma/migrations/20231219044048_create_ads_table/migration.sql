-- CreateTable
CREATE TABLE "ads" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "image" VARCHAR(500) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);
