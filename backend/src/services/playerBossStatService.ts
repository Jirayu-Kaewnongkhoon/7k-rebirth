import { prisma } from "../prisma";
import { NotFoundError } from "../models/errors";

const getPlayerBossStat = async (id: number) => {
    const stat = await prisma.playerBossStat.findFirst({
        where: { playerId: id }
    });

    if (!stat) throw new NotFoundError('PlayerBossStat not found');

    return stat;
}

export default {
    getPlayerBossStat,
};