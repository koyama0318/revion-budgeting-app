import type { ExpenseReadModel } from '../../../shared/read-models'

export type ExpenseQuery =
  | {
      type: 'expenses'
      sourceType: 'expense'
      payload: { range: { limit: number; offset: number } }
    }
  | {
      type: 'expense'
      sourceType: 'expense'
      payload: { id: string }
    }

export type ExpenseQueryResult =
  | {
      type: 'expenses'
      items: ExpenseReadModel[]
      total: number
    }
  | {
      type: 'expense'
      item: ExpenseReadModel
    }
