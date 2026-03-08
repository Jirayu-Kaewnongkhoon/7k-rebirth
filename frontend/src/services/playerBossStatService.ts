
const getPlayerBossStat = async (playerId: number) => {
    const response = await fetch(`http://localhost:3300/playerBossStat/${playerId}`);
    if (!response.ok) {
        throw new Error('player stat fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    getPlayerBossStat
};