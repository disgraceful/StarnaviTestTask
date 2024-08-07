const api = 'https://sw-api.starnavi.io/'

export function fetchMovie({ id }: { id: number }) {
  const result = fetch(`${api}/films/${id}`)
  return result
}
