import { fetchClient } from "../lib/fetch";

const getBoss = async () => {
    const data = await fetchClient(`castleBoss`);
    return data.data;
}

export {
    getBoss,
};