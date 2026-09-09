-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "dni" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_dni_key" ON "users"("dni");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
