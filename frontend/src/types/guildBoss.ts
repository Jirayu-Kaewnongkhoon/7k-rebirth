import type { IPlayer } from "./player";

export interface IGuildBoss {
    id: number
    name: string
}

export interface IGuildBossSeason {
    id: number
    startDate: string
    endDate: string
}

export interface IGuildBossEntry {
    id: number
    player: IPlayer
    boss: IGuildBoss
    score: number
    hits: number
}