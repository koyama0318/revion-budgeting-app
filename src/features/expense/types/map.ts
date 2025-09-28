import type { EventDeciderMap, ProjectionMap, ReducerMap } from 'revion'
import type { ExpenseReadModel } from '../../../shared/read-models'
import type { ExpenseCommand, ExpenseEvent, ExpenseState } from './command'

export const deciderMap = {
  addExpense: [],
  editExpense: ['recorded'],
  deleteExpense: ['recorded']
} satisfies EventDeciderMap<ExpenseState, ExpenseCommand>

export type ExpenseDeciderMap = typeof deciderMap

export const reducerMap = {
  expenseAdded: [],
  expenseEdited: ['recorded'],
  expenseDeleted: ['recorded']
} satisfies ReducerMap<ExpenseState, ExpenseEvent>

export type ExpenseReducerMap = typeof reducerMap

export const projectionMap = {
  expenseAdded: [{ readModel: 'expense' }],
  expenseEdited: [{ readModel: 'expense' }],
  expenseDeleted: [{ readModel: 'expense' }]
} satisfies ProjectionMap<ExpenseEvent, ExpenseReadModel>

export type ExpenseProjectionMap = typeof projectionMap
