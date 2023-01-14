/*
  Warnings:

  - You are about to drop the `_CategoryToTask` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToTask" DROP CONSTRAINT "_CategoryToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToTask" DROP CONSTRAINT "_CategoryToTask_B_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CategoryToTask";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
