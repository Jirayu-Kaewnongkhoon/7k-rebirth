-- CreateTable
CREATE TABLE "GuildBoss" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GuildBoss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildBossSeason" (
    "id" SERIAL NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "GuildBossSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildBossEntry" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "bossId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,

    CONSTRAINT "GuildBossEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildBossEntry_bossId_playerId_key" ON "GuildBossEntry"("bossId", "playerId");

-- AddForeignKey
ALTER TABLE "GuildBossEntry" ADD CONSTRAINT "GuildBossEntry_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "GuildBossSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildBossEntry" ADD CONSTRAINT "GuildBossEntry_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "GuildBoss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildBossEntry" ADD CONSTRAINT "GuildBossEntry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
