import { error } from 'console'
import axios from './axios'

export function fetchMovie({ id }: { id: number }) {
  return axios.get(`films/${id}`).catch((error) => {
    error.toJSON()
  })
}
