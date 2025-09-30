import { createAggregate, type EventDecider, type Reducer } from 'revion'
import type { IncomeCommand, IncomeEvent, IncomeState } from './types/command'
import type { IncomeDeciderMap, IncomeReducerMap } from './types/map'
import { deciderMap, reducerMap } from './types/map'

const decider: EventDecider<IncomeState, IncomeCommand, IncomeEvent, IncomeDeciderMap> = {
  addIncome: ({ command }) => {
    return {
      type: 'incomeAdded',
      id: command.id,
      payload: command.payload
    }
  },
  editIncome: ({ command }) => {
    return {
      type: 'incomeEdited',
      id: command.id,
      payload: command.payload
    }
  },
  deleteIncome: ({ state, command }) => {
    return {
      type: 'incomeDeleted',
      id: command.id,
      payload: {
        date: state.date,
        categoryId: state.categoryId,
        amount: state.amount
      }
    }
  }
}

const reducer: Reducer<IncomeState, IncomeEvent, IncomeReducerMap> = {
  incomeAdded: ({ event }) => {
    return {
      type: 'recorded',
      id: event.id,
      amount: event.payload.amount,
      date: event.payload.date,
      categoryId: event.payload.categoryId,
      memo: event.payload.memo
    }
  },
  incomeEdited: ({ state, event }) => {
    state.categoryId = event.payload.categoryId ?? state.categoryId
    state.memo = event.payload.memo ?? state.memo
  },
  incomeDeleted: ({ event }) => {
    return {
      type: 'deleted',
      id: event.id
    }
  }
}

export const income = createAggregate<IncomeState, IncomeCommand, IncomeEvent>()
  .type('income')
  .deciderWithMap(decider, deciderMap)
  .reducerWithMap(reducer, reducerMap)
  .build()
