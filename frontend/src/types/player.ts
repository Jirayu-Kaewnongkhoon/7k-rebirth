import type { ICastleBoss } from "./castle";

export interface IPlayer {
    id: number;
    name: string;
    isActive: boolean;
}

export interface IPlayerBossStats {
    id: number
    playerId: number
    bossId: number
    boss: ICastleBoss
    maxScore: number
    lastScore: number
}

export interface IPlayerWithStats extends IPlayer {
    stats: IPlayerBossStats[]
}