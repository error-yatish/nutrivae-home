// For client-side auth, we hardcode the URL or use PUBLIC_ env vars
const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337';

export async function login(identifier, password) {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (res.ok && data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
}

export async function register(username, email, password) {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok && data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
}

export async function getUser(jwt) {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` }
    });
    if (res.ok) {
        return await res.json();
    }
    return null;
}

export function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
}
