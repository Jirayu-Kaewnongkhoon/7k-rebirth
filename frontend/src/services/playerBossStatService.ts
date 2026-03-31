import { BASE_URL } from "../constants/api";

const getPlayerBossStat = async (playerId: number) => {
    const response = await fetch(`${BASE_URL}/playerBossStat/${playerId}`);
    if (!response.ok) {
        throw new Error('player stat fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    getPlayerBossStat
};