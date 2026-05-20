import type { IPlayer, IPlayerWithStats } from "../types/player";

import { fetchClient } from "../lib/fetch";

const createPlayer = async (playerName: string) => {
    const data = await fetchClient(`player`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName }),
    });
    return data.data;
}

const deletePlayer = async (id: number) => {
    const data = await fetchClient(`player/${id}`, {
        method: "DELETE",
    })
    return data.data;
}

const getPlayer = async (playerId: number): Promise<IPlayerWithStats> => {
    const data = await fetchClient(`player/${playerId}`);
    return data.data;
}

const getPlayers = async (): Promise<IPlayer[]> => {
    const data = await fetchClient(`player`);
    return data.data;
}

export {
    createPlayer,
    deletePlayer,
    getPlayer,
    getPlayers,
};