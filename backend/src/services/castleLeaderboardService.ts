import { prisma } from "../prisma";

import { getWeekday, getWeekRange } from "../utils/date";

const createLeaderboard = async (date: string) => {
    const weekday = getWeekday(date);

    const result = await prisma.castleLeaderboard.create({
        data: {
            date: new Date(date),
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

const getLeaderboards = async (page: number) => {
    const { start, nextWeek } = getWeekRange(page);

    const leaderboards = await prisma.castleLeaderboard.findMany({
        where: {
            date: {
                gte: start,
                lt: nextWeek,
            }
        },
        orderBy: { date: 'asc' },
        include: {
            boss: true,
            _count: { select: { entries: true } }
        },
    });
    return leaderboards;
}

const getLeaderboardPageCount = async () => {
    const rowCount = await prisma.castleLeaderboard.count();
    return Math.ceil(rowCount / 7);
}

export default {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
    getLeaderboards,
    getLeaderboardPageCount,
};