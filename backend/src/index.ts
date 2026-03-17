import 'dotenv/config';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { prisma } from "./prisma";

// routes
import castleBossRoute from './routes/castleBossRoute';
import castleEntryRoute from './routes/castleEntryRoute';
import castleLeaderboardRoute from './routes/castleLeaderboardRoute';
import guildBossSeasonRoute from './routes/guildBossSeasonRoute';
import playerRoute from './routes/playerRoute';
// import playerBossStatRoute from './routes/playerBossStatRoute';

import { globalErrorHandler } from './middlewares/globalErrorHanlder';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// apply routes
app.use('/castleLeaderboard', castleLeaderboardRoute);
app.use('/castleEntry', castleEntryRoute);
app.use('/player', playerRoute);
app.use('/castleBoss', castleBossRoute);
app.use('/guildBossSeason', guildBossSeasonRoute);
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

// app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
//     console.error(err);
//     res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
// });

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