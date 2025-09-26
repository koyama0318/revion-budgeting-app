import { createAggregate, type EventDecider, type Reducer } from 'revion'
import {
  type CategoryCommand,
  type CategoryDeciderMap,
  type CategoryEvent,
  type CategoryReducerMap,
  type CategoryState,
  deciderMap,
  reducerMap
} from './types'

const decider: EventDecider<CategoryState, CategoryCommand, CategoryEvent, CategoryDeciderMap> = {
  addCategory: ({ command }) => {
    return {
      type: 'categoryAdded',
      id: command.id,
      payload: { name: command.name }
    }
  },
  editCategory: ({ command }) => {
    return {
      type: 'categoryEdited',
      id: command.id,
      payload: { name: command.name }
    }
  },
  deleteCategory: ({ command }) => {
    return {
      type: 'categoryDeleted',
      id: command.id
    }
  }
}

const reducer: Reducer<CategoryState, CategoryEvent, CategoryReducerMap> = {
  categoryAdded: ({ event }) => {
    return {
      type: 'active',
      id: event.id,
      name: event.payload.name
    }
  },
  categoryEdited: ({ state, event }) => {
    state.name = event.payload.name ?? state.name
  },
  categoryDeleted: ({ event }) => {
    return {
      type: 'inactive',
      id: event.id
    }
  }
}

export const category = createAggregate<CategoryState, CategoryCommand, CategoryEvent>()
  .type('category')
  .deciderWithMap(decider, deciderMap)
  .reducerWithMap(reducer, reducerMap)
  .build()
