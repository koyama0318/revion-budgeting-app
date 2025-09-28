import type { EventDeciderMap, ProjectionMap, ReducerMap } from 'revion'
import type { IncomeReadModel } from '../../../shared/read-models'
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

export const projectionMap = {
  incomeAdded: [{ readModel: 'income' }],
  incomeEdited: [{ readModel: 'income' }],
  incomeDeleted: [{ readModel: 'income' }]
} satisfies ProjectionMap<IncomeEvent, IncomeReadModel>

export type IncomeProjectionMap = typeof projectionMap
