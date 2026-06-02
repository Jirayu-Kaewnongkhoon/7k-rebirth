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
    state?: STATE;
}

interface CastleEntryCreateData {
    leaderboardId: number;
    playerId: number;
    score: number;
    state: STATE;
}

interface PlayerBossStatUpsertData {
    playerId: number;
    bossId: number;
    lastScore: number;
    maxScore: number;
}

const createEntries = async (entryData: CreateEntryInput) => {
    // TODO: เปลี่ยนจาก query เอง ไปเรียก service ของแต่ละตัวแทน

    // ดึง leaderboard มาเพื่อเอา bossId
    const leaderboard = await prisma.castleLeaderboard.findUnique({
        where: { id: entryData.leaderboardId }
    });

    if (!leaderboard) {
        throw new NotFoundError('Leaderboard not found');
    }

    const bossId = leaderboard.bossId;
    const playerIds = entryData.entries.map(entry => entry.playerId);

    // ดึงค่าจาก PlayerBossStat มา (มี lastScore, maxScore)
    const stats = await prisma.playerBossStat.findMany({
        where: {
            playerId: { in: playerIds },
            bossId,
        }
    });

    // สร้าง map จาก playerId ไปยัง stat เพื่อให้เข้าถึงได้ง่าย
    const statsMap = new Map(stats.map(stat => [stat.playerId, stat]));

    // เตรียมข้อมูล
    const entryDataList: CastleEntryCreateData[] = [];
    const statUpsertList: PlayerBossStatUpsertData[] = [];
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

    await prisma.$transaction(async (tx) => {
        // สร้าง entry ใหม่
        await tx.castleEntry.createMany({
            data: entryDataList,
            skipDuplicates: true
        });

        // Upsert stat
        await Promise.all(
            statUpsertList.map((statData) =>
                tx.playerBossStat.upsert({
                    where: {
                        playerId_bossId: {
                            playerId: statData.playerId,
                            bossId: statData.bossId,
                        },
                    },
                    update: {
                        lastScore: statData.lastScore,
                        maxScore: statData.maxScore,
                    },
                    create: statData,
                })
            )
        );
    }, { timeout: 10000 });

    return { success: true, message: 'Entries created successfully' };
}

const getEntries = async (leaderboardId: number) => {
    const result = await prisma.castleEntry.findMany({
        where: { leaderboardId },
        orderBy: { score: 'desc' },
        include: { player: true },
    });
    return result;
}

const getJsonTemplate = async (leaderboardId: number) => {
    const players = await prisma.player.findMany({
        where: { isActive: true },
        orderBy: [{ id: "asc" }],
        select: { id: true, name: true },
    });

    const template = {
        leaderboardId,
        entries: players.map((p) => ({
            playerId: p.id,
            name: p.name,
            score: 0,
        })),
    };

    return template;
}

const ROWS_LIMIT = 8;

const getEntriesByPlayer = async (playerId: number, bossId: number) => {
    const result = await prisma.castleEntry.findMany({
        take: ROWS_LIMIT,
        where: { playerId, leaderboard: { bossId } },
        orderBy: { createdAt: 'desc' },
        include: {
            leaderboard: true,
        },
    });

    return result;
}

export default {
    createEntries,
    getEntries,
    getJsonTemplate,
    getEntriesByPlayer,
};