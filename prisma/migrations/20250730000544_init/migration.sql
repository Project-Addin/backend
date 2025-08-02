/*
  Warnings:

  - A unique constraint covering the columns `[room_id]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room_id` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."groups" ADD COLUMN     "room_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "groups_room_id_key" ON "public"."groups"("room_id");

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
