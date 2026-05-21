import 'dotenv/config';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { prisma } from "./prisma";
import { setGlobalOptions } from 'express-zod-safe';

// routes
import authRoute from './routes/authRoute';
import castleBossRoute from './routes/castleBossRoute';
import castleEntryRoute from './routes/castleEntryRoute';
import castleLeaderboardRoute from './routes/castleLeaderboardRoute';
import guildBossRoute from './routes/guildBossRoute';
import guildBossSeasonRoute from './routes/guildBossSeasonRoute';
import guildBossEntryRoute from './routes/guildBossEntryRoute';
import playerRoute from './routes/playerRoute';
// import playerBossStatRoute from './routes/playerBossStatRoute';

import { globalErrorHandler } from './middlewares/globalErrorHanlder';
import { authMiddleware } from './middlewares/auth';

import { BadRequest } from './models/errors';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ 
    credentials: true, 
    origin: process.env.CORS_ORIGIN?.split(',') ?? [],
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setGlobalOptions({
    handler: (errors, _req, _res, next) => {
        next(new BadRequest(errors.map(e => e.errors.issues.map(i => i.message).join(', ')).join(', ')));
    }
});

// apply routes
app.use('/auth', authRoute);
app.use('/castleLeaderboard', authMiddleware, castleLeaderboardRoute);
app.use('/castleEntry', authMiddleware, castleEntryRoute);
app.use('/player', authMiddleware, playerRoute);
app.use('/castleBoss', authMiddleware, castleBossRoute);
app.use('/guildBossSeason', authMiddleware, guildBossSeasonRoute);
app.use('/guildBoss', authMiddleware, guildBossRoute);
app.use('/guildBossEntry', authMiddleware, guildBossEntryRoute);
// TODO: remove /playerBossState route
// app.use('/playerBossStat', playerBossStatRoute);

app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'API is running' });
});

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});

app.use(globalErrorHandler);

const port = Number(process.env.PORT) || 3300;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const gracefulShutdown = async () => {
    console.log('Shutting down...');
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);