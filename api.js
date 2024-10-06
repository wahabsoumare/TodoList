export async function fetchJSON(url, options = {}) {
    const headers = {Accep: 'application/json', ...options.headers}
    const results = await fetch(url, {...options, headers})
    if (results.ok) {
        return results.json()
    }
    throw new Error('Erreur serveur', {cause : results})
}