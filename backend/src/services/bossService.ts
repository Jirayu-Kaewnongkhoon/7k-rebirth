import { prisma } from "../prisma";

const getBoss = async () => {
    const boss = await prisma.boss.findMany();
    return boss;
}

export default {
    getBoss
};