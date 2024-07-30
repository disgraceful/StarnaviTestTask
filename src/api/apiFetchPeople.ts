const api = 'https://sw-api.starnavi.io/'

export function fetchPeople() {
  const result = fetch(`${api}/people`)
  return result
}
