/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'WEBSITE';

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userID_fkey";

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "userID" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Profile_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
