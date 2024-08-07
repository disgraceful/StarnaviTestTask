import axios from './axios'

export async function fetchPeople({ id, page = 1 }: { id?: number; page?: number }) {
  const result = await axios.get(`people/${id ?? ''}?page=${page}`)
  return result.data
}
