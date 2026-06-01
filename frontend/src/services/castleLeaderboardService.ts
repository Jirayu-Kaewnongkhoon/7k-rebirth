import { fetchClient } from "../lib/fetch";

const createLeaderboard = async (date: string) => {
    const data = await fetchClient(`castleLeaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
    })
    return data.data;
}

const deleteLeaderboard = async (id: number) => {
    const data = await fetchClient(`castleLeaderboard/${id}`, {
        method: "DELETE",
    });
    return data.data;
}

const getLeaderboard = async (date: string) => {
    const data = await fetchClient(`castleLeaderboard/${date}`);
    return data.data;
}

const getLeaderboards = async ({ start, end }: { start: string; end: string }) => {
    const data = await fetchClient(`castleLeaderboard/all?start=${start}&end=${end}`);
    return data.data;
}

export {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
    getLeaderboards
};