export function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = options.headers || {};
        options.headers['Authorization'] = `Bearer ${token}`;
    } else {
        throw new Error('Token not found');
    }
    return fetch(url, options);
}
