import type { EventDeciderMap, ProjectionMap, ReducerMap } from 'revion'
import type { CategoryReadModel } from '../../../shared/read-models'
import type { CategoryCommand, CategoryEvent, CategoryState } from './command'

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
