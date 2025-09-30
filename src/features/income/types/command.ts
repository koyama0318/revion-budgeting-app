import type { AggregateId } from 'revion'
import type { CategoryId } from '../../category/types'

export type IncomeId = AggregateId<'income'>

export type IncomeState =
  | {
      type: 'recorded'
      id: IncomeId
      amount: number
      date: Date
      categoryId: CategoryId
      memo?: string
    }
  | { type: 'deleted'; id: IncomeId }

export type IncomeCommand =
  | {
      type: 'addIncome'
      id: IncomeId
      payload: {
        amount: number
        date: Date
        categoryId: CategoryId
        memo?: string
      }
    }
  | {
      type: 'editIncome'
      id: IncomeId
      payload: {
        categoryId: CategoryId
        memo?: string
      }
    }
  | { type: 'deleteIncome'; id: IncomeId }

export type IncomeEvent =
  | {
      type: 'incomeAdded'
      id: IncomeId
      payload: { amount: number; date: Date; categoryId: CategoryId; memo?: string }
    }
  | {
      type: 'incomeEdited'
      id: IncomeId
      payload: { categoryId?: CategoryId; memo?: string }
    }
  | {
      type: 'incomeDeleted'
      id: IncomeId
      payload: { date: Date; categoryId: CategoryId; amount: number }
    }
