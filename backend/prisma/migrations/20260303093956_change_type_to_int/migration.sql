/*
  Warnings:

  - You are about to alter the column `score` on the `DailyLeaderboardEntry` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `maxScore` on the `PlayerBossStat` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `lastScore` on the `PlayerBossStat` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "DailyLeaderboardEntry" ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PlayerBossStat" ALTER COLUMN "maxScore" SET DATA TYPE INTEGER,
ALTER COLUMN "lastScore" SET DATA TYPE INTEGER;
