import type { Player } from "../pages/EntryView/EntyView";

const createPlayer = async (playerName: string) => {
    const response = await fetch('http://localhost:3300/player', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName }),
    });
    if (!response.ok) {
        throw new Error('player creation failed');
    }
    const data = await response.json();
    return data.data;
}

const deletePlayer = async (id: number) => {
    const response = await fetch(`http://localhost:3300/player/${id}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error('delete player failed');
    }
    const data = await response.json();
    return data.data;
}

const getPlayer = async (playerId: number): Promise<Player> => {
    const response = await fetch(`http://localhost:3300/player/${playerId}`);
    if (!response.ok) {
        throw new Error('player fetch failed');
    }
    const data = await response.json();
    return data.data;
}

const getPlayers = async (): Promise<Player[]> => {
    const response = await fetch('http://localhost:3300/player');
    if (!response.ok) {
        throw new Error('players fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    createPlayer,
    deletePlayer,
    getPlayer,
    getPlayers,
};