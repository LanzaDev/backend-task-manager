/*
  Warnings:

  - Added the required column `type` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('reset_password', 'verify_email');

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "type" "VerificationType" NOT NULL;
