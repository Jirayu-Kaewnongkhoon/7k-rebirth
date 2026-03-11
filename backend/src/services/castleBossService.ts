import { prisma } from "../prisma";

const getBoss = async () => {
    const boss = await prisma.castleBoss.findMany();
    return boss;
}

export default {
    getBoss
};