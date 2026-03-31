import { BASE_URL } from "../constants/api";

const createLeaderboard = async (date: string) => {
    const response = await fetch(`${BASE_URL}/castleLeaderboard`, {
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
    const response = await fetch(`${BASE_URL}/castleLeaderboard/${id}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error('delete leaderboard failed');
    }
    const data = await response.json();
    return data.data;
}

const getLeaderboard = async (date: string) => {
    const response = await fetch(`${BASE_URL}/castleLeaderboard/${date}`);
    if (!response.ok) {
        throw new Error('leaderboard fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
};