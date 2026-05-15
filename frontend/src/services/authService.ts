import { BASE_URL } from "../constants/api";

const fetchMe = async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
};

const fetchLogin = async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

const fetchLogout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });
};

export {
    fetchMe,
    fetchLogin,
    fetchLogout,
};