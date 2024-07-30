const api = 'https://sw-api.starnavi.io/'

export function fetchPeople({ id, page = 1 }: { id?: number; page?: number }) {
  const result = fetch(`${api}/people/${id ?? ''}?page=${page}`)
  return result
}
