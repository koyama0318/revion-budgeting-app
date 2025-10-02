import type { AggregateId } from 'revion'
import type { CategoryId } from '../../category/types'

export type ExpenseId = AggregateId<'expense'>

export type ExpenseState =
  | {
      type: 'recorded'
      id: ExpenseId
      amount: number
      date: Date
      categoryId: CategoryId
      memo?: string
    }
  | { type: 'deleted'; id: ExpenseId }

export type ExpenseCommand =
  | {
      type: 'addExpense'
      id: ExpenseId
      payload: {
        amount: number
        date: Date
        categoryId: CategoryId
        memo?: string
      }
    }
  | {
      type: 'editExpense'
      id: ExpenseId
      payload: {
        categoryId: CategoryId
        memo?: string
      }
    }
  | { type: 'deleteExpense'; id: ExpenseId }

export type ExpenseEvent =
  | {
      type: 'expenseAdded'
      id: ExpenseId
      payload: { amount: number; date: Date; categoryId: CategoryId; memo?: string }
    }
  | {
      type: 'expenseEdited'
      id: ExpenseId
      payload: { categoryId?: CategoryId; memo?: string }
    }
  | {
      type: 'expenseDeleted'
      id: ExpenseId
      payload: { date: Date; categoryId: CategoryId; amount: number }
    }
