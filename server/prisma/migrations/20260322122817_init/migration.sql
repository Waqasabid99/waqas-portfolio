-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_forms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "live_url" TEXT NOT NULL,
    "github_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deadline" TEXT,
    "details" TEXT,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_status_history" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "old_status" TEXT NOT NULL,
    "new_status" TEXT NOT NULL,
    "changed_by" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_development_details" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "tech" TEXT NOT NULL DEFAULT '',
    "web_pages" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "web_development_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_development_features" (
    "id" SERIAL NOT NULL,
    "web_dev_detail_id" INTEGER NOT NULL,
    "feature" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "web_development_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_details" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_types" (
    "id" SERIAL NOT NULL,
    "seo_detail_id" INTEGER NOT NULL,
    "seo_type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_marketing_details" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "target_audience" TEXT,
    "marketing_budget" DOUBLE PRECISION,
    "duration" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_marketing_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_marketing_services" (
    "id" SERIAL NOT NULL,
    "digital_marketing_detail_id" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_marketing_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_platforms" (
    "id" SERIAL NOT NULL,
    "digital_marketing_detail_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_generation_details" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "volume" TEXT,
    "content_tone" TEXT,
    "target_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_generation_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_types" (
    "id" SERIAL NOT NULL,
    "content_generation_detail_id" INTEGER NOT NULL,
    "content_type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_languages" (
    "id" SERIAL NOT NULL,
    "content_generation_detail_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_development_details" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "app_type" TEXT,
    "complexity" TEXT,
    "target_platforms" TEXT,
    "expected_users" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_development_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_features" (
    "id" SERIAL NOT NULL,
    "app_development_detail_id" INTEGER NOT NULL,
    "feature" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "web_development_details_project_id_key" ON "web_development_details"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_details_project_id_key" ON "seo_details"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "digital_marketing_details_project_id_key" ON "digital_marketing_details"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_generation_details_project_id_key" ON "content_generation_details"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_development_details_project_id_key" ON "app_development_details"("project_id");

-- AddForeignKey
ALTER TABLE "contact_forms" ADD CONSTRAINT "contact_forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_status_history" ADD CONSTRAINT "project_status_history_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_development_details" ADD CONSTRAINT "web_development_details_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_development_features" ADD CONSTRAINT "web_development_features_web_dev_detail_id_fkey" FOREIGN KEY ("web_dev_detail_id") REFERENCES "web_development_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_details" ADD CONSTRAINT "seo_details_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_types" ADD CONSTRAINT "seo_types_seo_detail_id_fkey" FOREIGN KEY ("seo_detail_id") REFERENCES "seo_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_marketing_details" ADD CONSTRAINT "digital_marketing_details_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_marketing_services" ADD CONSTRAINT "digital_marketing_services_digital_marketing_detail_id_fkey" FOREIGN KEY ("digital_marketing_detail_id") REFERENCES "digital_marketing_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_platforms" ADD CONSTRAINT "social_platforms_digital_marketing_detail_id_fkey" FOREIGN KEY ("digital_marketing_detail_id") REFERENCES "digital_marketing_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_generation_details" ADD CONSTRAINT "content_generation_details_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_types" ADD CONSTRAINT "content_types_content_generation_detail_id_fkey" FOREIGN KEY ("content_generation_detail_id") REFERENCES "content_generation_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_languages" ADD CONSTRAINT "content_languages_content_generation_detail_id_fkey" FOREIGN KEY ("content_generation_detail_id") REFERENCES "content_generation_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_development_details" ADD CONSTRAINT "app_development_details_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_features" ADD CONSTRAINT "app_features_app_development_detail_id_fkey" FOREIGN KEY ("app_development_detail_id") REFERENCES "app_development_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
