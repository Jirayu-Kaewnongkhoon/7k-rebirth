import type { IPlayer } from "./player";

export interface ICastleBoss {
    id: number
    name: string
}

export interface ICastleLeaderBoard {
    id: number;
    boss: ICastleBoss
    date: string;
}

export interface ICastleEntry {
    id: number;
    player: IPlayer;
    score: number;
    state: string;
}

export interface ILeaderboardEvent {
    id: number;
    date: string;
    _count: {
        entries: number;
    };
}

export interface ICastleEntryWithLeaderboard extends ICastleEntry {
    leaderboard: ICastleLeaderBoard;
}