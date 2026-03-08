import { prisma } from "../prisma";

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

const getLeaderboards = async () => {
    const result = await prisma.dailyLeaderboard.findMany({
        orderBy: { date: 'asc' },
        include: {
            boss: true,
            _count: { select: { entries: true } }
        },
    });
    return result;
}

export default {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboards,
};