import { prisma } from "../src/prisma";

async function main() {
    await createBoss();
    await createPlayer();
}

const createBoss = async () => {
    const bosses = [
        { name: "ลูดี้", weekday: 0 },     // Monday
        { name: "ไอลีน", weekday: 1 },     // Tuesday
        { name: "ราเชล", weekday: 2 },     // Wednesday
        { name: "เดลโลนส์", weekday: 3 },  // Thursday
        { name: "เจฟ", weekday: 4 },       // Friday
        { name: "สไปค์", weekday: 5 },     // Saturday
        { name: "คริส", weekday: 6 },     // Sunday
    ];

    for (const boss of bosses) {
        await prisma.boss.upsert({
            where: { weekday: boss.weekday },
            update: { name: boss.name },
            create: boss,
        });
    }

    console.log("✅ Bosses seeded successfully");
}

const createPlayer = async () => {
    const players = [
        { name: "MerzZ" },
        { name: "Knot" },
        { name: "Saturn48" },
    ];

    await prisma.player.createMany({ data: players });

    console.log("✅ Players seeded successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });