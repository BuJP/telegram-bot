-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "invitation_link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" SERIAL NOT NULL,
    "parent_id" TEXT NOT NULL,
    "children_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Premium_link" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Premium_link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_id_key" ON "User"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_parent_id_key" ON "Relation"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "Premium_link_chat_id_key" ON "Premium_link"("chat_id");

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_children_id_fkey" FOREIGN KEY ("children_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Premium_link" ADD CONSTRAINT "Premium_link_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
