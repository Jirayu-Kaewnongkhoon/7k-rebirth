import { fetchClient } from "../lib/fetch";

const getPlayerBossStat = async (playerId: number) => {
    const data = await fetchClient(`playerBossStat/${playerId}`);
    return data.data;
}

export {
    getPlayerBossStat
};

// TODO: remove unused service