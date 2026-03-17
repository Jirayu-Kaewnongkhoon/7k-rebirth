import { prisma } from "../prisma";

import { getWeekday } from "../utils/date";

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

export default {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
};