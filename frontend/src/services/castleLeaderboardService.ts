const createLeaderboard = async (date: string) => {
    const response = await fetch("http://localhost:3300/castleLeaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
    })
    if (!response.ok) {
        throw new Error('create leaderboard failed');
    }
    const data = await response.json();
    return data.data;
}

const deleteLeaderboard = async (id: number) => {
    const response = await fetch(`http://localhost:3300/castleLeaderboard/${id}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error('delete leaderboard failed');
    }
    const data = await response.json();
    return data.data;
}

const getLeaderboard = async (date: string) => {
    const response = await fetch(`http://localhost:3300/castleLeaderboard/${date}`);
    if (!response.ok) {
        throw new Error('leaderboard fetch failed');
    }
    const data = await response.json();
    return data.data;
}

const getLeaderboards = async (page: number) => {
    const response = await fetch('http://localhost:3300/castleLeaderboard?page=' + page);
    if (!response.ok) {
        throw new Error('leaderboard fetch failed');
    }
    const data = await response.json();
    return data.data;
}

const getLeaderboardPageCount = async () => {
    const response = await fetch('http://localhost:3300/castleLeaderboard/count');
    if (!response.ok) {
        throw new Error('leaderboard page count fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
    getLeaderboards,
    getLeaderboardPageCount,
};