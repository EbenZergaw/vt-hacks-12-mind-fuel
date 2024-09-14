-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'ARTICLE', 'PODCAST', 'OTHER');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "socials" JSONB NOT NULL,
    "collections" TEXT[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mediaType" "MediaType" NOT NULL,
    "collection" TEXT,
    "tags" TEXT[],

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileIDIndex" ON "Profile"("id");

-- CreateIndex
CREATE INDEX "LinkIDIndex" ON "Link"("id");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
