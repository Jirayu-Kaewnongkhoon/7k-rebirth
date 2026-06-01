import { prisma } from "../prisma";

import { getWeekday } from "../utils/date";

const createLeaderboard = async (date: Date) => {
    const weekday = getWeekday(date);

    const result = await prisma.castleLeaderboard.create({
        data: {
            date,
            boss: {
                connect: { weekday }
            }
        }
    });

    return result;
}

const deleteLeaderboard = async (id: number) => {
    const result = await prisma.castleLeaderboard.delete({ where: { id } });
    return result;
}

const getLeaderboard = async (date: Date) => {
    const leaderboard = await prisma.castleLeaderboard.findFirst({
        where: { date },
        include: { boss: true },
    });
    return leaderboard;
}

const getLeaderboards = async (start: Date, end: Date) => {
    const leaderboards = await prisma.castleLeaderboard.findMany({
        where: {
            date: {
                gte: start,
                lt: end
            }
        },
        select: {
            id: true,
            date: true,
            _count: {
                select: { entries: true }
            },
        },
    });
    return leaderboards;
}

export default {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
    getLeaderboards,
};