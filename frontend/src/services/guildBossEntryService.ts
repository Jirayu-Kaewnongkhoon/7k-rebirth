import { BASE_URL } from "../constants/api";

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
    const response = await fetch(`${BASE_URL}/guildBossEntry`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
    });
    if (!response.ok) {
        throw new Error('entry creation failed');
    }
    const data = await response.json();
    return data.data;
}

const createEntriesJson = async (formData: FormData) => {
    const response = await fetch(`${BASE_URL}/guildBossEntry/json`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Upload failed');
    }
    const data = await response.json();
    return data.data;
}

const getEntries = async (seasonId: number, bossId: number) => {
    const response = await fetch(`${BASE_URL}/guildBossEntry?seasonId=${seasonId}&bossId=${bossId}`);
    if (!response.ok) {
        throw new Error('entry fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    createEntries,
    createEntriesJson,
    getEntries,
};