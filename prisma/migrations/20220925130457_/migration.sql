-- AlterTable
ALTER TABLE "User" ADD COLUMN     "online" BOOL NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN     "status" STRING;
