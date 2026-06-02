import { fetchClient } from "../lib/fetch";

interface EntryData {
    seasonId: number;
    bossId: number;
    entries: {
        playerId: number;
        score: number;
        hits: number
    }[];
}

const createEntries = async (entryData: EntryData) => {
    const data = await fetchClient(`guildBossEntry`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
    });
    return data.data;
}

const getEntries = async (seasonId: number, bossId: number) => {
    const data = await fetchClient(`guildBossEntry?seasonId=${seasonId}&bossId=${bossId}`);
    return data.data;
}

const getEntriesByPlayer = async (playerId: number, bossId: number) => {
    const data = await fetchClient(`guildBossEntry/player/${playerId}/boss/${bossId}`);
    return data.data;
}

const getHitsSummary = async (seasonId: number) => {
    const data = await fetchClient(`guildBossEntry/hits?seasonId=${seasonId}`);
    return data.data;
}

export {
    createEntries,
    getEntries,
    getEntriesByPlayer,
    getHitsSummary,
};