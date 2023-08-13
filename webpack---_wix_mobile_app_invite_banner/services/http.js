export async function fetchAsync({
    method,
    url,
    body,
    headers
}) {
    const res = await fetch(url, {
        method,
        body,
        headers
    });
    try {
        return await res.json();
    } catch (error) {
        console.error(error);
        return res;
    }
}