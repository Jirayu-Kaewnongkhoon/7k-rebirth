import { prisma } from "../prisma";

const getBoss = async () => {
    const boss = await prisma.guildBoss.findMany({
        orderBy: { id: 'asc' }
    });
    return boss;
}

export default {
    getBoss
};