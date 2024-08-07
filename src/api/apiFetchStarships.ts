import axios from './axios'

export async function fetchStarships({ id }: { id: number }) {
  const result = await axios.get(`starships/${id}`)
  return result.data
}
