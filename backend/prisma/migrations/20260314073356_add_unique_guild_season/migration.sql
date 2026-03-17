/*
  Warnings:

  - A unique constraint covering the columns `[seasonId,bossId,playerId]` on the table `GuildBossEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GuildBossEntry_bossId_playerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "GuildBossEntry_seasonId_bossId_playerId_key" ON "GuildBossEntry"("seasonId", "bossId", "playerId");
