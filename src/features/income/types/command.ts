import type { AggregateId } from 'revion'

export type IncomeId = AggregateId<'income'>

export type IncomeState =
  | {
      type: 'recorded'
      id: IncomeId
      amount: number
      date: string
      categoryId: string
      memo?: string
    }
  | { type: 'deleted'; id: IncomeId }

export type IncomeCommand =
  | {
      type: 'addIncome'
      id: IncomeId
      payload: {
        amount: number
        date: string
        categoryId: string
        memo?: string
      }
    }
  | {
      type: 'editIncome'
      id: IncomeId
      payload: {
        categoryId: string
        memo?: string
      }
    }
  | { type: 'deleteIncome'; id: IncomeId }

export type IncomeEvent =
  | {
      type: 'incomeAdded'
      id: IncomeId
      payload: { amount: number; date: string; categoryId: string; memo?: string }
    }
  | {
      type: 'incomeEdited'
      id: IncomeId
      payload: { categoryId?: string; memo?: string }
    }
  | { type: 'incomeDeleted'; id: IncomeId }
