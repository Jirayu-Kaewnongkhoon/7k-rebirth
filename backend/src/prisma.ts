import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, STATE } from "./generated/prisma/client";

const connectionString = `${process.env.POSTGRES_PRISMA_URL}`;

const adapter = new PrismaPg({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
const prisma = new PrismaClient({ adapter });

export { prisma, STATE };
