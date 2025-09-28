import { createAggregate, type EventDecider, type Reducer } from 'revion'
import type { ExpenseCommand, ExpenseEvent, ExpenseState } from './types/command'
import type { ExpenseDeciderMap, ExpenseReducerMap } from './types/map'
import { deciderMap, reducerMap } from './types/map'

const decider: EventDecider<ExpenseState, ExpenseCommand, ExpenseEvent, ExpenseDeciderMap> = {
  addExpense: ({ command }) => {
    return {
      type: 'expenseAdded',
      id: command.id,
      payload: command.payload
    }
  },
  editExpense: ({ command }) => {
    return {
      type: 'expenseEdited',
      id: command.id,
      payload: command.payload
    }
  },
  deleteExpense: ({ command }) => {
    return {
      type: 'expenseDeleted',
      id: command.id
    }
  }
}

const reducer: Reducer<ExpenseState, ExpenseEvent, ExpenseReducerMap> = {
  expenseAdded: ({ event }) => {
    return {
      type: 'recorded',
      id: event.id,
      amount: event.payload.amount,
      date: event.payload.date,
      categoryId: event.payload.categoryId,
      memo: event.payload.memo
    }
  },
  expenseEdited: ({ state, event }) => {
    state.categoryId = event.payload.categoryId ?? state.categoryId
    state.memo = event.payload.memo ?? state.memo
  },
  expenseDeleted: ({ event }) => {
    return {
      type: 'deleted',
      id: event.id
    }
  }
}

export const expense = createAggregate<ExpenseState, ExpenseCommand, ExpenseEvent>()
  .type('expense')
  .deciderWithMap(decider, deciderMap)
  .reducerWithMap(reducer, reducerMap)
  .build()
