import { prisma } from "../prisma";

interface CreateEntryInput {
    seasonId: number;
    bossId: number
    entries: EntryData[];
}

interface EntryData {
    playerId: number;
    score: number;
    hits: number;
}

const createEntries = async (entryData: CreateEntryInput) => {
    await prisma.guildBossEntry.createMany({
        data: entryData.entries.map(e => {
            return {
                ...e,
                seasonId: entryData.seasonId,
                bossId: entryData.bossId,
            }
        }),
        skipDuplicates: true,
    });
    return { success: true, message: 'Entries created successfully' };
}

const getEntries = async ({
    seasonId, 
    bossId
}: {
    seasonId: number
    bossId: number
}) => {
    const result = await prisma.guildBossEntry.findMany({
        where: { seasonId, bossId },
        orderBy: { score: 'desc' },
        include: { player: true },
    });
    return result;
}

export default {
    createEntries,
    getEntries,
};