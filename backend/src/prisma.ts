import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, STATE } from "./generated/prisma/client";
import pg from "pg";

const connectionString = `${process.env.POSTGRES_PRISMA_URL}`;

const pool = new pg.Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma, STATE };
