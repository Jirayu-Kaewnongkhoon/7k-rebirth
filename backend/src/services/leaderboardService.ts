import { prisma } from "../prisma";

import { getWeekRange } from "../utils/date";

interface Leaderboard {
    date: Date;
    bossId: number;
}

const createLeaderboard = async (leaderboardData: Leaderboard) => {
    const result = await prisma.dailyLeaderboard.create({
        data: {
            ...leaderboardData,
            date: new Date(leaderboardData.date),
        }
    });
    return result;
}

const deleteLeaderboard = async (id: number) => {
    const result = await prisma.dailyLeaderboard.delete({ where: { id } });
    return result;
}

const getLeaderboards = async (page: number) => {
    const { start, nextWeek } = getWeekRange(page);

    const leaderboards = await prisma.dailyLeaderboard.findMany({
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
    const rowCount = await prisma.dailyLeaderboard.count();
    return Math.ceil(rowCount / 7);
}

export default {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboards,
    getLeaderboardPageCount,
};