import { fetchClient } from "../lib/fetch";

const createGuildBossSeason = async (startDate: string) => {
    const data = await fetchClient(`guildBossSeason`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate }),
    });
    return data.data;
}

const getSeasons = async (page: number, limit: number) => {
    const data = await fetchClient(`guildBossSeason?page=${page}&limit=${limit}`);
    return data.data;
}

const getSeason = async (seasonId: number) => {
    const data = await fetchClient(`guildBossSeason/${seasonId}`);
    return data.data;
}

const getGuildBoss = async () => {
    const data = await fetchClient(`guildBoss`);
    return data.data;
}

export {
    createGuildBossSeason,
    getSeasons,
    getSeason,
    getGuildBoss,
};