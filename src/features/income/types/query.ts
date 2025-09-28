import type { IncomeReadModel } from '../../../shared/read-models'

export type IncomeQuery =
  | {
      type: 'incomes'
      sourceType: 'income'
      payload: { range: { limit: number; offset: number } }
    }
  | {
      type: 'income'
      sourceType: 'income'
      payload: { id: string }
    }

export type IncomeQueryResult =
  | {
      type: 'incomes'
      items: IncomeReadModel[]
      total: number
    }
  | {
      type: 'income'
      item: IncomeReadModel
    }
