/*
  Warnings:

  - You are about to drop the column `premium_link` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Premium_link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    CONSTRAINT "Premium_link_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "telegram_id" TEXT NOT NULL,
    "invitation_link" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "invitation_link", "telegram_id", "updatedAt") SELECT "createdAt", "id", "invitation_link", "telegram_id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_telegram_id_key" ON "User"("telegram_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Premium_link_user_id_key" ON "Premium_link"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Premium_link_chat_id_key" ON "Premium_link"("chat_id");
