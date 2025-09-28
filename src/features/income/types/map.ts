import type { EventDeciderMap, ReducerMap } from 'revion'
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
