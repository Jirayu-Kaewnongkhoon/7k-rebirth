import { NotFoundError } from "../models/errors";
import { prisma, STATE } from "../prisma";
import { determineState } from "../utils/state";

interface CreateEntryInput {
    leaderboardId: number;
    entries: EntryData[];
}

interface EntryData {
    playerId: number;
    score: number;
    state: STATE;
}

const createEntries = async (entryData: CreateEntryInput) => {
    // TODO: เปลี่ยนจาก query เอง ไปเรียก service ของแต่ละตัวแทน

    return await prisma.$transaction(async (tx) => {
        // ดึง leaderboard มาเพื่อเอา bossId
        const leaderboard = await tx.dailyLeaderboard.findUnique({
            where: { id: entryData.leaderboardId }
        });

        if (!leaderboard) {
            throw new NotFoundError('Leaderboard not found');
        }

        const bossId = leaderboard.bossId;
        const playerIds = entryData.entries.map(entry => entry.playerId);

        // ดึงค่าจาก PlayerBossStat มา (มี lastScore, maxScore)
        const stats = await tx.playerBossStat.findMany({
            where: {
                playerId: { in: playerIds },
                bossId,
            }
        });

        // สร้าง map จาก playerId ไปยัง stat เพื่อให้เข้าถึงได้ง่าย
        const statsMap = new Map(stats.map(stat => [stat.playerId, stat]));

        // เตรียมข้อมูล
        const entryDataList = [];
        const statUpsertList = [];
        for (const entry of entryData.entries) {
            const stat = statsMap.get(entry.playerId);

            const lastScore = stat ? stat.lastScore : 0;
            const maxScore = stat ? stat.maxScore : 0;
            const currentScore = entry.score;

            // คำนวณ state ใหม่
            const state = determineState(currentScore, lastScore, maxScore);

            // เตรียมข้อมูลสำหรับสร้าง entry ใหม่
            entryDataList.push({
                leaderboardId: entryData.leaderboardId,
                playerId: entry.playerId,
                score: currentScore,
                state,
            });

            // เตรียมข้อมูลสำหรับ upsert stat
            statUpsertList.push({
                playerId: entry.playerId,
                bossId,
                lastScore: currentScore,
                maxScore: Math.max(maxScore, currentScore),
            });
        }

        // สร้าง entry ใหม่
        await tx.dailyLeaderboardEntry.createMany({
            data: entryDataList,
            skipDuplicates: true
        });

        // Upsert stat
        for (const statData of statUpsertList) {
            await tx.playerBossStat.upsert({
                where: {
                    playerId_bossId: {
                        playerId: statData.playerId,
                        bossId: statData.bossId,
                    }
                },
                update: {
                    lastScore: statData.lastScore,
                    maxScore: statData.maxScore,
                },
                create: statData
            });
        }

        return { success: true, message: 'Entries created successfully' };
    });
}

const getEntries = async (leaderboardId: number) => {
    const result = await prisma.dailyLeaderboardEntry.findMany({
        where: { leaderboardId },
        orderBy: { score: 'desc' },
        include: { player: true },
    });
    return result;
}

export default {
    createEntries,
    getEntries,
};