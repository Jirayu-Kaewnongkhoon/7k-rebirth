import type { Boss } from "../components/LeaderBoardFormDialog/LeaderBoardFormDialog";

const getBoss = async (): Promise<Boss[]> => {
    const response = await fetch('http://localhost:3300/boss');
    if (!response.ok) {
        throw new Error('boss fetch failed');
    }
    const data = await response.json();
    return data.data;
}

export {
    getBoss,
};