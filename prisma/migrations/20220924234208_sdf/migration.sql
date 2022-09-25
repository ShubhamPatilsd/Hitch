/*
  Warnings:

  - Changed the type of `latitude` on the `Location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `longitude` on the `Location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "latitude";
ALTER TABLE "Location" ADD COLUMN     "latitude" FLOAT8 NOT NULL;
ALTER TABLE "Location" DROP COLUMN "longitude";
ALTER TABLE "Location" ADD COLUMN     "longitude" FLOAT8 NOT NULL;
