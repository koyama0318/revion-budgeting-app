import type { EventDeciderMap, ProjectionMap, ReducerMap } from 'revion'
import type { ExpenseReadModel, MonthlyReportReadModel } from '../../../shared/read-models'
import { yearMonth } from '../../../shared/value-objects/year-month'
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

export type ExpenseProjections = ExpenseReadModel | MonthlyReportReadModel

export const projectionMap = {
  expenseAdded: [
    { readModel: 'expense' },
    {
      readModel: 'monthlyReport',
      where: event => ({ by: 'month', operator: 'eq', value: yearMonth(event.payload.date) ?? '' })
    }
  ],
  expenseEdited: [{ readModel: 'expense' }],
  expenseDeleted: [
    { readModel: 'expense' },
    {
      readModel: 'monthlyReport',
      where: event => ({ by: 'month', operator: 'eq', value: yearMonth(event.payload.date) ?? '' }),
      mode: 'update'
    }
  ]
} satisfies ProjectionMap<ExpenseEvent, ExpenseProjections>

export type ExpenseProjectionMap = typeof projectionMap
