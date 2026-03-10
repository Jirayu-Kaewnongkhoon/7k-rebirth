import type { LeaderBoardFormData } from "../components/LeaderBoardFormDialog/LeaderBoardFormDialog";

const createLeaderboard = async (leaderboardData: LeaderBoardFormData) => {
    const response = await fetch("http://localhost:3300/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaderboardData),
    })
    if (!response.ok) {
        throw new Error('delete leaderboard failed');
    }
    const data = await response.json();
    return data.data;
}

const deleteLeaderboard = async (id: number) => {
    const response = await fetch(`http://localhost:3300/leaderboard/${id}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error('delete leaderboard failed');
    }
    const data = await response.json();
    return data.data;
}

const getLeaderboards = async (page: number) => {
    const response = await fetch('http://localhost:3300/leaderboard?page=' + page);
    if (!response.ok) {
        throw new Error('leaderboard fetch failed');
    }
    const data = await response.json();
    return data.data;
}

const getLeaderboardPageCount = async () => {
    const response = await fetch('http://localhost:3300/leaderboard/count');
    if (!response.ok) {
        throw new Error('leaderboard page count fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboards,
    getLeaderboardPageCount,
};