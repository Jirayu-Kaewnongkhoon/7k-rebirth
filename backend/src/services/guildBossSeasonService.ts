import { prisma } from "../prisma";

import { BadRequest } from "../models/errors";

import { getEndDate } from "../utils/date";

const createGuildBossSeason = async (startDateStr: string) => {
    const { startDate, endDate } = getEndDate(startDateStr);

    const overlap = await prisma.guildBossSeason.findFirst({
        where: {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
        }
    });

    if (overlap) {
        throw new BadRequest('date overlap');
    }

    const season = await prisma.guildBossSeason.create({
        data: { startDate, endDate }
    });
    return season;
}

const getSeasons = async ({ page, limit }: { page: number, limit: number }) => {
    const seasons = await prisma.guildBossSeason.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { startDate: 'desc' }
    });
    const rowCount = await prisma.guildBossSeason.count();
    return { data: seasons, rowCount };
}

const getGuildBoss = async () => {
    const boss = await prisma.guildBoss.findMany({
        orderBy: { id: 'asc' }
    });
    return boss;
}

export default {
    createGuildBossSeason,
    getSeasons,
    getGuildBoss
};