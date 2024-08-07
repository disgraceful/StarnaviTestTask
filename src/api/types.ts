type EntityAPIResult = {
  id: number
  name: string
  [key: string]: any
}

type APIResult = {
  count: number
  next: string | null
  previous: string | null
  results: EntityAPIResult[]
}

export type { EntityAPIResult, APIResult }
