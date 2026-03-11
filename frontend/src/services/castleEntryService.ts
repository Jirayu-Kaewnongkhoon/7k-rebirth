interface EntryData {
    leaderboardId: number;
    entries: {
        playerId: number | null;
        score: number;
    }[];
}

const createEntries = async (entryData: EntryData) => {
    const response = await fetch('http://localhost:3300/castleEntry', {
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
    const response = await fetch('http://localhost:3300/castleEntry/json', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Upload failed');
    }
    const data = await response.json();
    return data.data;
}

const getEntries = async (leaderboardId: string) => {
    const response = await fetch(`http://localhost:3300/castleEntry/${leaderboardId}`);
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