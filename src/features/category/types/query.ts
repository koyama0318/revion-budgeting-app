import type { CategoryReadModel } from '../../../shared/read-models'

export type CategoryQuery =
  | {
      type: 'categories'
      sourceType: 'category'
      payload: { range: { limit: number; offset: number } }
    }
  | {
      type: 'category'
      sourceType: 'category'
      payload: { id: string }
    }

export type CategoryQueryResult =
  | {
      type: 'categories'
      items: CategoryReadModel[]
      total: number
    }
  | {
      type: 'category'
      item: CategoryReadModel
    }
