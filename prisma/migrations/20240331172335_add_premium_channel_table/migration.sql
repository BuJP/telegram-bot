/*
  Warnings:

  - You are about to drop the column `chat_id` on the `Premium_link` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channel_id]` on the table `Premium_link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channel_id` to the `Premium_link` table without a default value. This is not possible if the table is not empty.

*/
-- Delete all generated links
DELETE FROM "Premium_link";

-- DropIndex
DROP INDEX "Premium_link_chat_id_key";

-- AlterTable
ALTER TABLE "Premium_link" DROP COLUMN "chat_id",
ADD COLUMN     "channel_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Premium_channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Premium_channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Premium_link_channel_id_key" ON "Premium_link"("channel_id");

-- AddForeignKey
ALTER TABLE "Premium_link" ADD CONSTRAINT "Premium_link_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Premium_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
