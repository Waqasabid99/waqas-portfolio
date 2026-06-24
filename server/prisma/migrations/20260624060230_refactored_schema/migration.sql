/*
  Warnings:

  - The primary key for the `app_development_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `app_features` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contact_forms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `content_generation_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `content_languages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `content_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `digital_marketing_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `digital_marketing_services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `portfolio_projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `project_status_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `seo_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `seo_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `social_platforms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `web_development_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `web_development_features` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[passwordResetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "app_development_details" DROP CONSTRAINT "app_development_details_project_id_fkey";

-- DropForeignKey
ALTER TABLE "app_features" DROP CONSTRAINT "app_features_app_development_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "contact_forms" DROP CONSTRAINT "contact_forms_user_id_fkey";

-- DropForeignKey
ALTER TABLE "content_generation_details" DROP CONSTRAINT "content_generation_details_project_id_fkey";

-- DropForeignKey
ALTER TABLE "content_languages" DROP CONSTRAINT "content_languages_content_generation_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "content_types" DROP CONSTRAINT "content_types_content_generation_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "digital_marketing_details" DROP CONSTRAINT "digital_marketing_details_project_id_fkey";

-- DropForeignKey
ALTER TABLE "digital_marketing_services" DROP CONSTRAINT "digital_marketing_services_digital_marketing_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "project_status_history" DROP CONSTRAINT "project_status_history_project_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_fkey";

-- DropForeignKey
ALTER TABLE "seo_details" DROP CONSTRAINT "seo_details_project_id_fkey";

-- DropForeignKey
ALTER TABLE "seo_types" DROP CONSTRAINT "seo_types_seo_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "social_platforms" DROP CONSTRAINT "social_platforms_digital_marketing_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "web_development_details" DROP CONSTRAINT "web_development_details_project_id_fkey";

-- DropForeignKey
ALTER TABLE "web_development_features" DROP CONSTRAINT "web_development_features_web_dev_detail_id_fkey";

-- AlterTable
ALTER TABLE "app_development_details" DROP CONSTRAINT "app_development_details_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "app_development_details_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "app_development_details_id_seq";

-- AlterTable
ALTER TABLE "app_features" DROP CONSTRAINT "app_features_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "app_development_detail_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "app_features_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "app_features_id_seq";

-- AlterTable
ALTER TABLE "contact_forms" DROP CONSTRAINT "contact_forms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "contact_forms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "contact_forms_id_seq";

-- AlterTable
ALTER TABLE "content_generation_details" DROP CONSTRAINT "content_generation_details_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "content_generation_details_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "content_generation_details_id_seq";

-- AlterTable
ALTER TABLE "content_languages" DROP CONSTRAINT "content_languages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "content_generation_detail_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "content_languages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "content_languages_id_seq";

-- AlterTable
ALTER TABLE "content_types" DROP CONSTRAINT "content_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "content_generation_detail_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "content_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "content_types_id_seq";

-- AlterTable
ALTER TABLE "digital_marketing_details" DROP CONSTRAINT "digital_marketing_details_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "digital_marketing_details_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "digital_marketing_details_id_seq";

-- AlterTable
ALTER TABLE "digital_marketing_services" DROP CONSTRAINT "digital_marketing_services_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "digital_marketing_detail_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "digital_marketing_services_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "digital_marketing_services_id_seq";

-- AlterTable
ALTER TABLE "portfolio_projects" DROP CONSTRAINT "portfolio_projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "portfolio_projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "portfolio_projects_id_seq";

-- AlterTable
ALTER TABLE "project_status_history" DROP CONSTRAINT "project_status_history_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "project_status_history_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "project_status_history_id_seq";

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "projects_id_seq";

-- AlterTable
ALTER TABLE "seo_details" DROP CONSTRAINT "seo_details_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "seo_details_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "seo_details_id_seq";

-- AlterTable
ALTER TABLE "seo_types" DROP CONSTRAINT "seo_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "seo_detail_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "seo_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "seo_types_id_seq";

-- AlterTable
ALTER TABLE "social_platforms" DROP CONSTRAINT "social_platforms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "digital_marketing_detail_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "social_platforms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "social_platforms_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "passwordResetExpiry" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AlterTable
ALTER TABLE "web_development_details" DROP CONSTRAINT "web_development_details_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "web_development_details_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "web_development_details_id_seq";

-- AlterTable
ALTER TABLE "web_development_features" DROP CONSTRAINT "web_development_features_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "web_dev_detail_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "web_development_features_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "web_development_features_id_seq";

-- DropTable
DROP TABLE "admins";

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "cover_image" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "reading_time" INTEGER,
    "author_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),
    "category_id" TEXT,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_seo" (
    "id" TEXT NOT NULL,
    "blog_id" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT,
    "og_image" TEXT,

    CONSTRAINT "blog_seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogToBlogTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogToBlogTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "blog_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_seo_blog_id_key" ON "blog_seo"("blog_id");

-- CreateIndex
CREATE INDEX "_BlogToBlogTag_B_index" ON "_BlogToBlogTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "users"("passwordResetToken");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_seo" ADD CONSTRAINT "blog_seo_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToBlogTag" ADD CONSTRAINT "_BlogToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToBlogTag" ADD CONSTRAINT "_BlogToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "blog_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
