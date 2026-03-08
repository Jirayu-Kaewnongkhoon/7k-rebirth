import { prisma } from "../prisma";
import { NotFoundError } from "../models/errors";

const createPlayer = async (playerName: string) => {
    const player = await prisma.player.create({
        data: { name: playerName }
    });
    return player;
}

const deletePlayer = async (id: number) => {
    const player = await prisma.player.update({
        where: { id },
        data: {
            isActive: false,
            leavedAt: new Date(),
        }
    });

    return player;
}

const getPlayer = async (id: number) => {
    const player = await prisma.player.findUnique({
        where: { id },
        include: {
            stats: {
                include: { boss: true },
                orderBy: {
                    boss: {
                        weekday: 'asc'
                    }
                }
            },
        }
    });

    if (!player) throw new NotFoundError('Player not found');

    return player;
}

const getPlayers = async () => {
    const players = await prisma.player.findMany({
        where: { isActive: true }
    });
    return players;
}

export default {
    createPlayer,
    deletePlayer,
    getPlayer,
    getPlayers,
};