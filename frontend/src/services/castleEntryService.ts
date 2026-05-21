import { BASE_URL } from "../constants/api";

import { fetchClient } from "../lib/fetch";

interface EntryData {
    leaderboardId: number;
    entries: {
        playerId: number;
        score: number;
    }[];
}

const createEntries = async (entryData: EntryData) => {
    const data = await fetchClient(`castleEntry`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
    });
    return data.data;
}

const downloadJsonTemplate = async (leaderboardId: number) => {
    const response = await fetch(`${BASE_URL}/castleEntry/json/${leaderboardId}`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Download failed');
    }
    const blob = await response.blob();
    return blob;
}

const getEntries = async (leaderboardId: number) => {
    const data = await fetchClient(`castleEntry/${leaderboardId}`);
    return data.data;
}

export {
    createEntries,
    downloadJsonTemplate,
    getEntries,
};