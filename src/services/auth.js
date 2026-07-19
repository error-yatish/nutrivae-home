// For client-side auth, we read from window.STRAPI_URL or fallback
const STRAPI_URL = (typeof window !== 'undefined' && window.STRAPI_URL) || import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337';

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

export async function checkIsAdmin(jwt) {
    try {
        const res = await fetch(`${STRAPI_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: {} })
        });
        // If 403, they definitely lack permission.
        if (res.status === 403) return false;
        // If 400 (validation error) or 200, they have permission!
        return true;
    } catch(err) {
        return false;
    }
}

export function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
}

export async function getUserOrders(jwt) {
    const res = await fetch(`${STRAPI_URL}/api/orders?sort=createdAt:desc`, {
        headers: { Authorization: `Bearer ${jwt}` }
    });
    if (res.ok) {
        return await res.json();
    }
    return null;
}

