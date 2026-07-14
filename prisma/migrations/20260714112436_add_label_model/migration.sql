-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "itemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "linkedAt" TIMESTAMP(3),

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Label_code_key" ON "Label"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Label_itemId_key" ON "Label"("itemId");

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
