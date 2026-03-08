-- CreateEnum
CREATE TYPE "STATE" AS ENUM ('HIGHER', 'LOWER', 'SWEEP_FREE', 'SWEEP_PAY');

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "leavedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boss" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Boss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLeaderboard" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "bossId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLeaderboardEntry" (
    "id" SERIAL NOT NULL,
    "leaderboardId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "score" BIGINT NOT NULL,
    "state" "STATE" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyLeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerBossStat" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "bossId" INTEGER NOT NULL,
    "maxScore" BIGINT NOT NULL DEFAULT 0,
    "lastScore" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerBossStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Player_isActive_idx" ON "Player"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Boss_weekday_key" ON "Boss"("weekday");

-- CreateIndex
CREATE INDEX "DailyLeaderboard_date_idx" ON "DailyLeaderboard"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLeaderboard_date_bossId_key" ON "DailyLeaderboard"("date", "bossId");

-- CreateIndex
CREATE INDEX "DailyLeaderboardEntry_leaderboardId_score_idx" ON "DailyLeaderboardEntry"("leaderboardId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLeaderboardEntry_leaderboardId_playerId_key" ON "DailyLeaderboardEntry"("leaderboardId", "playerId");

-- CreateIndex
CREATE INDEX "PlayerBossStat_bossId_maxScore_idx" ON "PlayerBossStat"("bossId", "maxScore");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerBossStat_playerId_bossId_key" ON "PlayerBossStat"("playerId", "bossId");

-- AddForeignKey
ALTER TABLE "DailyLeaderboard" ADD CONSTRAINT "DailyLeaderboard_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLeaderboardEntry" ADD CONSTRAINT "DailyLeaderboardEntry_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "DailyLeaderboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLeaderboardEntry" ADD CONSTRAINT "DailyLeaderboardEntry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBossStat" ADD CONSTRAINT "PlayerBossStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBossStat" ADD CONSTRAINT "PlayerBossStat_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
