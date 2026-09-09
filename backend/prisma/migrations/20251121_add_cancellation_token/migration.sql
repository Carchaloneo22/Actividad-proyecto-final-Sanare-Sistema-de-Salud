-- AlterTable
ALTER TABLE "appointments" ADD COLUMN "cancellationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_cancellationToken_key" ON "appointments"("cancellationToken");
