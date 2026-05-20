import { BASE_URL } from "../constants/api";

import { fetchClient } from "../lib/fetch";

const fetchMe = async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
};

const fetchLogin = async (username: string, password: string) => {
    const data = await fetchClient(`auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return data.data;
};

const fetchLogout = async () => {
    const data = await fetchClient(`auth/logout`, {
        method: 'POST',
    });
    return data.data;
};

export {
    fetchMe,
    fetchLogin,
    fetchLogout,
};