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

const getSeasons = async () => {
    const seasons = await prisma.guildBossSeason.findMany({
        orderBy: { startDate: 'desc' }
    });
    return seasons;
}

export default {
    createGuildBossSeason,
    getSeasons,
};