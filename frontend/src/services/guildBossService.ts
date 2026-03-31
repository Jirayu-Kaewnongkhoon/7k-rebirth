const createGuildBossSeason = async (startDate: string) => {
    const response = await fetch('http://localhost:3300/guildBossSeason', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate }),
    });
    if (!response.ok) {
        throw new Error('guildboss creation failed');
    }
    const data = await response.json();
    return data.data;
}

const getSeasons = async (page: number, limit: number) => {
    const response = await fetch(`http://localhost:3300/guildBossSeason?page=${page}&limit=${limit}`);
    if (!response.ok) {
        throw new Error('seasons fetch failed');
    }
    const data = await response.json();
    return data.data;
}

const getSeason = async (seasonId: number) => {
    const response = await fetch(`http://localhost:3300/guildBossSeason/${seasonId}`);
    if (!response.ok) {
        throw new Error('seasons fetch failed');
    }
    const data = await response.json();
    return data.data;
}

const getGuildBoss = async () => {
    const response = await fetch('http://localhost:3300/guildBoss');
    if (!response.ok) {
        throw new Error('boss fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    createGuildBossSeason,
    getSeasons,
    getSeason,
    getGuildBoss,
};