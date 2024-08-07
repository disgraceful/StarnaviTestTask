const api = 'https://sw-api.starnavi.io/'

export function fetchStarships({ id }: { id: number }) {
    const result = fetch(`${api}/starships/${id}`, {
        mode: 'no-cors'
    })
    return result
}