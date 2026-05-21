import { BASE_URL } from "../constants/api";

export const fetchClient = async (url: string, options?: RequestInit) => {
    const res = await fetch(`${BASE_URL}/${url}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Something went wrong');
    }

    return res.json();
};