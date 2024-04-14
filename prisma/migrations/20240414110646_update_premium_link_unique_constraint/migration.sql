/*
  Warnings:

  - A unique constraint covering the columns `[channel_id,user_id]` on the table `Premium_link` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Premium_link_channel_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Premium_link_channel_id_user_id_key" ON "Premium_link"("channel_id", "user_id");
