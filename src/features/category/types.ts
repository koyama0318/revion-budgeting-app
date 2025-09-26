import type { AggregateId, EventDeciderMap, ProjectionMap, ReducerMap } from 'revion'
import type { CategoryReadModel } from '../../shared/read-models/category-read-model'

export type CategoryId = AggregateId<'category'>

export type CategoryState =
  | {
      type: 'active'
      id: CategoryId
      name: string
    }
  | { type: 'inactive'; id: CategoryId }

export type CategoryCommand =
  | {
      type: 'addCategory'
      id: CategoryId
      name: string
    }
  | { type: 'editCategory'; id: CategoryId; name?: string }
  | { type: 'deleteCategory'; id: CategoryId }

export type CategoryEvent =
  | {
      type: 'categoryAdded'
      id: CategoryId
      payload: {
        name: string
      }
    }
  | {
      type: 'categoryEdited'
      id: CategoryId
      payload: {
        name?: string
      }
    }
  | { type: 'categoryDeleted'; id: CategoryId }

export const deciderMap = {
  addCategory: [],
  editCategory: ['active'],
  deleteCategory: ['active']
} satisfies EventDeciderMap<CategoryState, CategoryCommand>

export type CategoryDeciderMap = typeof deciderMap

export const reducerMap = {
  categoryAdded: [],
  categoryEdited: ['active'],
  categoryDeleted: ['active']
} satisfies ReducerMap<CategoryState, CategoryEvent>

export type CategoryReducerMap = typeof reducerMap

export const projectionMap = {
  categoryAdded: [{ readModel: 'category' }],
  categoryEdited: [{ readModel: 'category' }],
  categoryDeleted: [{ readModel: 'category' }]
} satisfies ProjectionMap<CategoryEvent, CategoryReadModel>

export type CategoryProjectionMap = typeof projectionMap
