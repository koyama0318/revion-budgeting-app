import type { EventDeciderMap, ProjectionMap, ReducerMap } from 'revion'
import type { IncomeReadModel, MonthlyReportReadModel } from '../../../shared/read-models'
import { yearMonth } from '../../../shared/value-objects/year-month'
import type { IncomeCommand, IncomeEvent, IncomeState } from './command'

export const deciderMap = {
  addIncome: [],
  editIncome: ['recorded'],
  deleteIncome: ['recorded']
} satisfies EventDeciderMap<IncomeState, IncomeCommand>

export type IncomeDeciderMap = typeof deciderMap

export const reducerMap = {
  incomeAdded: [],
  incomeEdited: ['recorded'],
  incomeDeleted: ['recorded']
} satisfies ReducerMap<IncomeState, IncomeEvent>

export type IncomeReducerMap = typeof reducerMap

export type IncomeProjections = IncomeReadModel | MonthlyReportReadModel

export const projectionMap = {
  incomeAdded: [
    { readModel: 'income' },
    {
      readModel: 'monthlyReport',
      where: event => ({ by: 'month', operator: 'eq', value: yearMonth(event.payload.date) ?? '' }),
      mode: 'upsert'
    }
  ],
  incomeEdited: [{ readModel: 'income' }],
  incomeDeleted: [
    { readModel: 'income' },
    {
      readModel: 'monthlyReport',
      where: event => ({ by: 'month', operator: 'eq', value: yearMonth(event.payload.date) ?? '' }),
      mode: 'update'
    }
  ]
} satisfies ProjectionMap<IncomeEvent, IncomeProjections>

export type IncomeProjectionMap = typeof projectionMap
